<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    private const MOBILE_METHODS = ['wave', 'orange', 'mtn', 'moov'];

    /**
     * POST /api/v1/payments/initiate
     * Mobile Money (Wave, Orange Money, MTN MoMo, Moov Money) via CinetPay :
     * la passerelle pousse une demande USSD sur le téléphone du client.
     */
    public function initiateMobile(Request $request): JsonResponse
    {
        $data = Validator::make($request->all(), [
            'reference' => 'required|exists:reservations,reference',
            'method' => 'required|in:'.implode(',', self::MOBILE_METHODS),
            'phone' => ['required', 'string', 'regex:/^(\+225)?[\s\d]{10,14}$/'],
        ])->validate();

        $reservation = Reservation::where('reference', $data['reference'])->firstOrFail();
        abort_unless($reservation->status === 'pending', 409, 'Cette réservation n\'est plus en attente de paiement.');

        $operator = match ($data['method']) {
            'wave' => 'WAVE',
            'orange' => 'OM',
            'mtn' => 'MTN',
            'moov' => 'MOOV',
        };

        $response = Http::withToken(config('services.cinetpay.api_key'))
            ->timeout(20)
            ->post(rtrim(config('services.cinetpay.base_url'), '/').'/v2/payment', [
                'site_id' => config('services.cinetpay.site_id'),
                'transaction_id' => $reservation->reference.'-'.time(),
                'amount' => $reservation->total_amount,
                'currency' => 'XOF',
                'channels' => $operator,
                'customer_phone_number' => preg_replace('/\D/', '', $data['phone']),
                'description' => 'Résidence Azalaï — '.$reservation->reference,
                'notify_url' => url('/api/v1/webhooks/cinetpay'),
                'return_url' => config('app.frontend_url').'/reservation/'.$reservation->reference,
                'metadata' => json_encode(['reservation_id' => $reservation->id]),
            ]);

        abort_unless($response->successful(), 502, 'Passerelle CinetPay injoignable — réessayez dans un instant.');

        $body = $response->json();
        abort_unless(($body['code'] ?? null) === '00', 422, $body['description'] ?? 'Demande rejetée par l\'opérateur.');

        $payment = $reservation->payments()->create([
            'transaction_ref' => (string) ($body['data']['payment_id'] ?? 'CP-'.strtoupper(bin2hex(random_bytes(5)))),
            'method' => $data['method'],
            'provider' => 'cinetpay',
            'amount' => $reservation->total_amount,
            'status' => 'pending',
            'provider_payload' => $body['data'] ?? null,
        ]);
        $payment->log('initiated', ['operator' => $operator]);

        return response()->json([
            'transaction_ref' => $payment->transaction_ref,
            'status' => 'PENDING',
            'message' => 'Demande envoyée. Validez sur votre téléphone.',
        ], 201);
    }

    /**
     * GET /api/v1/payments/{ref}/status
     * Polling côté front (en production : diffuser aussi via Laravel Reverb/SSE).
     */
    public function status(string $transactionRef): JsonResponse
    {
        $payment = Payment::where('transaction_ref', $transactionRef)->firstOrFail();

        return response()->json([
            'status' => strtoupper($payment->status),
            'message' => null,
        ]);
    }

    /**
     * POST /api/v1/payments/card
     * Stripe PaymentIntent confirmé serveur avec le payment_method_id issu de
     * Stripe Elements (les données carte ne touchent JAMAIS ce serveur — SAQ-A).
     * 3-D Secure : si la banque exige une action, on renvoie le client_secret.
     */
    public function card(Request $request): JsonResponse
    {
        $data = Validator::make($request->all(), [
            'reference' => 'required|exists:reservations,reference',
            'payment_method_id' => 'required|string',
        ])->validate();

        $reservation = Reservation::where('reference', $data['reference'])->firstOrFail();
        abort_unless($reservation->status === 'pending', 409, 'Cette réservation n\'est plus en attente de paiement.');

        \Stripe\Stripe::setApiKey(config('services.stripe.secret'));

        $intent = \Stripe\PaymentIntent::create([
            'amount' => $reservation->total_amount,
            'currency' => 'xof',
            'payment_method' => $data['payment_method_id'],
            'confirmation_method' => 'automatic',
            'confirm' => true,
            'return_url' => config('app.frontend_url').'/reservation/'.$reservation->reference,
            'metadata' => ['reservation_id' => (string) $reservation->id],
        ], [
            'idempotency_key' => $reservation->reference.'-card',
        ]);

        $payment = $reservation->payments()->create([
            'transaction_ref' => $intent->id,
            'method' => 'visa',
            'provider' => 'stripe',
            'amount' => $reservation->total_amount,
            'status' => $intent->status === 'succeeded' ? 'confirmed' : 'pending',
        ]);
        $payment->log('intent_created', ['status' => $intent->status]);

        if ($intent->status === 'requires_action') {
            return response()->json([
                'status' => 'REQUIRES_ACTION',
                'client_secret' => $intent->client_secret,
                'transaction_ref' => $payment->transaction_ref,
            ]);
        }

        if ($intent->status === 'succeeded') {
            $this->settle($payment, 'confirmed', $intent->toArray());
        }

        return response()->json([
            'transaction_ref' => $payment->transaction_ref,
            'status' => strtoupper($payment->fresh()->status),
        ], 201);
    }

    /**
     * POST /api/v1/webhooks/cinetpay — signature HMAC obligatoire.
     */
    public function cinetpayWebhook(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $signature = (string) $request->header('X-Cinetpay-Signature', '');
        $expected = hash_hmac('sha256', $payload, (string) config('services.cinetpay.secret'));

        abort_unless(hash_equals($expected, $signature), 401, 'Signature invalide.');

        $body = json_decode($payload, true) ?: [];
        $payment = Payment::where('transaction_ref', (string) ($body['cpm_trans_id'] ?? ''))->first();

        if ($payment) {
            $this->settle($payment, ($body['cpm_result'] ?? '') === '00' ? 'confirmed' : 'failed', $body);
        }

        Log::channel('single')->info('cinetpay webhook', ['body' => $body]);

        return response()->json(['received' => true]);
    }

    /**
     * POST /api/v1/webhooks/stripe — signature Stripe-Signature obligatoire.
     */
    public function stripeWebhook(Request $request): JsonResponse
    {
        try {
            $event = \Stripe\Webhook::constructEvent(
                $request->getContent(),
                (string) $request->header('Stripe-Signature', ''),
                (string) config('services.stripe.webhook_secret')
            );
        } catch (\Throwable) {
            abort(401, 'Signature invalide.');
        }

        $payment = Payment::where('transaction_ref', (string) $event->data->object->id)->first();

        if ($payment && $event->type === 'payment_intent.succeeded') {
            $this->settle($payment, 'confirmed', $event->data->object->toArray());
        }
        if ($payment && $event->type === 'payment_intent.payment_failed') {
            $this->settle($payment, 'failed', $event->data->object->toArray());
        }

        return response()->json(['received' => true]);
    }

    /**
     * Transition finale d'un paiement, en transaction :
     * statut + date + journal, puis confirmation de la réservation.
     */
    private function settle(Payment $payment, string $status, array $payload): void
    {
        DB::transaction(function () use ($payment, $status, $payload) {
            $payment->forceFill([
                'status' => $status,
                'paid_at' => $status === 'confirmed' ? now() : null,
                'provider_payload' => $payload,
            ])->save();

            $payment->log('webhook:'.$status, $payload);

            if ($status === 'confirmed') {
                $payment->reservation->update(['status' => 'confirmed']);
                // Notification asynchrone (e-mail + SMS) — à brancher en job :
                // ConfirmationMail::dispatch($payment->reservation);
            }
        });
    }
}
