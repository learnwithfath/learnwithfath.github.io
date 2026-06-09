summary: Cline AI Coding Agent - Tutorial Lengkap
id: cline-ai-coding-agent-tutorial
categories: AI, Developer Tools, VS Code, CLI
tags: cline, ai-coding, vscode, mcp, sdk, cli, open-source
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Cline AI Coding Agent - Tutorial Lengkap

## Overview
Duration: 2

### Apa itu Cline?

**Cline** (sebelumnya Claude Dev) adalah *autonomous AI coding agent* yang open-source dan dirancang untuk membantu developer dalam membangun aplikasi, memperbaiki bug, dan mengeksplorasi codebase. Tidak seperti sekadar autocomplete (seperti GitHub Copilot), Cline beroperasi secara mandiri (autonomous) dengan kemampuan:

- Membuat dan mengedit file
- Menjalankan command di terminal
- Mengotomatisasi interaksi browser untuk testing
- Menggunakan Model Context Protocol (MCP) untuk terhubung dengan tools kustom

Dipercaya oleh lebih dari **8 juta developer** di seluruh dunia dan memiliki **63k+ GitHub stars**, Cline memberikan pengalaman *pair-programming* yang luar biasa.

### Apa yang Akan Anda Pelajari

Dalam codelab komprehensif ini, Anda akan mempelajari cara menggunakan ekosistem Cline secara penuh, mulai dari instalasi hingga penggunaan tingkat lanjut:

1. Instalasi dan Setup Extension di VS Code
2. Konfigurasi API Provider (Anthropic, OpenAI, OpenRouter, dll)
3. Menggunakan **Plan Mode** dan **Act Mode**
4. Kemampuan editing file, menjalankan command, dan browser automation
5. Ekstensibilitas melalui **Model Context Protocol (MCP)**
6. Menggunakan **Cline CLI** untuk automation
7. Memanfaatkan **Cline SDK** untuk embed agent
8. Menggunakan fitur **SpecDriven** development
9. Menentukan *custom rules* (`.clinerules`)

Mari kita mulai perjalanan menjelajahi masa depan coding dengan AI!

## Prerequisites & Installation
Duration: 3

### Persiapan Sistem

Sebelum menggunakan Cline, pastikan sistem Anda memenuhi beberapa persyaratan berikut:

