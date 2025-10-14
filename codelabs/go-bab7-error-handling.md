author: Qiscus Engineering Team
summary: Bab 7 - Error Handling di Go: Errors, Panic, Defer, Recover dengan studi kasus file processor yang robust
id: go-bab7-error-handling
categories: golang,backend,fundamental,indonesia
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/feedback

# Go Bab 7: Error Handling

## Pengenalan
Duration: 0:03:00

Error handling yang baik membuat aplikasi robust dan reliable!

### Apa yang Akan Dipelajari

* ❌ Errors - Menangani error dengan proper
* 💥 Panic - Situasi exceptional
* 🔄 Defer - Cleanup operations
* 🛡️ Recover - Menangkap panic
* 💼 Studi Kasus - File processor robust

Positive
: Good error handling = production-ready code!

## Errors
Duration: 0:20:00

### Penjelasan Sederhana

Error di Go adalah value, bukan exception. Function return error sebagai nilai terakhir.

### Basic Error Handling

```go
package main

import (
    "errors"
    "fmt"
)

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 2)
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    fmt.Println("Result:", result)
    
    // Error case
    _, err = divide(10, 0)
    if err != nil {
        fmt.Println("Error:", err)
    }
}
```

### Custom Errors

```go
package main

import "fmt"

type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("%s: %s", e.Field, e.Message)
}

func validateAge(age int) error {
    if age < 0 {
        return &ValidationError{
            Field:   "age",
            Message: "cannot be negative",
        }
    }
    if age < 17 {
        return &ValidationError{
            Field:   "age",
            Message: "must be at least 17",
        }
    }
    return nil
}

func main() {
    if err := validateAge(15); err != nil {
        fmt.Println("Validation error:", err)
    }
}
```

### Error Wrapping

```go
package main

import (
    "fmt"
    "errors"
)

func processData(data string) error {
    if data == "" {
        return errors.New("empty data")
    }
    return nil
}

func handleRequest(data string) error {
    if err := processData(data); err != nil {
        return fmt.Errorf("handleRequest: %w", err)
    }
    return nil
}

func main() {
    err := handleRequest("")
    if err != nil {
        fmt.Println("Error:", err)
        
        // Unwrap error
        if errors.Is(err, errors.New("empty data")) {
            fmt.Println("It's an empty data error")
        }
    }
}
```

## Panic
Duration: 0:15:00

### Penjelasan Sederhana

Panic digunakan untuk situasi exceptional yang tidak bisa di-recover.

### Basic Panic

```go
package main

import "fmt"

func riskyOperation(x int) {
    if x < 0 {
        panic("x cannot be negative")
    }
    fmt.Println("x is:", x)
}

func main() {
    riskyOperation(10)
    // riskyOperation(-5)  // Akan panic
    fmt.Println("Program continues")
}
```

## Defer
Duration: 0:15:00

### Penjelasan Sederhana

Defer menunda eksekusi function sampai surrounding function return.

### Basic Defer

```go
package main

import "fmt"

func main() {
    defer fmt.Println("World")
    fmt.Println("Hello")
}
// Output: Hello, World
```

### Multiple Defers

```go
package main

import "fmt"

func main() {
    defer fmt.Println("1")
    defer fmt.Println("2")
    defer fmt.Println("3")
    fmt.Println("Start")
}
// Output: Start, 3, 2, 1 (LIFO)
```

### Defer untuk Cleanup

```go
package main

import "fmt"

func processFile(filename string) error {
    fmt.Println("Opening file:", filename)
    defer fmt.Println("Closing file:", filename)
    
    // Process file...
    fmt.Println("Processing file...")
    
    return nil
}

func main() {
    processFile("data.txt")
}
```

## Recover
Duration: 0:15:00

### Penjelasan Sederhana

Recover menangkap panic dan memungkinkan program continue.

### Basic Recover

```go
package main

import "fmt"

func riskyOperation() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered from panic:", r)
        }
    }()
    
    panic("something went wrong")
    fmt.Println("This won't be printed")
}

func main() {
    riskyOperation()
    fmt.Println("Program continues")
}
```

## Studi Kasus: File Processor
Duration: 0:30:00

```go
package main

import (
    "fmt"
    "errors"
)

type FileError struct {
    Filename string
    Op       string
    Err      error
}

func (e *FileError) Error() string {
    return fmt.Sprintf("%s %s: %v", e.Op, e.Filename, e.Err)
}

func openFile(filename string) error {
    if filename == "" {
        return &FileError{
            Filename: filename,
            Op:       "open",
            Err:      errors.New("empty filename"),
        }
    }
    return nil
}

func readFile(filename string) (string, error) {
    if err := openFile(filename); err != nil {
        return "", err
    }
    
    // Simulate reading
    return "file content", nil
}

func processFile(filename string) (result string, err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("panic recovered: %v", r)
        }
    }()
    
    content, err := readFile(filename)
    if err != nil {
        return "", fmt.Errorf("processFile: %w", err)
    }
    
    return content, nil
}

func main() {
    fmt.Println("╔═══════════════════════════════════╗")
    fmt.Println("║      FILE PROCESSOR ROBUST        ║")
    fmt.Println("╚═══════════════════════════════════╝\n")
    
    files := []string{"data.txt", "", "config.json"}
    
    for _, file := range files {
        fmt.Printf("Processing: %s\n", file)
        
        content, err := processFile(file)
        if err != nil {
            fmt.Printf("  ❌ Error: %v\n\n", err)
            continue
        }
        
        fmt.Printf("  ✓ Success: %s\n\n", content)
    }
    
    fmt.Println("═══════════════════════════════════════")
}
```

## Ringkasan
Duration: 0:02:00

### Yang Sudah Dipelajari

✅ **Errors** - Proper error handling  
✅ **Panic** - Exceptional situations  
✅ **Defer** - Cleanup operations  
✅ **Recover** - Catching panics

### Langkah Selanjutnya

Lanjut ke **Bab 8: Standard Library**!

Positive
: Error handling yang baik membuat aplikasi production-ready!
