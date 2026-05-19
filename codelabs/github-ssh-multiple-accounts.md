author: Fath
summary: Panduan mengelola banyak akun GitHub menggunakan SSH Key di satu komputer (macOS/Linux), mengatasi problem izin ditolak (Permission Denied), dan tips merapikannya.
id: github-ssh-multiple-accounts
categories: Git, SSH, DevOps, Tips
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Mastering GitHub SSH: Mengelola Multiple Akun & Project

## 1. Pendahuluan
Duration: 0:05:00

Pernahkah kamu mengalami error seperti ini saat bekerja dengan Git?
```bash
ERROR: Permission to user/repo.git denied to other_user.
fatal: Could not read from remote repository.
```

Sebagai seorang developer, sangat wajar jika kita memiliki **lebih dari satu akun GitHub**. Misalnya:
1. Akun **Personal** untuk proyek open-source atau portofolio pribadi.
2. Akun **Kantor / Qiscus** untuk mengerjakan proyek perusahaan.
3. Akun **Klien** khusus untuk proyek *freelance* tertentu.

Secara default, komputer kita (macOS/Linux) akan kesulitan membedakan kapan harus menggunakan kunci SSH personal dan kapan harus menggunakan kunci SSH kantor jika keduanya mengarah ke domain yang sama: `github.com`.

Di codelab ini, kamu akan belajar cara mengonfigurasi banyak akun GitHub di satu komputer secara **rapi, aman, dan anti-bentrok**!

## 2. Membuat SSH Key Spesifik
Duration: 0:08:00

Langkah pertama adalah membuat kunci SSH (*SSH Key pair*) yang berbeda untuk masing-masing akun. Jangan pernah menggunakan satu kunci SSH untuk semua akun demi alasan keamanan dan manajemen.

### Membuat SSH Key Baru
Buka terminal dan jalankan perintah berikut (sesuaikan nama file dengan nama akunmu):

```bash
# SSH Key untuk akun Personal (contoh: id_ed25519_personal)
ssh-keygen -t ed25519 -C "email_personal@gmail.com" -f ~/.ssh/id_ed25519_personal

# SSH Key untuk akun Kantor (contoh: id_ed25519_qiscus)
ssh-keygen -t ed25519 -C "email_kantor@qiscus.com" -f ~/.ssh/id_ed25519_qiscus
```

* `-t ed25519`: Menggunakan algoritma enkripsi Ed25519 (sangat direkomendasikan karena cepat dan aman).
* `-C`: Memberikan komentar (biasanya email pemilik akun).
* `-f`: Lokasi dan nama file kunci yang dihasilkan.

### Daftarkan ke GitHub
Copy isi dari file *public key* (`.pub`) yang baru dibuat ke pengaturan GitHub masing-masing akun:

```bash
# Copy key personal ke clipboard (macOS)
pbcopy < ~/.ssh/id_ed25519_personal.pub

# Copy key kantor ke clipboard (macOS)
pbcopy < ~/.ssh/id_ed25519_qiscus.pub
```
*(Untuk Windows/Linux, kamu bisa membukanya dengan teks editor biasa lalu meng-copy isinya secara manual).*

Buka GitHub ➔ **Settings** ➔ **SSH and GPG keys** ➔ **New SSH Key**, lalu paste isinya di sana.

## 3. Konfigurasi ~/.ssh/config
Duration: 0:10:00

Ini adalah **"otak"** dari trik *multiple account*. Kita akan menggunakan file konfigurasi SSH untuk membuat *alias host* yang unik untuk setiap akun.

### Edit File Config
Buat atau buka file konfigurasi SSH di `~/.ssh/config`:

```bash
nano ~/.ssh/config
```

Masukkan konfigurasi berikut:

```text
# ==========================================
# Akun GitHub PERSONAL
# ==========================================
Host github-personal
  HostName github.com
  User git
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519_personal
  IdentitiesOnly yes

# ==========================================
# Akun GitHub KANTOR (Qiscus)
# ==========================================
Host github-qiscus
  HostName github.com
  User git
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519_qiscus
  IdentitiesOnly yes
```

### Parameter Penting yang Wajib Ada:
* **`Host [alias]`**: Ini adalah nama samaran yang akan kita panggil di URL Git remote. Bebas dinamai apa saja (misal: `github-personal`, `github-qiscus`).
* **`HostName github.com`**: Domain asli tujuan koneksi kita.
* **`IdentityFile ~/.ssh/...`**: Jalur absolut ke kunci privat spesifik yang digunakan untuk host ini.
* **`IdentitiesOnly yes`** (CRITICAL!): Memaksa SSH hanya menawarkan kunci yang tertera di konfigurasi ini. Jika diabaikan, SSH Agent akan menawarkan kunci sembarangan yang sudah termuat di memori, menyebabkan problem *wrong identity*.

## 4. Cara Menggunakan Alias pada Proyek
Duration: 0:07:00

Setelah konfigurasi SSH siap, kita harus menggunakannya pada proyek lokal kita.

### Skenario 1: Clone Proyek Baru
Saat melakukan `git clone`, ganti domain asli `github.com` dengan *Alias Host* yang sudah kita definisikan.

```bash
# Menggunakan SSH Asli (Akan bentrok dengan default key)
git clone git@github.com:username/personal-repo.git

# MENGGUNAKAN ALIAS (Benar & Aman)
git clone git@github-personal:username/personal-repo.git

# Contoh untuk akun Kantor
git clone git@github-qiscus:qiscus/work-repo.git
```

