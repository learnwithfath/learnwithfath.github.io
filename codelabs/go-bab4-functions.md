author: Qiscus Engineering Team
summary: Bab 4 - Master Functions di Go: Multiple Return, Variadic, Closures, Recursion dengan penjelasan sederhana dan studi kasus kalkulator
id: go-bab4-functions
categories: golang,backend,fundamental,indonesia
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/feedback

# Go Bab 4: Functions

## Pengenalan
Duration: 0:03:00

Selamat datang di Bab 4! Functions membuat code reusable dan terorganisir dengan baik.

### Apa yang Akan Dipelajari

* 🔧 Basic Functions - Deklarasi dan penggunaan
* 🔄 Multiple Return - Return lebih dari satu nilai
* 📦 Variadic Functions - Parameter tidak terbatas
* 🎯 Closures - Function dalam function
* ♻️ Recursion - Function yang memanggil dirinya sendiri
* 💼 Studi Kasus - Kalkulator lengkap

### Prasyarat

* Sudah menyelesaikan Bab 1-3
* Memahami data structures

Positive
: Functions adalah building block utama dalam programming. Master functions = master programming!

## Basic Functions
Duration: 0:20:00

### Penjelasan Sederhana

Function adalah blok code yang bisa dipanggil berulang kali. Membuat code lebih modular dan mudah di-maintain.

### 1. Function Tanpa Parameter

```go
package main

import "fmt"

func sayHello() {
    fmt.Println("Hello, World!")
}

func greet() {
    fmt.Println("Selamat datang!")
    fmt.Println("Semoga hari Anda menyenangkan")
}

func main() {
    sayHello()
    greet()
    sayHello()  // Bisa dipanggil berkali-kali
}
```

### 2. Function dengan Parameter

```go
package main

import "fmt"

// Single parameter
func greet(name string) {
    fmt.Printf("Hello, %s!\n", name)
}

// Multiple parameters
func introduce(name string, age int) {
    fmt.Printf("Nama: %s, Umur: %d tahun\n", name, age)
}

// Parameters dengan tipe sama (shorthand)
func add(a, b int) {
    result := a + b
    fmt.Printf("%d + %d = %d\n", a, b, result)
}

func main() {
    greet("Ahmad")
    introduce("Budi", 25)
    add(10, 5)
}
```

### 3. Function dengan Return Value

```go
package main

import "fmt"

// Return single value
func add(a, b int) int {
    return a + b
}

func multiply(a, b int) int {
    return a * b
}

// Return dengan expression
func isEven(n int) bool {
    return n%2 == 0
}

func main() {
    sum := add(5, 3)
    fmt.Println("Sum:", sum)
    
    product := multiply(4, 6)
    fmt.Println("Product:", product)
    
    if isEven(10) {
        fmt.Println("10 is even")
    }
    
    // Direct use
    fmt.Println("15 + 20 =", add(15, 20))
}
```

### 4. Named Return Values

```go
package main

import "fmt"

// Named return values
func calculate(a, b int) (sum int, product int) {
    sum = a + b
    product = a * b
    return  // Naked return
}

// Dengan explicit return
func divide(a, b float64) (result float64, err error) {
    if b == 0 {
        err = fmt.Errorf("cannot divide by zero")
        return
    }
    result = a / b
    return
}

func main() {
    s, p := calculate(5, 3)
    fmt.Printf("Sum: %d, Product: %d\n", s, p)
    
    r, e := divide(10, 2)
    if e != nil {
        fmt.Println("Error:", e)
    } else {
        fmt.Println("Result:", r)
    }
}
```

### 5. Function sebagai Value

```go
package main

import "fmt"

func main() {
    // Assign function ke variable
    add := func(a, b int) int {
        return a + b
    }
    
    result := add(5, 3)
    fmt.Println("Result:", result)
    
    // Pass function sebagai parameter
    calculate(10, 5, add)
    
    // Return function dari function
    multiplier := makeMultiplier(3)
    fmt.Println("3 × 5 =", multiplier(5))
}

func calculate(a, b int, operation func(int, int) int) {
    result := operation(a, b)
    fmt.Println("Calculate result:", result)
}

func makeMultiplier(factor int) func(int) int {
    return func(x int) int {
        return x * factor
    }
}
```

