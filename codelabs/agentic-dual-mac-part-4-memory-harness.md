summary: Part 4 dari seri Dual-Mac Agentic Workflow — shared memory antar-agen (Graphify AST graph + Obsidian LLM wiki) dan agent harness (Pi, Antigravity, Claude Code) supaya beberapa agen bisa bekerja paralel tanpa saling menimpa konteks.
id: agentic-dual-mac-part-4-memory-harness
categories: AI, Developer Tools, Architecture, macOS, Agentic Engineering
tags: agentic-workflow, dual-mac, graphify, obsidian, shared-memory, agent-harness, pi-coding-agent, antigravity, claude-code, mcp
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Dual-Mac Agentic Workflow — Part 4: Shared Memory & Agent Harness

## Outcome & Prasyarat
Duration: 5

Infrastruktur sudah siap ([Part 2](agentic-dual-mac-part-2-provisioning/) & [Part 3](agentic-dual-mac-part-3-jaringan-remote/)). Sekarang kita mengisinya dengan **otak bersama** dan **runtime agent**.

Di akhir part ini:
* Repo Anda punya dua lapis memori yang dibaca manusia dan agent.
* Minimal satu harness (Pi/Antigravity/Claude Code) terpasang dan tahu aturan memori.

**Prasyarat:** bekerja lewat sesi Remote-SSH ke 2019 (Part 3). Command "server" dijalankan di terminal editor yang terhubung ke 2019.

## Kenapa Perlu Shared Memory
Duration: 5

Saat satu agent bekerja, konteksnya ada di kepalanya sendiri. Saat **beberapa agent** bekerja paralel — atau satu agent lintas sesi/hari — muncul dua penyakit:

* **Context drift** — agent A mengubah kontrak API, agent B tidak tahu, hasilnya tabrakan.
* **Memory loss** — keputusan arsitektur kemarin hilang; agent mengulang kesalahan yang sudah pernah dipecahkan.

Solusinya dua lapis memori dengan tugas berbeda:

1. **Graphify** — memori *struktural*: peta kode berbasis AST (siapa meng-import/memanggil/meng-extend siapa). Deterministik, tanpa vector store, tanpa membuang token.
2. **Obsidian Vault** — memori *keputusan*: ADR, kontrak API, catatan bug — dalam Markdown ber-link.

```
📂 your-mobile-project/
 ├── 📂 .knowledge/               <-- Layer 1: Obsidian Vault (Human & Agent Wiki)
 │    ├── 📄 index.md             <-- Map of Content
 │    ├── 📂 adr/                 <-- Architecture Decision Records (ADR-001.md)
 │    ├── 📂 contracts/           <-- API Contracts (OpenAPI/JSON payloads)
 │    └── 📂 learnings/           <-- Resolusi bug & gotchas
 ├── 📂 graphify-out/             <-- Layer 2: Graphify AST Output
 │    ├── 📄 graph.json           <-- Graf queryable (IMPORTS/CALLS/EXTENDS)
 │    ├── 📄 GRAPH_REPORT.md      <-- Ringkasan graf untuk konteks AI
 │    └── 📄 graph.html           <-- Visualisasi interaktif
 └── 📂 app/                      <-- Source Code (Flutter/Kotlin/Swift/Go)
```

## Langkah 1: Obsidian Vault di Dalam Repo
Duration: 8

**Kenapa di dalam repo:** memori yang ikut di-*commit* berpindah bersama kode, ter-*review* di PR, dan selalu sinkron dengan branch. Vault terpisah cepat basi.

Di root project (lewat sesi remote):

```bash
mkdir -p .knowledge/{adr,contracts,learnings}
```

Buat `.knowledge/index.md` sebagai peta konten:

```markdown
# Project Brain & Knowledge Graph

## Architecture Decisions
* [[ADR-001-auth-flow]]: Standar autentikasi JWT & Refresh Token
* [[ADR-002-state-management]]: Standar State Management Mobile (BLoC / Riverpod)

## API Contracts
* [[auth-endpoints]]: Spesifikasi payload login, OTP, dan token refresh

## Learnings & Known Gotchas
* [[gradle-build-workaround]]: Solusi konflik versi Android Gradle Plugin
```

Positive
: Buka folder `.knowledge/` dengan aplikasi **Obsidian** di M1 untuk melihat *Graph View* — keterhubungan antar-catatan secara visual. Anda mengedit di M1; file tetap di repo pada 2019 (lewat remote).

## Langkah 2: Graphify di Compute Node
Duration: 8

**Kenapa Graphify:** agent yang paham "apa yang terhubung ke apa" membuat perubahan yang aman. Graphify mem-parsing kode dengan Tree-Sitter secara lokal — deterministik, tanpa mengirim kode ke mana pun, tanpa membuang token LLM. Ia berjalan sebagai *skill* di dalam agent (Claude Code, Cursor, Codex, Gemini CLI).

