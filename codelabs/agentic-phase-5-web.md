summary: Bangun TaskForge dashboard paralel dengan Next.js dan Nuxt, shared design contract, accessibility, failure states, dan browser E2E.
id: agentic-phase-5-web
categories: Frontend, React, Vue, Testing
tags: nextjs, nuxt, typescript, accessibility, playwright, design-system
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Fase 5 — Dua Web Client

## UI Contract
Duration: 25

Next.js dan Nuxt tidak perlu berbagi component code, tetapi wajib berbagi design tokens, content vocabulary, routes, API contract, accessibility criteria, dan visual fixtures. Pertahankan idiom masing-masing framework.

State wajib: loading, empty, populated, validation error, unauthorized, forbidden, server error, offline, optimistic pending, conflict, dan success.

## Minggu 13 — Design System dan Skeleton
Duration: 360

Definisikan tokens untuk color, typography, spacing, radius, shadow, breakpoint, dan motion. Buat component state table untuk button, input, dialog, toast, project card, task row, status badge, skeleton, serta error panel.

Berikan agent screenshot/wireframe dan state table, bukan instruksi “buat UI modern.” Minta implementasi routes: login, project list, project detail/board, task detail, dan member settings.

Review visual pada tiga viewport, keyboard flow, reduced motion, long Indonesian copy, empty list, serta error state. Snapshot adalah alat deteksi perubahan, bukan pengganti usability review.

## Minggu 14 — Data, Auth, dan Failure States
Duration: 390

Generate typed API client dari OpenAPI. Bungkus transport dalam domain-facing repository agar base URL Go/NestJS dapat diganti melalui environment configuration.

Implementasikan:

- session lifecycle dan protected routes;
- query cache dan explicit invalidation;
- optimistic status update dengan rollback;
- form validation client + server errors;
- conflict dialog yang menampilkan server version;
- retry hanya untuk safe reads;
- global unexpected-error boundary.

**Failure drill:** throttle network, kembalikan `401`, `403`, `409`, `500`, response lambat, dan invalid JSON fixture. UI tidak boleh stuck atau menampilkan raw stack trace.

## Minggu 15 — Accessibility dan E2E
Duration: 330

Audit semantic landmarks, label, focus order, visible focus, dialog focus trap/return, heading hierarchy, color contrast, status announcements, dan target size. Board harus tetap dapat digunakan tanpa drag-and-drop.

Automasi browser flow:

1. login;
2. create project;
3. create dan assign task;
4. update status;
5. tampilkan conflict dan resolve;
6. logout.

Jalankan suite yang sama terhadap Next/Nuxt dan Go/NestJS. Gunakan stable role/text selectors; hindari class CSS. Simpan screenshot hanya pada kegagalan dan trace untuk diagnosis.

## Gate Kelulusan
Duration: 30

Dua client lulus typecheck/build, component tests, accessibility audit tanpa critical issue, dan browser E2E pada kedua backend. Mengganti backend hanya mengubah base URL. Diff agent direview untuk hydration issue, stale cache, insecure token storage, dan framework anti-pattern.
