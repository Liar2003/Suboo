# Suboo — Monthly Savings Management

A web app for tracking monthly savings across members, with Myanmar-friendly
amount input ("၁သိန်း", "၁သိန်းခွဲ", "10,000", "100k", …), analytics charts,
and admin-gated writes. State is shared across users via a tiny PHP + SQLite
backend (`server.php` + `data.sqlite`).

## Quick start

```
php -S 0.0.0.0:3000 server.php
```

Then open http://localhost:3000 in any browser. All clients see the same data.

No external PHP dependencies — uses the built-in `php -S` server, PDO, and
the bundled `pdo_sqlite` extension (enabled by default in PHP 8).

## Environment variables

| Variable    | Default              | Description                                |
| ----------- | ------------------- | ------------------------------------------ |
| `ADMIN_PIN` | `9876`              | Initial admin PIN. Persisted in admin-pin.txt once changed via Settings. |

## Admin PIN

Default is `9876`. Admins sign in (top-right of the page) to add payments,
edit per-member amounts, delete payments, and change settings. PIN changes
are saved server-side via `PUT /api/admin-pin` (persists to `admin-pin.txt`).

## REST API

| Method | Path                          | Auth      | Purpose                                |
| ------ | ----------------------------- | --------- | -------------------------------------- |
| GET    | `/api/health`                 | -         | Liveness check                         |
| GET    | `/api/state`                  | -         | Full snapshot                          |
| GET    | `/api/members`                | -         | Members list                           |
| GET    | `/api/payments`               | -         | Payments list                          |
| GET    | `/api/settings`               | -         | Settings object                        |
| POST   | `/api/auth/check`             | PIN       | Verify PIN                             |
| POST   | `/api/payments`               | PIN       | Add payment                            |
| DELETE | `/api/payments/:id`           | PIN       | Delete payment                         |
| POST   | `/api/payments/clear`         | PIN       | Clear all payments                     |
| PUT    | `/api/members/:id/amount`     | PIN       | Set per-member custom amount           |
| DELETE | `/api/members/:id/amount`     | PIN       | Clear per-member custom amount         |
| PUT    | `/api/settings`               | PIN       | Replace settings                       |
| PUT    | `/api/admin-pin`              | PIN       | Rotate admin PIN at runtime            |

Send the PIN via header `x-admin-pin: <pin>` or in the JSON body as `pin`.

## File layout

| File              | Purpose                                                  |
| ----------------- | -------------------------------------------------------- |
| `index.html`      | Entire frontend (HTML + CSS + JS, no build step)         |
| `server.php`      | PHP API + static file server, uses PDO + SQLite          |
| `data.sqlite`     | Shared SQLite database (auto-created on first run)       |
| `admin-pin.txt`   | Persisted admin PIN (created on first rotation)          |