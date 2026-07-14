summary: Panduan lengkap menguasai Claude Code CLI secara profesional — instalasi, mode interaktif, slash commands, CLAUDE.md, MCP, subagents, hooks, automation, dan workflow git khusus untuk full stack mobile developer (Flutter, Kotlin, Swift, Go).
id: claude-code-cli-pro-tutorial
categories: AI, Developer Tools, CLI, Mobile
tags: claude-code, cli, ai-coding, mcp, subagents, hooks, flutter, kotlin, swift
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Claude Code CLI Pro: Panduan Lengkap untuk Full Stack Mobile Developer

## Overview
Duration: 5

### Apa itu Claude Code?

**Claude Code** adalah *agentic coding CLI* resmi dari Anthropic yang berjalan langsung di terminal Anda. Berbeda dari chatbot AI biasa yang hanya menjawab pertanyaan, Claude Code beroperasi sebagai **agent otonom** yang bisa membaca codebase, mengedit banyak file sekaligus, menjalankan command, melakukan commit git, hingga mengorkestrasi sub-agent lain untuk menyelesaikan tugas kompleks.

Bagi **full stack mobile developer** — yang harus berpindah konteks antara kode Flutter/Dart, native Android (Kotlin), native iOS (Swift), dan backend (Go/TypeScript) — Claude Code sangat bernilai karena mampu memahami *seluruh* codebase lintas platform dalam satu sesi, bukan hanya satu file yang sedang dibuka di editor.

### Mengapa Claude Code Berbeda

* **Terminal-native** — bekerja di mana pun Anda punya shell: laptop lokal, SSH ke build server, bahkan CI/CD pipeline
* **Agentic loop penuh** — bisa membaca, menulis, menjalankan test, memperbaiki error, dan mengulang siklus itu sendiri tanpa campur tangan manual di setiap langkah
* **Context-aware lewat `CLAUDE.md`** — memahami konvensi project, arsitektur, dan instruksi khusus tim
* **Extensible lewat MCP (Model Context Protocol)** — terhubung ke Jira, Figma, database, Slack, dan tools internal lainnya
- **Subagents & orchestration** — mendelegasikan tugas ke agent khusus (misalnya agent eksplorasi kode, agent code-review) untuk paralelisasi dan menjaga context window tetap bersih
* **Hooks** — otomatisasi berbasis event (misalnya jalankan linter otomatis setiap kali file diedit)

### Apa yang Akan Anda Pelajari

Dalam codelab komprehensif ini, kita akan menjelajahi Claude Code CLI dari instalasi hingga workflow tingkat lanjut khusus untuk pengembangan full stack mobile:

1. Instalasi dan autentikasi
2. Mode interaktif, navigasi, dan permission modes
3. Slash commands bawaan dan custom slash commands
4. `CLAUDE.md` — memberi context project ke Claude
5. Model Context Protocol (MCP) — menghubungkan tools eksternal
6. Subagents & orkestrasi multi-agent
7. Hooks — automation berbasis event
8. Workflow praktis untuk Flutter, Kotlin, Swift, dan backend Go
9. Git, conventional commits, dan code review otomatis
10. Kesimpulan dan rekomendasi workflow harian

Positive
: Codelab ini mengasumsikan Anda sudah familiar dengan terminal dasar dan konsep git. Fokus kita adalah efisiensi dan fitur-fitur pro Claude Code.

Mari kita mulai perjalanan menguasai Claude Code CLI!

## Instalasi & Autentikasi
Duration: 6

### Instalasi

Claude Code diinstal lewat npm (Node.js 18+ diperlukan):

```bash
npm install -g @anthropic-ai/claude-code
```

Verifikasi instalasi:

```bash
claude --version
```

### Autentikasi

Jalankan `claude` pertama kali di dalam sebuah project untuk memulai alur login:

```bash
cd ~/projects/flutter-app
claude
```

Anda akan diarahkan untuk login lewat browser (akun Claude.ai/Anthropic Console) atau memasukkan API key langsung:

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

Negative
: Jangan pernah commit API key ke repository. Simpan di environment variable shell profile (`~/.zshrc`/`~/.bashrc`) atau secret manager, bukan di file project.

