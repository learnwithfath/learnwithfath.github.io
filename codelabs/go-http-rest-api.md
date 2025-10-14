author: Qiscus Engineering Team
summary: Belajar membuat REST API dengan Go menggunakan net/http, handlers, JSON, dan routing patterns
id: go-http-rest-api
categories: golang,backend,api,indonesia
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/feedback

# Go HTTP & REST API

## Pengenalan
Duration: 0:03:00

Selamat datang di tutorial REST API dengan Go! Anda akan belajar membuat API backend yang powerful menggunakan Go standard library.

### Apa yang Akan Anda Pelajari
* Package net/http
* HTTP handlers dan routing
* Request dan Response handling
* JSON encoding/decoding
* Middleware
* Error handling
* CRUD operations
* Best practices REST API

### Prasyarat
* Sudah menyelesaikan tutorial "Go Dasar untuk Pemula"
* Memahami HTTP basics (GET, POST, PUT, DELETE)
* Postman atau curl untuk testing API

Positive
: Tutorial ini menggunakan Go standard library tanpa framework eksternal!

## Setup Project
Duration: 0:05:00

Mari kita setup project REST API kita.

### Buat Project Baru

```bash
mkdir notes-api
cd notes-api
go mod init notes-api
```

### Struktur Folder

```
notes-api/
├── main.go
├── handlers/
│   └── notes.go
├── models/
│   └── note.go
└── go.mod
```

### Install Dependencies (Optional)

Untuk tutorial ini kita hanya pakai standard library, tapi untuk production biasanya butuh:

```bash
# UUID generator (optional)
go get github.com/google/uuid
```

Positive
: Go standard library sudah sangat powerful untuk membuat API!

## HTTP Server Dasar
Duration: 0:10:00

Mari kita buat HTTP server pertama.

### File main.go

```go
package main

import (
    "fmt"
    "log"
    "net/http"
)

func main() {
    // Handler sederhana
    http.HandleFunc("/", homeHandler)
    http.HandleFunc("/hello", helloHandler)
    
    // Start server
    port := ":8080"
    fmt.Printf("Server running on http://localhost%s\n", port)
    log.Fatal(http.ListenAndServe(port, nil))
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Welcome to Notes API!")
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
    name := r.URL.Query().Get("name")
    if name == "" {
        name = "Guest"
    }
    fmt.Fprintf(w, "Hello, %s!", name)
}
```

### Jalankan Server

```bash
go run main.go
```

### Test dengan curl

```bash
# Test home endpoint
curl http://localhost:8080/

# Test hello endpoint
curl http://localhost:8080/hello?name=Fathullah
```

### Penjelasan Kode

**http.HandleFunc()**
- Register handler untuk path tertentu
- Menerima path dan handler function

**http.ResponseWriter**
- Interface untuk menulis response
- Method: Write(), WriteHeader(), Header()

**http.Request**
- Struct yang berisi informasi request
- Method, URL, Headers, Body, dll

Positive
: Server HTTP Anda sudah berjalan! Mari kita buat REST API yang lebih kompleks.

## JSON Response
Duration: 0:15:00

REST API biasanya menggunakan JSON. Mari kita pelajari cara handle JSON di Go.

### Model Data

Buat file `models/note.go`:

```go
package models

import "time"

type Note struct {
    ID        string    `json:"id"`
    Title     string    `json:"title"`
    Content   string    `json:"content"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}

type Response struct {
    Success bool        `json:"success"`
    Message string      `json:"message"`
    Data    interface{} `json:"data,omitempty"`
}

type ErrorResponse struct {
    Success bool   `json:"success"`
    Error   string `json:"error"`
}
```

### JSON Encoding

Update `main.go`:

```go
package main

import (
    "encoding/json"
    "log"
    "net/http"
    "time"
    
    "notes-api/models"
)

