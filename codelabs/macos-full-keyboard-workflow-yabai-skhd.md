summary: Panduan lengkap dan fundamental setup macOS 100% keyboard-driven workflow tanpa trackpad — konfigurasi mendalam Yabai BSP tiling window manager, skhd hotkey daemon, navigasi GUI dengan Homerow & Shortcat, Alacritty & Tmux terminal multiplexer, dan Vim browser navigation dengan Surfingkeys.
id: macos-full-keyboard-workflow-yabai-skhd
categories: macOS, Developer Tools, Productivity, CLI
tags: macos, yabai, skhd, homerow, shortcat, alacritty, tmux, surfingkeys, keyboard-driven, vim, productivity
status: Published
authors: LearnWithFath Team
Feedback Link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# macOS Full Keyboard-Driven Workflow: Yabai, skhd, Homerow, Alacritty & Tmux

## Overview & Filosofi Keyboard-Driven macOS
Duration: 0:05:00

### Mengapa 100% Keyboard-Driven Workflow?

Sebagai software engineer, perpindahan tangan dari keyboard ke trackpad/mouse (*context switching cost*) terjadi ratusan kali setiap hari. Setiap gerakan meraih trackpad untuk menggeser jendela, menekan tombol pada browser, atau mengklik dialog popup membuang fokus dan waktu.

Dengan beralih ke ekosistem **Full Keyboard-Driven**, kedua tangan Anda tetap berada pada posisi **Home Row** (`ASDF` - `JKL;`). Seluruh navigasi sistem—mulai dari manajemen layout window, perpindahan workspace, navigasi terminal, interaksi browser, hingga klik tombol pada UI native—dieksekusi secara instan murni melalui kombinasi tombol.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EKOSISTEM FULL KEYBOARD MAC                        │
├────────────────────────────────┬────────────────────────────────────────────┤
│ 1. Arsitektur Tiling Window    │ • Yabai (Binary Space Partitioning Tiling) │
│                                │ • skhd (Fast & Lightweight Hotkey Daemon)  │
├────────────────────────────────┼────────────────────────────────────────────┤
│ 2. Pengganti Kursor & GUI Nav  │ • Homerow (Letter-hint Accessibility Click)│
│                                │ • Shortcat (Visual OCR & Query Clicker)    │
├────────────────────────────────┼────────────────────────────────────────────┤
│ 3. Terminal & Multiplexer      │ • Alacritty (GPU-Accelerated Terminal)     │
│                                │ • Tmux (Pane Splitting & Persistent State) │
├────────────────────────────────┼────────────────────────────────────────────┤
│ 4. Browser Navigation (Vim)    │ • Surfingkeys (Vim-Style Web Browsing)     │
└────────────────────────────────┴────────────────────────────────────────────┘
```

### Mengapa Menggantikan Rectangle dengan Yabai?

Aplikasi seperti **Rectangle** atau **Magnet** adalah *window snapping tools* pasif: Anda harus menekan shortcut setiap kali ingin merapikan satu jendela ke sisi kiri atau kanan. Jika Anda membuka jendela baru, jendela tersebut akan menumpuk (*floating overlay*) di atas jendela lama.

Sebaliknya, **Yabai** adalah **Dynamic Tiling Window Manager** berbasis *Binary Space Partitioning (BSP)*:
* Setiap jendela baru otomatis membelah area layar secara proporsional dan presisi tanpa tumpang tindih.
* Saat jendela ditutup, jendela yang tersisa otomatis mengisi ruang kosong secara mulus.
* Sangat ideal bagi **Mobile & Full Stack Developer** yang perlu membuka IDE (VS Code/Xcode), Terminal, dan Mobile Emulator di satu layar secara berdampingan.

Positive
: Panduan ini dirancang dari tingkat fundamental hingga file konfigurasi siap pakai. Pastikan Anda mengikuti langkah demi langkah dengan teliti.

---

## Setup Yabai: Dynamic Tiling Window Manager
Duration: 0:15:00

### Apa itu Yabai?
**Yabai** adalah window manager untuk macOS yang memanipulasi jendela aplikasi secara otomatis menggunakan macOS Accessibility API.

### Langkah 1: Instalasi Yabai via Homebrew
Buka terminal Anda dan jalankan perintah berikut:

```bash
# Tap repository resmi Yabai
brew tap koekeishiya/formulae

