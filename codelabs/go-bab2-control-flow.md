author: Qiscus Engineering Team
summary: Bab 2 - Kuasai Control Flow di Go: For loops, If/Else, Switch dengan penjelasan sederhana dan studi kasus nyata
id: go-bab2-control-flow
categories: golang,backend,fundamental,indonesia
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/feedback

# Go Bab 2: Control Flow

## Pengenalan
Duration: 0:03:00

Selamat datang di Bab 2! Di bab ini kita akan belajar mengontrol alur eksekusi program.

### Apa yang Akan Dipelajari

* 🔄 For Loops - Perulangan dalam berbagai bentuk
* ⚡ If/Else - Membuat keputusan
* 🔀 Switch - Alternatif untuk multiple if-else
* 💼 Studi Kasus - Sistem grading siswa

### Prasyarat

* Sudah menyelesaikan Bab 1
* Memahami variables dan values

Positive
: Control flow adalah kunci untuk membuat program yang dinamis dan interaktif!

## For Loops
Duration: 0:25:00

### Penjelasan Sederhana

Loop (perulangan) digunakan untuk menjalankan code berulang kali. Go hanya punya satu keyword untuk loop: `for`.

### 1. Classic For Loop

```go
package main

import "fmt"

func main() {
    // Struktur: for init; condition; post
    for i := 0; i < 5; i++ {
        fmt.Println("Iterasi ke-", i)
    }
}
```

**Output:**
```
Iterasi ke- 0
Iterasi ke- 1
Iterasi ke- 2
Iterasi ke- 3
Iterasi ke- 4
```

**Penjelasan:**
- `i := 0` - Inisialisasi (dijalankan sekali)
- `i < 5` - Kondisi (dicek setiap iterasi)
- `i++` - Post statement (dijalankan setiap akhir iterasi)

### 2. While-Style Loop

```go
package main

import "fmt"

func main() {
    // For tanpa init dan post (seperti while)
    i := 0
    for i < 5 {
        fmt.Println("Nilai i:", i)
        i++
    }
}
```

### 3. Infinite Loop

```go
package main

import "fmt"

func main() {
    count := 0
    
    // Loop tanpa kondisi = infinite
    for {
        fmt.Println("Count:", count)
        count++
        
        // Harus ada break untuk keluar
        if count >= 3 {
            break
        }
    }
    
    fmt.Println("Loop selesai")
}
```

### 4. Break dan Continue

```go
package main

import "fmt"

func main() {
    fmt.Println("=== BREAK ===")
    for i := 0; i < 10; i++ {
        if i == 5 {
            break  // Keluar dari loop
        }
        fmt.Print(i, " ")
    }
    
    fmt.Println("\n\n=== CONTINUE ===")
    for i := 0; i < 10; i++ {
        if i%2 == 0 {
            continue  // Skip ke iterasi berikutnya
        }
        fmt.Print(i, " ")  // Hanya print angka ganjil
    }
}
```

**Output:**
```
=== BREAK ===
0 1 2 3 4 

=== CONTINUE ===
1 3 5 7 9
```

### 5. Range Loop

```go
package main

import "fmt"

func main() {
    // Range over array/slice
    numbers := []int{10, 20, 30, 40, 50}
    
    fmt.Println("Dengan index dan value:")
    for index, value := range numbers {
        fmt.Printf("Index %d: %d\n", index, value)
    }
    
    // Hanya value
    fmt.Println("\nHanya value:")
    for _, value := range numbers {
        fmt.Println(value)
    }
    
    // Hanya index
    fmt.Println("\nHanya index:")
    for index := range numbers {
        fmt.Println(index)
    }
    
    // Range over string
    fmt.Println("\nRange over string:")
    for i, char := range "Hello" {
        fmt.Printf("%d: %c\n", i, char)
    }
}
```

### Contoh Praktis: Tabel Perkalian

