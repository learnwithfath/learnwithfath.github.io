author: Qiscus Engineering Team
summary: Bab 5 - Advanced Types di Go: Pointers, Strings, Structs, Methods, Interfaces dengan studi kasus sistem manajemen karyawan
id: go-bab5-advanced-types
categories: golang,backend,fundamental,indonesia
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/feedback

# Go Bab 5: Advanced Types

## Pengenalan
Duration: 0:03:00

Selamat datang di Bab 5! Di bab ini kita akan belajar tipe data advanced untuk struktur yang lebih kompleks.

### Apa yang Akan Dipelajari

* 👉 Pointers - Reference ke memory address
* 📝 Strings - Manipulasi text
* 📦 Structs - Custom data types
* 🔧 Methods - Functions pada types
* 🔌 Interfaces - Abstraksi dan polymorphism
* 💼 Studi Kasus - Sistem manajemen karyawan

Positive
: Advanced types membuat code lebih terstruktur dan maintainable!

## Pointers
Duration: 0:20:00

### Penjelasan Sederhana

Pointer menyimpan **alamat memori** dari sebuah variable, bukan nilainya langsung.

### Basic Pointers

```go
package main

import "fmt"

func main() {
    x := 10
    p := &x  // & = ambil alamat
    
    fmt.Println("Nilai x:", x)
    fmt.Println("Alamat x:", p)
    fmt.Println("Nilai via pointer:", *p)  // * = dereference
    
    // Ubah nilai via pointer
    *p = 20
    fmt.Println("Nilai x setelah diubah:", x)
}
```

### Pointer vs Value

```go
package main

import "fmt"

func modifyValue(x int) {
    x = 100  // Tidak affect original
}

func modifyPointer(x *int) {
    *x = 100  // Affect original
}

func main() {
    num := 10
    
    modifyValue(num)
    fmt.Println("After modifyValue:", num)  // 10
    
    modifyPointer(&num)
    fmt.Println("After modifyPointer:", num)  // 100
}
```

## Strings
Duration: 0:15:00

### String Operations

```go
package main

import (
    "fmt"
    "strings"
)

func main() {
    s := "Hello, World!"
    
    // Length
    fmt.Println("Length:", len(s))
    
    // Access character
    fmt.Println("First char:", string(s[0]))
    
    // Substring
    fmt.Println("Substring:", s[0:5])
    
    // strings package
    fmt.Println("ToUpper:", strings.ToUpper(s))
    fmt.Println("ToLower:", strings.ToLower(s))
    fmt.Println("Contains:", strings.Contains(s, "World"))
    fmt.Println("Replace:", strings.Replace(s, "World", "Go", 1))
    fmt.Println("Split:", strings.Split(s, ", "))
}
```

## Structs
Duration: 0:25:00

### Penjelasan Sederhana

Struct adalah custom type yang menggabungkan beberapa fields dengan tipe berbeda.

### Basic Struct

```go
package main

import "fmt"

type Person struct {
    name string
    age  int
    city string
}

func main() {
    // Cara 1: Field by field
    var p1 Person
    p1.name = "Ahmad"
    p1.age = 25
    p1.city = "Jakarta"
    
    // Cara 2: Literal
    p2 := Person{
        name: "Budi",
        age:  30,
        city: "Bandung",
    }
    
    // Cara 3: Positional
    p3 := Person{"Citra", 28, "Surabaya"}
    
    fmt.Println(p1)
    fmt.Println(p2)
    fmt.Println(p3)
}
```

### Nested Structs

```go
package main

import "fmt"

type Address struct {
    street  string
    city    string
    zipCode string
}

type Employee struct {
    id      int
    name    string
    address Address
}

func main() {
    emp := Employee{
        id:   1,
        name: "Ahmad",
        address: Address{
            street:  "Jl. Sudirman",
            city:    "Jakarta",
            zipCode: "12345",
        },
    }
    
    fmt.Printf("%s tinggal di %s\n", emp.name, emp.address.city)
}
```

## Methods
Duration: 0:20:00

### Penjelasan Sederhana

Methods adalah functions yang attached ke type tertentu.

### Basic Methods

```go
package main

import "fmt"

type Rectangle struct {
    width  float64
    height float64
}

// Method dengan receiver
func (r Rectangle) area() float64 {
    return r.width * r.height
}

func (r Rectangle) perimeter() float64 {
    return 2 * (r.width + r.height)
}

func main() {
    rect := Rectangle{width: 10, height: 5}
    
    fmt.Println("Area:", rect.area())
    fmt.Println("Perimeter:", rect.perimeter())
}
```

### Pointer Receivers

```go
package main

import "fmt"

type Counter struct {
    count int
}

// Value receiver - tidak modify original
func (c Counter) increment() {
    c.count++
}

// Pointer receiver - modify original
func (c *Counter) incrementPtr() {
    c.count++
}

func main() {
    counter := Counter{count: 0}
    
    counter.increment()
    fmt.Println("After increment:", counter.count)  // 0
    
    counter.incrementPtr()
    fmt.Println("After incrementPtr:", counter.count)  // 1
}
```

