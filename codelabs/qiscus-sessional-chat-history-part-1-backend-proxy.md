author: LearnWithFath Team
summary: Part 1 dari seri Qiscus Sessional Chat History — bangun backend proxy Go generik, tanpa database, yang membuat riwayat chat lintas sesi bisa dibaca lagi setelah room sessional di Qiscus resolved. Termasuk dua bug nyata yang ditemukan saat verifikasi ke Qiscus asli (bentuk respons API dan urutan pesan) dan cara menghindarinya.
id: qiscus-sessional-chat-history-part-1-backend-proxy
categories: Golang,Backend,Qiscus,API
tags: go, golang, qiscus, sessional, chat-history, rest-api, jwt
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Qiscus Sessional Chat History — Part 1: Backend Proxy Generik dengan Go

## Overview
Duration: 0:03:00

Selamat datang di Part 1 dari seri **Qiscus Sessional Chat History**. Di seri ini kita membangun ulang sesuatu yang nyata dikerjakan: fitur "riwayat percakapan lintas sesi" untuk app yang memakai Qiscus dalam mode **sessional**.

### Masalahnya

App yang berjalan dalam mode Qiscus *sessional* mengganti room chat aktifnya setiap kali sebuah sesi selesai (*resolved*). Widget/SDK sisi app cuma menyimpan referensi ke **satu** room aktif — begitu sesi lama resolved, app tidak lagi punya cara membaca isi room lama itu lewat token user biasa (token itu sudah tidak valid untuk room yang bukan room aktifnya).

Kabar baiknya: Qiscus **tidak menghapus** data room lama, dan punya REST API admin (`get_user_rooms`, `load_comments`) yang bisa membaca riwayat itu — asal dipanggil dengan **kredensial server** (App ID + Secret Key), bukan token user.

### Kenapa proxy, bukan langsung dari app

Kredensial server Qiscus (`QISCUS_SECRET_KEY`) **tidak boleh** ada di kode app (mobile/web) — siapa pun yang decompile app bisa mencurinya dan membaca riwayat chat user lain. Solusinya: sebuah layanan backend kecil yang memegang kredensial itu, memverifikasi identitas user lewat JWT-nya sendiri, lalu meneruskan hasil query ke app.

### Apa yang Akan Anda Bangun

* Backend Go mandiri, **tanpa database, tanpa webhook** — riwayat diambil langsung dari Qiscus saat diminta.
* Endpoint `GET /api/v1/sessions` (daftar sesi) dan `GET /api/v1/sessions/{room_id}/messages` (transkrip).
* Autentikasi JWT RS256 dengan verifikasi kepemilikan room.
* Konfigurasi 100% lewat environment variable — ganti klien tanpa ganti kode.

### Prasyarat

* Go 1.22+ terinstal
* Familiar dengan REST API dan konsep JWT
* Akun Qiscus Omnichannel dengan App ID & Secret Key (opsional untuk mengikuti — bisa pakai nilai dummy sampai tahap testing)

Positive
: Arsitektur ini disebut **Opsi A** (proxy read-only) dibanding **Opsi B** (webhook + database sendiri). Opsi A dipilih karena tidak menambah beban infra di kedua sisi — tidak ada tabel yang perlu di-maintain, tidak ada webhook yang bisa gagal diam-diam.

## Inisialisasi Proyek
Duration: 0:04:00

### 1. Buat modul Go

```bash
mkdir chat-history-proxy && cd chat-history-proxy
go mod init github.com/yourname/chat-history-proxy
go get github.com/go-chi/chi/v5
go get github.com/golang-jwt/jwt/v5
```

