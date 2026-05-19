author: Fath
summary: Panduan lengkap Docker dari nol sampai tingkat mahir. Pelajari konsep container, Dockerfile, Docker Compose, hingga best practices untuk production.
id: docker-masterclass
categories: Backend, Docker, DevOps
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Docker Masterclass: Dari Pemula ke Mahir

## Pengenalan Docker
Duration: 0:05:00

Welcome to Docker Masterclass! Di codelab ini, kamu akan belajar Docker secara komprehensif mulai dari konsep dasar hingga teknik lanjutan.

### Apa itu Docker?
Docker adalah platform open-source yang memungkinkan developer untuk membangun, mendeploy, dan menjalankan aplikasi di dalam container. 

Container adalah unit standar perangkat lunak yang mengemas kode dan semua dependensinya sehingga aplikasi berjalan dengan cepat dan andal dari satu lingkungan komputasi ke lingkungan komputasi lainnya.

### Container vs Virtual Machine (VM)
* **Virtual Machine**: Mengemas aplikasi, dependensi, dan seluruh sistem operasi (Guest OS) di atas Hypervisor. Lebih berat dan lambat.
* **Container**: Hanya mengemas aplikasi dan dependensinya. Container berbagi kernel dari Host OS. Jauh lebih ringan, cepat, dan efisien dalam penggunaan resource.

### Kenapa menggunakan Docker?
1. **Konsistensi Lingkungan**: "It works on my machine" tidak lagi menjadi masalah. Lingkungan development, testing, dan production akan selalu identik.
2. **Efisiensi Resource**: Container jauh lebih ringan dari VM.
3. **Isolasi**: Aplikasi berjalan di environment yang terisolasi, sehingga tidak akan ada konflik dependensi.
4. **Skalabilitas**: Sangat mudah untuk men-scale aplikasi dengan menambah container.

Positive
: Docker telah menjadi standar industri untuk modern deployment dan arsitektur microservices.

## Instalasi dan Setup
Duration: 0:05:00