Di MacBook 2019:

```bash
# 1. Install CLI (perhatikan nama paket: graphifyy dengan dua 'y')
uv tool install graphifyy        # alternatif: pipx install graphifyy

# 2. Daftarkan skill /graphify ke agent Anda
graphify install

# 3. Aktifkan integrasi per-project (menulis direktif CLAUDE.md + PreToolUse hook)
cd ~/projects/my-mobile-project
graphify claude install
```

Panggil dari dalam sesi agent:

```text
/graphify .                                   # bangun graf folder saat ini
/graphify ./app --update                      # re-extract hanya file yang berubah
/graphify query "apa yang menghubungkan auth ke database?"
/graphify path "AuthService" "UserRepository" # lacak jalur dependensi
```

Output ke `graphify-out/`: `graph.json` (relasi kode, bisa di-commit), `GRAPH_REPORT.md` (ringkasan yang dibaca agent saat merencanakan), `graph.html` (visualisasi).

## Langkah 3: Aturan Interaksi Agent dengan Memori
Duration: 4

Memori tidak berguna kalau agent tidak diperintahkan memakainya. Tambahkan aturan ini di `AGENTS.md`/`CLAUDE.md`:

```markdown
## Inter-Agent Memory Rules
1. **Pre-Task Check**: Sebelum task baru, baca `.knowledge/index.md` dan cek
   `graphify-out/GRAPH_REPORT.md` (atau `/graphify query ...`) untuk memahami
   arsitektur dan dependensi yang terdampak.
2. **Contract-First**: Setiap perubahan endpoint backend WAJIB didokumentasikan
   di `.knowledge/contracts/` sebelum kode mobile ditulis.
3. **Post-Task Learnings**: Setelah menyelesaikan bug rumit atau membuat keputusan
   teknis, tulis catatan di `.knowledge/learnings/` atau `.knowledge/adr/` dengan
   link `[[nama-topik]]`.
```

## Langkah 4: Memasang Agent Harness
Duration: 8

**Apa itu harness:** runtime yang membungkus LLM — mengelola loop eksekusi tool, pemangkasan konteks, dan percabangan sesi. Inilah yang mengubah "chat pemberi saran" menjadi "agent yang benar-benar mengedit, menjalankan test, dan memperbaiki diri". Karena berjalan lama dan haus memori, harness hidup di **compute node (2019)**.

### Pilihan 1: Pi Coding Agent (ramping & hemat token)
**Pi** (`@earendil-works/pi-coding-agent`) adalah harness terminal paling ringan dan cepat.

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
```

Konfigurasi API key (via env var atau `~/.pi/config.json`):
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
export GEMINI_API_KEY="AIzaSy..."
export OPENAI_API_KEY="sk-..."
```

Jalankan di folder project: `pi`. Kekuatan utamanya **Tree-Structured History** — kalau agent salah refactor di langkah ke-5, Anda tidak perlu mulai dari nol: `/tree` melihat cabang percakapan, `/branch 3` melompat ke langkah ke-3 dan mencoba pendekatan lain.

### Pilihan 2: Antigravity (subagent orchestration)
Antigravity mendukung **Reactive Subagents** dan **Planning Mode Artifacts**. Definisikan subagent per peran:
* **Backend Specialist** — handler API, unit test, migration SQL.
* **Mobile Specialist** — UI widget, state lifecycle, deserialization.
* **QA Specialist** — lint, build, dan Maestro test (Part 5).

### Pilihan 3: Claude Code headless (backbone)
Claude Code dapat dijalankan *headless* di server sebagai backbone yang mengoordinasi subagent swarm — cocok untuk 2019 yang selalu menyala. Ia membaca `CLAUDE.md` (termasuk aturan memori dan hook Graphify di atas) secara otomatis.

Positive
: Anda tidak harus memilih satu. Umum memakai Claude Code headless sebagai backbone di server, dan Pi untuk sesi interaktif cepat. Yang penting: semuanya membaca aturan memori yang sama.

## Verifikasi
Duration: 2

- [ ] `.knowledge/{adr,contracts,learnings}` ada dan `index.md` terisi.
- [ ] `/graphify .` menghasilkan `graphify-out/GRAPH_REPORT.md`.
- [ ] `AGENTS.md`/`CLAUDE.md` memuat Inter-Agent Memory Rules.
- [ ] Minimal satu harness jalan dan bisa membaca `.knowledge/` serta laporan Graphify.

Positive
: **Lanjut ke Part 5 — Autonomous Testing & Alur End-to-End**, tempat kita menutup loop dengan uji UI mandiri dan menjalankan satu fitur nyata dari backend sampai mobile.
