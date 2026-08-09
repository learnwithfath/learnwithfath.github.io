# Minggu 21 — CI, governance & optional VPS

## Task

Bangun CI matrix, secret boundary, approval gate, audit export, observability, dan runbook VPS opsional.

## Setup

```bash
git switch week-21-start
npm run test:smoke
npm run lab -- verify 21
```

Verifier pertama harus merah dengan ID `W21_NOT_IMPLEMENTED`.

## Evidence

Green matrix, threat model, incident drill, dan cost dashboard.

## Expected output

Agent tidak dapat deploy production tanpa human approval.

Setelah review mandiri, bandingkan dengan `week-21-solution`.
