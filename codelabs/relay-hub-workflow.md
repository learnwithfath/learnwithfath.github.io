summary: Panduan praktis Relay Hub: onboarding, konteks agent, investigasi, trusted memory, handoff, skill, artifact, dan review Git.
id: relay-hub-workflow
categories: AI, Developer Tools, Knowledge Management
tags: relay-hub, knowledge-hub, git, handoff, workflow
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Relay Hub — Workflow Knowledge Hub dari Sesi Pertama sampai Handoff

## Apa yang Akan Anda Bangun?
Duration: 5

Relay Hub adalah pola kerja berbasis repository: aturan agent, ingatan tim, catatan operator, dan pekerjaan yang sedang diestafetkan berada dalam Markdown yang direview melalui Git. Tutorial ini menjelaskan workflow implementasi hub yang menjadi acuan, bukan instalasi paket bernama `relay-hub`.

Target pembaca: engineer, support, dan maintainer yang sudah mendapat akses ke clone hub beserta `scripts/hub.py`. Tutorial ini tidak menyertakan kode hub, URL repository privat, data client, atau integrasi internal. Perintah `hub.py` dijalankan dari root clone hub Anda, bukan dari repository situs tutorial ini.

Setelah selesai, Anda dapat:

- Memulai sesi dengan identitas dan konteks yang tepat.
- Menelusuri tiket lama sebelum investigasi baru.
- Mencatat bukti, status, keputusan, dan pelajaran tanpa mencampurnya.
- Mengestafetkan pekerjaan ke agent atau orang lain.
- Menyiapkan perubahan tervalidasi untuk review.

Alur utama:

```text
Identitas → konteks → cari kasus lama → investigasi → catat bukti
                                      ↓
Review ← validasi ← ticket + hot + journal
   ↓
Pelajaran → usulan knowledge/runbook → verifikasi manusia
```

Semua skenario dalam tutorial adalah **ilustrasi sintetis**. Jangan membuat tiket berstatus resolved hanya karena telah membaca contoh. Bila mencoba perintah penulisan, gunakan clone latihan yang diizinkan maintainer dan tandai catatannya sebagai latihan; jangan mengisi ledger operasional tim dengan kejadian fiktif.

## Kenali Peta Repository
Duration: 6

| Lokasi | Fungsi | Kapan dibaca atau diubah |
| --- | --- | --- |
| `AGENTS.md` | Aturan kerja seluruh agent | Awal sesi, sebelum bertindak |
| `memory/_hot.md` | Dashboard aktif, PIC, blocker | Awal sesi dan perubahan status bermakna |
| `memory/_index.md` | Peta dokumen | Mencari lokasi konteks |
| `memory/tickets/` | Bukti dan status satu kasus | Investigasi sampai penutupan |
| `memory/projects/` | Progres lintas tiket atau repo | Milestone dan ledger |
| `memory/decisions/` | Keputusan beserta alasan | Saat keputusan benar-benar dibuat |
| `memory/runbooks/` | Prosedur yang dapat diulang | Menjalankan atau mengusulkan perbaikan prosedur |
| `memory/knowledge/` | Klaim teknis dengan sumber dan confidence | Menyimpan pelajaran untuk diverifikasi |
| `people/HANDLE/` | Profil dan journal operator | Preferensi serta rencana harian |
| `handoffs/open/` | Jembatan sementara antar sesi | Pekerjaan terputus atau berganti agent |
| `skills/` | Workflow agent berversi | Preflight dan eksekusi tugas terstruktur |
| `artifacts/` | Sumber deliverable yang dapat dipreview | Explainer, one-pager, presentasi HTML |

Ticket menyimpan kebenaran kasus. Journal mencatat aktivitas operator. Handoff menyimpan titik lanjut sementara. `_hot.md` mengarahkan pembaca ke sumber tersebut; hindari menyalin seluruh investigasi ke dashboard.

**Checkpoint:** Anda dapat menunjukkan lokasi aturan, status aktif, dan bukti kasus tanpa membuka riwayat chat.

## Onboarding dan Pemeriksaan Lingkungan
Duration: 10

Prasyarat: Git, Python 3.9+, akses repository hub, dan izin menjalankan setup lokal. Python tooling hub menggunakan standard library; tidak perlu memasang dependensi pip untuk `hub.py`.