# Install Yabai
brew install yabai
```

### Langkah 2: Konfigurasi File `~/.config/yabai/yabairc`
Yabai membaca file konfigurasi executable di `~/.config/yabai/yabairc`. Buat foldernya dan tulis file konfigurasi:

```bash
mkdir -p ~/.config/yabai
touch ~/.config/yabai/yabairc
chmod +x ~/.config/yabai/yabairc
```

Edit file `~/.config/yabai/yabairc` dengan konfigurasi optimal berikut:

```bash
#!/usr/bin/env sh

# ==============================================================================
# 1. GLOBAL LAYOUT CONFIGURATION
# ==============================================================================
# Gunakan layout BSP (Binary Space Partitioning)
yabai -m config layout                       bsp

# Penempatan split jendela baru (first_child atau second_child)
yabai -m config window_placement             second_child

# Padding & Gaps (Jarak antar jendela dan tepi layar dalam pixel)
yabai -m config top_padding                  8
yabai -m config bottom_padding               8
yabai -m config left_padding                 8
yabai -m config right_padding                8
yabai -m config window_gap                   8

# Rasio pembagian split default (0.5 = 50:50)
yabai -m config split_ratio                  0.50
yabai -m config auto_balance                 off

# ==============================================================================
# 2. MOUSE & FOCUS BEHAVIOR
# ==============================================================================
# Focus mengikuti kursor mouse (autoraise / autofocus)
yabai -m config mouse_follows_focus          off
yabai -m config focus_follows_mouse          off

# Modifikasi jendela dengan drag mouse + tombol modifier (fn / alt / cmd)
yabai -m config mouse_modifier               alt
yabai -m config mouse_action1                move
yabai -m config mouse_action2                resize

# Modifikasi opacity jendela yang tidak aktif (opsional)
yabai -m config window_opacity               off
yabai -m config active_window_opacity        1.0
yabai -m config normal_window_opacity        0.90

# ==============================================================================
# 3. WINDOW RULES & EXCEPTIONS (NON-TILED APPS)
# ==============================================================================
# Jangan susun jendela popup, preferences, dialog modal, & emulator kecil
yabai -m rule --add app="^System Settings$" manage=off
yabai -m rule --add app="^System Information$" manage=off
yabai -m rule --add app="^Calculator$" manage=off
yabai -m rule --add app="^Finder$" title="(Copy|Move|Bin|About)" manage=off
yabai -m rule --add app="^Simulator$" manage=off
yabai -m rule --add app="^Emulator$" manage=off
yabai -m rule --add app="^Android Studio$" title="^win.*" manage=off
yabai -m rule --add app="^QuickTime Player$" manage=off
yabai -m rule --add app="^Archive Utility$" manage=off

echo "yabai configuration loaded successfully."
```

### Langkah 3: Memberikan Permission Accessibility macOS
Yabai membutuhkan izin Accessibility untuk mengontrol jendela:

1. Jalankan service Yabai:
```bash
yabai --start-service
```
2. macOS akan memunculkan notifikasi permintaan izin Accessibility.
3. Buka **System Settings > Privacy & Security > Accessibility**.
4. Aktifkan toggle switch untuk **yabai**. (Jika tidak muncul otomatis, klik tanda `+` dan tambahkan `/opt/homebrew/bin/yabai` untuk Apple Silicon atau `/usr/local/bin/yabai` untuk Intel).
5. Restart service Yabai:
```bash
yabai --restart-service
```

Negative
: **Catatan tentang SIP (System Integrity Protection)**: Yabai dapat berjalan 100% normal tanpa mematikan SIP macOS untuk semua fitur tiling, gaps, padding, dan window focus. Fitur lanjutan seperti transisi workspace instan tanpa animasi hanya memerlukan scripting-addition opsional. Untuk pemula dan keamanan harian kantor, **SIP tidak perlu dimatikan**.

---

## Setup skhd: The Fast Hotkey Daemon
Duration: 0:15:00

### Apa itu skhd?
**skhd** (Simple Kotkey Daemon) adalah pasangan resmi Yabai. Aplikasi ini bertugas menangkap penekanan tombol keyboard (*hotkey event*) dan mengeksekusi perintah IPC ke Yabai atau shell script secara instan dengan latensi mendekati 0 milidetik.

### Langkah 1: Instalasi skhd via Homebrew

```bash
# Install skhd
brew install skhd

