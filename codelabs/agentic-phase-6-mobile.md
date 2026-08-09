summary: Implementasi TaskForge dengan Flutter, Jetpack Compose, dan SwiftUI termasuk offline sync, push contract, UI tests, dan release builds.
id: agentic-phase-6-mobile
categories: Mobile, Flutter, Android, iOS
tags: flutter, jetpack-compose, swiftui, offline-first, mobile-testing, push-notification
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Fase 6 — Tiga Mobile Client

## Prinsip Kesetaraan
Duration: 25

Flutter, Compose, dan SwiftUI berbagi behavior contract, bukan arsitektur paksa. Setiap app memakai navigation, lifecycle, secure storage, concurrency, dan testing idiomatik platform. Generated API client dibungkus agar UI tidak bergantung pada wire model.

## Minggu 16 — Architecture dan API Clients
Duration: 390

Scaffold tiga app dengan environment `local-go` dan `local-nest`. Implementasikan login, project list, task list/detail, create task, assign, dan status update.

Boundary minimum:

- presentation/view state;
- domain use case/model;
- repository sync policy;
- remote API adapter;
- local store dan secure token store.

Minta agent menghasilkan mapping table sebelum kode. Review nullability, cancellation, lifecycle, main-thread work, back navigation, state restoration, dan error mapping. Jangan menerima abstraction Java/Kotlin yang diterjemahkan literal ke Swift/Dart.

## Minggu 17 — Offline Sync dan Device Features
Duration: 420

Simpan normalized local entities dengan server version. Mutation queue berisi operation ID, entity ID, base version, payload, attempt count, dan timestamp. State UI membedakan local pending, synced, failed, serta conflict.

Lab wajib:

1. online: load project dan tasks;
2. airplane mode: create task dan ubah status;
3. server diubah dari client lain;
4. online kembali: flush queue;
5. tampilkan conflict, pilih refresh atau reapply;
6. kill/restart app di tengah queue dan pulihkan dengan idempotent operation.

Tambahkan deep link ke task detail dan push payload contract yang hanya membawa identifier, bukan sensitive content. Simulasikan token refresh dan notification ketika logged out.

## Minggu 18 — Tests dan Release Evidence
Duration: 390

Test pyramid per app:

- unit: reducer/view model, mapping, sync decision;
- repository: remote/local ordering, retry, conflict;
- UI: login dan task flow;
- integration: offline queue recovery;
- accessibility: labels, dynamic text, contrast, screen-reader order.

Build Flutter release, Android signed sandbox APK/AAB, dan iOS simulator/archive evidence. Profil startup, list scroll, memory, network count, serta background sync budget. CI boleh memakai simulator/emulator smoke; satu device nyata per platform tetap direkomendasikan.

**Failure drill:** storage corrupt, token expired saat sync, process killed, duplicate push, timezone berbeda, dan response terlambat setelah screen ditutup.

## Gate Kelulusan
Duration: 30

Ketiga app menyelesaikan flow yang sama pada dua backend, tidak kehilangan offline mutation, menampilkan conflict dengan jelas, lulus automated checks, dan menghasilkan release artifact/evidence. Agent tidak boleh memegang signing credential produksi.
