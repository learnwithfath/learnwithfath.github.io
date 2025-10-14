author: Qiscus Engineering Team
summary: Pelajari Go modules, package management, project structure, dan versioning untuk project yang scalable
id: go-packages-modules
categories: golang,backend,modules,indonesia
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/feedback

# Go Packages & Modules

## Pengenalan
Duration: 0:03:00

Selamat datang! Tutorial ini akan mengajarkan cara mengorganisir kode Go dengan packages dan modules untuk project yang scalable dan maintainable.

### Apa yang Akan Anda Pelajari
* Go modules (go.mod)
* Package management
* Import packages
* Project structure best practices
* Versioning dan dependencies
* Publishing modules
* Workspace management

### Prasyarat
* Tutorial "Go Dasar untuk Pemula"
* Tutorial "Go HTTP & REST API"
* Go 1.16+ terinstall

Positive
: Go modules adalah cara modern untuk manage dependencies di Go!

## Apa itu Packages?
Duration: 0:10:00

Package adalah cara Go mengorganisir dan reuse kode.

### Package Basics

```go
// File: math/calculator.go
package math

func Add(a, b int) int {
    return a + b
}

func Subtract(a, b int) int {
    return a - b
}
```

```go
// File: main.go
package main

import (
    "fmt"
    "myapp/math"
)

func main() {
    result := math.Add(5, 3)
    fmt.Println(result)
}
```

### Package Naming Rules

1. **Lowercase** - package names harus lowercase
2. **Short** - nama pendek dan deskriptif
3. **No underscore** - hindari underscore
4. **Singular** - gunakan singular (http, bukan https)

```go
// Good
package user
package http
package json

// Bad
package User
package http_client
package users
```

### Exported vs Unexported

```go
package calculator

// Exported (public) - dimulai dengan huruf besar
func Add(a, b int) int {
    return a + b
}

// Unexported (private) - dimulai dengan huruf kecil
func multiply(a, b int) int {
    return a * b
}
```

Negative
: Hanya identifier yang dimulai dengan huruf BESAR yang bisa diakses dari luar package!

## Go Modules
Duration: 0:15:00

Go modules adalah sistem dependency management resmi di Go.

### Inisialisasi Module

```bash
# Buat project baru
mkdir myapp
cd myapp

# Initialize module
go mod init github.com/username/myapp
```

File `go.mod` akan dibuat:

```go
module github.com/username/myapp

go 1.21
```

### Module Path

Module path biasanya mengikuti format:

```
github.com/username/projectname
gitlab.com/username/projectname
example.com/myproject
```

Untuk local development:

```
myapp
mycompany/myapp
```

### go.mod File

```go
module github.com/learnwithfath/notes-api

go 1.21

require (
    github.com/google/uuid v1.3.0
    github.com/gorilla/mux v1.8.0
)

require (
    github.com/stretchr/testify v1.8.4 // indirect
)
```

**Penjelasan:**
- `module` - nama module
- `go` - versi Go minimum
- `require` - direct dependencies
- `indirect` - transitive dependencies

### go.sum File

File ini berisi checksum untuk verify dependencies:

```
github.com/google/uuid v1.3.0 h1:t6JiXgmwXMjEs8VusXIJk2BXHsn+wx8BZdTaoZ5fu7I=
github.com/google/uuid v1.3.0/go.mod h1:TIyPZe4MgqvfeYDBFedMoGGpEw/LqOeaOT+nhxU+yHo=
```

Positive
: go.sum harus di-commit ke version control untuk security!

## Managing Dependencies
Duration: 0:15:00

Cara mengelola dependencies di Go project.

### Menambah Dependency

```bash
# Cara 1: go get
go get github.com/google/uuid

# Cara 2: go get dengan versi spesifik
go get github.com/google/uuid@v1.3.0

# Cara 3: import di kode, lalu go mod tidy
```

### Menggunakan Dependency