# Buat folder konfigurasi
mkdir -p ~/.config/skhd
touch ~/.config/skhd/skhdrc
```

### Langkah 2: Konfigurasi Lengkap `~/.config/skhd/skhdrc`
Konvensi hotkey terbaik adalah menggunakan **`alt` (Option)** sebagai tombol modifier utama agar tidak bentrok dengan shortcut bawaan macOS (`Cmd + ...`).

Edit file `~/.config/skhd/skhdrc`:

```bash
# ==============================================================================
# SKHD CONFIGURATION FOR YABAI & SYSTEM HOTKEYS
# Modifier: alt (Option)
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. NAVIGASI FOKUS JENDELA (Vim Style: h, j, k, l)
# ------------------------------------------------------------------------------
alt - h : yabai -m window --focus west
alt - j : yabai -m window --focus south
alt - k : yabai -m window --focus north
alt - l : yabai -m window --focus east

# ------------------------------------------------------------------------------
# 2. MEMINDAHKAN POSISI JENDELA / SWAP (alt + shift - h, j, k, l)
# ------------------------------------------------------------------------------
alt + shift - h : yabai -m window --swap west
alt + shift - j : yabai -m window --swap south
alt + shift - k : yabai -m window --swap north
alt + shift - l : yabai -m window --swap east

# ------------------------------------------------------------------------------
# 3. WARP / INSERT JENDELA KE ARAH TERTENTU (alt + ctrl - h, j, k, l)
# ------------------------------------------------------------------------------
alt + ctrl - h : yabai -m window --warp west
alt + ctrl - j : yabai -m window --warp south
alt + ctrl - k : yabai -m window --warp north
alt + ctrl - l : yabai -m window --warp east

# ------------------------------------------------------------------------------
# 4. MENGUBAH UKURAN JENDELA / RESIZE (shift + cmd - h, j, k, l)
# ------------------------------------------------------------------------------
shift + cmd - h : yabai -m window --resize left:-50:0 || yabai -m window --resize right:-50:0
shift + cmd - j : yabai -m window --resize bottom:0:50 || yabai -m window --resize top:0:50
shift + cmd - k : yabai -m window --resize top:0:-50 || yabai -m window --resize bottom:0:-50
shift + cmd - l : yabai -m window --resize right:50:0 || yabai -m window --resize left:50:0

# ------------------------------------------------------------------------------
# 5. MANIPULASI LAYOUT & FULLSCREEN
# ------------------------------------------------------------------------------
# Toggle Fullscreen / Zoom Jendela
alt - f : yabai -m window --toggle zoom-fullscreen

# Toggle Float / Unfloat Jendela Aktif
alt - t : yabai -m window --toggle float --grid 4:4:1:1:2:2

# Rotasi orientasi split (Vertical <-> Horizontal)
alt - r : yabai -m space --rotate 90

# Re-balance ukuran seluruh jendela agar rata 50:50
alt - e : yabai -m space --balance

# ------------------------------------------------------------------------------
# 6. BERPINDAH WORKSPACE / SPACE (alt - 1..6)
# ------------------------------------------------------------------------------
alt - 1 : yabai -m space --focus 1
alt - 2 : yabai -m space --focus 2
alt - 3 : yabai -m space --focus 3
alt - 4 : yabai -m space --focus 4
alt - 5 : yabai -m space --focus 5
alt - 6 : yabai -m space --focus 6

