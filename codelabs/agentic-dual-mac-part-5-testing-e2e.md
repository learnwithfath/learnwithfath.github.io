summary: Part 5 dari seri Dual-Mac Agentic Workflow — autonomous mobile testing (Maestro + mobile-mcp self-healing loop), alur end-to-end membuat fitur Login OTP dari backend sampai mobile, plus checklist harian dan tips maintenance/thermal.
id: agentic-dual-mac-part-5-testing-e2e
categories: AI, Developer Tools, Mobile, Testing, macOS
tags: agentic-workflow, dual-mac, maestro, mobile-mcp, self-healing, e2e-testing, mcp, maintenance
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Dual-Mac Agentic Workflow — Part 5: Autonomous Testing & Alur End-to-End

## Outcome & Prasyarat
Duration: 5

Ini part penutup: kita menutup *loop* agentic sehingga agent bisa **melihat** hasil kerjanya dan memperbaiki diri, lalu menjalankan satu fitur nyata dari ujung ke ujung.

Di akhir part ini:
* Agent bisa menjalankan uji UI mandiri dan memperbaiki kegagalan tanpa Anda menyetir tiap langkah.
* Anda pernah menjalankan satu fitur lengkap (Login OTP) backend→mobile→test→device.
* Anda punya checklist harian dan tahu cara merawat setup.

**Prasyarat:** Part 2–4 selesai (server, remote, memory + harness).

## Kenapa Testing Perlu Perlakuan Khusus
Duration: 5

Kelemahan terbesar AI pada aplikasi mobile: **ia tidak bisa melihat hasil render UI**. Ia menulis kode UI "buta", lalu tidak tahu apakah tombolnya benar-benar muncul. Dua alat menutup celah ini:

* **Maestro** — uji UI deklaratif berbasis YAML. Mudah ditulis & dibaca AI, dan memberi sinyal lulus/gagal yang jelas.
* **mobile-mcp** — memberi agent akses ke *accessibility tree* aplikasi via Model Context Protocol, sehingga agent bisa "membaca" isi layar secara real-time.

Gabungan keduanya menghasilkan **self-healing loop**:

```
[AI Coding Agent] ──> [mobile-mcp] ──> [Android/iOS Accessibility Tree]
       │                                            │
       ▼                                            ▼
[Edit Code UI] ───> [Run Maestro YAML] ───> [Pass / Fail Assertion]
       ▲                                            │
       └────────────── [Self-Healing Loop] ─────────┘
```

## Langkah 1: Maestro CLI
Duration: 5

Di MacBook 2019 (compute node):

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
export PATH="$PATH:$HOME/.maestro/bin"
```

## Langkah 2: Skenario Flow Test
Duration: 6

**Kenapa YAML:** formatnya cukup sederhana sehingga agent bisa menulis dan mengubahnya sendiri, tapi cukup ekspresif untuk alur nyata. Buat `.maestro/auth_login_flow.yaml`:

```yaml
appId: com.example.myfullstackapp
---
- launchApp:
    clearState: true
