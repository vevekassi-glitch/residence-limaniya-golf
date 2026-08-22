<?php

namespace App\Http\Controllers;

use App\Models\CatalogItem;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    private const VAT_RATE = 0.18;      // TVA Côte d'Ivoire
    private const SERVICE_RATE = 0.07;  // taxe de service hôtelière

    public function rooms(): JsonResponse
    {
        return $this->catalog('room');
    }

    public function halls(): JsonResponse
    {
        return $this->catalog('hall');
    }

    private function catalog(string $kind): JsonResponse
    {
        return response()->json(
            CatalogItem::where('kind', $kind)
                ->where('is_active', true)
                ->orderBy('price')
                ->get()
        );
    }

    /**
     * GET /api/v1/availability?item_id=&from=&to=
     * Unités restantes sur l'intervalle — même logique que la réservation,
     * sans verrou (lecture simple).
     */
    public function availability(Request $request): JsonResponse
    {
        $data = Validator::make($request->query(), [
            'item_id' => 'required|integer|exists:catalog_items,id',
            'from' => 'required|date_format:Y-m-d|after_or_equal:today',
            'to' => 'required|date_format:Y-m-d|after_or_equal:from',
        ])->validate();

        $item = CatalogItem::findOrFail($data['item_id']);
        [$from, $to] = $this->normalizeRange($data['from'], $data['to'], $item->kind);

        $reserved = Reservation::overlapping($item->id, $from, $to)->count();

        return response()->json([
            'item_id' => $item->id,
            'from' => $data['from'],
            'to' => $data['to'],
            'remaining' => max(0, $item->stock - $reserved),
        ]);
    }

    /**
     * POST /api/v1/reservations
     * Création atomique : verrou pessimiste sur la ligne catalogue,
     * re-vérification du stock, devis calculé côté serveur uniquement.
     */
    public function store(Request $request): JsonResponse
    {
        $data = Validator::make($request->all(), [
            'kind' => 'required|in:room,hall',
            'item_id' => 'required|integer|exists:catalog_items,id',
            'from' => 'required|date_format:Y-m-d|after_or_equal:today',
            'to' => 'required|date_format:Y-m-d|after_or_equal:from',
            'guests' => 'required|integer|min:1|max:500',
            'name' => 'required|string|min:3|max:120',
            'email' => 'required|email|max:190',
            'phone' => ['required', 'string', 'regex:/^(\+225)?[\s\d]{10,14}$/'],
        ])->validate();

        return DB::transaction(function () use ($data) {
            // SELECT ... FOR UPDATE : deux requêtes concurrentes sont sérialisées.
            $item = CatalogItem::lockForUpdate()->findOrFail($data['item_id']);

            abort_unless($item->kind === $data['kind'], 422, "Type d'espace incohérent.");
            abort_if($data['guests'] > $item->capacity, 422, "Capacité maximale : {$item->capacity} personnes.");

            [$from, $to] = $this->normalizeRange($data['from'], $data['to'], $item->kind);

            if (Reservation::overlapping($item->id, $from, $to)->count() >= $item->stock) {
                abort(409, 'Complet sur ces dates.');
            }

            $nights = max(1, intdiv(strtotime($to) - strtotime($from), 86400));
            $base = $item->price * $nights;
            $quote = [
                'base' => $base,
                'nights' => $nights,
                'vat' => (int) round($base * self::VAT_RATE),
                'service' => (int) round($base * self::SERVICE_RATE),
            ];
            $quote['total'] = $base + $quote['vat'] + $quote['service'];

            $reservation = Reservation::create([
                'reference' => $this->makeReference(),
                'kind' => $item->kind,
                'catalog_item_id' => $item->id,
                'check_in' => $from,
                'check_out' => $to,
                'guests' => $data['guests'],
                'contact_name' => $data['name'],
                'contact_email' => $data['email'],
                'contact_phone' => $data['phone'],
                'base_amount' => $quote['base'],
                'vat_amount' => $quote['vat'],
                'service_amount' => $quote['service'],
                'total_amount' => $quote['total'],
                'status' => 'pending',
            ]);

            return response()->json([
                'reference' => $reservation->reference,
                'quote' => $quote,
            ], 201);
        });
    }

    /**
     * Les salles se réservent à la journée : arrivée = départ → 1 jour.
     * Pour les chambres, le départ doit être strictement postérieur.
     */
    private function normalizeRange(string $from, string $to, string $kind): array
    {
        if ($to === $from) {
            abort_unless($kind === 'hall', 422, 'La date de départ doit être postérieure à l\'arrivée.');
            $to = date('Y-m-d', strtotime($from.' +1 day'));
        }

        return [$from, $to];
    }

    /** AZL-2026-XXXXXX — unique, lisible au téléphone de la réception. */
    private function makeReference(): string
    {
        do {
            $ref = sprintf('AZL-%s-%s', date('Y'), strtoupper(substr(base_convert((string) hrtime(true), 10, 36), -6)));
        } while (Reservation::where('reference', $ref)->exists());

        return $ref;
    }
}
