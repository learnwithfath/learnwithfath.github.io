author: Qiscus Engineering Team
summary: Master concurrency di Go dengan goroutines, channels, select, dan worker pool patterns
id: go-concurrency-goroutines
categories: golang,backend,concurrency,indonesia
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/feedback

# Go Concurrency & Goroutines

## Pengenalan
Duration: 0:03:00

Selamat datang! Concurrency adalah salah satu fitur paling powerful di Go. Tutorial ini akan mengajarkan cara menulis concurrent programs yang efficient.

### Apa yang Akan Anda Pelajari
* Goroutines
* Channels
* Select statement
* Buffered channels
* Channel directions
* Worker pools
* Context package
* Common patterns
* Race conditions

### Prasyarat
* Tutorial "Go Dasar untuk Pemula"
* Pemahaman dasar tentang concurrency
* Go 1.16+ terinstall

Positive
: Concurrency di Go jauh lebih mudah dibanding bahasa lain!

## Goroutines Basics
Duration: 0:15:00

Goroutines adalah lightweight threads yang dikelola oleh Go runtime.

### Goroutine Pertama

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
    // Jalankan function biasa
    sayHello()
    
    // Jalankan sebagai goroutine
    go sayHello()
    
    // Wait agar goroutine selesai
    time.Sleep(time.Second)
    
    fmt.Println("Main function ends")
}
```

### Anonymous Goroutines

```go
func main() {
    // Anonymous function sebagai goroutine
    go func() {
        fmt.Println("Anonymous goroutine")
    }()
    
    // Dengan parameter
    go func(msg string) {
        fmt.Println(msg)
    }("Hello from parameter")
    
    time.Sleep(time.Second)
}
```

### Multiple Goroutines

```go
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
    fmt.Println("Done")
}
```

### Goroutine Properties

- **Lightweight** - Hanya butuh ~2KB memory
- **Cheap** - Bisa buat ribuan goroutines
- **Managed** - Go runtime handle scheduling
- **Non-blocking** - Tidak block main thread

Negative
: Jangan gunakan time.Sleep untuk synchronization! Gunakan channels.

## Channels
Duration: 0:20:00

Channels adalah cara goroutines berkomunikasi.

### Channel Basics

```go
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

### Channel Operations

```go
// Buat channel
ch := make(chan int)

// Send (akan block sampai ada receiver)
ch <- 42

// Receive (akan block sampai ada sender)
value := <-ch

// Receive dan ignore value
<-ch

// Close channel
close(ch)

// Check if closed
value, ok := <-ch
if !ok {
    fmt.Println("Channel closed")
}
```

### Bidirectional Communication

```go
func worker(input chan int, output chan int) {
    for num := range input {
        output <- num * 2
    }
    close(output)
}

func main() {
    input := make(chan int)
    output := make(chan int)
    
    go worker(input, output)
    
    // Send data
    go func() {
        for i := 1; i <= 5; i++ {
            input <- i
        }
        close(input)
    }()
    
    // Receive results
    for result := range output {
        fmt.Println(result)
    }
}
```

### Range over Channel

```go
func main() {
    ch := make(chan int)
    
    go func() {
        for i := 1; i <= 5; i++ {
            ch <- i
        }
        close(ch)
    }()
    
    // Range akan loop sampai channel closed
    for num := range ch {
        fmt.Println(num)
    }
}
```

Positive
: Channels membuat concurrent programming aman dan mudah!

## Buffered Channels
Duration: 0:15:00

Buffered channels punya kapasitas untuk menyimpan values.

### Unbuffered vs Buffered

```go
// Unbuffered - block sampai ada receiver
ch1 := make(chan int)

// Buffered - tidak block sampai buffer penuh
ch2 := make(chan int, 3)
```

### Buffered Channel Example

```go
func main() {
    // Buffer size 3
    ch := make(chan string, 3)
    
    // Send tanpa goroutine (tidak block karena ada buffer)
    ch <- "first"
    ch <- "second"
    ch <- "third"
    
    // Receive
    fmt.Println(<-ch)
    fmt.Println(<-ch)
    fmt.Println(<-ch)
}
```

### Buffer Full

```go
func main() {
    ch := make(chan int, 2)
    
    ch <- 1
    ch <- 2
    // ch <- 3  // Akan deadlock! Buffer penuh
    
    fmt.Println(<-ch)
    ch <- 3  // Sekarang bisa, ada space
    
    fmt.Println(<-ch)
    fmt.Println(<-ch)
}
```

### Practical Example