### Memilih Model

Gunakan `/model` di dalam sesi interaktif untuk berpindah model (misalnya Sonnet untuk kecepatan sehari-hari, Opus untuk tugas arsitektur kompleks):

```
/model claude-opus-4-8
```

### Menjalankan di Direktori Project

Claude Code otomatis mendeteksi root project (lokasi `.git`). Untuk monorepo full stack mobile (`apps/mobile`, `apps/backend`), jalankan `claude` dari root repo agar ia memiliki visibilitas penuh lintas folder.

## Mode Interaktif & Permission
Duration: 7

### Menjalankan Sesi Interaktif

```bash
claude
```

Ini membuka REPL interaktif di mana Anda bisa memberi instruksi bahasa natural: "perbaiki bug null pointer di `LoginViewModel.kt`" atau "tambahkan unit test untuk `UserRepository.dart`".

### Permission Modes

Claude Code memiliki beberapa mode izin untuk mengontrol seberapa otonom agent bertindak:

| Mode | Deskripsi | Kapan Digunakan |
|---|---|---|
| **Default** | Meminta konfirmasi untuk setiap aksi berisiko (edit file, jalankan command) | Workflow harian, tugas sensitif |
| **Auto-accept edits** | Otomatis menerima edit file, tetap konfirmasi command shell | Refactor besar yang sudah direview polanya |
| **Plan Mode** | Hanya membaca & merencanakan, tidak mengeksekusi apa pun sampai disetujui | Perubahan arsitektur besar, migrasi database |
| **Bypass permissions** | Menjalankan semua aksi tanpa konfirmasi | Sandbox/container terisolasi saja — **berisiko tinggi** |

Aktifkan Plan Mode dengan `Shift+Tab` dua kali, atau langsung dengan flag:

```bash
claude --permission-mode plan
```

Negative
: Jangan pernah menjalankan `bypass permissions` di mesin yang memiliki akses ke kredensial produksi atau database live — gunakan hanya di container/VM terisolasi.

### Mode Non-Interaktif (Headless)

Untuk otomasi CI/CD atau scripting, gunakan flag `-p` (print mode):

```bash
claude -p "jalankan flutter analyze dan perbaiki semua warning" --output-format json
```

Ini sangat berguna untuk pipeline CI yang menjalankan Claude sebagai satu langkah non-interaktif.

## Slash Commands & Custom Commands
Duration: 8

### Slash Commands Bawaan

| Command | Fungsi |
|---|---|
| `/clear` | Reset context window (mulai percakapan baru) |
| `/compact` | Ringkas riwayat percakapan agar hemat context |
| `/model` | Ganti model aktif |
| `/agents` | Kelola subagent kustom |
| `/mcp` | Kelola koneksi MCP server |
| `/permissions` | Atur permission per-tool |
| `/review` | Review pull request atau diff saat ini |
| `/init` | Membuat `CLAUDE.md` awal berdasarkan analisis codebase |

### Membuat Custom Slash Command

Custom command disimpan sebagai file Markdown di `.claude/commands/`. Contoh command khusus untuk menjalankan test suite Flutter:

```markdown
<!-- .claude/commands/flutter-test.md -->
---
description: Jalankan flutter test dan ringkas hasilnya
---

Jalankan `flutter test --coverage` di root project mobile.
Jika ada test yang gagal, analisis root cause dan usulkan perbaikan
tanpa langsung mengubah kode kecuali diminta.
```

Panggil dengan `/flutter-test` di sesi interaktif.

### Command dengan Argumen

```markdown
<!-- .claude/commands/gen-model.md -->
---
description: Generate model class dari contoh JSON
argument-hint: [nama-file-json] [target-bahasa]
---

Baca file JSON di $1, lalu generate class model yang idiomatik
untuk bahasa $2 (Dart/Kotlin/Swift/TypeScript) lengkap dengan
serialization (json_serializable untuk Dart, kotlinx.serialization
untuk Kotlin, Codable untuk Swift).
```

Panggil dengan `/gen-model sample-response.json dart`.