```go
package main

import "fmt"

func main() {
    number := 7
    
    fmt.Printf("=== TABEL PERKALIAN %d ===\n\n", number)
    
    for i := 1; i <= 10; i++ {
        result := number * i
        fmt.Printf("%d × %d = %d\n", number, i, result)
    }
}
```

Negative
: Di Go tidak ada while atau do-while. Semua loop menggunakan `for`!

## If/Else Statements
Duration: 0:20:00

### Penjelasan Sederhana

If/else digunakan untuk membuat keputusan berdasarkan kondisi tertentu.

### 1. Basic If

```go
package main

import "fmt"

func main() {
    age := 20
    
    if age >= 18 {
        fmt.Println("Anda sudah dewasa")
    }
    
    if age < 18 {
        fmt.Println("Anda masih anak-anak")
    }
}
```

### 2. If-Else

```go
package main

import "fmt"

func main() {
    score := 75
    
    if score >= 60 {
        fmt.Println("LULUS")
    } else {
        fmt.Println("TIDAK LULUS")
    }
}
```

### 3. If-Else If-Else

```go
package main

import "fmt"

func main() {
    score := 85
    
    if score >= 90 {
        fmt.Println("Grade: A (Excellent!)")
    } else if score >= 80 {
        fmt.Println("Grade: B (Good!)")
    } else if score >= 70 {
        fmt.Println("Grade: C (Fair)")
    } else if score >= 60 {
        fmt.Println("Grade: D (Pass)")
    } else {
        fmt.Println("Grade: E (Fail)")
    }
}
```

### 4. If dengan Statement

```go
package main

import "fmt"

func main() {
    // Variable hanya ada di scope if
    if num := 9; num < 0 {
        fmt.Println(num, "is negative")
    } else if num < 10 {
        fmt.Println(num, "has 1 digit")
    } else {
        fmt.Println(num, "has multiple digits")
    }
    
    // num tidak bisa diakses di sini
}
```

### 5. Nested If

```go
package main

import "fmt"

func main() {
    age := 25
    hasLicense := true
    
    if age >= 17 {
        if hasLicense {
            fmt.Println("Boleh menyetir")
        } else {
            fmt.Println("Umur cukup, tapi belum punya SIM")
        }
    } else {
        fmt.Println("Umur belum cukup")
    }
}
```

### Contoh Praktis: Cek Bilangan

```go
package main

import "fmt"

func main() {
    numbers := []int{-5, 0, 7, 12, -3, 15}
    
    fmt.Println("=== ANALISIS BILANGAN ===\n")
    
    for _, num := range numbers {
        fmt.Printf("Bilangan %d: ", num)
        
        // Cek positif/negatif/nol
        if num > 0 {
            fmt.Print("Positif, ")
        } else if num < 0 {
            fmt.Print("Negatif, ")
        } else {
            fmt.Print("Nol, ")
        }
        
        // Cek genap/ganjil
        if num%2 == 0 {
            fmt.Println("Genap")
        } else {
            fmt.Println("Ganjil")
        }
    }
}
```

## Switch Statements
Duration: 0:20:00

### Penjelasan Sederhana

Switch adalah cara yang lebih clean untuk menulis multiple if-else. Lebih mudah dibaca dan di-maintain.

### 1. Basic Switch

```go
package main

import "fmt"

func main() {
    day := 3
    
    switch day {
    case 1:
        fmt.Println("Senin")
    case 2:
        fmt.Println("Selasa")
    case 3:
        fmt.Println("Rabu")
    case 4:
        fmt.Println("Kamis")
    case 5:
        fmt.Println("Jumat")
    case 6:
        fmt.Println("Sabtu")
    case 7:
        fmt.Println("Minggu")
    default:
        fmt.Println("Hari tidak valid")
    }
}
```

### 2. Multiple Conditions

```go
package main

import "fmt"

func main() {
    day := "Sabtu"
    
    switch day {
    case "Senin", "Selasa", "Rabu", "Kamis", "Jumat":
        fmt.Println("Hari kerja")
    case "Sabtu", "Minggu":
        fmt.Println("Weekend!")
    default:
        fmt.Println("Hari tidak valid")
    }
}
```

