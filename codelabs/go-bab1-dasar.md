author: Qiscus Engineering Team
summary: Bab 1 - Pelajari dasar-dasar Go: Hello World, Values, Variables, dan Constants dengan penjelasan sederhana dan studi kasus
id: go-bab1-dasar
categories: golang,backend,fundamental,indonesia
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/feedback

# Go Bab 1: Dasar-dasar Go

## Pengenalan
Duration: 0:03:00

Selamat datang di Bab 1 dari series Go Fundamental! Di bab ini kita akan mempelajari fondasi dasar bahasa Go.

### Apa yang Akan Dipelajari

* 🎯 Hello World - Program pertama Anda
* 📊 Values - Tipe data dasar
* 📦 Variables - Menyimpan dan mengubah data
* 🔒 Constants - Nilai yang tidak berubah
* 💼 Studi Kasus - Kalkulator sederhana

### Prasyarat

* Go terinstall (versi 1.16+)
* Text editor (VS Code recommended)
* Terminal/Command Prompt

Positive
: Bab ini adalah fondasi untuk semua bab selanjutnya. Pastikan Anda memahami setiap konsep!

## Hello World
Duration: 0:10:00

### Penjelasan Sederhana

Program "Hello World" adalah tradisi dalam programming. Ini adalah program paling sederhana yang menampilkan teks ke layar.

### Struktur Program Go

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

### Penjelasan Baris per Baris

**Line 1: `package main`**
- Setiap file Go harus dimulai dengan `package`
- `main` adalah package khusus untuk program yang bisa dijalankan
- Package lain digunakan untuk library

**Line 3: `import "fmt"`**
- `import` untuk menggunakan package lain
- `fmt` adalah package untuk formatting dan printing
- Singkatan dari "format"

**Line 5: `func main()`**
- `func` untuk mendefinisikan function
- `main()` adalah entry point program
- Program dimulai dari sini

**Line 6: `fmt.Println(...)`**
- `Println` = Print Line
- Menampilkan text dan pindah baris baru
- Dari package `fmt`

### Cara Menjalankan

```bash
# Simpan sebagai hello.go
go run hello.go

# Atau compile dulu
go build hello.go
./hello
```

### Variasi Hello World

```go
package main

import "fmt"

func main() {
    // Println - dengan newline
    fmt.Println("Hello, World!")
    
    // Print - tanpa newline
    fmt.Print("Hello, ")
    fmt.Print("World!\n")
    
    // Printf - dengan formatting
    name := "Fathullah"
    fmt.Printf("Hello, %s!\n", name)
}
```

Negative
: Jangan lupa `package main` dan `func main()` - tanpa ini program tidak bisa dijalankan!

## Values (Nilai)
Duration: 0:15:00

### Penjelasan Sederhana

Values adalah data yang digunakan dalam program. Go punya berbagai tipe data untuk berbagai keperluan.

### Tipe Data Dasar

#### 1. String (Text)

```go
package main

import "fmt"

func main() {
    // String dengan double quotes
    fmt.Println("Hello, World!")
    
    // Concatenation (gabung string)
    fmt.Println("Hello" + " " + "World")
    
    // Multi-line string dengan backticks
    message := `Ini adalah
    string multi-line
    yang panjang`
    fmt.Println(message)
}
```

#### 2. Integer (Bilangan Bulat)

```go
package main

import "fmt"

func main() {
    // Operasi matematika
    fmt.Println("1 + 1 =", 1+1)
    fmt.Println("7 - 3 =", 7-3)
    fmt.Println("5 * 2 =", 5*2)
    fmt.Println("10 / 3 =", 10/3)  // Integer division
    fmt.Println("10 % 3 =", 10%3)  // Modulus (sisa bagi)
    
    // Tipe integer
    var a int = 42        // Platform dependent (32 or 64 bit)
    var b int8 = 127      // -128 to 127
    var c int16 = 32767   // -32768 to 32767
    var d uint = 42       // Unsigned (hanya positif)
    
    fmt.Println(a, b, c, d)
}
```

#### 3. Float (Bilangan Desimal)

