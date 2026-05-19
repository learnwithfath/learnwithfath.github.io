author: Fath
summary: Panduan lengkap dan interaktif untuk memulai belajar pemrograman menggunakan bahasa Python dari nol. Sangat cocok untuk pemula!
id: python-dasar
categories: Python, Beginner, Programming
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Memulai Pemrograman dengan Python

## 1. Pendahuluan
Duration: 0:05:00

Selamat datang di dunia pemrograman! Jika ini adalah pertama kalinya kamu belajar menulis kode, kamu memilih bahasa yang sangat tepat. **Python** adalah salah satu bahasa pemrograman paling populer di dunia karena sintaksnya yang sangat sederhana, bersih, dan menyerupai bahasa Inggris sehari-hari.

### Kenapa Belajar Python?
1. **Mudah Dipelajari:** Tidak banyak sintaks rumit seperti titik koma (`;`) atau tanda kurung kurawal (`{}`) yang membingungkan.
2. **Multi-fungsi:** Python digunakan untuk web development, data science, artificial intelligence (AI), otomasi script, hingga pembuatan game.
3. **Komunitas Besar:** Sangat banyak tutorial dan library gratis yang siap membantu perjalanan belajarmu.

### Apa yang Akan Kamu Pelajari?
Di codelab ini, kamu akan diajarkan konsep dasar pemrograman secara praktikal menggunakan Python. Di akhir sesi, kamu akan membuat sebuah mini-game interaktif sendiri!

## 2. Setup Environment & Instalasi
Duration: 0:08:00

Sebelum mulai menulis kode, mari kita persiapkan peralatan tempur kita.

