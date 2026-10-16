summary: Panduan praktis Relay Hub: onboarding, konteks agent, investigasi, trusted memory, handoff, skill, artifact, dan review Git.
id: relay-hub-workflow
categories: AI, Developer Tools, Knowledge Management
tags: relay-hub, knowledge-hub, git, handoff, workflow
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Relay Hub — Workflow Knowledge Hub dari Sesi Pertama sampai Handoff

## Mulai dari Percakapan, Agent Mengurus Teknisnya
Duration: 5

Relay Hub adalah pola kerja berbasis repository: aturan agent, ingatan tim, catatan operator, dan pekerjaan yang sedang diestafetkan berada dalam Markdown yang direview melalui Git. Tutorial ini menjelaskan workflow implementasi hub yang menjadi acuan, bukan instalasi paket bernama `relay-hub`.

Tutorial ini ditujukan kepada operator yang bekerja melalui percakapan dengan AI agent. Anda cukup menyampaikan tujuan, konteks, dan hasil yang diinginkan. **Anda tidak perlu menjalankan Python, mengedit YAML, atau mengetik perintah Git.** Agent mengurus pekerjaan teknis sesuai aturan repository dan akses yang tersedia.

Hub perlu dapat diakses agent melalui folder project yang dibuka. Untuk setup pertama, berikan lokasi atau akses resmi dari maintainer. Jika login, izin OS, atau akses layanan perlu dilakukan manusia, agent menjelaskan hambatan spesifik dan bantuan minimum yang diperlukan.

Tutorial memakai contoh sintetis dan tidak membagikan data client atau repository privat. Ganti `operator-demo`, nama kasus, lokasi repo, dan LINK_THREAD dengan informasi aktual Anda. Jangan memasukkan secret atau data pribadi customer ke prompt.

### Pola prompt yang membantu agent bekerja tuntas

Sebutkan **siapa Anda → tujuan → sumber konteks → hasil yang diharapkan → batas tindakan**. Tidak perlu menyebut command internal. Setelah konteks disepakati dalam sesi, cukup instruksi singkat untuk melanjutkan.

```text
Saya operator-demo. Tangani kasus timeout ekspor dari LINK_THREAD;
repo aplikasinya berada di LOKASI_REPO. Cari konteks lama di hub,
lalu investigasi dan siapkan perbaikan lokal bila buktinya cukup.
Perbarui catatan hub, buat ringkasan temuan dan draft balasan.
Kerjakan langkah rutin secara mandiri; tanyakan hanya informasi
atau keputusan yang benar-benar menghambat. Jangan kirim pesan,
merge, push, atau mengubah infrastruktur tanpa instruksi spesifik.
```

### Prompt singkat setelah konteks sudah jelas

Tidak perlu mengulang prompt panjang pada setiap giliran. Dalam sesi kasus yang sama, instruksi berikut cukup:

- “Lanjutkan investigasi dari temuan terakhir dan perbarui catatannya.”
- “Buat draft update singkat untuk thread ini, belum dikirim.”
- “Catat bahwa kita menunggu tim penguji; jangan tutup ticket dulu.”
- “Siapkan handoff karena saya akan pindah sesi.”
- “Rapikan catatan sesi ini dan simpan progres lokal sesuai aturan repo.”

Agent tetap mengikuti aturan yang telah dimuat. Jika ada beberapa ticket aktif dan rujukan “ini” ambigu, sebut nama kasus atau slug agar tidak salah memperbarui catatan.

### Pembagian tugas

| Operator | Agent secara mandiri |
| --- | --- |
| Menyebut identitas, tujuan, dan sumber kasus | Membaca aturan, profil, journal, konteks aktif dan handoff terkait |
| Menambahkan informasi yang belum bisa diakses agent | Mencari kasus lama, menguji hipotesis, mencatat batas bukti |
| Mereview hasil dan memutuskan pilihan yang berdampak | Memperbarui ticket, journal, dashboard, handoff dan tautan balik |
| Memberi instruksi aksi keluar yang spesifik | Menjalankan `sync-used-by`, validasi dan commit lokal sesuai aturan |
| Memverifikasi klaim sebelum menaikkan confidence | Menghasilkan draft knowledge berstatus unverified dengan sumber |

Pekerjaan mandiri ini terjadi dalam sesi ketika agent dijalankan dan memiliki tool yang dibutuhkan. Hub bukan layanan yang otomatis bekerja di latar belakang ketika tidak ada sesi agent aktif.

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

