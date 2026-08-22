<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /* Chambres & salles de conférence */
        Schema::create('catalog_items', function (Blueprint $t) {
            $t->id();
            $t->enum('kind', ['room', 'hall']);
            $t->string('slug')->unique();
            $t->string('name');
            $t->string('tagline')->nullable();
            $t->text('description')->nullable();
            $t->unsignedInteger('price');                 // FCFA HT / unité
            $t->enum('unit', ['nuit', 'jour']);
            $t->unsignedTinyInteger('capacity');
            $t->unsignedSmallInteger('size');             // m²
            $t->unsignedTinyInteger('stock')->default(1); // nb d'unités réservables
            $t->json('features')->nullable();
            $t->json('configs')->nullable();              // dispositions des salles
            $t->boolean('is_active')->default(true);
            $t->timestamps();
        });

        /* Réservations — l'intervalle [check_in, check_out) bloque le stock */
        Schema::create('reservations', function (Blueprint $t) {
            $t->id();
            $t->string('reference', 24)->unique();        // AZL-2026-XXXXXX
            $t->enum('kind', ['room', 'hall']);
            $t->foreignId('catalog_item_id')->constrained()->cascadeOnDelete();
            $t->date('check_in');
            $t->date('check_out');
            $t->unsignedTinyInteger('guests');
            $t->string('contact_name');
            $t->string('contact_email');
            $t->string('contact_phone');
            $t->unsignedInteger('base_amount');
            $t->unsignedInteger('vat_amount');             // TVA 18 %
            $t->unsignedInteger('service_amount');         // service 7 %
            $t->unsignedInteger('total_amount');
            $t->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');
            $t->timestamps();

            $t->index(['catalog_item_id', 'check_in', 'check_out']);
        });

        /* Paiements — un par tentative, traçabilité complète */
        Schema::create('payments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('reservation_id')->constrained()->cascadeOnDelete();
            $t->string('transaction_ref')->unique()->nullable();
            $t->enum('method', ['wave', 'orange', 'mtn', 'moov', 'visa', 'stripe']);
            $t->enum('provider', ['cinetpay', 'stripe']);
            $t->unsignedInteger('amount');
            $t->enum('status', ['pending', 'confirmed', 'failed', 'refunded'])->default('pending');
            $t->json('provider_payload')->nullable();
            $t->timestamp('paid_at')->nullable();
            $t->timestamps();
        });

        /* Journal d'audit des webhooks & transitions */
        Schema::create('payment_logs', function (Blueprint $t) {
            $t->id();
            $t->foreignId('payment_id')->constrained()->cascadeOnDelete();
            $t->string('event');
            $t->json('payload')->nullable();
            $t->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_logs');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('reservations');
        Schema::dropIfExists('catalog_items');
    }
};
