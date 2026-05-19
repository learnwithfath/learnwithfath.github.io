author: Fath
summary: Panduan onboarding komprehensif untuk project iami-bot. Dirancang khusus agar Backend Engineer pemula (junior) dapat langsung paham arsitektur dan siap mengerjakan task.
id: onboarding-iami-bot
categories: Go, Backend, Onboarding, Architecture
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Onboarding: IAMI Bot Backend Mastery

## 1. Pendahuluan
Duration: 0:05:00

Selamat datang di tim Backend **IAMI Bot**! Codelab ini adalah panduan *onboarding* komprehensif yang dirancang agar kamu—walaupun masih pemula—bisa langsung memahami cara kerja proyek ini dan siap mengerjakan *task* pertamamu dengan percaya diri.

### Apa itu IAMI Bot?
IAMI Bot adalah custom bot routing service untuk **Isuzu Astra Motor Indonesia (IAMI)**. Bot ini menangani pesan chatbot WhatsApp melalui integrasi kompleks antara:
- **Qiscus Multichannel** (Inbox Customer Service)
- **Google Dialogflow** (Mesin NLP / AI Chatbot)
- **WhatsApp Flow** (Formulir terenkripsi di dalam WhatsApp)
- **Third-party APIs** lainnya (ICCS, QTicketing, MyZ)

### Tech Stack Utama
* **Bahasa:** Go 1.22
* **Framework:** Echo v4
* **Database & ORM:** PostgreSQL + GORM
* **Cache:** Redis
* **Arsitektur:** Clean Architecture

Negative
: **Penting!** Project ini berurusan dengan integrasi banyak *third-party API*. Selalu baca dokumentasi pihak ketiga jika menemui error integrasi!

## 2. Arsitektur Project (Clean Architecture)
Duration: 0:10:00

Project ini menggunakan **Clean Architecture**. Tujuannya agar kode mudah dites, dirawat, dan komponennya tidak saling terikat erat (*loosely coupled*).

### Alur Request Standard
```text
Request HTTP 
  → Middleware (Check API Key, CID Logger) 
  → Delivery (Handler / Controller) 
  → UseCase (Business Logic Utama) 
  → Repository (Akses DB) ATAU Third-party API
```

### Struktur Folder yang Wajib Kamu Tahu
Buka VS Code-mu di folder proyek `iami-bot`, perhatikan folder berikut:
* `src/delivery/`: Tempat kamu menerima HTTP request dari luar (misal: webhook Dialogflow).
* `src/usecase/`: Tempat kamu menulis **logika bisnis**. Di sinilah 'otak' aplikasi berada.
* `src/repository/`: Tempat kamu menulis query database (Postgres via GORM).
* `thirdparty/`: Tempat fungsi untuk memanggil API luar (seperti Qiscus, Dialogflow).
* `registry/`: Tempat semua komponen di-*inject* (Dependency Injection).

Positive
: **Aturan Emas:** *Delivery* tidak boleh memanggil *Repository* langsung. *Delivery* harus memanggil *UseCase*, dan *UseCase* lah yang memanggil *Repository* atau *Third-party*.

## 3. Setup Lingkungan Lokal
Duration: 0:15:00

Mari kita buat aplikasi ini menyala di komputermu!

### Langkah 1: Persiapan Environment
```bash
# Clone repo jika belum
git clone <repo-iami-bot>
cd iami-bot

# Salin template environment variables
cp config/.env.example .env
```
Minta value dari `.env` yang rahasia (seperti `API_KEY_SECRET`, kredensial Qiscus, dll) kepada Tech Lead atau sesama backend dev.

### Langkah 2: Menjalankan DB & Redis via Docker
Aplikasi butuh Postgres dan Redis. Cara paling aman agar tidak bentrok dengan databasemu yang lain adalah dengan Docker.

```bash
# Jalankan Postgres (di port 5433 host)
docker run --name iami-postgres -e POSTGRES_PASSWORD=secret -e POSTGRES_USER=default -e POSTGRES_DB=iami-bot-stag -p 5433:5432 -d postgres

# Jalankan Redis (di port 6379 host)
docker run --name iami-redis -p 6379:6379 -d redis
```