Ganti URL contoh dengan remote yang diberikan maintainer. Placeholder URL ini tidak dapat langsung di-clone.

```bash
git clone URL_REMOTE_HUB ~/projects/team-hub
cd ~/projects/team-hub
git status --short --branch
git worktree list
git remote show origin
```

Cari branch default dari output remote. Contoh berikut memakai `main`; gunakan `master` jika itu yang benar pada hub Anda. Update hanya ketika working tree bersih dan Anda berada di branch target pada checkout utama.

```bash
git switch main
git pull --ff-only origin main
git switch -c hub/operator-demo/onboarding
export QISCUS_HUB="$PWD"
export HUB_OPERATOR=operator-demo
bash scripts/setup.sh
python3 scripts/hub.py install --dry-run
python3 scripts/hub.py install
python3 scripts/hub.py doctor
```

`setup.sh` memasang hook validasi. `install` membuat symlink skill dan dapat memindahkan salinan lama ke backup; review dry-run terlebih dahulu. Variabel export di atas hanya berlaku di shell aktif; bila diperlukan, simpan pengaturan yang sesuai di profil shell Anda.

Ganti `operator-demo` dengan handle sendiri. Identitas harus dinyatakan operator, bukan ditebak dari git config, email, atau perangkat bersama.

Jika profil belum ada:

```bash
python3 scripts/hub.py new person --person operator-demo
python3 scripts/hub.py export
python3 scripts/hub.py check
```

Isi role, area tanggung jawab, dan preferensi di profil. `export` menghasilkan berkas diskusi dari profil dan konteks aktif; jangan mengedit output generated secara langsung.

**Checkpoint:** `doctor` tidak menunjukkan GAGAL. Pahami setiap peringatan sebelum lanjut; output sukses bukan jaminan akses MCP atau layanan pihak ketiga tersedia.

## Mulai Sesi dan Rencanakan Hari
Duration: 6

Urutan baca agent:

1. Konfirmasi identitas operator.
2. Baca `AGENTS.md`, lalu `memory/_hot.md`.
3. Jalankan daftar handoff; buka hanya pekerjaan yang ditugaskan.
4. Baca profil dan journal terakhir operator.

```bash
python3 scripts/hub.py handoff list
python3 scripts/hub.py new journal --person operator-demo
```

Jangan menjalankan `new journal` berulang bila entry hari ini sudah ada; buka dan perbarui entry tersebut. Isi Plan dengan pekerjaan aktual, lalu pindahkan hasil nyata ke Done. Catat blocker dan langkah berikut di bagian handoff journal.

Contoh prompt untuk agent yang bisa membaca file:

```text
Saya operator-demo. Baca AGENTS.md dan konteks awal sesi.
Cari konteks kasus timeout ekspor. Jelaskan bukti yang tersedia,
langkah berikut, dan file yang perlu diperbarui. Draft pesan dulu;
jangan kirim, push, merge, atau mengubah infrastruktur.
```

Untuk agent yang tidak dapat membaca repository, gunakan `hub.py export` dan berikan hanya konteks yang diizinkan ke lingkungan agent tersebut. Export dapat memuat konteks internal: jangan menempelkannya ke situs publik atau tool yang tidak disetujui.

## Cari Dulu, Baru Buat Tiket
Duration: 8

Ilustrasi: sebuah proses ekspor mengalami timeout. Ini gejala latihan, bukan insiden aktual. Mulai dengan pencarian:

```bash
python3 scripts/hub.py search "timeout ekspor"
python3 scripts/hub.py search "timeout" --type ticket,runbook,knowledge
python3 scripts/hub.py report stale
```

Baca hasil relevan, confidence, sumber, dan tanggal verifikasinya. Hasil pencarian adalah petunjuk; kemiripan gejala tidak membuktikan root cause sama. Beri tahu operator hasil mana yang dipakai dan apa yang perlu dicek ulang.

Untuk laporan aktual baru, buat entry dari template:

```bash
python3 scripts/hub.py new ticket export-timeout
```

Nama file bertanggal dibuat tool. Isi Summary, sumber laporan, Timeline, Investigation, dan Actions Taken. Simpan konteks yang membantu reproduksi: komponen, endpoint, kode error, struktur payload, versi, lingkungan, dan rujukan kode. Jangan menyimpan token, env produksi, data pribadi customer, atau isi pesan customer asli.