# Pindahkan jendela aktif ke Workspace tertentu (alt + shift - 1..6)
alt + shift - 1 : yabai -m window --space 1; yabai -m space --focus 1
alt + shift - 2 : yabai -m window --space 2; yabai -m space --focus 2
alt + shift - 3 : yabai -m window --space 3; yabai -m space --focus 3
alt + shift - 4 : yabai -m window --space 4; yabai -m space --focus 4
alt + shift - 5 : yabai -m window --space 5; yabai -m space --focus 5
alt + shift - 6 : yabai -m window --space 6; yabai -m space --focus 6

# ------------------------------------------------------------------------------
# 7. QUICK LAUNCHER & RESTART DAEMONS
# ------------------------------------------------------------------------------
# Buka Alacritty Terminal baru
alt - return : open -na /Applications/Alacritty.app

# Restart Yabai & skhd secara instan
alt + shift - r : yabai --restart-service && skhd --restart-service
```

### Langkah 3: Menjalankan Service skhd
```bash
# Start service skhd
skhd --start-service
```
Buka **System Settings > Privacy & Security > Accessibility** dan pastikan **skhd** sudah dicentang/diizinkan.

Positive
: Uji coba sekarang: Buka 2 jendela terminal, lalu tekan `alt - h` dan `alt - l`. Fokus jendela akan berpindah seketika tanpa menyentuh mouse!

---

## Pengganti Kursor & Navigasi GUI: Homerow & Shortcat
Duration: 0:10:00

Saat berada di luar editor teks (misalnya menekan tombol pada dialog native macOS, memilih menu dropdown di Figma, atau mengklik button pada simulator), Anda membutuhkan cara menargetkan elemen UI dengan keyboard. Di sinilah **Homerow** dan **Shortcat** berperan.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Homerow]  -> Menginjeksi 2-huruf label (misal: "JK", "AS") di atas elemen │
│ [Shortcat] -> Mengetik nama teks tombol (misal: "Save", "Submit") + Enter   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1. Homerow (Vimium untuk Seluruh macOS)
**Homerow** membaca Accessibility Tree dari seluruh aplikasi macOS yang sedang terbuka dan menempatkan label huruf kecil di atas setiap elemen interaktif.

#### Instalasi:
1. Download dari [homerow.app](https://www.homerow.app) atau via Homebrew:
```bash
brew install --cask homerow
```
2. Berikan izin **Accessibility** dan **Screen Recording** di *System Settings*.

#### Cara Penggunaan:
* Tekan shortcut default: `Cmd + Shift + Space`.
* Seluruh tombol, link, tab, dan textfield di layar akan ditandai dengan label huruf (seperti `AA`, `SK`, `FJ`).
* Ketik huruf label tersebut pada keyboard -> Elemen akan terklik secara otomatis!
* **Scroll Mode**: Tekan `Cmd + Shift + J` untuk masuk ke mode scroll, lalu gunakan `h/j/k/l` untuk scroll halaman.

---

### 2. Shortcat (Pencarian Elemen Visual Berbasis Teks)
**Shortcat** bekerja seperti Spotlight, namun dikhususkan untuk elemen UI yang terlihat.

#### Instalasi:
```bash
brew install --cask shortcat
```

#### Cara Penggunaan:
* Tekan `Cmd + Shift + .` (atau konfigurasi shortcut Anda).
* Ketik nama tombol yang terlihat di layar, misalnya: `Save` atau `Cancel`.
* Shortcat akan menyorot tombol tersebut.
* Tekan `Enter` untuk melakukan klik kiri, atau `Ctrl + Enter` untuk klik kanan.

---

## Lingkungan Terminal: Alacritty & Tmux Multiplexer
Duration: 0:15:00

Terminal adalah ruang kerja utama bagi developer. Kombinasi **Alacritty** (emulator terminal GPU-rendered super cepat) dan **Tmux** (terminal multiplexer) memungkinkan Anda membagi satu jendela terminal menjadi puluhan panel independen.

```
┌─────────────────────────────────────────────────────────┐
│ ALACRITTY WINDOW                                        │
│ ┌───────────────────────────┬─────────────────────────┐ │
│ │ Pane 1 (Editor / Agent)   │ Pane 2 (Backend Logs)   │ │
│ │ $ nvim . / claude / pi    │ $ docker compose logs -f│ │
│ ├───────────────────────────┴─────────────────────────┤ │
│ │ Pane 3 (Watcher / Metro / Gradle Build)             │ │
│ │ $ npx react-native start / flutter run              │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Langkah 1: Instalasi Alacritty & Tmux
```bash
brew install --cask alacritty
brew install tmux
```

