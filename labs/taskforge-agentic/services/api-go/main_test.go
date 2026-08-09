package main

import (
	"net/http/httptest"
	"testing"
)

func TestHealth(t *testing.T) {
	req := httptest.NewRequest("GET", "/v1/health", nil)
	res := httptest.NewRecorder()
	handler().ServeHTTP(res, req)
	if res.Code != 200 {
		t.Fatalf("expected 200, got %d", res.Code)
	}
}
