summary: Panduan lengkap menguasai Zed editor secara profesional — instalasi, navigasi, AI features, konfigurasi multi-bahasa, tasks/debugging, dan workflow git khusus untuk full stack mobile developer (Flutter, Kotlin, Swift, TypeScript, Go).
id: zed-editor-pro-tutorial
categories: Editor, Developer Tools, Mobile, AI
tags: zed, editor, flutter, kotlin, swift, mobile, ai-coding, vim, productivity
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Zed Editor Pro: Panduan Lengkap untuk Full Stack Mobile Developer

## Overview
Duration: 5

### Apa itu Zed?

**Zed** adalah code editor generasi baru yang dibangun dari nol menggunakan **Rust** oleh tim yang sama yang menciptakan Atom dan Tree-sitter (Zed Industries). Berbeda dari editor berbasis Electron seperti VS Code, Zed dirancang untuk **kecepatan ekstrem** dengan rendering berbasis GPU, arsitektur multi-threaded penuh, dan startup time yang hampir instan.

Bagi seorang **full stack mobile developer** — yang setiap hari berpindah antara kode Flutter/Dart, native Android (Kotlin), native iOS (Swift), backend (Go/TypeScript), dan konfigurasi build yang berat — performa dan efisiensi workflow adalah segalanya. Zed menjawab kebutuhan ini dengan:

* **Rendering GPU-accelerated** — scrolling dan multi-cursor editing terasa instan bahkan di file besar (generated code Dart/Kotlin sering sangat panjang)
* **Native multiplayer collaboration** — pair programming real-time tanpa plugin tambahan
* **AI-native dari awal** — Agent Panel, inline assist, dan edit predictions terintegrasi langsung di core editor, bukan sekadar ekstensi
* **Model Context Protocol (MCP)** — menghubungkan AI ke tools eksternal (database, API, design system)
* **Remote Development via SSH** — coding langsung ke build server/CI machine tanpa lag

### Perbandingan Singkat: Zed vs VS Code

| Aspek | Zed | VS Code |
|---|---|---|
| Basis teknologi | Rust, GPUI (native GPU renderer) | Electron + TypeScript |
| Startup time | < 1 detik | 2-5 detik |
| Kolaborasi real-time | Native, built-in | Perlu ekstensi Live Share |
| AI Agent | Built-in Agent Panel + inline assist | Perlu ekstensi (Copilot, Cline, dll) |
| Konsumsi memori | Rendah (native) | Lebih tinggi (Electron overhead) |
| Ekstensi ekosistem | Berkembang, fokus LSP/tema | Sangat besar & matang |

### Apa yang Akan Anda Pelajari

Dalam codelab komprehensif ini, kita akan menjelajahi Zed dari instalasi hingga workflow tingkat lanjut khusus untuk pengembangan full stack mobile:

1. Instalasi & setup awal di macOS/Linux
2. Navigasi dan interface inti (command palette, multibuffers, panes)
3. Keybindings & Vim mode untuk kecepatan maksimal
4. AI features tingkat lanjut (Agent Panel, inline assist, MCP)
5. Konfigurasi multi-bahasa untuk Flutter, Kotlin, Swift, TypeScript, Go
6. Tasks, terminal terintegrasi, dan debugging (DAP) untuk mobile
7. Git, remote development (SSH), dan kolaborasi real-time
8. Ekstensi dan kustomisasi lanjutan
9. Kesimpulan dan rekomendasi workflow harian

Positive
: Codelab ini mengasumsikan Anda sudah familiar dengan konsep dasar IDE/editor (file explorer, terminal, debugging). Fokus kita adalah efisiensi dan fitur-fitur pro Zed.

Mari kita mulai perjalanan menguasai Zed!

## Instalasi & Setup Awal
Duration: 8

### Instalasi di macOS

Cara tercepat menginstal Zed di macOS adalah lewat script resmi:

```bash
curl -f https://zed.dev/install.sh | sh
```

