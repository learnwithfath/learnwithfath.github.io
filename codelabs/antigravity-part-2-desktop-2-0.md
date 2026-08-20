summary: Part 2 dari seri Ekosistem Google Antigravity — Antigravity 2.0 Desktop. Instalasi, membuat Project dengan boundaries, Agent Manager, artifacts, conversations, slash commands, subagents paralel, scheduled tasks, dan kontrol browser.
id: antigravity-part-2-desktop-2-0
categories: AI, Developer Tools, Agentic Engineering, Google
tags: antigravity, google, gemini, desktop, agent-manager, subagents, scheduled-tasks, artifacts
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Ekosistem Google Antigravity — Part 2: Antigravity 2.0 (Desktop)

## Outcome & Prasyarat
Duration: 4

Di [Part 1](antigravity-part-1-konsep-ekosistem/) kita tetapkan: Desktop 2.0 adalah **orkestrator** — surface untuk menjalankan banyak agent paralel di banyak project. Sekarang kita pakai.

Di akhir part ini:
* Antigravity Desktop terpasang dan Anda login.
* Anda punya satu Project dengan boundaries yang benar.
* Anda menjalankan agent, membaca artifact, mendelegasikan subagent, dan menjadwalkan tugas.

**Prasyarat:** akun Google, OS didukung (macOS 12+ / Win10 64-bit / Linux glibc ≥ 2.28).

## Kenapa Mulai dari Desktop
Duration: 4

Desktop 2.0 adalah **rekomendasi default** untuk mayoritas kasus. Alasannya: ia memberi gambaran paling utuh tentang cara kerja agent Antigravity — Project, Agent Manager, dan Artifact — dalam GUI yang mudah dipantau. Setelah paham di sini, konsep yang sama tinggal Anda temui lagi di IDE, CLI, dan SDK.

Kekuatan utamanya: **paralelisme tanpa memblokir**. Anda bisa menyetel beberapa agent mengerjakan masalah berbeda sekaligus, memantau semuanya dari satu layar, dan menjadwalkan tugas yang jalan otomatis di background.

## Langkah 1: Instalasi & Login
Duration: 6

1. Buka [antigravity.google/download](https://antigravity.google/download) dan pilih OS + arsitektur yang sesuai.
2. Jalankan installer. Saat diminta mengganti instalasi lama, izinkan.
3. Login dengan **akun Google** melalui alur OAuth di browser.
4. Selesaikan setup wizard: terima *Security and Data Use policy*, pilih tema, dan (opsional) pasang plugin developer tool.

Positive
: Gunakan **Chrome sebagai browser default** agar alur autentikasi dan fitur kontrol browser (nanti di langkah slash command) berjalan mulus.

## Langkah 2: Membuat Project (Boundaries)
Duration: 6

**Kenapa Project penting:** agent hanya boleh menyentuh folder/repo di dalam Project-nya. Ini batas keamanan pertama Anda — agent tidak bisa mengembara ke folder lain di disk.

1. Dari sidebar, pilih **New Project**.
2. Tambahkan satu atau beberapa folder yang mendefinisikan cakupan, mis. `$HOME/agy2-projects/my-first-project`.
3. Pilih preset keamanan **Default** untuk mulai.
4. Beri nama Project lalu **Create**.

Saat menjalankan agent, Anda memilih mode:
* **Local** — agent bekerja langsung di folder project Anda.
* **New Worktree** — agent bekerja di *git worktree* terpisah, sehingga eksperimen tidak mengotori working tree utama (ideal untuk tugas paralel).

Negative
: Jangan memasukkan folder berisi secret produksi atau seluruh `$HOME` ke dalam Project. Batasi ke repo yang memang dikerjakan. Prinsip *least privilege* dibahas lebih dalam di Part 6.

## Langkah 3: Conversation & Artifact Pertama
Duration: 8

Sapa agent dengan sebuah pesan; ia merespons dengan konteks project Anda. Percakapan dikelompokkan per Project (rename via menu tiga titik).

Yang membuat Antigravity berbeda: agent menghasilkan **Artifact** sebagai bukti kerja, bukan sekadar jawaban:
* **Task list** — rencana langkah yang bisa Anda pantau.
* **Implementation plan** — desain sebelum kode ditulis.
* **Walkthrough** — penjelasan perubahan.
* **Code diff** — perubahan konkret untuk direview.

Positive
: Biasakan **membaca implementation plan sebelum menyetujui eksekusi**. Di sinilah Anda mengoreksi arah agent lebih awal — jauh lebih murah daripada membetulkan setelah kode ditulis.

Slash command penting (ketik `/`):
* `/goal` — menetapkan tujuan/target task.
* `/schedule` — menjadwalkan tugas berulang (lihat Langkah 5).
* `/browser` — memberi agent kontrol browser untuk verifikasi visual/otomasi web.
* `/grill-me` — agent menguji pemahaman/asumsi Anda sebelum mengeksekusi.

Pintasan: **⌘K / Ctrl+K** membuka pemilih percakapan; **⌘P / Ctrl+P** untuk pencarian file.

## Langkah 4: Subagent Paralel & Agent Manager
Duration: 8

Inilah fitur andalan 2.0. Alih-alih satu agent mengerjakan semuanya berurutan, **delegasikan tugas independen ke subagent** yang jalan paralel di background.

Pola yang sehat untuk fullstack:
* **Subagent Backend** — handler API, unit test, migration.
* **Subagent Mobile/Web** — UI, state, integrasi kontrak.
* **Subagent QA** — lint, build, test end-to-end.

**Agent Manager** menampilkan semua agent aktif & selesai beserta statusnya, sehingga Anda bisa memantau, menyetujui, atau menghentikan dari satu tempat.

Negative
: Subagent paralel **mengonsumsi kuota secara paralel** juga. Pada plan bermeteran, pantau penggunaan agar tidak menembus Weekly/Five-Hour limit (lihat Part 1).

## Langkah 5: Scheduled Tasks
Duration: 6

**Kenapa:** sebagian pekerjaan tidak perlu Anda picu manual. Jadwalkan agent menjalankannya otomatis.

Lewat `/schedule` atau antarmuka Schedule, definisikan prompt + waktu untuk tugas berulang, contohnya:
* Cek kualitas kode / lint mingguan.
* Deteksi dependency usang dan buka draft PR pembaruan.
* Ringkas perubahan repo tiap pagi.

Positive
: Kombinasi **scheduled tasks + subagent** membuat Desktop 2.0 berfungsi seperti "tim agent" yang bekerja bahkan saat Anda tidak menatap layar.

## Verifikasi
Duration: 2

- [ ] Antigravity Desktop terpasang & login berhasil.
- [ ] Ada satu Project dengan boundaries folder yang benar.
- [ ] Anda menjalankan agent dan membaca minimal satu **implementation plan** sebelum menyetujuinya.
- [ ] Anda mendelegasikan minimal satu **subagent** dan memantaunya di Agent Manager.
- [ ] Anda membuat satu **scheduled task**.

Positive
: **Lanjut ke Part 3 — Antigravity IDE**, saat Anda butuh melihat dan menyetujui perubahan kode baris demi baris.

## Sumber
Duration: 1

* [Antigravity Docs — Getting Started & Features](https://antigravity.google/docs)
* [Getting Started codelab (Google)](https://codelabs.developers.google.com/getting-started-google-antigravity)