### Skenario 2: Update Proyek yang Sudah Ada
Jika proyekmu sudah terlanjur di-clone sebelumnya dan gagal di-push, kamu cukup mengubah URL remote git-nya:

```bash
# Ubah URL remote untuk menggunakan alias github-personal
git remote set-url origin git@github-personal:username/personal-repo.git

# Atau ubah URL remote untuk menggunakan alias github-qiscus
git remote set-url origin git@github-qiscus:qiscus/work-repo.git
```

Verifikasi perubahan dengan perintah:
```bash
git remote -v
```

## 5. Masalah Umum dan Cara Mengatasinya
Duration: 0:10:00

Berikut adalah *troubleshooting* atas error-error yang paling sering terjadi saat mengelola banyak akun SSH.

### 1. Masalah: IdentitiesOnly Terlewat (Salah Akun)
**Gejala:** Kamu mencoba nge-push ke akun personal, tapi ditolak dengan pesan: `Permission denied to [akun_kantor]`.
**Penyebab:** Kunci kantor kamu sedang aktif di *SSH Agent* dan ditawarkan otomatis sebelum kunci personal dibaca.
**Solusi:** Pastikan parameter `IdentitiesOnly yes` sudah terpasang di bawah masing-masing konfigurasi Host di `~/.ssh/config`.

### 2. Masalah: Menghapus Cache Kunci di Agent
Terkadang, SSH Agent menimbun terlalu banyak kunci lama di memori komputer Anda. Bersihkan cache dengan cara:

```bash
# Melihat kunci yang terdaftar aktif di memori
ssh-add -l

# Menghapus semua kunci aktif dari memori agent
ssh-add -D

# Memasukkan kembali kunci spesifik Anda ke agent
ssh-add -K ~/.ssh/id_ed25519_personal
```

### 3. Masalah: Menguji Koneksi (Validasi)
Bagaimana cara tahu konfigurasi alias SSH kita sudah benar? Jalankan perintah ini:

```bash
# Tes koneksi alias personal
ssh -T git@github-personal

# Tes koneksi alias kantor
ssh -T git@github-qiscus
```
* **Output Benar:** `Hi [Username_Personal]! You've successfully authenticated...`

Negative
: Jika output `ssh -T` masih mengembalikan *username* akun kantor Anda saat dipanggil dengan alias personal, periksa kembali penulisan file `~/.ssh/config` Anda, atau jalankan `ssh-add -D` untuk membersihkan cache memory.

## 6. Tips Tambahan: Manajemen Folder dan Git Config
Duration: 0:08:00

Jika kamu memiliki puluhan proyek, mengubah URL remote satu per satu secara manual sangat melelahkan. Gunakan teknik tingkat lanjut ini!

### 1. Buat Struktur Folder yang Rapi
Pisahkan folder kerja berdasarkan tujuan akun:
```text
~/Documents/
├── personal/          # Semua repo personal kamu
│   ├── web-portfolio/
│   └── side-project/
└── qiscus/            # Semua repo pekerjaan kantor kamu
    ├── iami-bot/
    └── another-app/
```

### 2. Gunakan Conditional Includes di Git Config
Kamu bisa mengatur nama dan email Git secara otomatis berdasarkan folder proyek tempat repo tersebut berada.

Buka file global git config kamu (`~/.gitconfig`):
```bash
nano ~/.gitconfig
```

Isi dengan konfigurasi dinamis berikut:
```text
[user]
  name = Fath (Personal)
  email = personal@gmail.com

# Jika lokasi folder ada di dalam ~/Documents/qiscus/, gunakan config khusus qiscus
[includeIf "gitdir:~/Documents/qiscus/"]
  path = ~/.gitconfig-qiscus
```

Lalu, buat file konfigurasi khusus tersebut (`~/.gitconfig-qiscus`):
```bash
nano ~/.gitconfig-qiscus
```
Isi dengan kredensial kantormu:
```text
[user]
  name = Fathullah Qiscus
  email = fathullah@qiscus.com
```

Sekarang, setiap kali kamu membuat repo atau melakukan *commit* di dalam folder `~/Documents/qiscus/`, Git akan otomatis menggunakan nama dan email Qiscus Anda tanpa Anda perlu mengetik `git config user.email` secara manual lagi!

## 7. Kesimpulan
Duration: 0:02:00

Selamat! Kamu sekarang sudah menguasai cara mengelola beberapa akun GitHub secara efisien di satu perangkat!

### Rangkuman yang Telah Kamu Pelajari:
* ✅ Cara membuat kunci SSH unik menggunakan algoritma `ed25519`.
* ✅ Konfigurasi alias host di `~/.ssh/config` dengan `IdentitiesOnly yes` agar tidak terjadi *identity hijacking*.
* ✅ Menggunakan URL remote kustom untuk clone atau update proyek.
* ✅ Teknik troubleshooting SSH Agent (`ssh-add -D` dan `ssh -T`).
* ✅ Automatisasi identitas Git menggunakan *Conditional Includes* berdasarkan struktur folder.

Lacak terus portofoliomu di akun personal dan berikan performa terbaikmu di repo pekerjaan kantor dengan konfigurasi yang super rapi ini! *Happy coding!*