### Langkah 1: Install Python
1. Buka browser dan pergi ke situs resmi [python.org/downloads](https://www.python.org/downloads/).
2. Unduh versi Python terbaru untuk sistem operasimu (Windows, macOS, atau Linux).
3. **PENTING (Windows):** Saat menjalankan installer, pastikan kamu mencentang opsi **"Add Python to PATH"** sebelum mengklik *Install Now*.

### Langkah 2: Verifikasi Instalasi
Buka Terminal (macOS/Linux) atau Command Prompt (Windows), lalu jalankan perintah:

```bash
python --version
```
*(Di beberapa sistem, kamu mungkin perlu mengetik `python3 --version`)*

Jika keluar angka versi (misal: `Python 3.12.x`), selamat! Python sudah terinstall dengan benar.

### Langkah 3: Gunakan Code Editor
Kami merekomendasikan **VS Code** (Visual Studio Code). Kamu bisa mengunduhnya gratis di [code.visualstudio.com](https://code.visualstudio.com/). Setelah terinstall, pasang extension bernama **"Python"** buatan Microsoft di dalam VS Code.

## 3. Sintaks Dasar & Variabel
Duration: 0:10:00

Mari kita buat instruksi pertama kita kepada komputer. Di dunia pemrograman, program pertama biasanya adalah menampilkan tulisan "Hello World".

### Langkah 1: Tulis Kode Pertama
Buat folder baru bernama `belajar-python`, buka di VS Code, lalu buat file baru bernama `main.py`. Masukkan kode berikut:

```python
print("Halo dunia! Saya sedang belajar Python.")
```

Jalankan program dengan mengklik tombol *Run* di pojok kanan atas VS Code, atau ketik di terminal:
```bash
python main.py
```
Komputer akan menampilkan teks tersebut di terminal. Selamat! Kamu resmi menjadi seorang programmer Python.

### Langkah 2: Memahami Variabel
Variabel adalah wadah penyimpanan sementara untuk data di memori komputer. Bayangkan variabel seperti kotak yang diberi label.

Ubah isi `main.py` menjadi seperti ini:
```python
# Membuat variabel nama dan umur
nama = "Fath"
umur = 20

# Menampilkan isi variabel
print("Nama saya adalah " + nama)
print("Tahun depan umur saya adalah:", umur + 1)
```

Positive
: **Aturan Variabel:** Nama variabel tidak boleh diawali angka dan tidak boleh mengandung spasi (gunakan underscore, misal: `nama_lengkap`). Python bersifat *case-sensitive* (`Nama` dan `nama` dianggap berbeda).

## 4. Tipe Data Dasar
Duration: 0:10:00

Setiap data yang kita simpan memiliki jenis atau "tipe data". Di Python, tipe data dasar terbagi menjadi beberapa jenis:

### 1. String (Teks)
Ditulis di dalam tanda kutip tunggal (`'`) atau ganda (`"`).
```python
alamat = "Jalan Merdeka No. 10"
```

### 2. Integer (Angka Bulat)
Angka tanpa pecahan desimal.
```python
jumlah_siswa = 35
```

### 3. Float (Angka Desimal)
Angka dengan titik pecahan desimal.
```python
ipk = 3.85
```

### 4. Boolean (Kebenaran)
Hanya bernilai `True` (Benar) atau `False` (Salah). Sangat berguna untuk logika kondisi.
```python
sedang_belajar = True
```

### 5. List (Kumpulan Data Terurut)
Digunakan untuk menyimpan banyak data dalam satu variabel. Ditulis menggunakan kurung siku `[]`.
```python
buah_favorit = ["Apel", "Mangga", "Pisang"]
print(buah_favorit[0]) # Output: Apel (Index dimulai dari 0)
```

### 6. Dictionary (Pasangan Key-Value)
Menyimpan data dengan format label dan nilai. Ditulis dengan kurung kurawal `{}`.
```python
kontak = {
    "nama": "Budi",
    "nomor": "0812345678"
}
print(kontak["nama"]) # Output: Budi
```

## 5. Logika Kondisi (If, Elif, Else)
Duration: 0:12:00

Program yang pintar harus bisa mengambil keputusan. Di Python, kita menggunakan instruksi `if` (jika), `elif` (singkatan dari *else if*), dan `else` (jika tidak).

Ubah file `main.py` menjadi seperti ini:

```python
nilai = 78

if nilai >= 80:
    print("Selamat! Kamu mendapatkan nilai A.")
elif nilai >= 60:
    print("Bagus! Kamu lulus dengan nilai B.")
else:
    print("Maaf, kamu harus belajar lebih giat lagi.")
```

Negative
: **PENTING! Perhatikan Indentasi:** Di Python, setelah tanda titik dua (`:`), baris kode berikutnya harus menjorok masuk ke dalam (biasanya menggunakan 4 spasi atau 1 kali tombol Tab). Indentasi ini mendefinisikan blok kode. Jika tidak menjorok, Python akan error!

## 6. Perulangan (Looping)
Duration: 0:10:00

Bagaimana jika kita ingin menulis perintah yang sama berulang kali? Daripada menulis manual 100 kali, kita gunakan **Loops**. Ada dua jenis looping utama di Python:

### 1. For Loop
Berguna untuk mengulangi sesuatu sebanyak jumlah yang ditentukan, atau mengitari isi dari sebuah list.

```python
# Mengulang angka 1 sampai 5
for i in range(1, 6):
    print("Angka ke-", i)

# Mengitari isi list
nama_siswa = ["Ani", "Budi", "Cici"]
for siswa in nama_siswa:
    print("Halo,", siswa)
```

### 2. While Loop
Melakukan perulangan terus-menerus selama suatu kondisi bernilai `True`.

```python
hitungan = 1
while hitungan <= 3:
    print("Hitungan ke-", hitungan)
    hitungan = hitungan + 1 # Menambah nilai hitungan agar tidak perulangan selamanya (infinite loop)
```

## 7. Fungsi (Function)
Duration: 0:08:00

Fungsi adalah blok kode terorganisir yang dapat digunakan kembali untuk melakukan satu tugas tertentu. Membuat fungsi menghindari penulisan kode yang berulang-ulang (*Don't Repeat Yourself*).

Di Python, kita membuat fungsi menggunakan kata kunci `def`.

Ubah `main.py` menjadi:

```python
# Mendefinisikan fungsi bernama sapa
def sapa_user(nama):
    print("Halo " + nama + ", selamat belajar Python!")

# Memanggil fungsi
sapa_user("Ahmad")
sapa_user("Riana")
```

Kita juga bisa membuat fungsi yang mengembalikan nilai (*return value*):

```python
def hitung_luas_segitiga(alas, tinggi):
    luas = 0.5 * alas * tinggi
    return luas

hasil = hitung_luas_segitiga(10, 5)
print("Luas segitiga adalah:", hasil)
```

## 8. Challenge: Game Tebak Angka!
Duration: 0:15:00

Saatnya mempraktekkan semua ilmu yang sudah kamu dapatkan! Kita akan membuat mini-game interaktif bernama **Game Tebak Angka**.

Komputer akan memilih angka acak antara 1 sampai 10, lalu kamu harus menebaknya. Program akan memberi petunjuk apakah tebakanmu terlalu besar atau terlalu kecil.

### Langkah 1: Tulis Kode Game
Tulis kode lengkap berikut di file `main.py` kamu:

```python
import random # Mengimpor library bawaan untuk angka acak

def main_game():
    print("================================")
    print("    GAME TEBAK ANGKA PYTHON    ")
    print("================================")
    
    # Komputer memilih angka acak 1 sampai 10
    angka_rahasia = random.randint(1, 10)
    tebakan_salah = True
    percobaan = 0
    
    print("Saya memikirkan angka antara 1 sampai 10.")
    
    while tebakan_salah:
        # Mengambil input dari user dan mengubahnya menjadi angka bulat (int)
        tebakan = int(input("Masukkan tebakanmu: "))
        percobaan = percobaan + 1
        
        if tebakan == angka_rahasia:
            print(f"Luar biasa! Tebakanmu BENAR setelah {percobaan} kali mencoba! 🎉")
            tebakan_salah = False
        elif tebakan < angka_rahasia:
            print("Terlalu KECIL! Coba tebak angka yang lebih besar.")
        else:
            print("Terlalu BESAR! Coba tebak angka yang lebih kecil.")

# Menjalankan game
main_game()
```

### Langkah 2: Mainkan Game-mu!
Jalankan file `main.py` di terminal VS Code:
```bash
python main.py
```
Masukkan tebakan angka di terminal dan rasakan keajaiban dari program Python buatanmu sendiri!

## 9. Selamat!
Duration: 0:02:00

Kamu telah berhasil menyelesaikan Codelab fundamental Python ini! 🎉

### Rangkuman yang Telah Kamu Kuasai:
* ✅ Instalasi Python dan setup VS Code editor.
* ✅ Menggunakan variabel dan mengenali tipe data dasar (String, Integer, List, dsb).
* ✅ Membuat logika keputusan dengan `if-elif-else`.
* ✅ Menggunakan perulangan (`for` dan `while` loops).
* ✅ Membuat fungsi dinamis (`def`).
* ✅ Mengimpor modul bawaan (`random`) dan membuat mini-game logika interaktif.

### Langkah Selanjutnya:
Cobalah memodifikasi game Tebak Angka buatanmu agar memiliki batas maksimal nyawa/nyoba (misalnya maksimal hanya boleh salah 3 kali, jika lebih maka game over).

Teruslah belajar, eksplorasi library baru, dan *Happy Coding* dengan Python!
