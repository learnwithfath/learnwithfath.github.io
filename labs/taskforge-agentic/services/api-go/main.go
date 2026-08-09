package main

import (
	"encoding/json"
	"net/http"
)

func handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /v1/health", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})
	return mux
}

func main() {
	_ = http.ListenAndServe(":8080", handler())
}
