summary: Part 6 dari seri Maksimalkan Google AI Pro — bangun software nyata dari prompt. AI Studio Build (React + Node, ditenagai Antigravity Agent), generate app Android native (Kotlin + Jetpack Compose) dan deploy ke Cloud Run/GitHub, Gemini API + Managed Agents (Gemini 3.5 Flash), Gemini di Android Studio (Agent Mode, AGENTS.md, MCP), dan Antigravity untuk orkestrasi. Jalur fullstack/mobile menuju jual app & freelance dev.
id: google-ai-pro-part-6-bangun-software
categories: AI, Developer Tools, Mobile, Software Engineering
tags: ai-studio, gemini-api, android-studio, antigravity, jules, managed-agents, fullstack, mobile, freelance-dev
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Maksimalkan Google AI Pro — Part 6: Bangun Software

## Outcome & Kenapa Ini Jalur Bernilai Tinggi
Duration: 4

Setelah part ini Anda bisa:

* Membangun aplikasi web/mobile **dari sebuah prompt** dengan AI Studio Build.
* Men-*deploy* app ke produksi (Cloud Run / GitHub / ZIP).
* Memakai Gemini API + Managed Agents untuk fitur AI di app Anda.
* Mempercepat pengembangan Android dengan Gemini di Android Studio.
* Mengorkestrasi kerja dengan Antigravity.

**Kenapa ini jalur bernilai tinggi?** Membangun software adalah keahlian dengan bayaran tertinggi di daftar side job. AI Pro memberi batas lebih tinggi di semua tool developer Google — artinya Anda bisa membangun, menguji, dan merilis produk nyata (yang dijual atau dikerjakan untuk klien) jauh lebih cepat daripada sebelumnya.

Negative
: **Snapshot & keamanan.** Nama model dan fitur mengikuti dokumentasi resmi per 20 Agustus 2026 (mis. **Gemini 3.5 Flash** sebagai model frontier terbaru). Terapkan aturan data Part 1: jangan taruh kredensial/PII di prompt; simpan kunci API sebagai *server-side secret* (didukung otomatis di AI Studio).

## AI Studio Build: Dari Prompt ke Aplikasi
Duration: 10

**AI Studio Build mode** mengubah deskripsi bahasa biasa menjadi aplikasi yang bisa dijalankan, lengkap dengan *live preview*. Fitur cerdasnya **ditenagai Antigravity Agent** — ia menjaga konteks prompt & state file sebelumnya dan menangani dependensi lintas banyak file.

**Yang bisa dibuat:**

* **Web App (default)** — lingkungan *full-stack* dengan **frontend React** dan **runtime Node.js** sisi server, mendukung panggilan API aman dan paket npm.
* **Native Android App** — proyek **Kotlin + Jetpack Compose** dengan preview emulator di browser, instalasi ke perangkat, dan opsi publish ke Play Store.

**Kapabilitas pendukung:** integrasi **Firebase** (Firestore & Authentication), koneksi **Google Workspace API** dengan OAuth otomatis, dukungan multiplayer real-time, dan **manajemen secrets** untuk kunci API.

Positive
: Alur ideal: **deskripsikan app → iterasi lewat chat atau edit kode langsung → preview**. Anda tidak mulai dari halaman kosong. Untuk freelancer, ini memangkas waktu prototipe dari hari ke jam.

## Deploy: Cloud Run, GitHub, atau ZIP
Duration: 6

App tidak menghasilkan uang selama masih di editor. AI Studio menawarkan jalur rilis:

| Opsi | Untuk |
|---|---|
| **Cloud Run** | Deploy produksi yang skalabel, kunci API aman di sisi server |
| **GitHub Export** | Integrasi ke workflow dev yang sudah ada |
| **ZIP Download** | Hosting lokal / kontrol penuh, set env manual |

Positive
: Manfaatkan **US$10 kredit Cloud/bulan** dari Google Developer Program (diaktifkan di Part 1) untuk menutup biaya Cloud Run awal. Modal gratis untuk merilis MVP klien.

## Gemini API & Managed Agents
Duration: 6

Untuk menanam kecerdasan **ke dalam** app buatan Anda:

* **Gemini API** — panggil model (termasuk **Nano Banana Pro** untuk gambar) dari kode Anda; kunci dikonfigurasi otomatis sebagai secret sisi server.
* **Managed Agents** — model deployment baru: dengan **satu panggilan API**, Anda "menyalakan" agen yang bernalar, memakai tool, dan mengeksekusi kode di **lingkungan Linux terisolasi**, ditenagai **Gemini 3.5 Flash**. Anda tidak perlu menyiapkan infrastruktur/orkestrasi sendiri.

Positive
: Ini membuka produk AI-native yang bisa dijual: asisten khusus niche, alat otomasi, bot pemroses dokumen — tanpa Anda mengelola server agen. Nilai jual tinggi untuk klien yang butuh "fitur AI" tetapi tak punya tim.

## Gemini di Android Studio
Duration: 6

Untuk pengembangan Android serius, Gemini di Android Studio (batas lebih tinggi via AI Pro) memberi **Agent Mode** dan lebih banyak:

* **Agent Mode** — agen pengembangan otonom untuk Android.
* **Create a new project with AI** — buat proyek Android baru otomatis.
* **AGENTS.md** & **MCP server** — konfigurasi perilaku agen dan sambungkan tool eksternal.
* **Next Edit Prediction** — memprediksi perubahan berikutnya.
* **Generate Compose previews** & **UI dari gambar** — percepat pembuatan UI.
* **Analisis crash (App Quality Insights)**, **error Logcat**, dan **perbaikan build Gradle** otomatis.

Positive
: Kombinasi kuat: **prototipe di AI Studio (native Android) → ekspor → lanjutkan di Android Studio** dengan Agent Mode untuk fitur & polish tingkat produksi.

## Antigravity untuk Orkestrasi
Duration: 5

**Google Antigravity** adalah platform *agent-first* Google. Rilis **Antigravity 2.0** menghadirkan aplikasi Desktop (rumah interaksi agen), **Antigravity CLI**, dan **SDK**, dengan **subagent dinamis** untuk alur paralel. AI Studio Build bahkan bisa **ekspor langsung ke Antigravity** untuk pengembangan lokal.

Positive
: Kalau Anda ingin mendalami Antigravity secara menyeluruh (memilih surface, Desktop, IDE, CLI, SDK, governance), ikuti seri khusus di situs ini: [Ekosistem Google Antigravity](antigravity-ecosystem.html). Part ini cukup untuk tahu posisinya dalam alur "bangun software".

## Dari Skill ke Cuan
Duration: 4

Jalur monetisasi engineering (dirinci di Part 7):

* **Jual app / SaaS mikro** — bangun MVP cepat, rilis ke Play Store atau Cloud Run, jual langganan.
* **Freelance dev** — kerjakan MVP/prototipe klien; kecepatan Anda jadi keunggulan harga.
* **Fitur AI untuk bisnis** — integrasikan Gemini API/Managed Agents ke sistem klien.
* **Template & starter kit** — jual boilerplate app yang Anda hasilkan.

Negative
: **AI mempercepat, bukan menggantikan tanggung jawab teknik.** Kode buatan AI tetap harus Anda review: keamanan, penanganan error, dan performa. Klien membayar software yang **andal** — reputasi Anda ada pada verifikasi, bukan pada kecepatan generate.

## Verifikasi Pemahaman
Duration: 2

1. Apa yang bisa dibuat AI Studio Build (web & Android) dan agen apa yang menenagainya?
2. Sebutkan tiga opsi deploy dan kapan memakai masing-masing.
3. Apa itu Managed Agents dan model apa yang menenagainya?
4. Sebutkan tiga kapabilitas Agent Mode di Android Studio.

Positive
: **Lanjut ke Part 7 — Mesin Cuan & Tata Kelola**, tempat semua part disatukan menjadi peluang penghasilan konkret, lengkap dengan pricing, positioning, dan etika.

## Sumber
Duration: 1

* [Build apps in Google AI Studio — Gemini API docs (resmi)](https://ai.google.dev/gemini-api/docs/aistudio-build-mode)
* [Gemini in Android Studio — Android Developers (resmi)](https://developer.android.com/studio/gemini/overview)
* [I/O 2026 developer highlights — Google Blog](https://blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-developer-highlights/)
* [Seri: Ekosistem Google Antigravity (situs ini)](antigravity-ecosystem.html)
