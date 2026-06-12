summary: Tutorial lengkap menguasai Wick: AI-first framework & agent host di Go. Pelajari setup, CLI, konfigurasi provider, custom app manifest (wick.yml), command gate, dan deployment.
id: wick-framework-agent-tutorial
categories: Go, AI, Backend, Developer Tools
tags: go, ai-agent, mcp, slack-bot, telegram-bot, cli, sqlite, htmx, tailwind
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Wick: AI-First Go Framework & Agent Host - Tutorial Lengkap

## Overview & Arsitektur Wick
Duration: 5

### Apa itu Wick?

**Wick** adalah sebuah *AI-first framework* modern yang dirancang untuk membangun aplikasi internal (*internal tools*) dan mengelola *background jobs* menggunakan bahasa pemrograman Go. Selain sebagai framework pengembangan, Wick juga berfungsi sebagai **AI Agent Host** siap pakai yang dapat menghubungkan model kecerdasan buatan terkemuka (seperti Claude, GPT, Gemini, dan Ollama) ke saluran komunikasi populer seperti Slack, Telegram, dan Web UI tanpa perlu menulis kode tambahan.

Secara garis besar, Wick adalah Go mono-repo yang menghasilkan **satu binary** dengan tiga kemampuan/produk utama:

| Produk | Path / Peran | Deskripsi |
|---|---|---|
| **wick CLI** | `cmd/wick/` | Scaffolding, pengembangan (`dev`), build, dan deployment proyek aplikasi internal berbasis Go. |
| **wick-agent** | `cmd/wick-agent/` | Runtime hosting AI agent yang terintegrasi dengan chat channels dan scheduler (cron). |
| **wick runtime** | `app/`, `pkg/` | Kumpulan shared library (router, database SQLite, queue, auth, SSE, WebSocket, TOTP). |

---

### Filosofi Desain & Aturan Arsitektur

Jika Anda ingin memahami cara kerja Wick secara mendalam atau tertarik berkontribusi pada codebase-nya, berikut beberapa aturan arsitektur utamanya:

1. **Single Binary Dispatcher**: File `main.go` di root repo mendeteksi nama binary yang dieksekusi atau parameter pertama untuk menentukan apakah ia akan bertindak sebagai `wick` CLI atau `wick-agent` runtime.
2. **No Global State**: Setiap komponen di dalam Wick menerima ketergantungannya (*dependencies*) melalui konstruktor atau struct konfigurasi untuk mempermudah unit testing.
3. **Server-Side Rendering (SSR)**: Interface admin/web UI Wick dibangun menggunakan teknologi modern yang minimalis: Go HTML templates, **HTMX**, **Tailwind CSS**, dan **Alpine.js**. Tidak menggunakan framework SPA kompleks seperti React, Vue, atau Next.js.
4. **SQLite Database**: Wick menggunakan SQLite sebagai database internal default. Migrasi database didefinisikan secara langsung di dekat skema kode.
5. **Command Gate (Sandbox)**: Setiap perintah terminal/shell yang ingin dieksekusi oleh AI Agent harus melalui sistem pengaman bernama *Command Gate* yang diaudit ke file JSONL.

---

### Apa yang Akan Anda Pelajari?

Dalam tutorial lengkap ini, kita akan membahas ekosistem Wick secara tuntas:
- Cara instalasi instan Wick Agent & Wick CLI.
- Konfigurasi AI Provider (Claude, OpenAI, Gemini, Ollama).
- Integrasi chat channel (Slack Socket Mode, Telegram, Web).
- Keamanan eksekusi shell via *Command Gate*.
- Membuat aplikasi internal Go menggunakan manifest `wick.yml`.
- Mengonfigurasi Halaman, Komponen, dan Background Jobs (Cron).
- Menjalankan mode development (`wick dev`) dan kompilasi production (`wick build`).

Mari kita lanjut ke bagian berikutnya untuk instalasi!

## Instalasi & Quick Start
Duration: 8

Wick menyediakan dua cara penggunaan utama: menjalankan AI Agent instan menggunakan binary pre-built (`wick-agent`), atau memasang toolkit developer (`wick` CLI) untuk memprogram aplikasi internal Anda sendiri.

---

### Metode A: Menjalankan AI Agent Tanpa Go (Pre-built Binary)