Positive
: Simpan custom command di `.claude/commands/` dalam repo agar bisa dipakai bersama seluruh tim (di-commit ke git), bukan hanya di `~/.claude/commands/` yang bersifat personal.

## CLAUDE.md — Memberi Context Project
Duration: 7

### Apa itu `CLAUDE.md`?

`CLAUDE.md` adalah file di root repository yang otomatis dibaca Claude Code di setiap sesi — berfungsi seperti "onboarding doc" permanen untuk agent. Buat otomatis dengan:

```
/init
```

Claude akan menganalisis struktur project dan menghasilkan draft awal.

### Contoh `CLAUDE.md` untuk Monorepo Full Stack Mobile

```markdown
# Project: SuperApp Mobile & Backend

## Struktur Repo
- `apps/mobile/` — Flutter app (iOS & Android), state management: Riverpod
- `apps/backend/` — Go REST API, Postgres, deployment via Docker
- `apps/android-native/` — modul native Kotlin untuk fitur widget Android
- `apps/ios-native/` — modul native Swift untuk fitur widget iOS/App Extension

## Konvensi Kode
- Dart: gunakan `very_good_analysis` lint rules, format dengan `dart format`
- Go: wajib `gofumpt` dan `staticcheck` sebelum commit
- Kotlin: ikuti Kotlin coding conventions resmi, `ktlint` untuk formatting

## Command Penting
- `flutter test` — jalankan test suite mobile
- `cd apps/backend && go test ./...` — jalankan test suite backend
- `melos run analyze` — analisis lint seluruh monorepo (jika pakai Melos)

## Aturan Penting
- JANGAN pernah commit file `.env` atau kredensial API
- Semua perubahan API contract harus disertai update di `apps/backend/openapi.yaml`
- PR wajib menyertakan test untuk perubahan logic bisnis
```

### CLAUDE.md Bertingkat

Claude Code mendukung `CLAUDE.md` di beberapa level folder — misalnya `apps/mobile/CLAUDE.md` khusus berisi konvensi Flutter, terpisah dari `CLAUDE.md` root yang berisi konteks keseluruhan monorepo. Claude akan membaca kombinasi keduanya sesuai file yang sedang dikerjakan.

## Model Context Protocol (MCP)
Duration: 8

### Apa itu MCP?

**Model Context Protocol** adalah standar terbuka yang memungkinkan Claude Code terhubung ke tools dan data eksternal — database, issue tracker, design tool, API internal — sebagai *tools* tambahan yang bisa dipanggil agent selama percakapan.

### Menambahkan MCP Server

```bash
# MCP server untuk PostgreSQL (memeriksa skema database backend)
claude mcp add postgres -- npx -y @modelcontextprotocol/server-postgres "postgresql://localhost/mydb"

# MCP server untuk Figma (mengambil design spec komponen mobile)
claude mcp add figma -- npx -y figma-mcp-server

# Cek MCP server yang aktif
claude mcp list
```

Atau konfigurasikan lewat `/mcp` di dalam sesi interaktif untuk melihat status koneksi dan tools yang tersedia dari tiap server.

### Contoh Penggunaan Praktis

* **Figma MCP** — "ambil spesifikasi warna dan spacing dari komponen Button di Figma, lalu terapkan ke `AppButton.dart`"
* **Postgres MCP** — "periksa skema tabel `orders`, lalu buatkan model Kotlin yang sesuai untuk response API"
* **Jira/Linear MCP** — "baca detail tiket MOBILE-482 dan mulai implementasikan sesuai acceptance criteria"

Negative
: Selalu tinjau *scope* dan permission MCP server sebelum menghubungkannya ke database produksi — agent bisa menjalankan query berdasarkan tools yang diekspos MCP server tersebut.

## Subagents & Orkestrasi Multi-Agent
Duration: 8

### Kenapa Subagent?

Untuk tugas besar (misalnya audit seluruh codebase, atau riset lintas banyak file), menjalankan semuanya di satu context window utama akan cepat memenuhi context. **Subagent** memungkinkan Claude mendelegasikan pekerjaan ke agent terpisah dengan context window sendiri, lalu hanya mengembalikan ringkasan hasilnya.