### Langkah 2: Konfigurasi `~/.config/alacritty/alacritty.toml`
Buat file konfigurasi Alacritty:

```bash
mkdir -p ~/.config/alacritty
touch ~/.config/alacritty/alacritty.toml
```

Isi dengan konfigurasi modern:

```toml
[window]
padding = { x = 12, y = 12 }
decorations = "buttonless"
opacity = 0.95
blur = true
option_as_alt = "Both"

[font]
size = 14.0

[font.normal]
family = "JetBrainsMono Nerd Font"
style = "Regular"

[font.bold]
family = "JetBrainsMono Nerd Font"
style = "Bold"

[colors.primary]
background = "#1a1b26"
foreground = "#c0caf5"

[cursor]
style = { shape = "Block", blinking = "On" }
```

### Langkah 3: Konfigurasi `~/.tmux.conf`
Buat konfigurasi Tmux dengan keybinding ramah Vim:

```bash
cat << 'EOF' > ~/.tmux.conf
# Ubah prefix key dari Ctrl-b menjadi Ctrl-a (lebih mudah dijangkau)
unbind C-b
set-option -g prefix C-a
bind-key C-a send-prefix

# Enable mouse support jika sewaktu-waktu dibutuhkan
set -g mouse on

# Index window dan pane mulai dari 1 (bukan 0)
set -g base-index 1
setw -g pane-base-index 1

# Split pane menggunakan | (horizontal) dan - (vertical)
bind | split-window -h -c "#{pane_current_path}"
bind - split-window -v -c "#{pane_current_path}"
unbind '"'
unbind %

# Pindah antar pane menggunakan Vim keys (h, j, k, l)
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R

# Resize pane dengan Prefix + H, J, K, L
bind -r H resize-pane -L 5
bind -r J resize-pane -D 5
bind -r K resize-pane -U 5
bind -r L resize-pane -R 5

# Mode copy berbasis Vim
setw -g mode-keys vi
bind -T copy-mode-vi v send -X begin-selection
bind -T copy-mode-vi y send -X copy-pipe-and-cancel "pbcopy"

# Tampilan Status Bar Minimalis
set -g status-style bg="#16161e",fg="#7aa2f7"
set -g status-left " #[bold]Sesi: #S #[default]| "
set -g status-right " %H:%M #[bold]%d-%b-%y #[default]"
EOF
```

---

## Navigasi Browser Bebas Mouse: Surfingkeys
Duration: 0:10:00

Web browser sering kali menjadi penghambat utama alur kerja full-keyboard. Ekstensi **Surfingkeys** menyematkan sistem navigasi Vim langsung ke dalam browser Anda (Chrome, Brave, Edge, Firefox).

