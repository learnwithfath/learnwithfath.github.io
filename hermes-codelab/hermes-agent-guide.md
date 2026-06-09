author: Antigravity
summary: Panduan Lengkap Hermes Agent dan Berbagai Macam Use Casenya
id: hermes-agent-guide
categories: AI, Automation, Agents
environments: Web
status: Published
feedback link: https://github.com/NousResearch/hermes-agent

# Panduan Lengkap Hermes Agent & Use Casenya

## Pendahuluan
Duration: 5

Selamat datang di Codelab Hermes Agent! Pada codelab ini, Anda akan mempelajari tentang Hermes Agent, agen AI *open-source* buatan Nous Research, serta bagaimana agen ini dapat diintegrasikan dan digunakan di berbagai *use case* dunia nyata.

### Apa itu Hermes Agent?
Hermes Agent bukanlah sekadar *coding copilot* yang terikat pada IDE tertentu atau *chatbot wrapper* sederhana. Hermes adalah agen otonom yang:
- Hidup di server atau mesin lokal Anda.
- Mengingat apa yang dipelajarinya (*Persistent Memory*).
- Menjadi semakin cerdas dan mumpuni seiring berjalannya waktu.
- Memiliki *learning loop* yang secara otomatis membuat dan menyempurnakan *skill*-nya sendiri (dalam bentuk prosedur Markdown) dari pengalaman sebelumnya.

Agen ini dirancang untuk beroperasi dalam jangka panjang dan secara bertahap mempelajari proyek, terminologi industri, preferensi, dan alur kerja Anda.

### Yang akan Anda pelajari:
- Karakteristik utama Hermes Agent.
- Posibilitas dan skenario *use case* dari Hermes Agent.
- Konsep dasar instalasi dan integrasi.

---

## Fitur Unggulan Hermes Agent
Duration: 5

Sebelum kita membahas *use case*, mari kita pahami beberapa fitur inti yang menjadikan Hermes Agent unik dan berbeda dari asisten AI konvensional.

### 1. Lives Where You Do (Multi-Platform)
Alih-alih memaksa Anda menggunakan *dashboard* web terpisah, Hermes dapat diintegrasikan langsung ke tempat Anda bekerja dan berkomunikasi:
- Telegram
- Discord
- Slack
- WhatsApp
- Signal
- Email
- Command Line Interface (CLI)

Anda dapat memulai percakapan di satu platform dan melanjutkannya di platform lain karena *memory*-nya tersentralisasi.

### 2. Grows the Longer It Runs
Melalui memori yang persisten dan kemampuannya untuk meng-generate *skill* baru secara otomatis, Hermes mempelajari seluk-beluk proyek Anda dan tidak pernah lupa bagaimana cara menyelesaikan sebuah masalah yang pernah diselesaikannya di masa lalu.

### 3. Scheduled Automations
Mendukung *cron scheduling* secara *natural language*. Anda bisa meminta Hermes untuk menjalankan laporan, melakukan *backup*, atau membuat ringkasan singkat (*briefing*) harian secara otomatis tanpa intervensi manusia.

### 4. Real Sandboxing
Dukungan terhadap isolasi *environment* sangat baik. Hermes dapat menjalankan kode dalam:
- Local
- Docker
- SSH
- Singularity
- Modal

### 5. Full Web & Browser Control
Mendukung pencarian web, otomatisasi browser, visi, pembuatan gambar, *text-to-speech*, dan penalaran *multi-model* menggunakan berbagai LLM.

---

## Use Case 1: Asisten Otonom Personal & Profesional (Always-On Assistant)
Duration: 10

Berkat kemampuannya berjalan di server secara persisten dan terhubung dengan berbagai aplikasi *messaging*, Hermes Agent adalah asisten selalu-aktif (*always-on*) yang sempurna.

### Skenario Penggunaan:
1. **Developer Support:** Anda dapat me-mention Hermes di grup Telegram/Slack tim Anda untuk meminta analisis *log error* yang dikirimkan oleh sistem *monitoring*.
2. **Contextual Recall:** Karena Hermes memiliki memori persisten, Anda tidak perlu lagi menjelaskan konteks berulang-ulang. Anda cukup berkata, *"Hermes, tolong buatkan ringkasan proyek X berdasarkan diskusi kita minggu lalu"*.
3. **Daily Executive Briefing:** Anda dapat menggunakan fitur penjadwalan (cron) untuk meminta Hermes: *"Setiap jam 8 pagi, kirimkan saya ringkasan email terbaru dan jadwal hari ini via WhatsApp."*

### Kelebihan Utama:
Asisten biasa mereset konteksnya setiap kali sesi berakhir. Hermes menjaga *state* secara terus-menerus, membuatnya lebih mirip "karyawan digital" ketimbang "alat bantu sementara".

---

## Use Case 2: Otomatisasi Alur Kerja Khusus (Skill Development)
Duration: 10

Sifat unik dari Hermes adalah kemampuannya membangun *library* "skills". Saat Hermes memecahkan masalah yang kompleks, ia membuat catatan terstruktur mengenai prosedur tersebut.