```go
package main

import "fmt"

func main() {
    // Float operations
    fmt.Println("7.0 / 3.0 =", 7.0/3.0)
    fmt.Println("3.14 * 2 =", 3.14*2)
    
    // Tipe float
    var x float32 = 3.14
    var y float64 = 3.141592653589793
    
    fmt.Printf("float32: %.2f\n", x)
    fmt.Printf("float64: %.15f\n", y)
}
```

#### 4. Boolean (True/False)

```go
package main

import "fmt"

func main() {
    // Boolean values
    fmt.Println(true)
    fmt.Println(false)
    
    // Logical operators
    fmt.Println("true && false =", true && false)  // AND
    fmt.Println("true || false =", true || false)  // OR
    fmt.Println("!true =", !true)                  // NOT
    
    // Comparison
    fmt.Println("5 > 3 =", 5 > 3)
    fmt.Println("5 < 3 =", 5 < 3)
    fmt.Println("5 == 5 =", 5 == 5)
    fmt.Println("5 != 3 =", 5 != 3)
}
```

### Contoh Lengkap

```go
package main

import "fmt"

func main() {
    fmt.Println("=== TIPE DATA GO ===\n")
    
    // String
    fmt.Println("STRING:")
    fmt.Println("Nama:", "Ahmad Fathullah")
    
    // Integer
    fmt.Println("\nINTEGER:")
    fmt.Println("Umur:", 25)
    fmt.Println("Tahun:", 2024)
    
    // Float
    fmt.Println("\nFLOAT:")
    fmt.Println("Tinggi:", 175.5, "cm")
    fmt.Println("Berat:", 68.3, "kg")
    
    // Boolean
    fmt.Println("\nBOOLEAN:")
    fmt.Println("Sudah menikah:", false)
    fmt.Println("Punya SIM:", true)
}
```

## Variables (Variabel)
Duration: 0:20:00

### Penjelasan Sederhana

Variable adalah "kotak" untuk menyimpan data yang bisa berubah. Seperti wadah yang bisa diisi dan diganti isinya.

### Cara Deklarasi Variable

#### 1. Dengan `var` dan Tipe Data

```go
package main

import "fmt"

func main() {
    // Deklarasi dengan tipe
    var name string = "Fathullah"
    var age int = 25
    var height float64 = 175.5
    var isStudent bool = true
    
    fmt.Println("Nama:", name)
    fmt.Println("Umur:", age)
    fmt.Println("Tinggi:", height)
    fmt.Println("Mahasiswa:", isStudent)
}
```

#### 2. Type Inference (Otomatis)

```go
package main

import "fmt"

func main() {
    // Go bisa menebak tipe data
    var name = "Fathullah"      // string
    var age = 25                // int
    var height = 175.5          // float64
    var isStudent = true        // bool
    
    fmt.Printf("%T: %v\n", name, name)
    fmt.Printf("%T: %v\n", age, age)
    fmt.Printf("%T: %v\n", height, height)
    fmt.Printf("%T: %v\n", isStudent, isStudent)
}
```

#### 3. Short Declaration (Paling Umum)

```go
package main

import "fmt"

func main() {
    // Cara paling singkat dengan :=
    name := "Fathullah"
    age := 25
    city := "Jakarta"
    
    fmt.Println(name, age, city)
    
    // Hanya bisa di dalam function
    // Tidak bisa di level package
}
```

### Multiple Variables

```go
package main

import "fmt"

func main() {
    // Deklarasi multiple variables
    var x, y int = 1, 2
    fmt.Println(x, y)
    
    // Dengan short declaration
    a, b, c := 10, 20, 30
    fmt.Println(a, b, c)
    
    // Berbeda tipe
    name, age := "Ahmad", 25
    fmt.Println(name, age)
    
    // Group declaration
    var (
        firstName = "Ahmad"
        lastName  = "Fathullah"
        yearBorn  = 1999
    )
    fmt.Println(firstName, lastName, yearBorn)
}
```

### Update Variable