### Prompt operator — Kenali konteks tanpa menghafal folder

```text
Saya operator-demo. Jelaskan pekerjaan aktif saya dari hub:
apa status terakhir, blocker, dan tiga prioritas berikutnya?
Tautkan ke catatan sumber dan bedakan data yang sudah basi.
Jangan mengubah status hanya untuk merapikan daftar.
```

**Yang dikerjakan agent:** Agent membaca konteks operator, menemukan sumber yang relevan, dan menyajikan ringkasan. Peta folder di bawah adalah referensi agar Anda dapat mengenali hasilnya.

### Yang perlu dipahami operator

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

### Prompt operator — Setup pertama melalui agent

```text
Saya operator-demo, baru memakai Relay Hub. Folder hub ada di
LOKASI_HUB. Siapkan lingkungan sesuai aturan repo, periksa
kesiapannya, dan buat profil saya jika belum ada. Role saya ROLE;
area kerja saya AREA; preferensi saya PREFERENSI. Kerjakan setup
lokal yang diperlukan dan tampilkan ringkasan hasil serta blocker.
Jangan push atau mengubah konfigurasi layanan eksternal.
```

**Yang dikerjakan agent:** Agent memeriksa repo dan worktree, memilih branch yang benar, menyiapkan hook dan skill sesuai aturan, memeriksa kesehatan lingkungan, lalu membuat atau memperbarui profil. Agent tidak meminta operator menyalin command terminal.

### Yang perlu dipahami operator

Prasyarat: Git, Python 3.9+, akses repository hub, dan izin menjalankan setup lokal. Python tooling hub menggunakan standard library; tidak perlu memasang dependensi pip untuk `hub.py`.

Berikan lokasi clone yang sudah ada atau remote resmi dari maintainer kepada agent. Agent menggunakan data aktual tersebut saat setup.

Agent menjalankan langkah teknis terkait secara mandiri; perintahnya tersedia di lampiran opsional.

Agent mendeteksi branch default dari remote, memeriksa perubahan sesi lain, lalu memperbarui branch utama ketika working tree bersih sebelum membuat topic branch.

Agent menjalankan langkah teknis terkait secara mandiri; perintahnya tersedia di lampiran opsional.

`setup.sh` memasang hook validasi. `install` membuat symlink skill dan dapat memindahkan salinan lama ke backup; review dry-run terlebih dahulu. Agent juga memeriksa lokasi hub dan identitas operator pada lingkungan aktif; kebutuhan konfigurasi persisten mengikuti aturan setup lokal.

Sebutkan handle sendiri dalam prompt. Identitas harus dinyatakan operator, bukan ditebak dari git config, email, atau perangkat bersama.

Jika profil belum ada:

Agent menjalankan langkah teknis terkait secara mandiri; perintahnya tersedia di lampiran opsional.

Sampaikan role, area tanggung jawab, dan preferensi; agent memasukkannya ke profil. `export` menghasilkan berkas diskusi dari profil dan konteks aktif; jangan mengedit output generated secara langsung.

**Checkpoint:** `doctor` tidak menunjukkan GAGAL. Pahami setiap peringatan sebelum lanjut; output sukses bukan jaminan akses MCP atau layanan pihak ketiga tersedia.

## Mulai Sesi dan Rencanakan Hari
Duration: 6

### Prompt operator — Mulai hari kerja

```text
Saya operator-demo. Mulai sesi hari ini dari konteks hub saya.
Lihat pekerjaan aktif dan handoff terkait, lanjutkan journal yang
sudah ada atau buat bila belum ada. Susun prioritas berdasarkan
blocker dan langkah berikut. Kerjakan dulu yang tidak membutuhkan
jawaban saya, lalu laporkan keputusan yang perlu saya ambil.
```

**Yang dikerjakan agent:** Agent memuat konteks, menjaga journal tidak duplikat, dan menyiapkan rencana. Jika operator belum menyebut identitas, agent bertanya; jika sudah, agent tidak perlu menanyakannya kembali.

### Yang perlu dipahami operator

Urutan baca agent:

1. Konfirmasi identitas operator.
2. Baca `AGENTS.md`, lalu `memory/_hot.md`.
3. Jalankan daftar handoff; buka hanya pekerjaan yang ditugaskan.
4. Baca profil dan journal terakhir operator.

