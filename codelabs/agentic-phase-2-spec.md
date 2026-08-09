summary: Ubah ide produk menjadi product brief, ADR, OpenAPI, task graph, dan Definition of Done yang dapat dieksekusi agent.
id: agentic-phase-2-spec
categories: AI, Architecture, Full Stack
tags: spec-driven, context-engineering, openapi, adr, task-graph
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Fase 2 — Context & Spec Engineering

## Prinsip Kerja
Duration: 25

Agent mempercepat keputusan yang sudah jelas dan memperbesar kekacauan yang belum jelas. Fase ini mengubah intent TaskForge menjadi artefak yang bisa dipakai tujuh implementasi tanpa menebak.

Salin template pada `agentic-engineering-assets/` ke repository latihan. Sumber kebenaran diurutkan: product brief → OpenAPI → ADR → task record → existing tests. Konflik harus menghentikan pekerjaan.

## Minggu 4 — Product Brief
Duration: 270

Baca `product-brief.md`, lalu lakukan review bersama agent dengan peran critic. Minta agent hanya mengidentifikasi ambiguity:

```text
Review brief ini sebagai implementation-risk analyst.
Kelompokkan ambiguity menjadi product, data, security, dan operations.
Jangan menambah fitur. Untuk tiap ambiguity, jelaskan keputusan yang dibutuhkan
dan test acceptance yang akan berubah.
```

Kunci lima flow: login, create project, create/assign task, status update, dan offline recovery. Nyatakan non-goals secara eksplisit. Buat glossary untuk `project`, `task`, `member`, `version`, `idempotency key`, dan `conflict`.

**Failure drill:** minta agent “buat aplikasi project management terbaik.” Bandingkan scope yang mengembang dengan brief yang dibatasi.

**Evidence:** brief disetujui, ambiguity log ditutup, serta acceptance scenario Given/When/Then untuk lima flow.

## Minggu 5 — Architecture dan Shared Contract
Duration: 330

Buat context diagram dan keputusan berikut:

1. PostgreSQL sebagai source of truth; Redis bukan penyimpanan permanen.
2. JWT sandbox untuk auth; authorization berdasarkan membership dan role.
3. Cursor pagination, idempotent writes, optimistic version, UTC timestamps.
4. Error envelope konsisten: `code`, `message`, `traceId`.
5. Mobile mutation queue; server menolak stale version dengan `409`.

Mulai dari `openapi-taskforge.yaml`, lalu lengkapi login, projects, membership, task detail/update, dan sync endpoints. Lint kontrak dan generate client untuk satu bahasa sebagai feasibility check.

Tuliskan ADR pendek untuk authentication, offline conflict, shared schema, dan API versioning. Setiap ADR berisi context, decision, alternatives, consequences, dan reversal trigger.

**Acceptance:** Go dan NestJS tidak membutuhkan extension vendor; lima client tidak membutuhkan response khusus platform.

## Minggu 6 — Task Graph dan DoD
Duration: 300

Pecah vertical slice menjadi task maksimal 30–90 menit agent time. Setiap task record wajib berisi:

- goal dan non-goal;
- exact acceptance criteria;
- dependency dan file ownership;
- risk/budget;
- verifier command;
- expected evidence;
- stopping dan escalation rule.

Urutan awal: schema/migration → contract fixture → backend operation → generated clients → UI state → E2E. Task yang mengubah kontrak memblokir semua consumer sampai contract review selesai.

Gunakan template `task-state.md` dan `review-and-dod.md`. Minta agent kedua melakukan pre-mortem terhadap graph, tetapi manusia yang menyetujui dependency dan scope.

Negative
: “Implement auth” bukan task yang bounded. Pecah menjadi contract, token validation, identity context, authorization rules, fixtures, dan tests.

**Failure drill:** hapus satu acceptance criterion tentang idempotency dan biarkan agent merencanakan. Tunjukkan bagaimana verifier yang lemah menghasilkan implementasi yang tampak benar.

## Gate Kelulusan
Duration: 30

Fase selesai jika brief tidak memiliki ambiguity high-impact, OpenAPI valid, generated-client smoke test berhasil, minimal empat ADR diterima, dan graph mempunyai verifier pada setiap node. Review dilakukan tanpa model yang menulis spec pertama kali.

Hasil akhir adalah **decision-complete build packet**, bukan koleksi prompt.
