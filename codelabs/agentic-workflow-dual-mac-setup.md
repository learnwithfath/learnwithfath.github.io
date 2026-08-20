summary: Panduan lengkap dan sangat terperinci setup agentic workflow dual-mac untuk fullstack mobile developer — optimasi MacBook M1 8GB & MacBook 2019 32GB, shared memory (Graphify AST Graph + Obsidian LLM Wiki), agent harness MCP-first (Claude Code headless, Pi, Antigravity 2.0), dan autonomous mobile testing self-healing (Maestro MCP & mobile-next mobile-mcp).
id: agentic-workflow-dual-mac-setup
categories: AI, Developer Tools, Mobile, Architecture, macOS
tags: agentic-workflow, dual-mac, apple-silicon, intel-mac, memory, graphify, obsidian, claude-code, pi-coding-agent, antigravity, maestro-mcp, mobile-mcp, mcp, tailscale
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Agentic Workflow Dual-Mac: Setup Terperinci Full Stack Mobile Developer

## Overview & Arsitektur Sistem
Duration: 0:05:00

### Tantangan Nyata Full Stack Mobile Developer

Sebagai Full Stack Mobile Developer, Anda mengelola ekosistem yang sangat kompleks:
* **Mobile Stack**: Android Studio / Xcode, Simulator/Emulator, Gradle/CocoaPods builds, Flutter/React Native/Native Kotlin/Swift.
* **Backend Stack**: Docker Engine, Database (PostgreSQL/MySQL), In-Memory Cache (Redis), API Servers (Go/NestJS/Node).
* **AI Agentic Layer**: Context-heavy AI agents (Claude Code, Antigravity 2.0, Pi, Cursor), MCP (Model Context Protocol) servers (Maestro MCP, mobile-mcp), knowledge-graph indexer (Graphify), dan autonomous test runners.

Ketika seluruh beban ini dijalankan di satu laptop dengan **RAM 8 GB (seperti MacBook Pro M1)**, sistem akan mengalami *memory thrashing* (swap SSD membengkak, UI macet, build gagal). Di sisi lain, Anda memiliki **MacBook Pro 2019 16" dengan RAM 32 GB** yang memiliki kapasitas memori sangat besar namun boros baterai dan bising jika dipangku.

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

### Apa yang Akan Anda Pelajari
Dalam tutorial terperinci ini, kita akan mengonfigurasi arsitektur dual-Mac dari nol hingga siap digunakan untuk siklus kerja harian (*production-ready*):

1. Setup headless server di MacBook Pro 2019 (32 GB RAM).
2. Setup driver client di MacBook Pro M1 (8 GB RAM).
3. Jembatan koneksi aman latensi rendah via Tailscale & SSH.
4. Setup **Inter-Agent Shared Memory** (Graphify AST Knowledge Graph + Obsidian LLM Wiki).
5. Setup **Agent Harness MCP-first** — Claude Code headless sebagai backbone di server, dengan Pi & Antigravity 2.0 sebagai opsi.
6. Setup **Autonomous Mobile Testing Loop yang self-healing** (Maestro MCP + `@mobilenext/mobile-mcp`).
7. Skenario praktek end-to-end pembuatan fitur mobile + backend dengan verifikasi otomatis.
8. Checklist pemeliharaan dan tips performa harian.

Positive
: Tutorial ini menyajikan instruksi command-line langkah demi langkah yang dapat langsung Anda copy-paste di terminal masing-masing Mac.

---

## Setup Perangkat 1: MacBook Pro 2019 (32 GB)
Duration: 0:15:00

MacBook Pro 2019 16" Intel (32 GB RAM) akan bertindak sebagai **Dedicated Headless Compute & Agent Server**. Perangkat ini ditempatkan di meja kerja dalam posisi terhubung ke daya (charger) dan jaringan Wi-Fi/LAN.

### Langkah 1: Konfigurasi Power & Remote Access macOS
Agar MacBook tidak tertidur (*sleep*) saat layar ditutup (*clamshell mode*) atau saat tidak ada interaksi fisik:

1. Buka **System Settings** > **General** > **Sharing**.
2. Aktifkan **Remote Login (SSH)**.
   * Pilih *Allow access for: All users* atau pilih user akun Anda.
3. Buka Terminal di MacBook 2019 dan jalankan perintah konfigurasi power:

```bash
# Cegah sistem sleep saat charger terpasang
sudo pmset -c sleep 0
sudo pmset -c disablesleep 1

# Nonaktifkan power nap dan disk sleep untuk stabilitas server
sudo pmset -c disksleep 0
sudo pmset -c displaysleep 15
```

Positive
: Anda juga dapat menginstal utilitas seperti **Amphetamine** dari Mac App Store untuk memastikan sistem tetap terjaga dengan trigger status power/charger.

### Langkah 2: Instalasi Developer Toolchain & Homebrew
Pastikan Homebrew dan command line tools terinstal:

```bash
# 1. Install Command Line Tools
xcode-select --install

# 2. Install Homebrew (jika belum ada)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 3. Install bahasa dan utilitas esensial
# Node 24 = LTS aktif per 2026 (node@22 sudah masuk fase maintenance).
# uv dipakai untuk memasang CLI Python modern seperti Graphify.
brew install git node@24 go python@3.13 uv tree-sitter ripgrep jq htop mosh
```

### Langkah 3: Setup Container Runtime (OrbStack / Docker)
Di macOS Intel dengan 32 GB RAM, **OrbStack** sangat direkomendasikan karena jauh lebih hemat CPU/baterai dan booting lebih cepat dibandingkan Docker Desktop klasik:

```bash
# Install OrbStack
brew install --cask orbstack

# Verifikasi docker berjalan
docker ps
```

### Langkah 4: Setup Mobile Android SDK & Emulator Headless
Pasang Android Command-line tools dan buat emulator virtual tanpa skin GUI (headless). Kita target **API 36 (Android 16)** karena sejak 31 Agustus 2026 Google Play mewajibkan seluruh app baru & update menargetkan API level 36:

```bash
# Buat direktori Android SDK
mkdir -p ~/Android/sdk/cmdline-tools

# Set environment variables di ~/.zshrc
cat << 'EOF' >> ~/.zshrc
export ANDROID_HOME=$HOME/Android/sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
EOF
source ~/.zshrc

# Install platform-tools, emulator, dan system image x86_64 (Android 16 / API 36)
sdkmanager --install "platform-tools" "emulator" "platforms;android-36" "system-images;android-36;google_apis;x86_64"

# Buat AVD (Android Virtual Device) bernama 'agent_runner'
avdmanager create avd -n agent_runner -k "system-images;android-36;google_apis;x86_64" --device "pixel_7"
```

Positive
: **Kenapa emulator ditaruh di MacBook 2019 (Intel), bukan M1?** Di CPU Intel, system image `x86_64` berjalan **native** tanpa lapisan translasi — cepat dan hemat overhead. Di Apple Silicon (M1) Anda justru harus memakai image `arm64-v8a`; menjalankan image `x86_64` di M1 akan lewat Rosetta 2 dengan penalti 20–30%. Ditambah RAM M1 hanya 8 GB, maka strategi kita: emulator berat hidup di server Intel 2019, sedangkan M1 cukup mengetes di **HP fisik via USB** (lihat Perangkat 2).

Uji menjalankan emulator dalam mode tanpa jendela (*headless/no-window*):
```bash
emulator -avd agent_runner -no-window -no-audio -no-boot-anim &
```

Negative
: Jangan lupa jalankan `adb devices` untuk memastikan emulator terdeteksi dengan status `device`.

---

## Setup Perangkat 2: MacBook Pro M1 (8 GB)
Duration: 0:10:00

MacBook Pro M1 (8 GB RAM) adalah perangkat harian Anda (*Driver / Control Plane*). Fokus setup di sini adalah menjaga penggunaan memori seminimal mungkin agar laptop tetap dingin, baterai tahan 12+ jam, dan responsivitas editor instan.

### Langkah 1: Instalasi Editor & Client Tools
Di MacBook M1, pasang editor ringan dan terminal modern:

```bash
# Install tool terminal dan shell
brew install ghostty mosh tailscale

# Install IDE pilihan (Antigravity, Cursor, atau VS Code)
brew install --cask visual-studio-code
```

### Langkah 2: Setup Physical Device Testing (USB Bridge)
Menjalankan emulator Android di M1 8GB memakan 3–4 GB RAM secara sia-sia. Sebagai gantinya:
1. Hubungkan HP fisik Android atau iPhone via kabel USB ke MacBook M1.
2. Aktifkan **Developer Options** dan **USB Debugging** di Android, atau **Developer Mode** di iOS.
3. Jalankan `adb devices` di M1. Anda mendapatkan live-preview native tanpa beban RAM!