Agent menjalankan langkah teknis terkait secara mandiri; perintahnya tersedia di lampiran opsional.

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

### Prompt operator — Tangani laporan baru

```text
Saya operator-demo. Ada laporan timeout ekspor di LINK_THREAD.
Repo aplikasi: LOKASI_REPO. Cari kasus, runbook, dan knowledge yang
relevan di hub sebelum investigasi. Gunakan skill yang sesuai,
catat bukti serta hipotesis, lalu siapkan perbaikan lokal dan
verifikasi yang relevan bila memungkinkan. Perbarui ticket dan
status aktif. Beri saya temuan, batas bukti, dan langkah berikut;
siapkan draft balasan tanpa mengirimnya.
```

**Yang dikerjakan agent:** Agent membaca sumber yang dapat diakses, mencari konteks lama, membuat atau melanjutkan ticket aktual, dan memelihara dashboard. Jika thread tidak dapat dibaca, agent meminta isi relevan atau akses yang diizinkan; agent tetap melanjutkan pemeriksaan independen yang tersedia.

### Yang perlu dipahami operator

Ilustrasi: sebuah proses ekspor mengalami timeout. Ini gejala latihan, bukan insiden aktual. Mulai dengan pencarian:

Agent menjalankan langkah teknis terkait secara mandiri; perintahnya tersedia di lampiran opsional.

Baca hasil relevan, confidence, sumber, dan tanggal verifikasinya. Hasil pencarian adalah petunjuk; kemiripan gejala tidak membuktikan root cause sama. Beri tahu operator hasil mana yang dipakai dan apa yang perlu dicek ulang.

Untuk laporan aktual baru, buat entry dari template:

Agent menjalankan langkah teknis terkait secara mandiri; perintahnya tersedia di lampiran opsional.

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

### Prompt operator — Update ketika menunggu pihak lain

```text
Kasus timeout ekspor sekarang menunggu hasil uji dari tim penguji.
Catat sebagai pending, tulis siapa yang ditunggu dan bukti yang
masih dibutuhkan. Perbarui catatan terkait secara konsisten.
Buat draft follow-up singkat dari konteks thread terbaru;
jangan kirim dan jangan mengklaim kasus sudah resolved.
```

**Yang dikerjakan agent:** Agent memperbarui tahap berdasarkan informasi aktual dan menyiapkan draft. Jika skill memerlukan konfirmasi status papan eksternal yang tidak dapat diakses, agent meminta konfirmasi itu secara spesifik.

### Yang perlu dipahami operator

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

Agent memeriksa sintaks tool sebelum memindahkan stage:

Agent menjalankan langkah teknis terkait secara mandiri; perintahnya tersedia di lampiran opsional.

Jangan mengklaim perubahan kolom tool eksternal sudah dilakukan bila agent hanya mengubah frontmatter lokal. Konfirmasi status eksternal kepada operator jika aksesnya tidak tersedia.

Draft follow-up yang berguna menjawab: apa yang berubah, siapa pemilik aksi berikut, dan bukti apa yang masih dibutuhkan. Ringkasan untuk reviewer menampilkan masalah, status, rekomendasi, dan blocker lebih dulu; detail log serta kronologi dapat ditautkan.

Agent menampilkan draft pesan terlebih dahulu. Kata “lanjut” atau “oke” bukan izin mengirim; diperlukan instruksi kirim untuk pesan tersebut. Pesan yang dikirim agent atas nama operator membawa penanda terlihat `sent by AGENT (AI)`. Deploy, restart, scale, konfigurasi, dan perubahan database membutuhkan konfirmasi spesifik.

## Tutup Kasus dan Bangun Trusted Memory
Duration: 8

### Prompt operator — Tutup setelah ada verifikasi

```text
Hasil verifikasi dari PIHAK_VERIFIKASI di SUMBER_VERIFIKASI
menyatakan kasus timeout ekspor selesai. Tutup ticket berdasarkan
bukti tersebut. Lengkapi resolusi, rujukan yang benar-benar dipakai,
dan pelajaran yang dapat diulang; rapikan dashboard dan journal.
Sinkronkan referensi dan validasi sendiri. Jika layak jadi knowledge
atau runbook, ajukan draft untuk review; jangan menaikkan confidence
atau mengarang hasil pengujian.
```

