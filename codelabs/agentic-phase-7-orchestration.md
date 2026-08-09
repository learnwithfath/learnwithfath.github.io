summary: Bangun loop engineering lokal ala Pang dengan vault state, scheduler, orchestrator, model router, isolation, CI governance, dan VPS opsional.
id: agentic-phase-7-orchestration
categories: AI, Orchestration, DevOps, Security
tags: loop-engineering, pang, ghiath, hermes, obsidian, model-gateway, ci-cd, governance
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Fase 7 — Loop Engineering Production-Shaped

## Dari Sesi ke Sistem
Duration: 30

[Pang](https://github.com/isfaaghyth/pang) menunjukkan pola note status → periodic tick → long-lived engineer → isolated project agent → real codebase. [Ghiath](https://github.com/isfaaghyth/ghiath) memberi pelajaran berbeda: personal assistant ringan sengaja dipisahkan dari engineering loop berat, dengan vault, bot, credential, dan confirmation gate terisolasi.

Bangun versi minimum lokal lebih dulu. Jangan langsung menyalin seluruh self-hosted stack.

## Minggu 19 — Vault dan State Machine
Duration: 360

Gunakan folder Markdown sebagai cognitive core. Setiap project mempunyai context, architecture, task records, run log, dan decision log. Frontmatter task adalah source of truth.

Buat tick runner yang:

1. mengambil lock;
2. membaca task `ready`;
3. memvalidasi dependency dan transition;
4. membuat immutable event ID;
5. mengubah status menjadi `in-progress` secara atomik;
6. dispatch worker;
7. menulis outcome dan next state;
8. aman dijalankan ulang.

Uji restart tepat setelah dispatch, duplicate tick, malformed note, dependency belum selesai, dan stale lock. Jangan gunakan vector search untuk data state; semantic index hanya membantu recall.

## Minggu 20 — Orchestrator dan Model Routing
Duration: 420

Engineer agent membaca brief dan task graph, tetapi per-project worker hanya menerima subtree/context yang dibutuhkan. Setiap worker mendapat workspace, branch, credential, tools, budget, dan port terpisah.

Routing policy contoh:

- exploration/mechanical edit → model hemat dan cepat;
- architecture/concurrency/security → reasoning model kuat;
- UI visual review → multimodal model;
- independent verification → provider/model berbeda bila memungkinkan;
- sensitive task → provider yang memenuhi policy data;
- fallback → hanya provider allowlist, dengan total budget tetap.

Gateway menyimpan provider keys; agent menerima virtual/scoped key. Rekam model ID, cost, tool calls, correction, status, dan artifact—bukan hidden chain-of-thought.

Demonstrasikan satu issue bergerak `ready → in-progress → review`, menghasilkan PR/diff dan evidence. Human memutuskan merge.

## Minggu 21 — CI, Governance, dan VPS Opsional
Duration: 420

CI matrix mencakup OpenAPI lint, Go, NestJS, Next, Nuxt, Flutter, Android, iOS build/test sesuai runner tersedia, contract tests, secret scan, dependency scan, dan preview smoke.

Terapkan:

- ephemeral workspace dan network egress allowlist;
- no production credential;
- approval untuk dependency, migration, external write, preview deploy;
- human-only production release;
- audit log export dan anomalous cost/tool alerts;
- backup/restore untuk vault dan state;
- kill switch untuk scheduler serta worker.

VPS adalah lab opsional: containerize gateway, sync/memory services, dan orchestrator; expose hanya service yang diperlukan melalui TLS; pisahkan personal assistant dan engineering instance. Jalankan preflight collision, backup, provision, validate, dan reversible teardown.

Negative
: Ghiath sendiri menyatakan bukan loop engineering berat. Jangan memberi assistant rumah akses ke repository, work vault, atau deployment credential.

## Gate Kelulusan
Duration: 30

Restart tidak menduplikasi task, worker tidak dapat membaca workspace lain, model fallback patuh policy, budget menghentikan loop, CI memberi feedback executable, dan deploy production memerlukan manusia. Sertakan incident drill dan cost dashboard.
