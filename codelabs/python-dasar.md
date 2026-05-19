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

## 8. Pengantar Unit Testing
Duration: 0:08:00

Bayangkan kamu sedang membangun aplikasi kalkulator besar. Ketika kamu mengubah sebuah fungsi di baris 500, bagaimana kamu bisa yakin perubahan itu tidak merusak fungsi lain di baris 10? 

Disitulah **Unit Testing** bertindak sebagai penyelamat!

### Apa itu Unit Testing?
**Unit Testing** adalah proses pengujian otomatis terhadap bagian terkecil dari kode program kita—biasanya berupa sebuah fungsi (*function*) atau metode (*method*)—secara terisolasi. 

Tujuannya adalah memastikan bahwa untuk input tertentu, fungsi tersebut selalu menghasilkan output yang kita harapkan.

### Mengapa Unit Testing Sangat Penting?
1. **Mencegah Regresi (Bug Baru):** Saat kamu menambahkan fitur baru, unit test memastikan fitur lama tidak rusak.
2. **Mempermudah Refactoring:** Kamu bisa merapikan kodemu dengan percaya diri. Jika test tetap berwarna hijau (pass), artinya perilakunya tidak berubah.
3. **Dokumentasi Hidup:** Kode unit test berfungsi sebagai contoh nyata bagaimana cara memanggil dan menggunakan fungsi tersebut.

### Konsep Assertion (Pernyataan)
Inti dari testing adalah **Assertion**. Komputer akan membandingkan:
* **Actual Result:** Hasil yang dikeluarkan oleh fungsi aslimu saat dijalankan.
* **Expected Result:** Hasil yang seharusnya (kamu tentukan sendiri).

Jika `Actual == Expected`, tes dinyatakan **Lolos (Pass)**. Jika tidak, tes **Gagal (Fail)**.

---

## 9. Penerapan Unit Test dengan unittest
Duration: 0:15:00

Python sudah dibekali dengan library bawaan yang sangat powerful untuk urusan testing bernama **`unittest`**. Mari kita praktekkan langsung!

### Langkah 1: Buat Kode yang Akan Diuji
Buat file baru di folder VS Code-mu bernama `kalkulator.py` dan tulis kode fungsi matematika sederhana ini:

```python
def tambah(a, b):
    return a + b

def bagi(a, b):
    if b == 0:
        raise ValueError("Tidak dapat membagi dengan nol!")
    return a / b
```

### Langkah 2: Tulis File Test-nya
Buat file baru berdampingan bernama `test_kalkulator.py`. Import library `unittest` dan modul `kalkulator` yang baru kita buat:

```python
import unittest
import kalkulator

# Membuat Class Test yang mewarisi TestCase dari unittest
class TestKalkulator(unittest.TestCase):

    # Setiap method test WAJIB diawali dengan kata "test_"
    def test_tambah_positif(self):
        hasil = kalkulator.tambah(3, 5)
        self.assertEqual(hasil, 8) # Memastikan 3 + 5 = 8

    def test_tambah_negatif(self):
        hasil = kalkulator.tambah(-1, -1)
        self.assertEqual(hasil, -2) # Memastikan -1 + -1 = -2

    def test_bagi_normal(self):
        hasil = kalkulator.bagi(10, 2)
        self.assertEqual(hasil, 5.0)

    def test_bagi_nol(self):
        # Memastikan pemanggilan bagi(10, 0) menghasilkan ValueError
        with self.assertRaises(ValueError):
            kalkulator.bagi(10, 0)

if __name__ == '__main__':
    unittest.main()
```

### Langkah 3: Jalankan Tes-nya!
Buka terminal VS Code-mu, lalu jalankan perintah berikut:

```bash
python -m unittest test_kalkulator.py
```

Jika semuanya benar, terminal akan menampilkan output sukses seperti ini:
```text
....
----------------------------------------------------------------------
Ran 4 tests in 0.001s

OK
```
Tanda titik (`.`) merepresentasikan setiap test yang lolos. Jika ada tes yang gagal, terminal akan menampilkan tanda `F` (Fail) beserta letak baris kodenya agar kamu bisa langsung memperbaikinya!

---

## 10. Rangkuman Unit Testing
Duration: 0:05:00

Hebat! Kamu sekarang sudah memahami dasar pengujian otomatis. Mari kita rangkum poin-poin penting dari Unit Testing di Python:

### Aturan Emas Menulis Unit Test
1. **Nama Method Harus Diawali `test_`:** Library `unittest` hanya akan mendeteksi dan menjalankan method yang namanya berawalan `test_` (misalnya `test_hitung_luas`).
2. **Tes Harus Independen:** Satu test tidak boleh bergantung pada hasil dari test lainnya. Urutan eksekusi test bersifat acak.
3. **Fokus Satu Hal:** Pastikan tiap method test hanya menguji satu skenario spesifik agar jika terjadi kegagalan, kamu tahu persis bagian mana yang bermasalah.

