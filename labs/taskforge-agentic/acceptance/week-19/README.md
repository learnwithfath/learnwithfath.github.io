# Minggu 19 — Vault & state machine

## Task

Jadikan note frontmatter source of truth untuk backlog → in-progress → review → done/blocked.

## Setup

```bash
git switch week-19-start
npm run test:smoke
npm run lab -- verify 19
```

Verifier pertama harus merah dengan ID `W19_NOT_IMPLEMENTED`.

## Evidence

Vault template, transition rules, dan idempotent tick runner.

## Expected output

Restart tidak menduplikasi pekerjaan; invalid transition ditolak.

Setelah review mandiri, bandingkan dengan `week-19-solution`.
