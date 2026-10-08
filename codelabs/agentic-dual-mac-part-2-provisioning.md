summary: Siapkan MacBook Pro 2019 Intel sebagai server 24/7, M1 sebagai client ringan, serta power dan recovery yang dapat diverifikasi.
id: agentic-dual-mac-part-2-provisioning
categories: AI, Developer Tools, macOS, Remote Development
tags: dual-mac, always-on, m1, intel, tailscale, tmux, code-server, colima, opencode, restic
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Dual-Mac Agentic Workflow — Part 2: Provisioning Dua Mac

## Inventaris Sebelum Instalasi
Duration: 5

Ikuti pembagian peran [Part 1](../agentic-workflow-dual-mac-setup/). Command di halaman ini adalah instruksi untuk operator, bukan konfigurasi yang otomatis sudah diterapkan.

Di **kedua Mac**:

```bash
sw_vers
uname -m
sysctl -n hw.memsize
pmset -g custom
df -h /
```

M1 seharusnya `arm64`, Intel `x86_64`. Simpan hasil sebelum perubahan, termasuk konfigurasi power awal. Pilih nama perangkat mudah dikenali (`mac-server` untuk Intel, `mac-client` untuk M1) di pengaturan Sharing/Tailscale. Jangan memasukkan serial number atau kredensial ke repo publik.