func main() {
    http.HandleFunc("/api/health", healthHandler)
    http.HandleFunc("/api/notes", notesHandler)
    
    log.Println("Server running on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    
    response := models.Response{
        Success: true,
        Message: "API is healthy",
        Data: map[string]string{
            "status": "ok",
            "time":   time.Now().Format(time.RFC3339),
        },
    }
    
    json.NewEncoder(w).Encode(response)
}

func notesHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    
    // Dummy data
    notes := []models.Note{
        {
            ID:        "1",
            Title:     "First Note",
            Content:   "This is my first note",
            CreatedAt: time.Now(),
            UpdatedAt: time.Now(),
        },
        {
            ID:        "2",
            Title:     "Second Note",
            Content:   "This is my second note",
            CreatedAt: time.Now(),
            UpdatedAt: time.Now(),
        },
    }
    
    response := models.Response{
        Success: true,
        Message: "Notes retrieved successfully",
        Data:    notes,
    }
    
    json.NewEncoder(w).Encode(response)
}
```

### Test JSON Response

```bash
# Test health endpoint
curl http://localhost:8080/api/health

# Test notes endpoint
curl http://localhost:8080/api/notes
```

Negative
: Jangan lupa set Content-Type header ke "application/json"!

## HTTP Methods & Routing
Duration: 0:15:00

REST API menggunakan HTTP methods yang berbeda untuk operasi yang berbeda.

### Method Routing

```go
func notesHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    
    switch r.Method {
    case http.MethodGet:
        getNotes(w, r)
    case http.MethodPost:
        createNote(w, r)
    case http.MethodPut:
        updateNote(w, r)
    case http.MethodDelete:
        deleteNote(w, r)
    default:
        sendError(w, "Method not allowed", http.StatusMethodNotAllowed)
    }
}

func getNotes(w http.ResponseWriter, r *http.Request) {
    // Implementation
}

func createNote(w http.ResponseWriter, r *http.Request) {
    // Implementation
}

func updateNote(w http.ResponseWriter, r *http.Request) {
    // Implementation
}

func deleteNote(w http.ResponseWriter, r *http.Request) {
    // Implementation
}

func sendError(w http.ResponseWriter, message string, statusCode int) {
    w.WriteHeader(statusCode)
    response := models.ErrorResponse{
        Success: false,
        Error:   message,
    }
    json.NewEncoder(w).Encode(response)
}
```

### Path Parameters

```go
func noteDetailHandler(w http.ResponseWriter, r *http.Request) {
    // Extract ID from URL path
    // /api/notes/123 -> ID = 123
    path := r.URL.Path
    id := strings.TrimPrefix(path, "/api/notes/")
    
    if id == "" {
        sendError(w, "Note ID required", http.StatusBadRequest)
        return
    }
    
    // Find note by ID
    // ...
}
```

### Query Parameters

```go
func getNotesWithFilter(w http.ResponseWriter, r *http.Request) {
    // Get query parameters
    // /api/notes?search=golang&limit=10
    
    search := r.URL.Query().Get("search")
    limit := r.URL.Query().Get("limit")
    
    // Use parameters to filter
    // ...
}
```

## CRUD Operations
Duration: 0:25:00

Mari kita implementasikan CRUD lengkap untuk Notes API.

### In-Memory Storage

Buat file `handlers/notes.go`:

```go
package handlers

import (
    "encoding/json"
    "net/http"
    "strings"
    "sync"
    "time"
    
    "notes-api/models"
)

var (
    notes   = make(map[string]models.Note)
    notesMu sync.RWMutex
    nextID  = 1
)

type CreateNoteRequest struct {
    Title   string `json:"title"`
    Content string `json:"content"`
}

