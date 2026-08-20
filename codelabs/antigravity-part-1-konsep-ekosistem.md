summary: Part 1 dari seri Ekosistem Google Antigravity — konsep dan cara memilih surface. Apa itu Antigravity, kenapa satu agent harness dipakai empat surface (Desktop 2.0, IDE, CLI, SDK), model yang tersedia (Gemini 3.x + non-Google), dan konsep inti agent/subagent/artifact/skill/hook/plugin/MCP.
id: antigravity-part-1-konsep-ekosistem
categories: AI, Developer Tools, Agentic Engineering, Google
tags: antigravity, google, gemini, agentic-workflow, agent-harness, mcp, mental-model, ekosistem
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Ekosistem Google Antigravity — Part 1: Konsep & Memilih Surface

## Tentang Seri Ini
Duration: 5

Seri ini membedah **ekosistem Google Antigravity** secara menyeluruh dan berurutan, dengan gaya *why-first*: paham **kenapa** dulu, baru **bagaimana**. Setiap part berdiri sendiri dengan outcome dan checklist verifikasi.

| Part | Fokus | Untuk siapa |
|---|---|---|
| **Part 1 (ini)** | Konsep, ekosistem, memilih surface, model | Semua orang — baca lebih dulu |
| Part 2 | Antigravity 2.0 (Desktop) | Orkestrasi banyak agent paralel |
| Part 3 | Antigravity IDE | Developer yang ingin melihat & mengedit kode |
| Part 4 | Antigravity CLI (`agy`) | Terminal-first, headless, CI/remote |
| Part 5 | Antigravity SDK (Python) | Membangun agent kustom & pipeline |
| Part 6 | Customizations, governance & ideal workflow | Merangkai keempat surface jadi satu alur |

Positive
: **Part 1 hampir tanpa command.** Tujuannya membangun *mental model*. Antigravity punya empat "pintu masuk" yang mudah membingungkan; setelah paham perannya, part berikutnya jadi jelas.

