summary: OpenCode sebagai harness open source, Markdown dan Git sebagai memori, satu worktree per task, serta batas biaya dan handoff antarhost.
id: agentic-dual-mac-part-4-memory-harness
categories: AI, Developer Tools, macOS, Remote Development
tags: dual-mac, always-on, m1, intel, tailscale, tmux, code-server, colima, opencode, restic
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Dual-Mac Agentic Workflow — Part 4: Shared Memory & Agent Harness

## Mulai dari Satu Agent
Duration: 5

Setelah [Part 3](../agentic-dual-mac-part-3-jaringan-remote/), Anda dapat masuk ke server Intel 2019 dari client mana pun yang diizinkan. Mulai dengan **satu sesi OpenCode pada satu repo latihan**. Server tersedia 24/7; pemanggilan model hanya terjadi ketika ada pekerjaan.

OpenCode dipilih karena kode sumber MIT dan komunitas GitHub besar yang tercatat di [snapshot Part 1](../agentic-workflow-dual-mac-setup/). Harness open source tidak berarti inference gratis atau data selalu lokal. Provider yang digunakan menentukan biaya serta pemrosesan prompt/kode. Gunakan provider yang diizinkan untuk data project Anda.

Model lokal pada Intel adalah eksperimen terpisah: ukur kecepatan inference, RAM, dan kualitas sebelum menjadikannya layanan. RAM 32 GB tidak menjamin inference cepat. Jangan memasang model besar atau beberapa agent paralel sebagai langkah awal.

## Instalasi dan Permission
Duration: 10

Di **server Intel 2019**:

```bash
brew install anomalyco/tap/opencode
opencode --version
opencode auth login
opencode models
```