```go
func processJobs(jobs chan int, results chan int) {
    for job := range jobs {
        // Simulate processing
        time.Sleep(100 * time.Millisecond)
        results <- job * 2
    }
}

func main() {
    jobs := make(chan int, 10)
    results := make(chan int, 10)
    
    // Start 3 workers
    for w := 1; w <= 3; w++ {
        go processJobs(jobs, results)
    }
    
    // Send jobs
    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs)
    
    // Collect results
    for a := 1; a <= 9; a++ {
        fmt.Println(<-results)
    }
}
```

### Buffer Size Guidelines

```go
// Small buffer (1-10) - untuk coordination
ch := make(chan int, 5)

// Medium buffer (10-100) - untuk batching
ch := make(chan Task, 50)

// Large buffer (100+) - untuk high throughput
ch := make(chan Message, 1000)
```

Negative
: Buffer terlalu besar bisa waste memory. Mulai dengan unbuffered, tambah buffer jika perlu.

## Select Statement
Duration: 0:15:00

Select memungkinkan goroutine menunggu multiple channel operations.

### Basic Select

```go
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

### Select dengan Multiple Cases

```go
func main() {
    ch1 := make(chan string)
    ch2 := make(chan string)
    
    go func() {
        for {
            ch1 <- "from 1"
            time.Sleep(500 * time.Millisecond)
        }
    }()
    
    go func() {
        for {
            ch2 <- "from 2"
            time.Sleep(700 * time.Millisecond)
        }
    }()
    
    for i := 0; i < 5; i++ {
        select {
        case msg1 := <-ch1:
            fmt.Println(msg1)
        case msg2 := <-ch2:
            fmt.Println(msg2)
        }
    }
}
```

### Default Case

```go
func main() {
    ch := make(chan string)
    
    select {
    case msg := <-ch:
        fmt.Println(msg)
    default:
        fmt.Println("No message received")
    }
}
```

### Timeout Pattern

```go
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

### Non-blocking Send/Receive

```go
func main() {
    ch := make(chan int, 1)
    
    // Non-blocking send
    select {
    case ch <- 42:
        fmt.Println("Sent")
    default:
        fmt.Println("Channel full")
    }
    
    // Non-blocking receive
    select {
    case val := <-ch:
        fmt.Println("Received:", val)
    default:
        fmt.Println("No value")
    }
}
```

Positive
: Select adalah tool yang sangat powerful untuk handle multiple channels!

## Channel Directions
Duration: 0:10:00

Specify apakah channel untuk send-only atau receive-only.

### Send-only Channel

```go
func sendData(ch chan<- int) {
    ch <- 42
    // val := <-ch  // Error! Send-only
}
```

### Receive-only Channel

```go
func receiveData(ch <-chan int) {
    val := <-ch
    fmt.Println(val)
    // ch <- 42  // Error! Receive-only
}
```

### Complete Example

```go
func producer(ch chan<- int) {
    for i := 1; i <= 5; i++ {
        ch <- i
        fmt.Printf("Produced: %d\n", i)
    }
    close(ch)
}

func consumer(ch <-chan int) {
    for num := range ch {
        fmt.Printf("Consumed: %d\n", num)
    }
}

func main() {
    ch := make(chan int)
    
    go producer(ch)
    consumer(ch)
}
```

### Benefits

1. **Type safety** - Compile-time checking
2. **Clear intent** - Dokumentasi yang jelas
3. **Prevent mistakes** - Tidak bisa salah gunakan channel

```go
// Good practice
func process(input <-chan Task, output chan<- Result) {
    for task := range input {
        result := doWork(task)
        output <- result
    }
}
```

## Worker Pool Pattern
Duration: 0:20:00

Worker pool adalah pattern untuk process tasks concurrently dengan jumlah workers terbatas.

### Basic Worker Pool

```go
package main

import (
    "fmt"
    "time"
)

type Job struct {
    ID     int
    Data   string
}

type Result struct {
    JobID  int
    Output string
}

func worker(id int, jobs <-chan Job, results chan<- Result) {
    for job := range jobs {
        fmt.Printf("Worker %d started job %d\n", id, job.ID)
        
        // Simulate work
        time.Sleep(time.Second)
        
        result := Result{
            JobID:  job.ID,
            Output: fmt.Sprintf("Processed: %s", job.Data),
        }
        
        results <- result
        fmt.Printf("Worker %d finished job %d\n", id, job.ID)
    }
}

func main() {
    numWorkers := 3
    numJobs := 9
    
    jobs := make(chan Job, numJobs)
    results := make(chan Result, numJobs)
    
    // Start workers
    for w := 1; w <= numWorkers; w++ {
        go worker(w, jobs, results)
    }
    
    // Send jobs
    for j := 1; j <= numJobs; j++ {
        jobs <- Job{
            ID:   j,
            Data: fmt.Sprintf("task-%d", j),
        }
    }
    close(jobs)
    
    // Collect results
    for a := 1; a <= numJobs; a++ {
        result := <-results
        fmt.Printf("Result: Job %d - %s\n", result.JobID, result.Output)
    }
}
```

