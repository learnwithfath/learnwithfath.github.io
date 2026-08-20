summary: Part 3 dari seri Ekosistem Google Antigravity — Antigravity IDE. Editor agentik dengan agent panel, review kode baris demi baris, artifacts, kontrol browser, debugging dengan one-click fix, dan kapan memilih IDE dibanding Desktop 2.0.
id: antigravity-part-3-ide
categories: AI, Developer Tools, Agentic Engineering, Google
tags: antigravity, google, gemini, ide, code-review, artifacts, browser-control, debugging
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Ekosistem Google Antigravity — Part 3: Antigravity IDE

## Outcome & Prasyarat
Duration: 4

Desktop 2.0 ([Part 2](antigravity-part-2-desktop-2-0/)) hebat untuk orkestrasi, tetapi memberi Anda *ringkasan* perubahan. **IDE memberi kontrol penuh: Anda melihat persis kode yang diedit agent dan menyetujuinya baris demi baris.**

Di akhir part ini:
* Antigravity IDE terpasang dengan agent panel.
* Anda menjalankan agent di dalam workspace dan mereview diff secara granular.
* Anda memakai debugging + one-click fix dan kontrol browser dari editor.

**Prasyarat:** [Part 1](antigravity-part-1-konsep-ekosistem/) dipahami. IDE bisa dipasang berdampingan dengan Desktop 2.0.

## Kenapa IDE, Bukan Desktop
Duration: 5

Keduanya memakai agent harness yang sama; bedanya **tingkat visibilitas & kontrol**:

* **Desktop 2.0** — Anda mengelola banyak agent dari ketinggian. Cocok saat mempercayakan tugas dan memantau hasil.
* **IDE** — Anda berada di dalam kode. Cocok saat perubahan sensitif, Anda ingin *accept/reject* tiap baris, atau perlu debugging langsung.

Positive
: Aturan praktis: **makin berisiko/rumit perubahannya, makin Anda ingin IDE.** Untuk refactor besar yang aman didelegasikan, Desktop 2.0 lebih efisien.

## Langkah 1: Instalasi IDE
Duration: 5

Antigravity IDE diunduh **terpisah** dari aplikasi Desktop.

1. Buka [antigravity.google/download](https://antigravity.google/download) dan pilih **Antigravity IDE** untuk OS Anda.
2. Jalankan installer dan login dengan akun Google yang sama.
3. Buka folder project Anda — agent panel muncul di samping editor.

Positive
: Karena login dan harness sama, skill/plugin/rules yang Anda pasang berlaku juga di IDE. Tidak perlu setup ulang dari nol.

## Langkah 2: Menjalankan Agent di Workspace
Duration: 7

Agent di IDE beroperasi dalam **workspace yang sedang terbuka**. Beri tujuan lewat agent panel, mis. *"Tambahkan validasi email di form register dan tulis unit test-nya."*

Agent akan:
1. Menyusun **implementation plan** (artifact) — review dulu.
2. Mengedit file — perubahannya tampil sebagai diff di editor.
3. Menjalankan test bila diminta.

Sama seperti Desktop, artifact (task list, plan, walkthrough, diff) tetap menjadi bukti kerja. Bedanya, di IDE Anda melihatnya menyatu dengan kode.

## Langkah 3: Review Kode Baris demi Baris
Duration: 8

Inilah nilai utama IDE. Saat agent mengusulkan perubahan:

* **Lihat diff inline** — persis file dan baris yang tersentuh.
* **Accept / reject per baris atau per hunk** — Anda tidak harus menerima seluruh perubahan sekaligus.
* Tolak bagian yang salah, terima sisanya, lalu minta agent menyesuaikan.

Positive
: Kontrol granular ini mencegah "perubahan diam-diam" di luar scope — kekhawatiran umum saat agent mengedit banyak file. Anda tetap pemegang keputusan akhir tiap baris.

## Langkah 4: Debugging & One-Click Fix
Duration: 6

IDE menampilkan **error runtime** langsung di editor. Saat ada error:
1. Error muncul dengan konteksnya.
2. Agent mengusulkan perbaikan — sering tersedia **one-click fix**.
3. Terapkan, jalankan ulang, verifikasi.

Ini menutup loop *edit → run → lihat error → perbaiki* tanpa keluar dari editor.

## Langkah 5: Kontrol Browser & Artifacts
Duration: 6

Untuk pekerjaan web, IDE dapat mengendalikan browser agar agent **memverifikasi hasil render secara visual** — bukan menebak. Gabungkan dengan artifact *walkthrough* untuk mendapat penjelasan perubahan yang bisa Anda audit.

Positive
: Pola kuat untuk frontend: agent mengubah UI → mengendalikan browser untuk membuka halaman → membandingkan hasil dengan ekspektasi → melampirkan walkthrough. Anda mereview bukti visual, bukan asumsi.

## Langkah 6: Customizations di IDE
Duration: 4

Karena harness bersama, Anda bisa menyetel perilaku via **Settings → Customizations**: MCP servers, Skills, Rules, Plugins, dan Hooks. Semua ini dibahas tuntas di **Part 6** dan berlaku lintas surface — apa yang Anda atur di sini juga dipakai Desktop/CLI/SDK bila lokasinya global.

## Verifikasi
Duration: 2

- [ ] Antigravity IDE terpasang dan agent panel aktif.
- [ ] Anda menjalankan agent dan membaca implementation plan sebelum menerapkan.
- [ ] Anda melakukan **accept/reject per baris/hunk** pada satu perubahan.
- [ ] Anda memakai debugging/one-click fix pada satu error.
- [ ] (Web) Anda memverifikasi perubahan lewat kontrol browser.

Positive
: **Lanjut ke Part 4 — Antigravity CLI (`agy`)**, saat Anda ingin bekerja di terminal, headless, atau di CI/remote server.

## Sumber
Duration: 1

* [Antigravity Docs — IDE](https://antigravity.google/docs)
* [Choosing your surface — Google Cloud Blog](https://cloud.google.com/blog/topics/developers-practitioners/choosing-your-surface-antigravity-20-antigravity-cli-antigravity-ide-or-antigravity-sdk)