### 3. Switch Tanpa Expression

```go
package main

import "fmt"

func main() {
    score := 85
    
    // Switch tanpa expression (seperti if-else)
    switch {
    case score >= 90:
        fmt.Println("Grade: A")
    case score >= 80:
        fmt.Println("Grade: B")
    case score >= 70:
        fmt.Println("Grade: C")
    case score >= 60:
        fmt.Println("Grade: D")
    default:
        fmt.Println("Grade: E")
    }
}
```

### 4. Switch dengan Statement

```go
package main

import "fmt"

func main() {
    // Variable hanya ada di scope switch
    switch num := 15; {
    case num < 0:
        fmt.Println("Negatif")
    case num == 0:
        fmt.Println("Nol")
    case num < 10:
        fmt.Println("Satu digit")
    default:
        fmt.Println("Dua digit atau lebih")
    }
}
```

### 5. Type Switch

```go
package main

import "fmt"

func main() {
    var i interface{} = "hello"
    
    switch v := i.(type) {
    case int:
        fmt.Printf("Integer: %d\n", v)
    case string:
        fmt.Printf("String: %s\n", v)
    case bool:
        fmt.Printf("Boolean: %t\n", v)
    default:
        fmt.Printf("Unknown type: %T\n", v)
    }
}
```

### 6. Fallthrough

```go
package main

import "fmt"

func main() {
    num := 2
    
    switch num {
    case 1:
        fmt.Println("Satu")
    case 2:
        fmt.Println("Dua")
        fallthrough  // Lanjut ke case berikutnya
    case 3:
        fmt.Println("Tiga")
    default:
        fmt.Println("Lainnya")
    }
}
```

**Output:**
```
Dua
Tiga
```

Positive
: Switch di Go otomatis break setelah case match. Tidak perlu tulis `break` seperti di bahasa lain!

## Studi Kasus: Sistem Grading Siswa
Duration: 0:20:00

### Problem

Buat sistem untuk:
1. Input data siswa (nama dan nilai)
2. Tentukan grade berdasarkan nilai
3. Tentukan status kelulusan
4. Hitung statistik kelas

### Solusi Lengkap

```go
package main

import "fmt"

// Struct untuk siswa
type Student struct {
    name  string
    score int
}

func main() {
    fmt.Println("╔════════════════════════════════════╗")
    fmt.Println("║   SISTEM GRADING SISWA KELAS 10A  ║")
    fmt.Println("╚════════════════════════════════════╝")
    fmt.Println()
    
    // Data siswa
    students := []Student{
        {"Ahmad Fathullah", 92},
        {"Budi Santoso", 78},
        {"Citra Dewi", 85},
        {"Deni Pratama", 65},
        {"Eka Putri", 58},
        {"Fajar Ramadan", 95},
    }
    
    // Statistik
    totalScore := 0
    passCount := 0
    failCount := 0
    
    // Proses setiap siswa
    fmt.Println("HASIL PENILAIAN:")
    fmt.Println("────────────────────────────────────")
    
    for i, student := range students {
        fmt.Printf("\n%d. %s\n", i+1, student.name)
        fmt.Printf("   Nilai: %d\n", student.score)
        
        // Tentukan grade dengan switch
        var grade string
        var predikat string
        
        switch {
        case student.score >= 90:
            grade = "A"
            predikat = "Excellent!"
        case student.score >= 80:
            grade = "B"
            predikat = "Very Good"
        case student.score >= 70:
            grade = "C"
            predikat = "Good"
        case student.score >= 60:
            grade = "D"
            predikat = "Fair"
        default:
            grade = "E"
            predikat = "Need Improvement"
        }
        
        fmt.Printf("   Grade: %s (%s)\n", grade, predikat)
        
        // Tentukan status dengan if-else
        if student.score >= 60 {
            fmt.Println("   Status: ✓ LULUS")
            passCount++
        } else {
            fmt.Println("   Status: ✗ TIDAK LULUS")
            failCount++
        }
        
        // Tambah ke total
        totalScore += student.score
    }
    
    // Hitung rata-rata
    average := float64(totalScore) / float64(len(students))
    
    // Tampilkan statistik
    fmt.Println("\n════════════════════════════════════")
    fmt.Println("STATISTIK KELAS:")
    fmt.Println("────────────────────────────────────")
    fmt.Printf("Total Siswa    : %d orang\n", len(students))
    fmt.Printf("Lulus          : %d orang (%.1f%%)\n", 
        passCount, float64(passCount)/float64(len(students))*100)
    fmt.Printf("Tidak Lulus    : %d orang (%.1f%%)\n", 
        failCount, float64(failCount)/float64(len(students))*100)
    fmt.Printf("Rata-rata Nilai: %.2f\n", average)
    
    // Kategori kelas
    fmt.Println("\nKATEGORI KELAS:")
    switch {
    case average >= 85:
        fmt.Println("★★★ Kelas Unggulan")
    case average >= 75:
        fmt.Println("★★ Kelas Baik")
    case average >= 65:
        fmt.Println("★ Kelas Cukup")
    default:
        fmt.Println("Perlu Peningkatan")
    }
    
    fmt.Println("════════════════════════════════════")
}
```

