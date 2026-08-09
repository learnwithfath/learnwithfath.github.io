# Minggu 20 — Orchestrator & model routing

## Task

Dispatch per-project agent, route model berdasarkan task/risk, dan simpan trace serta biaya.

## Setup

```bash
git switch week-20-start
npm run test:smoke
npm run lab -- verify 20
```

Verifier pertama harus merah dengan ID `W20_NOT_IMPLEMENTED`.

## Evidence

Local orchestrator mengerjakan satu issue sampai PR review.

## Expected output

Agent terisolasi; fallback dan budget limit terbukti bekerja.

Setelah review mandiri, bandingkan dengan `week-20-solution`.