Jika Anda hanya ingin menggunakan Wick sebagai host untuk AI Agent (menghubungkan Claude/Gemini ke Slack/Telegram Anda), Anda tidak perlu menginstal Go. Cukup unduh binary resminya.

#### 1. macOS, Linux, atau Termux
Gunakan script instalasi otomatis yang akan mendeteksi sistem operasi dan arsitektur CPU Anda:

```bash
curl -fsSL https://yogasw.github.io/wick/install.sh | sh
```

#### 2. Windows (PowerShell)
Jalankan perintah berikut pada terminal PowerShell dengan hak akses Administrator:

```powershell
iwr -useb https://yogasw.github.io/wick/install.ps1 | iex
```

#### 3. Menggunakan Docker
Jika Anda menyukai kontainerisasi, Anda dapat menjalankan host agen dalam satu container Docker yang menggabungkan HTTP server dan cron job manager sekaligus:

```bash
docker run -d \
  -p 9425:9425 \
  -v wick-agent-data:/root/.wick-agent \
  ghcr.io/yogasw/wick-agent:latest all
```

Setelah terpasang, jalankan perintah berikut untuk mengaktifkan UI web admin:

```bash
wick-agent server
```
Buka peramban Anda dan akses **`http://localhost:9425`**. Kredensial masuk (admin username & password) akan dibuat secara otomatis pada eksekusi pertama di terminal Anda. Simpan kredensial tersebut!

---

### Metode B: Instalasi Wick CLI untuk Go Developer

Jika tujuan Anda adalah membangun aplikasi backend internal, dasbor, dan API kustom, Anda memerlukan Go (versi 1.22 ke atas) terinstal di komputer Anda.

Pasang `wick` CLI secara global dengan perintah:

```bash
go install github.com/yogasw/wick@latest
```

Pastikan folder `$GOPATH/bin` (biasanya `~/go/bin`) sudah masuk ke dalam konfigurasi `PATH` sistem operasi Anda agar terminal mengenali command `wick`. Anda bisa memverifikasinya dengan mengetik:

```bash
wick --help
```

Jika perintah tersebut merespons dengan petunjuk penggunaan CLI, Anda siap melangkah ke tahap berikutnya!

## Menggunakan Wick-Agent (AI Agent Host)
Duration: 12

Wick-Agent adalah host yang tangguh untuk menjalankan agen AI secara mandiri. Ia bertindak sebagai jembatan yang menghubungkan model LLM ke workspace lokal Anda dan mendistribusikan chat ke berbagai channel.

---

### 1. Menentukan Mode Eksekusi Binary

Binary `wick-agent` mendukung dua mode utama saat dijalankan:

*   **System Tray Mode** (Desktop): Cukup ketik `wick-agent` tanpa argumen di komputer lokal Anda. Aplikasi akan berjalan di latar belakang, menampilkan ikon kecil di system tray menu Anda untuk memantau status sistem, dan mengizinkan fitur autostart saat login komputer.
*   **Headless Mode** (Server/Docker): Jalankan `wick-agent server` untuk dijalankan di server jarak jauh atau di dalam container. Log sistem akan ditulis ke *stdout* secara real-time.

---

### 2. Mengatur File `.env` Konfigurasi

Untuk mengatur API Key LLM dan channel integrasi secara permanen, buat file `.env` di folder kerja Anda. Berikut adalah template konfigurasi penting yang didukung oleh Wick-Agent:

```env
PORT=9425
BASE_URL=http://localhost:9425

# Kredensial Admin Awal
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ganti-dengan-password-aman

# API Keys AI Provider
CLAUDE_API_KEY=sk-ant-api03-...
CLAUDE_MODEL=claude-sonnet-4-20250514

OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o

GEMINI_API_KEY=AIzaSy...
GEMINI_MODEL=gemini-2.5-pro

OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3

# Konfigurasi Default Workspace Agen
AGENT_DEFAULT_PROVIDER=claude
AGENT_WORKSPACE_PATH=./workspaces
```

---

### 3. Setup Melalui Web Admin UI

Setelah server menyala, Anda dapat mengonfigurasi Agen dengan mudah melalui dashboard admin visual di menu `/tools/agents`:

1.  **Providers**: Daftarkan API Key Anda. Anda dapat menentukan model default yang digunakan untuk memproses instruksi. Ollama didukung penuh jika Anda ingin meminimalkan biaya menggunakan model open-source lokal.
2.  **Workspaces**: Tentukan folder di harddisk Anda yang akan dijadikan area kerja (*sandbox*) bagi agen. Agen dapat membaca, mengedit, dan membuat file di dalam direktori ini berdasarkan permintaan Anda.
3.  **Channels**: Hubungkan agen Anda dengan antarmuka pengguna:
    *   **Web Chat**: Antarmuka chat bawaan di panel admin.
    *   **Telegram**: Masukkan token dari BotFather untuk mulai mengobrol dengan bot Anda.
    *   **Slack (Socket Mode)**: Masukkan bot token (`xoxb-`) dan app token (`xapp-`) agar bot Slack Anda dapat merespons pesan secara real-time langsung dari workspace Anda.

Positive
: Slack Socket Mode sangat direkomendasikan karena tidak membutuhkan konfigurasi webhook public URL HTTPS, sehingga aman dicoba dari localhost Anda!

## Command Gate & Keamanan Agent
Duration: 10

Ketika Anda memberikan instruksi kepada agen AI di Slack atau Telegram seperti: *"Tolong deploy aplikasi ini ke server staging dan hapus folder cache"*, agen tersebut akan mencoba menulis script bash dan mengeksekusinya di mesin host Anda. 

Memberikan akses penuh eksekusi shell ke model AI adalah tindakan berisiko tinggi. Oleh karena itu, Wick menerapkan sistem pengaman berlapis yang dinamakan **Command Gate**.

---

### Cara Kerja Command Gate

Setiap kali LLM memanggil tool untuk mengeksekusi perintah bash (`run_command`), request tersebut dicegat oleh modul `app/agent/commandgate/` sebelum dijalankan di sistem operasi.

```
[User Chat] -> [AI Agent] -> [Request: run_command "rm -rf /"]
                                    |
                                    v
                          [   Command Gate   ]
                                    |
            +-----------------------+-----------------------+
            | (Whitelisted?)                                | (Requires Review?)
            v                                               v
       [  ALLOW  ]                                     [  PROMPT  ]
            |                                               |
            v                                               v
   (Eksekusi di Host)                            (Tanya Persetujuan User)
                                                            |
                                           +----------------+----------------+
                                           v                                 v
                                      [ APPROVE ]                       [  BLOCK  ]
```

---

### 4 Mode Persetujuan Interaktif

Wick menyediakan antarmuka persetujuan (melalui Web Admin UI atau langsung di Slack/Telegram) dengan 4 opsi keputusan untuk setiap eksekusi perintah shell:

1.  **Approve once**: Izinkan perintah spesifik tersebut dieksekusi satu kali saja. Jika agen memanggilnya lagi, ia akan meminta persetujuan kembali.
2.  **This session**: Izinkan perintah tersebut dijalankan berulang kali selama sesi chat aktif saat ini.
3.  **Always (Whitelist)**: Masukkan pola perintah tersebut ke dalam daftar whitelist permanen. Agen dapat menjalankannya di masa depan secara otomatis tanpa konfirmasi.
4.  **Block**: Tolak perintah tersebut. Agen akan menerima error feedback di context window-nya sehingga ia tahu perintah tersebut dilarang oleh administrator.

---

### Konfigurasi Aturan Whitelist

Anda dapat mengatur aksi default untuk Command Gate di file `.env` Anda:

```env
# Pilihan default: allow | deny | prompt
COMMAND_GATE_DEFAULT=prompt
```

Aturan pencocokan whitelist menggunakan pola glob sederhana di database SQLite internal. Misalnya, Anda dapat mengizinkan agen menjalankan operasi baca aman seperti `cat`, `git status`, atau `ls` secara bebas, tetapi selalu meminta konfirmasi untuk perintah destruktif seperti `rm` atau modifikasi infrastruktur seperti `docker compose up`.

Semua aktivitas eksekusi perintah (siapa pengirimnya, teks perintah, hasil eksekusi, status persetujuan, waktu eksekusi) direkam secara terperinci ke audit logs berformat JSONL untuk keperluan forensik keamanan.

## Membangun Aplikasi Internal dengan Wick CLI
Duration: 15

Selain sebagai AI Agent, Wick adalah sebuah web framework Go berkinerja tinggi yang mengutamakan pendekatan deklaratif. Dengan Wick, Anda mendefinisikan struktur aplikasi web internal Anda lewat file konfigurasi YAML, dan Wick CLI akan membantu menghasilkan kode Go, skema database, antarmuka admin, hingga program penjadwal kerja.