**Yang dikerjakan agent:** **Agent menjalankan `sync-used-by` dan `hub.py check` sendiri.** Operator tidak perlu mengingat atau meminta command tersebut satu per satu. Jika bukti baru menyatakan implementasi selesai, agent mencatat tahap yang sesuai dan tidak menutup ticket sebagai resolved.

### Yang perlu dipahami operator

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

Agent menjalankan langkah teknis terkait secara mandiri; perintahnya tersedia di lampiran opsional.

`sync-used-by` menyelaraskan back-reference runbook/knowledge dari bagian rujukan ticket. Review diff karena command dapat memperbarui lebih dari satu file.

Knowledge baru dibuat dari template:

Agent menjalankan langkah teknis terkait secara mandiri; perintahnya tersedia di lampiran opsional.

Untuk tulisan agent, mulai dengan `confidence: unverified`, `last_verified: null`, dan sumber yang dapat diikuti. Gunakan sumber permanen yang diizinkan, seperti path kode atau dokumen; handoff sementara bukan sumber knowledge. Hanya manusia yang menaikkan confidence sesudah memeriksa klaim terhadap sumbernya.

Jangan menandai verified karena test lolos saja. Jika prosedur berulang layak menjadi runbook atau skill, ajukan promosi lewat PR untuk review manusia.

## Handoff yang Bisa Dilanjutkan
Duration: 8

### Prompt operator — Berhenti atau ganti agent

```text
Saya akan pindah sesi. Siapkan handoff untuk kasus timeout ekspor:
simpan hasil aktual, branch dan commit, batas bukti, tool yang wajib
tersedia, larangan, serta langkah berikut yang konkret. Perbarui
ticket dan journal agar agent lain dapat melanjutkan tanpa briefing
ulang. Beri saya slug handoff dan prompt siap tempel untuk sesi baru.
```

**Yang dikerjakan agent:** Agent membuat handoff di awal pekerjaan panjang, memperbaruinya setiap langkah bermakna, dan menyiapkannya sebelum berhenti. Operator tidak perlu mengelola file handoff secara manual.

### Yang perlu dipahami operator

Buat handoff di awal pekerjaan panjang atau ketika berisiko terputus:

Agent menjalankan langkah teknis terkait secara mandiri; perintahnya tersedia di lampiran opsional.

Isi tujuan, branch/repo kerja, kebutuhan tool di `requires:`, bukti yang sudah ada, bagian Sudah selesai, Langkah berikut, serta Jangan dilakukan. Gunakan task aktual; contoh ini tidak boleh menjadi catatan insiden fiktif di hub tim.

Setelah langkah bermakna:

Agent menjalankan langkah teknis terkait secara mandiri; perintahnya tersedia di lampiran opsional.

Perbarui isi checklist file juga; log singkat saja belum cukup. Sebelum berhenti, tulis command berikut yang perlu dijalankan dan batas bukti saat itu.

Agent penerima menjalankan `handoff show`, memeriksa `git status` dan `git log` pada branch yang dicatat, serta memastikan tool di `requires:` tersedia. Jika tool wajib tidak ada, berhenti dan laporkan; jangan menebak hasil. Bagian Jangan dilakukan tetap mengikat.

Jika tujuan benar-benar selesai:

Agent menjalankan langkah teknis terkait secara mandiri; perintahnya tersedia di lampiran opsional.

Close memindahkan ringkasan ke journal dan menghapus handoff. Simpan bukti permanen di ticket/project sebelum close. Jangan menutup atau mengubah handoff milik pekerjaan lain hanya untuk membersihkan daftar.

## Skill dan Artifact dalam Workflow
Duration: 8

### Prompt operator — Minta hasil yang siap direview

```text
Buat explainer kasus timeout ekspor untuk reviewer internal.
Gunakan skill yang sesuai dan periksa dependensinya sendiri.
Layar pertama harus menjelaskan masalah, bukti penyebab, status,
blocker, dan rekomendasi dengan pemilik aksi. Detail teknis boleh
diletakkan setelah ringkasan. Simpan sumber di hub, buka preview
lokal, dan siapkan draft balasan. Jangan publikasikan atau kirim.
```

**Yang dikerjakan agent:** Agent memilih skill yang relevan, menjalankan preflight, membuat sumber artifact beserta metadata, lalu memeriksa tampilan. Tool atau akses wajib yang hilang dilaporkan sebagai blocker; keberadaan skill tidak otomatis memberi akses layanan.

### Yang perlu dipahami operator

