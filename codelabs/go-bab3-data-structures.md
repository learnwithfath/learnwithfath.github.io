author: Qiscus Engineering Team
summary: Bab 3 - Kuasai Data Structures di Go: Arrays, Slices, Maps dengan penjelasan sederhana dan studi kasus inventori toko
id: go-bab3-data-structures
categories: golang,backend,fundamental,indonesia
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/feedback

# Go Bab 3: Data Structures

## Pengenalan
Duration: 0:03:00

Selamat datang di Bab 3! Di bab ini kita akan belajar menyimpan dan mengelola koleksi data.

### Apa yang Akan Dipelajari

* 📊 Arrays - Koleksi dengan ukuran tetap
* 🔄 Slices - Koleksi dinamis yang flexible
* 🗺️ Maps - Key-value pairs (dictionary)
* 💼 Studi Kasus - Sistem inventori toko

### Prasyarat

* Sudah menyelesaikan Bab 1 & 2
* Memahami loops dan control flow

Positive
: Data structures adalah fondasi untuk menyimpan dan mengelola data dalam aplikasi!

## Arrays
Duration: 0:20:00

### Penjelasan Sederhana

Array adalah koleksi dengan **ukuran tetap** dan semua elemen harus **tipe data yang sama**.

### 1. Deklarasi Array

```go
package main

import "fmt"

func main() {
    // Deklarasi array kosong
    var numbers [5]int
    fmt.Println("Empty array:", numbers)  // [0 0 0 0 0]
    
    // Array dengan nilai awal
    var fruits [3]string = [3]string{"Apple", "Banana", "Orange"}
    fmt.Println("Fruits:", fruits)
    
    // Short declaration
    colors := [4]string{"Red", "Green", "Blue", "Yellow"}
    fmt.Println("Colors:", colors)
    
    // Auto length dengan ...
    days := [...]string{"Mon", "Tue", "Wed", "Thu", "Fri"}
    fmt.Println("Days:", days)
    fmt.Println("Length:", len(days))
}
```

### 2. Akses dan Modifikasi

```go
package main

import "fmt"

func main() {
    numbers := [5]int{10, 20, 30, 40, 50}
    
    // Akses element
    fmt.Println("Element 0:", numbers[0])
    fmt.Println("Element 2:", numbers[2])
    
    // Modifikasi element
    numbers[1] = 25
    fmt.Println("After modify:", numbers)
    
    // Length
    fmt.Println("Length:", len(numbers))
    
    // Loop through array
    fmt.Println("\nAll elements:")
    for i := 0; i < len(numbers); i++ {
        fmt.Printf("Index %d: %d\n", i, numbers[i])
    }
    
    // Range loop
    fmt.Println("\nWith range:")
    for index, value := range numbers {
        fmt.Printf("%d: %d\n", index, value)
    }
}
```

### 3. Multi-Dimensional Arrays

```go
package main

import "fmt"

func main() {
    // 2D Array (matrix)
    var matrix [3][3]int
    
    // Set values
    matrix[0][0] = 1
    matrix[0][1] = 2
    matrix[0][2] = 3
    matrix[1][0] = 4
    matrix[1][1] = 5
    matrix[1][2] = 6
    matrix[2][0] = 7
    matrix[2][1] = 8
    matrix[2][2] = 9
    
    // Print matrix
    fmt.Println("Matrix:")
    for i := 0; i < 3; i++ {
        for j := 0; j < 3; j++ {
            fmt.Printf("%d ", matrix[i][j])
        }
        fmt.Println()
    }
    
    // 2D Array dengan nilai awal
    grid := [2][3]int{
        {1, 2, 3},
        {4, 5, 6},
    }
    fmt.Println("\nGrid:", grid)
}
```

### 4. Array Comparison

```go
package main

import "fmt"

func main() {
    a := [3]int{1, 2, 3}
    b := [3]int{1, 2, 3}
    c := [3]int{1, 2, 4}
    
    fmt.Println("a == b:", a == b)  // true
    fmt.Println("a == c:", a == c)  // false
    
    // Array adalah value type (di-copy)
    d := a
    d[0] = 100
    fmt.Println("a:", a)  // [1 2 3] - tidak berubah
    fmt.Println("d:", d)  // [100 2 3]
}
```

Negative
: Array memiliki ukuran tetap! Setelah dibuat, ukurannya tidak bisa diubah.

