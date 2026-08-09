# Minggu 9 — Recovery & human gates

## Task

Simulasikan test flaky, tool failure, scope drift, dan command destruktif.

## Setup

```bash
git switch week-09-start
npm run test:smoke
npm run lab -- verify 09
```

Verifier pertama harus merah dengan ID `W09_NOT_IMPLEMENTED`.

## Evidence

Retry budget, escalation policy, dan audit log.

## Expected output

Loop berhenti aman dan meminta keputusan manusia pada batas yang benar.

Setelah review mandiri, bandingkan dengan `week-09-solution`.