### Macam-Macam Assertion yang Sering Digunakan
Di dalam `unittest.TestCase`, ada beberapa asersi bawaan yang bisa kamu pakai:

| Method Assertion | Kegunaan |
|---|---|
| `assertEqual(a, b)` | Memastikan `a == b` |
| `assertNotEqual(a, b)` | Memastikan `a != b` |
| `assertTrue(x)` | Memastikan nilai `x` adalah `True` |
| `assertFalse(x)` | Memastikan nilai `x` adalah `False` |
| `assertIn(item, list)` | Memastikan `item` ada di dalam koleksi/list |
| `assertRaises(Error)` | Memastikan fungsi melempar *exception* error tertentu |

---

## 11. Kuis Unit Testing
Duration: 0:08:00

Ayo uji pemahamanmu tentang Unit Testing dengan menjawab kuis singkat berikut!

### Pertanyaan 1
Di bawah ini, manakah penulisan nama fungsi unit test yang **benar** agar otomatis dijalankan oleh library `unittest`?
* A. `def hitung_luas_test(self):`
* B. `def test_hitung_luas(self):`
* C. `def pengujian_hitung_luas(self):`
* D. `def assert_hitung_luas(self):`

<details>
<summary>🔑 Klik untuk melihat Jawaban Benar</summary>
<strong>Jawaban Benar: B</strong>
<br>
<strong>Penjelasan:</strong> Library <code>unittest</code> secara default hanya mencari dan mengeksekusi metode yang namanya diawali secara eksplisit dengan kata <code>test_</code>.
</details>

### Pertanyaan 2
Asersi (assertion) manakah yang digunakan untuk memastikan bahwa sebuah fungsi melempar/menghasilkan error (Exception) yang kita harapkan saat diberi input yang salah?
* A. `self.assertEqual()`
* B. `self.assertError()`
* C. `self.assertRaises()`
* D. `self.assertFail()`

<details>
<summary>🔑 Klik untuk melihat Jawaban Benar</summary>
<strong>Jawaban Benar: C</strong>
<br>
<strong>Penjelasan:</strong> Kita menggunakan context manager <code>with self.assertRaises(ErrorType):</code> untuk memverifikasi bahwa potongan kode tertentu memicu error/exception yang diharapkan.
</details>

### Pertanyaan 3
Apakah unit test yang baik diperbolehkan saling bergantung satu sama lain (misal: Test B hanya bisa jalan jika Test A berhasil)?
* A. Ya, agar menghemat baris kode.
* B. Ya, karena urutan tes selalu berurutan dari atas ke bawah.
* C. Tidak, semua test harus independen dan terisolasi agar dapat dijalankan secara acak dan fokus pada satu tanggung jawab saja.
* D. Tidak, kecuali jika menggunakan database eksternal.

<details>
<summary>🔑 Klik untuk melihat Jawaban Benar</summary>
<strong>Jawaban Benar: C</strong>
<br>
<strong>Penjelasan:</strong> Sifat unit test wajib independen dan terisolasi. Ketergantungan antar-test akan mempersulit debugging saat terjadi error.
</details>

---

## 12. Challenge: Game Tebak Angka!
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

---

## 13. Selamat!
Duration: 0:02:00

Kamu telah berhasil menyelesaikan Codelab fundamental Python ini! 🎉

### Rangkuman yang Telah Kamu Kuasai:
* ✅ Instalasi Python dan setup VS Code editor.
* ✅ Menggunakan variabel dan mengenali tipe data dasar (String, Integer, List, dsb).
* ✅ Membuat logika keputusan dengan `if-elif-else`.
* ✅ Menggunakan perulangan (`for` dan `while` loops).
* ✅ Membuat fungsi dinamis (`def`).
* ✅ Mengimpor modul bawaan (`random`) dan membuat mini-game logika interaktif.
* ✅ **Menerapkan konsep Unit Testing menggunakan library bawaan `unittest` untuk menguji fungsionalitas kode secara otomatis!**

### Langkah Selanjutnya:
Cobalah memodifikasi game Tebak Angka buatanmu agar memiliki batas maksimal nyawa/nyoba (misalnya maksimal hanya boleh salah 3 kali, jika lebih maka game over), lalu buatlah **unit test** sederhana untuk memverifikasi logika pengurangan nyawa pemain tersebut!

Teruslah belajar, eksplorasi library baru, dan *Happy Coding* dengan Python!

