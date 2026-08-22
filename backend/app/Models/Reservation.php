<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reservation extends Model
{
    protected $fillable = [
        'reference', 'kind', 'catalog_item_id', 'check_in', 'check_out', 'guests',
        'contact_name', 'contact_email', 'contact_phone',
        'base_amount', 'vat_amount', 'service_amount', 'total_amount', 'status',
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
    ];

    /**
     * Chevauchement strict sur [check_in, check_out) — c'est lui qui
     * garantit qu'une chambre n'est jamais louée deux fois et qu'une
     * salle reste en exclusivité.
     */
    public function scopeOverlapping(Builder $query, int $itemId, string $from, string $to): Builder
    {
        return $query
            ->where('catalog_item_id', $itemId)
            ->where('status', '!=', 'cancelled')
            ->where('check_in', '<', $to)
            ->where('check_out', '>', $from);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(CatalogItem::class, 'catalog_item_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