Negative
: **Catatan versi.** Angka versi dan detail flag di seri ini mengikuti snapshot dokumentasi resmi saat penulisan (Desktop v2.8.1, CLI v1.1.14, IDE v2.5.5, SDK v0.1.12). Antigravity bergerak cepat — selalu cek [antigravity.google/docs](https://antigravity.google/docs) untuk angka terbaru.

## Apa Itu Antigravity
Duration: 8

**Antigravity adalah platform *agent-first* dari Google** untuk pengembangan software. Berbeda dari asisten yang sekadar memberi saran, agent Antigravity menjalankan tugas secara otonom: merencanakan, mengedit kode, menjalankan tool, dan menghasilkan bukti kerja — dalam batas (*boundaries*) yang Anda tetapkan.

Rilis **Antigravity 2.0 (2026)** memperluas produk awal yang tadinya hanya sebuah IDE menjadi *full stack* empat surface: aplikasi **Desktop**, **CLI**, **SDK**, plus Managed Agents di Gemini API dan deployment enterprise lewat Gemini Enterprise Agent Platform.

Positive
: **Kunci pemahaman:** keempat surface berjalan di atas **agent harness yang sama**. Skill, plugin, rules, dan logika inti konsisten di mana pun Anda memakainya. Anda tidak belajar empat produk berbeda — Anda belajar satu agent yang bisa diakses lewat empat "pintu".

## Empat Surface & Cara Memilih
Duration: 12

Inilah pertanyaan paling sering: "saya harus pakai yang mana?" Jawabannya bergantung pada *bagaimana Anda ingin bekerja*, bukan kemampuan agent (yang sama di semuanya).

```
                 ┌──────────────────────────────────────────┐
                 │        AGENT HARNESS (satu, bersama)       │
                 │  skills · rules · plugins · hooks · MCP    │
                 └──────────────────────────────────────────┘
                    ▲          ▲            ▲           ▲
          ┌─────────┘   ┌──────┘      ┌─────┘     ┌─────┘
   ┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
   │ Desktop 2.0  │ │   IDE    │ │  CLI(agy)│ │  SDK (Python)│
   │ orkestrasi   │ │ edit &   │ │ terminal │ │ agent kustom │
   │ banyak agent │ │ review   │ │ headless │ │ & pipeline   │
   └──────────────┘ └──────────┘ └──────────┘ └──────────────┘
```

### Antigravity 2.0 (Desktop) — orkestrator
Aplikasi desktop untuk **menjalankan banyak agent sekaligus** di berbagai project dari satu layar. Bisa menjadwalkan tugas berulang (mis. cek kualitas kode, deteksi paket usang) dan mengeksekusi paralel tanpa memblokir workspace utama. *Pilih ini* sebagai default kalau Anda mengelola banyak tugas/project. (Part 2)

### Antigravity IDE — kontrol penuh atas kode
Editor tempat Anda **melihat persis kode yang diedit agent**, menerima/menolak perubahan baris demi baris, dengan debugging dan one-click fix di dalam editor. *Pilih ini* saat Anda butuh visibilitas dan kontrol granular. (Part 3)

### Antigravity CLI (`agy`) — terminal & headless
Antarmuka terminal (TUI) yang dibangun dengan **Go** demi kecepatan. Bisa menjalankan agent di background tanpa mengunci terminal, dan berjalan **headless** (SSH, container remote, CI). *Pilih ini* kalau Anda terminal-first atau butuh otomasi di lingkungan tanpa GUI. (Part 4)

### Antigravity SDK (Python) — bangun agent sendiri
Library Python untuk **menulis agent kustom dari nol** dengan akses ke tool & rules yang sama, lalu deploy ke Google Cloud tanpa ubah kode. *Pilih ini* untuk pipeline otomatis dan integrasi programatik. (Part 5)

| | 2.0 Desktop | IDE | CLI | SDK |
|---|---|---|---|---|
| **Antarmuka** | Aplikasi desktop | Editor | Terminal (TUI) | Kode Python |
| **Paling cocok** | Banyak tugas paralel | Edit & review kode | Terminal / headless | Agent kustom |
| **Visibilitas kode** | Ringkasan | Penuh (baris demi baris) | Terbatas | Penuh |
| **Kurva belajar** | Rendah | Menengah | Rendah | Menengah–tinggi |

Positive
: Anda **tidak harus memilih satu**. Alur ideal justru mengombinasikan: desain di IDE, jalankan paralel di Desktop, otomasi headless di CLI (CI), pipeline kustom via SDK. Kita rangkai ini di Part 6.

## Konsep Inti yang Berlaku di Semua Surface
Duration: 10

Karena harness-nya sama, istilah berikut muncul di keempat produk. Pahami sekali, pakai di mana saja:

* **Agent** — eksekutor otonom yang bekerja dalam batas **Project** (folder/repo yang boleh diakses).
* **Subagent** — agent sekunder yang didelegasikan tugas spesifik, sering berjalan **paralel di background**.
* **Artifact** — keluaran terstruktur sebagai bukti kerja: *task list*, *implementation plan*, *walkthrough*, dan *code diff*. Ini yang membuat kerja agent transparan dan bisa direview.
* **Skill** — paket pengetahuan Markdown (`SKILL.md`) yang memperluas kemampuan agent; standar terbuka. (Detail di Part 6)
* **Hook** — pemicu berbasis event daur hidup (mis. jalankan formatter setelah file ditulis).
* **Plugin / Extension** — bundel yang mengelompokkan skills, rules, hooks, dan definisi MCP jadi satu unit (dulu disebut *extensions*, kini *plugins*).
* **Rules** — batasan gaya/kebijakan yang selalu dipatuhi agent.
* **MCP (Model Context Protocol)** — protokol untuk menyambungkan agent ke sistem eksternal (docs, database, issue tracker).
* **Permissions** — tingkat otonomi agent dan aksi apa yang butuh persetujuan manusia.

Positive
: Perhatikan **Artifact** — ini pembeda besar Antigravity. Alih-alih hanya menghasilkan kode, agent menghasilkan rencana dan walkthrough yang bisa Anda audit sebelum menerima perubahan.

## Model yang Tersedia
Duration: 8

Agent butuh model penalaran, dan Antigravity memberi pilihan (ketersediaan bergantung plan). Anda memilih lewat *dropdown model selector* di bawah kotak prompt.

**Model Google (Gemini):**
* **Gemini 3.1 Pro** — reasoning tinggi, untuk task kompleks (spec, konkurensi, migrasi, keamanan).
* **Gemini 3.7 / 3.6 / 3.5 Flash** — cepat, dengan level reasoning Low/Medium/High; untuk eksplorasi & perubahan mekanis.

**Model non-Google (di plan tertentu):**
* **Claude Sonnet 4.6 (thinking)** dan **Claude Opus 4.6 (thinking)**
* **GPT-OSS-120b**

Selain itu, **Nano Banana 2** dipakai untuk tugas generatif gambar (mockup UI, diagram, konten visual) — model ini tidak dapat dipilih manual.

Negative
: **Plan Enterprise mengecualikan** opsi Claude & GPT, dan berfokus pada model frontier Gemini. Selain itu ada kuota **Weekly Limit** dan **Five Hour Limit** yang terpisah untuk keluarga Gemini vs Claude/GPT. Cek halaman *Plans* untuk detail. Plan berbayar antara lain **Ultra** ($100/bln, 5× limit Pro) dan **Ultra Premium** ($200/bln, 20×).

Positive
: Prinsip pemilihan model sama seperti agentic engineering pada umumnya: **model cepat/hemat untuk kerja mekanis, model reasoning kuat untuk keputusan arsitektur** — bukan selalu memakai yang paling mahal.

## Prasyarat Seri
Duration: 2

* Akun Google (login OAuth) dan akses ke salah satu plan Antigravity.
* OS didukung: macOS 12+, Windows 10 (64-bit), atau Linux (glibc ≥ 2.28).
* Untuk Part 4 (CLI) & Part 5 (SDK): terminal, dan Python untuk SDK.
* Chrome sebagai browser default membantu alur autentikasi & fitur browser.

## Verifikasi Pemahaman
Duration: 2

Sebelum lanjut, pastikan Anda bisa menjawab tanpa melihat catatan:

1. Kenapa keempat surface disebut "satu agent, empat pintu"? Apa yang mereka bagi bersama?
2. Kapan memilih **Desktop 2.0** vs **IDE** vs **CLI** vs **SDK**?
3. Apa itu **Artifact**, dan kenapa penting untuk transparansi?
4. Kapan memilih model **Pro** vs **Flash**?

Positive
: **Lanjut ke Part 2 — Antigravity 2.0 (Desktop)**, tempat kita instal, membuat Project, dan menjalankan banyak agent paralel.

## Sumber
Duration: 1

* [Dokumentasi resmi Antigravity](https://antigravity.google/docs)
* [Choosing your surface — Google Cloud Blog](https://cloud.google.com/blog/topics/developers-practitioners/choosing-your-surface-antigravity-20-antigravity-cli-antigravity-ide-or-antigravity-sdk)
* [Getting Started codelab (Google)](https://codelabs.developers.google.com/getting-started-google-antigravity)