### Advanced Worker Pool

```go
type WorkerPool struct {
    numWorkers int
    jobs       chan Job
    results    chan Result
    done       chan bool
}

func NewWorkerPool(numWorkers, bufferSize int) *WorkerPool {
    return &WorkerPool{
        numWorkers: numWorkers,
        jobs:       make(chan Job, bufferSize),
        results:    make(chan Result, bufferSize),
        done:       make(chan bool),
    }
}

func (wp *WorkerPool) Start() {
    for i := 1; i <= wp.numWorkers; i++ {
        go wp.worker(i)
    }
}

func (wp *WorkerPool) worker(id int) {
    for job := range wp.jobs {
        fmt.Printf("Worker %d processing job %d\n", id, job.ID)
        time.Sleep(time.Second)
        
        wp.results <- Result{
            JobID:  job.ID,
            Output: fmt.Sprintf("Done: %s", job.Data),
        }
    }
}

func (wp *WorkerPool) Submit(job Job) {
    wp.jobs <- job
}

func (wp *WorkerPool) Close() {
    close(wp.jobs)
}

func (wp *WorkerPool) Results() <-chan Result {
    return wp.results
}
```

### Usage

```go
func main() {
    pool := NewWorkerPool(5, 100)
    pool.Start()
    
    // Submit jobs
    go func() {
        for i := 1; i <= 20; i++ {
            pool.Submit(Job{
                ID:   i,
                Data: fmt.Sprintf("task-%d", i),
            })
        }
        pool.Close()
    }()
    
    // Process results
    for i := 1; i <= 20; i++ {
        result := <-pool.Results()
        fmt.Println(result.Output)
    }
}
```

Positive
: Worker pools efisien untuk process banyak tasks dengan resource terbatas!

## Context Package
Duration: 0:15:00

Context untuk cancellation, timeouts, dan passing values.

### Context Basics

```go
import "context"

func main() {
    // Background context
    ctx := context.Background()
    
    // TODO context (placeholder)
    ctx = context.TODO()
}
```

### WithCancel

```go
func worker(ctx context.Context, id int) {
    for {
        select {
        case <-ctx.Done():
            fmt.Printf("Worker %d cancelled\n", id)
            return
        default:
            fmt.Printf("Worker %d working...\n", id)
            time.Sleep(500 * time.Millisecond)
        }
    }
}

func main() {
    ctx, cancel := context.WithCancel(context.Background())
    
    for i := 1; i <= 3; i++ {
        go worker(ctx, i)
    }
    
    time.Sleep(2 * time.Second)
    cancel()  // Cancel all workers
    
    time.Sleep(time.Second)
}
```

### WithTimeout

```go
func fetchData(ctx context.Context) error {
    select {
    case <-time.After(2 * time.Second):
        return nil
    case <-ctx.Done():
        return ctx.Err()
    }
}

func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
    defer cancel()
    
    if err := fetchData(ctx); err != nil {
        fmt.Println("Error:", err)  // context deadline exceeded
    }
}
```

### WithDeadline

```go
func main() {
    deadline := time.Now().Add(3 * time.Second)
    ctx, cancel := context.WithDeadline(context.Background(), deadline)
    defer cancel()
    
    select {
    case <-time.After(5 * time.Second):
        fmt.Println("Work done")
    case <-ctx.Done():
        fmt.Println("Deadline exceeded:", ctx.Err())
    }
}
```

### WithValue

```go
func worker(ctx context.Context) {
    userID := ctx.Value("userID")
    requestID := ctx.Value("requestID")
    
    fmt.Printf("User: %v, Request: %v\n", userID, requestID)
}

func main() {
    ctx := context.Background()
    ctx = context.WithValue(ctx, "userID", 123)
    ctx = context.WithValue(ctx, "requestID", "abc-123")
    
    worker(ctx)
}
```

Negative
: Jangan overuse WithValue! Hanya untuk request-scoped data.

## Race Conditions
Duration: 0:15:00

Race conditions terjadi ketika multiple goroutines akses shared data.

### Race Condition Example

```go
package main

import (
    "fmt"
    "time"
)

var counter = 0

func increment() {
    counter++
}

func main() {
    for i := 0; i < 1000; i++ {
        go increment()
    }
    
    time.Sleep(time.Second)
    fmt.Println("Counter:", counter)  // Tidak selalu 1000!
}
```

### Detect Race Conditions

```bash
go run -race main.go
```

### Solution 1: Mutex