## Slices
Duration: 0:30:00

### Penjelasan Sederhana

Slice adalah versi **dinamis** dari array. Ukurannya bisa bertambah atau berkurang. Slice adalah tipe data yang paling sering digunakan di Go.

### 1. Membuat Slice

```go
package main

import "fmt"

func main() {
    // Slice literal
    numbers := []int{1, 2, 3, 4, 5}
    fmt.Println("Numbers:", numbers)
    
    // Empty slice
    var fruits []string
    fmt.Println("Empty slice:", fruits)
    fmt.Println("Length:", len(fruits))
    fmt.Println("Is nil:", fruits == nil)
    
    // Make slice dengan length
    colors := make([]string, 3)
    fmt.Println("Make slice:", colors)  // ["" "" ""]
    
    // Make slice dengan length dan capacity
    scores := make([]int, 3, 5)
    fmt.Println("Scores:", scores)
    fmt.Println("Length:", len(scores))
    fmt.Println("Capacity:", cap(scores))
}
```

### 2. Append (Menambah Element)

```go
package main

import "fmt"

func main() {
    // Start dengan empty slice
    var numbers []int
    fmt.Println("Initial:", numbers)
    
    // Append satu element
    numbers = append(numbers, 10)
    fmt.Println("After append 10:", numbers)
    
    // Append multiple elements
    numbers = append(numbers, 20, 30, 40)
    fmt.Println("After append multiple:", numbers)
    
    // Append slice ke slice
    moreNumbers := []int{50, 60, 70}
    numbers = append(numbers, moreNumbers...)
    fmt.Println("After append slice:", numbers)
    
    fmt.Println("Final length:", len(numbers))
    fmt.Println("Final capacity:", cap(numbers))
}
```

### 3. Slicing (Memotong Slice)

```go
package main

import "fmt"

func main() {
    numbers := []int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
    
    fmt.Println("Original:", numbers)
    
    // Slice [start:end] - end tidak termasuk
    fmt.Println("numbers[2:5]:", numbers[2:5])    // [2 3 4]
    fmt.Println("numbers[:4]:", numbers[:4])      // [0 1 2 3]
    fmt.Println("numbers[5:]:", numbers[5:])      // [5 6 7 8 9]
    fmt.Println("numbers[:]:", numbers[:])        // [0 1 2 3 4 5 6 7 8 9]
    
    // Slice dengan step (tidak ada syntax khusus, harus manual)
    evens := []int{}
    for i := 0; i < len(numbers); i += 2 {
        evens = append(evens, numbers[i])
    }
    fmt.Println("Evens:", evens)
}
```

### 4. Copy Slice

```go
package main

import "fmt"

func main() {
    source := []int{1, 2, 3, 4, 5}
    
    // Cara 1: Make dan copy
    dest1 := make([]int, len(source))
    copy(dest1, source)
    fmt.Println("Dest1:", dest1)
    
    // Cara 2: Append ke empty slice
    dest2 := append([]int{}, source...)
    fmt.Println("Dest2:", dest2)
    
    // Modifikasi dest tidak affect source
    dest1[0] = 100
    fmt.Println("Source:", source)  // [1 2 3 4 5]
    fmt.Println("Dest1:", dest1)    // [100 2 3 4 5]
}
```

### 5. Remove Element

```go
package main

import "fmt"

func main() {
    numbers := []int{10, 20, 30, 40, 50}
    fmt.Println("Original:", numbers)
    
    // Remove element at index 2 (30)
    index := 2
    numbers = append(numbers[:index], numbers[index+1:]...)
    fmt.Println("After remove index 2:", numbers)
    
    // Remove first element
    numbers = numbers[1:]
    fmt.Println("After remove first:", numbers)
    
    // Remove last element
    numbers = numbers[:len(numbers)-1]
    fmt.Println("After remove last:", numbers)
}
```

### 6. Slice Tricks

