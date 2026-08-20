summary: Part 4 dari seri Ekosistem Google Antigravity — Antigravity CLI (agy). Instalasi & auth (termasuk headless/SSH), TUI interaktif, slash commands, referensi file @, execution modes, terminal sandbox, subagent async, mode headless -p, plugins/skills/hooks/MCP, dan migrasi dari Gemini CLI.
id: antigravity-part-4-cli
categories: AI, Developer Tools, Agentic Engineering, Google
tags: antigravity, google, gemini, cli, agy, terminal, headless, sandbox, subagents, mcp
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Ekosistem Google Antigravity — Part 4: Antigravity CLI (`agy`)

## Outcome & Prasyarat
Duration: 4

CLI (`agy`) adalah surface untuk **terminal-first dan headless**: dibangun dengan Go demi kecepatan, bisa menjalankan agent tanpa GUI di SSH, container remote, atau CI.

Di akhir part ini:
* `agy` terpasang, terautentikasi (termasuk skenario headless).
* Anda memakai TUI interaktif, referensi file `@`, dan slash commands.
* Anda menjalankan subagent async, mode headless `-p`, dan mengatur sandbox.

**Prasyarat:** [Part 1](antigravity-part-1-konsep-ekosistem/) dipahami; akses terminal.

## Kenapa CLI
Duration: 4

GUI hebat di laptop, tetapi banyak pekerjaan agentik hidup di tempat tanpa layar: server remote, pipeline CI, atau sekadar preferensi terminal. `agy` membawa agent yang sama ke sana — dan menambah keunggulan **subagent asinkron**: kirim tugas panjang ke background, lanjut mengetik di foreground.

Positive
: Ini melengkapi pola dual-mac (lihat seri terpisah): jalankan `agy` headless di compute node lewat SSH, sementara Anda mengetik di laptop ringan.

## Langkah 1: Instalasi & Verifikasi
Duration: 5

**macOS / Linux:**
```bash
curl -fsSL https://antigravity.google/cli/install.sh | bash
```

**Windows (PowerShell):**
```powershell
irm https://antigravity.google/cli/install.ps1 | iex
```

Verifikasi:
```bash
agy --version
```

## Langkah 2: Autentikasi (termasuk Headless)
Duration: 6

**Di desktop:** jalankan `agy`, OAuth otomatis membuka browser.

**Di SSH/headless:** CLI menampilkan **URL otorisasi + kode sekali pakai** yang Anda buka di mesin lokal — inilah yang membuat `agy` bisa login tanpa GUI.

**Via API key** (mis. untuk CI):
```bash
export ANTIGRAVITY_API_KEY=your_api_key_here
```

Negative
: Nama variabel API key bisa berbeda antar versi/surface (SDK di Part 5 memakai `GEMINI_API_KEY`). Selalu cek `agy --help` dan dokumentasi versi Anda sebelum mengandalkannya di CI.

## Langkah 3: Menjalankan — Interaktif, Inspect, Headless
Duration: 7

```bash
# Mode interaktif (TUI)
agy

# Periksa konteks project yang terdeteksi
agy inspect

# Mode prompt tunggal (non-interaktif)
agy -p "Write a Go function that reads a CSV"
```

**Referensi file dengan `@`** di dalam prompt:
* File tunggal: `@src/main.go`
* Direktori: `@src/`
* Glob: `@**/*.ts`

Negative
: Mode headless `agy -p` mencetak **teks polos** — tanpa envelope hasil terstruktur. Beberapa flag yang muncul di dokumen (mis. `--output-format`) mungkin tidak ada di versi Anda; verifikasi dengan `agy --help`.

## Langkah 4: Slash Commands di TUI
Duration: 8

Slash command hanya hidup **di dalam sesi `agy` yang berjalan**, berbeda dari perintah shell wrapper (Langkah 6).

**Percakapan:**
* `/resume` atau `/switch` — pemilih percakapan untuk melanjutkan/berpindah sesi.
* `/rewind` atau `/undo` — mundur ke checkpoint sebelumnya.
* `/rename <name>` — ganti nama percakapan.