### Subagent Bawaan

* **Explore** — pencarian read-only cepat di codebase (menemukan file, symbol, pola)
* **general-purpose** — riset dan tugas multi-langkah kompleks
* **Plan** — mendesain rencana implementasi tanpa mengeksekusi

### Membuat Custom Subagent

Simpan di `.claude/agents/nama-agent.md`:

```markdown
<!-- .claude/agents/mobile-code-reviewer.md -->
---
name: mobile-code-reviewer
description: Review perubahan kode Flutter/Kotlin/Swift untuk best practice mobile (performance, memory leak, platform channel safety)
tools: Read, Grep, Glob
---

Anda adalah reviewer kode mobile senior. Fokus pemeriksaan:
1. Kebocoran memori (listener/stream yang tidak di-dispose)
2. Penggunaan platform channel yang tidak aman (tidak ada error handling)
3. Widget rebuild yang tidak perlu (missing const, key)
4. Konvensi null-safety Dart / non-null Kotlin yang dilanggar
```

### Menjalankan Task Paralel dengan Subagent

Contoh instruksi yang memicu paralelisasi otomatis:

```
Audit ketiga modul ini secara paralel dan laporkan temuan performa:
1. apps/mobile/lib/features/checkout
2. apps/android-native/widget
3. apps/backend/internal/payment
```

Claude Code akan menjalankan beberapa subagent Explore/general-purpose secara bersamaan untuk masing-masing modul, lalu menyintesis hasilnya menjadi satu laporan.

Positive
: Gunakan subagent kustom untuk tugas berulang yang butuh persona/instruksi khusus (misalnya "security-reviewer" atau "flutter-test-writer") agar konsisten setiap kali dipanggil oleh tim.

## Hooks — Automation Berbasis Event
Duration: 6

### Apa itu Hooks?

**Hooks** adalah shell command yang otomatis dijalankan pada event tertentu dalam siklus hidup Claude Code — misalnya sebelum/sesudah tool dipanggil, atau saat sesi berakhir. Berguna untuk menegakkan aturan tim secara otomatis, bukan hanya lewat instruksi di `CLAUDE.md`.

### Konfigurasi Hooks

Disimpan di `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "if [[ \"$CLAUDE_FILE_PATH\" == *.dart ]]; then dart format \"$CLAUDE_FILE_PATH\"; fi"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[hook] menjalankan command shell...\" >> .claude/audit.log"
          }
        ]
      }
    ]
  }
}
```

Contoh di atas: setiap kali Claude mengedit file `.dart`, hook otomatis menjalankan `dart format` — memastikan format kode selalu konsisten tanpa perlu diingatkan berulang kali.

### Use Case Lain untuk Mobile Workflow

* **PostToolUse pada file Kotlin** → jalankan `ktlint format` otomatis
* **PreToolUse pada `Bash` yang menjalankan `git push`** → cek branch protection sebelum izinkan push
* **SessionEnd** → jalankan `flutter test` otomatis sebagai sanity check sebelum sesi ditutup

Negative
: Hooks dieksekusi dengan akses penuh shell Anda — audit isi `.claude/settings.json` dengan hati-hati sebelum menggunakan konfigurasi hooks dari sumber pihak ketiga.

## Workflow Praktis untuk Full Stack Mobile
Duration: 9

### Skenario 1: Implementasi Fitur Lintas Platform

Contoh instruksi end-to-end untuk fitur baru yang menyentuh backend dan mobile:

```
Tambahkan endpoint GET /api/v1/notifications di backend Go (apps/backend),
lalu buat model Dart, repository, dan provider Riverpod yang
mengonsumsi endpoint tersebut di apps/mobile. Sertakan unit test
untuk kedua sisi.
```

Claude Code akan membaca konvensi dari `CLAUDE.md`, membuat perubahan di kedua modul secara konsisten, dan menjalankan test yang relevan.

### Skenario 2: Debugging Native Crash

```
Aplikasi Android crash dengan stacktrace berikut: [paste stacktrace].
Cari root cause di kode Kotlin, dan jika berkaitan dengan platform
channel dari Flutter, periksa juga sisi Dart-nya.
```