---

### 1. Inisialisasi Proyek Baru

Buka terminal Anda, masuk ke direktori tempat Anda menyimpan proyek, lalu jalankan perintah scaffolding berikut:

```bash
wick init inventory-app
```

Perintah di atas akan membuat folder baru bernama `inventory-app/` dengan struktur template sebagai berikut:

```
inventory-app/
├── data/
│   └── app.db           # SQLite DB file
├── jobs/
│   └── daily_report.go  # Template background job
├── main.go              # Entrypoint aplikasi
├── go.mod               # File modul Go
└── wick.yml             # File konfigurasi manifest utama (CRITICAL)
```

Masuk ke folder proyek baru tersebut:
```bash
cd inventory-app
```

---

### 2. Bedah Manifest wick.yml

File `wick.yml` adalah pusat kendali aplikasi internal Anda. Di sini Anda mendefinisikan server, database, otentikasi, tampilan halaman beserta komponennya, background job, dan API routing.

Mari kita pelajari contoh struktur konfigurasi `wick.yml` yang komprehensif:

```yaml
app:
  name: inventory-app
  version: 1.0.0
  description: "Sistem Manajemen Gudang & Laporan Harian"

server:
  port: 9425
  host: 0.0.0.0

database:
  driver: sqlite
  path: data/app.db

auth:
  enabled: true
  method: password        # Opsi: password | totp | ldap
  session_ttl: 24h

# Konfigurasi Rendering Halaman Dashboard Visual
pages:
  - path: /
    title: Ringkasan Gudang
    layout: sidebar
    components:
      - type: stats
        title: Total Stok Barang
        query: "SELECT SUM(quantity) as total FROM items"
      - type: chart
        title: Grafik Pendaftaran Barang Baru
        query: "SELECT date(created_at) as date, COUNT(*) as count FROM items GROUP BY date(created_at)"
        chart_type: line

  - path: /items
    title: Daftar Barang
    layout: table
    source: items         # Menghubungkan langsung dengan tabel 'items' di database
    columns:
      - name: id
        label: SKU ID
      - name: name
        label: Nama Barang
      - name: quantity
        label: Stok Tersedia
      - name: price
        label: Harga Satuan
    actions:
      - type: create      # Auto-generate form tambah data
      - type: edit        # Auto-generate form edit data
      - type: delete      # Tombol hapus dengan konfirmasi

# Konfigurasi Penjadwalan Background Tasks
jobs:
  - name: generate-daily-pdf
    schedule: "0 18 * * *"  # Dijalankan otomatis setiap hari jam 6 sore
    handler: jobs/daily_report.go

# Konfigurasi Custom REST API Endpoints
api:
  prefix: /api/v1
  routes:
    - method: GET
      path: /status
      handler: health
```

Dengan mendeklarasikan manifest di atas, Wick runtime secara cerdas akan membuat rute HTTP, meng-compile template admin HTML, menyiapkan database SQLite, merender grafik dinamis menggunakan Javascript (di balik layar), dan melakukan *binding* form CRUD secara otomatis tanpa Anda perlu menulis baris kode Go yang panjang!

## Development, Build & Deployment
Duration: 10

Setelah struktur aplikasi internal Anda didefinisikan di dalam `wick.yml`, Anda dapat mulai menjalankan, menguji, dan merilis aplikasi Anda ke lingkungan production.

---

### 1. Menjalankan Aplikasi di Lokal (Development Mode)

Gunakan perintah `wick dev` untuk menyalakan server lokal khusus untuk tahap pengembangan:

```bash
wick dev
```

Perintah `wick dev` memiliki fitur **Hot Reload**. Setiap kali Anda mengubah file manifest `wick.yml`, mengubah query SQL, atau mengedit logic di file handler Go, server Wick secara otomatis akan memuat ulang konfigurasi baru tersebut tanpa perlu mematikan dan menyalakan kembali server secara manual.

Akses dashboard aplikasi Anda di **`http://localhost:9425`** untuk melihat perubahan layout halaman secara instan!

---

### 2. Melakukan Kompilasi (Production Build)