type UpdateNoteRequest struct {
    Title   string `json:"title"`
    Content string `json:"content"`
}
```

### GET - List All Notes

```go
func GetNotes(w http.ResponseWriter, r *http.Request) {
    notesMu.RLock()
    defer notesMu.RUnlock()
    
    notesList := make([]models.Note, 0, len(notes))
    for _, note := range notes {
        notesList = append(notesList, note)
    }
    
    sendJSON(w, models.Response{
        Success: true,
        Message: "Notes retrieved successfully",
        Data:    notesList,
    }, http.StatusOK)
}
```

### GET - Single Note

```go
func GetNote(w http.ResponseWriter, r *http.Request) {
    id := extractID(r.URL.Path)
    if id == "" {
        sendError(w, "Note ID required", http.StatusBadRequest)
        return
    }
    
    notesMu.RLock()
    note, exists := notes[id]
    notesMu.RUnlock()
    
    if !exists {
        sendError(w, "Note not found", http.StatusNotFound)
        return
    }
    
    sendJSON(w, models.Response{
        Success: true,
        Message: "Note retrieved successfully",
        Data:    note,
    }, http.StatusOK)
}
```

### POST - Create Note

```go
func CreateNote(w http.ResponseWriter, r *http.Request) {
    var req CreateNoteRequest
    
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        sendError(w, "Invalid request body", http.StatusBadRequest)
        return
    }
    
    // Validation
    if req.Title == "" {
        sendError(w, "Title is required", http.StatusBadRequest)
        return
    }
    
    // Create note
    notesMu.Lock()
    id := fmt.Sprintf("%d", nextID)
    nextID++
    
    note := models.Note{
        ID:        id,
        Title:     req.Title,
        Content:   req.Content,
        CreatedAt: time.Now(),
        UpdatedAt: time.Now(),
    }
    
    notes[id] = note
    notesMu.Unlock()
    
    sendJSON(w, models.Response{
        Success: true,
        Message: "Note created successfully",
        Data:    note,
    }, http.StatusCreated)
}
```

### PUT - Update Note

```go
func UpdateNote(w http.ResponseWriter, r *http.Request) {
    id := extractID(r.URL.Path)
    if id == "" {
        sendError(w, "Note ID required", http.StatusBadRequest)
        return
    }
    
    var req UpdateNoteRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        sendError(w, "Invalid request body", http.StatusBadRequest)
        return
    }
    
    notesMu.Lock()
    defer notesMu.Unlock()
    
    note, exists := notes[id]
    if !exists {
        sendError(w, "Note not found", http.StatusNotFound)
        return
    }
    
    // Update fields
    if req.Title != "" {
        note.Title = req.Title
    }
    if req.Content != "" {
        note.Content = req.Content
    }
    note.UpdatedAt = time.Now()
    
    notes[id] = note
    
    sendJSON(w, models.Response{
        Success: true,
        Message: "Note updated successfully",
        Data:    note,
    }, http.StatusOK)
}
```

### DELETE - Delete Note

```go
func DeleteNote(w http.ResponseWriter, r *http.Request) {
    id := extractID(r.URL.Path)
    if id == "" {
        sendError(w, "Note ID required", http.StatusBadRequest)
        return
    }
    
    notesMu.Lock()
    defer notesMu.Unlock()
    
    if _, exists := notes[id]; !exists {
        sendError(w, "Note not found", http.StatusNotFound)
        return
    }
    
    delete(notes, id)
    
    sendJSON(w, models.Response{
        Success: true,
        Message: "Note deleted successfully",
        Data:    nil,
    }, http.StatusOK)
}
```

### Helper Functions

```go
func sendJSON(w http.ResponseWriter, data interface{}, statusCode int) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(statusCode)
    json.NewEncoder(w).Encode(data)
}

func sendError(w http.ResponseWriter, message string, statusCode int) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(statusCode)
    json.NewEncoder(w).Encode(models.ErrorResponse{
        Success: false,
        Error:   message,
    })
}

func extractID(path string) string {
    parts := strings.Split(path, "/")
    if len(parts) > 0 {
        return parts[len(parts)-1]
    }
    return ""
}
```

Positive
: CRUD operations lengkap! Mari kita test dengan Postman atau curl.

## Testing API dengan curl
Duration: 0:15:00

Mari kita test semua endpoint yang sudah dibuat.

### 1. Create Note (POST)

```bash
curl -X POST http://localhost:8080/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Belajar Go",
    "content": "Go adalah bahasa yang powerful untuk backend"
  }'