Gunakan login provider yang didukung dan diizinkan. Simpan kredensial di mekanisme autentikasi tool, bukan Markdown repo. Catat versi terpasang agar update bisa ditelusuri. [Instalasi resmi](https://opencode.ai/docs/) · [CLI](https://opencode.ai/docs/cli/).

Di root repo latihan, buat `opencode.json` sebagai baseline interaktif:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": "ask"
}
```

Ini meminta persetujuan tool yang membutuhkan permission. Untuk job tanpa operator, sediakan profil terpisah dengan allowlist command yang spesifik dan deny operasi di luar scope; uji satu kali secara interaktif terlebih dahulu. Jangan memakai auto-approve global agar sebuah job dapat berjalan semalaman. Permission tool juga bukan pengganti isolasi OS dan kredensial minimum. [Rujukan permission](https://opencode.ai/docs/permissions/).

Mulai sesi melalui tmux:

```bash
cd "$HOME/projects/repo-latihan"
tmux new-session -A -s agent
# Di dalam tmux:
opencode
```

Gunakan pemilihan model/provider yang tersedia pada instalasi Anda. Mulai dengan task read-only, misalnya menjelaskan struktur repo dan command pengujian, kemudian satu perubahan kecil.

## Memori yang Ikut Git
Duration: 8

Di root repo project:

```bash
mkdir -p .knowledge/adr .knowledge/contracts .knowledge/learnings
```

Buat `.knowledge/index.md` dengan tautan Markdown relatif ke keputusan, kontrak, dan hasil investigasi. Baca melalui editor remote di host yang memiliki file. Obsidian lokal pada client tidak otomatis dapat membuka direktori remote SSH; gunakan clone yang diizinkan jika memang memerlukan vault lokal.

Buat `AGENTS.md` yang memuat aturan project:

```markdown
# Aturan kerja
- Baca .knowledge/index.md dan task aktif sebelum mengubah kode.
- Catat tujuan, acceptance criteria, branch, commit dasar, dan host eksekusi.
- Gunakan command build/test dari repo. Laporkan hasil dan exit code aktual.
- Tulis perubahan kontrak API di .knowledge/contracts/.
- Jangan masukkan secret, data pelanggan, atau transkrip privat ke catatan.
- Berhenti setelah maksimal 3 percobaan perbaikan; rangkum penyebab dan blocker.
- Push, deploy, dan kirim pesan hanya jika ada otorisasi untuk task tersebut.
```

OpenCode mendukung `AGENTS.md`; lihat [aturan resmi](https://opencode.ai/docs/rules/). Instruksi tertulis membantu agent, tetapi pembatasan akses perlu ditegakkan oleh permission/kredensial.

Template `.knowledge/task.md`:

```markdown
# Task aktif
Tujuan:
Acceptance criteria:
Host dan direktori:
Branch dan base commit:
Versi tool/model:
Batas waktu dan biaya provider:
Status: planned / running / waiting-server / blocked / done
Command terakhir + exit code:
Hasil pengujian:
Langkah berikutnya:
```

## Isolasi Task pada Server Intel
Duration: 10

Di repo latihan pada **host yang akan mengerjakan task**, pastikan working tree bersih lalu buat worktree:

```bash
git status --short
git worktree add ../repo-task-example -b task/example
cd ../repo-task-example
```

Satu task memiliki satu pemilik dan satu worktree aktif. Dokumentasikan acceptance criteria sebelum meminta agent mengubah kode. Setelah perubahan, jalankan test yang relevan, tinjau diff, dan commit file yang memang milik task.

Untuk alur normal, worktree tetap di server Intel: M1, HP, dan tablet hanya mengakses sesi remote yang sama. Menutup M1 tidak memindahkan atau menghentikan job di Intel.

Jika Anda juga mengubah clone lokal di M1, handoff lewat remote Git yang diotorisasi: commit/push branch sumber lalu fetch commit tersebut pada server. Catat `git rev-parse HEAD` agar versi yang diuji jelas. Jangan mengarahkan dua agent menulis task yang sama secara bersamaan.

Jika server offline, tandai `waiting-server` dan pulihkan Intel sebelum melanjutkan. Jika repo kantor dilarang berada di laptop pribadi, gunakan worker/CI organisasi yang diizinkan untuk repo tersebut.

Tidak perlu Graphify atau vector database untuk memulai. Gunakan `rg`, struktur repo, kontrak, dan test. Tambahkan indexer hanya jika ia memperbaiki masalah pencarian yang nyata dan hasilnya dapat ditelusuri.

## Pekerjaan Malam yang Terukur
Duration: 8

Mulai dengan job deterministik: test repo, lint, laporan hasil build, atau backup. Agent yang menulis kode tanpa operator membutuhkan scope sempit, test yang jelas, permission teruji, serta batas biaya provider yang benar-benar dikonfigurasi.

Contoh alur task:

1. Operator memilih issue kecil dan menuliskan acceptance criteria.
2. Agent membuat patch di worktree task.
3. Test yang ada menentukan lulus/gagal. Maksimal tiga percobaan perbaikan.
4. Agent menulis hasil, command, dan blocker ke catatan task.
5. Operator memeriksa diff sebelum perubahan dibagikan sesuai otorisasi.

`tmux` tidak memberi retry, timeout, batas token, atau scheduler. Instruksi “maksimal tiga percobaan” adalah aturan alur, bukan pembatas biaya keras. Gunakan limit belanja pada provider jika tersedia; jika tidak, pertahankan pengawasan dan jangan menganggap saldo aman karena prompt menyebut budget.

Untuk penjadwalan deterministik, gunakan LaunchAgent dengan `StartCalendarInterval` dan wrapper job yang telah diuji; PATH harus eksplisit karena launchd tidak membaca shell interaktif. Jangan memasang `KeepAlive` pada job AI berbayar yang bisa berulang setelah error. Pada laptop yang tidur/offline, jadwal bukan jaminan job berjalan tepat waktu.

## Verifikasi Harness
Duration: 4

- [ ] Satu task read-only berhasil dari tmux/browser.
- [ ] Agent membaca aturan repo dan meminta permission sesuai konfigurasi.
- [ ] Task perubahan kecil menghasilkan diff serta hasil test yang dapat diperiksa.
- [ ] Tidak ada secret di diff/catatan/log yang akan dipublikasikan.
- [ ] Client dapat putus lalu melanjutkan sesi yang sama.
- [ ] Biaya dan durasi job dicatat; task selesai tidak memicu loop baru.
- [ ] Worktree berada di server Intel; handoff clone lokal bila ada menggunakan commit identik.

[Lanjut Part 5: pengujian dan operasi 24/7](../agentic-dual-mac-part-5-testing-e2e/).