### Instalasi Docker Desktop
Untuk pengguna Windows dan Mac, cara termudah adalah menggunakan Docker Desktop.
1. Kunjungi [Docker Desktop Download Page](https://www.docker.com/products/docker-desktop).
2. Unduh installer sesuai OS kamu.
3. Jalankan installer dan ikuti instruksinya.

Untuk Linux (Ubuntu), kamu bisa menggunakan script instalasi resmi:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Verifikasi Instalasi
Buka terminal dan jalankan perintah berikut untuk memastikan Docker sudah terinstall dengan benar:
```bash
docker --version
```

Lalu coba jalankan container pertama kamu:
```bash
docker run hello-world
```

Jika berhasil, kamu akan melihat pesan "Hello from Docker!".

## Konsep Dasar dan Perintah Utama
Duration: 0:10:00

Di bagian ini kita akan mempelajari komponen utama Docker dan perintah (commands) yang paling sering digunakan.

### Komponen Utama
* **Image**: Blueprint atau template read-only dengan instruksi untuk membuat Docker container.
* **Container**: Instance yang berjalan dari sebuah image.
* **Registry**: Tempat penyimpanan Docker images (contoh: Docker Hub).

### Perintah Dasar Docker
Berikut adalah perintah-perintah yang akan kamu jalankan setiap hari:

#### 1. Manajemen Image
```bash
# Mencari image di Docker Hub
docker search nginx

# Mendownload image dari registry
docker pull nginx:latest

# Melihat daftar image yang ada di lokal
docker images

# Menghapus image
docker rmi nginx
```

#### 2. Manajemen Container
```bash
# Menjalankan container baru dari image (berjalan di foreground)
docker run nginx

# Menjalankan container di background (Detached mode) dan mapping port (Host:Container)
docker run -d -p 8080:80 --name web-server nginx

# Melihat container yang sedang berjalan
docker ps

# Melihat semua container (termasuk yang sudah stop)
docker ps -a

# Menghentikan container
docker stop web-server

# Menjalankan kembali container yang berhenti
docker start web-server

# Menghapus container
docker rm web-server
```

#### 3. Interaksi dengan Container
```bash
# Melihat log dari container
docker logs web-server

# Masuk ke dalam terminal container yang sedang berjalan
docker exec -it web-server bash
# (Gunakan 'sh' jika 'bash' tidak tersedia di dalam container)
```

Negative
: Jangan pernah menyimpan data penting secara langsung di dalam container. Ketika container dihapus, semua data di dalamnya juga akan ikut terhapus!

## Membuat Custom Image (Dockerfile)
Duration: 0:15:00

Seringkali kita perlu membuat image untuk aplikasi kita sendiri. Kita melakukannya dengan membuat file bernama `Dockerfile`.

### Apa itu Dockerfile?
`Dockerfile` adalah file teks berisi serangkaian instruksi untuk membangun sebuah Docker image.

### Struktur Dockerfile
Mari kita buat contoh aplikasi Go sederhana. Buat file `main.go`:
```go
package main

import (
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello from custom Docker container!")
    })
    fmt.Println("Server running on port 8080...")
    http.ListenAndServe(":8080", nil)
}
```

Sekarang buat file bernama `Dockerfile` di direktori yang sama:
```dockerfile
# Menggunakan base image golang versi terbaru
FROM golang:1.21-alpine

# Set working directory di dalam container
WORKDIR /app

# Copy source code ke dalam container
COPY main.go .

# Build aplikasi Go
RUN go build -o main .

# Expose port yang digunakan aplikasi
EXPOSE 8080

# Command untuk menjalankan aplikasi
CMD ["./main"]
```

### Membangun (Build) dan Menjalankan Image
```bash
# Build image dengan nama 'my-go-app' dan tag 'v1'
docker build -t my-go-app:v1 .

# Jalankan image yang baru dibuat
docker run -d -p 8080:8080 --name go-app my-go-app:v1
```
Buka browser dan akses `http://localhost:8080`.

## Docker Volumes dan Networks
Duration: 0:10:00

### Docker Volumes (Persistensi Data)
Secara default, semua data yang dibuat di dalam container akan hilang saat container dihapus. Untuk menyimpan data secara permanen, kita menggunakan **Volumes**.

```bash
# Membuat volume
docker volume create my-data

# Menjalankan container dengan mount volume
docker run -d -v my-data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=secret mysql:8
```
Sekarang, meskipun container MySQL dihapus, data database akan tetap aman di dalam volume `my-data`.

### Docker Networks
Container dalam satu network bisa saling berkomunikasi. Secara default, Docker menyediakan network `bridge`, tapi disarankan membuat custom network.

```bash
# Membuat custom network
docker network create my-network

# Menjalankan dua container dalam network yang sama
docker run -d --name backend-api --network my-network my-go-app:v1
docker run -d --name frontend-web --network my-network nginx
```
Di dalam container `frontend-web`, kita bisa memanggil API backend dengan alamat `http://backend-api:8080`. Docker menyediakan fitur DNS resolution otomatis berdasarkan nama container!

## Docker Compose (Multi-Container)
Duration: 0:15:00

Menjalankan banyak perintah `docker run` sangat merepotkan. **Docker Compose** adalah tool untuk mendefinisikan dan menjalankan aplikasi Docker yang terdiri dari beberapa container menggunakan satu file YAML.

### Contoh docker-compose.yml
Buat file `docker-compose.yml` untuk menjalankan aplikasi Go kita bersama dengan Redis.

```yaml
version: '3.8'

services:
  web-api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - REDIS_URL=redis:6379
    depends_on:
      - redis
    networks:
      - app-network

  redis:
    image: redis:alpine
    volumes:
      - redis-data:/data
    networks:
      - app-network

networks:
  app-network:

volumes:
  redis-data:
```

### Perintah Docker Compose
```bash
# Menjalankan seluruh aplikasi di background
docker-compose up -d

# Melihat log seluruh layanan
docker-compose logs -f

# Menghentikan dan menghapus semua container, network, dll
docker-compose down
```

Positive
: Docker Compose sangat ideal untuk lingkungan development dan testing! Di production, tool seperti Kubernetes atau Docker Swarm lebih umum digunakan untuk orkestrasi container.

## Best Practices dan Tingkat Mahir
Duration: 0:10:00

Untuk mencapai tingkat mahir, perhatikan best practices berikut dalam membangun Docker image, terutama untuk environment production.

### 1. Multi-stage Builds (Sangat Penting!)
Image yang kita buat di bagian sebelumnya masih menyertakan tools Go compiler, yang membuat ukurannya besar dan tidak aman untuk production. Gunakan multi-stage build untuk mengatasinya.

```dockerfile
# Stage 1: Build (Ukuran besar, berisi compiler)
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY main.go .
RUN go build -o main .

# Stage 2: Production (Sangat kecil dan ringan)
FROM alpine:latest
WORKDIR /app
# Hanya copy hasil binary dari stage builder
COPY --from=builder /app/main .

EXPOSE 8080
CMD ["./main"]
```
Dengan multi-stage build, ukuran image akhir bisa menyusut dari ~300MB menjadi ~10MB!

### 2. Gunakan .dockerignore
Sama seperti `.gitignore`, file `.dockerignore` mencegah file yang tidak perlu (seperti `node_modules`, `.git`, file log) masuk ke dalam container saat proses `COPY`.

```text
# Contoh .dockerignore
.git
node_modules
*.md
```

### 3. Jangan Menjalankan Container sebagai Root
Demi keamanan, selalu gunakan user non-root jika memungkinkan.
```dockerfile
# ... (setelah build)
RUN adduser -D myuser
USER myuser
CMD ["./main"]
```

## Summary
Duration: 0:02:00

### Apa yang Telah Kamu Pelajari
* ✅ Konsep dasar Docker (Container, Image, Registry)
* ✅ Manajemen container dan image dengan Docker CLI
* ✅ Membuat custom image menggunakan Dockerfile
* ✅ Persistensi data dengan Volumes dan komunikasi antar container dengan Networks
* ✅ Orkestrasi multi-container di environment lokal dengan Docker Compose
* ✅ Optimasi image untuk production dengan Multi-stage builds

### What's Next?
Setelah menguasai Docker, langkah selanjutnya dalam karir Backend Engineer adalah mempelajari orkestrasi container di skala cloud, yaitu **Kubernetes**.

Teruslah berlatih dengan meng-containerisasi proyek-proyek aplikasi kamu yang sudah ada!
