summary: Panduan why-first untuk akses harian ke terminal & coding agent dari HP memakai tmux + Tailscale SSH — setup sekali, tanpa kode tambahan, tanpa token bot, dan Anda melihat terminal asli (bukan output yang dipotong jadi pesan chat). Termasuk kenapa ini lebih baik dari bot Slack/Telegram untuk pemakaian pribadi, plus mitigasi kelemahan UX ngetik di HP.
id: tmux-tailscale-ssh-remote-agent
categories: AI, Developer Tools, Networking, Mobile
tags: tmux, tailscale, ssh, remote-development, coding-agent, claude-code, mobile, termux, blink-shell
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Akses Terminal & Coding Agent dari HP: tmux + Tailscale SSH

## Outcome & Kenapa Pendekatan Ini
Duration: 5

Anda menjalankan coding agent (Claude Code, Codex CLI, atau agent CLI lain) di laptop/server, lalu ingin memantau atau melanjutkannya dari HP saat sedang tidak di depan laptop. Ada beberapa cara untuk melakukan ini — dan pilihannya menentukan seberapa banyak kepercayaan yang harus Anda berikan ke sistem tambahan.

**Opsi yang sering dicoba, dan kenapa bukan pilihan pertama untuk pemakaian pribadi:**

* **Bot Slack/Telegram yang menjembatani ke agent** — butuh kode tambahan (webhook, parsing pesan, state management), butuh token bot yang harus dijaga keamanannya, dan output terminal dipotong-potong jadi pesan chat. Notifikasi permission (mis. agent minta izin `rm` atau akses network) sering hilang konteksnya karena sudah diringkas ulang oleh bot.
* **Web UI / dashboard custom** — butuh hosting, autentikasi, dan maintenance sendiri. Overkill untuk kebutuhan pribadi harian.
* **tmux + Tailscale SSH (pendekatan di tutorial ini)** — setup sekali di awal, nol kode tambahan, nol token bot. Anda `ssh` langsung ke sesi tmux yang sama persis dengan yang berjalan di laptop — bukan salinan atau ringkasan, tapi **terminal asli**. Kalau agent berhenti dan minta konfirmasi permission, Anda melihatnya persis seperti kalau Anda duduk di depan laptop.

```
[HP: SSH client]  ==Tailscale (WireGuard, terenkripsi)==>  [Laptop/Server: sshd + tmux]
                                                              └── sesi tmux tetap hidup
                                                                  walau HP disconnect
```

