# Résidence Limaniya Golf — Architecture & Logique

## 1. Stack

| Couche        | Technologie                                                     |
| ------------- | --------------------------------------------------------------- |
| Frontend      | React 18 + Vite + Tailwind CSS v4 (TypeScript strict)           |
| Backend       | Laravel 12 (PHP 8.3) — API REST `/api/v1`, Sanctum, Jobs/Queues |
| Paiements     | CinetPay (Wave, Orange Money, MTN MoMo, Moov Money) + Stripe (Visa, cartes) |
| Base de données | MySQL 8 — `users`, `rooms`, `halls`, `reservations`, `payments`, `payment_logs` |
| Temps réel    | Polling `GET /payments/{ref}/status` (prod : Laravel Reverb / SSE optionnel) |

> Dans cet environnement de démonstration, le backend Laravel est **simulé côté
> navigateur** par `src/lib/api.ts`, qui reproduit fidèlement les contrats HTTP,
> la latence réseau, les validations et les codes d'erreur de l'API réelle.

## 2. Domaines & règles métier

- **Catalogue** : 4 catégories de chambres (tarif / nuit) + 3 salles de conférence (tarif / jour).
- **Disponibilité** : une chambre possède un `stock` (nb d'unités) ; une salle est
  réservée en exclusivité (`stock = 1`). Une réservation bloque le stock sur
  l'intervalle `[check_in, check_out)` — les requêtes se font avec verrou
  pessimiste (`lockForUpdate`) pour éviter la sur-réservation.
- **Fiscalité** : TVA 18 % + taxe de service 7 %, calculées server-side uniquement.
- **Référence** : format `AZL-2026-XXXXXX` (préfixe + année + base36 horodaté).

## 3. API REST (contrats)

```
GET  /api/v1/rooms                     → Room[]
GET  /api/v1/halls                     → Hall[]
GET  /api/v1/availability?item_id&from&to
                                       → { remaining: int }
POST /api/v1/reservations              → { reference, quote }
     body: { kind, item_id, from, to, guests, name, email, phone }
POST /api/v1/payments/initiate         → { transaction_ref, status: "PENDING" }
     body: { reference, method: wave|orange|mtn|moov, phone }
GET  /api/v1/payments/{ref}/status     → { status: PENDING | CONFIRMED | FAILED }
POST /api/v1/payments/card             → { transaction_ref, status, auth_code }
     body: { reference, method: visa|stripe, token (Stripe.js / Elements) }
POST /api/v1/webhooks/cinetpay         → signature HMAC vérifiée
POST /api/v1/webhooks/stripe           → signature `Stripe-Signature` vérifiée
```

## 4. Flux de paiement

1. **Mobile Money** — le frontend envoie `{reference, method, phone}` → Laravel
   crée un `Payment (PENDING)` puis appelle CinetPay (`POST /v2/payment`).
   L'utilisateur valide la **push USSD** sur son téléphone. CinetPay notifie le
   webhook signé → le statut passe `CONFIRMED` → la réservation est confirmée
   (transaction DB + e-mail de reçu). Le frontend poll le statut.
2. **Carte (Visa / Stripe)** — la saisie se fait dans **Stripe Elements** :
   les données carte ne touchent **jamais** le serveur (PCI-DSS SAQ-A).
   Laravel crée un `PaymentIntent`, le frontend confirme, le webhook
   `payment_intent.succeeded` finalise la réservation. 3-D Secure automatique.

## 5. Sécurité

- Authentification API : **Laravel Sanctum** (tokens hashés en base).
- `throttle:60,1` sur les routes publiques, `throttle:10,1` sur `/payments/*`.
- Validation stricte : `FormRequest` (dates ISO, e-mail, téléphone `+225` 10 chiffres, Luhn côté passerelle).
- Idempotence : clé `Idempotency-Key` sur `POST /reservations` (anti double-paiement au retry).
- Webhooks : vérification de signature + table `payment_logs` (audit complet).
- Secrets : `CINETPAY_API_KEY`, `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET` dans le vault, jamais exposés au frontend.

## 6. Correspondance démo

| Endpoint                     | Simulé dans `src/lib/api.ts`      |
| ---------------------------- | --------------------------------- |
| `GET /availability`          | `checkAvailability()` (latence + stock déterministe) |
| `POST /reservations`         | `createReservation()` (validations FormRequest) |
| `POST /payments/initiate`    | `initiateMobilePayment()` (rejet si n° finit par `0000`) |
| `GET /payments/{ref}/status` | `pollPaymentStatus()` (PENDING → CONFIRMED après ~4 s) |
| `POST /payments/card`        | `payByCard()` (Luhn + 3-D Secure simulé, refus si carte `0000…`) |
