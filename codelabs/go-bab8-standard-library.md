author: Qiscus Engineering Team
summary: Bab 8 - Standard Library Go: String, Time, JSON, File I/O dengan studi kasus aplikasi todo list
id: go-bab8-standard-library
categories: golang,backend,fundamental,indonesia
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/feedback

# Go Bab 8: Standard Library

## Pengenalan
Duration: 0:03:00

Go punya standard library yang sangat lengkap!

### Apa yang Akan Dipelajari

* 📝 String Manipulation
* ⏰ Time & Date
* 📦 JSON Encoding/Decoding
* 📁 File I/O Operations
* 💼 Studi Kasus - Todo List App

Positive
: Standard library Go sangat powerful dan production-ready!

## String Manipulation
Duration: 0:20:00

### strings Package

```go
package main

import (
    "fmt"
    "strings"
)

func main() {
    s := "Hello, World!"
    
    // Basic operations
    fmt.Println("ToUpper:", strings.ToUpper(s))
    fmt.Println("ToLower:", strings.ToLower(s))
    fmt.Println("Contains:", strings.Contains(s, "World"))
    fmt.Println("HasPrefix:", strings.HasPrefix(s, "Hello"))
    fmt.Println("HasSuffix:", strings.HasSuffix(s, "!"))
    
    // Split & Join
    parts := strings.Split(s, ", ")
    fmt.Println("Split:", parts)
    fmt.Println("Join:", strings.Join(parts, " - "))
    
    // Replace
    fmt.Println("Replace:", strings.Replace(s, "World", "Go", 1))
    fmt.Println("ReplaceAll:", strings.ReplaceAll(s, "l", "L"))
    
    // Trim
    text := "  hello  "
    fmt.Println("Trim:", strings.Trim(text, " "))
}
```

### fmt Package

```go
package main

import "fmt"

func main() {
    name := "Ahmad"
    age := 25
    score := 85.5
    
    // Printf
    fmt.Printf("Name: %s, Age: %d\n", name, age)
    fmt.Printf("Score: %.2f\n", score)
    
    // Sprintf (return string)
    message := fmt.Sprintf("%s is %d years old", name, age)
    fmt.Println(message)
}
```

## Time & Date
Duration: 0:20:00

### time Package

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // Current time
    now := time.Now()
    fmt.Println("Now:", now)
    
    // Format time
    fmt.Println("Formatted:", now.Format("2006-01-02 15:04:05"))
    fmt.Println("Date:", now.Format("02/01/2006"))
    fmt.Println("Time:", now.Format("15:04:05"))
    
    // Parse time
    dateStr := "2024-01-15"
    date, _ := time.Parse("2006-01-02", dateStr)
    fmt.Println("Parsed:", date)
    
    // Time operations
    tomorrow := now.Add(24 * time.Hour)
    fmt.Println("Tomorrow:", tomorrow.Format("2006-01-02"))
    
    yesterday := now.Add(-24 * time.Hour)
    fmt.Println("Yesterday:", yesterday.Format("2006-01-02"))
    
    // Duration
    duration := tomorrow.Sub(now)
    fmt.Println("Duration:", duration.Hours(), "hours")
}
```

## JSON
Duration: 0:25:00

### JSON Encoding/Decoding

```go
package main

import (
    "encoding/json"
    "fmt"
)

type Person struct {
    Name  string `json:"name"`
    Age   int    `json:"age"`
    Email string `json:"email"`
}

func main() {
    // Encoding (Marshal)
    person := Person{
        Name:  "Ahmad",
        Age:   25,
        Email: "ahmad@email.com",
    }
    
    jsonData, _ := json.Marshal(person)
    fmt.Println("JSON:", string(jsonData))
    
    // Pretty print
    jsonPretty, _ := json.MarshalIndent(person, "", "  ")
    fmt.Println("Pretty JSON:\n", string(jsonPretty))
    
    // Decoding (Unmarshal)
    jsonStr := `{"name":"Budi","age":30,"email":"budi@email.com"}`
    var p Person
    json.Unmarshal([]byte(jsonStr), &p)
    fmt.Printf("Decoded: %+v\n", p)
}
```

## File I/O
Duration: 0:25:00

### Reading Files

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    // Read entire file
    content, err := os.ReadFile("data.txt")
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    fmt.Println("Content:", string(content))
}
```

