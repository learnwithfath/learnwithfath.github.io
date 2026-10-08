summary: MacBook Pro 2019 Intel 32 GB sebagai server 24/7; M1 8 GB sebagai perangkat harian/client. Pilihan open source, bukti aktivitas GitHub, dan pembagian beban realistis.
id: agentic-workflow-dual-mac-setup
categories: AI, Developer Tools, macOS, Remote Development
tags: dual-mac, always-on, m1, intel, tailscale, tmux, code-server, colima, opencode, restic
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Dual-Mac Agentic Workflow — Part 1: Konsep & Arsitektur

## Target dan Perangkat
Duration: 5

**Snapshot riset: 8 Oktober 2026.** Seri ini memaksimalkan dua laptop untuk kerja AI dan akses dari perangkat lain. Contoh perangkat: **MacBook Pro M1 2020 8 GB milik kantor** dan **MacBook Pro Intel i9 2019 32 GB milik pribadi**. Periksa OS dan arsitektur aktual sebelum mengikuti command; konfigurasi perangkat berbeda dapat memerlukan penyesuaian.

| Perangkat | Nama contoh | Peran utama |
|---|---|---|
| Intel i9 2019 32 GB | `mac-server` | Server 24/7: SSH, tmux, code-server, agent, build, container dan Android sesuai kebutuhan |
| M1 8 GB | `mac-client` | Perangkat harian: browser/editor remote, terminal, dan uji perangkat fisik |
| HP, tablet, laptop lain | Client | Mengakses server lewat tailnet yang diizinkan |

**MacBook Pro 2019 adalah mesin yang berjalan 24/7.** M1 boleh tidur, dimatikan, atau dibawa bepergian tanpa menghentikan pekerjaan pada server. Ketersediaan 24/7 berarti layanan siap menerima pekerjaan; agent tidak perlu terus memanggil model ketika tidak ada tugas.

Materi ini mengonfigurasi pola penggunaan. Ia tidak membuktikan kedua laptop Anda sudah terpasang layanan atau sudah lulus uji 24 jam.

## Pembagian Beban dan Batas Data
Duration: 8

```text
M1 8 GB / HP / tablet / laptop tepercaya
  Browser atau editor remote + terminal
       | Tailscale + HTTPS atau SSH
       v
MacBook Pro 2019 Intel i9 32 GB: mac-server (24/7)
  SSH + tmux + code-server + OpenCode + backup
  Colima + build/test + emulator Android saat diperlukan
```

Dari M1, buka browser editor atau Remote-SSH ke Intel. File project, terminal agent, build, dan test tinggal di server Intel. Tidak perlu memindahkan repo antarhost untuk alur remote biasa. Jika benar-benar mengerjakan clone lokal di M1, gunakan Git untuk memindahkan commit; jangan menyinkronkan direktori yang sedang ditulis agent pada dua mesin.

**Batas data:** kode, kredensial, dan data kantor hanya boleh berada pada perangkat serta provider AI yang disetujui organisasi. Bila Intel pribadi tidak boleh menerima repo kantor, gunakan server Intel untuk proyek pribadi/open source dan worker organisasi untuk repo kantor. Pembagian peran hardware tidak mengubah aturan akses data.

Mulai dengan **satu job agent pada server Intel**. Contoh alokasi awal Colima 4 CPU/8 GiB dan satu emulator; ukur pemakaian bersama macOS, editor server, serta build sebelum menaikkan concurrency. M1 cukup menjalankan client; hindari menumpuk VM, emulator, dan model lokal pada RAM 8 GB. Model API memakai komputasi provider; tool, file, dan test tetap memakai server Intel.