Siapkan akses admin untuk instalasi dan pastikan remote access sesuai kebijakan perangkat kantor. Instal [Homebrew dari dokumentasi resminya](https://brew.sh/) jika belum tersedia; gunakan `brew --prefix` agar tidak mencampur `/opt/homebrew` di M1 dengan `/usr/local` di Intel.

Di **M1 sebagai client**, pasang Tailscale dan gunakan SSH bawaan macOS/browser. Bila memilih editor desktop, pasang editor serta ekstensi Remote-SSH yang sesuai. Client tidak memerlukan Colima, code-server, atau agent server untuk alur ini. Biarkan pengaturan sleep/baterai M1 mengikuti kebutuhan harian.

## Intel 2019 — Power untuk Server 24/7
Duration: 8

Di **MacBook Pro 2019 Intel**, sambungkan charger, gunakan permukaan berventilasi, dan biarkan lid terbuka dengan layar dapat mati. Aktifkan pengaturan **Prevent automatic sleeping on power adapter when the display is off** bila tersedia di Battery → Options. Nama opsi dapat berbeda menurut OS.

```bash
# Simpan nilai awal; jangan menimpa file ini pada pengulangan setup.
pmset -g custom > "$HOME/pmset-before-server.txt"
sudo pmset -c sleep 0
sudo pmset -c displaysleep 10
pmset -g custom
```

Opsi `-c` menargetkan adaptor AC. Jangan mengubah konfigurasi baterai untuk memaksa laptop tetap menyala saat tidak ada daya. Untuk satu pekerjaan sementara, `caffeinate -i nama-command` dapat menjaga idle sleep selama command berjalan.

**Lid tertutup bukan jaminan tetap online.** Konfigurasi closed-display membutuhkan kondisi hardware yang sesuai. `sleep 0` atau `caffeinate` tidak boleh dianggap sebagai solusi universal untuk lid sleep. Hindari `disablesleep 1` sebagai baseline. Uji layar mati dari perangkat lain sebelum meninggalkan mesin.

Rollback: baca `~/pmset-before-server.txt`, lalu kembalikan nilai AC dengan `sudo pmset -c sleep NILAI_LAMA displaysleep NILAI_LAMA`. Isi angka dari catatan awal, bukan nilai tebakan. [Rujukan pengaturan sleep Apple](https://support.apple.com/guide/mac-help/set-sleep-and-wake-settings-mchle41a6ccd/mac).

## Intel 2019 — Toolchain dan Remote Login
Duration: 8

Instal Command Line Tools bila belum ada, tunggu proses GUI selesai:

```bash
xcode-select --install
```

Kemudian:

```bash
brew install git tmux jq ripgrep code-server restic
brew install --cask tailscale
mkdir -p "$HOME/projects" "$HOME/Library/Logs/dual-mac"
git --version
tmux -V
code-server --version
restic version
```

Buka Tailscale, login ke tailnet yang disetujui. Gunakan **satu varian Tailscale**; jangan memasang formula daemon dan aplikasi GUI sekaligus tanpa kebutuhan khusus. Bila command `tailscale` belum berada di PATH, gunakan CLI aplikasi:

```bash
/Applications/Tailscale.app/Contents/MacOS/Tailscale version
```

Di System Settings → General → Sharing → **Remote Login**, izinkan hanya user operator yang diperlukan. Panduan memakai OpenSSH bawaan macOS melalui jaringan Tailscale. Tailscale SSH adalah fitur lain dengan batas dukungan varian macOS.

Instal bahasa sesuai repo yang akan dikerjakan, bukan semua bahasa sekaligus. Hormati `.tool-versions`, `.nvmrc`, atau lockfile repo. Jangan upgrade runtime seluruh project hanya karena tutorial menggunakan versi terbaru.

## Intel — Container Sesuai Kebutuhan
Duration: 10

Di **server Intel 2019**, Git/Tailscale/tmux dan Remote Login sudah disiapkan. Tambahkan container runtime bila project memerlukannya:

```bash
brew install colima docker docker-compose
colima start --cpu 4 --memory 8 --disk 60
docker context show
docker version
docker ps
```

Colima menyediakan VM/runtime; Docker CLI adalah client. Pastikan konteks yang aktif menunjuk instance Colima yang dimaksud. Gunakan `docker-compose version` untuk formula Compose standalone. Jika memilih sintaks `docker compose`, ikuti petunjuk plugin dari `brew info docker-compose` lalu verifikasi `docker compose version` sebelum menjalankan project.

Jalankan stack repo yang sudah ada dan telah direview, kemudian hentikan VM saat tidak diperlukan. Server Intel dan layanan SSH/code-server tetap menyala:

```bash
colima status
colima stop
```

Alokasi 4 CPU/8 GiB/60 GiB adalah titik awal, bukan klaim optimal untuk semua repo. Image container Intel menggunakan `linux/amd64`; M1 biasanya `linux/arm64`. Hindari asumsi binary hasil build dapat dipindahkan antararsitektur tanpa rebuild. [Rujukan Colima](https://github.com/abiosoft/colima).

## Intel — Android Opsional
Duration: 12

Lewati bagian ini bila tugas Anda bukan mobile. Pasang Android Studio yang masih mendukung OS/Intel Anda. Melalui **SDK Manager**, instal Android SDK Command-line Tools (latest), Platform-Tools, Emulator, dan platform yang cocok dengan proyek. Ini menyediakan `sdkmanager` yang tidak otomatis muncul hanya karena folder SDK dibuat.

Gunakan bundled JDK Android Studio atau JDK yang disyaratkan project. Di terminal Intel:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
java -version
sdkmanager --list
sdkmanager --licenses
```

Contoh AVD memakai API 36, **bukan klaim kewajiban target Google Play**. Pastikan paket tercantum di `--list` dan sesuaikan dengan matriks tes aplikasi:

```bash
sdkmanager "platform-tools" "emulator" "platforms;android-36" "system-images;android-36;google_apis;x86_64"
avdmanager create avd -n agent_runner -k "system-images;android-36;google_apis;x86_64"
emulator -accel-check
emulator -avd agent_runner -no-window -no-audio -no-boot-anim
```

Di terminal kedua, verifikasi `adb devices` dan `adb -s emulator-5554 shell getprop sys.boot_completed` menghasilkan `1`; ganti serial dengan hasil `adb devices`. Hentikan dengan `adb -s emulator-5554 emu kill` saat selesai.

Intel menggunakan image `x86_64`; Apple Silicon menggunakan `arm64-v8a` bila tersedia. Keduanya dapat memakai akselerasi native dengan image yang tepat. Pilihan Intel di sini karena kapasitas RAM, bukan karena M1 membutuhkan Rosetta untuk semua emulator. [SDK Manager](https://developer.android.com/tools/sdkmanager) · [Akselerasi emulator](https://developer.android.com/studio/run/emulator-acceleration).

## Restart, Login, dan Verifikasi
Duration: 7

Homebrew services tanpa `sudo` memakai LaunchAgent user: otomatis dimulai saat login user, **bukan bukti layanan hidup sebelum login setelah reboot**. FileVault, autentikasi awal, jaringan, dan aplikasi Tailscale dapat membuat mesin belum dapat diakses. Siapkan operator lokal untuk unlock/login setelah restart; pertahankan FileVault. Uji recovery nyata sebelum mengandalkan akses jarak jauh. [Rujukan brew services](https://docs.brew.sh/Manpage#services-subcommand).

Checklist provisioning:

- [ ] Intel 2019 tetap dapat diakses saat layar mati dan charger terpasang.
- [ ] SSH dibatasi ke user yang diperlukan.
- [ ] Arsitektur, versi OS, runtime, dan power awal dicatat.
- [ ] Intel bisa menjalankan `docker ps` bila container dibutuhkan.
- [ ] Android opsional benar-benar selesai boot, bukan hanya terdaftar offline.
- [ ] Operator memahami recovery setelah reboot dan saat listrik terputus.

[Lanjut Part 3: akses dari perangkat lain](../agentic-dual-mac-part-3-jaringan-remote/).