```go
package main

import "fmt"

func main() {
    // Insert element
    numbers := []int{1, 2, 4, 5}
    index := 2
    value := 3
    numbers = append(numbers[:index], append([]int{value}, numbers[index:]...)...)
    fmt.Println("After insert:", numbers)  // [1 2 3 4 5]
    
    // Reverse slice
    original := []int{1, 2, 3, 4, 5}
    reversed := make([]int, len(original))
    for i, v := range original {
        reversed[len(original)-1-i] = v
    }
    fmt.Println("Reversed:", reversed)
    
    // Filter slice
    numbers2 := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
    evens := []int{}
    for _, num := range numbers2 {
        if num%2 == 0 {
            evens = append(evens, num)
        }
    }
    fmt.Println("Evens:", evens)
}
```

Positive
: Slice adalah tipe data yang paling sering digunakan untuk koleksi di Go!

## Maps
Duration: 0:25:00

### Penjelasan Sederhana

Map adalah koleksi **key-value pairs**. Seperti dictionary di Python atau object di JavaScript.

### 1. Membuat Map

```go
package main

import "fmt"

func main() {
    // Make map
    ages := make(map[string]int)
    fmt.Println("Empty map:", ages)
    
    // Map literal
    scores := map[string]int{
        "Ahmad": 85,
        "Budi":  90,
        "Citra": 78,
    }
    fmt.Println("Scores:", scores)
    
    // Map dengan berbagai tipe
    person := map[string]interface{}{
        "name": "Ahmad",
        "age":  25,
        "city": "Jakarta",
    }
    fmt.Println("Person:", person)
}
```

### 2. Operasi Dasar Map

```go
package main

import "fmt"

func main() {
    // Buat map
    fruits := make(map[string]int)
    
    // Set values
    fruits["apple"] = 5
    fruits["banana"] = 3
    fruits["orange"] = 7
    fmt.Println("Fruits:", fruits)
    
    // Get value
    appleCount := fruits["apple"]
    fmt.Println("Apple count:", appleCount)
    
    // Get non-existent key (returns zero value)
    grapeCount := fruits["grape"]
    fmt.Println("Grape count:", grapeCount)  // 0
    
    // Check if key exists
    value, exists := fruits["apple"]
    if exists {
        fmt.Println("Apple exists:", value)
    }
    
    _, exists = fruits["grape"]
    if !exists {
        fmt.Println("Grape doesn't exist")
    }
    
    // Update value
    fruits["apple"] = 10
    fmt.Println("After update:", fruits)
    
    // Delete key
    delete(fruits, "banana")
    fmt.Println("After delete:", fruits)
    
    // Length
    fmt.Println("Length:", len(fruits))
}
```

### 3. Iterate Map

```go
package main

import "fmt"

func main() {
    scores := map[string]int{
        "Ahmad": 85,
        "Budi":  90,
        "Citra": 78,
        "Deni":  92,
    }
    
    // Iterate key-value
    fmt.Println("All scores:")
    for name, score := range scores {
        fmt.Printf("%s: %d\n", name, score)
    }
    
    // Only keys
    fmt.Println("\nOnly names:")
    for name := range scores {
        fmt.Println(name)
    }
    
    // Only values
    fmt.Println("\nOnly scores:")
    for _, score := range scores {
        fmt.Println(score)
    }
}
```

### 4. Map dengan Struct Value

```go
package main

import "fmt"

type Student struct {
    name  string
    age   int
    grade string
}

func main() {
    // Map dengan struct value
    students := map[string]Student{
        "S001": {"Ahmad", 20, "A"},
        "S002": {"Budi", 21, "B"},
        "S003": {"Citra", 20, "A"},
    }
    
    // Access
    fmt.Println("Student S001:", students["S001"])
    
    // Iterate
    fmt.Println("\nAll students:")
    for id, student := range students {
        fmt.Printf("%s: %s (%d years) - Grade %s\n", 
            id, student.name, student.age, student.grade)
    }
    
    // Add new student
    students["S004"] = Student{"Deni", 22, "B"}
    fmt.Println("\nAfter add:", len(students), "students")
}
```

### 5. Nested Maps

```go
package main

import "fmt"

func main() {
    // Map of maps
    grades := map[string]map[string]int{
        "Ahmad": {
            "Math":    85,
            "English": 90,
            "Science": 88,
        },
        "Budi": {
            "Math":    78,
            "English": 82,
            "Science": 80,
        },
    }
    
    // Access nested value
    fmt.Println("Ahmad's Math:", grades["Ahmad"]["Math"])
    
    // Iterate nested map
    for student, subjects := range grades {
        fmt.Printf("\n%s's grades:\n", student)
        for subject, grade := range subjects {
            fmt.Printf("  %s: %d\n", subject, grade)
        }
    }
}
```