**Konfigurasi:**
* `/permissions` — tingkat otonomi: `request-review`, `always-proceed`, atau `strict`.
* `/model` — pilih model default (persisten), mis. `/model gemini-3.1-pro`.
* `/keybindings`, `/statusline` — kustomisasi keyboard & status bar.
* `/config` — pengaturan sesi.

**Tools & monitoring:**
* `/tasks` — pantau, lihat log, atau hentikan background task.
* `/skills` — jelajah skill lokal & global.
* `/mcp` — kelola MCP server.
* `/agents` — panel manajemen subagent.

**Utilitas:** `/help` (semua command), `/context` (rincian token), `/usage` (kuota & limit), `/diff` (peninjau diff), `/open <path>`, `/export` (sinkron ke aplikasi desktop), `/logout`.

Positive
: `/usage` dan `/context` adalah teman terbaik Anda di plan bermeteran — cek berkala agar tahu sisa kuota dan besar konteks yang dikirim.

## Langkah 5: Subagent Async & Execution Modes
Duration: 7

Keunggulan utama `agy`: **subagent asinkron**. Kirim tugas panjang ke background lalu terus bekerja:

```
/agent refactor "Convert all callbacks to context.Context in @internal/api"
```

Subagent melaporkan progres di status bar dan mengirim hasil kembali ke percakapan saat selesai; beberapa bisa berjalan paralel (bagus untuk memecah refactor besar antar-package). Buka panel via `/agents` — setujui/tolak izin dengan pintasan (mis. `ctrl+j` melompat ke detail, `ctrl+k` untuk persetujuan cepat).

## Langkah 6: Terminal Sandbox
Duration: 6

**Kenapa:** agent yang menjalankan perintah shell perlu batas aman. Sandbox membatasi apa yang bisa disentuh proses agent memakai fitur OS native (nsjail di Linux, sandbox-exec di macOS, AppContainer di Windows) — dengan overhead startup nol.

Aktifkan di `settings.json`:
```json
{
  "enableTerminalSandbox": true
}
```

Positive
: Nyalakan sandbox terutama saat memberi agent otonomi tinggi (`always-proceed`). Batas OS-level adalah jaring pengaman kalau permission logic terlewat.

## Langkah 7: Customizations & Migrasi dari Gemini CLI
Duration: 6

`agy` memakai kustomisasi yang sama (detail di [Part 6](antigravity-part-6-customizations-workflow/)):
* **AGENTS.md** di root repo — instruksi project yang otomatis diprepend ke tiap prompt.
* **Skills** — Markdown di `.agents/skills/` menjadi command reusable.
* **Hooks** — interseptor lifecycle (JSON) untuk pre-flight check atau format otomatis setelah edit file.
* **MCP** — via `mcp_config.json` untuk database, docs, atau issue tracker.
* **Plugins** — bundel skills+rules+hooks+MCP; kelola via `agy plugin`.

Shell wrapper (di luar sesi TUI): `agy help`, `agy install`, `agy plugin`, `agy update`, `agy changelog`.

Negative
: **Gemini CLI disunset 18 Juni 2026** untuk sebagian besar pengguna. Migrasi konfigurasi lama dengan:
```bash
agy plugin import gemini
```

## Verifikasi
Duration: 2

- [ ] `agy --version` jalan; login berhasil (coba juga skenario headless bila relevan).
- [ ] Anda menjalankan `agy -p "..."` dan sesi interaktif `agy`.
- [ ] Anda memakai referensi `@file` dan minimal 3 slash command (`/model`, `/usage`, `/agents`).
- [ ] Anda menjalankan satu **subagent async** dan memantaunya via `/tasks`/`/agents`.
- [ ] `enableTerminalSandbox` aktif di `settings.json`.

Positive
: **Lanjut ke Part 5 — Antigravity SDK (Python)**, saat Anda ingin membangun agent kustom secara programatik.

## Sumber
Duration: 1

* [Antigravity Docs — CLI](https://antigravity.google/docs/cli/features/)
* [Antigravity CLI hands-on (DEV Community)](https://dev.to/arindam_1729/antigravity-cli-a-hands-on-guide-to-googles-terminal-coding-agent-5bc7)
* [Antigravity CLI reference (explainX)](https://www.explainx.ai/blog/antigravity-cli-features-sandbox-plugins-subagents-2026)