```

### 2. Get All Notes (GET)

```bash
curl http://localhost:8080/api/notes
```

### 3. Get Single Note (GET)

```bash
curl http://localhost:8080/api/notes/1
```

### 4. Update Note (PUT)

```bash
curl -X PUT http://localhost:8080/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Belajar Go - Updated",
    "content": "Go sangat cocok untuk microservices"
  }'
```

### 5. Delete Note (DELETE)

```bash
curl -X DELETE http://localhost:8080/api/notes/1
```

### Test dengan Postman

1. Import collection atau buat manual
2. Set base URL: `http://localhost:8080`
3. Test semua endpoints
4. Verify responses

Negative
: Pastikan server berjalan sebelum testing!

## Middleware
Duration: 0:15:00

Middleware adalah function yang berjalan sebelum handler utama. Berguna untuk logging, authentication, dll.

### Logger Middleware

```go
func loggingMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        
        log.Printf("[%s] %s %s", r.Method, r.URL.Path, r.RemoteAddr)
        
        next(w, r)
        
        log.Printf("Completed in %v", time.Since(start))
    }
}
```

### CORS Middleware

```go
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        
        next(w, r)
    }
}
```

### Authentication Middleware

```go
func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        token := r.Header.Get("Authorization")
        
        if token == "" {
            sendError(w, "Unauthorized", http.StatusUnauthorized)
            return
        }
        
        // Validate token
        if !isValidToken(token) {
            sendError(w, "Invalid token", http.StatusUnauthorized)
            return
        }
        
        next(w, r)
    }
}

func isValidToken(token string) bool {
    // Implement token validation
    return token == "Bearer secret-token"
}
```

### Chain Middleware

```go
func chainMiddleware(handler http.HandlerFunc, middlewares ...func(http.HandlerFunc) http.HandlerFunc) http.HandlerFunc {
    for i := len(middlewares) - 1; i >= 0; i-- {
        handler = middlewares[i](handler)
    }
    return handler
}

// Usage
func main() {
    http.HandleFunc("/api/notes", 
        chainMiddleware(
            notesHandler,
            loggingMiddleware,
            corsMiddleware,
        ),
    )
}
```

Positive
: Middleware membuat kode lebih modular dan reusable!

## Error Handling
Duration: 0:10:00

Error handling yang baik penting untuk API yang robust.

### Custom Error Types

```go
type APIError struct {
    StatusCode int
    Message    string
    Err        error
}

func (e *APIError) Error() string {
    if e.Err != nil {
        return fmt.Sprintf("%s: %v", e.Message, e.Err)
    }
    return e.Message
}

func NewAPIError(statusCode int, message string, err error) *APIError {
    return &APIError{
        StatusCode: statusCode,
        Message:    message,
        Err:        err,
    }
}
```

### Error Handler Middleware

```go
type HandlerWithError func(w http.ResponseWriter, r *http.Request) error

func errorHandler(handler HandlerWithError) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        if err := handler(w, r); err != nil {
            var apiErr *APIError
            if errors.As(err, &apiErr) {
                sendError(w, apiErr.Message, apiErr.StatusCode)
            } else {
                sendError(w, "Internal server error", http.StatusInternalServerError)
            }
            log.Printf("Error: %v", err)
        }
    }
}
```

### Usage

```go
func getNoteWithError(w http.ResponseWriter, r *http.Request) error {
    id := extractID(r.URL.Path)
    if id == "" {
        return NewAPIError(http.StatusBadRequest, "Note ID required", nil)
    }
    
    note, exists := notes[id]
    if !exists {
        return NewAPIError(http.StatusNotFound, "Note not found", nil)
    }
    
    sendJSON(w, note, http.StatusOK)
    return nil
}

// Register handler
http.HandleFunc("/api/notes/", errorHandler(getNoteWithError))
```

## Best Practices
Duration: 0:10:00

Tips untuk membuat REST API yang baik.

