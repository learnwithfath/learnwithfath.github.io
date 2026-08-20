summary: Part 2 dari seri Dual-Mac Agentic Workflow — provisioning kedua Mac dari nol. Menyiapkan MacBook 2019 sebagai compute/agent server (power, toolchain, Docker, emulator headless) dan MacBook M1 sebagai driver node yang ringan.
id: agentic-dual-mac-part-2-provisioning
categories: AI, Developer Tools, Mobile, Architecture, macOS
tags: agentic-workflow, dual-mac, apple-silicon, intel-mac, homebrew, docker, orbstack, android-emulator, provisioning
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Dual-Mac Agentic Workflow — Part 2: Provisioning Dua Mac

## Outcome & Prasyarat
Duration: 5

Di [Part 1](agentic-workflow-dual-mac-setup/) kita menetapkan pembagian peran: **2019 = compute node**, **M1 = driver node**. Sekarang kita menyiapkan keduanya sampai siap dihubungkan.

Di akhir part ini:
* MacBook 2019 tidak pernah tidur, punya toolchain lengkap, Docker, dan emulator headless yang berjalan.
* MacBook M1 ramping — hanya editor, terminal, dan jalur uji device fisik.

**Prasyarat:** kedua Mac menyala, akses admin (sudo), dan koneksi internet. Belum perlu jaringan antar-Mac — itu Part 3.

Positive
: Kerjakan seluruh bagian "Compute Node" **di MacBook 2019**, dan bagian "Driver Node" **di MacBook M1**. Command diberi label perangkatnya.

## Compute Node — Langkah 1: Power & Remote Access
Duration: 8

**Kenapa duluan:** server yang tidur di tengah build sama saja tidak ada. Kita pastikan 2019 tetap terjaga saat layar ditutup (*clamshell*) dan bisa dihidupi lewat SSH.

Di MacBook 2019:

1. Buka **System Settings → General → Sharing**.
2. Aktifkan **Remote Login (SSH)** → *Allow access for* pilih user Anda. (Ini yang membuat 2019 bisa dihubungi dari M1 nanti di Part 3.)
3. Jalankan konfigurasi power di Terminal:

```bash
# Cegah sistem sleep saat charger terpasang
sudo pmset -c sleep 0
sudo pmset -c disablesleep 1

# Nonaktifkan power nap dan disk sleep untuk stabilitas server
sudo pmset -c disksleep 0
sudo pmset -c displaysleep 15
```

Positive
: Utilitas **Amphetamine** (gratis, Mac App Store) bisa dipakai sebagai jaring pengaman — ia menjaga sistem tetap terjaga selama charger terpasang, lengkap dengan trigger berbasis status daya.

Negative
: `disablesleep 1` membuat laptop **tidak tidur meski layar ditutup**. Pastikan sirkulasi udara cukup (lihat tips thermal di Part 5) dan charger selalu terpasang.

## Compute Node — Langkah 2: Toolchain & Homebrew
Duration: 7

**Kenapa:** compute node yang menjalankan build, indexer, dan agent butuh bahasa dan utilitas dasar. Kita pasang versi yang masih didukung per 2026.

Di MacBook 2019:

```bash
# 1. Command Line Tools
xcode-select --install

# 2. Homebrew (lewati jika sudah ada)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 3. Bahasa & utilitas esensial
# Node 24 = LTS aktif per 2026 (node@22 sudah masuk fase maintenance).
# uv dipakai untuk memasang CLI Python modern seperti Graphify (Part 4).
brew install git node@24 go python@3.13 uv tree-sitter ripgrep jq htop mosh
```

Ringkasan kenapa tiap paket ada: `ripgrep` mempercepat pencarian kode yang dipakai agent; `jq` untuk mengolah output JSON; `htop` memantau beban server; `mosh` menjaga sesi terminal tetap hidup saat jaringan goyah; `tree-sitter` adalah fondasi parsing Graphify.

## Compute Node — Langkah 3: Container Runtime
Duration: 5

**Kenapa OrbStack, bukan Docker Desktop:** di macOS, OrbStack jauh lebih hemat CPU/baterai dan booting lebih cepat — penting untuk mesin yang menyala seharian.

Di MacBook 2019:

```bash
brew install --cask orbstack

# Verifikasi engine berjalan
docker ps
```