1. **Visual Studio Code (VS Code)**
   - Download dan install dari [code.visualstudio.com](https://code.visualstudio.com/)
   - Disarankan menggunakan versi terbaru

2. **Node.js (Opsional tapi direkomendasikan)**
   - Beberapa fitur lanjutan (seperti CLI dan MCP tools tertentu) membutuhkan Node.js.
   - Download dari [nodejs.org](https://nodejs.org/)

3. **Akun API Provider**
   - Cline membutuhkan akses ke model LLM. Anda membutuhkan API key dari salah satu provider:
   - **Anthropic** (Rekomendasi utama, sangat dioptimalkan untuk Claude 3.5 Sonnet)
   - **OpenAI** (Untuk model GPT-4o, dll)
   - **OpenRouter** (Untuk akses ke ratusan model berbeda)
   - **Google Gemini**
   - **Ollama** (Untuk menjalankan model secara lokal secara gratis)

### Instalasi Cline di VS Code

Instalasi extension sangatlah mudah:

1. Buka **Visual Studio Code**
2. Pergi ke tab **Extensions** (`Ctrl+Shift+X` atau `Cmd+Shift+X` di Mac)
3. Cari **"Cline"** di kolom pencarian
4. Pilih extension yang dipublish oleh **Cline Bot Inc.**
5. Klik **Install**

Atau, jika Anda ingin menginstalnya via command palette (`Ctrl+P` / `Cmd+P`):

```bash
ext install saoudrizwan.claude-dev
```

Setelah terinstal, Anda akan melihat icon Cline (robot) di *Activity Bar* sebelah kiri (atau kanan, tergantung pengaturan Anda). Klik icon tersebut untuk membuka panel Cline.

## Konfigurasi API Provider
Duration: 5

Setelah panel Cline terbuka untuk pertama kalinya, hal pertama yang harus dilakukan adalah mengatur API Provider.

### Langkah-langkah Setup API Provider

1. Buka panel Cline
2. Klik tombol gerigi (⚙️) untuk masuk ke **Settings**
3. Pada bagian **API Provider**, pilih provider yang Anda miliki (contoh: Anthropic)
4. Masukkan **API Key** yang Anda dapatkan dari dashboard provider (misal: `https://console.anthropic.com/`)
5. Pilih model yang ingin digunakan. Untuk performa coding terbaik, pilih **Claude 3.5 Sonnet (New)**.

### Mengapa Pemilihan Model Penting?

Model AI memiliki kemampuan berbeda-beda:
- **Claude 3.5 Sonnet**: Merupakan _state-of-the-art_ untuk tugas-tugas coding dan merupakan model default/rekomendasi untuk Cline.
- **GPT-4o / Gemini 1.5 Pro**: Alternatif solid dengan kecepatan dan context window yang baik.
- **Ollama / Local Models**: Cocok jika data perusahaan sangat sensitif dan Anda tidak bisa menggunakan cloud API, namun Anda membutuhkan hardware (GPU) yang kuat.

positive
: Anda tidak terikat (no vendor lock-in). Anda bisa berpindah provider kapan saja melalui menu Settings, sehingga Anda selalu bisa menggunakan model terbaik yang tersedia di pasaran.

## Plan Mode & Act Mode
Duration: 5

Fitur unggulan Cline adalah pemisahan *mode operasi* menjadi **Plan Mode** dan **Act Mode**. Memahami perbedaan keduanya adalah kunci keberhasilan menggunakan Cline.

### Plan Mode (Arsitek)

**Plan Mode** ibarat Anda sedang berkonsultasi dengan seorang arsitek software. 

- **Tujuan**: Mengumpulkan informasi, membaca codebase, menganalisis struktur, dan membuat rencana implementasi.
- **Kemampuan**: Dapat membaca file, men-search keyword/regex dalam codebase, membaca struktur direktori.
- **Batasan**: **Tidak akan** mengubah source code, membuat file, atau menjalankan command terminal yang memodifikasi sistem.

Gunakan Plan Mode ketika Anda:
- Ingin memahami bagaimana suatu fitur saat ini bekerja
- Meminta saran refactoring
- Merancang arsitektur sebelum mulai menulis kode

### Act Mode (Developer)

**Act Mode** ibarat Anda memberi izin kepada developer untuk mulai bekerja dan mengubah codebase.

- **Tujuan**: Mengeksekusi rencana, menulis kode, membuat file, menginstal dependensi.
- **Kemampuan**: Menggunakan seluruh *tools* yang ada (Create/Edit file, Run Commands, Browser, dll).

Gunakan Act Mode ketika Anda:
- Ingin menambahkan fitur baru
- Menulis unit tests
- Memperbaiki bug (fixing errors)

positive
: **Alur Kerja Terbaik**: Mulailah dengan meminta Cline (di **Plan Mode**) untuk meninjau codebase Anda dan membuat rencana implementasi. Setelah Anda dan Cline sepakat, klik **Switch to Act Mode** agar Cline mengeksekusi rencana tersebut dengan akurat.

## File Editing & Creation
Duration: 5

Saat berada dalam **Act Mode**, Cline dapat melakukan perubahan pada file Anda secara otonom.

### Cara Kerja File Editing

Ketika Anda memberikan instruksi seperti *"Buat komponen Button di React dan gunakan TailwindCSS"*:

1. Cline akan memikirkan (reasoning) di mana lokasi file yang tepat
2. Cline akan menggunakan tools internal (`write_to_file` atau `replace_in_file`)
3. Anda akan melihat proposal perubahan di panel Cline!

### Diff View (Tinjauan Perubahan)

Ini adalah fitur keamanan utama Cline. **Setiap perubahan file harus mendapat persetujuan (approval) dari Anda**.

Ketika Cline ingin mengubah file, panel akan menampilkan **Diff View** (perbedaan antara file lama dan usulan file baru):
- Baris warna hijau: Kode yang ditambahkan
- Baris warna merah: Kode yang dihapus

Anda memiliki kontrol penuh:
- Klik **Accept** untuk mengizinkan perubahan
- Klik **Reject** untuk menolak dan memberikan feedback (misal: "Jangan gunakan flexbox, gunakan grid saja")

Gunakan instruksi yang spesifik untuk mempermudah:
> "Tolong refactor fungsi `calculateTotal` di `cart.js`. Pisahkan logic perhitungan pajak ke fungsi terpisah di `utils.js`"

## Terminal Command Execution
Duration: 4

Cline memiliki keunggulan yang tidak dimiliki banyak AI assistant lain: ia dapat menjalankan perintah (command) langsung di terminal Anda!

### Eksekusi Command secara Otonom

Jika Anda meminta: *"Install library axios dan tambahkan ke project ini"*, Cline akan:

1. Membuat proposal command: `npm install axios`
2. Menunggu persetujuan Anda
3. Menjalankan perintah tersebut di background terminal
4. **Membaca output terminal** untuk memastikan perintah berhasil atau menangani error jika gagal.

### Contoh Kasus Penggunaan:

1. **Menjalankan Linter / Tests**
   > "Tolong jalankan `npm run lint` dan perbaiki semua error yang muncul."
   
   Cline akan mengeksekusi linter, membaca output error, pergi ke file yang bermasalah, dan memperbaikinya.

2. **Memperbaiki Build Error**
   Jika terjadi build error, salin error tersebut ke prompt Cline dan minta ia memperbaikinya. Cline bahkan bisa menjalankan command build ulang untuk memverifikasi perbaikannya!

negative
: **Keamanan**: Cline SELALU meminta izin Anda (klik **Approve**) sebelum menjalankan terminal command apapun. Jangan pernah menyetujui perintah yang terlihat berbahaya atau tidak relevan dengan tugas.

## Browser Automation
Duration: 4

Cline tidak hanya bisa membaca file, tapi bisa membaca website secara langsung layaknya user!

### Cara Kerja Browser Automation

Cline menggunakan puppeteer/browser automation untuk:
- Membuka URL
- Mengambil screenshot
- Membaca console logs browser
- Mengklik elemen di halaman

### Contoh Penggunaan

1. **Mengecek UI Website Anda**
   Setelah Cline menulis kode HTML/CSS, Anda bisa meminta:
   > "Coba buka http://localhost:3000 dan lihat apakah tombol login sudah berada di pojok kanan atas."
   
   Cline akan membuka browser background, mengambil screenshot, menganalisis screenshot dengan kemampuan vision dari model (misal Claude 3.5 Sonnet), dan memperbaikinya jika salah.

2. **Membaca Dokumentasi API**
   > "Tolong baca dokumentasi di https://api.stripe.com/docs dan implementasikan payment gateway berdasarkan petunjuk terbaru."
   
   Cline akan mengunjungi halaman tersebut, membaca isi dokumentasinya, dan menulis kode berdasarkan informasi terbaru.

## MCP (Model Context Protocol)
Duration: 5

Ini adalah fitur _paling revolusioner_ di dalam Cline. **Model Context Protocol (MCP)** adalah standar open-source buatan Anthropic yang memungkinkan AI model mengakses data dan tools dari aplikasi eksternal dengan cara yang aman.

### Mengapa MCP Penting?

Secara default, Cline hanya tahu tentang file di project Anda. Dengan MCP, Anda bisa menambahkan "plugin" atau "skill" baru ke Cline, seperti:
- Menghubungkan Cline ke database Postgres lokal Anda
- Menghubungkan Cline ke Slack / GitHub / Jira
- Menghubungkan Cline ke Puppeteer/Browser

### Cara Menambahkan MCP Server

1. Buka panel Cline
2. Klik tab icon **Server/Plug** (MCP Servers)
3. Di sini Anda dapat melihat file konfigurasi `cline_mcp_settings.json`
4. Anda bisa menambahkan server baru. Contoh menambahkan server SQLite:

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "uvx",
      "args": [
        "mcp-server-sqlite",
        "--db-path",
        "/Users/username/my-database.db"
      ]
    }
  }
}
```

Setelah server aktif, Cline akan tiba-tiba memiliki 'tools' baru (seperti `read_query`, `execute_query`) dan Anda bisa memberinya prompt:
> "Tolong query database kita dan buat file laporan CSV dari daftar user yang mendaftar bulan ini."

## Install & Gunakan Cline CLI
Duration: 5

Jika Anda lebih menyukai lingkungan terminal dibandingkan GUI VS Code, Anda bisa menggunakan **Cline CLI**.

### Instalasi CLI

Buka terminal dan jalankan:

```bash
npm i -g @cline/cli
```

*(Catatan: pastikan Anda sudah menginstall Node.js)*

### Menggunakan CLI

Jalankan perintah ini di dalam direktori project Anda:

```bash
cline "Tolong buatkan script python untuk mengambil data harga saham dari Yahoo Finance"
```

Cline akan menampilkan output langsung di terminal Anda dengan format interaktif.

### Keuntungan menggunakan CLI:

1. **Kecepatan**: Sangat cepat jika Anda sedang berada di terminal (misal saat SSH ke server).
2. **Otomatisasi**: Anda dapat mengintegrasikan perintah Cline ke dalam skrip bash, pipeline CI/CD (GitHub Actions), atau cron jobs.

Contoh pipeline otomatisasi:
```bash
# Menjalankan Cline untuk meresolve error log
cline --task "Read error.log and apply fixes to src/app.js to resolve the crashes"
```

## Cline SDK (Embed Agent)
Duration: 5

Bagi Anda yang ingin membuat aplikasi AI sendiri, Cline kini menyediakan SDK agar Anda dapat me-_embed_ (menyematkan) kecerdasan Cline ke dalam produk Anda sendiri.

### Instalasi SDK

```bash
npm install @cline/sdk
```

### Konsep Dasar SDK

Dengan SDK, Anda mendapatkan seluruh *engine* agentic Cline (penggunaan tools, file system, reasoning loop) namun Anda memiliki kontrol atas antarmukanya.

Contoh sederhana penggunaan SDK dalam Node.js:

```javascript
import { ClineSDK } from '@cline/sdk';