### Output Program

```
╔════════════════════════════════════╗
║   SISTEM GRADING SISWA KELAS 10A  ║
╚════════════════════════════════════╝

HASIL PENILAIAN:
────────────────────────────────────

1. Ahmad Fathullah
   Nilai: 92
   Grade: A (Excellent!)
   Status: ✓ LULUS

2. Budi Santoso
   Nilai: 78
   Grade: C (Good)
   Status: ✓ LULUS

3. Citra Dewi
   Nilai: 85
   Grade: B (Very Good)
   Status: ✓ LULUS

4. Deni Pratama
   Nilai: 65
   Grade: D (Fair)
   Status: ✓ LULUS

5. Eka Putri
   Nilai: 58
   Grade: E (Need Improvement)
   Status: ✗ TIDAK LULUS

6. Fajar Ramadan
   Nilai: 95
   Grade: A (Excellent!)
   Status: ✓ LULUS

════════════════════════════════════
STATISTIK KELAS:
────────────────────────────────────
Total Siswa    : 6 orang
Lulus          : 5 orang (83.3%)
Tidak Lulus    : 1 orang (16.7%)
Rata-rata Nilai: 78.83

KATEGORI KELAS:
★★ Kelas Baik
════════════════════════════════════
```

### Latihan Tambahan

Coba modifikasi program untuk:
1. Tambah input dari user (scan)
2. Simpan hasil ke file
3. Tambah fitur cari siswa berdasarkan nama
4. Urutkan siswa berdasarkan nilai

## Ringkasan
Duration: 0:02:00

Selamat! Anda telah menyelesaikan Bab 2: Control Flow.

### Yang Sudah Dipelajari

✅ **For Loops** - Classic, while-style, infinite, range  
✅ **Break & Continue** - Kontrol flow dalam loop  
✅ **If/Else** - Conditional statements  
✅ **Switch** - Clean alternative untuk multiple if-else  
✅ **Studi Kasus** - Sistem grading siswa lengkap

### Key Takeaways

- Go hanya punya `for` untuk semua jenis loop
- Switch di Go otomatis break (tidak perlu tulis break)
- If bisa punya statement untuk variable lokal
- Range sangat berguna untuk iterate collections
- Switch tanpa expression bisa dipakai seperti if-else

### Langkah Selanjutnya

Lanjut ke **Bab 3: Data Structures** untuk belajar:
- Arrays
- Slices
- Maps
- Struct basics

### Resources

- [Go Control Flow](https://go.dev/tour/flowcontrol/)
- [Effective Go - Control Structures](https://go.dev/doc/effective_go#control-structures)

Positive
: Control flow adalah fondasi untuk membuat program yang dinamis. Praktik dengan berbagai variasi!