```go
import "sync"

var (
    counter int
    mu      sync.Mutex
)

func increment() {
    mu.Lock()
    counter++
    mu.Unlock()
}
```

### Solution 2: Atomic Operations

```go
import "sync/atomic"

var counter int64

func increment() {
    atomic.AddInt64(&counter, 1)
}
```

### Solution 3: Channels

```go
func main() {
    counter := 0
    ch := make(chan int)
    
    // Goroutine untuk update counter
    go func() {
        for range ch {
            counter++
        }
    }()
    
    // Send 1000 increments
    for i := 0; i < 1000; i++ {
        ch <- 1
    }
    
    close(ch)
    time.Sleep(time.Millisecond)
    fmt.Println("Counter:", counter)
}
```

## Common Patterns
Duration: 0:15:00

Pattern-pattern yang sering digunakan dalam concurrent Go.

### Fan-Out, Fan-In

```go
func producer(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        for _, n := range nums {
            out <- n
        }
        close(out)
    }()
    return out
}

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        for n := range in {
            out <- n * n
        }
        close(out)
    }()
    return out
}

func merge(cs ...<-chan int) <-chan int {
    out := make(chan int)
    var wg sync.WaitGroup
    
    for _, c := range cs {
        wg.Add(1)
        go func(ch <-chan int) {
            defer wg.Done()
            for n := range ch {
                out <- n
            }
        }(c)
    }
    
    go func() {
        wg.Wait()
        close(out)
    }()
    
    return out
}

func main() {
    in := producer(1, 2, 3, 4, 5)
    
    // Fan-out
    c1 := square(in)
    c2 := square(in)
    
    // Fan-in
    for n := range merge(c1, c2) {
        fmt.Println(n)
    }
}
```

### Pipeline Pattern

```go
func gen(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        for _, n := range nums {
            out <- n
        }
        close(out)
    }()
    return out
}

func sq(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        for n := range in {
            out <- n * n
        }
        close(out)
    }()
    return out
}

func main() {
    // Pipeline: gen -> sq -> sq
    for n := range sq(sq(gen(2, 3, 4))) {
        fmt.Println(n)
    }
}
```

### Rate Limiting

```go
func main() {
    requests := make(chan int, 5)
    for i := 1; i <= 5; i++ {
        requests <- i
    }
    close(requests)
    
    limiter := time.Tick(200 * time.Millisecond)
    
    for req := range requests {
        <-limiter
        fmt.Println("Request", req, time.Now())
    }
}
```

Positive
: Patterns ini membuat concurrent code lebih maintainable!

## Project: Concurrent Web Scraper
Duration: 0:30:00

Mari buat web scraper concurrent yang efficient!

```go
package main

import (
    "fmt"
    "io"
    "net/http"
    "sync"
    "time"
)

type Result struct {
    URL    string
    Status int
    Size   int
    Error  error
}

func fetch(url string) Result {
    start := time.Now()
    
    resp, err := http.Get(url)
    if err != nil {
        return Result{URL: url, Error: err}
    }
    defer resp.Body.Close()
    
    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return Result{URL: url, Status: resp.StatusCode, Error: err}
    }
    
    fmt.Printf("Fetched %s in %v\n", url, time.Since(start))
    
    return Result{
        URL:    url,
        Status: resp.StatusCode,
        Size:   len(body),
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
    fmt.Println("\n=== Results ===")
    for result := range results {
        if result.Error != nil {
            fmt.Printf("❌ %s: %v\n", result.URL, result.Error)
        } else {
            fmt.Printf("✅ %s: %d bytes (status: %d)\n", 
                result.URL, result.Size, result.Status)
        }
    }
}
```

## Ringkasan
Duration: 0:05:00

Selamat! Anda telah mempelajari:

* ✅ Goroutines
* ✅ Channels (buffered & unbuffered)
* ✅ Select statement
* ✅ Channel directions
* ✅ Worker pools
* ✅ Context package
* ✅ Race conditions
* ✅ Common patterns

### Phase 1 Complete!

Anda sudah menyelesaikan Phase 1: Core Backend with Go!

* ✅ 1.1 Basic Go
* ✅ 1.2 HTTP & REST API
* ✅ 1.3 Packages & Modules
* ✅ 1.4 Concurrency & Goroutines

### Langkah Selanjutnya
* **Phase 2**: PostgreSQL & Redis
* Database integration
* Caching strategies
* ORM dengan GORM

### Resources
* [Go Concurrency Patterns](https://go.dev/blog/pipelines)
* [Effective Go](https://go.dev/doc/effective_go)
* [Go by Example: Goroutines](https://gobyexample.com/goroutines)

Positive
: Selamat menyelesaikan Phase 1! Lanjut ke Phase 2 untuk belajar database! 🎉