```go
package main

import (
    "fmt"
    "github.com/google/uuid"
)

func main() {
    id := uuid.New()
    fmt.Println("UUID:", id.String())
}
```

### go mod Commands

```bash
# Download dependencies
go mod download

# Add missing and remove unused modules
go mod tidy

# Verify dependencies
go mod verify

# Copy dependencies to vendor/
go mod vendor

# Show module graph
go mod graph

# Explain why package needed
go mod why github.com/google/uuid
```

### Update Dependencies

```bash
# Update specific module
go get -u github.com/google/uuid

# Update all dependencies
go get -u ./...

# Update to specific version
go get github.com/google/uuid@v1.4.0

# Update to latest patch
go get -u=patch ./...
```

### Remove Dependency

```bash
# Remove dari kode, lalu:
go mod tidy
```

Negative
: Selalu jalankan `go mod tidy` setelah menambah/menghapus dependencies!

## Project Structure
Duration: 0:20:00

Struktur project yang baik membuat kode mudah di-maintain.

### Standard Project Layout

```
myapp/
├── cmd/
│   └── api/
│       └── main.go
├── internal/
│   ├── handlers/
│   │   ├── user.go
│   │   └── auth.go
│   ├── models/
│   │   └── user.go
│   ├── repository/
│   │   └── user_repo.go
│   └── service/
│       └── user_service.go
├── pkg/
│   ├── logger/
│   │   └── logger.go
│   └── validator/
│       └── validator.go
├── api/
│   └── openapi.yaml
├── configs/
│   └── config.yaml
├── scripts/
│   └── migrate.sh
├── tests/
│   └── integration/
├── go.mod
├── go.sum
└── README.md
```

### Penjelasan Struktur

