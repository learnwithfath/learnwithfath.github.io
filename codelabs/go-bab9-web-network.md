author: Qiscus Engineering Team
summary: Bab 9 - Web & Network di Go: HTTP Client/Server, Context dengan studi kasus REST API sederhana
id: go-bab9-web-network
categories: golang,backend,fundamental,indonesia
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/feedback

# Go Bab 9: Web & Network

## Pengenalan
Duration: 0:03:00

Bab terakhir! Mari belajar membuat web applications dengan Go.

### Apa yang Akan Dipelajari

* 🌐 HTTP Server - Membuat web server
* 📡 HTTP Client - Request ke API
* 🎯 Routing - Handle different paths
* 📦 Context - Request context management
* 💼 Studi Kasus - REST API sederhana

Positive
: Go sangat powerful untuk web development!

## HTTP Server
Duration: 0:25:00

### Basic Server

```go
package main

import (
    "fmt"
    "net/http"
)

func homeHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Welcome to Home Page!")
}

func aboutHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "About Us")
}

func main() {
    http.HandleFunc("/", homeHandler)
    http.HandleFunc("/about", aboutHandler)
    
    fmt.Println("Server running on :8080")
    http.ListenAndServe(":8080", nil)
}
```

### JSON Response

```go
package main

import (
    "encoding/json"
    "net/http"
)

type Response struct {
    Message string `json:"message"`
    Status  int    `json:"status"`
}

func apiHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    
    response := Response{
        Message: "Hello from API",
        Status:  200,
    }
    
    json.NewEncoder(w).Encode(response)
}

func main() {
    http.HandleFunc("/api", apiHandler)
    http.ListenAndServe(":8080", nil)
}
```

## HTTP Client
Duration: 0:20:00

### Making Requests

```go
package main

import (
    "fmt"
    "io"
    "net/http"
)

func main() {
    // GET request
    resp, err := http.Get("https://api.github.com")
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    defer resp.Body.Close()
    
    body, _ := io.ReadAll(resp.Body)
    fmt.Println("Response:", string(body))
    fmt.Println("Status:", resp.Status)
}
```

## Context
Duration: 0:20:00

### Request Context

```go
package main

import (
    "context"
    "fmt"
    "net/http"
    "time"
)

func handler(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
    
    select {
    case <-time.After(2 * time.Second):
        fmt.Fprintf(w, "Request completed")
    case <-ctx.Done():
        fmt.Fprintf(w, "Request cancelled")
    }
}

func main() {
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}
```

## Studi Kasus: REST API Sederhana
Duration: 0:35:00

```go
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "sync"
)

type Book struct {
    ID     int    `json:"id"`
    Title  string `json:"title"`
    Author string `json:"author"`
}

var (
    books  = make(map[int]Book)
    nextID = 1
    mu     sync.RWMutex
)

type Response struct {
    Success bool        `json:"success"`
    Message string      `json:"message"`
    Data    interface{} `json:"data,omitempty"`
}

func sendJSON(w http.ResponseWriter, data interface{}, status int) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(data)
}

func booksHandler(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case "GET":
        getBooks(w, r)
    case "POST":
        createBook(w, r)
    default:
        sendJSON(w, Response{
            Success: false,
            Message: "Method not allowed",
        }, http.StatusMethodNotAllowed)
    }
}

func getBooks(w http.ResponseWriter, r *http.Request) {
    mu.RLock()
    defer mu.RUnlock()
    
    bookList := []Book{}
    for _, book := range books {
        bookList = append(bookList, book)
    }
    
    sendJSON(w, Response{
        Success: true,
        Message: "Books retrieved",
        Data:    bookList,
    }, http.StatusOK)
}

func createBook(w http.ResponseWriter, r *http.Request) {
    var book Book
    if err := json.NewDecoder(r.Body).Decode(&book); err != nil {
        sendJSON(w, Response{
            Success: false,
            Message: "Invalid request body",
        }, http.StatusBadRequest)
        return
    }
    
    mu.Lock()
    book.ID = nextID
    nextID++
    books[book.ID] = book
    mu.Unlock()
    
    sendJSON(w, Response{
        Success: true,
        Message: "Book created",
        Data:    book,
    }, http.StatusCreated)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
    sendJSON(w, Response{
        Success: true,
        Message: "API is healthy",
    }, http.StatusOK)
}

func main() {
    fmt.Println("╔═══════════════════════════════════╗")
    fmt.Println("║       BOOKS REST API              ║")
    fmt.Println("╚═══════════════════════════════════╝")
    
    // Seed data
    books[1] = Book{ID: 1, Title: "Go Programming", Author: "John Doe"}
    books[2] = Book{ID: 2, Title: "Web Development", Author: "Jane Smith"}
    nextID = 3
    
    // Routes
    http.HandleFunc("/health", healthHandler)
    http.HandleFunc("/api/books", booksHandler)
    
    fmt.Println("\n🚀 Server running on http://localhost:8080")
    fmt.Println("\nEndpoints:")
    fmt.Println("  GET  /health")
    fmt.Println("  GET  /api/books")
    fmt.Println("  POST /api/books")
    fmt.Println("\n═══════════════════════════════════════")
    
    http.ListenAndServe(":8080", nil)
}
```

### Testing API

```bash
# Health check
curl http://localhost:8080/health

# Get all books
curl http://localhost:8080/api/books

# Create book
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"New Book","author":"Author Name"}'
```

## Ringkasan
Duration: 0:02:00

### Selamat! 🎉

Anda telah menyelesaikan **semua 9 bab** Go Fundamental!

### Yang Sudah Dipelajari

✅ **Bab 1** - Dasar-dasar Go  
✅ **Bab 2** - Control Flow  
✅ **Bab 3** - Data Structures  
✅ **Bab 4** - Functions  
✅ **Bab 5** - Advanced Types  
✅ **Bab 6** - Concurrency  
✅ **Bab 7** - Error Handling  
✅ **Bab 8** - Standard Library  
✅ **Bab 9** - Web & Network

### Langkah Selanjutnya

1. **Practice** - Buat project sendiri
2. **Database** - Belajar PostgreSQL & GORM
3. **Docker** - Containerize aplikasi
4. **Deploy** - Deploy ke production

### Resources

- [Go Documentation](https://go.dev/doc/)
- [Go by Example](https://gobyexample.com/)
- [Effective Go](https://go.dev/doc/effective_go)

Positive
: Selamat menyelesaikan Go Fundamental! Anda siap membuat aplikasi production-ready! 🚀