Pisahkan empat hal:

| Bagian | Contoh sintetis |
| --- | --- |
| Laporan | Reporter menyebut ekspor berhenti sebelum selesai |
| Bukti | Pengujian lokal memperlihatkan request melewati batas waktu |
| Hipotesis | Ukuran hasil mungkin memengaruhi durasi; belum dibuktikan |
| Langkah berikut | Uji ukuran data terkontrol dan telusuri propagasi error |

Tambahkan tautan relatif ke ticket di `_hot.md`, dengan PIC, status singkat, dan blocker. Gunakan nama file aktual hasil generator. Edit hanya item yang menjadi tanggung jawab Anda.

**Checkpoint:** orang lain dapat memahami apa yang diketahui, yang belum diketahui, serta langkah berikut dari ticket dan dashboard.

## Investigasi, Status, dan Komunikasi
Duration: 8

Catat setiap pemeriksaan beserta lingkup buktinya: pembacaan kode, unit test, mock, staging, atau observasi production. Tes lokal yang lulus tidak membuktikan masalah production sudah selesai.

`status` ticket dan `stage` operator memiliki peran berbeda. `status: open` dapat tetap dipakai ketika operator sudah mencapai `stage: to-verify`: pekerjaan operator selesai dan menunggu verifikasi pihak berwenang. Jangan otomatis mengubahnya menjadi resolved.

| Stage | Makna kerja |
| --- | --- |
| `todo` | Belum dimulai |
| `in-progress` | Sedang dikerjakan |
| `pending` | Menunggu pihak lain; catat siapa dan apa yang ditunggu |
| `done-dev` | Implementasi selesai, masih ada proses berikutnya |
| `to-verify` | Tahap terminal operator, menunggu verifikasi |
| `done` | Penutupan administratif sesuai kewenangan |

Baca bantuan command sebelum memindahkan stage:

```bash
python3 scripts/hub.py stage --help
```

Jangan mengklaim perubahan kolom tool eksternal sudah dilakukan bila Anda hanya mengubah frontmatter lokal. Konfirmasi status eksternal kepada operator jika aksesnya tidak tersedia.

Draft follow-up yang berguna menjawab: apa yang berubah, siapa pemilik aksi berikut, dan bukti apa yang masih dibutuhkan. Ringkasan untuk reviewer menampilkan masalah, status, rekomendasi, dan blocker lebih dulu; detail log serta kronologi dapat ditautkan.

Agent menampilkan draft pesan terlebih dahulu. Kata “lanjut” atau “oke” bukan izin mengirim; diperlukan instruksi kirim untuk pesan tersebut. Pesan yang dikirim agent atas nama operator membawa penanda terlihat `sent by AGENT (AI)`. Deploy, restart, scale, konfigurasi, dan perubahan database membutuhkan konfirmasi spesifik.

## Tutup Kasus dan Bangun Trusted Memory
Duration: 8

Sebelum menetapkan ticket resolved/closed, pastikan hasil yang dicatat benar-benar terjadi. Lengkapi Resolution, tanggal resolusi yang benar, dan dua bagian pembelajaran:

```markdown
## Rujukan yang dipakai

Tautkan runbook, knowledge, atau ticket yang benar-benar dipakai.
Gunakan path relatif ke file yang ada. Bila tidak ada, tulis tidak ada.

## Yang bisa dipakai ulang

Tuliskan langkah, query, atau jebakan yang benar-benar ditemukan.
Bila tidak ada, tulis tidak ada.
```

Isi `pattern:` dalam kebab-case jika kasus benar-benar cocok dengan pola berulang. Kemudian:

```bash
python3 scripts/hub.py sync-used-by
python3 scripts/hub.py check
```

`sync-used-by` menyelaraskan back-reference runbook/knowledge dari bagian rujukan ticket. Review diff karena command dapat memperbarui lebih dari satu file.

Knowledge baru dibuat dari template:

```bash
python3 scripts/hub.py new knowledge export-timeout-observations
```

Untuk tulisan agent, mulai dengan `confidence: unverified`, `last_verified: null`, dan sumber yang dapat diikuti. Gunakan sumber permanen yang diizinkan, seperti path kode atau dokumen; handoff sementara bukan sumber knowledge. Hanya manusia yang menaikkan confidence sesudah memeriksa klaim terhadap sumbernya.

