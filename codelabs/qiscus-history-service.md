author: HelloGod Team
summary: Panduan membangun layanan arsip riwayat obrolan (Chat History Archive Service) untuk Qiscus menggunakan Golang.
id: qiscus-history-service
categories: Golang,Backend,Qiscus,API
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Building Qiscus Chat History Archive Service in Go

## Overview
Duration: 0:02:00

Selamat datang di codelab ini! Di sini Anda akan belajar bagaimana membangun **Chat History Archive Service** menggunakan bahasa pemrograman **Go (Golang)**. 

Layanan backend mandiri ini berfungsi untuk mengarsipkan pesan-pesan dari ruang obrolan (chat room) Qiscus dan menyajikannya ke aplikasi klien (misal: Flutter) saat *session* Qiscus telah kedaluwarsa.

### Apa yang Akan Anda Pelajari
* Menerima Webhook dari Qiscus secara aman menggunakan HMAC-SHA256 signature.
* Berinteraksi dengan Qiscus REST API menggunakan kredensial *Server-to-Server*.
* Menggunakan PostgreSQL untuk menyimpan data format JSONB.
* Membangun REST API aman yang dilindungi token otentikasi JWT menggunakan router `go-chi`.

### Prasyarat
* Instalasi Go 1.22+
* Instalasi PostgreSQL 15+
* Akun Qiscus Omnichannel dengan akses ke *App ID* dan *Secret Key*

Positive
: Solusi ini ideal digunakan jika aplikasi klien Anda menggunakan *sessional mode* pada SDK Qiscus, di mana token akan kedaluwarsa beberapa saat setelah obrolan berstatus *resolved*.

## Inisialisasi Proyek & Konfigurasi
Duration: 0:05:00

Mari mulai dengan menginisialisasi modul Go dan mengatur *environment variables*.

### 1. Inisialisasi Go Module

Jalankan perintah ini di terminal Anda untuk menginisialisasi modul dan mengunduh dependensi:

```bash
go mod init github.com/hellogod/chat-history-service
go get github.com/go-chi/chi/v5
go get github.com/golang-jwt/jwt/v5
go get github.com/joho/godotenv
go get github.com/lib/pq
```

### 2. Membuat File `.env`

Buat file bernama `.env` di direktori utama Anda dan isikan konfigurasi berikut. Pastikan untuk mengisi kredensial Qiscus dan kunci rahasia Anda sendiri:

```env
PORT=8080
DATABASE_URL=postgres://postgres:password@localhost:5432/chat_history?sslmode=disable

# Qiscus credentials
QISCUS_APP_ID=your_app_id
QISCUS_SECRET_KEY=your_qiscus_secret_key
QISCUS_BASE_URL=https://api3.qiscus.com
WEBHOOK_SECRET=your_webhook_secret_from_dashboard

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRY_HOURS=720
```

### 3. Memuat Konfigurasi di Go

Buat folder `internal/config/` dan tambahkan file `config.go`:

```go
package config

import (
    "log"
    "os"
    "strconv"
    "github.com/joho/godotenv"
)

type Config struct {
    Port                  string
    DatabaseURL           string
    QiscusAppID           string
    QiscusSecretKey       string
    QiscusBaseURL         string
    WebhookSecret         string
    JWTSecret             string
    JWTExpiryHours        int
}

func Load() Config {
    _ = godotenv.Load() // Mengabaikan error jika file .env tidak ada di production

    return Config{
        Port:            getEnv("PORT", "8080"),
        DatabaseURL:     requireEnv("DATABASE_URL"),
        QiscusAppID:     requireEnv("QISCUS_APP_ID"),
        QiscusSecretKey: requireEnv("QISCUS_SECRET_KEY"),
        QiscusBaseURL:   getEnv("QISCUS_BASE_URL", "https://api3.qiscus.com"),
        WebhookSecret:   requireEnv("WEBHOOK_SECRET"),
        JWTSecret:       requireEnv("JWT_SECRET"),
        JWTExpiryHours:  getEnvInt("JWT_EXPIRY_HOURS", 720),
    }
}

// Fungsi bantu (requireEnv, getEnv, getEnvInt) bisa ditambahkan di bawahnya.
```

## Konfigurasi Database PostgreSQL
Duration: 0:05:00

Kita akan menggunakan PostgreSQL dengan kolom berformat `JSONB` untuk kelenturan penyimpanan pesan tanpa perlu skema yang rumit.

### 1. Eksekusi Skema Tabel

Jalankan query SQL berikut di dalam database Anda untuk membuat tabel utama:

```sql
CREATE TABLE IF NOT EXISTS chat_archives (
    id          BIGSERIAL PRIMARY KEY,
    room_id     VARCHAR(50)  UNIQUE NOT NULL,
    room_name   VARCHAR(255) NOT NULL DEFAULT '',
    app_id      VARCHAR(100) NOT NULL,
    messages    JSONB        NOT NULL DEFAULT '[]',
    archived_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    source      VARCHAR(20)  NOT NULL DEFAULT 'webhook',
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_archives_room_id ON chat_archives (room_id);
```

### 2. Koneksi Database di Go

Buat folder `internal/database/` dan tambahkan file `db.go` untuk mengatur koneksi *pool*:

```go
package database

import (
    "database/sql"
    "log"
    _ "github.com/lib/pq"
)

func Open(databaseURL string) *sql.DB {
    db, err := sql.Open("postgres", databaseURL)
    if err != nil {
        log.Fatalf("database: open failed: %v", err)
    }

    db.SetMaxOpenConns(25)
    db.SetMaxIdleConns(5)

    return db
}
```

