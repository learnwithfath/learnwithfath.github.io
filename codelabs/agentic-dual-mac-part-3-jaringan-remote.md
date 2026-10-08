summary: SSH dan tmux untuk sesi tahan putus; code-server lewat HTTPS privat Tailscale untuk laptop, HP, dan tablet.
id: agentic-dual-mac-part-3-jaringan-remote
categories: AI, Developer Tools, macOS, Remote Development
tags: dual-mac, always-on, m1, intel, tailscale, tmux, code-server, colima, opencode, restic
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Dual-Mac Agentic Workflow — Part 3: Jaringan & Akses Semua Perangkat

## Server Intel dan Client
Duration: 5

[Part 2](../agentic-dual-mac-part-2-provisioning/) menyiapkan Intel 2019 **mac-server** sebagai server 24/7 dan M1 sebagai client. Sekarang uji akses dari M1, laptop lain, HP, atau tablet yang diizinkan.

Perangkat client memerlukan konektivitas ke tailnet: pasang Tailscale pada OS yang didukung dan gunakan akun/akses perangkat yang diizinkan admin. “Dari perangkat mana pun” berarti perangkat yang diotorisasi, bukan komputer publik tanpa identitas. Browser HP cukup untuk review dan pekerjaan kecil; keyboard eksternal membantu untuk coding.

Pada laptop, gunakan SSH + tmux atau browser code-server. Pada HP/tablet, gunakan browser code-server dan client SSH pilihan Anda. Terminal yang dibuka di browser menjalankan command pada host code-server.

## Tailscale dan Pembatasan Akses
Duration: 8

Buka aplikasi Tailscale pada kedua Mac dan client. Gunakan tailnet yang disetujui atau sharing yang telah diatur; bukan sekadar login akun sembarang. Aktifkan MagicDNS bila ingin memakai nama pendek.

```bash
# Jalankan di client; bila CLI belum ada di PATH, gunakan path aplikasi di Part 2.
tailscale status
tailscale ping mac-server
```

Bila GUI macOS tidak menyediakan `tailscale` di PATH, command yang sama dapat dijalankan dengan `/Applications/Tailscale.app/Contents/MacOS/Tailscale`. Selesaikan setup CLI sesuai varian sebelum mengikuti contoh `tailscale` berikutnya.