## Interfaces
Duration: 0:25:00

### Penjelasan Sederhana

Interface mendefinisikan behavior (methods) tanpa implementasi. Membuat code lebih flexible.

### Basic Interface

```go
package main

import "fmt"

type Shape interface {
    area() float64
}

type Rectangle struct {
    width, height float64
}

type Circle struct {
    radius float64
}

func (r Rectangle) area() float64 {
    return r.width * r.height
}

func (c Circle) area() float64 {
    return 3.14 * c.radius * c.radius
}

func printArea(s Shape) {
    fmt.Printf("Area: %.2f\n", s.area())
}

func main() {
    rect := Rectangle{width: 10, height: 5}
    circle := Circle{radius: 7}
    
    printArea(rect)
    printArea(circle)
}
```

### Empty Interface

```go
package main

import "fmt"

func describe(i interface{}) {
    fmt.Printf("Type: %T, Value: %v\n", i, i)
}

func main() {
    describe(42)
    describe("hello")
    describe(true)
    describe([]int{1, 2, 3})
}
```

## Studi Kasus: Sistem Manajemen Karyawan
Duration: 0:30:00

```go
package main

import "fmt"

type Address struct {
    street  string
    city    string
    zipCode string
}

type Employee struct {
    id       int
    name     string
    position string
    salary   float64
    address  Address
}

// Methods
func (e Employee) displayInfo() {
    fmt.Printf("\n╔══════════════════════════════════╗\n")
    fmt.Printf("  ID: %d\n", e.id)
    fmt.Printf("  Nama: %s\n", e.name)
    fmt.Printf("  Posisi: %s\n", e.position)
    fmt.Printf("  Gaji: Rp %.0f\n", e.salary)
    fmt.Printf("  Alamat: %s, %s\n", e.address.street, e.address.city)
    fmt.Printf("╚══════════════════════════════════╝\n")
}

func (e *Employee) giveRaise(percent float64) {
    e.salary += e.salary * (percent / 100)
}

func (e *Employee) promote(newPosition string, salaryIncrease float64) {
    e.position = newPosition
    e.salary += salaryIncrease
}

// Interface untuk berbagai tipe karyawan
type Worker interface {
    work() string
    getSalary() float64
}

func (e Employee) work() string {
    return fmt.Sprintf("%s bekerja sebagai %s", e.name, e.position)
}

func (e Employee) getSalary() float64 {
    return e.salary
}

func main() {
    fmt.Println("═══════════════════════════════════════")
    fmt.Println("   SISTEM MANAJEMEN KARYAWAN")
    fmt.Println("═══════════════════════════════════════")
    
    // Buat karyawan
    emp1 := Employee{
        id:       1,
        name:     "Ahmad Fathullah",
        position: "Software Engineer",
        salary:   15000000,
        address: Address{
            street:  "Jl. Sudirman No. 123",
            city:    "Jakarta",
            zipCode: "12190",
        },
    }
    
    emp2 := Employee{
        id:       2,
        name:     "Budi Santoso",
        position: "Product Manager",
        salary:   20000000,
        address: Address{
            street:  "Jl. Gatot Subroto No. 45",
            city:    "Jakarta",
            zipCode: "12930",
        },
    }
    
    // Display info
    emp1.displayInfo()
    emp2.displayInfo()
    
    // Give raise
    fmt.Println("\n📈 KENAIKAN GAJI:")
    fmt.Printf("%s mendapat kenaikan 10%%\n", emp1.name)
    emp1.giveRaise(10)
    fmt.Printf("Gaji baru: Rp %.0f\n", emp1.salary)
    
    // Promote
    fmt.Println("\n🎉 PROMOSI:")
    fmt.Printf("%s dipromosikan!\n", emp1.name)
    emp1.promote("Senior Software Engineer", 3000000)
    emp1.displayInfo()
    
    // Interface usage
    fmt.Println("\n💼 AKTIVITAS KERJA:")
    employees := []Worker{emp1, emp2}
    totalSalary := 0.0
    
    for _, emp := range employees {
        fmt.Println("  -", emp.work())
        totalSalary += emp.getSalary()
    }
    
    fmt.Printf("\nTotal Gaji: Rp %.0f\n", totalSalary)
    fmt.Println("═══════════════════════════════════════")
}
```

## Ringkasan
Duration: 0:02:00

### Yang Sudah Dipelajari

✅ **Pointers** - Reference dan dereference  
✅ **Strings** - Manipulasi text  
✅ **Structs** - Custom types  
✅ **Methods** - Functions pada types  
✅ **Interfaces** - Abstraksi dan polymorphism

### Langkah Selanjutnya

Lanjut ke **Bab 6: Concurrency** untuk belajar goroutines dan channels!

Positive
: Advanced types membuat code lebih terstruktur dan professional!