Positive
: Functions membuat code DRY (Don't Repeat Yourself) - tulis sekali, pakai berkali-kali!

## Multiple Return Values
Duration: 0:20:00

### Penjelasan Sederhana

Go bisa return lebih dari satu nilai. Sangat berguna untuk return hasil dan error sekaligus.

### 1. Basic Multiple Returns

```go
package main

import "fmt"

// Return 2 values
func swap(x, y string) (string, string) {
    return y, x
}

// Return 3 values
func getPersonInfo() (string, int, string) {
    return "Ahmad", 25, "Jakarta"
}

func main() {
    // Receive all returns
    a, b := swap("hello", "world")
    fmt.Println(a, b)  // world hello
    
    name, age, city := getPersonInfo()
    fmt.Printf("%s, %d tahun, dari %s\n", name, age, city)
}
```

### 2. Return dengan Error

```go
package main

import (
    "fmt"
    "errors"
)

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func sqrt(x float64) (float64, error) {
    if x < 0 {
        return 0, fmt.Errorf("cannot sqrt negative number: %f", x)
    }
    // Simple approximation
    result := 1.0
    for i := 0; i < 10; i++ {
        result = (result + x/result) / 2
    }
    return result, nil
}

func main() {
    // Handle error
    result, err := divide(10, 2)
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("Result:", result)
    }
    
    // Error case
    _, err = divide(10, 0)
    if err != nil {
        fmt.Println("Error:", err)
    }
    
    // Sqrt
    s, err := sqrt(16)
    if err == nil {
        fmt.Println("√16 =", s)
    }
}
```

### 3. Ignore Return Values

```go
package main

import "fmt"

func calculate(a, b int) (int, int, int) {
    return a + b, a - b, a * b
}

func main() {
    // Get all
    sum, diff, prod := calculate(10, 5)
    fmt.Println(sum, diff, prod)
    
    // Ignore some dengan _
    sum2, _, _ := calculate(20, 10)
    fmt.Println("Only sum:", sum2)
    
    // Ignore all (hanya execute function)
    _, _, _ = calculate(5, 3)
}
```

### 4. Practical Example: Validation

```go
package main

import "fmt"

type User struct {
    username string
    email    string
    age      int
}

func validateUser(user User) (bool, []string) {
    errors := []string{}
    
    if len(user.username) < 3 {
        errors = append(errors, "Username terlalu pendek (min 3 karakter)")
    }
    
    if len(user.email) < 5 || !contains(user.email, "@") {
        errors = append(errors, "Email tidak valid")
    }
    
    if user.age < 17 {
        errors = append(errors, "Umur minimal 17 tahun")
    }
    
    return len(errors) == 0, errors
}

func contains(s, substr string) bool {
    for i := 0; i <= len(s)-len(substr); i++ {
        if s[i:i+len(substr)] == substr {
            return true
        }
    }
    return false
}

func main() {
    user1 := User{"ab", "invalid", 15}
    valid, errors := validateUser(user1)
    
    if !valid {
        fmt.Println("Validasi gagal:")
        for _, err := range errors {
            fmt.Println("  -", err)
        }
    }
    
    user2 := User{"ahmad", "ahmad@email.com", 25}
    valid2, _ := validateUser(user2)
    if valid2 {
        fmt.Println("\nUser valid!")
    }
}
```

## Variadic Functions
Duration: 0:20:00

### Penjelasan Sederhana

Variadic function bisa menerima jumlah parameter yang tidak terbatas (variable number of arguments).

### 1. Basic Variadic

```go
package main

import "fmt"

// Variadic parameter dengan ...
func sum(numbers ...int) int {
    total := 0
    for _, num := range numbers {
        total += num
    }
    return total
}

func main() {
    // Call dengan berbagai jumlah argument
    fmt.Println(sum(1, 2))           // 3
    fmt.Println(sum(1, 2, 3))        // 6
    fmt.Println(sum(1, 2, 3, 4, 5))  // 15
    
    // Pass slice dengan ...
    numbers := []int{10, 20, 30, 40}
    fmt.Println(sum(numbers...))     // 100
}
```

### 2. Mix Regular dan Variadic

```go
package main

import "fmt"

// Regular parameter harus sebelum variadic
func greetAll(greeting string, names ...string) {
    for _, name := range names {
        fmt.Printf("%s, %s!\n", greeting, name)
    }
}

func calculate(operation string, numbers ...float64) float64 {
    if len(numbers) == 0 {
        return 0
    }
    
    result := numbers[0]
    for i := 1; i < len(numbers); i++ {
        switch operation {
        case "add":
            result += numbers[i]
        case "multiply":
            result *= numbers[i]
        }
    }
    return result
}

func main() {
    greetAll("Hello", "Ahmad", "Budi", "Citra")
    
    fmt.Println("\nCalculations:")
    fmt.Println("Sum:", calculate("add", 1, 2, 3, 4, 5))
    fmt.Println("Product:", calculate("multiply", 2, 3, 4))
}
```

### 3. Practical Example: Printf-style

```go
package main

import "fmt"

func logMessage(level string, format string, args ...interface{}) {
    prefix := fmt.Sprintf("[%s] ", level)
    message := fmt.Sprintf(format, args...)
    fmt.Println(prefix + message)
}

func main() {
    logMessage("INFO", "Server started on port %d", 8080)
    logMessage("ERROR", "Failed to connect to %s:%d", "localhost", 5432)
    logMessage("DEBUG", "User %s logged in at %s", "ahmad", "10:30")
}
```

### 4. Advanced: Generic Operations

```go
package main

import "fmt"

func max(numbers ...int) int {
    if len(numbers) == 0 {
        return 0
    }
    
    maximum := numbers[0]
    for _, num := range numbers[1:] {
        if num > maximum {
            maximum = num
        }
    }
    return maximum
}

func min(numbers ...int) int {
    if len(numbers) == 0 {
        return 0
    }
    
    minimum := numbers[0]
    for _, num := range numbers[1:] {
        if num < minimum {
            minimum = num
        }
    }
    return minimum
}

func average(numbers ...float64) float64 {
    if len(numbers) == 0 {
        return 0
    }
    
    sum := 0.0
    for _, num := range numbers {
        sum += num
    }
    return sum / float64(len(numbers))
}

func main() {
    fmt.Println("Max:", max(5, 2, 9, 1, 7))
    fmt.Println("Min:", min(5, 2, 9, 1, 7))
    fmt.Println("Average:", average(85.5, 90.0, 78.5, 92.0))
}
```

Negative
: Variadic parameter harus yang terakhir! Tidak bisa ada parameter setelahnya.

## Closures
Duration: 0:20:00

### Penjelasan Sederhana

Closure adalah function yang bisa mengakses variable dari scope luarnya. Function "mengingat" environment tempat ia dibuat.

### 1. Basic Closure

```go
package main

import "fmt"

func main() {
    // Variable di outer scope
    message := "Hello"
    
    // Closure yang akses variable outer
    greet := func(name string) {
        fmt.Printf("%s, %s!\n", message, name)
    }
    
    greet("Ahmad")
    
    // Ubah variable outer
    message = "Hi"
    greet("Budi")  // Menggunakan nilai baru
}
```

### 2. Counter Closure

```go
package main

import "fmt"

func counter() func() int {
    count := 0
    
    return func() int {
        count++
        return count
    }
}

func main() {
    // Buat counter
    increment := counter()
    
    fmt.Println(increment())  // 1
    fmt.Println(increment())  // 2
    fmt.Println(increment())  // 3
    
    // Counter baru (independent)
    newCounter := counter()
    fmt.Println(newCounter())  // 1
    fmt.Println(newCounter())  // 2
}
```

### 3. Function Factory

```go
package main

import "fmt"

func makeMultiplier(factor int) func(int) int {
    return func(x int) int {
        return x * factor
    }
}

func makeAdder(addend int) func(int) int {
    return func(x int) int {
        return x + addend
    }
}

func main() {
    // Buat multipliers
    double := makeMultiplier(2)
    triple := makeMultiplier(3)
    
    fmt.Println("Double 5:", double(5))   // 10
    fmt.Println("Triple 5:", triple(5))   // 15
    
    // Buat adders
    add10 := makeAdder(10)
    add100 := makeAdder(100)
    
    fmt.Println("5 + 10:", add10(5))      // 15
    fmt.Println("5 + 100:", add100(5))    // 105
}
```

### 4. Practical: Event Handlers

```go
package main

import "fmt"

type Button struct {
    label   string
    onClick func()
}

func (b *Button) click() {
    if b.onClick != nil {
        b.onClick()
    }
}

func main() {
    clickCount := 0
    
    button := Button{
        label: "Click Me",
        onClick: func() {
            clickCount++
            fmt.Printf("Button clicked %d times\n", clickCount)
        },
    }
    
    button.click()
    button.click()
    button.click()
}
```

## Recursion
Duration: 0:20:00

### Penjelasan Sederhana

Recursion adalah function yang memanggil dirinya sendiri. Berguna untuk masalah yang bisa dipecah menjadi sub-masalah yang sama.

### 1. Factorial

```go
package main

import "fmt"

func factorial(n int) int {
    // Base case
    if n == 0 || n == 1 {
        return 1
    }
    // Recursive case
    return n * factorial(n-1)
}

func main() {
    fmt.Println("5! =", factorial(5))    // 120
    fmt.Println("10! =", factorial(10))  // 3628800
    
    // Show steps
    for i := 0; i <= 7; i++ {
        fmt.Printf("%d! = %d\n", i, factorial(i))
    }
}
```

### 2. Fibonacci

```go
package main

import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    fmt.Print("Fibonacci sequence: ")
    for i := 0; i < 10; i++ {
        fmt.Print(fibonacci(i), " ")
    }
    fmt.Println()
}
```

### 3. Sum Array

```go
package main

import "fmt"

func sumArray(arr []int) int {
    // Base case: empty array
    if len(arr) == 0 {
        return 0
    }
    // Recursive: first + sum of rest
    return arr[0] + sumArray(arr[1:])
}

func main() {
    numbers := []int{1, 2, 3, 4, 5}
    fmt.Println("Sum:", sumArray(numbers))  // 15
}
```

### 4. Power

```go
package main

import "fmt"

func power(base, exp int) int {
    if exp == 0 {
        return 1
    }
    return base * power(base, exp-1)
}

func main() {
    fmt.Println("2^3 =", power(2, 3))    // 8
    fmt.Println("5^4 =", power(5, 4))    // 625
    fmt.Println("10^2 =", power(10, 2))  // 100
}
```

### 5. Countdown

```go
package main

import (
    "fmt"
    "time"
)

func countdown(n int) {
    if n == 0 {
        fmt.Println("🚀 Blast off!")
        return
    }
    fmt.Println(n)
    time.Sleep(time.Second)
    countdown(n - 1)
}

func main() {
    fmt.Println("Countdown:")
    countdown(5)
}
```

Positive
: Recursion elegant tapi hati-hati dengan stack overflow! Pastikan ada base case.

## Studi Kasus: Kalkulator Lengkap
Duration: 0:25:00

### Problem

Buat kalkulator dengan fitur:
1. Operasi dasar (tambah, kurang, kali, bagi)
2. Operasi lanjutan (pangkat, akar, faktorial)
3. Statistik (rata-rata, max, min)
4. History transaksi

### Solusi Lengkap

```go
package main

import (
    "fmt"
    "math"
)

// History untuk menyimpan operasi
type Operation struct {
    operation string
    values    []float64
    result    float64
}

var history []Operation

// Operasi Dasar
func add(a, b float64) float64 {
    result := a + b
    saveHistory("add", []float64{a, b}, result)
    return result
}

func subtract(a, b float64) float64 {
    result := a - b
    saveHistory("subtract", []float64{a, b}, result)
    return result
}

func multiply(a, b float64) float64 {
    result := a * b
    saveHistory("multiply", []float64{a, b}, result)
    return result
}

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    result := a / b
    saveHistory("divide", []float64{a, b}, result)
    return result, nil
}

// Operasi Lanjutan
func powerOf(base, exp float64) float64 {
    result := math.Pow(base, exp)
    saveHistory("power", []float64{base, exp}, result)
    return result
}

func squareRoot(n float64) (float64, error) {
    if n < 0 {
        return 0, fmt.Errorf("cannot calculate square root of negative number")
    }
    result := math.Sqrt(n)
    saveHistory("sqrt", []float64{n}, result)
    return result, nil
}

func factorial(n int) int {
    if n <= 1 {
        return 1
    }
    return n * factorial(n-1)
}

// Statistik (Variadic)
func average(numbers ...float64) float64 {
    if len(numbers) == 0 {
        return 0
    }
    
    sum := 0.0
    for _, num := range numbers {
        sum += num
    }
    result := sum / float64(len(numbers))
    saveHistory("average", numbers, result)
    return result
}

func maximum(numbers ...float64) float64 {
    if len(numbers) == 0 {
        return 0
    }
    
    max := numbers[0]
    for _, num := range numbers[1:] {
        if num > max {
            max = num
        }
    }
    saveHistory("max", numbers, max)
    return max
}

func minimum(numbers ...float64) float64 {
    if len(numbers) == 0 {
        return 0
    }
    
    min := numbers[0]
    for _, num := range numbers[1:] {
        if num < min {
            min = num
        }
    }
    saveHistory("min", numbers, min)
    return min
}

// Helper Functions
func saveHistory(op string, values []float64, result float64) {
    history = append(history, Operation{
        operation: op,
        values:    values,
        result:    result,
    })
}

func showHistory() {
    if len(history) == 0 {
        fmt.Println("No history yet")
        return
    }
    
    fmt.Println("\n📜 HISTORY:")
    fmt.Println("─────────────────────────────────────")
    for i, op := range history {
        fmt.Printf("%d. %s(", i+1, op.operation)
        for j, v := range op.values {
            if j > 0 {
                fmt.Print(", ")
            }
            fmt.Printf("%.2f", v)
        }
        fmt.Printf(") = %.2f\n", op.result)
    }
}

func main() {
    fmt.Println("╔═══════════════════════════════════╗")
    fmt.Println("║      KALKULATOR SUPER LENGKAP     ║")
    fmt.Println("╚═══════════════════════════════════╝")
    
    // Operasi Dasar
    fmt.Println("\n🔢 OPERASI DASAR:")
    fmt.Println("─────────────────────────────────────")
    fmt.Printf("10 + 5 = %.2f\n", add(10, 5))
    fmt.Printf("10 - 5 = %.2f\n", subtract(10, 5))
    fmt.Printf("10 × 5 = %.2f\n", multiply(10, 5))
    
    if result, err := divide(10, 5); err == nil {
        fmt.Printf("10 ÷ 5 = %.2f\n", result)
    }
    
    // Operasi Lanjutan
    fmt.Println("\n⚡ OPERASI LANJUTAN:")
    fmt.Println("─────────────────────────────────────")
    fmt.Printf("2³ = %.0f\n", powerOf(2, 3))
    fmt.Printf("10² = %.0f\n", powerOf(10, 2))
    
    if sqrt, err := squareRoot(16); err == nil {
        fmt.Printf("√16 = %.0f\n", sqrt)
    }
    
    fmt.Printf("5! = %d\n", factorial(5))
    fmt.Printf("7! = %d\n", factorial(7))
    
    // Statistik
    fmt.Println("\n📊 STATISTIK:")
    fmt.Println("─────────────────────────────────────")
    scores := []float64{85, 90, 78, 92, 88, 95}
    fmt.Printf("Nilai: %v\n", scores)
    fmt.Printf("Rata-rata: %.2f\n", average(scores...))
    fmt.Printf("Nilai Tertinggi: %.0f\n", maximum(scores...))
    fmt.Printf("Nilai Terendah: %.0f\n", minimum(scores...))
    
    // Show History
    showHistory()
    
    fmt.Println("\n═══════════════════════════════════════")
}
```

### Output Program

```
╔═══════════════════════════════════╗
║      KALKULATOR SUPER LENGKAP     ║
╚═══════════════════════════════════╝

🔢 OPERASI DASAR:
─────────────────────────────────────
10 + 5 = 15.00
10 - 5 = 5.00
10 × 5 = 50.00
10 ÷ 5 = 2.00

⚡ OPERASI LANJUTAN:
─────────────────────────────────────
2³ = 8
10² = 100
√16 = 4
5! = 120
7! = 5040

📊 STATISTIK:
─────────────────────────────────────
Nilai: [85 90 78 92 88 95]
Rata-rata: 88.00
Nilai Tertinggi: 95
Nilai Terendah: 78

📜 HISTORY:
─────────────────────────────────────
1. add(10.00, 5.00) = 15.00
2. subtract(10.00, 5.00) = 5.00
3. multiply(10.00, 5.00) = 50.00
4. divide(10.00, 5.00) = 2.00
5. power(2.00, 3.00) = 8.00
6. power(10.00, 2.00) = 100.00
7. sqrt(16.00) = 4.00
8. average(85.00, 90.00, 78.00, 92.00, 88.00, 95.00) = 88.00
9. max(85.00, 90.00, 78.00, 92.00, 88.00, 95.00) = 95.00
10. min(85.00, 90.00, 78.00, 92.00, 88.00, 95.00) = 78.00

═══════════════════════════════════════
```

## Ringkasan
Duration: 0:02:00

Selamat! Anda telah menyelesaikan Bab 4: Functions.

### Yang Sudah Dipelajari

✅ **Basic Functions** - Parameter dan return values  
✅ **Multiple Returns** - Return lebih dari satu nilai  
✅ **Variadic Functions** - Parameter tidak terbatas  
✅ **Closures** - Function yang mengakses outer scope  
✅ **Recursion** - Function memanggil dirinya sendiri  
✅ **Studi Kasus** - Kalkulator super lengkap

### Key Takeaways

- Functions membuat code reusable dan modular
- Multiple returns berguna untuk return hasil dan error
- Variadic parameter harus yang terakhir
- Closures "mengingat" environment tempat dibuat
- Recursion butuh base case untuk stop

### Langkah Selanjutnya

Lanjut ke **Bab 5: Advanced Types** untuk belajar:
- Pointers
- Strings manipulation
- Structs
- Methods
- Interfaces

### Resources

- [Go Functions](https://go.dev/tour/basics/4)
- [Effective Go - Functions](https://go.dev/doc/effective_go#functions)

Positive
: Functions adalah fondasi programming. Practice makes perfect!