async function runMyAgent() {
  const agent = new ClineSDK({
    provider: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY,
    workspaceDir: './my-project',
  });

  console.log("Memulai tugas...");
  
  // Memberikan instruksi ke agent
  await agent.executeTask("Buat file README.md yang bagus untuk folder ini");
  
  console.log("Tugas selesai!");
}

runMyAgent();
```

Fitur ini membuka peluang tak terbatas: Anda bisa membuat slack bot otomatis yang memperbaiki PR (Pull Request), atau portal internal kantor untuk auto-generating boilerplate code!

## SpecDriven Development
Duration: 4

**SpecDriven** adalah pendekatan inovatif yang didukung Cline di mana Anda menulis *Specification* (Spesifikasi/Dokumen Perencanaan) terlebih dahulu, lalu AI akan menghasilkan kode secara terukur.

### Masalah dengan Chat Bot Biasa

Chatbot konvensional (seperti ChatGPT) cenderung melupakan konteks seiring panjangnya percakapan, menghasilkan kode yang "menyimpang" dari instruksi awal.

### Solusi SpecDriven

1. **Buat file `.clinespec` (atau file Markdown biasa)**
   Tuliskan detail aplikasi secara mendalam (Arsitektur, UI, Database schema, Routing).
   
2. **Jalankan Cline dengan merujuk ke Spec**
   > "Implementasikan fitur Authentication berdasarkan dokumen `auth-spec.md`."

3. **Konsistensi**
   Cline akan secara reguler membaca ulang file spesifikasi tersebut untuk memastikan kodenya 100% selaras dengan permintaan Anda, menghasilkan project skala besar yang stabil dan tidak error.

## Custom Instructions & .clinerules
Duration: 4

Agar Cline dapat beradaptasi dengan gaya coding tim Anda, Anda bisa menggunakan **Custom Instructions**.

### Cara Mengatur Aturan Project

Buat file bernama `.clinerules` (atau `.cursorrules` karena Cline mendukung format tersebut) di root/folder utama project Anda.

Contoh isi `.clinerules`:

```markdown
# Front-End Rules
- Kami menggunakan React (Next.js App Router).
- Jangan gunakan CSS modules, selalu gunakan TailwindCSS.
- Setiap membuat komponen baru, pastikan diletakkan di `src/components/ui`.
- Tambahkan TypeScript interfaces untuk semua props.