### Skenario 3: Menjalankan Task Build/Test lewat Bash Tool

Claude Code bisa langsung menjalankan command build/test yang biasa Anda ketik manual:

```bash
flutter test --coverage
cd android && ./gradlew testDebugUnitTest
cd ../../backend && go test ./... -race
```

Cukup minta: "jalankan seluruh test suite (mobile, android native, backend), analisis kegagalan, dan perbaiki."

### Skenario 4: Automasi lewat Headless Mode di CI

```yaml
# .github/workflows/claude-review.yml
- name: AI Code Review
  run: |
    claude -p "review perubahan di PR ini, fokus pada null-safety Dart
    dan potensi race condition Go" --output-format json > review.json
```

Positive
: Gabungkan mode headless dengan hooks untuk membangun pipeline "self-healing" — misalnya otomatis memperbaiki lint error sebelum PR dibuka, tanpa developer perlu menjalankannya manual.

## Git, Conventional Commits & Code Review
Duration: 6

### Commit Otomatis dengan Conventional Commits

Claude Code bisa langsung membuat commit dengan format [Conventional Commits](https://www.conventionalcommits.org/) yang rapi:

```
Buatkan commit untuk perubahan ini mengikuti conventional commits,
kelompokkan per tujuan jika ada beberapa perubahan berbeda
```

Ini sangat cocok dipasangkan dengan workflow tim yang memisahkan commit per-purpose (fitur, fix, docs, chore) alih-alih satu commit besar `git add .`.

### `/review` — Review Pull Request

```
/review 245
```

Claude akan mengambil diff dari PR #245 (via `gh` CLI), menganalisisnya, dan memberi ringkasan temuan — bug potensial, masalah keamanan, atau saran simplifikasi — sebelum Anda merge.

### Membuat Pull Request Langsung

```
Buatkan PR untuk branch ini ke main, judul singkat, deskripsi
mencakup summary perubahan dan test plan
```

Claude akan menjalankan `gh pr create` dengan body yang terstruktur (Summary + Test Plan), mengikuti konvensi tim.

Negative
: Selalu tinjau diff sebelum menyetujui commit/push otomatis — terutama untuk perubahan pada file konfigurasi sensitif (`.env.example`, `Info.plist`, `AndroidManifest.xml`) yang bisa berdampak pada permission aplikasi.

## Kesimpulan & Next Steps
Duration: 3

### Apa yang Anda Pelajari

* ✅ Instalasi, autentikasi, dan pemilihan model Claude Code
* ✅ Mode interaktif, permission modes, dan mode headless untuk CI
* ✅ Slash commands bawaan dan membuat custom slash command
* ✅ `CLAUDE.md` untuk memberi context project secara permanen
* ✅ Model Context Protocol (MCP) untuk menghubungkan tools eksternal
* ✅ Subagents & orkestrasi multi-agent untuk tugas besar
* ✅ Hooks untuk automation berbasis event
* ✅ Workflow praktis lintas Flutter, Kotlin, Swift, dan backend Go
* ✅ Git, conventional commits, dan code review otomatis

### Rekomendasi Workflow Harian untuk Mobile Developer

1. Mulai project baru dengan `/init` untuk membangun `CLAUDE.md` yang solid
2. Simpan custom slash command tim (`.claude/commands/`) untuk task berulang: generate model, jalankan test suite, review PR
3. Hubungkan MCP server yang relevan (Figma untuk design, Postgres untuk skema API) agar Claude punya konteks penuh
4. Gunakan Plan Mode untuk perubahan besar/migrasi sebelum mengizinkan eksekusi penuh
5. Aktifkan hooks untuk menegakkan formatting/lint otomatis di setiap edit
6. Manfaatkan mode headless (`-p`) di CI untuk automated review setiap PR dibuka

### Referensi Lanjutan

* [Dokumentasi resmi Claude Code](https://docs.claude.com/claude-code)
* [Model Context Protocol](https://modelcontextprotocol.io)
* [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)

Thank you for completing this codelab! Selamat mencoba Claude Code di project full stack mobile Anda berikutnya.
