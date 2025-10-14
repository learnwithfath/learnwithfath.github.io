author: Qiscus Engineering Team
summary: Pelajari dasar-dasar bahasa pemrograman Go dari syntax, types, testing, interfaces, hingga concurrency
id: go-dasar-pemula
categories: golang,backend,pemula,indonesia
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/feedback

# Go Dasar untuk Pemula

## Pengenalan
Duration: 0:03:00

Selamat datang di tutorial Go Dasar! Dalam tutorial ini, Anda akan mempelajari fundamental bahasa pemrograman Go yang akan menjadi fondasi untuk pengembangan backend.

### Apa yang Akan Anda Pelajari
* Syntax dasar Go
* Tipe data dan variabel  
* Control flow (if, for, switch)
* Functions dan methods
* Interfaces
* Testing di Go
* Pengenalan concurrency

### Prasyarat
* Komputer dengan sistem operasi Windows, macOS, atau Linux
* Text editor (VS Code direkomendasikan)
* Koneksi internet untuk download Go

Positive
: Tutorial ini dirancang untuk pemula yang belum pernah menggunakan Go sebelumnya!

## Instalasi Go
Duration: 0:05:00

Mari kita mulai dengan menginstal Go di komputer Anda.

### Download dan Install

1. Kunjungi: https://go.dev/dl/
2. Download installer sesuai OS Anda
3. Install dan ikuti instruksi

### Verifikasi Instalasi

```bash
go version
```

Output:
```
go version go1.21.0 darwin/amd64
```

Positive
: Go sudah terinstall! Mari kita mulai coding!

## Hello World
Duration: 0:10:00

Program Go pertama Anda!

### Buat Project

```bash
mkdir hello-go
cd hello-go
go mod init hello-go
```

### File main.go

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
```

### Jalankan

```bash
go run main.go
```

Positive
: Selamat! Program Go pertama Anda berhasil!

## Variabel dan Tipe Data
Duration: 0:15:00

### Tipe Data Dasar

```go
var age int = 25
var price float64 = 99.99
var name string = "Fathullah"
var isActive bool = true
```

### Cara Deklarasi

```go
// Dengan var
var name string = "Go"

// Type inference
var age = 10

// Short declaration (recommended)
name := "Go"
age := 10
```

### Constants

```go
const Pi = 3.14159
const AppName = "MyApp"
```

## Control Flow
Duration: 0:15:00

### If Statement

```go
if age >= 18 {
    fmt.Println("Dewasa")
} else {
    fmt.Println("Belum dewasa")
}
```

### For Loop

```go
// For klasik
for i := 0; i < 5; i++ {
    fmt.Println(i)
}

// Range over slice
numbers := []int{1, 2, 3, 4, 5}
for index, value := range numbers {
    fmt.Println(index, value)
}
```

### Switch

```go
switch day {
case "Monday":
    fmt.Println("Senin")
case "Saturday", "Sunday":
    fmt.Println("Akhir pekan")
default:
    fmt.Println("Hari kerja")
}
```

## Functions
Duration: 0:15:00

### Function Dasar

```go
func add(a, b int) int {
    return a + b
}

func main() {
    result := add(5, 3)
    fmt.Println(result)
}
```

### Multiple Returns

```go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("tidak bisa dibagi nol")
    }
    return a / b, nil
}
```

## Structs dan Methods
Duration: 0:15:00

### Struct

```go
type Person struct {
    FirstName string
    LastName  string
    Age       int
}
```

### Methods

```go
func (p Person) FullName() string {
    return p.FirstName + " " + p.LastName
}

func (p *Person) HaveBirthday() {
    p.Age++
}
```

## Interfaces
Duration: 0:15:00

### Interface Dasar

```go
type Shape interface {
    Area() float64
}

type Rectangle struct {
    Width, Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}
```

Positive
: Interfaces membuat kode fleksibel dan mudah di-test!

## Testing
Duration: 0:20:00

### File Test

Buat `calculator_test.go`:

```go
package main

import "testing"

func TestAdd(t *testing.T) {
    result := Add(2, 3)
    if result != 5 {
        t.Errorf("Expected 5, got %d", result)
    }
}
```

### Jalankan Test

```bash
go test
go test -v
go test -cover
```

## Concurrency Basics
Duration: 0:15:00

### Goroutines

```go
func sayHello() {
    fmt.Println("Hello")
}

func main() {
    go sayHello()  // Run in goroutine
    time.Sleep(time.Second)
}
```

### Channels

```go
func main() {
    ch := make(chan string)
    
    go func() {
        ch <- "Hello from goroutine"
    }()
    
    msg := <-ch
    fmt.Println(msg)
}
```

Positive
: Goroutines membuat concurrent programming mudah!

## Project: Mini Console App
Duration: 0:30:00

Buat aplikasi TODO list sederhana!

```go
package main

import (
    "bufio"
    "fmt"
    "os"
    "strings"
)

type Todo struct {
    Title string
    Done  bool
}

var todos []Todo

func main() {
    scanner := bufio.NewScanner(os.Stdin)
    
    for {
        fmt.Println("\n=== TODO App ===")
        fmt.Println("1. Add todo")
        fmt.Println("2. List todos")
        fmt.Println("3. Mark done")
        fmt.Println("4. Exit")
        fmt.Print("Choice: ")
        
        scanner.Scan()
        choice := scanner.Text()
        
        switch choice {
        case "1":
            addTodo(scanner)
        case "2":
            listTodos()
        case "3":
            markDone(scanner)
        case "4":
            return
        }
    }
}

func addTodo(scanner *bufio.Scanner) {
    fmt.Print("Todo title: ")
    scanner.Scan()
    title := scanner.Text()
    
    todos = append(todos, Todo{Title: title, Done: false})
    fmt.Println("Todo added!")
}

func listTodos() {
    if len(todos) == 0 {
        fmt.Println("No todos yet!")
        return
    }
    
    for i, todo := range todos {
        status := " "
        if todo.Done {
            status = "✓"
        }
        fmt.Printf("%d. [%s] %s\n", i+1, status, todo.Title)
    }
}

func markDone(scanner *bufio.Scanner) {
    listTodos()
    fmt.Print("Number to mark done: ")
    scanner.Scan()
    // Implementation here
}
```

## Ringkasan
Duration: 0:05:00

Selamat! Anda telah mempelajari:

* ✅ Syntax dasar Go
* ✅ Variabel dan tipe data
* ✅ Control flow
* ✅ Functions
* ✅ Structs dan methods
* ✅ Interfaces
* ✅ Testing
* ✅ Concurrency basics

### Langkah Selanjutnya
* Pelajari HTTP dan REST API dengan Go
* Eksplorasi Go standard library
* Buat project nyata

### Resources
* [Go by Example](https://gobyexample.com/)
* [Go Tour](https://go.dev/tour/)
* [Boot.dev Backend Track](https://www.boot.dev/tracks/backend)

Positive
: Selamat belajar! Lanjutkan ke tutorial berikutnya untuk belajar HTTP & REST API!
