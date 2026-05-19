author: Fath
summary: Belajar Docker secara praktikal (Hands-on)! Containerisasi aplikasi Go, setup PostgreSQL & Redis dengan Docker Compose, dan teknik Multi-stage build.
id: docker-go-project
categories: Go, Docker, Backend, DevOps
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Hands-on Docker: Containerisasi Go + Postgres + Redis

## 1. Pendahuluan
Duration: 0:05:00

Selamat datang di Codelab Hands-on Docker! Jika sebelumnya kamu sudah mempelajari teori dasar Docker, sekarang saatnya **praktek langsung**! 

Di codelab ini, kamu tidak hanya sekadar menjalankan container, tapi kamu akan mensimulasikan alur kerja *Backend Engineer* profesional di industri: mulai dari membuat kode aplikasi, mengemasnya ke dalam container, menyambungkannya dengan database (PostgreSQL & Redis), hingga mengoptimasinya untuk *Production*.

### Apa yang akan kamu buat?
Kamu akan membuat dan men-dockerisasi sebuah aplikasi *Tracker Pengunjung* menggunakan **Go (Golang)**. Aplikasi ini akan:
1. Menampilkan pesan *Hello World* di web browser.
2. Menggunakan **Redis** untuk menghitung jumlah pengunjung.
3. Menggunakan **PostgreSQL** untuk menyimpan log history.

### Prasyarat
* Sudah menginstall Docker Desktop (atau Docker Engine di Linux).
* Sudah menginstall Go (Golang) di komputer lokal (opsional, karena kita akan menggunakan Docker sepenuhnya!).
* Memiliki code editor seperti VS Code.

Positive
: **Tips:** Buka terminal dan code editor-mu bersebelahan agar mudah mengikuti panduan ini. Mari kita mulai!

## 2. Inisialisasi Project Go
Duration: 0:10:00

Mari kita mulai dengan membuat folder proyek dan kode Go yang sangat sederhana.

### Langkah 1: Buat Folder Proyek
Buka terminalmu dan jalankan perintah berikut:

```bash
mkdir docker-go-tracker
cd docker-go-tracker
```

### Langkah 2: Inisialisasi Go Module
Kita perlu membuat module Go untuk mengelola dependensi.

```bash
go mod init tracker-app
```
*(Perintah ini akan membuat file `go.mod`)*

### Langkah 3: Buat File main.go
Buat file baru bernama `main.go` dan masukkan kode berikut. Ini adalah web server HTTP dasar yang mengembalikan pesan teks sederhana.

```go
package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Halo! Selamat datang di Codelab Docker Hands-on!\n")
	})

	fmt.Println("Server Go berjalan di port 8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
```

Jika kamu memiliki Go yang terinstall di komputermu, kamu bisa mengetesnya dengan perintah `go run main.go` lalu buka `http://localhost:8080`. Namun, tujuan kita adalah menjalankannya **di dalam Docker**!

## 3. Dockerfile Pertamamu
Duration: 0:15:00

Sekarang kita akan membuat blueprint atau "resep" agar aplikasi Go ini bisa berjalan di dalam Docker. File ini bernama `Dockerfile`.

### Langkah 1: Buat Dockerfile
Buat file baru dengan nama **tepat** `Dockerfile` (tanpa ekstensi apapun) di dalam folder `docker-go-tracker` dan isi dengan:

```dockerfile
# 1. Tentukan Base Image
# Kita menggunakan image resmi Go berbasis Alpine Linux (sangat ringan)
FROM golang:1.21-alpine

# 2. Tentukan direktori kerja di dalam container
WORKDIR /app

# 3. Salin file go.mod (dan go.sum jika ada) untuk install dependensi
COPY go.mod ./
# Jika nanti ada dependensi, jalankan: RUN go mod download

# 4. Salin seluruh source code kita ke dalam direktori kerja container
COPY . .

# 5. Build aplikasi Go menjadi file binary bernama 'server'
RUN go build -o server .

# 6. Informasikan bahwa container ini akan mendengarkan port 8080
EXPOSE 8080

# 7. Perintah yang dijalankan saat container start
CMD ["./server"]
```

### Langkah 2: Build Docker Image
Buka terminal, pastikan kamu berada di direktori yang sama dengan `Dockerfile`, lalu jalankan:

```bash
docker build -t my-go-tracker:v1 .
```

* `-t my-go-tracker:v1` memberikan nama (tag) pada image kita.
* `.` (titik) di akhir perintah memberitahu Docker untuk mencari `Dockerfile` di folder saat ini.