Kita pakai [`chi`](https://github.com/go-chi/chi) sebagai router — ringan dan cukup untuk proxy sekecil ini — dan `golang-jwt` untuk verifikasi token RS256.

### 2. Struktur folder

```
cmd/chat-history-proxy/main.go   # entry point, wiring
internal/proxy/
  config/     # loader environment
  qiscus/     # klien REST admin Qiscus
  cache/      # TTL cache in-memory
  middleware/ # verifikasi JWT RS256
  handler/    # HTTP handlers
```

Negative
: Jangan taruh semua logic di `main.go`. Proxy ini kecil, tapi tetap pisahkan per tanggung jawab — begitu nanti ada bug (dan akan ada, lihat bagian selanjutnya), kamu butuh unit test yang bisa jalan tanpa server HTTP nyala.

## Konfigurasi — Gagal Cepat, Jangan Diam-diam Salah
Duration: 0:06:00

Prinsip paling penting di proxy ini: **semua nilai yang beda per klien dibaca dari environment variable, dan service menolak start kalau kredensial wajib kosong.**

### `internal/proxy/config/config.go`

```go
package config

import (
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	Port             string
	QiscusAppID      string
	QiscusSecretKey  string
	QiscusBaseURL    string
	JWTPublicKeyPEM  string
	CacheTTLSeconds  int
}

var requiredEnvVars = []string{"QISCUS_APP_ID", "QISCUS_SECRET_KEY", "JWT_PUBLIC_KEY"}

func Load() (Config, error) {
	for _, name := range requiredEnvVars {
		if os.Getenv(name) == "" {
			return Config{}, fmt.Errorf("missing required environment variable: %s", name)
		}
	}

	ttl, err := strconv.Atoi(getEnvOr("CACHE_TTL_SECONDS", "60"))
	if err != nil {
		return Config{}, fmt.Errorf("CACHE_TTL_SECONDS must be a number: %w", err)
	}

	return Config{
		Port:            getEnvOr("APP_PORT", "8081"),
		QiscusAppID:     os.Getenv("QISCUS_APP_ID"),
		QiscusSecretKey: os.Getenv("QISCUS_SECRET_KEY"),
		QiscusBaseURL:   getEnvOr("QISCUS_BASE_URL", "https://api3.qiscus.com"),
		JWTPublicKeyPEM: os.Getenv("JWT_PUBLIC_KEY"),
		CacheTTLSeconds: ttl,
	}, nil
}

func getEnvOr(name, fallback string) string {
	if v := os.Getenv(name); v != "" {
		return v
	}
	return fallback
}
```

Kenapa ini penting: kalau `QISCUS_SECRET_KEY` kosong dan kita biarkan lolos dengan nilai default kosong, service akan tetap **jalan** tapi setiap request ke Qiscus akan gagal dengan error yang membingungkan (401 dari Qiscus, bukan error konfigurasi yang jelas). Fail-fast di startup jauh lebih mudah didiagnosis.

### Test-nya

```go
package config

import "testing"

func TestLoad_MissingRequiredVars(t *testing.T) {
	t.Setenv("QISCUS_APP_ID", "")
	t.Setenv("QISCUS_SECRET_KEY", "")
	t.Setenv("JWT_PUBLIC_KEY", "")

	_, err := Load()
	if err == nil {
		t.Fatal("expected an error when required env vars are missing")
	}
}
```

Positive
: Field yang aman punya default (`APP_PORT`, `CACHE_TTL_SECONDS`) boleh fallback ke nilai wajar. Kredensial (App ID, Secret, public key JWT) **tidak boleh** punya default — itu yang bikin "ganti klien = ganti `.env`" benar-benar aman, bukan cuma slogan.

## Klien REST Qiscus — Dua Bug Nyata yang Ditemukan Saat Verifikasi
Duration: 0:12:00

Bagian ini yang paling berharga dari seri ini: **dua bug nyata** yang lolos dari asumsi awal (berdasarkan dokumentasi REST admin Qiscus yang generik) dan baru ketahuan setelah dicoba ke Qiscus sungguhan.

### Asumsi awal (SALAH)

Dokumentasi umum REST admin Qiscus menyarankan bentuk respons seperti ini untuk `get_user_rooms`:

```json
{ "results": { "rooms_info": [ { "room_id": "...", "is_resolved": true, "last_comment": {...} } ] } }
```

### Kenyataan (setelah dicoba ke app Qiscus sungguhan)

```json
{
  "results": {
    "rooms": [
      {
        "room_id": "369260357",
        "room_name": "Guest 1001",
        "room_options": "{\"is_resolved\": false, \"channel\": \"qiscus\"}"
      }
    ]
  }
}
```

Tiga perbedaan nyata:
1. Key array-nya `rooms`, **bukan** `rooms_info`.
2. `is_resolved` ada **di dalam** `room_options`, dan `room_options` itu sendiri adalah **string JSON**, bukan objek langsung — perlu `json.Unmarshal` dua kali.
3. Tidak ada `last_comment` atau `room_created_at` sama sekali — endpoint ini **tidak** menyediakan pesan terakhir atau waktu mulai sesi.

```go
type getUserRoomsResponse struct {
	Results struct {
		Rooms []struct {
			RoomID      string `json:"room_id"`
			RoomName    string `json:"room_name"`
			RoomOptions string `json:"room_options"`
		} `json:"rooms"`
	} `json:"results"`
}

type roomOptions struct {
	IsResolved bool   `json:"is_resolved"`
	Topic      string `json:"topic"`
}

func (c *Client) GetUserRooms(userID string) ([]Session, error) {
	endpoint := fmt.Sprintf("%s/api/v2.1/rest/get_user_rooms?user_id=%s", c.baseURL, url.QueryEscape(userID))

	var body getUserRoomsResponse
	if err := c.getJSON(endpoint, &body); err != nil {
		return nil, fmt.Errorf("qiscus: get_user_rooms: %w", err)
	}

	sessions := make([]Session, 0, len(body.Results.Rooms))
	for _, room := range body.Results.Rooms {
		var opts roomOptions
		_ = json.Unmarshal([]byte(room.RoomOptions), &opts) // best-effort: room tetap ditampilkan kalau ini gagal

		session := Session{RoomID: room.RoomID, Name: room.RoomName, IsResolved: opts.IsResolved, Topic: opts.Topic}

		if messages, err := c.GetRoomMessages(room.RoomID); err == nil && len(messages) > 0 {
			session.StartedAt = messages[0].CreatedAt
			session.LastMessage = lastDisplayableMessage(messages)
		}
		sessions = append(sessions, session)
	}
	return sessions, nil
}
```

Karena `get_user_rooms` tidak menyediakan pesan terakhir, kita menutup gap itu dengan **satu panggilan tambahan** `load_comments` per room. Ini biaya nyata (N+1 request untuk N room) — diterima di skala jumlah room per user yang wajar, dan dicatat jujur sebagai batasan, bukan disembunyikan.

### Bug kedua: urutan pesan yang terbalik

Load comments diasumsikan mengembalikan pesan **oldest-first** (dari lama ke baru) — asumsi ini bahkan sempat "diverifikasi" dengan fixture 2 pesan yang kebetulan urut ascending, jadi lolos test. Begitu dicoba ke room dengan riwayat panjang (`curl` langsung), ternyata:

```
4638469007  2026-09-16T04:50:44Z  Mohon isi survey...      <- pesan TERBARU, tapi array index [0]
4638468790  2026-09-16T04:50:41Z  This conversation...
3512112756  2025-11-18T16:53:38Z  we                       <- pesan TERLAMA, array index terakhir
```

Qiscus mengembalikan **newest-first (descending)**. Kalau tidak dibalik, `StartedAt` (baca index 0) malah dapat pesan **terbaru**, dan pencarian "pesan terakhir yang bukan system event" (mencari dari belakang array) malah mendarat di pesan **paling lama** — persis kebalikannya dari yang dimaksud.

```go
// GetRoomMessages returns every message in roomID, oldest first.
// load_comments dari Qiscus sendiri mengembalikan NEWEST FIRST — dibalik di
// sini sekali, supaya semua pemanggil lain bisa asumsikan ascending.
func (c *Client) GetRoomMessages(roomID string) ([]Message, error) {
	// ... fetch body.Results.Comments seperti biasa ...

	comments := body.Results.Comments
	messages := make([]Message, len(comments))
	for i, comment := range comments {
		messages[len(comments)-1-i] = Message{ /* ... */ }
	}
	return messages, nil
}
```

Negative
: **Pelajaran paling penting di seri ini:** komentar kode yang bilang "verified against a live API" tidak otomatis benar selamanya. Verifikasi pertama cuma pakai fixture 2 pesan yang kebetulan urut benar secara kebetulan — tidak pernah ke-exercise dengan data yang representatif (banyak pesan, span waktu jauh) sampai ada yang benar-benar mencoba. **Selalu `curl` langsung ke data nyata sebelum percaya asumsi urutan/bentuk API**, terutama untuk API pihak ketiga yang dokumentasinya generik.

## Cache TTL dan Bug "Room Baru Tidak Muncul"
Duration: 0:07:00

Untuk membatasi beban ke Qiscus, daftar sesi di-cache in-memory per user selama beberapa puluh detik.

```go
type TTLCache[V any] struct {
	mu      sync.RWMutex
	entries map[string]entry[V]
	ttl     time.Duration
	now     func() time.Time
}

func (c *TTLCache[V]) Get(key string) (V, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	e, ok := c.entries[key]
	if !ok || c.now().After(e.expiresAt) {
		var zero V
		return zero, false
	}
	return e.value, true
}
```

Masalahnya: kalau user baru saja membuat sesi baru lalu langsung minta daftar sesi lagi, cache lama (dari **sebelum** room itu ada) masih dilayani sampai TTL habis — room baru itu kelihatan "tidak muncul", padahal datanya sudah ada di Qiscus. Bahkan **pull-to-refresh manual pun tidak menyelesaikan ini** kalau masih dalam window cache yang sama.

Solusinya: query param `?fresh=1` yang melewati cache (tapi tetap mengisinya ulang untuk request berikutnya):

```go
func (h *SessionsHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// ...
	bypassCache := r.URL.Query().Get("fresh") == "1"
	sessions, err := h.getSessions(userID, bypassCache)
	// ...
}

func (h *SessionsHandler) getSessions(userID string, bypassCache bool) ([]Session, error) {
	if h.Cache != nil && !bypassCache {
		if cached, ok := h.Cache.Get(userID); ok {
			return cached, nil
		}
	}
	sessions, err := h.Lister.GetUserRooms(userID)
	if err != nil {
		return nil, err
	}
	if h.Cache != nil {
		h.Cache.Set(userID, sessions)
	}
	return sessions, nil
}
```

Sisi klien (app) yang tahu kapan dia baru saja membuat room baru — jadi dia yang memutuskan kapan mengirim `?fresh=1`. Kita bahas ini lagi di Part 2.

## Autentikasi JWT RS256 dan Verifikasi Kepemilikan Room
Duration: 0:08:00

### Kenapa RS256, bukan token dari layanan ini sendiri

Token yang dipakai untuk memanggil proxy ini **diterbitkan oleh backend auth klien sendiri**, bukan oleh proxy. Proxy hanya perlu **public key**-nya (`JWT_PUBLIC_KEY`, dari environment) untuk memverifikasi tanda tangan — private key tidak pernah ada di proxy ini.

```go
func JWTAuthRS256(publicKey *rsa.PublicKey) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
			if tokenString == "" {
				http.Error(w, "missing Authorization header", http.StatusUnauthorized)
				return
			}

			token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
				return publicKey, nil
			}, jwt.WithValidMethods([]string{"RS256"}))
			if err != nil || !token.Valid {
				http.Error(w, "invalid token", http.StatusUnauthorized)
				return
			}

			claims, _ := token.Claims.(jwt.MapClaims)
			userID, _ := claims["sub"].(string)
			if userID == "" {
				http.Error(w, "token missing sub claim", http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), UserIDKey, userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
```

### Verifikasi kepemilikan room — jangan percaya `room_id` dari klien

Endpoint transkrip (`GET /api/v1/sessions/{room_id}/messages`) **tidak** boleh langsung mengambil `room_id` dari URL dan mengambil isinya. Sebelum itu, cek apakah room itu ada di daftar sesi milik `sub` dari JWT:

```go
func (h *MessagesHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	userID, _ := megamiddleware.UserIDFromContext(r.Context())
	roomID := chi.URLParam(r, "room_id")

	sessions, err := (&SessionsHandler{Lister: h.Lister, Cache: h.Cache}).getSessions(userID, false)
	if err != nil {
		writeUpstreamError(w, "failed to verify room ownership", err)
		return
	}
	if !ownsRoom(sessions, roomID) {
		http.NotFound(w, r) // 404, BUKAN 403 — jangan bocorkan keberadaan room orang lain
		return
	}
	// ... lanjut ambil transkrip
}
```

Negative
: `404` dipilih dengan sengaja, bukan `403`. Kalau membalas `403 Forbidden` untuk room yang bukan milik user, itu membocorkan informasi "room ini ADA, cuma kamu tidak boleh baca" — memudahkan orang menebak `room_id` valid lewat brute force. `404` membuat "tidak ada" dan "bukan punyamu" tidak bisa dibedakan dari luar.

## Menjalankan dan Menguji
Duration: 0:06:00

### Setup environment

```bash
cp .env.example .env
# isi QISCUS_APP_ID, QISCUS_SECRET_KEY, dan JWT_PUBLIC_KEY (RSA PEM)
set -a; source .env; set +a
go run ./cmd/chat-history-proxy
```

### Testing tanpa backend auth klien asli

Untuk mencoba endpoint tanpa harus punya backend auth klien beneran, buat tool kecil yang menandatangani JWT dev dengan key lokal:

```bash
openssl genrsa -out .dev/jwt_private.pem 2048
openssl rsa -in .dev/jwt_private.pem -pubout -out .dev/jwt_public.pem
export JWT_PUBLIC_KEY="$(cat .dev/jwt_public.pem)"

TOKEN=$(go run ./cmd/devtools/gen-dev-jwt -key .dev/jwt_private.pem -sub some-user-id -ttl 168h)
curl -H "Authorization: Bearer $TOKEN" "http://localhost:8081/api/v1/sessions?fresh=1"
```

Positive
: `.dev/` masuk `.gitignore` — key ini murni lokal untuk testing, tidak pernah dipakai di deployment sungguhan. Pola ini (script generator token dev, terpisah dari kode produksi) berguna dipakai ulang di proyek lain yang butuh testing JWT tanpa auth server asli.

### Jalankan test

```bash
go build ./...
go vet ./...
go test ./...
```

## Ringkasan dan Lanjut ke Part 2
Duration: 0:02:00

### Yang Sudah Anda Bangun

* ✅ Backend Go tanpa database yang membaca riwayat chat lintas sesi dari Qiscus.
* ✅ Konfigurasi 100% environment-driven, fail-fast kalau kredensial kosong.
* ✅ Dua bug nyata diperbaiki: bentuk respons `get_user_rooms` (dan `room_options` sebagai string JSON bersarang), dan urutan `load_comments` yang newest-first.
* ✅ Cache TTL dengan mekanisme bypass (`?fresh=1`) untuk sesi yang baru dibuat.
* ✅ Autentikasi JWT RS256 dan verifikasi kepemilikan room (404, bukan 403).

### Kontrak API yang dihasilkan

```
GET /api/v1/sessions
  -> { "data": [ { "room_id", "name", "started_at", "is_resolved", "last_message", "topic" } ] }

GET /api/v1/sessions/{room_id}/messages
  -> { "data": [ { "id", "sender_role", "sender_name", "type", "text", "payload", "created_at" } ] }
```

Backend ini sekarang siap dipakai — tapi belum ada yang memanggilnya. Di **Part 2**, kita integrasikan proxy ini ke dalam app React Native yang memakai `@qiscus-community/react-native-multichannel-widget`, termasuk beberapa bug UI/navigasi nyata (layar putih setelah reload, tombol back yang salah logout) dan cara membuat sesi baru dengan topik.

Positive
: **Lanjut ke Part 2 — Integrasi di React Native App:** [learnwithfath.github.io/codelabs/qiscus-sessional-chat-history-part-2-react-native-app/](https://learnwithfath.github.io/codelabs/qiscus-sessional-chat-history-part-2-react-native-app/)

## Sumber
Duration: 0:01:00

* [Qiscus Omnichannel REST API — get_user_rooms](https://documentation.qiscus.com/multichannel-chat/get-user-rooms)
* [Qiscus Omnichannel REST API — load_comments](https://documentation.qiscus.com/multichannel-chat/get-room-comments)
* [go-chi router](https://github.com/go-chi/chi)
* [golang-jwt/jwt](https://github.com/golang-jwt/jwt)