Tailscale menyediakan koneksi jaringan, OpenSSH menyediakan login. **Panduan ini tidak mengaktifkan `tailscale up --ssh`.** Server Tailscale SSH memiliki batas dukungan varian macOS; OpenSSH bawaan macOS dapat dipakai melalui alamat tailnet. [Dukungan Tailscale SSH](https://tailscale.com/docs/features/tailscale-ssh).

Di access controls tailnet, batasi client/operator yang boleh menuju server Intel port 22 dan 443. Uji juga bahwa perangkat yang tidak diberi izin gagal mengakses. Konfigurasi tailnet bawaan bisa lebih luas daripada kebutuhan Anda. Jangan menganggap Remote Login macOS hanya mendengarkan jaringan Tailscale: periksa akses LAN dan firewall sesuai kebijakan.

## SSH Key dan Identitas Host
Duration: 8

Di **client laptop**, buat key khusus tanpa menimpa key lama:

```bash
ssh-keygen -t ed25519 -f "$HOME/.ssh/id_ed25519_mac_server" -C "mac-server-client"
```

Gunakan passphrase. Cocokkan fingerprint host pada koneksi pertama melalui operator server. Di server Intel, fingerprint dapat dilihat dengan `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub`. Ganti `operator` dengan user macOS sebenarnya:

```bash
cat "$HOME/.ssh/id_ed25519_mac_server.pub" | ssh operator@mac-server 'umask 077; mkdir -p ~/.ssh; cat >> ~/.ssh/authorized_keys'
```

Satu kali pemasangan menggunakan autentikasi yang sudah tersedia; jangan mengulang penambahan key tanpa memeriksa duplikat. Tambahkan blok berikut ke `~/.ssh/config` **client**:

```ssh
Host mac-server
    HostName mac-server
    User operator
    IdentityFile ~/.ssh/id_ed25519_mac_server
    IdentitiesOnly yes
    ForwardAgent no
    ServerAliveInterval 30
    ServerAliveCountMax 3
```

Jika MagicDNS tidak tersedia, ganti `HostName` dengan IP Tailscale server Intel. Private key tetap di client; gunakan kredensial Git scoped pada host yang mengerjakan repo.

```bash
ssh mac-server 'hostname; uname -m'
```

Hasil harus mengidentifikasi server Intel/`x86_64`. Key authentication masih dapat meminta passphrase key; itu berbeda dari password akun remote.

## tmux dan Editor Remote
Duration: 8

Dari client:

```bash
ssh -t mac-server 'tmux new-session -A -s work'
```

Di tmux, buka project dan agent. Tekan `Ctrl-b`, lalu `d` untuk detach. Sambungkan lagi dengan command yang sama. Uji menutup client atau mengganti Wi-Fi ke seluler: proses di server Intel tetap berjalan selama server/prosesnya sendiri tidak mati.

**tmux tidak menyelamatkan proses saat host reboot.** Ia menjaga terminal terhadap putusnya koneksi client. Catatan task dan Git di Part 4 dipakai untuk pemulihan setelah reboot.

Untuk editor desktop, [VS Code Remote - SSH](https://code.visualstudio.com/docs/remote/ssh) dapat membuka folder di server Intel. Ekstensi remote dapat memiliki lisensi tersendiri. Cek `hostname` pada terminal editor setiap berpindah host. Bila kebutuhan utamanya browser dan komponen open source, ikuti code-server di langkah berikutnya.

Panduan tmux tambahan: [tmux + Tailscale + SSH](../tmux-tailscale-ssh-remote-agent/).

## code-server melalui HTTPS Privat
Duration: 12

Di **server Intel 2019**, jalankan pertama kali untuk membuat konfigurasi:

```bash
code-server
```

Buka `http://127.0.0.1:8080` di Intel, lalu hentikan proses dengan `Ctrl-C`. Periksa `~/.config/code-server/config.yaml` di editor lokal. Pertahankan `bind-addr: 127.0.0.1:8080`, `auth: password`, password unik yang dihasilkan, dan `cert: false` karena TLS disediakan proxy. Jangan memasukkan file ini ke Git atau membagikan password lewat log.

```bash
chmod 600 "$HOME/.config/code-server/config.yaml"
brew services start code-server
brew services list
curl -I http://127.0.0.1:8080
```

Respons redirect ke login dapat diterima; error koneksi berarti service belum siap. Selanjutnya, di server Intel:

```bash
tailscale serve --bg http://127.0.0.1:8080
tailscale serve status
```

Ikuti instruksi admin untuk mengaktifkan HTTPS/MagicDNS bila diminta. Buka **URL HTTPS persis yang dicetak**, misalnya `https://mac-server.nama-tailnet.ts.net`, dari browser client yang terhubung Tailscale. Tetap gunakan login code-server. Serve membagikan layanan dalam tailnet; jangan mengaktifkan Funnel untuk skenario privat ini.

Dari browser HP, buka terminal dan jalankan `hostname`, lalu `tmux new-session -A -s work`. Dari laptop lain, sesi yang sama dapat dilanjutkan. Jangan mengedit file yang sama secara bersamaan dari beberapa sesi.

Open VSX dan marketplace VS Code tidak identik; beberapa ekstensi tidak tersedia/diizinkan di code-server. Pengujian UI mobile dan perangkat USB tetap dilakukan pada host/perangkat yang terhubung secara fisik.

Rollback layanan:

```bash
# Menghapus route HTTPS 443 contoh ini; cek status dahulu jika ada route lain.
tailscale serve --https=443 off
brew services stop code-server
```

[Rujukan instalasi code-server](https://coder.com/docs/code-server/install) · [Akses aman](https://coder.com/docs/code-server/guide) · [Tailscale Serve](https://tailscale.com/docs/reference/tailscale-cli/serve).

## Uji Penerimaan Akses
Duration: 5

- [ ] HP menggunakan data seluler + Tailscale dapat membuka HTTPS server Intel dan login.
- [ ] Browser terminal menghasilkan hostname Intel 2019.
- [ ] tmux dapat di-attach kembali setelah client putus.
- [ ] Client tanpa izin tailnet tidak dapat membuka server Intel.
- [ ] M1 tidur atau dimatikan tidak memutus layanan server Intel.
- [ ] Setelah reboot/login Intel 2019, operator memeriksa Tailscale, `brew services list`, dan `tailscale serve status`.

Jika akses gagal: cek server Intel menyala → Tailscale connected → MagicDNS/izin → port/service → login. Jika SSH bisa tetapi browser gagal, uji `curl -I http://127.0.0.1:8080` di server sebelum mengubah jaringan.

[Lanjut Part 4: agent, memori, dan handoff](../agentic-dual-mac-part-4-memory-harness/).