Tunggu hingga proses selesai. Docker akan mendownload base image Golang dan meng-compile kodemu.

### Langkah 3: Jalankan Container
Setelah image berhasil dibuat, jalankan container-nya:

```bash
docker run -d -p 8080:8080 --name tracker-app my-go-tracker:v1
```

* `-d` (detached): Container berjalan di background.
* `-p 8080:8080`: Memetakan port 8080 di komputermu (kiri) ke port 8080 di dalam container (kanan).
* `--name`: Memberi nama container.

### Langkah 4: Tes Aplikasi
Buka browser dan akses **`http://localhost:8080`**. Kamu akan melihat tulisan "Halo! Selamat datang di Codelab Docker Hands-on!".

Hebat! Kamu telah berhasil men-dockerisasi aplikasi Go!

## 4. Menambahkan Redis via Docker Compose
Duration: 0:15:00

Di dunia nyata, aplikasi tidak berdiri sendiri. Ia butuh database atau cache. Mari kita tambahkan **Redis** untuk menghitung berapa kali halaman kita dikunjungi.

Daripada menjalankan container Redis dan Go secara terpisah dan repot menyambungkannya, kita akan menggunakan **Docker Compose**.

### Langkah 1: Install Driver Redis untuk Go
Di terminal komputermu, jalankan:
```bash
go get github.com/go-redis/redis/v8
```

### Langkah 2: Update main.go
Ubah `main.go` kamu untuk menggunakan Redis:

```go
package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-redis/redis/v8"
)

var ctx = context.Background()

func main() {
	// Ambil host Redis dari Environment Variable (default: localhost)
	redisHost := os.Getenv("REDIS_HOST")
	if redisHost == "" {
		redisHost = "localhost:6379"
	}

	// Inisialisasi koneksi Redis
	rdb := redis.NewClient(&redis.Options{
		Addr: redisHost,
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Increment nilai 'visits' di Redis
		visits, err := rdb.Incr(ctx, "visits").Result()
		if err != nil {
			http.Error(w, "Gagal terhubung ke Redis", http.StatusInternalServerError)
			return
		}

		fmt.Fprintf(w, "Halo! Kamu adalah pengunjung ke-%d\n", visits)
	})

	fmt.Println("Server Go berjalan di port 8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
```

### Langkah 3: Buat file docker-compose.yml
Di folder proyek yang sama, buat file `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # Service untuk aplikasi Go kita
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      # Nama 'redis-db' ini merujuk ke nama service redis di bawah
      - REDIS_HOST=redis-db:6379
    depends_on:
      - redis-db

  # Service untuk Redis
  redis-db:
    image: redis:alpine
    ports:
      - "6379:6379"
```

### Langkah 4: Jalankan Docker Compose
Sebelum menjalankan, pastikan kita matikan container lama yang berjalan di port 8080:
```bash
docker stop tracker-app
docker rm tracker-app
```

Sekarang, jalankan semua layanan sekaligus dengan ajaib:
```bash
docker-compose up -d --build
```
*(`--build` memaksa Docker untuk mem-build ulang image Go kita karena kode `main.go` sudah berubah).*

### Langkah 5: Tes Redis
Buka **`http://localhost:8080`** dan *refresh* berkali-kali. Kamu akan melihat angka pengunjung bertambah! Aplikasi Go di dalam container berhasil berbicara dengan Redis di dalam container lainnya!

## 5. Menambahkan PostgreSQL & Persistensi Data
Duration: 0:20:00

Data di Redis disimpan di memori dan akan hilang jika container direstart. Mari kita tambahkan **PostgreSQL** untuk data permanen, dan pelajari tentang **Docker Volumes**.

### Langkah 1: Buat Volume di Docker Compose
Update file `docker-compose.yml` milikmu menjadi seperti ini:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - REDIS_HOST=redis-db:6379
      # Konfigurasi Database Postgres
      - DB_HOST=postgres-db
      - DB_USER=admin
      - DB_PASSWORD=rahasia
      - DB_NAME=tracker_db
    depends_on:
      - redis-db
      - postgres-db

  redis-db:
    image: redis:alpine
    ports:
      - "6379:6379"

  postgres-db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=rahasia
      - POSTGRES_DB=tracker_db
    ports:
      - "5432:5432"
    volumes:
      # Memasang (Mount) Docker Volume agar data tidak hilang!
      - pg-data:/var/lib/postgresql/data

# Deklarasi nama volume
volumes:
  pg-data:
```

Negative
: **Penting!** `volumes: - pg-data:/var/lib/postgresql/data` adalah kunci agar data PostgreSQL kamu tidak hilang (persistent) ketika container dihentikan atau dihapus.

### Langkah 2: Jalankan kembali Compose
Kamu tidak perlu mematikan aplikasi, cukup jalankan perintah ini lagi:

```bash
docker-compose up -d
```
Docker Compose cukup cerdas untuk mengetahui bahwa service `postgres-db` baru ditambahkan dan akan langsung men-download image PostgreSQL serta membuat databasenya.

### Langkah 3: Verifikasi Database
Mari kita masuk ke dalam container PostgreSQL untuk memastikan database sudah siap:

```bash
# Mengeksekusi psql di dalam container postgres-db
docker-compose exec postgres-db psql -U admin -d tracker_db
```

Jika berhasil, prompt akan berubah menjadi `tracker_db=#`.
Ketik `\q` lalu tekan Enter untuk keluar.

## 6. Multi-Stage Build untuk Production
Duration: 0:15:00

Sekarang aplikasi kita sudah jalan. Namun, mari kita lihat ukuran image aplikasi Go kita:
```bash
docker images | grep tracker-app
```
Kamu mungkin melihat ukurannya sekitar **300 MB - 500 MB**! Ini karena image tersebut memuat kompiler Go, tools OS lengkap, dll. Di *Production*, kita hanya butuh file *binary* jadinya saja.

### Konsep Multi-Stage Build
Kita akan membagi `Dockerfile` menjadi dua tahap (*stages*):
1. **Builder Stage**: Mendownload dependensi dan meng-compile kode Go.
2. **Production Stage**: Menggunakan OS super kecil (Alpine), mengambil file binary dari Builder, dan menjalankannya.

### Langkah 1: Ubah Dockerfile
Ubah isi `Dockerfile` kamu secara total menjadi seperti ini:

```dockerfile
# ==========================================
# STAGE 1: Builder
# ==========================================
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Install dependensi (bisa dicache oleh Docker)
COPY go.mod go.sum ./
RUN go mod download

# Salin source code dan compile
COPY . .
# CGO_ENABLED=0 memastikan binary murni statis, tanpa dependensi C library luar
RUN CGO_ENABLED=0 GOOS=linux go build -o server .

# ==========================================
# STAGE 2: Production Minimalist
# ==========================================
FROM alpine:latest

WORKDIR /app

# Copy HANYA file 'server' dari STAGE 1
COPY --from=builder /app/server .

# Berikan label port
EXPOSE 8080

CMD ["./server"]
```

### Langkah 2: Build Ulang dan Bandingkan Ukuran
Jalankan Docker Compose untuk mem-build ulang dengan Dockerfile baru:
```bash
docker-compose build api
```

Lalu cek lagi ukuran image-nya:
```bash
docker images
```
Luar biasa! Image barumu (*alpine-based*) sekarang kemungkinan berukuran **di bawah 20 MB**! Ini membuatnya sangat cepat untuk didownload (pull) dan sangat aman dari sisi keamanan (attack surface kecil).

Positive
: **Multi-stage builds** adalah *best practice* paling penting yang membedakan antara developer pemula dan mahir dalam meracik Docker!

## 7. Membersihkan Environment
Duration: 0:02:00

Penting untuk selalu "membersihkan" hasil eksperimen agar tidak memenuhi storage laptop kamu.

Untuk mematikan aplikasi dan **sekaligus menghapus** container dan network yang dibuat:
```bash
docker-compose down
```

Jika kamu juga ingin menghapus volume (Artinya: Semua data di database PostgreSQL akan musnah selamanya), tambahkan `-v`:
```bash
docker-compose down -v
```

## 8. Selamat!
Duration: 0:01:00

Kamu telah berhasil menyelesaikan Codelab yang komprehensif ini! 

### Apa yang telah kamu kuasai:
* ✅ Menulis `Dockerfile` dari nol untuk proyek nyata.
* ✅ Menggunakan *Docker CLI* untuk *build* dan *run*.
* ✅ Membuat arsitektur Microservices (Go API, Redis, Postgres) menggunakan `docker-compose.yml`.
* ✅ Menjamin persistensi data database dengan *Docker Volumes*.
* ✅ Menerapkan *Multi-Stage Builds* untuk mengecilkan ukuran image Go hingga 95% untuk *Production*.

### Langkah Selanjutnya
Tantangan untukmu: 
Coba dockerisasi salah satu aplikasi yang sedang kamu kerjakan, buat `docker-compose.yml` agar *local development* tim kamu seragam tanpa pusing install database!

Teruslah berkarya dan *Happy Coding*!
