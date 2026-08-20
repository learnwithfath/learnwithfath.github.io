summary: Part 1 dari seri Dual-Mac Agentic Workflow — konsep dan arsitektur. Kenapa memisahkan driver node (MacBook M1 8GB) dan compute node (MacBook 2019 32GB), peran tiap komponen (Tailscale, SSH, Graphify, harness, Maestro), dan kapan pola ini layak dipakai.
id: agentic-workflow-dual-mac-setup
categories: AI, Developer Tools, Mobile, Architecture, macOS
tags: agentic-workflow, dual-mac, apple-silicon, intel-mac, arsitektur, tailscale, remote-development, mental-model
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Dual-Mac Agentic Workflow — Part 1: Konsep & Arsitektur

## Tentang Seri Ini
Duration: 5

Seri ini memecah setup **agentic workflow dual-mac** menjadi lima part yang bisa dikerjakan bertahap. Setiap part berdiri sendiri, punya outcome dan checklist verifikasi, dan dijelaskan dari **kenapa** dulu — baru **bagaimana**.

| Part | Fokus | Outcome |
|---|---|---|
| **Part 1 (ini)** | Konsep & arsitektur | Paham peran tiap komponen dan alasannya sebelum menyentuh terminal |
| Part 2 | Provisioning dua Mac | Server node & driver node siap pakai |
| Part 3 | Jaringan & remote development | Kedua Mac tersambung aman; edit di M1, jalan di 2019 |
| Part 4 | Shared memory & agent harness | Antar-agen berbagi konteks; harness terpasang |
| Part 5 | Autonomous testing & alur end-to-end | Loop uji mandiri + praktik fitur nyata |

Positive
: **Part 1 tidak berisi command.** Tujuannya membangun *mental model*. Kalau Anda sudah paham alasannya, command di part berikutnya jadi masuk akal — bukan sekadar copy-paste.

## Masalah yang Kita Selesaikan
Duration: 8

Sebagai Full Stack Mobile Developer, satu laptop harus menanggung tiga beban sekaligus:

* **Mobile Stack** — Android Studio / Xcode, emulator/simulator, build Gradle/CocoaPods, Flutter/React Native/Kotlin/Swift.
* **Backend Stack** — Docker, database (PostgreSQL/MySQL), Redis, API server (Go/NestJS/Node).
* **AI Agentic Layer** — coding agent yang haus konteks (Claude Code, Antigravity, Pi, Cursor), MCP server, indexer kode, dan test runner otonom.

Jalankan semuanya di satu **MacBook M1 8 GB** dan Anda menabrak dinding: *memory thrashing* — swap SSD membengkak, UI macet, build gagal di tengah jalan. Menaikkan RAM tidak mungkin (Apple Silicon disolder).

Di sisi lain, banyak dari kita punya laptop lama yang menganggur — misalnya **MacBook Pro 2019 16" dengan RAM 32 GB**. RAM-nya besar, tapi boros baterai, panas, dan berisik kalau dipangku seharian.

Negative
: Menjalankan Docker + emulator + agent AI secara paralel di M1 8 GB adalah penyebab paling umum laptop "ngadat" saat kerja agentic. Ini bukan masalah kalau ditata dengan benar.

**Ide intinya:** pisahkan *tempat Anda mengetik* dari *tempat komputasi berat berjalan*. Laptop lama yang menganggur itu justru aset — jadikan ia server.

## Arsitektur: Driver Node vs Compute Node
Duration: 10

Kita membelah peran menjadi dua node:

```
┌──────────────────────────────────────┐       Tailscale Mesh VPN       ┌─────────────────────────────────────────┐
│     MacBook Pro M1 (RAM 8 GB)        │ ────────────────────────────── │   MacBook Pro 2019 16" (RAM 32 GB)      │
│      [CLIENT / DRIVER NODE]          │        (Zero-Config SSH)       │     [COMPUTE & AGENT SERVER NODE]       │
│                                      │                                │                                         │
│ • Antigravity CLI / Cursor / VS Code │                                │ • Docker Stack (DB, Redis, Backend API) │
│ • Interactive Prompting & Planning   │                                │ • Claude Code headless + Subagent Swarm │
│ • Physical Device Testing (USB)      │                                │ • Heavy Emulators & Headless Simulators │
│ • Apple Universal Control & Display  │                                │ • Graphify (AST) & Obsidian LLM Wiki    │
│ • Baterai awet, dingin, & super cepat│                                │ • Maestro MCP + mobile-mcp (self-heal)  │
└──────────────────────────────────────┘                                └─────────────────────────────────────────┘
```

**Driver Node (M1 8 GB)** — tempat Anda berada. Fungsinya *tipis*: editor, terminal, prompting, dan device fisik lewat USB. Karena beban berat tidak di sini, laptop tetap dingin dan baterai tahan seharian.

**Compute Node (2019 32 GB)** — "otot"-nya. Colok charger, taruh di meja, tutup layar (*clamshell*). Semua yang rakus memori hidup di sini: Docker, emulator, indexer kode, dan agent yang berjalan lama.

Positive
: Analoginya seperti *thin client* + *workstation*. Anda mengetik di perangkat ringan, tetapi CPU/RAM 32 GB yang bekerja. Yang berpindah lewat jaringan hanyalah teks dan perintah — bukan beban komputasi.

## Peran Tiap Komponen (dan Kenapa Ada)
Duration: 10