Positive
: Trade-off yang jujur: pendekatan ini **tidak mengubah** terminal jadi tampilan mobile-friendly. Anda tetap melihat teks mentah di layar kecil. Kelemahan itu nyata dan dibahas di bagian [Kelemahan & Cara Mengurangi Rasa Sakitnya](#kelemahan-cara-mengurangi-rasa-sakitnya) — tapi untuk pemakaian pribadi, kesederhanaan dan keamanan setup ini biasanya lebih berharga daripada UX yang lebih halus.

### Kenapa Dua Lapis: Tailscale + SSH + tmux

Tiga komponen ini menjawab tiga masalah berbeda — hilangkan salah satu, dan seluruh alur rusak:

* **Tailscale menjawab "di mana laptop/server saya?"** — memberi IP tetap (`100.x.y.z`) ke laptop Anda, yang tidak berubah walau Anda pindah dari Wi-Fi rumah ke data seluler HP. Tanpa ini, Anda harus tahu IP publik yang berubah-ubah dan membuka port di router (risiko keamanan).
* **SSH menjawab "bagaimana masuk dengan aman?"** — sesi terenkripsi untuk membuka shell di laptop, dengan autentikasi berbasis key (bukan password).
* **tmux menjawab "bagaimana sesi tidak putus?"** — coding agent Anda berjalan **di dalam** sesi tmux di laptop. Kalau koneksi SSH dari HP putus (masuk terowongan, mati layar, ganti jaringan), sesi tmux tetap hidup di laptop. Begitu Anda `ssh` lagi dan `tmux attach`, semua kembali persis seperti Anda tidak pernah pergi — termasuk histori scrollback dan proses agent yang masih berjalan.

Negative
: Tanpa tmux (atau `screen`), begitu koneksi SSH terputus, proses yang berjalan di dalamnya biasanya ikut mati (menerima sinyal `SIGHUP`). Itu sebabnya tmux bukan kosmetik di sini — dia komponen inti, bukan pelengkap.

### Prasyarat

* Laptop/server tempat coding agent berjalan (macOS atau Linux).
* HP (iOS atau Android) dengan koneksi internet (Wi-Fi atau data seluler).
* Akun Tailscale gratis (cukup login Google/GitHub/dll).

## Langkah 1: Install & Login Tailscale di Kedua Perangkat
Duration: 10

Tailscale membentuk mesh VPN pribadi berbasis WireGuard antar perangkat yang login dengan akun yang sama — tanpa perlu konfigurasi port forwarding atau firewall rule manual.

**Di laptop/server (macOS):**
```bash
brew install --cask tailscale
```
Buka aplikasi Tailscale, login, lalu pastikan status **Connected**.

**Di laptop/server (Linux):**
```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

**Di HP:**
Install aplikasi **Tailscale** dari App Store / Play Store, lalu login dengan **akun yang sama** persis seperti di laptop.

Catat hostname Tailscale laptop Anda (terlihat di aplikasi Tailscale, misalnya `mac-server`), lalu uji dari HP — buka aplikasi Tailscale dan pastikan laptop terlihat berstatus **Connected** di daftar perangkat.

Negative
: Kalau perangkat tidak saling terlihat, penyebab paling umum adalah login dengan akun Tailscale yang **berbeda** di kedua perangkat. Login ulang dan pastikan email akunnya sama persis.

## Langkah 2: SSH Key-Based Auth
Duration: 10

Password SSH bisa ditebak (brute-force) dan merepotkan untuk diketik di keyboard HP. Key-based auth lebih aman sekaligus lebih nyaman — sekali setup, tidak perlu ketik apa pun lagi untuk login.

**Di laptop/server, aktifkan SSH server:**

macOS: System Settings → General → Sharing → aktifkan **Remote Login**.

Linux:
```bash
sudo systemctl enable --now ssh
```

**Generate SSH key** (lakukan di perangkat yang akan dipakai untuk connect — di sini kita generate langsung di HP lewat aplikasi SSH client, dibahas di Langkah 4). Jika Anda ingin generate dari laptop lalu salin manual ke HP, jalankan:

```bash
ssh-keygen -t ed25519 -C "hp-remote-access"
```

Salin isi file `.pub` yang dihasilkan ke `~/.ssh/authorized_keys` di laptop/server:

```bash
# di laptop/server
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo "<isi public key dari HP>" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Positive
: Setelah key terpasang, uji login dari HP dulu sebelum lanjut ke langkah berikut — pastikan Anda bisa masuk **tanpa diminta password**. Kalau masih diminta password, cek permission folder `.ssh` (harus `700`) dan file `authorized_keys` (harus `600`) di laptop/server.

## Langkah 3: Install & Konfigurasi tmux
Duration: 10

**Install tmux di laptop/server:**

```bash
# macOS
brew install tmux

# Linux (Debian/Ubuntu)
sudo apt install tmux
```

**Buat sesi tmux bernama, khusus untuk coding agent Anda:**

```bash
tmux new -s agent
```

Di dalam sesi ini, jalankan coding agent Anda seperti biasa (misalnya `claude` untuk Claude Code). Untuk keluar dari sesi **tanpa menghentikan proses di dalamnya**, tekan `Ctrl+b` lalu `d` (detach) — jangan ketik `exit` atau tutup terminal langsung, karena itu akan mematikan sesi.

Untuk kembali ke sesi yang sama nanti (dari laptop atau dari HP):

```bash
tmux attach -t agent
```

Positive
: Opsional tapi berguna — tambahkan konfigurasi dasar di `~/.tmux.conf` supaya scrollback lebih panjang (enak untuk membaca output agent yang panjang) dan mouse scroll aktif di terminal yang mendukungnya:
```
set -g history-limit 50000
set -g mouse on
```
Muat ulang dengan `tmux source-file ~/.tmux.conf` (atau buat sesi baru).

Negative
: Kalau Anda menjalankan banyak project, beri nama sesi yang jelas per project (`tmux new -s agent-projectA`, `tmux new -s agent-projectB`). `tmux ls` menampilkan semua sesi yang sedang hidup — berguna kalau lupa nama sesi yang sedang dipakai.

## Langkah 4: Setup SSH Client di HP
Duration: 10

Anda butuh aplikasi terminal SSH di HP yang mendukung font monospace layak dan koneksi persisten.

**iOS:** [Blink Shell](https://blink.sh) (berbayar, sangat matang untuk mosh/SSH) atau **Termius** (free tier cukup untuk kebutuhan dasar).

**Android:** **Termius**, atau **Termux** (open-source, lebih fleksibel karena juga bisa jalankan tool lain langsung di HP kalau suatu saat dibutuhkan).

Konfigurasi host di aplikasi pilihan Anda:
* **Host**: hostname Tailscale laptop/server (misalnya `mac-server`) — bukan IP lokal, supaya tetap tersambung walau Anda ganti dari Wi-Fi ke data seluler.
* **Port**: `22`.
* **Auth**: import private key yang berpasangan dengan public key yang sudah didaftarkan di Langkah 2, atau generate key baru di aplikasi ini lalu daftarkan public key-nya ke laptop/server.

Uji koneksi:
```bash
ssh you@mac-server
```

Positive
: Aktifkan Tailscale MagicDNS (di admin console Tailscale, `Settings` → `DNS`) supaya Anda cukup ketik hostname pendek (`mac-server`) tanpa perlu tahu IP `100.x.y.z`-nya.

## Langkah 5: Workflow Harian
Duration: 5

Setelah setup di atas selesai (sekali saja), rutinitas harian jadi sangat pendek:

1. Buka aplikasi SSH di HP, connect ke laptop/server (via Tailscale, otomatis tersambung dari jaringan mana pun).
2. `tmux attach -t agent`.
3. Anda melihat **layar persis sama** dengan yang ada di laptop — termasuk kalau coding agent sedang berhenti menunggu konfirmasi permission (misalnya mau menjalankan command yang berisiko, akses file di luar folder project, atau memanggil network). Konfirmasi langsung dari sana, seperti biasa Anda lakukan di laptop.
4. Selesai memantau/merespons, `Ctrl+b` lalu `d` untuk detach — sesi dan proses agent tetap berjalan di laptop.

Positive
: Karena tidak ada lapisan penerjemah (bot, parser pesan), semua fitur interaktif coding agent tetap berfungsi apa adanya — termasuk output berwarna, progress bar, dan prompt konfirmasi bertingkat.

## Kelemahan & Cara Mengurangi Rasa Sakitnya
Duration: 5

Kelemahan utama pendekatan ini murni **UX di HP**, bukan soal keamanan atau keandalan:

* **Mengetik panjang di layar sentuh melelahkan.** Kalau Anda perlu menulis instruksi panjang ke agent, keyboard on-screen jauh lebih lambat dan salah ketik lebih sering daripada di laptop.
* **Layar kecil membuat output panjang sulit dibaca**, terutama diff kode atau log yang lebar.

**Mitigasi yang membantu:**

* Sambungkan keyboard fisik Bluetooth ke HP untuk sesi yang butuh mengetik banyak — mengubah pengalaman secara signifikan.
* Simpan instruksi yang sering dipakai berulang (mis. "lanjutkan", "jalankan test", "commit dengan pesan conventional commits") sebagai **snapshot/snippet** di aplikasi SSH Anda (Termius dan Blink Shell punya fitur snippet) supaya tinggal tap, tidak perlu mengetik ulang.
* Untuk sesi yang benar-benar butuh mengetik banyak (menulis spesifikasi, planning panjang), tunda sampai Anda kembali ke laptop — pakai HP untuk memantau progress dan merespons konfirmasi singkat saja, bukan untuk menulis draft panjang.
* Aktifkan mode landscape dan perbesar ukuran font terminal di aplikasi SSH Anda untuk mengurangi kelelahan mata pada log yang panjang.

Negative
: Jangan mencoba "menyelesaikan" kelemahan ini dengan menambahkan UI ringkasan atau bot penerjemah pesan — begitu Anda melakukan itu, Anda kembali kehilangan keuntungan utama pendekatan ini: melihat terminal asli tanpa terpotong, dan tanpa kode tambahan yang perlu dijaga keamanannya.

## Verifikasi
Duration: 3

Pastikan checklist berikut terpenuhi sebelum menganggap setup selesai:

* [ ] Tailscale status **Connected** di laptop/server maupun HP, dengan akun yang sama.
* [ ] `ssh you@<hostname-tailscale>` dari HP berhasil **tanpa** diminta password.
* [ ] Sesi tmux (`tmux new -s agent`) bisa di-detach (`Ctrl+b d`) dan di-attach lagi (`tmux attach -t agent`) tanpa kehilangan proses yang sedang berjalan.
* [ ] Matikan Wi-Fi laptop sebentar (simulasikan network putus), lalu nyalakan lagi — sesi tmux tetap hidup dan bisa di-attach ulang.
* [ ] Coding agent yang sedang berjalan di dalam tmux, kalau meminta konfirmasi permission, terlihat jelas dan bisa direspons langsung dari HP.

## Ringkasan & Langkah Selanjutnya
Duration: 2

Anda sekarang punya jalur akses pribadi ke terminal & coding agent dari HP — tanpa kode tambahan, tanpa token bot, dengan tampilan terminal asli dan sesi yang tahan putus koneksi.

### Yang Anda Pelajari
* ✅ Kenapa tmux + Tailscale SSH lebih cocok untuk pemakaian pribadi dibanding bot chat atau web UI custom.
* ✅ Peran masing-masing lapisan: Tailscale (alamat tetap), SSH (masuk aman), tmux (sesi tahan putus).
* ✅ Setup key-based SSH auth dan sesi tmux bernama untuk coding agent.
* ✅ Cara mengurangi rasa sakit UX mengetik di HP tanpa mengorbankan kesederhanaan setup.

### Selanjutnya

Kalau Anda ingin menyambungkan dua mesin (laptop ringan sebagai driver, mesin lain sebagai compute node) dengan pola jaringan yang sama, lihat [Dual-Mac Agentic Workflow — Part 3: Jaringan & Remote Development](agentic-dual-mac-part-3-jaringan-remote/) untuk pembahasan yang lebih dalam soal Tailscale + SSH di konteks dua mesin.