Pastikan di `.env` kamu:
```env
DATABASE_URL=postgres://default:secret@127.0.0.1:5433/iami-bot-stag
REDIS_URL=redis://:@127.0.0.1:6379
```

### Langkah 3: Install & Jalankan
```bash
go mod tidy
go mod vendor
go run main.go
```
Jika sukses, server akan berjalan di port `1213`.
Buka terminal baru dan tes: `curl http://localhost:1213/health`

## 4. Seeding Data Master
Duration: 0:10:00

Aplikasi butuh data awal agar berjalan lancar (data outlet, kota, kendaraan, dll). Data ini ada di folder `misc/migration/`.

Pastikan server Go kamu sedang berjalan, lalu buka terminal baru dan jalankan command ini berurutan:

```bash
curl -X POST http://localhost:1213/seed/outlet_types
curl -X POST http://localhost:1213/seed/province
curl -X POST http://localhost:1213/seed/city
curl -X POST http://localhost:1213/seed/outlet
curl -X POST http://localhost:1213/seed/series
curl -X POST http://localhost:1213/seed/vehicle
curl -X POST http://localhost:1213/seed/booking
```

Jika sukses, databasemu kini sudah terisi dan siap melayani skenario *chatbot* secara penuh!

## 5. Fitur Penting: Bot Proxy & CSAT
Duration: 0:10:00

Sebagai developer IAMI Bot, kamu harus paham dua fitur khusus ini:

### Bot Proxy (Special Event)
Terkadang saat hari libur panjang atau maintenance, bot harus mati dan otomatis membalas "Mohon maaf layanan sedang tutup".
Fitur ini diatur via `.env`:
```env
BOT_PROXY_SPECIAL_EVENT_START=2026-04-17T00:00:00+07:00
BOT_PROXY_SPECIAL_EVENT_END=2026-04-20T06:00:00+07:00
BOT_PROXY_SPECIAL_EVENT_MESSAGE=Mohon maaf, layanan sedang tidak tersedia.
```

### CSAT (Customer Satisfaction)
Aplikasi ini menangani survei kepuasan pelanggan. 
- Saat agen selesai melayani customer (`/csat/resolve`), bot akan mengirimkan form CSAT.
- Jika customer *idle* lama (`/csat/idle`), bot akan melakukan follow-up atau auto-resolve room tersebut (di-handle oleh *background job* menggunakan `gocron`).

## 6. Prosedur Development & Deployment
Duration: 0:10:00

Tim ini menggunakan **Conventional Commits** dan **Bitbucket Pipelines** (CI/CD). Jangan sembarangan nge-push kode!

### Alur Kerja (SOP):
1. **Branching:** Selalu buat branch baru dari `main` dengan format `feature/nama-fitur` atau `bugfix/nama-bug`.
2. **Coding & Testing:** Kerjakan task kamu di lokal, jalankan `go test ./...`.
3. **Commiting:** Gunakan prefix standard seperti `feat:`, `fix:`, atau `chore:`.
   ```bash
   git commit -m "feat: tambah endpoint baru untuk pengecekan agent"
   ```
4. **Pull Request (PR):** Buat PR ke branch `staging` atau `main` sesuai instruksi Lead. Minta *code review*.
5. **CI/CD:** Setelah di-merge, pipeline akan otomatis membuat *Docker Image* baru dan men-deploy-nya ke server staging/production.

## 7. Challenge: Tugas Pertamamu!
Duration: 0:10:00

Sekarang kamu sudah paham aplikasinya. Coba lakukan *task* simulasi ini di lokalmu untuk membuktikan kamu siap:

1. **Tambahkan Endpoint Baru:**
   - Masuk ke `src/delivery/` dan buat endpoint baru `GET /ping-agent`.
   - Buat *UseCase* sederhana yang mengembalikan teks `"Agent System is Online"`.
   - Daftarkan route-nya di `src/app.go`.

2. **Testing:**
   - Jalankan `go run main.go`.
   - Lakukan `curl http://localhost:1213/ping-agent`.

3. **Explore Middleware:**
   - Temukan di mana `api-key` dicek. Cobalah mengirim request tanpa `api-key` dan lihat bagaimana middleware menolaknya.

Selamat! Kamu sudah lulus *onboarding* IAMI Bot Backend. Tanyakan *task* sebenarnya ke Tech Lead atau Project Manager-mu sekarang juga!
