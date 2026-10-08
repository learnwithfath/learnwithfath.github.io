summary: Uji satu task dari HP sampai server Intel, backup dan restore dengan restic, recovery setelah restart, serta checklist pengamatan 24 jam.
id: agentic-dual-mac-part-5-testing-e2e
categories: AI, Developer Tools, macOS, Remote Development
tags: dual-mac, always-on, m1, intel, tailscale, tmux, code-server, colima, opencode, restic
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Dual-Mac Agentic Workflow — Part 5: Pengujian & Operasi 24/7

## Uji Satu Task dari Ujung ke Ujung
Duration: 10

Prasyarat: [Part 2](../agentic-dual-mac-part-2-provisioning/), [Part 3](../agentic-dual-mac-part-3-jaringan-remote/), dan [Part 4](../agentic-dual-mac-part-4-memory-harness/) sudah diuji. Gunakan repo latihan/open source atau repo kerja yang diizinkan.

1. Dari HP di jaringan seluler, sambungkan Tailscale dan buka HTTPS code-server Intel 2019.
2. Buka terminal, periksa `hostname`, lalu attach tmux.
3. Pilih perubahan kecil dengan acceptance criteria konkret, misalnya memperbaiki satu tautan rusak beserta pemeriksaannya.
4. Agent membuat patch dalam worktree. Operator menjalankan test/build repo dan meninjau diff.
5. Putuskan koneksi HP, tunggu beberapa menit, lalu attach kembali dari M1/client lain.
6. Jalankan build/test pada server Intel melalui sesi remote. Jika memakai clone lokal terpisah, ikuti handoff Git di Part 4 dan catat SHA yang diuji.
7. Simpan task sebagai `done` hanya jika acceptance criteria terpenuhi; `blocked` bila gagal dan perlu keputusan.

Hasil yang dicatat: hostname, SHA, command, exit code, durasi, dan biaya bila memakai model API. Task tidak dianggap berhasil hanya karena agent berkata selesai.

## Mobile E2E Opsional
Duration: 12

