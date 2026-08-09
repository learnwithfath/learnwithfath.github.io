summary: Bangun verified local loop dengan instructions, skills, worktree, parallel agent, retry budget, dan human approval gate.
id: agentic-phase-3-verified-loop
categories: AI, Git, Testing, Security
tags: coding-agent, worktree, multi-agent, mcp, skills, hooks, human-in-the-loop
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Fase 3 — Verified Local Engineering Loop

## Arsitektur Loop
Duration: 25

Loop minimum:

```text
approved task → isolated worktree → inspect → plan → edit
      ↑                                      ↓
 human gate ← review/evidence ← test ← failure feedback
```

Satu agent sudah cukup untuk task sederhana. Tambahkan subagent hanya saat pekerjaan independen, memerlukan context khusus, atau review yang benar-benar terpisah.

## Minggu 7 — Instructions, Skills, dan Hooks
Duration: 300

Pasang `agent-instructions.md` sebagai instruksi repository, lalu scope instruksi per stack. Jangan menduplikasi dokumentasi framework; referensikan command dan aturan lokal.

Buat skill `verify-change` yang menerima stack dan changed files, lalu memilih formatter, static check, focused test, broader test, dan diff audit. Tool harus sedikit dan on-demand. MCP database dimulai read-only terhadap seed database.

Hooks yang aman:

- setelah edit: formatter pada file berubah;
- sebelum selesai: focused test dan secret scan;
- setelah tool failure: capture exit code, jangan retry otomatis tanpa klasifikasi.

Uji dengan satu bug kecil di tiap bahasa. Lulus bila agent konsisten menjalankan verifier yang tepat tanpa memasukkan generated/build directories ke context.

## Minggu 8 — Worktree dan Parallel Agents
Duration: 330

Buat branch/worktree eksplisit:

```bash
git worktree add ../tf-contract -b feat/contract
git worktree add ../tf-go -b feat/go-service
git worktree add ../tf-nest -b feat/nest-service
```

Contract agent memiliki ownership `api/` dan fixtures. Backend agents mulai setelah contract commit disetujui dan tidak boleh mengubahnya. Tugas paralel mengirim hasil berupa commit, evidence, assumptions, dan unresolved risk—bukan sekadar ringkasan.

Integrasikan berurutan: contract, Go, NestJS. Jalankan test gabungan setelah setiap merge. Jika dua agent menyentuh file yang sama, hentikan paralelisasi dan tetapkan satu owner.

**Failure drill:** sengaja beri dua agent ownership file yang overlap. Catat konflik semantik yang tidak terlihat oleh merge tool.

## Minggu 9 — Recovery dan Human Gate
Duration: 300

Definisikan error classes:

| Class | Respons |
|---|---|
| Test assertion | Diagnose satu kali, edit, rerun focused test |
| Flaky/timeout | Rerun maksimal dua kali, lalu quarantine/escalate |
| Tool/network | Backoff terbatas atau fallback yang disetujui |
| Spec conflict | Stop dan minta keputusan |
| Permission denied | Jangan mencari bypass |
| Destructive/migration/deploy | Human approval wajib |

Gunakan time, token, dan attempt budget. Completion judge memeriksa acceptance evidence; tidak boleh hanya percaya self-report worker.

Simulasikan empat insiden: test flaky, package registry mati, scope drift, dan perintah penghapusan dengan target ambigu. Simpan trace di `run-log.md`.

## Gate Kelulusan
Duration: 30

Tunjukkan satu task selesai end-to-end dan satu task berhenti aman. Worktree bersih, verifier hijau, diff bounded, log tidak berisi secret, serta approval manusia tercatat untuk aksi berisiko. Jika operator tidak dapat menjelaskan mengapa loop berhenti atau lanjut, fase belum lulus.
