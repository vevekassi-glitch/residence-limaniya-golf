<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CatalogItem extends Model
{
    protected $fillable = [
        'kind', 'slug', 'name', 'tagline', 'description',
        'price', 'unit', 'capacity', 'size', 'stock',
        'features', 'configs', 'is_active',
    ];

    protected $casts = [
        'features' => 'array',
        'configs' => 'array',
        'price' => 'integer',
        'is_active' => 'boolean',
    ];

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