Negative
: Map tidak terurut! Iterasi map bisa menghasilkan urutan yang berbeda setiap kali.

## Studi Kasus: Sistem Inventori Toko
Duration: 0:25:00

### Problem

Buat sistem inventori toko dengan fitur:
1. Tambah produk baru
2. Update stok produk
3. Jual produk (kurangi stok)
4. Tampilkan semua produk
5. Cari produk berdasarkan ID
6. Hitung total nilai inventori

### Solusi Lengkap

```go
package main

import "fmt"

// Struct untuk produk
type Product struct {
    id    string
    name  string
    price float64
    stock int
}

// Struct untuk transaksi
type Transaction struct {
    productID string
    quantity  int
    total     float64
}

func main() {
    fmt.Println("╔═══════════════════════════════════════╗")
    fmt.Println("║     SISTEM INVENTORI TOKO ELEKTRONIK  ║")
    fmt.Println("╚═══════════════════════════════════════╝")
    fmt.Println()
    
    // Inventori menggunakan map
    inventory := make(map[string]Product)
    
    // Tambah produk awal
    inventory["P001"] = Product{"P001", "Laptop ASUS", 10000000, 5}
    inventory["P002"] = Product{"P002", "Mouse Logitech", 150000, 20}
    inventory["P003"] = Product{"P003", "Keyboard Mechanical", 500000, 15}
    inventory["P004"] = Product{"P004", "Monitor LG 24\"", 2000000, 8}
    inventory["P005"] = Product{"P005", "Webcam HD", 300000, 12}
    
    // Riwayat transaksi
    var transactions []Transaction
    
    // Tampilkan semua produk
    displayInventory(inventory)
    
    // Simulasi transaksi penjualan
    fmt.Println("\n📦 TRANSAKSI PENJUALAN:")
    fmt.Println("─────────────────────────────────────────")
    
    // Transaksi 1
    if product, ok := inventory["P001"]; ok {
        qty := 2
        if product.stock >= qty {
            product.stock -= qty
            inventory["P001"] = product
            
            transaction := Transaction{
                productID: "P001",
                quantity:  qty,
                total:     float64(qty) * product.price,
            }
            transactions = append(transactions, transaction)
            
            fmt.Printf("✓ Terjual: %d %s = Rp %.0f\n", 
                qty, product.name, transaction.total)
        }
    }
    
    // Transaksi 2
    if product, ok := inventory["P002"]; ok {
        qty := 5
        if product.stock >= qty {
            product.stock -= qty
            inventory["P002"] = product
            
            transaction := Transaction{
                productID: "P002",
                quantity:  qty,
                total:     float64(qty) * product.price,
            }
            transactions = append(transactions, transaction)
            
            fmt.Printf("✓ Terjual: %d %s = Rp %.0f\n", 
                qty, product.name, transaction.total)
        }
    }
    
    // Transaksi 3 - Stok tidak cukup
    if product, ok := inventory["P004"]; ok {
        qty := 10
        if product.stock >= qty {
            product.stock -= qty
            inventory["P004"] = product
        } else {
            fmt.Printf("✗ Stok %s tidak cukup (tersedia: %d, diminta: %d)\n", 
                product.name, product.stock, qty)
        }
    }
    
    // Tampilkan stok terkini
    fmt.Println("\n📊 STOK TERKINI:")
    fmt.Println("─────────────────────────────────────────")
    displayInventory(inventory)
    
    // Hitung statistik
    fmt.Println("\n💰 STATISTIK:")
    fmt.Println("─────────────────────────────────────────")
    
    totalValue := 0.0
    totalItems := 0
    lowStockProducts := []string{}
    
    for _, product := range inventory {
        value := float64(product.stock) * product.price
        totalValue += value
        totalItems += product.stock
        
        if product.stock < 10 {
            lowStockProducts = append(lowStockProducts, product.name)
        }
    }
    
    totalSales := 0.0
    for _, trans := range transactions {
        totalSales += trans.total
    }
    
    fmt.Printf("Total Produk      : %d jenis\n", len(inventory))
    fmt.Printf("Total Item        : %d unit\n", totalItems)
    fmt.Printf("Nilai Inventori   : Rp %.0f\n", totalValue)
    fmt.Printf("Total Penjualan   : Rp %.0f\n", totalSales)
    fmt.Printf("Jumlah Transaksi  : %d\n", len(transactions))
    
    // Produk stok rendah
    if len(lowStockProducts) > 0 {
        fmt.Println("\n⚠️  PERINGATAN STOK RENDAH:")
        for _, name := range lowStockProducts {
            fmt.Printf("   - %s\n", name)
        }
    }
    
    fmt.Println("\n═══════════════════════════════════════════")
}

func displayInventory(inventory map[string]Product) {
    fmt.Printf("%-6s %-25s %12s %8s %15s\n", 
        "ID", "Nama Produk", "Harga", "Stok", "Nilai")
    fmt.Println("─────────────────────────────────────────")
    
    for _, product := range inventory {
        value := float64(product.stock) * product.price
        fmt.Printf("%-6s %-25s Rp %9.0f %5d Rp %12.0f\n", 
            product.id, product.name, product.price, 
            product.stock, value)
    }
}
```