Ini bagian terpenting. Sebelum menginstal apa pun, pahami **untuk apa** setiap potongan ada. Tiap komponen menjawab satu masalah spesifik:

### Tailscale — "kenapa perlu VPN?"
Kedua Mac harus bisa saling menemukan **di mana pun Anda berada** — Wi-Fi rumah, kantor, atau tethering di kafe. Tanpa ini, alamat IP berubah tiap pindah jaringan dan koneksi putus. Tailscale membuat *mesh VPN* terenkripsi (WireGuard): tiap Mac dapat IP tetap (`100.x.y.z`) yang tidak berubah walau jaringan fisiknya berganti. Jadi "server" Anda selalu bisa dihubungi dengan alamat yang sama.

### SSH & Remote Development — "guna remote SSH ini apa?"
Ini pertanyaan kunci. **SSH adalah jembatan yang membuat Anda bisa duduk di M1 tapi seolah bekerja langsung di dalam MacBook 2019.**

Tanpa remote development, Anda harus:
- pindah fisik ke laptop 2019 setiap mau menjalankan build/test, atau
- menyalin file bolak-balik antar laptop (rawan file basi/konflik).

Dengan remote SSH (lewat ekstensi *Remote - SSH* di VS Code/Antigravity):
- **Kode tinggal di 2019.** Tidak ada duplikasi file, tidak ada sinkronisasi manual.
- **Editor jalan di M1** (ringan, responsif), tapi kompilasi, indexing, Docker, dan eksekusi agent semuanya terjadi di 32 GB milik 2019.
- **Terminal di editor Anda sebenarnya terminal di 2019.** Ketik `docker compose up` — yang jalan adalah Docker di server, bukan di M1.

Jadi jawabannya: remote SSH menghilangkan pemisahan yang tadi kita buat dari sisi pengalaman. Anda mendapat kenyamanan satu layar (M1 yang dingin) dengan tenaga mesin lain (2019 yang bertenaga). Ini seluruh inti dari pola dual-mac. Detail konfigurasinya ada di **Part 3**.

### Graphify + Obsidian — "kenapa perlu shared memory?"
Saat beberapa agent bekerja pada repo yang sama, mereka gampang **kehilangan konteks** (*context drift*): agent A mengubah kontrak API, agent B tidak tahu, hasilnya tabrakan. Dua layar memori mengatasinya:
- **Graphify** — peta struktural kode berbasis AST (siapa memanggil siapa), deterministik, tanpa membuang token.
- **Obsidian Vault** — memori keputusan: ADR, kontrak API, catatan bug. Dibaca manusia *dan* agent.

Detailnya di **Part 4**.

### Agent Harness (Pi / Antigravity / Claude Code) — "kenapa tidak langsung pakai chat?"
Harness adalah runtime yang membungkus LLM: mengelola loop eksekusi tool, pemangkasan konteks, dan percabangan sesi. Inilah yang mengubah "chat yang memberi saran" menjadi "agent yang benar-benar mengedit, menjalankan test, dan memperbaiki dirinya". Detailnya di **Part 4**.

### Maestro + mobile-mcp — "kenapa perlu testing khusus?"
Kelemahan terbesar AI pada aplikasi mobile: **ia tidak bisa melihat hasil render UI**. Maestro (uji UI deklaratif YAML) + `mobile-mcp` (memberi agent akses ke accessibility tree) menutup celah ini, memungkinkan *self-healing loop*: agent mengubah UI → jalankan test → baca kegagalan → perbaiki → ulang. Detailnya di **Part 5**.

## Kapan Pola Ini Layak (dan Tidak)
Duration: 5

Jujur soal trade-off supaya Anda tidak menghabiskan waktu untuk setup yang tidak Anda butuhkan.

**Layak dipakai bila:**
- Anda punya laptop kedua yang menganggur dengan RAM besar.
- Beban kerja Anda memang berat: Docker + emulator + agent paralel.
- Anda ingin baterai laptop utama tahan lama dan tetap dingin.

**Tidak perlu (atau berlebihan) bila:**
- Laptop utama Anda sudah 32 GB+ dan nyaman menjalankan semuanya sendiri.
- Anda hanya sesekali memakai agent untuk perubahan kecil.
- Anda tidak punya perangkat kedua — dalam hal ini, sewa cloud VM Linux bisa jadi alternatif compute node (konsepnya sama; hanya SSH target-nya berbeda).

Negative
: Pola ini menambah satu lapis kompleksitas (jaringan + remote). Jangan pasang kalau masalah RAM Anda belum nyata. Optimasi yang tidak dibutuhkan hanya menambah titik kegagalan.

## Verifikasi Pemahaman
Duration: 2

Sebelum lanjut ke Part 2, pastikan Anda bisa menjawab ini tanpa melihat catatan:

1. Apa beda peran **driver node** dan **compute node**, dan kenapa M1 8 GB dijadikan driver?
2. Apa fungsi **Tailscale**, dan kenapa IP biasa tidak cukup?
3. **Guna remote SSH** dalam alur ini apa — apa yang berpindah lewat jaringan dan apa yang tetap di tempat?
4. Kenapa emulator berat ditaruh di 2019 (Intel), bukan di M1?

Kalau keempatnya sudah jelas, Anda siap membangunnya.

Positive
: **Lanjut ke Part 2 — Provisioning Dua Mac**, tempat kita menyiapkan compute node (2019) dan driver node (M1) dari nol.
