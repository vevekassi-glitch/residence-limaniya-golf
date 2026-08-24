<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API v1 — Résidence Limaniya Golf (Laravel 12)
|--------------------------------------------------------------------------
| Installer avec : php artisan install:api  (Sanctum + routes/api.php)
| Voir backend/README.md pour le CORS, le CSRF et les webhooks.
*/

Route::prefix('v1')->middleware('throttle:60,1')->group(function () {

    /* ——— Catalogue & disponibilité ——— */
    Route::get('/rooms', [BookingController::class, 'rooms']);
    Route::get('/halls', [BookingController::class, 'halls']);
    Route::get('/availability', [BookingController::class, 'availability']);

    /* ——— Réservations (verrou pessimiste côté contrôleur) ——— */
    Route::post('/reservations', [BookingController::class, 'store'])
        ->middleware('throttle:10,1');

    /* ——— Paiements ——— */
    Route::prefix('payments')->middleware('throttle:10,1')->group(function () {
        Route::post('/initiate', [PaymentController::class, 'initiateMobile']);   // CinetPay
        Route::get('/{transactionRef}/status', [PaymentController::class, 'status']);
        Route::post('/card', [PaymentController::class, 'card']);                 // Stripe
    });

    /* ——— Webhooks (signature vérifiée dans le contrôleur) ——— */
    Route::post('/webhooks/cinetpay', [PaymentController::class, 'cinetpayWebhook']);
    Route::post('/webhooks/stripe', [PaymentController::class, 'stripeWebhook']);
});