Skill adalah prosedur berversi yang dapat memerlukan CLI, environment, dan MCP tertentu. Tooling tidak otomatis menyediakan akses layanan.

Agent menjalankan langkah teknis terkait secara mandiri; perintahnya tersedia di lampiran opsional.

Ganti placeholder dengan nama dari registry. Baca SKILL.md dan lakukan Langkah 0. Pemeriksaan CLI/env dapat diotomatisasi; ketersediaan MCP yang dicetak tetap perlu diperiksa agent. Dependensi wajib hilang berarti laporkan blocker sebelum eksekusi.

Sumber skill bersama berada di `skills/`; symlink lokal menunjuk ke sana. Perubahan skill membutuhkan metadata versi/owner/requires, preflight, validasi, dan review. Hindari menimpa versi lokal yang lebih baru tanpa menelaah perbedaannya.

Untuk deliverable yang dapat dibuka ulang:

Agent menjalankan langkah teknis terkait secara mandiri; perintahnya tersedia di lampiran opsional.

Sumber dibuat di `artifacts/YYYY-MM-DD_export-review/` beserta `meta.yaml`. Isi HTML/Markdown dan metadata audience sesuai penerima. `publish` default mencetak lokasi lokal; itu belum berarti artifact sudah dipublikasikan di internet.

Review sumber dan tampilan, termasuk batas data yang boleh dibagikan. Publikasi eksternal hanya atas instruksi spesifik operator. Sesudah publikasi aktual, catat URL hasilnya dengan `publish SLUG --record URL_AKTUAL`. Jangan merekam URL ilustrasi sebagai publikasi nyata.

## Git, Review, dan Penutupan Sesi
Duration: 8

### Prompt operator — Simpan progres dan akhiri sesi

```text
Tutup sesi ini dengan rapi. Perbarui ticket, journal, dashboard,
dan handoff pekerjaan ini berdasarkan hasil aktual. Jalankan
validasi, tinjau diff, lalu simpan perubahan sesi ini dalam commit
lokal per topik sesuai aturan repo. Jangan menyentuh perubahan sesi
lain, push, atau merge. Laporkan hasil, blocker, dan titik lanjut.
```

**Yang dikerjakan agent:** Agent menangani branch, staging file spesifik, validasi, commit dan checklist wrapup. Operator cukup mereview hasil serta memberi instruksi khusus bila ingin melakukan aksi keluar.

### Yang perlu dipahami operator

Sebelum mengubah file, periksa branch dan perubahan sesi lain. Agent menggunakan branch `hub/HANDLE/SLUG`, menambahkan file sesi ini satu per satu, dan membuat commit kecil per tujuan. Jangan commit ke main/master, jangan memakai `git add .`, dan jangan melewati hook.

Agent menjalankan langkah teknis terkait secara mandiri; perintahnya tersedia di lampiran opsional.

Agent meninjau dan menambahkan file sesi ini dengan path eksplisit, lalu membuat commit Conventional Commits dengan trailer agent:

Agent menjalankan langkah teknis terkait secara mandiri; perintahnya tersedia di lampiran opsional.

Jika hook gagal, baca dan laporkan masalahnya; jangan gunakan `--no-verify`. Perubahan milik orang lain tidak ikut di-stage.

Push perlu instruksi eksplisit operator. Review memory bersama dan perubahan prosedur mengikuti aturan maintainer. Persetujuan draft isi belum otomatis mengizinkan kirim pesan atau ubah infrastruktur.

Sebelum merge yang telah diperintahkan: fetch, update target dengan fast-forward, sinkronkan topic branch terhadap target terbaru, lalu cek konflik. `git merge-tree --write-tree TARGET TOPIC` dapat dipakai sebagai pemeriksaan tanpa mengubah working tree. Laporkan hasilnya; konflik memerlukan keputusan penyelesaian. Jalankan validasi lagi setelah merge.

Jika perlu worktree, buat pada branch baru di folder parent repo; jangan menempati main/master di worktree tambahan. Cek daftar worktree dan jangan mengganggu sesi lain.

Pada penutupan sesi, agent menjalankan checklist wrapup:

Agent menjalankan langkah teknis terkait secara mandiri; perintahnya tersedia di lampiran opsional.

Wrapup bersifat read-only: daftar perubahan belum di-commit, commit belum di-push, branch tersisa, dan handoff basi. Output adalah checklist untuk ditinjau, bukan izin otomatis push atau hapus branch.