### Writing Files

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    // Write to file
    data := []byte("Hello, File!")
    err := os.WriteFile("output.txt", data, 0644)
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    fmt.Println("File written successfully")
}
```

## Studi Kasus: Todo List App
Duration: 0:30:00

```go
package main

import (
    "encoding/json"
    "fmt"
    "os"
    "time"
)

type Todo struct {
    ID        int       `json:"id"`
    Title     string    `json:"title"`
    Completed bool      `json:"completed"`
    CreatedAt time.Time `json:"created_at"`
}

type TodoList struct {
    Todos []Todo `json:"todos"`
}

func (tl *TodoList) Add(title string) {
    todo := Todo{
        ID:        len(tl.Todos) + 1,
        Title:     title,
        Completed: false,
        CreatedAt: time.Now(),
    }
    tl.Todos = append(tl.Todos, todo)
}

func (tl *TodoList) Complete(id int) {
    for i := range tl.Todos {
        if tl.Todos[i].ID == id {
            tl.Todos[i].Completed = true
            break
        }
    }
}

func (tl *TodoList) Display() {
    fmt.Println("\n📝 TODO LIST:")
    fmt.Println("─────────────────────────────────────")
    for _, todo := range tl.Todos {
        status := "⬜"
        if todo.Completed {
            status = "✅"
        }
        fmt.Printf("%s %d. %s\n", status, todo.ID, todo.Title)
    }
}

func (tl *TodoList) Save(filename string) error {
    data, err := json.MarshalIndent(tl, "", "  ")
    if err != nil {
        return err
    }
    return os.WriteFile(filename, data, 0644)
}

func (tl *TodoList) Load(filename string) error {
    data, err := os.ReadFile(filename)
    if err != nil {
        return err
    }
    return json.Unmarshal(data, tl)
}

func main() {
    fmt.Println("╔═══════════════════════════════════╗")
    fmt.Println("║         TODO LIST APP             ║")
    fmt.Println("╚═══════════════════════════════════╝")
    
    todoList := &TodoList{}
    
    // Add todos
    todoList.Add("Belajar Go")
    todoList.Add("Buat project")
    todoList.Add("Deploy aplikasi")
    
    // Display
    todoList.Display()
    
    // Complete task
    fmt.Println("\n✓ Menyelesaikan task #1")
    todoList.Complete(1)
    todoList.Display()
    
    // Save to file
    fmt.Println("\n💾 Menyimpan ke file...")
    if err := todoList.Save("todos.json"); err != nil {
        fmt.Println("Error saving:", err)
    } else {
        fmt.Println("✓ Tersimpan ke todos.json")
    }
    
    // Load from file
    fmt.Println("\n📂 Memuat dari file...")
    newList := &TodoList{}
    if err := newList.Load("todos.json"); err != nil {
        fmt.Println("Error loading:", err)
    } else {
        fmt.Println("✓ Berhasil dimuat")
        newList.Display()
    }
    
    fmt.Println("\n═══════════════════════════════════════")
}
```

## Ringkasan
Duration: 0:02:00

### Yang Sudah Dipelajari

✅ **String** - Manipulation dengan strings package  
✅ **Time** - Date & time operations  
✅ **JSON** - Encoding & decoding  
✅ **File I/O** - Read & write files

### Langkah Selanjutnya

Lanjut ke **Bab 9: Web & Network** - bab terakhir!

Positive
: Standard library Go sangat lengkap untuk production apps!