`docker ps` yang menampilkan tabel kosong (tanpa error) berarti runtime siap. Backend stack (DB, Redis, API) akan hidup di sini pada Part 5.

## Compute Node — Langkah 4: Emulator Android Headless
Duration: 10

**Kenapa emulator di 2019, bukan M1:** di CPU Intel, system image `x86_64` berjalan **native** tanpa translasi. Di Apple Silicon Anda harus pakai image `arm64` atau menanggung penalti Rosetta 20–30% — ditambah RAM M1 hanya 8 GB. Maka: emulator berat di server Intel; M1 cukup menguji di HP fisik (Langkah driver node di bawah).

Kita target **API 36 (Android 16)** karena sejak 31 Agustus 2026 Google Play mewajibkan app baru & update menargetkan API level 36.

Di MacBook 2019:

```bash
# Direktori Android SDK
mkdir -p ~/Android/sdk/cmdline-tools

# Environment variables
cat << 'EOF' >> ~/.zshrc
export ANDROID_HOME=$HOME/Android/sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
EOF
source ~/.zshrc

# platform-tools, emulator, dan system image x86_64 (Android 16 / API 36)
sdkmanager --install "platform-tools" "emulator" "platforms;android-36" "system-images;android-36;google_apis;x86_64"

# Buat AVD bernama 'agent_runner'
avdmanager create avd -n agent_runner -k "system-images;android-36;google_apis;x86_64" --device "pixel_7"
```

Uji jalankan tanpa jendela (*headless*):
```bash
emulator -avd agent_runner -no-window -no-audio -no-boot-anim &
adb devices   # harus muncul dengan status: device
```

Negative
: Kalau `adb devices` kosong, emulator belum selesai boot. Tunggu 30–60 detik lalu ulangi. Jangan lanjut sebelum statusnya `device`.

## Driver Node — Langkah 1: Editor & Client Tools
Duration: 5

Pindah ke **MacBook M1**. Filosofinya: pasang sesedikit mungkin. Semua yang berat ada di server.

```bash
# Terminal & shell modern
brew install ghostty mosh tailscale

# Editor (Antigravity, Cursor, atau VS Code — pilih satu)
brew install --cask visual-studio-code
```

`tailscale` kita pasang di sini karena dibutuhkan di Part 3 untuk menyambung ke server.

## Driver Node — Langkah 2: Uji Device Fisik (USB)
Duration: 5

**Kenapa:** menyalakan emulator di M1 membuang 3–4 GB RAM sia-sia. Sebagai gantinya, uji di HP asli — lebih cepat, lebih akurat (haptic, kamera, sensor nyata), dan nol beban RAM.

Di MacBook M1:
1. Hubungkan HP Android/iPhone via kabel USB.
2. Aktifkan **Developer Options + USB Debugging** (Android) atau **Developer Mode** (iOS).
3. Verifikasi:
```bash
adb devices   # HP fisik muncul sebagai 'device'
```

## Driver Node — Langkah 3: Universal Control (opsional)
Duration: 3

Kalau kedua laptop berdampingan di meja, Universal Control membuat satu mouse/keyboard bisa menyeberang ke layar keduanya, lengkap dengan berbagi clipboard.

Di kedua Mac: **System Settings → Displays → Advanced** → centang **"Link to Mac or iPad"** dan **"Allow pointer and keyboard to move between any nearby Mac or iPad"**. Pastikan Bluetooth + Wi-Fi aktif dan Apple ID sama.

Positive
: Ini murni kenyamanan fisik. Alur kerja utama (edit di M1, jalan di 2019) tetap lewat remote SSH di Part 3 — jadi Universal Control bukan syarat.

## Verifikasi
Duration: 2

Centang sebelum lanjut:

**MacBook 2019 (compute node):**
- [ ] Remote Login (SSH) aktif.
- [ ] `docker ps` jalan tanpa error.
- [ ] `adb devices` menampilkan `agent_runner` sebagai `device`.

**MacBook M1 (driver node):**
- [ ] Editor + `tailscale` terpasang.
- [ ] `adb devices` menampilkan HP fisik saat dicolok.

Positive
: **Lanjut ke Part 3 — Jaringan & Remote Development**, tempat kedua Mac disambungkan dan Anda mulai mengedit di M1 sambil menjalankan semuanya di 2019.