## Review Mingguan dan Troubleshooting
Duration: 7

### Prompt operator — Review mingguan tanpa terminal

```text
Saya operator-demo. Review aktivitas hub minggu ini: rangkum kasus
selesai, pekerjaan tersendat, knowledge basi, dan pola berulang.
Pilih maksimal dua usulan promosi menjadi runbook atau skill dan
jelaskan manfaatnya dengan bukti. Catat review aktual di journal,
perbarui item saya yang berubah, dan tampilkan keputusan yang
memerlukan review manusia. Jangan mengubah confidence sendiri.
```

**Yang dikerjakan agent:** Agent menjalankan laporan mingguan, kesegaran dan kesehatan hub, lalu merangkum hasil untuk operator. Masalah teknis ditangani agent dalam scope yang diizinkan; login atau akses manusia diminta hanya bila diperlukan.

### Yang perlu dipahami operator

Agent menjalankan langkah teknis terkait secara mandiri; perintahnya tersedia di lampiran opsional.

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

## Bank Prompt Lanjutan dan Latihan Akhir
Duration: 8

### Lanjutkan handoff di sesi baru

```text
Saya operator-demo. Lanjutkan handoff SLUG_HANDOFF dari hub di
LOKASI_HUB. Cocokkan handoff dengan branch, commit, dan working tree
aktual; periksa tool wajib dan ikuti bagian Jangan dilakukan.
Lanjutkan langkah yang sudah diotorisasi, perbarui bukti serta
handoff setiap progres bermakna, dan laporkan bila ada blocker baru.
```

### Minta status singkat di tengah pekerjaan

```text
Kasus timeout ekspor sudah sampai mana? Beri status terbaru,
apa yang berubah sejak update terakhir, bukti yang sudah ada,
siapa yang ditunggu, dan satu langkah berikut. Jangan memulai
ulang investigasi atau mengubah status hanya karena saya bertanya.
```

### Revisi draft tanpa mengulang investigasi

```text
Ringkas draft balasan kasus timeout ekspor menjadi tiga paragraf:
perubahan terbaru, batas bukti, dan permintaan aksi berikut.
Pertahankan fakta dan tanggal bukti. Jangan mengubah status ticket,
menjalankan ulang investigasi, atau mengirim pesan.
```

### Persetujuan yang jelas untuk satu pesan

```text
Kirim draft terakhir yang baru saya review ke LINK_THREAD.
Pertahankan isi yang disetujui dan penanda AI sesuai aturan hub.
Laporkan hasil pengirimannya.
```

Gunakan prompt kirim hanya setelah benar-benar mereview draft dan memastikan thread tujuannya benar. Persetujuan itu berlaku untuk pesan tersebut.

### Setelah menyetujui hasil branch

```text
Saya menyetujui perubahan pada BRANCH_TUTORIAL. Lakukan preflight
merge ke BRANCH_TARGET sesuai aturan repo: update dari remote,
sinkronkan branch, cek konflik dan validasi. Jika bersih, merge dan
push ke remote yang disepakati. Jika konflik atau check gagal,
berhenti dan laporkan tanpa melewati pemeriksaan.
```

Gunakan hanya jika aturan repository mengizinkan agent melakukan merge/push ke tujuan tersebut. Aturan hub privat dapat membatasi push ke main sehingga langkah akhir perlu dilakukan operator melalui antarmuka Git/PR. Agent harus menjelaskan batas yang benar-benar berlaku, bukan menganggap prompt menghapus seluruh aturan.

### Bila hasil belum sesuai

```text
Jangan minta saya menjalankan command rutin. Selesaikan sendiri
langkah teknis yang termasuk tugas ini dengan tool yang tersedia.
Jika terhalang, jelaskan tindakan yang gagal, penyebabnya, dan
bantuan minimum yang benar-benar perlu saya lakukan.
```

### Latihan melalui percakapan

Di clone latihan yang diizinkan, lakukan simulasi berikut tanpa menghubungi client atau layanan production:

1. Kirim prompt onboarding dengan identitas dan lokasi hub; review ringkasan kesiapan dari agent.
2. Minta agent mencari gejala sintetis dan menjelaskan perbedaan petunjuk dengan fakta terverifikasi.
3. Minta agent membuat catatan latihan yang jelas berlabel simulasi, beserta hipotesis dan batas bukti.
4. Kirim prompt handoff dan coba prompt lanjutkan pada sesi berikutnya.
5. Minta agent memvalidasi dan menyimpan perubahan lokal; review ringkasan hasil dan diff yang disajikan.
6. Review preview yang dibuka agent dan pastikan isi serta audience sudah tepat.

