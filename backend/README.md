# Backend — Résidence Limaniya Golf (Laravel 12)

## Où est « le lien » du backend ?

Cet environnement de démonstration ne sert que le front-end statique : **il n'y a pas
d'URL backend hébergée ici**. Le backend est livré sous forme de **code source complet**
dans ce dossier `/backend`, prêt à être lancé ou déployé.

- **En local**, l'URL devient : `http://127.0.0.1:8000/api/v1/…`
- **En production** : déployez sur Laravel Forge / VPS (nginx + PHP 8.3 + MySQL 8),
  puis pointe le front via `VITE_API_URL` (voir §5).

## 1 — Mise en route (5 minutes)

```bash
# 1. Squelette Laravel 12
composer create-project laravel/laravel limaniya-api
cd limaniya-api

# 2. Installer l'API (routes/api.php + Sanctum)
php artisan install:api

# 3. Dépendance Stripe
composer require stripe/stripe-php

# 4. Copier les fichiers de ce dossier dans le projet :
#    backend/routes/api.php                              → routes/api.php
#    backend/app/Models/*.php                            → app/Models/
#    backend/app/Http/Controllers/*.php                  → app/Http/Controllers/
#    backend/database/migrations/2026_*_create_limaniya_*  → database/migrations/

# 5. Base de données
php artisan migrate

# 6. Lancer
php artisan serve   # → http://127.0.0.1:8000
```

## 2 — Variables d'environnement (`.env`)

```ini
APP_URL=http://127.0.0.1:8000
APP_FRONTEND_URL=http://localhost:5173

CINETPAY_API_KEY=...        # dashboard.cinetpay.com
CINETPAY_SITE_ID=...
CINETPAY_SECRET=...         # sert à vérifier la signature des webhooks
CINETPAY_BASE_URL=https://api-checkout.cinetpay.com

STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Ajoutez dans `config/services.php` :

```php
'cinetpay' => [
    'api_key'  => env('CINETPAY_API_KEY'),
    'site_id'  => env('CINETPAY_SITE_ID'),
    'secret'   => env('CINETPAY_SECRET'),
    'base_url' => env('CINETPAY_BASE_URL', 'https://api-checkout.cinetpay.com'),
],
'stripe' => [
    'key'            => env('STRIPE_KEY'),
    'secret'         => env('STRIPE_SECRET'),
    'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
],
```

CORS (front sur un autre domaine) : `php artisan config:publish cors`, puis
`paths: ['api/*']` et `allowed_origins: [env('APP_FRONTEND_URL')]`.
Exclure les webhooks du CSRF dans `bootstrap/app.php` :
`$middleware->validateCsrfTokens(except: ['api/v1/webhooks/*']);`

## 3 — Endpoints

| Méthode | Route                              | Rôle                                        |
| ------- | ---------------------------------- | ------------------------------------------- |
| GET     | `/api/v1/rooms`                    | Catalogue des chambres                      |
| GET     | `/api/v1/halls`                    | Catalogue des salles                        |
| GET     | `/api/v1/availability`             | Unités restantes sur un intervalle          |
| POST    | `/api/v1/reservations`             | Création (stock verrouillé, devis server)   |
| POST    | `/api/v1/payments/initiate`        | Mobile Money → push USSD via CinetPay       |
| GET     | `/api/v1/payments/{ref}/status`    | Polling du statut                           |
| POST    | `/api/v1/payments/card`            | Stripe PaymentIntent (3-D Secure)           |
| POST    | `/api/v1/webhooks/cinetpay`        | Notification signée HMAC                    |
| POST    | `/api/v1/webhooks/stripe`          | Notification signée Stripe                  |

## 4 — Sécurité

- Throttle : 60 req/min global, 10 req/min sur `/payments/*`.
- Anti-sur-réservation : `lockForUpdate()` + re-vérification du stock en transaction.
- Webhooks : signature HMAC (CinetPay) et `Stripe-Signature` vérifiées, journalisées
  dans `payment_logs` (audit).
- Cartes : **jamais** sur le serveur — Stripe Elements côté front,
  `payment_method_id` côté back (SAQ-A).
- Idempotence : clé d'idempotence Stripe `{reference}-card` ; ajoutez un header
  `Idempotency-Key` côté front pour les retries de `POST /reservations`.

## 5 — Brancher le front-end

Le client `src/lib/api.ts` du front bascule **automatiquement** de la simulation
vers le vrai backend si la variable est définie. Créez un `.env` à la racine du front :

```ini
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

Puis `npm run dev`. Tous les appels (disponibilité, réservation, paiements, polling)
partent vers Laravel. **Note production carte** : remplacez la saisie brute de la démo
par un `<CardElement>` Stripe Elements qui fournit le `payment_method_id` attendu
par `POST /payments/card`.