### 1. Consistent Response Format

```go
type APIResponse struct {
    Success bool        `json:"success"`
    Message string      `json:"message,omitempty"`
    Data    interface{} `json:"data,omitempty"`
    Error   string      `json:"error,omitempty"`
    Meta    *Meta       `json:"meta,omitempty"`
}

type Meta struct {
    Page       int `json:"page,omitempty"`
    PerPage    int `json:"per_page,omitempty"`
    TotalPages int `json:"total_pages,omitempty"`
    TotalItems int `json:"total_items,omitempty"`
}
```

### 2. Proper HTTP Status Codes

```go
// Success
200 OK          - GET, PUT, DELETE berhasil
201 Created     - POST berhasil create resource
204 No Content  - DELETE berhasil tanpa response body

// Client Errors
400 Bad Request      - Request invalid
401 Unauthorized     - Belum login
403 Forbidden        - Tidak punya akses
404 Not Found        - Resource tidak ditemukan
422 Unprocessable    - Validation error

// Server Errors
500 Internal Server Error - Error di server
503 Service Unavailable   - Service down
```

### 3. Input Validation

```go
func validateCreateNote(req CreateNoteRequest) error {
    if req.Title == "" {
        return fmt.Errorf("title is required")
    }
    if len(req.Title) > 200 {
        return fmt.Errorf("title too long (max 200 characters)")
    }
    if len(req.Content) > 5000 {
        return fmt.Errorf("content too long (max 5000 characters)")
    }
    return nil
}
```

### 4. Pagination

```go
func getPaginatedNotes(w http.ResponseWriter, r *http.Request) {
    page, _ := strconv.Atoi(r.URL.Query().Get("page"))
    perPage, _ := strconv.Atoi(r.URL.Query().Get("per_page"))
    
    if page < 1 {
        page = 1
    }
    if perPage < 1 || perPage > 100 {
        perPage = 10
    }
    
    // Calculate pagination
    start := (page - 1) * perPage
    end := start + perPage
    
    // Get paginated data
    // ...
}
```

Positive
: Best practices membuat API Anda lebih maintainable dan user-friendly!

## Project: Complete Notes API
Duration: 0:30:00

Mari kita gabungkan semua yang sudah dipelajari menjadi API lengkap.

### Final main.go

```go
package main

import (
    "log"
    "net/http"
    
    "notes-api/handlers"
)

func main() {
    // Health check
    http.HandleFunc("/api/health", handlers.HealthCheck)
    
    // Notes endpoints
    http.HandleFunc("/api/notes", handlers.NotesHandler)
    http.HandleFunc("/api/notes/", handlers.NoteDetailHandler)
    
    // Start server
    port := ":8080"
    log.Printf("Server starting on http://localhost%s", port)
    log.Printf("API Documentation: http://localhost%s/api/health", port)
    
    if err := http.ListenAndServe(port, nil); err != nil {
        log.Fatal(err)
    }
}
```

### Test Complete API

1. Start server
2. Create beberapa notes
3. List all notes
4. Update note
5. Delete note
6. Test error cases

Positive
: Selamat! Anda sudah membuat REST API lengkap dengan Go!

## Ringkasan
Duration: 0:05:00

Anda telah mempelajari:

* ✅ HTTP server dengan net/http
* ✅ JSON encoding/decoding
* ✅ HTTP methods dan routing
* ✅ CRUD operations lengkap
* ✅ Middleware pattern
* ✅ Error handling
* ✅ Best practices REST API

### Langkah Selanjutnya
* Pelajari Go packages & modules
* Integrasi dengan database (PostgreSQL)
* Authentication & Authorization
* Deploy ke production

### Resources
* [Go net/http docs](https://pkg.go.dev/net/http)
* [REST API Best Practices](https://restfulapi.net/)
* [Boot.dev Backend Track](https://www.boot.dev/tracks/backend)

Positive
: Lanjutkan ke tutorial berikutnya untuk belajar Go Packages & Modules!