# Testing
- Gunakan Jest dan React Testing Library.
- Cakupan test harus mencakup interaksi user dasar.
```

Setiap kali Anda memberikan task di project tersebut, Cline akan membaca file `.clinerules` terlebih dahulu dan mematuhi panduan tersebut saat menulis kode!

## Best Practices & Tips
Duration: 3

Untuk memaksimalkan Cline dan menjaga kreditan (cost) API Anda tetap hemat, ikuti tips berikut:

1. **Jelaskan Konteks, Bukan Hanya Perintah**
   ❌ "Buat tombol submit"
   ✅ "Buat tombol submit hijau di halaman cart.js yang akan memanggil fungsi prosesPayment() saat diklik"

2. **Pecah Tugas Besar**
   Jangan minta "Buat aplikasi e-commerce". Minta:
   - "Setup Next.js dan Tailwind"
   - "Buat halaman Home dengan dummy produk"
   - "Buat sistem cart menggunakan React Context"

3. **Gunakan Plan Mode**
   Biasakan menyuruh Cline merencanakan terlebih dahulu sebelum mengubah kode. Ini mengurangi bug dan revisi berulang yang memakan biaya token API.

4. **Waspadai Cost (Biaya)**
   Cline memberikan ringkasan penggunaan token dan biaya. Ingat bahwa memberikan konteks file yang teramat besar akan menghabiskan banyak token.

5. **Gunakan `--slim` mode (MCP)**
   Jika sistem berjalan lambat karena file sistem yang terlalu banyak, optimasi MCP atau gunakan file `.clineignore` untuk menyembunyikan folder berat (seperti `node_modules`).

## Next Steps & Resources
Duration: 1

### Selamat! 🎉

Anda telah menguasai Cline AI Coding Agent! Anda kini memiliki developer assistant canggih yang siap membantu di IDE, Terminal, dan dalam integrasi custom Anda.

### Sumber Belajar Lebih Lanjut

* **Website Resmi**: [https://cline.bot/](https://cline.bot/)
* **Dokumentasi Resmi**: [https://docs.cline.bot/](https://docs.cline.bot/)
* **GitHub Repository**: [https://github.com/cline/cline](https://github.com/cline/cline)
* **Discord Community**: Join Discord Cline (dapat ditemukan di website resmi) untuk bertanya dan berbagi MCP server baru.
* **MCP Marketplace**: Telusuri plugin/server MCP baru untuk menambah kemampuan Cline Anda.

Selamat coding dan berkolaborasi dengan AI Agent Anda! 🚀
