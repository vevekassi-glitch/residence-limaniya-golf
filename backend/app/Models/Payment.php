<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class Payment extends Model
{
    protected $fillable = [
        'reservation_id', 'transaction_ref', 'method', 'provider',
        'amount', 'status', 'provider_payload', 'paid_at',
    ];

    protected $casts = [
        'provider_payload' => 'array',
        'paid_at' => 'datetime',
    ];

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    /** Audit immuable : chaque événement de paiement est journalisé. */
    public function log(string $event, ?array $payload = null): void
    {
        DB::table('payment_logs')->insert([
            'payment_id' => $this->id,
            'event' => $event,
            'payload' => $payload !== null ? json_encode($payload, JSON_UNESCAPED_UNICODE) : null,
            'created_at' => now(),
        ]);
    }
}