Jangan menandai verified karena test lolos saja. Jika prosedur berulang layak menjadi runbook atau skill, ajukan promosi lewat PR untuk review manusia.

## Handoff yang Bisa Dilanjutkan
Duration: 8

Buat handoff di awal pekerjaan panjang atau ketika berisiko terputus:

```bash
python3 scripts/hub.py handoff new export-timeout-review --task "Lanjutkan pemeriksaan timeout ekspor" --operator operator-demo
python3 scripts/hub.py handoff show export-timeout-review
```

Isi tujuan, branch/repo kerja, kebutuhan tool di `requires:`, bukti yang sudah ada, bagian Sudah selesai, Langkah berikut, serta Jangan dilakukan. Gunakan task aktual; contoh ini tidak boleh menjadi catatan insiden fiktif di hub tim.

Setelah langkah bermakna:

```bash
python3 scripts/hub.py handoff update export-timeout-review --agent codex --stop-reason other --note "Catat hasil aktual dan titik lanjut di file handoff"
```

Perbarui isi checklist file juga; log singkat saja belum cukup. Sebelum berhenti, tulis command berikut yang perlu dijalankan dan batas bukti saat itu.

Agent penerima menjalankan `handoff show`, memeriksa `git status` dan `git log` pada branch yang dicatat, serta memastikan tool di `requires:` tersedia. Jika tool wajib tidak ada, berhenti dan laporkan; jangan menebak hasil. Bagian Jangan dilakukan tetap mengikat.

Jika tujuan benar-benar selesai:

```bash
python3 scripts/hub.py handoff close export-timeout-review
```

Close memindahkan ringkasan ke journal dan menghapus handoff. Simpan bukti permanen di ticket/project sebelum close. Jangan menutup atau mengubah handoff milik pekerjaan lain hanya untuk membersihkan daftar.

## Skill dan Artifact dalam Workflow
Duration: 8

Skill adalah prosedur berversi yang dapat memerlukan CLI, environment, dan MCP tertentu. Tooling tidak otomatis menyediakan akses layanan.

```bash
python3 scripts/hub.py skills list
python3 scripts/hub.py preflight NAMA-SKILL
```

Ganti placeholder dengan nama dari registry. Baca SKILL.md dan lakukan Langkah 0. Pemeriksaan CLI/env dapat diotomatisasi; ketersediaan MCP yang dicetak tetap perlu diperiksa agent. Dependensi wajib hilang berarti laporkan blocker sebelum eksekusi.

Sumber skill bersama berada di `skills/`; symlink lokal menunjuk ke sana. Perubahan skill membutuhkan metadata versi/owner/requires, preflight, validasi, dan review. Hindari menimpa versi lokal yang lebih baru tanpa menelaah perbedaannya.

Untuk deliverable yang dapat dibuka ulang:

```bash
python3 scripts/hub.py new artifact export-review --person operator-demo
python3 scripts/hub.py publish export-review
```

Sumber dibuat di `artifacts/YYYY-MM-DD_export-review/` beserta `meta.yaml`. Isi HTML/Markdown dan metadata audience sesuai penerima. `publish` default mencetak lokasi lokal; itu belum berarti artifact sudah dipublikasikan di internet.

Review sumber dan tampilan, termasuk batas data yang boleh dibagikan. Publikasi eksternal hanya atas instruksi spesifik operator. Sesudah publikasi aktual, catat URL hasilnya dengan `publish SLUG --record URL_AKTUAL`. Jangan merekam URL ilustrasi sebagai publikasi nyata.

## Git, Review, dan Penutupan Sesi
Duration: 8

Sebelum mengubah file, periksa branch dan perubahan sesi lain. Agent menggunakan branch `hub/HANDLE/SLUG`, menambahkan file sesi ini satu per satu, dan membuat commit kecil per tujuan. Jangan commit ke main/master, jangan memakai `git add .`, dan jangan melewati hook.

```bash
git status --short --branch
git diff --stat
python3 scripts/hub.py check
git diff --check
```

Stage nama file aktual yang ditinjau, lalu commit dengan Conventional Commits dan trailer agent. Contoh di bawah memperlihatkan format pesan; staging dilakukan sebelumnya dengan path eksplisit:

```bash
git commit -m "docs(ticket): record export investigation" -m "Agent: codex"
```

Jika hook gagal, baca dan laporkan masalahnya; jangan gunakan `--no-verify`. Perubahan milik orang lain tidak ikut di-stage.

Push perlu instruksi eksplisit operator. Review memory bersama dan perubahan prosedur mengikuti aturan maintainer. Persetujuan draft isi belum otomatis mengizinkan kirim pesan atau ubah infrastruktur.

Sebelum merge yang telah diperintahkan: fetch, update target dengan fast-forward, sinkronkan topic branch terhadap target terbaru, lalu cek konflik. `git merge-tree --write-tree TARGET TOPIC` dapat dipakai sebagai pemeriksaan tanpa mengubah working tree. Laporkan hasilnya; konflik memerlukan keputusan penyelesaian. Jalankan validasi lagi setelah merge.

Jika perlu worktree, buat pada branch baru di folder parent repo; jangan menempati main/master di worktree tambahan. Cek daftar worktree dan jangan mengganggu sesi lain.

Akhiri sesi dengan:

```bash
python3 scripts/hub.py wrapup
```

Wrapup bersifat read-only: daftar perubahan belum di-commit, commit belum di-push, branch tersisa, dan handoff basi. Output adalah checklist untuk ditinjau, bukan izin otomatis push atau hapus branch.

## Review Mingguan dan Troubleshooting
Duration: 7

```bash
python3 scripts/hub.py report weekly
python3 scripts/hub.py report stale
python3 scripts/hub.py report health
```

Review mingguan memeriksa kasus selesai, kandidat pelajaran, dan knowledge yang menua. Pilih maksimal dua usulan promosi agar review tetap dapat ditangani. Catat review aktual di journal, lalu perbarui `_hot.md` untuk pekerjaan Anda yang berubah.

| Gejala | Langkah pemeriksaan |
| --- | --- |
| `scripts/hub.py` tidak ditemukan | Pastikan terminal berada di root clone hub, bukan repo tutorial |
| `doctor` menunjukkan GAGAL | Baca alasan, periksa hook, path hub, variabel operator, dan hasil check |
| `new` menolak entry yang sudah ada | Buka file yang telah dibuat, jangan membuat duplikat |
| `check` menolak frontmatter/link | Ikuti template dan perbaiki path ke sumber yang benar |
| `check` mendeteksi data sensitif | Hapus data yang dilarang; false positive perlu perbaikan checker dan test, bukan penyamaran |
| Skill berhenti di preflight | Siapkan akses/dependensi yang diizinkan, atau laporkan blocker |
| Handoff berbeda dari Git aktual | Cocokkan commit/status dan perbarui titik lanjut berdasarkan bukti |
| `_hot.md` konflik | Pertahankan konteks kedua pihak, rapikan item per PIC, lalu validasi |

## Latihan Akhir dan Checklist
Duration: 5

Di clone latihan yang diizinkan, lakukan simulasi berikut tanpa menghubungi client atau layanan production:

1. Nyatakan handle, baca aturan, jalankan doctor.
2. Cari gejala sintetis dan bedakan hasil pencarian dari fakta terverifikasi.
3. Buat satu catatan latihan yang jelas berlabel simulasi; catat hipotesis dan batas buktinya.
4. Siapkan handoff sehingga pembaca berikut dapat menyebut langkah selanjutnya tanpa chat tambahan.
5. Jalankan check, tinjau diff, dan siapkan commit di topic branch.
6. Buka deliverable lokal jika ada; pastikan tidak ada data internal yang masuk materi publik.

Anda siap menggunakan workflow ketika dapat menjawab:

- Siapa operator dan di mana konteks terbarunya?
- Apa bukti, hipotesis, blocker, dan pemilik langkah berikut?
- Mana yang permanen di ticket, dan mana yang sementara di handoff?
- Apakah knowledge sudah diverifikasi manusia?
- Aksi keluar mana yang masih membutuhkan instruksi eksplisit?

Panduan ini merangkum workflow yang diperiksa pada snapshot lokal 16 Oktober 2026. Pada clone hub Anda, `AGENTS.md`, template, `CONTRIBUTING.md`, dan bantuan `python3 scripts/hub.py --help` tetap menjadi acuan operasional. Tutorial tidak menggantikan aturan repository yang berkembang.