**Intel tidak otomatis lebih cepat dari M1.** Server dipilih karena peran 24/7 dan kapasitas RAM. Ukur waktu build, suhu, dan biaya listrik. Untuk iOS, cocokkan versi macOS/Xcode/SDK pada [dukungan Xcode Apple](https://developer.apple.com/support/xcode/); jangan mengasumsikan Intel 2019 menjalankan SDK terbaru. Build yang membutuhkan SDK di luar dukungan Intel dapat dijalankan pada mesin Apple Silicon/CI yang sesuai.

## Stack Open Source dan Bukti Aktivitas
Duration: 10

Prioritas pemilihan: cocok dengan tugas → masih dipelihara → lisensi jelas → komunitas besar → biaya operasional. Snapshot GitHub API menyimpan stars, lisensi, status archived, commit terakhir, dan rilis terbaru. Angka adalah hasil pengambilan pada tanggal di atas, bukan penghitung live.

| Proyek | Stars | Lisensi |
|---|---:|---|
| [tailscale/tailscale](https://github.com/tailscale/tailscale) | 37,261 | BSD-3-Clause |
| [tmux/tmux](https://github.com/tmux/tmux) | 49,835 | ISC |
| [coder/code-server](https://github.com/coder/code-server) | 79,560 | MIT |
| [abiosoft/colima](https://github.com/abiosoft/colima) | 31,127 | MIT |
| [anomalyco/opencode](https://github.com/anomalyco/opencode) | 212,294 | MIT |
| [restic/restic](https://github.com/restic/restic) | 36,467 | BSD-2-Clause |
| [mobile-dev-inc/Maestro](https://github.com/mobile-dev-inc/Maestro) | 15,985 | Apache-2.0 |
| [mobile-next/mobile-mcp](https://github.com/mobile-next/mobile-mcp) | 8,763 | Apache-2.0 |
| [louislam/uptime-kuma](https://github.com/louislam/uptime-kuma) | 92,206 | MIT |

Rilis dan commit terakhir (UTC), dicatat terpisah agar mudah dibaca di HP:

- **tailscale/tailscale — Jaringan privat:** [v1.104.1](https://github.com/tailscale/tailscale/releases/tag/v1.104.1) terbit 2026-10-07; commit terakhir 2026-10-08.
- **tmux/tmux — Sesi terminal:** [3.8](https://github.com/tmux/tmux/releases/tag/3.8) terbit 2026-09-09; commit terakhir 2026-10-08.
- **coder/code-server — Editor browser:** [v4.141.0](https://github.com/coder/code-server/releases/tag/v4.141.0) terbit 2026-10-08; commit terakhir 2026-10-08.
- **abiosoft/colima — Container worker:** [v0.10.3](https://github.com/abiosoft/colima/releases/tag/v0.10.3) terbit 2026-06-04; commit terakhir 2026-10-02.
- **anomalyco/opencode — Coding agent:** [v1.18.35](https://github.com/anomalyco/opencode/releases/tag/v1.18.35) terbit 2026-10-06; commit terakhir 2026-10-08.
- **restic/restic — Backup terenkripsi:** [v0.19.1](https://github.com/restic/restic/releases/tag/v0.19.1) terbit 2026-07-05; commit terakhir 2026-09-25.
- **mobile-dev-inc/Maestro — Mobile E2E opsional:** [cli-2.11.0](https://github.com/mobile-dev-inc/Maestro/releases/tag/cli-2.11.0) terbit 2026-09-29; commit terakhir 2026-10-08.
- **mobile-next/mobile-mcp — Inspeksi mobile opsional:** [1.0.8](https://github.com/mobile-next/mobile-mcp/releases/tag/1.0.8) terbit 2026-10-02; commit terakhir 2026-10-07.
- **louislam/uptime-kuma — Monitor opsional di host lain:** [2.5.5](https://github.com/louislam/uptime-kuma/releases/tag/2.5.5) terbit 2026-09-16; commit terakhir 2026-10-08.

[Buka bukti JSON yang dapat diperiksa](../data/dual-mac-projects.json). Seluruh proyek dalam snapshot tidak berstatus archived saat diperiksa. Rilis/commit terbaru adalah bukti pemeliharaan publik; **stars bukan jumlah pengguna aktif**. Kecocokan produksi harus dibuktikan dengan uji pada perangkat Anda.

**Stack minimum:** Tailscale + OpenSSH bawaan macOS + tmux. Tambahkan code-server bila perlu browser, OpenCode untuk agent, Colima pada server Intel bila perlu container, dan restic untuk backup. Maestro bersifat opsional untuk pekerjaan mobile. Uptime Kuma dan mobile-mcp adalah opsi tambahan, dipasang hanya jika dibutuhkan pada server.

Tailscale memiliki client open source, tetapi layanan koordinasi hosted dan paket bisnisnya merupakan produk terpisah. [Headscale](https://github.com/juanfont/headscale) dapat dievaluasi jika perlu koordinasi yang dikelola sendiri; ia menambah beban operasi. macOS, provider model API, dan beberapa ekstensi editor juga tidak menjadi open source hanya karena CLI yang dipakai open source.

OrbStack/Obsidian/agent komersial dapat tetap dipakai jika memang diperlukan. Seri ini menggunakan Colima dan Markdown biasa sebagai baseline agar alurnya tidak bergantung pada produk tersebut. Graphify bukan prasyarat; tambahkan indexer hanya setelah kebutuhan pencarian repo terukur.

## Rute Belajar dan Kriteria Sukses
Duration: 5

1. [Part 2: Provisioning](../agentic-dual-mac-part-2-provisioning/) — power, toolchain minimum, container/emulator opsional, batas restart.
2. [Part 3: Remote](../agentic-dual-mac-part-3-jaringan-remote/) — Tailscale, SSH, tmux, code-server dari HP/tablet.
3. [Part 4: Memory & Harness](../agentic-dual-mac-part-4-memory-harness/) — OpenCode, worktree, catatan task, budget dan handoff.
4. [Part 5: Operasi & Pengujian](../agentic-dual-mac-part-5-testing-e2e/) — uji end-to-end, recovery, backup/restore, dan soak test 24 jam.

Alokasikan 3–4 jam untuk setup dasar, lalu 24 jam pengamatan terpisah. Stack mobile membutuhkan unduhan dan setup tambahan.

Selesai bila akses dari jaringan seluler bekerja, task bertahan saat client putus, restart memiliki prosedur recovery yang diuji, backup berhasil direstore, serta latensi/RAM/biaya dicatat. CPU 100% sepanjang hari bukan target keberhasilan.

**Jika Intel sedang mati:** seluruh layanan server tidak tersedia sampai daya, jaringan, login, dan service pulih. Jika M1 tidur atau dibawa bepergian, server Intel tetap bekerja dan dapat diakses dari client lain. Untuk SLA tanpa operator, gunakan host khusus yang dikelola sebagai server.

[Kembali ke peta seri](../agentic-dual-mac-workflow.html).
