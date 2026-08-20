summary: Part 3 dari seri Dual-Mac Agentic Workflow — jaringan dan remote development. Menyambungkan kedua Mac dengan Tailscale, SSH key-based auth, dan Remote-SSH sehingga Anda mengedit di M1 tetapi kompilasi, Docker, dan agent berjalan di MacBook 2019.
id: agentic-dual-mac-part-3-jaringan-remote
categories: AI, Developer Tools, Architecture, macOS, Networking
tags: agentic-workflow, dual-mac, tailscale, wireguard, ssh, remote-development, vscode-remote, mosh
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Dual-Mac Agentic Workflow — Part 3: Jaringan & Remote Development

## Outcome & Prasyarat
Duration: 5

Ini part yang mewujudkan janji seri: **duduk di M1 yang dingin, tetapi seluruh komputasi berjalan di RAM 32 GB milik 2019.** Di [Part 1](agentic-workflow-dual-mac-setup/) kita bahas *kenapa*; di sini kita bahas *bagaimana*.

Di akhir part ini:
* Kedua Mac saling terhubung aman dari jaringan mana pun (rumah/kantor/kafe).
* Anda bisa `ssh mac-server` tanpa password.
* Editor di M1 membuka folder project yang fisiknya ada di 2019, dengan terminal & build yang berjalan di 2019.

**Prasyarat:** [Part 2](agentic-dual-mac-part-2-provisioning/) selesai — SSH aktif di 2019, `tailscale` terpasang di M1.

## Kenapa Dua Lapis: Tailscale + SSH
Duration: 5

Sering ada kebingungan: "kalau sudah SSH, kenapa perlu Tailscale? Kalau sudah Tailscale, kenapa perlu SSH?" Keduanya menjawab masalah berbeda:

* **Tailscale menjawab "di mana server-nya?"** — memberi 2019 sebuah alamat IP tetap (`100.x.y.z`) yang tidak berubah walau Anda pindah Wi-Fi. Tanpa ini, IP lokal berubah tiap ganti jaringan dan koneksi putus.
* **SSH menjawab "bagaimana masuk dengan aman?"** — sesi terenkripsi untuk menjalankan perintah dan meneruskan editor. SSH butuh alamat yang stabil; Tailscale menyediakannya.

```
[MacBook M1: 100.64.0.2] <==== Encrypted WireGuard Tunnel ====> [MacBook 2019: 100.64.0.3]
```

Positive
: Tailscale memakai WireGuard sehingga trafik terenkripsi ujung ke ujung. Anda tidak perlu membuka port di router atau mengekspos 2019 ke internet publik — jauh lebih aman daripada port forwarding manual.

## Langkah 1: Install & Login Tailscale
Duration: 5

Di **kedua Mac**:

```bash
brew install --cask tailscale
```

Lalu buka aplikasi Tailscale di masing-masing Mac dan **login dengan akun yang sama** (Google/GitHub/dll). Catat IP yang diberikan:

* MacBook 2019 → misal `100.100.20.50` (hostname `mac-server`)
* MacBook M1 → misal `100.100.20.51` (hostname `mac-m1`)

Uji keduanya saling terlihat, dari M1:
```bash
tailscale ping mac-server
```

Negative
: Kalau `tailscale ping` gagal, pastikan kedua Mac login akun yang **sama** dan status Tailscale "Connected". Perangkat di akun berbeda tidak akan saling melihat.

## Langkah 2: SSH Key-Based Authentication
Duration: 8

**Kenapa key, bukan password:** Anda akan menyambung berkali-kali setiap hari. Password melelahkan dan lebih lemah. SSH key memberi login instan tanpa password sekaligus lebih aman.

Di **MacBook M1**:

```bash
# Buat key (tekan Enter untuk lokasi default ~/.ssh/id_ed25519)
ssh-keygen -t ed25519 -C "m1-to-intel-server"

# Kirim public key ke 2019 (ganti user & IP sesuai milik Anda)
ssh-copy-id username@100.100.20.50
```

`ssh-copy-id` menyalin *public* key Anda ke daftar tepercaya di 2019. Private key tidak pernah meninggalkan M1.

## Langkah 3: Konfigurasi `~/.ssh/config`
Duration: 5

**Kenapa:** supaya Anda cukup mengetik `ssh mac-server`, bukan menghafal IP dan flag. Ini juga yang dibaca editor untuk Remote-SSH.

Di **MacBook M1**, edit `~/.ssh/config`:

```ssh
Host mac-server
    HostName 100.100.20.50
    User username
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 30
    ServerAliveCountMax 5
    ForwardAgent yes
```

`ServerAliveInterval`/`CountMax` menjaga koneksi tetap hidup saat jaringan sesaat goyah. Uji:

```bash
ssh mac-server   # harus masuk tanpa menanyakan password
```

Positive
: Kalau butuh sesi terminal yang tahan putus-sambung (mis. laptop sleep sebentar atau ganti jaringan), gunakan `mosh mac-server` alih-alih `ssh`. Mosh (dipasang di Part 2) melanjutkan sesi otomatis tanpa reconnect manual.

## Langkah 4: Remote Development di Editor
Duration: 7

Inilah bagian yang menjawab **"guna remote SSH untuk apa"** secara konkret. Alih-alih menyalin file antar-laptop, editor Anda membuka folder yang fisiknya ada di 2019 — dan menjalankan semua proses di sana.

Di **MacBook M1**:
1. Buka VS Code / Antigravity.
2. Pasang ekstensi **Remote - SSH** (`ms-vscode-remote.remote-ssh`).
3. `Cmd + Shift + P` → **Remote-SSH: Connect to Host…** → pilih **mac-server**.
4. Buka folder project Anda yang ada di 2019 (mis. `~/projects/my-mobile-project`).

Sekarang perhatikan apa yang terjadi saat Anda bekerja:
* **Membuka & mengedit file** — UI di M1, file di 2019. Tidak ada salinan ganda.
* **Terminal terintegrasi** — sebenarnya shell di 2019. `docker compose up` menjalankan Docker **di server**.
* **Build, indexing, ekstensi bahasa** — semua memakai CPU/RAM 2019.

Positive
: Hasil akhirnya: M1 tetap dingin dan hening, baterai tahan 12+ jam, sementara pekerjaan berat memakai memori 32 GB milik 2019. Inilah seluruh nilai pola dual-mac, dan alasan remote SSH menjadi tulang punggungnya.

## Verifikasi
Duration: 3

Dari **MacBook M1**, pastikan seluruh rantai ini jalan:

- [ ] `tailscale ping mac-server` berhasil dari jaringan apa pun.
- [ ] `ssh mac-server` masuk tanpa password.
- [ ] Editor terhubung via Remote-SSH dan membuka folder project di 2019.
- [ ] Di terminal editor, `hostname` mengembalikan nama **2019**, bukan M1.
- [ ] `docker ps` di terminal editor menampilkan Docker milik 2019.

Item terakhir adalah bukti paling meyakinkan: Anda mengetik di M1, tetapi command berjalan di server.

Negative
: Kalau terminal editor menunjukkan hostname M1, berarti Anda membuka folder lokal, bukan sesi remote. Ulangi Remote-SSH: Connect to Host.

Positive
: **Lanjut ke Part 4 — Shared Memory & Agent Harness**, tempat kita mencegah antar-agen saling menimpa konteks dan memasang runtime agent-nya.
