# Minggu 11 — Postgres, Redis & reliability

## Task

Tambah migration, transaction, cache, idempotency, pagination, dan optimistic concurrency.

## Setup

```bash
git switch week-11-start
npm run test:smoke
npm run lab -- verify 11
```

Verifier pertama harus merah dengan ID `W11_NOT_IMPLEMENTED`.

## Evidence

Dua service memakai skema dan seed data setara.

## Expected output

Race, retry, cache invalidation, dan rollback diuji.

Setelah review mandiri, bandingkan dengan `week-11-solution`.