### Langkah 3: Setup Apple Universal Control (Jika Bekerja Berdampingan)
Jika Anda meletakkan kedua laptop berdampingan di meja kerja:
1. Di kedua Mac, buka **System Settings** > **Displays** > **Advanced**.
2. Centang **"Link to Mac or iPad"** dan **"Allow pointer and keyboard to move between any nearby Mac or iPad"**.
3. Pastikan Bluetooth dan Wi-Fi aktif di kedua Mac dengan Apple ID yang sama.
4. Mouse dan keyboard MacBook M1 kini dapat digerakkan langsung ke layar MacBook 2019, lengkap dengan clipboard sharing (copy text di M1, paste di Intel Mac).

---

## Jembatan Jaringan: Tailscale & Remote Development
Duration: 0:10:00

Untuk menghubungkan kedua laptop secara transparan di mana pun Anda berada (baik satu Wi-Fi rumah, kantor, maupun saat tethering di cafe), kita gunakan **Tailscale** (mesh VPN terenkripsi WireGuard).

```
[MacBook M1: 100.64.0.2] <==== Encrypted WireGuard Tunnel ====> [MacBook 2019: 100.64.0.3]
```

### Langkah 1: Install & Login Tailscale di Kedua Mac
1. Pasang Tailscale dari App Store atau via brew:
```bash
brew install --cask tailscale
```
2. Buka aplikasi Tailscale di kedua Mac dan login dengan akun yang sama (misal Google / GitHub).
3. Catat IP Tailscale masing-masing Mac (format `100.x.y.z`).
   * Misal: MacBook 2019 = `100.100.20.50` (Hostname: `mac-server`)
   * Misal: MacBook M1 = `100.100.20.51` (Hostname: `mac-m1`)

### Langkah 2: Setup SSH Key-Based Authentication
Dari MacBook M1, buat SSH key dan kirimkan ke MacBook 2019:

```bash
# Jalankan di MacBook M1
ssh-keygen -t ed25519 -C "m1-to-intel-server"
# Tekan Enter untuk lokasi default (~/.ssh/id_ed25519)

# Copy public key ke MacBook 2019 (ganti IP dan username sesuai milik Anda)
ssh-copy-id username@100.100.20.50
```

### Langkah 3: Konfigurasi `~/.ssh/config` di MacBook M1
Edit file `~/.ssh/config` di MacBook M1:

```ssh
Host mac-server
    HostName 100.100.20.50
    User username
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 30
    ServerAliveCountMax 5
    ForwardAgent yes
```

Uji koneksi tanpa password:
```bash
ssh mac-server
```

### Langkah 4: Remote Development via VS Code / Antigravity
1. Buka VS Code / Antigravity di MacBook M1.
2. Install ekstensi **Remote - SSH** (`ms-vscode-remote.remote-ssh`).
3. Tekan `Cmd + Shift + P` > pilih **Remote-SSH: Connect to Host...** > pilih **mac-server**.
4. Buka folder project Anda yang ada di MacBook 2019.

Positive
: Sekarang Anda mengedit kode di MacBook M1 yang ringan dan dingin, sementara seluruh proses kompilasi, indexing, dan eksekusi Docker berjalan di memori 32 GB MacBook 2019!

---

## Setup Inter-Agent Shared Memory
Duration: 0:15:00

Tantangan terbesar saat menggunakan banyak agen AI secara paralel adalah **Context Drift** dan **Memory Loss**. Kita akan memasang arsitektur memori 2 layer:
1. **Graphify**: Memori struktural kode berbasis AST (*Deterministic Code Graph*).
2. **Obsidian (LLM Wiki)**: Memori semantik & keputusan arsitektur berbasis Markdown.

```
📂 your-mobile-project/
 ├── 📂 .knowledge/               <-- Layer 1: Obsidian Vault (Human & Agent Wiki)
 │    ├── 📄 index.md             <-- Map of Content
 │    ├── 📂 adr/                 <-- Architecture Decision Records (e.g. ADR-001.md)
 │    ├── 📂 contracts/           <-- API Contracts (OpenAPI schemas, JSON payloads)
 │    └── 📂 learnings/           <-- Past bug resolutions & gotchas
 ├── 📂 graphify-out/             <-- Layer 2: Graphify AST Output
 │    ├── 📄 graph.json           <-- Full queryable graph (IMPORTS/CALLS/EXTENDS)
 │    ├── 📄 GRAPH_REPORT.md      <-- Ringkasan graf untuk konteks AI
 │    └── 📄 graph.html           <-- Visualisasi interaktif di browser
 └── 📂 app/                      <-- Source Code (Flutter/Kotlin/Swift/Go)
```