Untuk repo mobile yang telah memiliki aplikasi dan test environment, jalankan emulator/ADB di **Intel** yang disiapkan di Part 2. Pasang Maestro dengan [instruksi upstream](https://github.com/mobile-dev-inc/Maestro), periksa prasyarat Java dari rilis yang dipilih, lalu:

```bash
maestro --version
adb devices
maestro test .maestro/auth_login_flow.yaml
```

File flow berikut adalah **template untuk app yang Anda implementasikan**, bukan demo OTP lengkap yang otomatis berjalan. `appId` dan label harus sesuai aplikasi; akun/OTP berasal dari fixture backend test, tidak dari layanan produksi.

```yaml
appId: com.example.myfullstackapp
---
- launchApp:
    clearState: true
- assertVisible: "Selamat Datang"
- tapOn: "Input Email"
- inputText: "tester@example.test"
- tapOn: "Kirim OTP"
- assertVisible: "Masukkan Kode OTP"
- tapOn: "Input OTP"
- inputText: "${TEST_OTP}"
- tapOn: "Verifikasi"
- assertVisible: "Dashboard Utama"
```

Ambil `TEST_OTP` dari fixture test Anda dan berikan melalui mekanisme environment/parameter Maestro yang didukung versi terpasang. Jangan menambahkan OTP tetap ke logika produksi agar test lulus.

Jika perlu inspeksi UI oleh agent, evaluasi [mobile-next/mobile-mcp](https://github.com/mobile-next/mobile-mcp), bukan alamat `lobehub/mobile-mcp` dari edisi lama. Ikuti README upstream dan pin versi paket setelah uji. Maestro juga menyediakan integrasi MCP; gunakan satu integrasi dahulu. Jumlah stars mobile-mcp lebih kecil daripada stack inti dan ia tetap opsional.

Saat test gagal, periksa screenshot, accessibility tree, fixture, dan app. Jangan menghapus assertion atau mengganti ekspektasi hanya untuk memperoleh PASS. Batasi tiga percobaan perbaikan lalu laporkan blocker.

Bila APK dibuat di Intel dan HP terpasang di **client M1**, salin artifact terlebih dahulu melalui koneksi yang diizinkan. Contoh dijalankan **di M1** setelah menyiapkan alias SSH server Intel dan memasang Android Platform-Tools:

```bash
scp mac-server:~/projects/app/build/app/outputs/flutter-apk/app-debug.apk /tmp/app-debug.apk
adb devices
adb install -r /tmp/app-debug.apk
```

Sesuaikan path hasil build dan serial perangkat jika ada beberapa device. ADB di Intel tidak otomatis melihat USB yang terpasang di M1. Untuk iOS, verifikasi dukungan Xcode dan perangkat sesuai versi; ADB hanya untuk Android.

## Backup dan Uji Restore
Duration: 10

Git menyimpan commit; file belum di-commit dan catatan operasional juga perlu backup. Gunakan destination yang diizinkan dan terpisah dari disk sumber. Contoh restic memakai disk eksternal khusus; **jangan salin repo kantor ke storage pribadi tanpa izin**.

Sebelum contoh berikut, buat password backup kuat di password manager dan simpan salinannya sebagai file privat `~/.config/restic/password` dengan permission `600`. Pastikan volume `/Volumes/Backup` benar-benar terpasang, bukan folder pada disk internal.

```bash
export RESTIC_REPOSITORY="/Volumes/Backup/mac-server-restic"
export RESTIC_PASSWORD_FILE="$HOME/.config/restic/password"
restic init
```

`init` hanya untuk repository baru. Backup harian dapat mengulang command berikut:

```bash
restic backup "$HOME/projects" \
  --exclude '**/node_modules' \
  --exclude '**/.gradle' \
  --exclude '**/build' \
  --exclude '**/.env' \
  --exclude '**/.env.*'
restic snapshots
restic check
```

Sesuaikan exclusion dengan data Anda; pola di atas bukan detektor seluruh secret. Contoh mengecualikan file env sehingga pemulihan kredensial harus dilakukan dari secret manager. Database aktif memerlukan dump/backup konsisten milik database; menyalin file volume yang sedang ditulis bukan bukti backup valid.

Uji restore ke direktori baru, tanpa menimpa project aktif:

```bash
RESTORE_DIR=$(mktemp -d "$HOME/restic-restore-check.XXXXXX")
restic restore latest --target "$RESTORE_DIR"
```

Buka satu file penting di hasil restore dan bandingkan dengan sumber. Catat snapshot ID, waktu, jumlah file, dan hasil pemeriksaan. Buat kebijakan retensi sesudah ukuran/umur backup dipahami; jangan langsung menambahkan `forget --prune` ke setup pertama.

[Rujukan restic backup](https://restic.readthedocs.io/en/stable/040_backup.html) · [Restore](https://restic.readthedocs.io/en/stable/050_restore.html).

## Pemantauan dan Recovery
Duration: 8

Di server Intel 2019, periksa setelah login dan setelah update:

```bash
uptime
pmset -g batt
memory_pressure
sysctl vm.swapusage
df -h /
brew services list
tailscale status
tailscale serve status
curl -I http://127.0.0.1:8080
```

Catat baseline idle dan saat satu job berjalan. Memory Pressure yang terus kuning/merah atau swap yang terus naik menjadi alasan mengurangi concurrency, menutup browser/extension berat, atau menjadwalkan job berat secara bergantian. Jangan menjanjikan angka RAM, baterai, atau kecepatan yang belum diukur.

Untuk alert, [Uptime Kuma](https://github.com/louislam/uptime-kuma) opsional pada host lain yang selalu tersedia di tailnet. Monitor di server Intel sendiri tidak dapat melaporkan ketika Intel mati total. M1 yang bisa tidur juga bukan monitor 24/7. Tentukan jalur notifikasi dan hindari menambah daemon hanya untuk mengisi laptop.

| Gejala | Pemeriksaan dan pemulihan |
|---|---|
| Server Intel tidak terlihat | Pastikan daya, lid, jaringan, unlock/login, lalu status Tailscale |
| SSH bisa, browser gagal | Cek loopback 8080, `brew services list`, konfigurasi dan log code-server, lalu Serve |
| Client putus | Attach tmux kembali; jangan menjalankan task duplikat |
| Host reboot | Unlock/login bila dibutuhkan, verifikasi service, baca task terakhir, ulangi hanya langkah yang belum selesai |
| Server Intel tidak tersedia | Tandai `waiting-server`; pulihkan daya/jaringan/login sebelum melanjutkan job |
| Biaya API melewati budget | Hentikan sesi/job dan periksa provider usage sebelum melanjutkan |
| Disk menipis | Identifikasi cache/log/artifact; hapus hanya data yang telah dipastikan dapat dibuat ulang |

## Soak Test 24 Jam
Duration: 5

Catat hasil pada awal, setelah satu job nyata, setelah client pindah jaringan, dan setelah 24 jam. Pengamatan berlangsung 24 jam; durasi langkah ini hanya waktu membaca/menyiapkan tabel.

| Pengujian | Bukti yang harus diisi operator |
|---|---|
| Layar server Intel mati, charger terpasang | Waktu cek + akses SSH/HTTPS dari client |
| HP di jaringan seluler | URL privat dapat dibuka + hostname benar |
| Client disconnect/reconnect | Sesi tmux dan proses task yang sama |
| M1 dimatikan | Server Intel dan job tetap berjalan; client lain dapat masuk |
| Restart Intel 2019 terencana | Durasi downtime + langkah unlock/login + status service |
| Backup dan restore | Snapshot ID + file hasil restore tervalidasi |
| Satu job nyata | SHA + hasil test + durasi + biaya |
| Beban 24 jam | Memory Pressure, tren swap, disk, suhu/kipas yang diamati |

Restart dilakukan saat tidak ada job penting. Catat kebutuhan operator fisik, bukan mengklaim pemulihan otomatis tanpa mengujinya. Jadwalkan update OS/tool di jendela pemeliharaan. Setelah update, ulangi smoke test SSH/browser/agent; bandingkan versi dengan catatan sebelumnya.

**Checklist selesai:** koneksi privat bekerja, job tidak terduplikasi, server Intel responsif, backup dapat dipulihkan, budget terukur, dan recovery terdokumentasi. Laptop tetap memiliki keterbatasan daya, jaringan, login, dan mobilitas; kebutuhan SLA lebih tinggi memerlukan host yang memang dikelola sebagai server.

[Kembali ke peta seri](../agentic-dual-mac-workflow.html) · [Bukti proyek open source](../data/dual-mac-projects.json).