**cmd/** - Entry points aplikasi
```go
// cmd/api/main.go
package main

func main() {
    // Start API server
}
```

**internal/** - Private application code
- Tidak bisa di-import oleh project lain
- Business logic utama

**pkg/** - Public libraries
- Bisa di-import oleh project lain
- Reusable code

**api/** - API definitions (OpenAPI, Protocol Buffers)

**configs/** - Configuration files

**scripts/** - Build dan deployment scripts

### Example: Notes API Structure

```
notes-api/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── api/
│   │   ├── handlers/
│   │   │   ├── note_handler.go
│   │   │   └── health_handler.go
│   │   ├── middleware/
│   │   │   ├── logger.go
│   │   │   ├── cors.go
│   │   │   └── auth.go
│   │   └── router/
│   │       └── router.go
│   ├── models/
│   │   ├── note.go
│   │   └── response.go
│   ├── repository/
│   │   └── note_repository.go
│   ├── service/
│   │   └── note_service.go
│   └── config/
│       └── config.go
├── pkg/
│   ├── logger/
│   │   └── logger.go
│   └── database/
│       └── postgres.go
├── go.mod
└── go.sum
```

### Implementasi Struktur

**cmd/server/main.go:**
```go
package main

import (
    "log"
    "notes-api/internal/api/router"
    "notes-api/internal/config"
)

func main() {
    cfg := config.Load()
    r := router.New()
    
    log.Printf("Server starting on %s", cfg.Port)
    log.Fatal(r.Start(cfg.Port))
}
```

**internal/models/note.go:**
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
```

**internal/repository/note_repository.go:**
```go
package repository

import (
    "notes-api/internal/models"
    "sync"
)

type NoteRepository interface {
    Create(note *models.Note) error
    FindByID(id string) (*models.Note, error)
    FindAll() ([]models.Note, error)
    Update(note *models.Note) error
    Delete(id string) error
}

type inMemoryRepo struct {
    notes map[string]models.Note
    mu    sync.RWMutex
}

func NewInMemoryRepository() NoteRepository {
    return &inMemoryRepo{
        notes: make(map[string]models.Note),
    }
}

func (r *inMemoryRepo) Create(note *models.Note) error {
    r.mu.Lock()
    defer r.mu.Unlock()
    r.notes[note.ID] = *note
    return nil
}

// Implement other methods...
```

**internal/service/note_service.go:**
```go
package service

import (
    "notes-api/internal/models"
    "notes-api/internal/repository"
    "time"
)

type NoteService interface {
    CreateNote(title, content string) (*models.Note, error)
    GetNote(id string) (*models.Note, error)
    GetAllNotes() ([]models.Note, error)
    UpdateNote(id, title, content string) (*models.Note, error)
    DeleteNote(id string) error
}

type noteService struct {
    repo repository.NoteRepository
}

func NewNoteService(repo repository.NoteRepository) NoteService {
    return &noteService{repo: repo}
}

func (s *noteService) CreateNote(title, content string) (*models.Note, error) {
    note := &models.Note{
        ID:        generateID(),
        Title:     title,
        Content:   content,
        CreatedAt: time.Now(),
        UpdatedAt: time.Now(),
    }
    
    if err := s.repo.Create(note); err != nil {
        return nil, err
    }
    
    return note, nil
}

// Implement other methods...
```

Positive
: Struktur yang baik membuat kode mudah di-test dan di-maintain!

## Internal vs Pkg
Duration: 0:10:00

Perbedaan antara `internal/` dan `pkg/`.

### internal/ Directory

```
myapp/
└── internal/
    └── helper/
        └── utils.go
```

**Karakteristik:**
- Hanya bisa di-import oleh code dalam module yang sama
- Private untuk project
- Business logic spesifik

**Example:**
```go
// myapp/internal/helper/utils.go
package helper

func FormatUserName(name string) string {
    // Project-specific logic
    return strings.ToUpper(name)
}
```

```go
// myapp/cmd/main.go - ✅ BISA
import "myapp/internal/helper"

// otherapp/main.go - ❌ TIDAK BISA
import "myapp/internal/helper"  // Error!
```

### pkg/ Directory

```
myapp/
└── pkg/
    └── logger/
        └── logger.go
```

**Karakteristik:**
- Bisa di-import oleh project lain
- Public libraries
- Generic, reusable code

**Example:**
```go
// myapp/pkg/logger/logger.go
package logger

func Info(msg string) {
    log.Println("[INFO]", msg)
}
```

```go
// otherapp/main.go - ✅ BISA
import "myapp/pkg/logger"

logger.Info("Hello from other app")
```

### Kapan Pakai Apa?

**Gunakan internal/ untuk:**
- Business logic
- Domain models
- Application-specific code
- Code yang tidak ingin di-share

**Gunakan pkg/ untuk:**
- Utility functions
- Generic helpers
- Libraries yang bisa dipakai project lain
- Code yang mungkin di-extract jadi module terpisah

Negative
: Jangan taruh semua di pkg/! Kebanyakan code seharusnya di internal/.

## Versioning
Duration: 0:15:00

Go modules menggunakan semantic versioning.

### Semantic Versioning

Format: `vMAJOR.MINOR.PATCH`

```
v1.2.3
│ │ │
│ │ └─ PATCH: Bug fixes
│ └─── MINOR: New features (backward compatible)
└───── MAJOR: Breaking changes
```

### Creating Versions

```bash
# Tag version
git tag v1.0.0
git push origin v1.0.0

# List tags
git tag

# Delete tag
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

### Version Constraints

```go
// go.mod
require (
    github.com/google/uuid v1.3.0        // Exact version
    github.com/gorilla/mux v1.8          // >= v1.8.0, < v2.0.0
    github.com/lib/pq v1                 // >= v1.0.0, < v2.0.0
)
```

### Major Version Changes

Untuk breaking changes (v2, v3, dst):

```go
// go.mod
module github.com/username/myapp/v2

go 1.21
```

Import dengan version:
```go
import "github.com/username/myapp/v2/pkg/logger"
```

### Pre-release Versions

```
v1.0.0-alpha
v1.0.0-beta
v1.0.0-rc.1
```

```bash
git tag v2.0.0-beta.1
git push origin v2.0.0-beta.1
```

## Publishing Module
Duration: 0:15:00

Cara publish Go module agar bisa dipakai orang lain.

### Persiapan

1. **Buat repository di GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/mymodule.git
git push -u origin main
```

2. **Struktur yang baik**
```
mymodule/
├── README.md
├── LICENSE
├── go.mod
├── mymodule.go
└── mymodule_test.go
```

3. **Documentation**
```go
// Package mymodule provides utilities for...
package mymodule

// Add returns the sum of a and b.
// Example:
//   result := Add(2, 3)  // result = 5
func Add(a, b int) int {
    return a + b
}
```

### Publishing Steps

1. **Ensure tests pass**
```bash
go test ./...
```

2. **Tag version**
```bash
git tag v1.0.0
git push origin v1.0.0
```

3. **Make it discoverable**
```bash
GOPROXY=proxy.golang.org go list -m github.com/username/mymodule@v1.0.0
```

### Using Published Module

```bash
go get github.com/username/mymodule
```

```go
import "github.com/username/mymodule"

func main() {
    result := mymodule.Add(5, 3)
}
```

### Best Practices

1. **Good README**
```markdown
# My Module

Description of what it does.

## Installation
```go
go get github.com/username/mymodule
```

## Usage
```go
import "github.com/username/mymodule"

result := mymodule.Add(2, 3)
```

## License
MIT
```

2. **Comprehensive tests**
3. **Clear documentation**
4. **Semantic versioning**
5. **Changelog**

Positive
: Module yang well-documented lebih mudah dipakai orang lain!

## Workspaces
Duration: 0:10:00

Go workspaces untuk develop multiple modules bersamaan.

### Create Workspace

```bash
mkdir myworkspace
cd myworkspace

# Initialize workspace
go work init
```

### Add Modules

```bash
# Add existing modules
go work use ./module1
go work use ./module2

# Create go.work file
```

**go.work:**
```go
go 1.21

use (
    ./module1
    ./module2
)
```

### Structure

```
myworkspace/
├── go.work
├── module1/
│   ├── go.mod
│   └── main.go
└── module2/
    ├── go.mod
    └── lib.go
```

### Benefits

- Develop multiple modules together
- Test changes across modules
- No need to publish untuk testing

### Example

**module2/lib.go:**
```go
package module2

func Greet(name string) string {
    return "Hello, " + name
}
```

**module1/main.go:**
```go
package main

import (
    "fmt"
    "module2"
)

func main() {
    msg := module2.Greet("Go")
    fmt.Println(msg)
}
```

Negative
: go.work tidak boleh di-commit! Add ke .gitignore.

## Project: Refactor Notes API
Duration: 0:30:00

Mari refactor Notes API dengan struktur yang proper.

### New Structure

```
notes-api/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── api/
│   │   ├── handlers/
│   │   ├── middleware/
│   │   └── router/
│   ├── models/
│   ├── repository/
│   ├── service/
│   └── config/
├── pkg/
│   └── response/
├── go.mod
└── README.md
```

### Implementation

Lihat kode lengkap di repository untuk implementasi detail dari setiap layer.

### Run Project

```bash
go mod tidy
go run cmd/server/main.go
```

Positive
: Struktur yang baik membuat project scalable!

## Ringkasan
Duration: 0:05:00

Anda telah mempelajari:

* ✅ Go packages dan modules
* ✅ Dependency management
* ✅ Project structure best practices
* ✅ internal/ vs pkg/
* ✅ Versioning
* ✅ Publishing modules
* ✅ Workspaces

### Langkah Selanjutnya
* Pelajari Concurrency & Goroutines
* Database integration
* Testing strategies
* CI/CD setup

### Resources
* [Go Modules Reference](https://go.dev/ref/mod)
* [Standard Go Project Layout](https://github.com/golang-standards/project-layout)
* [Go Blog: Using Go Modules](https://go.dev/blog/using-go-modules)

Positive
: Lanjutkan ke tutorial Concurrency untuk belajar goroutines dan channels!
