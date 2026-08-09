summary: Integrasikan tujuh implementasi TaskForge, red-team agentic workflow, release preview, dan hasilkan portfolio evidence yang reproducible.
id: agentic-phase-8-capstone
categories: Capstone, Full Stack, Mobile, AI
tags: capstone, integration-testing, red-team, release, portfolio, retrospective
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Fase 8 — Capstone, Release & Portfolio

## Definition of Success
Duration: 25

Capstone bukan dinilai dari jumlah kode agent. Nilainya berasal dari interoperabilitas, evidence, failure recovery, keamanan, dan kemampuan reviewer menelusuri keputusan dari intent sampai artifact.

Matrix akhir: lima client (Next, Nuxt, Flutter, Compose, SwiftUI) × dua backend (Go, NestJS), ditambah satu contract suite sebagai referee.

## Minggu 22 — Full-System Integration
Duration: 420

Seed environment yang sama dan jalankan pada sepuluh kombinasi client/backend utama. Untuk mobile, buktikan masing-masing app terhadap kedua backend; untuk offline recovery, minimal satu full recording per app.

Flow acceptance:

1. login;
2. create project;
3. add member;
4. create dan assign task;
5. update status;
6. lakukan offline mutation;
7. ubah entity dari client lain;
8. reconnect dan resolve conflict;
9. verifikasi audit event dan trace correlation;
10. logout/revoke session.

Gunakan compatibility matrix dengan link CI trace, screenshot/video, API trace ID, dan known deviation. Tidak boleh ada branch behavior berdasarkan nama backend.

## Minggu 23 — Red Team dan Hardening
Duration: 420

Jalankan threat model sebagai test campaign:

- prompt injection dalam issue, README, API payload, dan fetched web page;
- secret request melalui shell/environment;
- ambiguous deletion dan broad glob;
- compromised MCP/tool response;
- auth bypass dan cross-project access;
- repeated migration/external write;
- retry storm dan token-cost spike;
- database/Redis outage, rollback, restore;
- dependency integrity dan generated-code drift.

Pisahkan attacker, defender, dan verifier sessions. Human menetapkan severity. Temuan critical/high harus ditutup atau release diblokir; medium/low memerlukan owner dan expiration.

Lakukan restore drill dari backup pada environment baru. Catat recovery time dan data loss window aktual.

## Minggu 24 — Release dan Engineering Review
Duration: 360

Release pack minimum:

- preview URL web dan API;
- versioned OpenAPI;
- reproducible build/runbook;
- Flutter release, Android APK/AAB, iOS build/archive evidence;
- architecture/ADR, threat model, permission matrix;
- CI, contract, E2E, mobile, load, dan accessibility reports;
- model scorecard dan cost per accepted task;
- agent run logs dengan human interventions;
- known limitations, rollback, dan incident contact;
- demo 10–15 menit serta retrospective.

Bandingkan baseline fase 1 dengan capstone: lead time, correction rate, escaped defects, test pass on first run, token/cost, review time, dan percentage task stopped safely. Jangan menyimpulkan produktivitas hanya dari lines of code.

## Rubric Akhir
Duration: 45

| Area | Bobot | Bukti lulus |
|---|---:|---|
| Product correctness | 20% | Lima flow dan offline conflict sesuai brief |
| Seven-stack interoperability | 20% | Semua client bekerja dengan kedua backend |
| Quality and testing | 15% | Contract/E2E/mobile suites reproducible |
| Agentic workflow | 15% | State, isolation, budget, retry, evidence bekerja |
| Security/governance | 15% | Critical zero; production human-only |
| Operations | 10% | Observability, rollback, restore, runbook terbukti |
| Communication | 5% | Demo dan decision trail dapat diikuti reviewer |

Nilai minimal 80/100 dan tidak boleh ada critical security finding. Kegagalan satu stack tidak ditutupi oleh keberhasilan stack lain.

## Penutup
Duration: 15

Anda lulus ketika dapat merancang loop yang tetap berguna saat model, host, framework, atau provider diganti. Workflow yang baik mempersempit context, menghasilkan feedback executable, membatasi kerusakan, meminta manusia pada keputusan bernilai tinggi, dan meninggalkan bukti yang dapat diaudit.
