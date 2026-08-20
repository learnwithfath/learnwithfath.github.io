summary: Panduan lengkap dan komprehensif Homerow untuk macOS berdasarkan dokumentasi resmi — instalasi, Search Workflow, The Tutor, Labels-only mode, Scroll mode HJKL, Hyper Key mapping, dan tabel kontrol shortcut lengkap.
id: homerow-macos-keyboard-navigation
categories: macOS, Developer Tools, Productivity, Keyboard
tags: macos, homerow, keyboard-navigation, vim, accessibility, hyperkey, karabiner, productivity
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Homerow macOS: Panduan Lengkap Navigasi & Klik UI Tanpa Mouse

## Overview & Filosofi Homerow
Duration: 0:05:00

### Apa itu Homerow?

**Homerow** adalah aplikasi utilitas macOS yang memungkinkan Anda melakukan navigasi, scroll, dan mengklik elemen antarmuka grafis (GUI) di seluruh sistem operasi macOS murni menggunakan keyboard tanpa menyentuh mouse atau trackpad sama sekali.

Dibuat oleh *Dexter Leng*, Homerow terinspirasi langsung dari ekstensi browser legendaris seperti **Vimium** dan **Vimperator**, namun membawanya ke level sistem operasi—bekerja pada aplikasi native macOS (Finder, Xcode, System Settings, Notes, Mail) serta aplikasi modern berbasis Electron/Web (VS Code, Slack, Discord, Obsidian, Notion, Chrome, Arc, Safari, Firefox).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        HOMEROW WORKFLOW OVERVIEW                       │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Search Mode      : Ketik nama tombol -> Filter -> Shift+Label/Enter │
│ 2. Labels-Only Mode : Tampilkan label di semua elemen -> Ketik label   │
│ 3. Scroll Mode      : ⇧ ⌘ J -> Navigasi scroll area dengan HJKL        │
│ 4. Tutor Feature 🤓 : Tekan ? -> Tampilkan atribut searchable elemen   │
│ 5. Hyper Key        : Remap Caps Lock -> Navigasi ergonomis satu jari  │
└────────────────────────────────────────────────────────────────────────┘
```

### Persyaratan Sistem

* **OS Support**: macOS 12.3 ke atas (direkomendasikan macOS 13+).
* **Architecture**: Apple Silicon (M1/M2/M3/M4) dan Intel Mac.
* **Perizinan macOS**: Izin **Accessibility** (wajib) dan **Screen Recording** (opsional untuk akurasi rendering).

Positive
: Seluruh penjelasan, sintaks query, dan shortcut dalam tutorial ini diambil langsung dan diverifikasi berdasarkan repositori resmi [nchudleigh/homerow](https://github.com/nchudleigh/homerow) dan dokumentasi [homerow.app](https://homerow.app).

---

## Instalasi & Setup Perizinan macOS
Duration: 0:05:00

### Langkah 1: Mengunduh Homerow

Anda dapat menginstal Homerow melalui Homebrew Cask atau mengunduh installer resminya:

#### Opsi A: Menggunakan Homebrew (Direkomendasikan)
Buka terminal Anda dan jalankan:
```bash
brew install --cask homerow
```

#### Opsi B: Unduh Manual
Kunjungi halaman rilis resmi di [homerow.app/download](https://homerow.app/download/) dan unduh file `.zip` / `.dmg`.

### Langkah 2: Mengaktifkan Izin Aksesibilitas (Accessibility)

Homerow membaca struktur antarmuka tombol dan teks melalui macOS Accessibility API:

1. Buka **System Settings** > **Privacy & Security** > **Accessibility**.
2. Pastikan toggle untuk **Homerow** diaktifkan (`ON`).
3. Jika diminta, aktifkan juga izin **Screen Recording** pada menu **Privacy & Security > Screen Recording** agar Homerow dapat mendeteksi elemen pada layar multi-monitor dengan presisi.
4. Buka aplikasi Homerow dari folder Applications atau Spotlight.

---

## Search Workflow (Alur Kerja Pencarian & Seleksi)
Duration: 0:10:00

Search Workflow adalah alur kerja default Homerow. Mode ini sangat berguna ketika layar dipenuhi banyak tombol dan Anda ingin langsung menyaring elemen target berdasarkan namanya.

### 5 Langkah Alur Kerja Search Workflow

1. **Aktivasi Shortcut**: Tekan shortcut default:
   ```
   Command-Shift-Space (⌘ ⇧ Space)
   ```
2. **Ketik Nama Elemen UI**: Mulai mengetik teks dari tombol, link, menu, atau label yang ingin Anda klik (contoh: ketik `save`, `commit`, atau `cancel`).
3. **Identifikasi Label**: Label huruf kecil (*dynamic shortcuts*) akan muncul di atas elemen UI yang cocok dengan pencarian. Elemen dengan **target berwarna hijau** adalah elemen yang sedang aktif terfokus.
4. **Fokuskan Elemen yang Benar**: Ada dua cara untuk memindahkan fokus ke elemen target:
   * **Cara 1**: Tekan `Tab` atau `Arrow-Down` (atau `Control-N`) untuk maju, dan `Shift-Tab` atau `Arrow-Up` (atau `Control-P`) untuk mundur.
   * **Cara 2**: Ketik langsung teks label huruf tersebut **sambil menahan tombol `Shift`**.
5. **Eksekusi Klik**: Tekan **`Return` (Enter)** untuk melakukan klik pada elemen yang sedang terfokus.

```
[⌘ ⇧ Space] ──> [Ketik "Submit"] ──> [Shift + Label / Tab] ──> [Return (Click)]
```

### Modifier Tombol saat Eksekusi Klik

Saat elemen sudah terfokus, Anda dapat melakukan aksi klik dengan modifier khusus:

| Tombol Eksekusi | Aksi yang Dijalankan |
| :--- | :--- |
| **`Return`** | Klik kiri standar pada elemen terfokus |
| **`Shift-Return`** | Membuka link di tab baru (*Open Link in New Tab*) / Alternate Action |
| **`Command-Return`** | Command-click (⌘ + Click) pada elemen |
| **`Esc`** | Membatalkan dan keluar dari Homerow |

---

## Fitur The Tutor 🤓 & Sintaks Query
Duration: 0:08:00

### Aturan Sintaks Query

Pencarian di Homerow sangat fleksibel dan mematuhi aturan berikut:
1. **Case & Space Insensitive**: Spasi dan huruf besar/kecil diabaikan sepenuhnya (mengetik `newtab` sama dengan `New Tab`).
2. **Wildcard Operator (`*` dan `;`)**: Mengetik karakter bintang `*` atau titik-koma `;` akan menampilkan **seluruh elemen UI yang ada di layar** tanpa filter teks.

```
*  -> Tampilkan seluruh tombol & elemen yang dapat diklik di layar
;  -> Alternatif wildcard untuk menampilkan seluruh elemen
```

### Mengenal Fitur The Tutor 🤓

Sering kali kita tidak tahu pasti atribut atau teks apa yang dikenali sistem macOS pada sebuah ikon/tombol (misalnya ikon berbentuk gear mungkin bernama *Settings*, *Preferences*, atau *Options*).

**The Tutor** bertugas menampilkan seluruh properti *searchable* dari suatu elemen UI secara transparan:

```
┌─────────────────────────────────────────────────────────────┐
│                    CARA MEMANGGIL THE TUTOR                 │
├─────────────────────────────────────────────────────────────┤
│ 1. Melalui Keyboard : Tekan tombol "?" saat Homerow aktif   │
│                       (Tutor akan mengikuti elemen fokus)   │
│ 2. Melalui Mouse    : Arahkan kursor mouse ke atas elemen   │
└─────────────────────────────────────────────────────────────┘
```

Saat Tutor aktif, kotak info kecil akan muncul dan memberi tahu kata kunci persis yang bisa Anda ketik untuk menemukan elemen tersebut di masa mendatang.

---

## Labels-Only Workflow (Mode Kecepatan Tinggi)
Duration: 0:10:00

Jika Anda seorang pengguna setia **Vimium**, **Vimperator**, atau menginginkan kecepatan navigasi maksimal tanpa perlu mengetik nama tombol, Anda dapat mengaktifkan **Labels-only mode**.

### Perbedaan Search Workflow vs. Labels-Only Workflow

| Fitur | Search Workflow (Default) | Labels-Only Mode (Vimium Style) |
| :--- | :--- | :--- |
| **Pencarian Teks** | Aktif (Mengetik nama tombol) | Dinonaktifkan |
| **Tampilan Label** | Muncul setelah elemen difilter | Selalu muncul di semua elemen seketika |
| **Input Label** | Wajib menahan tombol `Shift` | Cukup ketik huruf label **tanpa Shift** |
| **Tombol Klik** | Tekan `Return` | Tekan **`Space`** atau `Return` (sangat ergonomis) |
| **Kecepatan** | Presisi untuk layar kompleks | **Instan / Zero Latency** |

### Cara Mengaktifkan Labels-Only Mode
1. Buka Preferences Homerow (klik ikon Homerow di Menu Bar macOS > *Preferences* atau tekan `⌘ ,` saat panel terbuka).
2. Pada tab Navigation/General, pilih **Workflow: Labels-only**.

Setelah aktif, setiap kali Anda menekan `⌘ ⇧ Space`:
* Seluruh elemen di layar langsung diberi label 2 huruf (seperti `JK`, `FD`, `SL`).
* Anda cukup menekan dua huruf tersebut langsung di Home Row keyboard Anda, lalu tekan `Space` untuk mengklik.

---

## Scroll Mode dengan Tombol HJKL 🛞
Duration: 0:10:00

Homerow tidak hanya berfungsi untuk mengklik, tetapi juga memiliki mesin scrolling mandiri yang mendukung pergerakan berbasis tombol **HJKL** (atau **DHTN** untuk pengguna layout DVORAK).

```
┌────────────────────────────────────────────────────────────────┐
│                       SCROLL MODE CONTROLS                     │
├────────────────────────────────┬───────────────────────────────┤
│ ⇧ ⌘ J                          │ Aktivasi Scroll-mode          │
│ H / J / K / L                  │ Scroll Kiri / Bawah / Atas / Kanan│
│ Shift + H / J / K / L          │ Scroll Cepat (Large Scroll)   │
│ Tab / Arrow-Dn / Ctrl-N        │ Pindah fokus ke area scroll berikutnya│
│ Shift-Tab / Arrow-Up / Ctrl-P  │ Pindah fokus ke area scroll sebelumnya│
│ 0 - 9                          │ Pilih target area scroll langsung│
│ Esc                            │ Keluar dari Scroll-mode       │
└────────────────────────────────┴───────────────────────────────┘
```

### Langkah-Langkah Menggunakan Scroll Mode

1. Tekan shortcut aktivasi:
   ```
   Shift-Command-J (⇧ ⌘ J)
   ```
2. Area yang dapat di-scroll (sidebar, konten utama, log terminal) akan disorot dengan border visual.
3. Tekan **`J`** untuk scroll ke bawah, **`K`** untuk scroll ke atas, **`H`** untuk scroll ke kiri, dan **`L`** untuk scroll ke kanan.
4. Jika halaman memiliki beberapa area scroll independen (misalnya sidebar folder vs editor teks), tekan `Tab` atau angka `0`-`9` untuk berpindah area scroll aktif.
5. Tekan `Esc` jika sudah selesai membaca.

---

## Integrasi Hyper Key (Caps Lock Mapping)
Duration: 0:12:00

Untuk efisiensi tingkat tinggi, developer Homerow merekomendasikan pemetaan **Caps Lock menjadi Hyper Key** (`Shift-Command-Control` atau `Command-Option-Control-Shift`).

### 3 Alasan Menggunakan Hyper Key di Homerow:
1. **Aktivasi Instan**: Menjalankan Homerow dengan kombinasi `Caps Lock + F` atau `Hyper + Space`.
2. **Navigasi Cepat**: Memindahkan fokus elemen berikutnya dengan `Caps Lock + J` dan elemen sebelumnya dengan `Caps Lock + K`.
3. **Menu Navigation**: Menelusuri seluruh menu bar macOS dengan `Caps Lock + H/J/K/L`.

### Cara Konfigurasi Hyper Key

Anda dapat menggunakan salah satu dari dua metode resmi berikut:

#### Opsi 1: Menggunakan Aplikasi Hyperkey (Ryan Hanson)
1. Unduh aplikasi gratis [Hyperkey.app](https://hyperkey.app).
2. Konfigurasikan **Caps Lock** agar bertindak sebagai `Hyper` saat ditekan bersama tombol lain, dan sebagai `Escape` saat ditekan sekali sendirian.

#### Opsi 2: Menggunakan Karabiner-Elements via `hyper_key.json`
Jika Anda menggunakan **Karabiner-Elements**, Anda dapat langsung mengimpor aturan resmi dari repository Homerow:

Buka tautan berikut di browser Anda:
```text
karabiner://karabiner/assets/complex_modifications/import?url=https://raw.githubusercontent.com/dexterleng/homerow/main/hyper_key.json
```

Atau tambahkan aturan JSON berikut ke `~/.config/karabiner/karabiner.json`:

```json
{
  "title": "Caps Lock to Hyper Key (Command-Control-Shift)",
  "rules": [
    {
      "description": "Hyper Key: map Caps Lock to Shift-Command-Control (Escape if alone)",
      "manipulators": [
        {
          "from": {
            "key_code": "caps_lock",
            "modifiers": {
              "optional": ["any"]
            }
          },
          "to": [
            {
              "key_code": "left_shift",
              "modifiers": ["left_command", "left_control"]
            }
          ],
          "to_if_alone": [
            {
              "key_code": "escape"
            }
          ],
          "type": "basic"
        }
      ]
    }
  ]
}
```

---

## Tabel Lengkap Kontrol & Shortcut Keybindings
Duration: 0:05:00

Berikut adalah ringkasan seluruh kontrol resmi Homerow yang dapat Anda simpan sebagai referensi cepat:

### 1. Mode Pencarian & Seleksi (Search & Labels)

| Tombol / Shortcut | Fungsi |
| :--- | :--- |
| `⌘ ⇧ Space` | Mengaktifkan Homerow (Default Shortcut) |
| `[Teks]` | Mengetik query untuk memfilter elemen UI |
| `*` atau `;` | Query wildcard untuk memunculkan seluruh elemen di layar |
| `Shift + [Label]` | Mengetik label target secara langsung pada Search mode |
| `Tab` / `↓` / `Ctrl-N` | Memindahkan fokus ke elemen berikutnya (*Next Element*) |
| `⇧ Tab` / `↑` / `Ctrl-P` | Memindahkan fokus ke elemen sebelumnya (*Previous Element*) |
| `Return` | Klik kiri pada elemen terfokus |
| `Shift-Return` | Buka di tab baru (*Open link in new tab*) |
| `Command-Return` | Command-click (⌘-click) |
| `Space` | Klik instan pada *Labels-only mode* |
| `?` | Memanggil **The Tutor 🤓** untuk melihat atribut searchable |
| `Esc` | Menutup panel Homerow |

### 2. Mode Scrolling (Scroll Mode)

| Tombol / Shortcut | Fungsi |
| :--- | :--- |
| `⇧ ⌘ J` | Mengaktifkan Scroll Mode |
| `H` / `J` / `K` / `L` | Scroll Kiri / Bawah / Atas / Kanan |
| `⇧ + H / J / K / L` | Scroll cepat dengan jarak lompatan lebih besar |
| `Tab` / `↓` / `Ctrl-N` | Pindah ke scroll-container berikutnya |
| `⇧ Tab` / `↑` / `Ctrl-P` | Pindah ke scroll-container sebelumnya |
| `0` s.d. `9` | Memilih area scroll secara langsung berdasarkan indeks |
| `Esc` | Keluar dari Scroll Mode |

---

## Best Practices & Kompatibilitas Aplikasi
Duration: 0:05:00

### Kompatibilitas Aplikasi

Homerow bekerja secara optimal pada dua kategori aplikasi:

1. **Aplikasi Native macOS**:
   * Finder, Xcode, System Settings, Apple Notes, Mail, Pages, Preview, Terminal, Activity Monitor.
   * Pada aplikasi native, seluruh tombol tombol toolbar, sidebar tree, dan dialog sheet dapat terdeteksi dengan akurasi 100%.
2. **Aplikasi Non-Native & Web-Based (Electron / Chromium)**:
   * Google Chrome, Safari, Firefox, Arc Browser, Brave.
   * VS Code, Slack, Discord, Obsidian, Notion, Spotify, Figma.
   * *Tips untuk Web*: Pada browser, pastikan accessibility tree aktif (diaktifkan otomatis oleh Homerow saat membaca window).

### Best Practice Workflow Harian

1. **Kombinasikan dengan Tiling Window Manager (Yabai)**:
   * Gunakan Yabai & skhd untuk berpindah antar-jendela dan workspace.
   * Gunakan Homerow saat Anda perlu mengklik tombol di dalam aplikasi (misal: tombol *Deploy* di browser, tombol *Run* di Xcode, atau dialog konfirmasi pop-up).
2. **Gunakan Labels-Only Mode untuk Tugas Berulang**:
   * Jika Anda sering melakukan serangkaian klik pada antarmuka yang sama (misal mengisi form web atau mereview PR), Labels-Only mode menghemat ketukan tombol secara signifikan.
3. **Manfaatkan Wildcard `;`**:
   * Daripada memikirkan nama tombol, tekan `⌘ ⇧ Space` lalu ketik `;` untuk langsung memunculkan semua label klik di layar.

---

## Ringkasan & Langkah Lanjutan
Duration: 0:02:00

Selamat! Anda telah menguasai seluruh fitur fundamental dan lanjutan dari **Homerow** sesuai dokumentasi resmi:

### Apa yang Telah Anda Pelajari:
* ✅ **Search Workflow**: Cara cepat mencari, memfokuskan, dan mengklik elemen UI via `⌘ ⇧ Space`.
* ✅ **The Tutor 🤓**: Menginspeksi atribut *searchable* elemen antarmuka yang tersembunyi dengan menekan `?`.
* ✅ **Labels-Only Mode**: Navigasi ultra-cepat ala Vimium dengan eksekusi tombol `Space`.
* ✅ **Scroll Mode HJKL**: Menavigasi area scrolling multi-panel murni via tombol Vim `H/J/K/L` (`⇧ ⌘ J`).
* ✅ **Hyper Key Integration**: Menjadikan tombol `Caps Lock` sebagai pusat navigasi ergonomis di macOS.

### Sumber Daya Resmi & Dukungan:
* Website Resmi: [homerow.app](https://homerow.app)
* Repositori GitHub: [nchudleigh/homerow](https://github.com/nchudleigh/homerow)
* Hyper Key Configuration: [hyper_key.json](https://raw.githubusercontent.com/nchudleigh/homerow/main/hyper_key.json)
* Feedback & Support: Buka issue di GitHub atau kontak `dexter@homerow.app`