Jika aplikasi Anda sudah siap digunakan oleh pengguna di kantor atau tim internal Anda, saatnya mengompilasi kode tersebut menjadi satu file binary executable tunggal yang tidak bergantung pada dependensi luar.

Jalankan perintah build:

```bash
wick build
```

Wick compiler akan memproses manifest, menghasilkan file binding Go yang efisien, mengoptimalkan aset front-end (meminimalkan ukuran Tailwind CSS dan Javascript), menggabungkan database migrations, lalu memanggil compiler Go untuk menghasilkan satu binary file portabel (misal: `./inventory-app`).

Binary mandiri ini sangat ringan dan dapat disalin ke server VPS Linux Anda dan dijalankan langsung tanpa perlu menginstal runtime Go di server target!

---

### 3. Deploying ke Server Production (Docker Flow)

Cara termudah dan paling aman untuk men-deploy aplikasi internal Wick Anda di server cloud adalah menggunakan kontainerisasi Docker. Anda bisa menggunakan template Dockerfile bawaan di bawah ini:

```dockerfile
# Tahap Kompilasi
FROM golang:1.22-alpine AS builder
RUN apk add --no-cache build-base sqlite-dev
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=1 go build -o /app/my-app .

# Tahap Produksi
FROM alpine:3.19
RUN apk add --no-cache sqlite-libs ca-certificates
WORKDIR /app
COPY --from=builder /app/my-app /app/my-app
COPY --from=builder /app/wick.yml /app/wick.yml

EXPOSE 9425
ENTRYPOINT ["/app/my-app"]
```

Build image Docker Anda dan jalankan di VPS target:
```bash
docker build -t company/my-app:1.0 .
docker run -d -p 80:9425 -v /var/data/app:/app/data company/my-app:1.0
```

Jangan lupa untuk me-mount folder database `/app/data` ke storage lokal VPS agar data inventaris Anda tetap tersimpan (*persistent*) walaupun kontainer Docker di-restart.

## Kesimpulan & Sesi Berikutnya
Duration: 5

Selamat! Anda telah mempelajari dasar-dasar Wick secara komprehensif, mulai dari pemahaman konsep monorepo, setup AI Agent Host, pengamanan terminal via Command Gate, hingga pembuatan aplikasi database internal secara deklaratif menggunakan manifest `wick.yml`.

---

### Rangkuman yang Telah Kita Pelajari

1.  **Arsitektur Monorepo**: Satu binary Wick dapat berfungsi sebagai CLI developer, AI Agent host, atau aplikasi web terkompilasi.
2.  **AI Agent Hosting**: `wick-agent` memudahkan konfigurasi LLM (Claude, Gemini, OpenAI, Ollama) untuk merespons chat di Slack & Telegram dengan akses shell berkeamanan Command Gate.
3.  **Wick CLI & manifest**: Scaffolding instan dengan `wick init`, setup visual dashboard dan database CRUD deklaratif di `wick.yml`.
4.  **DevOps & Deployment**: Menjalankan mode reload cepat via `wick dev`, kompilasi bertenaga penuh lewat `wick build`, serta panduan deploy container Docker.

---

### Topik di Sesi Selanjutnya (Next Session Preview)

Karena cakupan ekosistem Go dan AI Agent sangat luas, untuk menjaga agar proses belajar tetap terfokus, topik tingkat lanjut berikut akan kita bahas secara mendalam di sesi tutorial berikutnya:

*   **Custom Handler & API logic di Go**: Menulis code Go khusus untuk memproses data dinamis di component form dan routing custom API.
*   **Model Context Protocol (MCP)**: Memperluas kapabilitas agen AI agar dapat membaca schema database eksternal Anda atau memanggil API pihak ketiga (seperti GitHub, Jira, dsb).
*   **Keamanan Lanjutan (TOTP & LDAP)**: Mengintegrasikan otentikasi login sistem internal menggunakan Authenticator App (Google/Microsoft Authenticator) dan Active Directory kantor Anda.
*   **Cron Jobs Kompleks**: Membuat background jobs bertingkat dengan antrian job queue (`pkg/queue/`) untuk menangani kegagalan tugas berat.

Ada pertanyaan seputar konfigurasi atau langkah setup yang telah kita jalankan? Buka [feedback link](https://github.com/learnwithfath/learnwithfath.github.io/issues) atau diskusikan bersama tim Anda!

**Selamat Berkreasi dengan Wick! 🚀**