```
┌─────────────────────────────────────────────────────────────┐
│                       SURFINGKEYS CHEAT SHEET               │
├─────────────────────────────────────────────────────────────┤
│ f       : Buka link di tab saat ini (muncul letter hints)   │
│ F       : Buka link di tab baru di background               │
│ j / k   : Scroll ke bawah / ke atas                         │
│ d / u   : Scroll setengah layar ke bawah / ke atas          │
│ E / R   : Pindah ke tab sebelah kiri / kanan                │
│ x       : Tutup tab saat ini                                │
│ X       : Restore tab yang baru saja ditutup                │
│ t       : Buka omnibar URL search                           │
│ yy      : Salin (copy) URL halaman saat ini ke clipboard    │
│ yf      : Salin link URL dari target tombol ke clipboard    │
│ /       : Cari kata/teks di dalam halaman web               │
└─────────────────────────────────────────────────────────────┘
```

### Langkah 1: Instalasi Surfingkeys
1. Buka browser Chromium favorit Anda (Chrome / Brave / Edge).
2. Install ekstensi [Surfingkeys dari Chrome Web Store](https://chrome.google.com/webstore/detail/surfingkeys/gfbliohnnapiefjpjlpndaikpmhhbfnb) (atau dari Firefox Add-ons).

### Langkah 2: Kustomisasi Settings
Buka pengaturan Surfingkeys (`Alt + s` atau klik icon ekstensi > *Options*) dan Anda dapat menambahkan mapping kustom:

```javascript
// Nonaktifkan Surfingkeys di domain tertentu jika bentrok (misal Figma/Google Docs)
unmapAllExcept(['f', 'F'], /figma\.com|docs\.google\.com/);

// Gunakan Smooth Scroll
settings.smoothScroll = true;

// Mode insert cepat keluar dengan ESC
api.iunmap(":");
```

---

## Migrasi: Uninstall Rectangle Secara Bersih
Duration: 0:05:00

Negative
: **PENTING**: Jika Anda sebelumnya menggunakan **Rectangle**, **Magnet**, atau **Spectacle**, aplikasi tersebut **WAJIB di-uninstall** atau dinonaktifkan sepenuhnya.

### Mengapa Terjadi Konflik?
1. **Event Listener Race**: Baik Rectangle maupun Yabai mendengarkan Accessibility API window lifecycle. Jika keduanya aktif, jendela akan saling "tarik-menarik" posisi sehingga memicu kedipan (*glitch*) dan lag.
2. **Hotkey Collision**: Shortcut snapping Rectangle akan menimpa IPC commands skhd.

### Langkah Uninstall Rectangle:
1. Buka **Rectangle > Preferences > Quit Rectangle**.
2. Matikan toggle *Launch on Login*.
3. Hapus aplikasi:
```bash
# Hapus aplikasi Rectangle
sudo rm -rf /Applications/Rectangle.app
# Hapus preferensi plist lama
rm -f ~/Library/Preferences/com.knollsoft.Rectangle.plist
```
4. Buka **System Settings > Privacy & Security > Accessibility**, lalu hapus (*remove*) entry Rectangle dengan tombol `-`.

---

## Skenario Praktik Harian: Mobile Multi-Window Workflow
Duration: 0:15:00

Mari kita simulasikan alur kerja nyata: **Membangun Fitur Flutter/React Native dengan Multi-Window Tiling**.

### 1. Inisialisasi Layout Kerja
1. Tekan `alt - 1` (Pindah ke Workspace 1: Coding).
2. Buka VS Code / Antigravity (`open -na "Visual Studio Code"`).
3. Buka Alacritty Terminal (`alt - return`).
   * Yabai secara otomatis membagi layar menjadi 50:50 (Editor di kiri, Terminal di kanan).
4. Di Alacritty, jalankan `tmux`:
   * Tekan `Ctrl-a` lalu `|` untuk membelah terminal menjadi 2 panel:
     - Panel Atas: Menjalankan `flutter run` / `npx react-native start`.
     - Panel Bawah: Menjalankan agent runner CLI (`claude` / `pi` / `git status`).

### 2. Membuka Mobile Simulator (Floating Mode)
1. Buka iOS Simulator atau Android Emulator.
2. Karena rule di `~/.config/yabai/yabairc` sudah diset `yabai -m rule --add app="^Simulator$" manage=off`, Simulator akan muncul dalam mode **Floating** tanpa merusak susunan 50:50 antara Editor dan Terminal.
3. Geser posisi simulator secara presisi menggunakan `alt + drag mouse` atau biarkan berdampingan.

### 3. Navigasi & Modifikasi Jendela
* Ingin memperluas area Editor dan memperkecil Terminal? Tekan `shift + cmd - l`.
* Ingin fokus penuh ke Terminal? Tekan `alt - l` lalu `alt - f` (Fullscreen Zoom). Tekan `alt - f` lagi untuk kembali ke tiling semula.
* Ingin pindah ke browser untuk melihat dokumentasi API di Workspace 2? Cukup tekan `alt - 2`.
* Di browser, tekan `f` untuk klik link dokumentasi tanpa trackpad, lalu tekan `yy` untuk copy URL.
* Tekan `alt - 1` untuk kembali ke Workspace coding.

---

## Cheatsheet Shortcut Lengkap & Troubleshooting
Duration: 0:05:00

### ⌨️ Master Keyboard Cheatsheet

| Kategori | Shortcut | Aksi |
| :--- | :--- | :--- |
| **Focus Window** | `alt + h / j / k / l` | Pindah fokus ke Barat / Selatan / Utara / Timur |
| **Swap Window** | `alt + shift + h / j / k / l` | Tukar posisi jendela aktif ke arah target |
| **Resize Window** | `shift + cmd + h / j / k / l` | Perbesar/perkecil batas jendela 50px |
| **Layout Mode** | `alt + f` | Toggle Zoom Fullscreen jendela aktif |
| **Floating Mode** | `alt + t` | Toggle Floating / Tiling pada jendela aktif |
| **Workspaces** | `alt + 1..6` | Pindah instan ke Workspace 1 s.d. 6 |
| **Move to Space**| `alt + shift + 1..6` | Pindahkan jendela aktif ke Workspace target |
| **UI Clicker** | `cmd + shift + space` | Aktifkan label **Homerow** untuk klik elemen GUI |
| **UI Search** | `cmd + shift + .` | Aktifkan pencarian visual **Shortcat** |
| **Vim Browser** | `f` / `F` | Buka link halaman web di tab aktif / background |
| **Reload Daemon**| `alt + shift + r` | Restart Yabai & skhd secara instan |

---

### Troubleshooting Masalah Umum

#### 1. Yabai tidak mau membagi jendela secara otomatis
* Pastikan Accessibility permission aktif di **System Settings > Privacy & Security > Accessibility**.
* Jalankan restart service:
```bash
yabai --restart-service && skhd --restart-service
```
* Cek log error:
```bash
tail -f /tmp/yabai_*.log
```

#### 2. Shortcut skhd tidak merespons sama sekali
* Pastikan file `~/.config/skhd/skhdrc` tidak memiliki sintaks error.
* Jalankan skhd secara manual di terminal untuk melihat error:
```bash
skhd -V
```

---

## Ringkasan
Duration: 0:02:00

Selamat! Anda kini telah memiliki lingkungan kerja **100% Full Keyboard-Driven** di macOS:

### Apa yang Telah Anda Pelajari & Pasang:
* ✅ **Yabai Tiling Window Manager**: Layout otomatis berbasis BSP tanpa jendela tumpang tindih.
* ✅ **skhd Hotkey Daemon**: Manajemen layout, resize, dan workspace switching instan via tombol `alt`.
* ✅ **Homerow & Shortcat**: Mengklik tombol dan elemen antarmuka visual macOS murni lewat ketikan keyboard.
* ✅ **Alacritty & Tmux**: Lingkungan terminal GPU-rendered dengan kemampuan multi-pane persisten.
* ✅ **Surfingkeys**: Pengalaman browsing web berbasis Vim tanpa menyentuh mouse.
* ✅ **Uninstall Rectangle**: Ekosistem bersih tanpa konflik event listener.

Nikmati kecepatan eksekusi teknis murni dari sentuhan jari Anda di atas keyboard!