```go
package main

import "fmt"

func main() {
    // Deklarasi
    score := 75
    fmt.Println("Score awal:", score)
    
    // Update
    score = 85
    fmt.Println("Score baru:", score)
    
    // Increment
    score = score + 5
    fmt.Println("Setelah +5:", score)
    
    // Shorthand operators
    score += 10  // score = score + 10
    fmt.Println("Setelah +=10:", score)
    
    score++      // score = score + 1
    fmt.Println("Setelah ++:", score)
}
```

### Zero Values

```go
package main

import "fmt"

func main() {
    // Variable tanpa nilai awal punya "zero value"
    var i int
    var f float64
    var b bool
    var s string
    
    fmt.Printf("int: %v\n", i)       // 0
    fmt.Printf("float64: %v\n", f)   // 0
    fmt.Printf("bool: %v\n", b)      // false
    fmt.Printf("string: %q\n", s)    // ""
}
```

## Constants (Konstanta)
Duration: 0:15:00

### Penjelasan Sederhana

Constant adalah nilai yang **tidak bisa diubah** setelah dideklarasikan. Berguna untuk nilai tetap seperti Pi, nama aplikasi, atau konfigurasi.

### Deklarasi Constant

```go
package main

import "fmt"

// Constant di level package
const Pi = 3.14159
const AppName = "MyApp"
const Version = "1.0.0"

func main() {
    fmt.Println("Pi:", Pi)
    fmt.Println("App:", AppName, "v"+Version)
    
    // Pi = 3.14  // Error! Tidak bisa diubah
    
    // Constant di dalam function
    const MaxUsers = 100
    fmt.Println("Max users:", MaxUsers)
}
```

### Grouped Constants

```go
package main

import "fmt"

const (
    StatusOK       = 200
    StatusNotFound = 404
    StatusError    = 500
)

const (
    Monday    = 1
    Tuesday   = 2
    Wednesday = 3
    Thursday  = 4
    Friday    = 5
)

func main() {
    fmt.Println("HTTP Status OK:", StatusOK)
    fmt.Println("Hari Jumat:", Friday)
}
```

### Typed vs Untyped Constants

```go
package main

import "fmt"

func main() {
    // Untyped constant (flexible)
    const a = 42
    var i int = a
    var f float64 = a
    fmt.Println(i, f)
    
    // Typed constant (strict)
    const b int = 42
    var j int = b
    // var g float64 = b  // Error! Type mismatch
    fmt.Println(j)
}
```

### Constant Expressions

```go
package main

import "fmt"

const (
    // Bisa pakai expression
    SecondsPerMinute = 60
    MinutesPerHour   = 60
    SecondsPerHour   = SecondsPerMinute * MinutesPerHour
    
    // Bisa pakai operasi
    KB = 1024
    MB = KB * 1024
    GB = MB * 1024
)

func main() {
    fmt.Println("1 jam =", SecondsPerHour, "detik")
    fmt.Println("1 GB =", GB, "bytes")
}
```

### iota (Auto Increment)

```go
package main

import "fmt"

const (
    Sunday = iota     // 0
    Monday            // 1
    Tuesday           // 2
    Wednesday         // 3
    Thursday          // 4
    Friday            // 5
    Saturday          // 6
)

const (
    _  = iota         // Skip 0
    KB = 1 << (10 * iota)  // 1 << 10 = 1024
    MB                      // 1 << 20 = 1048576
    GB                      // 1 << 30 = 1073741824
)

func main() {
    fmt.Println("Friday:", Friday)
    fmt.Println("1 MB:", MB, "bytes")
}
```

Positive
: Gunakan constants untuk nilai yang tidak berubah seperti konfigurasi, status code, atau konstanta matematika!

## Studi Kasus: Kalkulator Persegi Panjang
Duration: 0:15:00

### Problem

Buat program kalkulator untuk menghitung luas dan keliling persegi panjang dengan fitur:
- Menampilkan informasi aplikasi
- Input panjang dan lebar
- Hitung luas dan keliling
- Format output yang rapi

### Solusi Lengkap