### Langkah 1: Setup Obsidian Vault di Dalam Repository
Buat folder `.knowledge/` di root repository project Anda:

```bash
mkdir -p .knowledge/{adr,contracts,learnings}
```

Buat file index `.knowledge/index.md`:
```markdown
# Project Brain & Knowledge Graph

## Architecture Decisions
* [[ADR-001-auth-flow]]: Standard autentikasi JWT & Refresh Token
* [[ADR-002-state-management]]: Standar State Management Mobile (BLoC / Riverpod)

## API Contracts
* [[auth-endpoints]]: Spesifikasi payload login, OTP, dan token refresh

## Learnings & Known Gotchas
* [[gradle-build-workaround]]: Solusi konflik versi Android Gradle Plugin
```

Buka folder `.knowledge/` menggunakan aplikasi **Obsidian** di MacBook M1 Anda untuk memantau grafik keterhubungan secara visual (*Graph View*).

### Langkah 2: Instalasi & Setup Graphify di MacBook 2019
Graphify (open-source, YC-backed, 33+ bahasa) mem-parsing codebase menggunakan **Tree-Sitter** secara lokal untuk membuat peta grafis dependensi antar fungsi, class, dan file — deterministik, tanpa vector store, dan **tanpa membuang token LLM**. Graphify berjalan sebagai *skill* di dalam agen (Claude Code, Cursor, Codex, Gemini CLI).

Di MacBook 2019 (Server):
```bash
# 1. Install CLI Graphify (perhatikan nama paket: graphifyy dengan dua 'y')
uv tool install graphifyy        # alternatif: pipx install graphifyy

# 2. Daftarkan skill /graphify ke agen Anda
graphify install

# 3. Masuk ke direktori project lalu aktifkan integrasi Claude Code (per-project)
cd ~/projects/my-mobile-project
graphify claude install          # menulis direktif CLAUDE.md + PreToolUse hook
```

Setelah terpasang, panggil skill langsung dari dalam sesi agen:
```text
/graphify .                                   # bangun graf untuk folder saat ini
/graphify ./app --update                      # re-extract hanya file yang berubah
/graphify query "apa yang menghubungkan auth ke database?"
/graphify path "AuthService" "UserRepository" # lacak jalur dependensi
```

Graphify menulis output ke folder `graphify-out/`:
* `graph.json`: Database grafis relasi kode (`IMPORTS`, `CALLS`, `EXTENDS`) yang bisa di-commit ke git.
* `GRAPH_REPORT.md`: Ringkasan ringkas yang dibaca agen saat merencanakan perubahan arsitektur.
* `graph.html`: Visualisasi graf interaktif yang bisa dibuka di browser.

### Langkah 3: Aturan Interaksi Agen dengan Memori
Tambahkan instruksi memori di file panduan agen (seperti `AGENTS.md` atau `CLAUDE.md`):

```markdown
## Inter-Agent Memory Rules
1. **Pre-Task Check**: Sebelum memulai task baru, baca `.knowledge/index.md` dan cek `graphify-out/GRAPH_REPORT.md` (atau jalankan `/graphify query ...`) untuk memahami arsitektur dan dependensi yang terdampak.
2. **Contract-First**: Setiap perubahan endpoint backend WAJIB didokumentasikan di `.knowledge/contracts/` sebelum kode mobile ditulis.
3. **Post-Task Learnings**: Jika Anda menemukan bug rumit atau membuat keputusan teknis baru, tuliskan catatan baru di `.knowledge/learnings/` atau `.knowledge/adr/` dengan format Markdown ber-link `[[nama-topik]]`.
```

---

## Setup Agent Harness: Pi, Antigravity, & Claude Code
Duration: 0:15:00

### Apa itu Agent Harness?
Harness adalah runtime yang membungkus LLM, menangani loop eksekusi tool, pemangkasan konteks, dan percabangan sesi (*session trees*).

### Pilihan 1: Pi Coding Agent (The Minimalist Powerhouse)
**Pi (`@earendil-works/pi-coding-agent`)** oleh Mario Zechner adalah harness terminal paling ramping, tercepat, dan hemat token:

```bash
# Jalankan di MacBook 2019 (atau di M1)
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
```

#### 1. Konfigurasi API Keys
Buat file konfigurasi `~/.pi/config.json` atau export environment variable:
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
export GEMINI_API_KEY="AIzaSy..."
export OPENAI_API_KEY="sk-..."
```

#### 2. Menjalankan Pi & Fitur Tree Session
Jalankan Pi di folder project:
```bash
pi
```

Kekuatan utama Pi adalah **Tree-Structured History**:
* Jika agen melakukan kesalahan refactor di langkah ke-5, Anda tidak perlu memulai percakapan baru dari awal.
* Ketik `/tree` untuk melihat cabang percakapan.
* Ketik `/branch 3` untuk melompat kembali ke langkah ke-3 dan mengambil pendekatan solusi yang berbeda.

### Pilihan 2: Antigravity & Subagent Orchestration
Antigravity menyediakan harness dengan dukungan **Reactive Subagents** dan **Planning Mode Artifacts**.

Konfigurasi subagent untuk fullstack mobile dapat didefinisikan dalam prompt atau skill:
* **Subagent 1 (Backend Specialist)**: Fokus pada handler API, unit testing, dan migration SQL.
* **Subagent 2 (Mobile Specialist)**: Fokus pada UI widgets, state lifecycle, dan response deserialization.
* **Subagent 3 (QA & Testing Specialist)**: Menjalankan lint, build, dan Maestro test.

---

## Setup Autonomous Mobile Testing Loop (Maestro & Mobile-MCP)
Duration: 0:15:00

Kelemahan terbesar AI coding pada aplikasi mobile adalah **ketidakmampuan AI melihat hasil render UI**. Kita mengatasi ini dengan menggabungkan **Maestro** dan **`mobile-mcp`**.

```
[AI Coding Agent] ──> [mobile-mcp] ──> [Android/iOS Accessibility Tree]
       │                                            │
       ▼                                            ▼
[Edit Code UI] ───> [Run Maestro YAML] ───> [Pass / Fail Assertion]
       ▲                                            │
       └────────────── [Self-Healing Loop] ─────────┘
```

### Langkah 1: Instalasi Maestro CLI di MacBook 2019
Maestro adalah tool UI testing deklaratif berbasis YAML yang sangat mudah dibuat dan dibaca oleh AI:

```bash
# Install Maestro di MacBook 2019
curl -Ls "https://get.maestro.mobile.dev" | bash
export PATH="$PATH:$HOME/.maestro/bin"
```

### Langkah 2: Buat Skenario Flow Test Maestro
Buat file `.maestro/auth_login_flow.yaml`:

```yaml
appId: com.example.myfullstackapp
---
- launchApp:
    clearState: true