- assertVisible: "Selamat Datang"
- tapOn: "Input Email"
- inputText: "developer@learnwithfath.com"
- tapOn: "Kirim OTP"
- assertVisible: "Masukkan Kode OTP"
- inputText: "123456"
- tapOn: "Verifikasi"
- assertVisible: "Dashboard Utama"
```

Uji lokal di server:
```bash
maestro test .maestro/auth_login_flow.yaml
```

## Langkah 3: mobile-mcp untuk Inspeksi UI
Duration: 6

**Kenapa MCP:** ini yang memberi agent "mata". Tanpa mobile-mcp, agent hanya menebak isi layar; dengan itu, ia bisa membaca elemen yang benar-benar ter-render.

Di MacBook 2019:
```bash
git clone https://github.com/lobehub/mobile-mcp.git ~/.tools/mobile-mcp
cd ~/.tools/mobile-mcp && npm install && npm run build
```

Daftarkan ke konfigurasi MCP client agent Anda:
```json
{
  "mcpServers": {
    "mobile": {
      "command": "node",
      "args": ["/Users/username/.tools/mobile-mcp/dist/index.js"]
    }
  }
}
```

## Langkah 4: Alur End-to-End — Fitur Login OTP
Duration: 15

Sekarang semua komponen bekerja bersama. Kita implementasikan **Login OTP** dari backend sampai mobile, memakai memori (Part 4), harness (Part 4), dan testing (part ini).

### Tahap 1 — Perencanaan & Kontrak
1. Dari M1, buka sesi agent lewat Remote-SSH ke 2019.
2. Instruksi ke agent:
   > *"Kita membuat fitur Login OTP. Pertama, buat kontrak API di `.knowledge/contracts/otp-auth.md` dan catat keputusan di `.knowledge/adr/ADR-003-otp.md`."*
3. Agent menyusun skema request/response dan alur verifikasi token — **kontrak dulu, kode kemudian**.

### Tahap 2 — Backend (task berat di 32 GB)
1. Backend subagent membuat endpoint `/api/v1/auth/request-otp` dan `/api/v1/auth/verify-otp`.
2. Test di container Docker (yang jalan di 2019):
   ```bash
   docker compose exec backend go test ./internal/auth/...
   ```

### Tahap 3 — Mobile Client
1. Mobile subagent membaca `.knowledge/contracts/otp-auth.md` (sinkron karena contract-first).
2. Membuat screen OTP + state management (Flutter/RN/Compose).
3. Build incremental.

### Tahap 4 — Autonomous Testing & Self-Healing
1. Agent menjalankan E2E di emulator 2019:
   ```bash
   maestro test .maestro/auth_login_flow.yaml
   ```
2. **Skenario error**: tombol punya id `btn_submit`, tapi Maestro mencari teks `"Verifikasi"`.
3. Test gagal → agent membaca log → memperbaiki identifier di kode UI → menjalankan ulang `maestro test`.
4. Assertion **PASS** — tanpa Anda menyetir tiap langkah.

### Tahap 5 — Verifikasi di HP Fisik
Tanpa emulator berat di M1, pasang APK ke HP yang tercolok di M1:
```bash
adb install -r build/app/outputs/flutter-apk/app-debug.apk
```
Verifikasi animasi & haptic di perangkat asli.

Positive
: Perhatikan bagaimana kelima part menyatu: konsep (P1) → infrastruktur (P2–P3) → memori & harness (P4) → loop mandiri (P5). Fitur mengalir tanpa Anda memindahkan file atau menunggu build memberati M1.

## Maintenance & Checklist Harian
Duration: 5

### Rutinitas memulai kerja

| No | Aktivitas | Device | Command / Cara |
| :--- | :--- | :--- | :--- |
| 1 | Wake server | Intel 2019 | Pastikan charger terpasang & Amphetamine aktif |
| 2 | Verifikasi Tailscale | M1 | `tailscale ping mac-server` |
| 3 | Jalankan backend stack | Intel 2019 | `ssh mac-server "cd ~/projects/app && docker compose up -d"` |
| 4 | Buka remote editor | M1 | Remote-SSH ke mac-server |
| 5 | Update peta Graphify | Intel 2019 | `/graphify . --update` setelah merge branch baru |

### Tips efisiensi & thermal

Positive
: **Thermal 2019:** pakai *vertical laptop stand* aluminium agar sirkulasi udara di bawah bodi tetap baik saat komputasi berat berjalan seharian.

Negative
: **Jangan Docker + emulator di M1 8 GB.** Menjalankan keduanya bersamaan di M1 memicu swap SSD puluhan GB. Biarkan M1 murni sebagai *thin client*.

## Ringkasan Seri
Duration: 3

Selamat — Anda telah membangun **Agentic Workflow Dual-Mac** yang utuh:

* ✅ **Utilisasi optimal 2 Mac** — M1 (8 GB) dingin & responsif sebagai driver; 2019 (32 GB) menangani Docker, emulator, dan multi-agent swarm.
* ✅ **Zero-config mesh network** — SSH aman dari mana saja via Tailscale.
* ✅ **Shared memory** — kolaborasi antar-agen rapi dengan Graphify (AST) + Obsidian (ADR/wiki).
* ✅ **Agent harness modern** — Pi, Antigravity, dan Claude Code dengan efisiensi token.
* ✅ **Autonomous verification loop** — uji UI mandiri dengan Maestro + mobile-mcp.

Kembali ke part mana pun untuk mendalami: [Part 1 Konsep](agentic-workflow-dual-mac-setup/) · [Part 2 Provisioning](agentic-dual-mac-part-2-provisioning/) · [Part 3 Jaringan & Remote](agentic-dual-mac-part-3-jaringan-remote/) · [Part 4 Memory & Harness](agentic-dual-mac-part-4-memory-harness/).