Atau unduh langsung dari [zed.dev/download](https://zed.dev/download) dan drag ke folder `Applications`.

Jika menggunakan Homebrew:

```bash
brew install --cask zed
```

### Instalasi di Linux

```bash
curl -f https://zed.dev/install.sh | sh
```

Zed juga tersedia sebagai Flatpak dan paket distro tertentu (Arch: `zed` di AUR/extra).

### Instalasi CLI (`zed` command)

Setelah instalasi, pastikan CLI `zed` tersedia di PATH agar bisa membuka project langsung dari terminal:

```bash
# Cek apakah CLI sudah terpasang
which zed

# Jika belum, buka Zed lalu jalankan dari Command Palette:
# "cli: install"
```

Setelah terpasang, Anda bisa membuka project seperti membuka VS Code:

```bash
cd ~/projects/flutter-app
zed .
```

### First-Run Setup

Saat pertama kali membuka Zed:

1. **Sign in** dengan akun Zed (GitHub OAuth) — diperlukan untuk fitur AI dan kolaborasi
2. Pilih **tema** (dark/light) dan **base keymap** (Zed default, VS Code, Vim, Sublime Text, Atom, JetBrains)
3. Zed akan otomatis mendeteksi file konfigurasi project (`.zed/settings.json` jika ada)

Negative
: Jika base keymap dipilih "VS Code" saat first-run tapi Anda ingin beralih ke Vim mode nanti, cukup ubah `"vim_mode": true` di `settings.json` — tidak perlu instal ulang.

### Struktur File Konfigurasi

Zed menyimpan konfigurasi di dua level:

```
~/.config/zed/settings.json    # Global settings (semua project)
~/.config/zed/keymap.json      # Global keybindings
<project-root>/.zed/settings.json  # Settings khusus project (override global)
```

Buka global settings langsung lewat Command Palette: `zed: open settings` (`Cmd+,` di macOS).

## Navigasi & Interface Inti
Duration: 7

### Command Palette — Pusat Kendali Segalanya

Tekan `Cmd+Shift+P` (macOS) atau `Ctrl+Shift+P` (Linux) untuk membuka **Command Palette** — titik masuk untuk hampir semua aksi di Zed: membuka file, mengubah setting, menjalankan task, toggle panel, dsb.

### Quick File Open & Navigasi Project

| Aksi | Shortcut (macOS) |
|---|---|
| Quick Open (fuzzy file finder) | `Cmd+P` |
| Go to Symbol dalam file | `Cmd+Shift+O` |
| Go to Line | `Ctrl+G` |
| Go to Definition | `F12` / `Cmd+Click` |
| Find in Project | `Cmd+Shift+F` |
| Toggle Project Panel | `Cmd+B` |

### Multibuffers — Fitur Unggulan Zed

**Multibuffer** memungkinkan Anda melihat dan mengedit banyak potongan kode dari file berbeda dalam **satu buffer tunggal**. Ini sangat berguna saat:

* Melihat semua hasil pencarian "Find in Project" sebagai satu buffer yang bisa diedit langsung
* Melihat semua pemanggilan sebuah function (references) dalam satu tampilan
* Melakukan refactor lintas file tanpa berpindah-pindah tab

Coba: `Cmd+Shift+F` untuk mencari sebuah string di seluruh project Flutter Anda (misalnya nama widget), lalu edit langsung hasilnya di multibuffer — perubahan otomatis tersinkron ke file aslinya.

### Panes & Split Layout

Zed mendukung split layout fleksibel — berguna untuk melihat kode Dart di satu sisi dan file `pubspec.yaml` atau test file di sisi lain:

* `Cmd+K` lalu `Cmd+Right/Left/Up/Down` — split pane ke arah tertentu
* `Cmd+K` lalu `Cmd+Right` diikuti drag tab — memindahkan file ke pane baru

### Outline Panel

Untuk file besar (misalnya generated code `*.g.dart` dari `json_serializable` atau `freezed`), gunakan **Outline** (`Cmd+Shift+O`) untuk lompat langsung ke class/method tanpa scroll manual.

## Keybindings & Vim Mode untuk Efisiensi
Duration: 8

### Mengaktifkan Vim Mode

Bagi developer yang terbiasa navigasi tanpa mouse, Zed memiliki implementasi **Vim mode** kelas satu (bukan sekadar emulasi dasar). Aktifkan lewat `settings.json`:

```json
{
  "vim_mode": true,
  "relative_line_numbers": true,
  "cursor_blink": false
}
```

Vim mode di Zed mendukung mode Normal/Insert/Visual seperti biasa, plus terintegrasi penuh dengan fitur native Zed seperti multibuffer, multi-cursor, dan LSP actions (`gd` untuk go-to-definition, `gr` untuk find references).

### Custom Keymap

Untuk menyesuaikan keybinding, edit `~/.config/zed/keymap.json`. Contoh menambahkan shortcut cepat untuk membuka terminal dan menjalankan task Flutter:

```json
[
  {
    "context": "Workspace",
    "bindings": {
      "cmd-shift-r": "task::Spawn",
      "cmd-j": "workspace::ToggleBottomDock"
    }
  },
  {
    "context": "Editor && vim_mode == normal",
    "bindings": {
      "space f f": "file_finder::Toggle",
      "space g g": "pane::RevealInProjectPanel"
    }
  }
]
```

Positive
: Gunakan Command Palette `zed: open keymap` untuk melihat seluruh default keybinding aktif berdasarkan konteks (context-aware) sebelum menimpanya.

### Multi-Cursor & Selection Power Tools

| Aksi | Shortcut |
|---|---|
| Add cursor di atas/bawah | `Cmd+Alt+Up/Down` |
| Select next occurrence | `Cmd+D` |
| Select all occurrences | `Cmd+Shift+L` |
| Expand selection (syntax-aware) | `Ctrl+Shift+Right` |

Fitur **syntax-aware selection expansion** sangat membantu saat bekerja dengan widget tree Flutter yang bersarang dalam — tekan berulang kali untuk memperluas seleksi dari expression → statement → block → method.

## AI Features Tingkat Lanjut
Duration: 10

### Agent Panel

Zed memiliki **Agent Panel** bawaan (bukan ekstensi) yang berfungsi seperti asisten coding otonom. Buka lewat `Cmd+?` atau Command Palette `agent: toggle panel`.

Agent Panel bisa:
* Membaca dan mengedit banyak file sekaligus dalam satu percakapan
* Menjalankan command terminal (dengan konfirmasi)
* Menggunakan tools eksternal lewat MCP (Model Context Protocol)

### Konfigurasi AI Provider

Zed mendukung banyak provider AI. Konfigurasi di `settings.json`:

```json
{
  "agent": {
    "default_model": {
      "provider": "anthropic",
      "model": "claude-sonnet-5"
    },
    "inline_assistant_model": {
      "provider": "anthropic",
      "model": "claude-haiku-4-5"
    }
  },
  "language_models": {
    "anthropic": {
      "api_url": "https://api.anthropic.com"
    },
    "ollama": {
      "api_url": "http://localhost:11434"
    }
  }
}
```

Untuk provider lokal (privasi penuh untuk kode proprietary), gunakan **Ollama**:

```bash
ollama pull qwen2.5-coder:14b
```

Lalu pilih model tersebut sebagai default di panel Agent.

### Inline Assist

Tekan `Cmd+I` di dalam editor untuk memicu **Inline Assist** — meminta AI mengubah/menghasilkan kode langsung di posisi kursor tanpa membuka panel terpisah. Sangat efektif untuk:

* Mengubah satu widget Flutter menjadi `StatefulWidget` lengkap dengan boilerplate
* Menulis unit test untuk sebuah function Go/Kotlin yang sedang di-highlight
* Menerjemahkan model data dari JSON contoh menjadi class Dart/Kotlin/Swift

### Edit Predictions

Zed menyediakan **Edit Predictions** (mirip GitHub Copilot) yang memprediksi perubahan multi-baris berikutnya berdasarkan konteks edit Anda saat ini, bukan hanya autocomplete satu baris. Aktifkan/nonaktifkan lewat `settings.json`:

```json
{
  "features": {
    "edit_prediction_provider": "zed"
  }
}
```

### Model Context Protocol (MCP)

MCP memungkinkan Agent Panel terhubung ke tools eksternal — misalnya server MCP untuk database, Figma, atau dokumentasi internal. Tambahkan MCP server lewat Command Palette `agent: add context server`, lalu isi konfigurasi:

```json
{
  "context_servers": {
    "postgres": {
      "command": {
        "path": "npx",
        "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
      }
    }
  }
}
```

Negative
: Selalu tinjau permission scope MCP server sebelum menghubungkannya ke database produksi — Agent Panel bisa mengeksekusi query berdasarkan tools yang tersedia.

## Konfigurasi Multi-Bahasa untuk Full Stack Mobile
Duration: 10

### Bahasa Wajib untuk Full Stack Mobile Developer

Seorang full stack mobile developer biasanya bekerja dengan kombinasi:

| Layer | Bahasa | LSP Server |
|---|---|---|
| Cross-platform mobile | Dart (Flutter) | `dart` (built-in analysis server) |
| Native Android | Kotlin | `kotlin-language-server` |
| Native iOS | Swift | `sourcekit-lsp` |
| Backend/API | Go | `gopls` |
| Web/Admin panel | TypeScript/JS | `typescript-language-server` |

### Setup Flutter/Dart

Zed mendeteksi Dart SDK otomatis jika `flutter` ada di PATH. Verifikasi dan install ekstensi Dart dari Extensions panel (`Cmd+Shift+X` → cari "Dart"). Konfigurasi tambahan di `settings.json`:

```json
{
  "languages": {
    "Dart": {
      "tab_size": 2,
      "format_on_save": "on",
      "formatter": {
        "external": {
          "command": "dart",
          "arguments": ["format", "--output=show", "-"]
        }
      }
    }
  }
}
```

### Setup Kotlin (Android Native)

```json
{
  "languages": {
    "Kotlin": {
      "tab_size": 4,
      "format_on_save": "on"
    }
  },
  "lsp": {
    "kotlin-language-server": {
      "initialization_options": {
        "compilerOptions": {
          "jvmTarget": "17"
        }
      }
    }
  }
}
```

### Setup Swift (iOS Native)

Swift LSP (`sourcekit-lsp`) sudah termasuk dalam Xcode Command Line Tools:

```bash
xcode-select --install
```

Zed akan otomatis menggunakan `sourcekit-lsp` untuk file `.swift` begitu ekstensi Swift diaktifkan.

### Setup Go (Backend)

```json
{
  "languages": {
    "Go": {
      "format_on_save": "on",
      "formatter": "language_server"
    }
  },
  "lsp": {
    "gopls": {
      "initialization_options": {
        "gofumpt": true,
        "staticcheck": true
      }
    }
  }
}
```

### Setup TypeScript/JavaScript

```json
{
  "languages": {
    "TypeScript": {
      "format_on_save": "on",
      "formatter": "prettier"
    }
  },
  "prettier": {
    "allowed": true
  }
}
```

Positive
: Anda bisa menimpa setting ini per-project dengan membuat `.zed/settings.json` di root repository — cocok untuk tim yang punya konvensi formatting berbeda antar-project (misalnya monorepo dengan `apps/mobile` dan `apps/backend`).

## Tasks, Terminal Terintegrasi & Debugging
Duration: 9

### Terminal Terintegrasi

Buka terminal built-in dengan `` Ctrl+` `` (backtick). Zed mendukung multiple terminal panes, split terminal, dan terminal per-worktree — berguna untuk menjalankan `flutter run` di satu terminal sambil `flutter logs` atau `adb logcat` di terminal lain.

### Tasks — Otomatisasi Command Berulang

Zed memiliki sistem **Tasks** (`.zed/tasks.json`) untuk menyimpan command yang sering dipakai, bisa dijalankan lewat Command Palette (`task: spawn`) tanpa mengetik ulang di terminal.

Contoh `tasks.json` untuk project Flutter full stack:

```json
[
  {
    "label": "Flutter: Run (Debug)",
    "command": "flutter run",
    "use_new_terminal": true
  },
  {
    "label": "Flutter: Run Tests",
    "command": "flutter test",
    "reveal": "always"
  },
  {
    "label": "Android: Build APK Release",
    "command": "cd android && ./gradlew assembleRelease"
  },
  {
    "label": "iOS: Build (Xcode)",
    "command": "xcodebuild -workspace ios/Runner.xcworkspace -scheme Runner -configuration Release"
  },
  {
    "label": "Backend: Run Go Server",
    "command": "go run ./cmd/server"
  }
]
```

Cukup tekan `Cmd+Shift+P` → `task: spawn` → pilih task yang diinginkan.

### Debugging dengan DAP (Debug Adapter Protocol)

Zed mendukung debugging native melalui **DAP**, termasuk untuk aplikasi mobile. Konfigurasi contoh untuk debug Flutter di `.zed/debug.json`:

```json
[
  {
    "label": "Debug Flutter App",
    "adapter": "Dart",
    "request": "launch",
    "program": "lib/main.dart",
    "cwd": "."
  }
]
```

Jalankan lewat Command Palette `debugger: start` atau tombol Run/Debug di Project Panel. Breakpoint bisa diset langsung dengan klik di gutter sebelah nomor baris.

Negative
: Debugging native Kotlin/Swift lewat DAP di Zed masih bergantung pada ekosistem ekstensi yang terus berkembang — untuk debugging Android/iOS yang sangat kompleks (misalnya native crash), tetap gunakan Android Studio/Xcode sebagai pelengkap.

## Git, Remote Development & Kolaborasi
Duration: 8

### Git Terintegrasi

Zed menampilkan **git blame inline**, diff gutter (garis hijau/merah di sebelah nomor baris), dan staging hunk langsung dari editor tanpa membuka panel terpisah:

* Klik ikon diff di gutter untuk melihat perubahan per-hunk
* `Cmd+Shift+G` — buka Git Panel penuh (staged/unstaged changes, commit)
* Hover di atas baris kode untuk melihat blame info (commit, author, waktu)

### Remote Development via SSH

Salah satu fitur pro Zed adalah **Remote Development** — membuka project yang berada di server remote (misalnya CI build machine atau server macOS untuk build iOS) seolah-olah lokal, dengan performa native (bukan tunneling berat seperti VS Code Remote-SSH).

```bash
# Command Palette: "projects: open remote"
# Lalu masukkan host, contoh:
ssh build-server.internal
```

Konfigurasi host di `~/.ssh/config` seperti biasa:

```
Host build-server
  HostName 10.0.0.5
  User devops
  IdentityFile ~/.ssh/id_ed25519
```

Ini sangat berguna untuk full stack mobile developer yang perlu build iOS di Mac mini CI server dari laptop Linux/Windows, atau menjalankan test suite berat di server yang lebih kuat.

### Kolaborasi Real-Time (Multiplayer)

Zed mendukung **multiplayer editing** native — mengundang rekan tim untuk melihat dan mengedit buffer yang sama secara real-time, lengkap dengan voice call terintegrasi, tanpa ekstensi tambahan:

1. Klik ikon **Share** di pojok kanan atas
2. Bagikan link project ke rekan tim
3. Kolaborator melihat cursor Anda secara live dan bisa ikut mengedit

Positive
: Fitur ini sangat berguna untuk pair programming saat debugging masalah lintas platform — misalnya satu orang di kode Dart, satu lagi memeriksa native code Android, dalam satu sesi yang sama.

## Ekstensi & Kustomisasi Lanjutan
Duration: 6

### Extension Marketplace

Buka Extensions panel dengan `Cmd+Shift+X`. Ekstensi populer untuk workflow full stack mobile:

* **Dart** — syntax highlighting & LSP untuk Flutter
* **Kotlin** — dukungan bahasa Kotlin
* **Docker** — syntax highlighting untuk Dockerfile (backend deployment)
* **TOML** / **YAML** — untuk file konfigurasi (`pubspec.yaml`, CI config)
* **Theme packs** — misalnya One Dark Pro, Catppuccin

### Membuat Ekstensi Sendiri

Ekstensi Zed ditulis dalam Rust dan dikompilasi ke WebAssembly. Struktur dasar:

```
my-extension/
├── extension.toml
├── src/
│   └── lib.rs
└── languages/
    └── my-lang/
        ├── config.toml
        └── highlights.scm
```

Untuk kebutuhan sehari-hari (menambah snippet, theme, atau grammar sederhana), biasanya tidak perlu membuat ekstensi penuh — cukup gunakan **Snippets** bawaan:

```json
// ~/.config/zed/snippets/dart.json
{
  "StatefulWidget Boilerplate": {
    "prefix": "stful",
    "body": [
      "class ${1:WidgetName} extends StatefulWidget {",
      "  const ${1:WidgetName}({super.key});",
      "",
      "  @override",
      "  State<${1:WidgetName}> createState() => _${1:WidgetName}State();",
      "}",
      "",
      "class _${1:WidgetName}State extends State<${1:WidgetName}> {",
      "  @override",
      "  Widget build(BuildContext context) {",
      "    return $0;",
      "  }",
      "}"
    ]
  }
}
```

### Tema & Ikon Kustom

Sesuaikan tampilan lewat `settings.json`:

```json
{
  "theme": {
    "mode": "dark",
    "dark": "One Dark",
    "light": "One Light"
  },
  "icon_theme": "Material Icon Theme",
  "buffer_font_family": "JetBrains Mono",
  "buffer_font_size": 14,
  "ui_font_size": 15
}
```

## Kesimpulan & Next Steps
Duration: 3

### Apa yang Anda Pelajari

* ✅ Instalasi dan setup awal Zed di macOS/Linux beserta CLI
* ✅ Navigasi inti: command palette, multibuffer, split panes, outline
* ✅ Vim mode dan custom keybinding untuk kecepatan maksimal
* ✅ AI features tingkat lanjut: Agent Panel, Inline Assist, Edit Predictions, MCP
* ✅ Konfigurasi multi-bahasa untuk Flutter, Kotlin, Swift, Go, TypeScript
* ✅ Tasks, terminal terintegrasi, dan debugging via DAP
* ✅ Git inline, remote development SSH, dan kolaborasi real-time
* ✅ Ekstensi, snippet, dan kustomisasi tema

### Rekomendasi Workflow Harian untuk Mobile Developer

1. Mulai hari dengan `zed .` di root monorepo (mobile app + backend dalam satu window, dipisah lewat split pane)
2. Gunakan **Tasks** untuk `flutter run`, `go run`, dan test suite — hindari mengetik command manual berulang kali
3. Manfaatkan **Agent Panel** untuk boilerplate repetitif (model class, unit test, migrasi API)
4. Gunakan **Remote Development** saat perlu build iOS di Mac CI server dari mesin lain
5. Aktifkan **git blame inline** untuk memahami konteks kode legacy sebelum melakukan refactor

### Referensi Lanjutan

* [Dokumentasi resmi Zed](https://zed.dev/docs)
* [Zed Extensions Registry](https://zed.dev/extensions)
* [Zed GitHub Repository](https://github.com/zed-industries/zed)

Thank you for completing this codelab! Selamat mencoba Zed di project full stack mobile Anda berikutnya.
