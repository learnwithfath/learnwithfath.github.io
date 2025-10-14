author: Qiscus Engineering Team
summary: Bab 6 - Concurrency di Go: Goroutines, Channels, Select, WaitGroups dengan studi kasus web scraper concurrent
id: go-bab6-concurrency
categories: golang,backend,fundamental,indonesia
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/feedback

# Go Bab 6: Concurrency

## Pengenalan
Duration: 0:03:00

Concurrency adalah salah satu fitur paling powerful di Go!

### Apa yang Akan Dipelajari

* 🚀 Goroutines - Lightweight threads
* 📡 Channels - Komunikasi antar goroutines
* 🔀 Select - Multiple channel operations
* ⏳ WaitGroups - Synchronization
* 💼 Studi Kasus - Web scraper concurrent

Positive
: Concurrency di Go jauh lebih mudah dibanding bahasa lain!

## Goroutines
Duration: 0:20:00

### Penjelasan Sederhana

Goroutine adalah lightweight thread yang dikelola oleh Go runtime.

### Basic Goroutine

```go
package main

import (
    "fmt"
    "time"
)

func sayHello() {
    fmt.Println("Hello from goroutine!")
}

func main() {
    // Jalankan sebagai goroutine
    go sayHello()
    
    // Wait agar goroutine selesai
    time.Sleep(time.Second)
    
    fmt.Println("Main function ends")
}
```

### Multiple Goroutines

```go
package main

import (
    "fmt"
    "time"
)

func printNumbers() {
    for i := 1; i <= 5; i++ {
        fmt.Printf("Number: %d\n", i)
        time.Sleep(100 * time.Millisecond)
    }
}

func printLetters() {
    for i := 'a'; i <= 'e'; i++ {
        fmt.Printf("Letter: %c\n", i)
        time.Sleep(100 * time.Millisecond)
    }
}

func main() {
    go printNumbers()
    go printLetters()
    
    time.Sleep(time.Second)
}
```

## Channels
Duration: 0:25:00

### Penjelasan Sederhana

Channels adalah cara goroutines berkomunikasi dan synchronize.

### Basic Channel

```go
package main

import "fmt"

func main() {
    // Buat channel
    ch := make(chan string)
    
    // Send ke channel (di goroutine)
    go func() {
        ch <- "Hello from channel"
    }()
    
    // Receive dari channel
    msg := <-ch
    fmt.Println(msg)
}
```

### Buffered Channel

```go
package main

import "fmt"

func main() {
    // Buffered channel
    ch := make(chan int, 3)
    
    // Send tanpa goroutine (tidak block karena ada buffer)
    ch <- 1
    ch <- 2
    ch <- 3
    
    // Receive
    fmt.Println(<-ch)
    fmt.Println(<-ch)
    fmt.Println(<-ch)
}
```

### Range over Channel

```go
package main

import "fmt"

func main() {
    ch := make(chan int)
    
    go func() {
        for i := 1; i <= 5; i++ {
            ch <- i
        }
        close(ch)  // Penting!
    }()
    
    // Range akan loop sampai channel closed
    for num := range ch {
        fmt.Println(num)
    }
}
```

## Select Statement
Duration: 0:20:00

### Penjelasan Sederhana

Select memungkinkan goroutine menunggu multiple channel operations.

### Basic Select

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    ch1 := make(chan string)
    ch2 := make(chan string)
    
    go func() {
        time.Sleep(1 * time.Second)
        ch1 <- "from channel 1"
    }()
    
    go func() {
        time.Sleep(2 * time.Second)
        ch2 <- "from channel 2"
    }()
    
    // Select akan execute case yang ready duluan
    select {
    case msg1 := <-ch1:
        fmt.Println(msg1)
    case msg2 := <-ch2:
        fmt.Println(msg2)
    }
}
```

### Timeout Pattern

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    ch := make(chan string)
    
    go func() {
        time.Sleep(2 * time.Second)
        ch <- "result"
    }()
    
    select {
    case result := <-ch:
        fmt.Println(result)
    case <-time.After(1 * time.Second):
        fmt.Println("Timeout!")
    }
}
```

## WaitGroups
Duration: 0:15:00

### Penjelasan Sederhana

WaitGroup digunakan untuk menunggu collection of goroutines selesai.

### Basic WaitGroup

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

func worker(id int, wg *sync.WaitGroup) {
    defer wg.Done()  // Panggil Done saat selesai
    
    fmt.Printf("Worker %d starting\n", id)
    time.Sleep(time.Second)
    fmt.Printf("Worker %d done\n", id)
}

func main() {
    var wg sync.WaitGroup
    
    for i := 1; i <= 5; i++ {
        wg.Add(1)  // Tambah counter
        go worker(i, &wg)
    }
    
    wg.Wait()  // Wait sampai semua Done
    fmt.Println("All workers done")
}
```

## Studi Kasus: Web Scraper Concurrent
Duration: 0:30:00

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

type Result struct {
    URL    string
    Status string
    Time   time.Duration
}

func fetch(url string) Result {
    start := time.Now()
    
    // Simulate HTTP request
    time.Sleep(time.Second)
    
    return Result{
        URL:    url,
        Status: "200 OK",
        Time:   time.Since(start),
    }
}

func worker(id int, urls <-chan string, results chan<- Result, wg *sync.WaitGroup) {
    defer wg.Done()
    
    for url := range urls {
        fmt.Printf("Worker %d fetching %s\n", id, url)
        result := fetch(url)
        results <- result
    }
}

func main() {
    fmt.Println("╔═══════════════════════════════════╗")
    fmt.Println("║    CONCURRENT WEB SCRAPER         ║")
    fmt.Println("╚═══════════════════════════════════╝\n")
    
    urls := []string{
        "https://golang.org",
        "https://github.com",
        "https://stackoverflow.com",
        "https://reddit.com",
        "https://twitter.com",
    }
    
    numWorkers := 3
    urlsChan := make(chan string, len(urls))
    results := make(chan Result, len(urls))
    
    var wg sync.WaitGroup
    
    // Start workers
    for i := 1; i <= numWorkers; i++ {
        wg.Add(1)
        go worker(i, urlsChan, results, &wg)
    }
    
    // Send URLs
    for _, url := range urls {
        urlsChan <- url
    }
    close(urlsChan)
    
    // Wait for workers
    go func() {
        wg.Wait()
        close(results)
    }()
    
    // Collect results
    fmt.Println("\n📊 RESULTS:")
    fmt.Println("─────────────────────────────────────")
    for result := range results {
        fmt.Printf("✓ %s: %s (%.2fs)\n", 
            result.URL, result.Status, result.Time.Seconds())
    }
    
    fmt.Println("═══════════════════════════════════════")
}
```

## Ringkasan
Duration: 0:02:00

### Yang Sudah Dipelajari

✅ **Goroutines** - Lightweight concurrency  
✅ **Channels** - Communication between goroutines  
✅ **Select** - Multiple channel operations  
✅ **WaitGroups** - Synchronization

### Langkah Selanjutnya

Lanjut ke **Bab 7: Error Handling**!

Positive
: Concurrency membuat program lebih efficient dan responsive!
