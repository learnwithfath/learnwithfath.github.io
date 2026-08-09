summary: Implementasi backend TaskForge paralel menggunakan Go dan NestJS dengan PostgreSQL, Redis, contract test, security, dan telemetry.
id: agentic-phase-4-backend
categories: Backend, Go, Node.js, Database
tags: go, nestjs, postgresql, redis, openapi, contract-testing, observability
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Fase 4 — Dua Backend Paralel

## Target Arsitektur
Duration: 30

Bangun `services/api-go` dan `services/api-nest` dari OpenAPI yang sama. Keduanya menggunakan PostgreSQL schema, seed dataset, error codes, dan contract fixtures yang sama. Redis dipakai untuk cache/read optimization, bukan source of truth.

Direktori domain tidak boleh mengetahui HTTP framework. Adapter menerjemahkan transport ke use case; repository menerjemahkan domain ke database. Agent boleh mengusulkan struktur idiomatik berbeda untuk Go dan TypeScript selama boundary dan behavior setara.

## Minggu 10 — Scaffold dan Domain Core
Duration: 360

Mulai dari health endpoint, config validation, graceful shutdown, structured error, dan request trace. Lalu implementasikan vertical slice:

1. login seed user;
2. create/list project;
3. create/list/update task;
4. membership authorization.

Perintahkan agent membaca OpenAPI dan membuat compliance checklist sebelum menulis. Larang perubahan contract. Generate stub hanya sebagai accelerant; review semua validation, default, dan error mapping.

Test minimal: domain unit, HTTP integration, unauthorized/forbidden, invalid input, not found, dan conflict. Gunakan fixed clock/ID generator pada test.

## Minggu 11 — Data dan Reliability
Duration: 390

Buat migration forward-only untuk users, projects, memberships, tasks, idempotency records, dan audit events. Terapkan:

- transaction untuk write yang melibatkan beberapa table;
- unique constraints sebagai pertahanan terakhir;
- `version` pada task untuk optimistic concurrency;
- idempotency key + request fingerprint;
- cursor pagination stabil;
- cache-aside project summary dengan explicit invalidation;
- bounded timeout dan context cancellation.

Jalankan dua request bersamaan untuk update version yang sama; tepat satu boleh berhasil. Ulangi create dengan idempotency key sama dan payload sama/berbeda. Matikan Redis: core write/read harus tetap benar meski lebih lambat.

Negative
: Jangan meminta agent “menambahkan retry ke semua error.” Retry hanya untuk operasi idempotent dan transient failure yang terklasifikasi.

## Minggu 12 — Contract, Security, Telemetry
Duration: 360

Jalankan satu black-box contract suite terhadap base URL Go lalu NestJS. Suite harus menguji response schema, status, error code, auth matrix, pagination, idempotency, stale version, dan trace ID.

Tambahkan structured log, latency/error metrics, serta spans untuk HTTP, database, dan cache. Redact Authorization, password, token, dan personal payload.

Security lab:

- horizontal privilege escalation antar project;
- JWT invalid/expired;
- SQL injection dan mass assignment;
- oversized input/rate smoke;
- migration rollback melalui restore, bukan destructive guessing.

Load smoke memakai workload dan dataset sama. Tujuannya mendeteksi regresi serta resource leak, bukan memenangkan benchmark bahasa.

## Gate Kelulusan
Duration: 30

Kedua service harus dapat ditukar hanya dengan mengubah base URL. Contract suite hijau, race test terbukti, Redis outage terdegradasi aman, security finding kritis nol, logs dapat dikorelasikan melalui trace ID, dan clean checkout menghasilkan build yang sama.