### Output Program

```
╔═══════════════════════════════════════╗
║     SISTEM INVENTORI TOKO ELEKTRONIK  ║
╚═══════════════════════════════════════╝

ID     Nama Produk               Harga     Stok           Nilai
─────────────────────────────────────────
P001   Laptop ASUS          Rp  10000000     5 Rp   50000000
P002   Mouse Logitech       Rp    150000    20 Rp    3000000
P003   Keyboard Mechanical  Rp    500000    15 Rp    7500000
P004   Monitor LG 24"       Rp   2000000     8 Rp   16000000
P005   Webcam HD            Rp    300000    12 Rp    3600000

📦 TRANSAKSI PENJUALAN:
─────────────────────────────────────────
✓ Terjual: 2 Laptop ASUS = Rp 20000000
✓ Terjual: 5 Mouse Logitech = Rp 750000
✗ Stok Monitor LG 24" tidak cukup (tersedia: 8, diminta: 10)

📊 STOK TERKINI:
─────────────────────────────────────────
ID     Nama Produk               Harga     Stok           Nilai
─────────────────────────────────────────
P001   Laptop ASUS          Rp  10000000     3 Rp   30000000
P002   Mouse Logitech       Rp    150000    15 Rp    2250000
P003   Keyboard Mechanical  Rp    500000    15 Rp    7500000
P004   Monitor LG 24"       Rp   2000000     8 Rp   16000000
P005   Webcam HD            Rp    300000    12 Rp    3600000

💰 STATISTIK:
─────────────────────────────────────────
Total Produk      : 5 jenis
Total Item        : 53 unit
Nilai Inventori   : Rp 59350000
Total Penjualan   : Rp 20750000
Jumlah Transaksi  : 2

⚠️  PERINGATAN STOK RENDAH:
   - Laptop ASUS
   - Monitor LG 24"

═══════════════════════════════════════════
```

### Latihan Tambahan

Coba tambahkan fitur:
1. Tambah produk baru dari input user
2. Kategori produk (map of slices)
3. Diskon untuk pembelian tertentu
4. Export laporan ke file

## Ringkasan
Duration: 0:02:00

Selamat! Anda telah menyelesaikan Bab 3: Data Structures.

### Yang Sudah Dipelajari

✅ **Arrays** - Koleksi fixed-size  
✅ **Slices** - Koleksi dinamis (append, slicing, copy)  
✅ **Maps** - Key-value pairs  
✅ **Studi Kasus** - Sistem inventori toko lengkap

### Key Takeaways

- Array memiliki ukuran tetap, Slice dinamis
- Slice adalah reference type, Array adalah value type
- Map tidak terurut dan key harus unique
- Gunakan `make()` untuk inisialisasi slice dan map
- `append()` untuk menambah element ke slice
- `delete()` untuk menghapus key dari map

### Langkah Selanjutnya

Lanjut ke **Bab 4: Functions** untuk belajar:
- Multiple return values
- Variadic functions
- Closures
- Recursion

### Resources

- [Go Slices](https://go.dev/blog/slices-intro)
- [Go Maps](https://go.dev/blog/maps)
- [Slice Tricks](https://github.com/golang/go/wiki/SliceTricks)

Positive
: Data structures adalah fondasi untuk menyimpan data. Praktik dengan berbagai kombinasi!