## Mengambil Data dari Qiscus
Duration: 0:07:00

Saat obrolan telah selesai (*resolved*), kita perlu menarik seluruh pesan ke dalam sistem kita dengan menggunakan REST API Qiscus.

### Qiscus HTTP Client

Buat folder `internal/qiscus/` dan tambahkan `client.go`. Client ini akan melakukan *request* HTTP dan menyertakan header otentikasi *server-to-server* `QISCUS_SDK_APP_ID` dan `QISCUS_SDK_SECRET`.

```go
package qiscus

import (
    "encoding/json"
    "fmt"
    "net/http"
    "time"
)

type Client struct {
    appID     string
    secretKey string
    baseURL   string
    http      *http.Client
}

func NewClient(appID, secretKey, baseURL string) *Client {
    return &Client{
        appID: appID, secretKey: secretKey, baseURL: baseURL,
        http: &http.Client{Timeout: 30 * time.Second},
    }
}

// ... Kode untuk GetRoomMessages() menggunakan endpoint /api/v2/rest/load_comments
```

Negative
: Jangan pernah memaparkan (expose) `QISCUS_SECRET_KEY` ke sisi *frontend* klien. Client ini dirancang khusus untuk berjalan di backend dengan aman.

## Webhook Handler & Keamanan HMAC
Duration: 0:10:00

Qiscus akan memanggil endpoint webhook kita setiap kali obrolan diselesaikan. Untuk menjamin keamanannya, Qiscus mengirimkan *signature* **HMAC-SHA256**.

### Implementasi Handler

Buat direktori `internal/handler/` dan file `webhook.go`:

```go
package handler

import (
    "crypto/hmac"
    "crypto/sha256"
    "crypto/subtle"
    "encoding/base64"
    "encoding/json"
    "io"
    "net/http"
    "github.com/hellogod/chat-history-service/internal/archive"
)

type WebhookHandler struct {
    secret  string // Qiscus Webhook Secret
    service *archive.Service
}

func (h *WebhookHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    bodyBytes, _ := io.ReadAll(r.Body)

    // 1. Verifikasi Signature dari header qiscus-signature-key
    signature := r.Header.Get("qiscus-signature-key")
    if !verifyHMACSignature(bodyBytes, h.secret, signature) {
        http.Error(w, "invalid signature", http.StatusUnauthorized)
        return
    }

    // 2. Parsing Payload Qiscus Multichannel ("Mark as Resolved")
    var payload struct {
        Service struct {
            RoomID     string `json:"room_id"`
            IsResolved bool   `json:"is_resolved"`
        } `json:"service"`
    }
    json.Unmarshal(bodyBytes, &payload)

    // 3. Merespons segera (HTTP 200) agar Qiscus tidak retry
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(`{"status":"accepted"}`))

    // 4. Lakukan arsip data secara asinkron (goroutine)
    go func() {
        h.service.FetchAndArchive(payload.Service.RoomID, "webhook")
    }()
}

func verifyHMACSignature(body []byte, secret, signatureHeader string) bool {
    mac := hmac.New(sha256.New, []byte(secret))
    mac.Write(body)
    expectedMAC := mac.Sum(nil)
    actualMAC, _ := base64.StdEncoding.DecodeString(signatureHeader)
    
    return subtle.ConstantTimeCompare(actualMAC, expectedMAC) == 1
}
```

## Menjalankan Server Utama
Duration: 0:05:00

Kini kita menyatukan seluruh komponen yang telah dibuat ke dalam server HTTP menggunakan `go-chi`.

### Entry Point (`main.go`)

Buat `cmd/server/main.go` yang akan menjadi *entry point* layanan Anda:

```go
package main

import (
    "log"
    "net/http"
    "github.com/go-chi/chi/v5"
    "github.com/hellogod/chat-history-service/internal/config"
    "github.com/hellogod/chat-history-service/internal/database"
    "github.com/hellogod/chat-history-service/internal/handler"
)

func main() {
    cfg := config.Load()
    db := database.Open(cfg.DatabaseURL)
    defer db.Close()

    // Setup Dependencies & Services...
    
    // Inisialisasi Router
    r := chi.NewRouter()

    // Mendaftarkan Endpoint Webhook
    webhookHandler := handler.NewWebhookHandler(cfg.WebhookSecret, service)
    r.Post("/webhook/resolve", webhookHandler.ServeHTTP)

    log.Printf("Server berjalan di port :%s", cfg.Port)
    http.ListenAndServe(":"+cfg.Port, r)
}
```

### Menjalankan Aplikasi

Jalankan perintah berikut di terminal:

```bash
go run ./cmd/server
```

Server backend arsip Anda kini telah berjalan dan siap menerima webhook dari Qiscus!

## Kesimpulan
Duration: 0:01:00

### Apa yang Telah Anda Pelajari
* ✅ Menyusun arsitektur Go yang bersih (*Clean Architecture* dasar).
* ✅ Memverifikasi keabsahan *request* webhook Qiscus menggunakan HMAC-SHA256 Base64.
* ✅ Menggunakan Goroutine untuk memproses pengarsipan data secara asinkron (*non-blocking*).
* ✅ Berinteraksi dengan database PostgreSQL langsung tanpa ORM menggunakan driver bawaan.

Selamat, Anda telah berhasil membangun layanan backend tangguh untuk melengkapi fungsionalitas aplikasi percakapan Anda!