- assertVisible: "Selamat Datang"
- tapOn: "Input Email"
- inputText: "developer@learnwithfath.com"
- tapOn: "Kirim OTP"
- assertVisible: "Masukkan Kode OTP"
- inputText: "123456"
- tapOn: "Verifikasi"
- assertVisible: "Dashboard Utama"
```

Uji flow secara lokal di server:
```bash
maestro test .maestro/auth_login_flow.yaml
```

### Langkah 3: Setup `mobile-mcp` untuk Inspeksi UI
`mobile-mcp` memberikan akses ke AI agent untuk menginspeksi hierarchy UI emulator secara real-time via Model Context Protocol:

```bash
# Clone dan build mobile-mcp di MacBook 2019
git clone https://github.com/lobehub/mobile-mcp.git ~/.tools/mobile-mcp
cd ~/.tools/mobile-mcp && npm install && npm run build
```

Tambahkan ke konfigurasi MCP client Anda:
```json
{
  "mcpServers": {
    "mobile": {
      "command": "node",
      "args": ["/Users/username/.tools/mobile-mcp/dist/index.js"]
    }
  }
}
```

---

## Skenario Praktik End-to-End
Duration: 0:20:00

Mari kita simulasikan alur kerja nyata: **Mengimplementasikan Fitur Login OTP dari Backend hingga Mobile**.

### Langkah 1: Tahap Perencanaan & Kontrak
1. Buka sesi di MacBook M1 (terhubung via Remote-SSH ke MacBook 2019).
2. Berikan instruksi ke Agent:
   > *"Kita akan membuat fitur Login OTP. Pertama, buat kontrak API di `.knowledge/contracts/otp-auth.md` dan catat keputusan arsitektur di `.knowledge/adr/ADR-003-otp.md`."*
3. Agen menyusun skema JSON request/response dan alur verifikasi token.

### Langkah 2: Implementasi Backend (Concurrent Task di 32 GB Mac)
1. Backend Subagent membuat endpoint `/api/v1/auth/request-otp` dan `/api/v1/auth/verify-otp` di Go/NestJS.
2. Agen menjalankan unit test di container Docker:
   ```bash
   docker compose exec backend go test ./internal/auth/...
   ```

### Langkah 3: Implementasi Mobile Client
1. Mobile Subagent membaca `.knowledge/contracts/otp-auth.md`.
2. Agen membuat screen UI OTP dan state management di Flutter/React Native/Compose.
3. Agen melakukan build incremental pada project mobile.

### Langkah 4: Autonomous Testing & Self-Healing Loop
1. Agen menjalankan test E2E di Android Emulator MacBook 2019:
   ```bash
   maestro test .maestro/auth_login_flow.yaml
   ```
2. **Skenario Error**: Misal tombol memiliki identifier `btn_submit` sementara Maestro mencari text `"Verifikasi"`.
3. Test gagal -> Agen membaca log kegagalan -> Agen memperbaiki identifier di kode UI -> Agen menjalankan ulang `maestro test`.
4. Seluruh assertion **PASS**!

### Langkah 5: Live Verifikasi di HP Fisik
Tanpa perlu menyalakan emulator berat di M1, pasang APK hasil build ke HP fisik yang tersambung di M1:
```bash
adb install -r build/app/outputs/flutter-apk/app-debug.apk
```
Anda langsung memverifikasi animasi dan haptic feedback di perangkat asli.

---

## Maintenance, Checklist Harian, & Tips Pro
Duration: 0:05:00

### Checklist Harian Memulai Kerja

| No | Aktivitas | Device | Command / Cara |
| :--- | :--- | :--- | :--- |
| 1 | Nyalakan / Wake Server | Intel 2019 | Pastikan charger terpasang & Amphetamine aktif |
| 2 | Verifikasi Koneksi Tailscale | M1 | `tailscale ping mac-server` |
| 3 | Jalankan Stack Backend | Intel 2019 | `ssh mac-server "cd ~/projects/app && docker compose up -d"` |
| 4 | Buka Remote Editor | M1 | Buka VS Code / Antigravity via Remote-SSH |
| 5 | Update Peta Kode Graphify | Intel 2019 | `graphify build` jika ada merge branch baru |

### Tips Efisiensi & Thermal Management

Positive
: **Thermal MacBook 2019**: Gunakan dudukan laptop (*vertical laptop stand*) berbahan aluminium agar sirkulasi udara di bawah bodi MacBook 2019 tetap optimal saat menjalankan komputasi berat.

Negative
: **Hindari Docker di M1 8GB**: Jangan pernah menjalankan Docker Desktop dan Android Studio Emulator secara bersamaan di M1 8GB jika tidak ingin memicu swap SSD hingga puluhan gigabyte. Biarkan M1 murni sebagai *thin client*.

---

## Ringkasan
Duration: 0:02:00

Selamat! Anda telah berhasil merancang dan mengonfigurasi arsitektur **Agentic Workflow Dual-Mac** yang sangat efisien:

### Apa yang Telah Anda Capai
* ✅ **Utilisasi Optimal 2 Mac**: MacBook M1 (8 GB) tetap dingin & responsif sebagai Driver Node, sementara MacBook 2019 (32 GB) menangani beban berat Docker, Emulator, dan Multi-Agent Swarms.
* ✅ **Zero-Config Mesh Network**: Konektivitas SSH aman dari mana saja menggunakan Tailscale.
* ✅ **Shared Memory Architecture**: Kolaborasi antar-agen yang rapi menggunakan **Graphify** (AST Code Graph) dan **Obsidian** (LLM Wiki & ADR).
* ✅ **State-of-the-Art Agent Harness**: Memanfaatkan **Pi Coding Agent**, **Antigravity**, dan **Claude Code** dengan efisiensi token maksimal.
* ✅ **Autonomous Mobile Verification Loop**: Pengujian UI otomatis mandiri menggunakan **Maestro** dan **mobile-mcp**.

Terus kembangkan workflow agentic Anda dan nikmati lonjakan produktivitas pengembangan full stack mobile!