```go
package main

import "fmt"

// Constants untuk aplikasi
const (
    AppName    = "Kalkulator Persegi Panjang"
    Version    = "1.0.0"
    Author     = "Qiscus Engineering Team"
    Separator  = "================================"
)

func main() {
    // Header aplikasi
    fmt.Println(Separator)
    fmt.Println(AppName)
    fmt.Println("Version:", Version)
    fmt.Println("By:", Author)
    fmt.Println(Separator)
    fmt.Println()
    
    // Input data (dalam cm)
    panjang := 15.0
    lebar := 8.0
    
    fmt.Println("INPUT:")
    fmt.Printf("Panjang: %.2f cm\n", panjang)
    fmt.Printf("Lebar: %.2f cm\n", lebar)
    fmt.Println()
    
    // Perhitungan
    luas := panjang * lebar
    keliling := 2 * (panjang + lebar)
    
    // Output hasil
    fmt.Println("HASIL PERHITUNGAN:")
    fmt.Println(Separator)
    fmt.Printf("Luas       : %.2f cm²\n", luas)
    fmt.Printf("Keliling   : %.2f cm\n", keliling)
    fmt.Println(Separator)
    
    // Informasi tambahan
    fmt.Println("\nINFORMASI TAMBAHAN:")
    diagonal := calculateDiagonal(panjang, lebar)
    fmt.Printf("Diagonal   : %.2f cm\n", diagonal)
    
    // Kategori berdasarkan luas
    var kategori string
    if luas < 50 {
        kategori = "Kecil"
    } else if luas < 100 {
        kategori = "Sedang"
    } else {
        kategori = "Besar"
    }
    fmt.Printf("Kategori   : %s\n", kategori)
}

// Helper function untuk hitung diagonal
func calculateDiagonal(p, l float64) float64 {
    // Menggunakan teorema Pythagoras: c² = a² + b²
    return sqrt(p*p + l*l)
}

// Simple square root approximation
func sqrt(x float64) float64 {
    z := 1.0
    for i := 0; i < 10; i++ {
        z -= (z*z - x) / (2 * z)
    }
    return z
}
```

### Output Program

```
================================
Kalkulator Persegi Panjang
Version: 1.0.0
By: Qiscus Engineering Team
================================

INPUT:
Panjang: 15.00 cm
Lebar: 8.00 cm

HASIL PERHITUNGAN:
================================
Luas       : 120.00 cm²
Keliling   : 46.00 cm
================================

INFORMASI TAMBAHAN:
Diagonal   : 17.00 cm
Kategori   : Besar
```

### Penjelasan Code

1. **Constants** - Untuk info aplikasi yang tidak berubah
2. **Variables** - Untuk data yang bisa berubah (panjang, lebar)
3. **Calculations** - Operasi matematika sederhana
4. **Formatting** - Printf untuk output yang rapi
5. **Functions** - Helper function untuk diagonal

### Latihan

Coba modifikasi program untuk:
1. Tambah input tinggi (untuk balok)
2. Hitung volume balok
3. Tambah kategori berdasarkan volume
4. Format output dengan warna (optional)

## Ringkasan
Duration: 0:02:00

Selamat! Anda telah menyelesaikan Bab 1: Dasar-dasar Go.

### Yang Sudah Dipelajari

✅ **Hello World** - Struktur program Go dasar  
✅ **Values** - String, Integer, Float, Boolean  
✅ **Variables** - var, type inference, short declaration  
✅ **Constants** - const, grouped constants, iota  
✅ **Studi Kasus** - Kalkulator persegi panjang

### Key Takeaways

- Setiap program Go dimulai dengan `package main` dan `func main()`
- Gunakan `:=` untuk deklarasi variable yang singkat
- Gunakan `const` untuk nilai yang tidak berubah
- Go punya type inference yang smart
- Zero values: int=0, float=0, bool=false, string=""

### Langkah Selanjutnya

Lanjut ke **Bab 2: Control Flow** untuk belajar:
- For loops
- If/Else statements
- Switch cases
- Flow control patterns

### Resources

- [Go Tour](https://go.dev/tour/)
- [Go by Example](https://gobyexample.com/)
- [Go Documentation](https://go.dev/doc/)

Positive
: Praktik membuat sempurna! Coba buat variasi dari studi kasus untuk memperdalam pemahaman.