Anda siap menggunakan workflow ketika dapat menjawab:

- Siapa operator dan di mana konteks terbarunya?
- Apa bukti, hipotesis, blocker, dan pemilik langkah berikut?
- Mana yang permanen di ticket, dan mana yang sementara di handoff?
- Apakah knowledge sudah diverifikasi manusia?
- Aksi keluar mana yang masih membutuhkan instruksi eksplisit?

Panduan ini merangkum workflow yang diperiksa pada snapshot lokal 16 Oktober 2026. Pada clone hub Anda, `AGENTS.md`, template, `CONTRIBUTING.md`, dan bantuan `python3 scripts/hub.py --help` tetap menjadi acuan operasional. Tutorial tidak menggantikan aturan repository yang berkembang.

## Lampiran Opsional — Perintah yang Dijalankan Agent
Duration: 3

Bagian ini ditujukan untuk maintainer yang ingin memeriksa pelaksanaan teknis. **Operator tidak perlu mengetik perintah ini.** Agent memilih perintah yang relevan, mengganti placeholder dengan data aktual, dan mengikuti aturan repo. Perintah penulisan hanya dijalankan untuk tugas yang diminta; jangan mengeksekusi seluruh daftar sebagai satu script.

### Onboarding dan Pemeriksaan Lingkungan

```bash
git clone URL_REMOTE_HUB ~/projects/team-hub
cd ~/projects/team-hub
git status --short --branch
git worktree list
git remote show origin
```

### Onboarding dan Pemeriksaan Lingkungan

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

### Onboarding dan Pemeriksaan Lingkungan

```bash
python3 scripts/hub.py new person --person operator-demo
python3 scripts/hub.py export
python3 scripts/hub.py check
```

### Mulai Sesi dan Rencanakan Hari

```bash
python3 scripts/hub.py handoff list
python3 scripts/hub.py new journal --person operator-demo
```

### Cari Dulu, Baru Buat Tiket

```bash
python3 scripts/hub.py search "timeout ekspor"
python3 scripts/hub.py search "timeout" --type ticket,runbook,knowledge
python3 scripts/hub.py report stale
```

### Cari Dulu, Baru Buat Tiket

```bash
python3 scripts/hub.py new ticket export-timeout
```

### Investigasi, Status, dan Komunikasi

```bash
python3 scripts/hub.py stage --help
```

### Yang bisa dipakai ulang

```bash
python3 scripts/hub.py sync-used-by
python3 scripts/hub.py check
```

### Yang bisa dipakai ulang

```bash
python3 scripts/hub.py new knowledge export-timeout-observations
```

### Handoff yang Bisa Dilanjutkan

```bash
python3 scripts/hub.py handoff new export-timeout-review --task "Lanjutkan pemeriksaan timeout ekspor" --operator operator-demo
python3 scripts/hub.py handoff show export-timeout-review
```

### Handoff yang Bisa Dilanjutkan

```bash
python3 scripts/hub.py handoff update export-timeout-review --agent codex --stop-reason other --note "Catat hasil aktual dan titik lanjut di file handoff"
```

### Handoff yang Bisa Dilanjutkan

```bash
python3 scripts/hub.py handoff close export-timeout-review
```

### Skill dan Artifact dalam Workflow

```bash
python3 scripts/hub.py skills list
python3 scripts/hub.py preflight NAMA-SKILL
```

### Skill dan Artifact dalam Workflow

```bash
python3 scripts/hub.py new artifact export-review --person operator-demo
python3 scripts/hub.py publish export-review
```

### Git, Review, dan Penutupan Sesi

```bash
git status --short --branch
git diff --stat
python3 scripts/hub.py check
git diff --check
```

### Git, Review, dan Penutupan Sesi

```bash
git commit -m "docs(ticket): record export investigation" -m "Agent: codex"
```

### Git, Review, dan Penutupan Sesi

```bash
python3 scripts/hub.py wrapup
```

### Review Mingguan dan Troubleshooting

```bash
python3 scripts/hub.py report weekly
python3 scripts/hub.py report stale
python3 scripts/hub.py report health
```