### Skenario Penggunaan:
1. **Onboarding dan Dokumentasi:** Saat Anda mengajarkan cara men-*deploy* aplikasi ke infrastruktur spesifik perusahaan Anda, Hermes akan mencatat langkah-langkahnya. Di masa depan, anggota tim lain dapat meminta Hermes untuk melakukan *deployment* yang sama.
2. **Review Kode Otomatis:** Hermes dapat dikonfigurasi untuk menjalankan *code review* pada setiap *Pull Request* yang dibuka di repositori GitHub tim Anda, dengan mempertimbangkan pedoman (*guidelines*) spesifik perusahaan yang telah dipelajarinya sebelumnya.
3. **Data Pipeline Maintenance:** Jika terjadi anomali pada *pipeline* data yang sering rusak, Hermes dapat mengingat bagaimana memperbaiki masalah tersebut dari pengalaman (interaksi terminal) sebelumnya, dan Anda dapat memintanya melakukan perbaikan prosedur tanpa perlu panduan *step-by-step* lagi.

### Kelebihan Utama:
Peralihan dari *AI chat* sederhana menjadi agen eksekutor yang memfasilitasi otomatisasi yang benar-benar prosedural.

---

## Use Case 3: Advanced Task Execution & Multi-Agent Delegation
Duration: 10

Hermes Agent terintegrasi dengan 40+ *built-in tools* yang memberinya kendali komprehensif atas ekosistem teknis. Lebih jauh lagi, untuk pekerjaan raksasa, ia dapat mendelegasikan tugas.

### Skenario Penggunaan:
1. **Pembuatan MVP atau Proyek Besar:** Saat Anda meminta Hermes untuk membuat sebuah *website* lengkap yang terintegrasi dengan *database*, Hermes dapat memecah dirinya menjadi beberapa "Sub-Agent" terisolasi.
   - Sub-agen 1: Mengerjakan desain dan CSS.
   - Sub-agen 2: Mengerjakan logika *backend*.
   - Sub-agen 3: Menyiapkan skema *database*.
   Masing-masing bekerja dengan *terminal* dan percakapannya sendiri tanpa menyita kapasitas memori satu sama lain.
   
2. **Eksekusi Serverless (Modal) dan Sandboxing:** Saat memproses file CSV atau dataset raksasa, Hermes dapat mengirim pekerjaan komputasinya secara instan ke *cloud backend* (seperti Modal) agar tidak membebani mesin lokal Anda.

3. **Integrasi MCP (Model Context Protocol):** Jika perusahaan Anda menggunakan *software* internal, Anda dapat menghubungkan API Anda melalui protokol MCP, memberikan Hermes kapabilitas ekstra untuk mengakses database privat dengan aman.

---

## Use Case 4: AI Research & Data Generation
Duration: 10

Arsitektur Hermes yang stabil dan modular membuatnya menjadi perangkat favorit di kalangan *AI Researcher* dan praktisi MLOps.

### Skenario Penggunaan:
1. **Pembuatan Synthetic Data:** Peneliti sering kali membutuhkan data pelatihan berupa *tool-calling trajectories* (langkah-langkah saat AI menggunakan *tool*). Hermes dapat diarahkan untuk menyelesaikan ribuan *task* di *environment* Docker yang terisolasi dan mengekspor hasilnya dalam format seperti *ShareGPT*. Hasil ini kemudian dapat digunakan untuk melatih atau melakukan *fine-tuning* pada model baru.
2. **Reinforcement Learning:** Ekspor percakapan dan riwayat pengambilan keputusannya sangat kompatibel dengan *pipeline reinforcement learning* modern (misalnya untuk melatih model via *Atropos*).

### Kelebihan Utama:
Mempercepat penemuan AI dan riset MLOps karena Hermes sudah mengatasi kerumitan *sandboxing*, *routing* LLM, dan manipulasi *tool*.

---

## Menginstal Hermes Agent
Duration: 5

Jika Anda tertarik untuk mencoba Hermes, instalasinya sangat sederhana. 

> **Catatan:** Anda membutuhkan *environment* berbasis Unix (macOS / Linux). Dukungan Windows sedang dalam pengembangan (atau via WSL).

### Langkah 1: Instalasi
Anda dapat menginstal Hermes menggunakan script resmi mereka dengan mengeksekusi perintah berikut di terminal Anda:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

### Langkah 2: Konfigurasi
Setelah berhasil terinstal, Anda dapat mengonfigurasi Hermes dan mendaftarkan kunci API (OpenRouter, OpenAI, dll) dengan perintah:

```bash
hermes setup
```

Hermes dapat menggunakan lebih dari 200 model LLM yang berbeda, sehingga Anda tidak terkunci pada satu *provider* saja (Vendor Agnostic). Anda bebas memakai model Claude, Gemini, Llama, atau model open-source lokal lainnya.

---

## Kesimpulan
Duration: 2

Selamat! Anda telah menyelesaikan codelab pengenalan Hermes Agent dari Nous Research.

### Rangkuman:
- **Hermes Agent** adalah asisten yang menetap dan terus belajar, tidak seperti chatbot sekali pakai.
- **Memiliki memori persisten** dan kemampuan *scheduling*.
- **Posibilitas Use Case sangat luas**: dari sekadar asisten grup Telegram, alat untuk *onboarding* tim, orkestrator agen (Multi-Agent), hingga generator data *machine learning*.
- Hermes terintegrasi langsung dengan tempat Anda bekerja melalui berbagai *backend* yang aman.

### Langkah Selanjutnya:
Cobalah untuk menginstal Hermes di server atau *local environment* Anda dan bereksperimenlah memintanya untuk membuat satu otomatisasi sederhana. 

Untuk referensi lebih lanjut, Anda dapat mengunjungi:
- [Hermes Agent Portal](https://portal.nousresearch.com/)
- [Hermes Agent GitHub](https://github.com/NousResearch/hermes-agent)

Terima kasih telah mengikuti Codelab ini!
