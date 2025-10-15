package main

import (
	"fmt"
	"os"
)

/*
Problem
Buat program kalkulator untuk menghitung luas dan keliling persegi panjang dengan fitur:

Menampilkan informasi aplikasi
Input panjang dan lebar
Hitung luas dan keliling
Format output yang rapi
*/
const (
	AppName = "Kalkulator Luas dan Keliling Persegi Panjang"
	Version = "1.0.0"
)

func main() {
	var panjang float64
	var lebar float64
	var luas float64
	var keliling float64
	fmt.Println(AppName)
	fmt.Println("Version: ", Version)
	fmt.Println("Masukkan panjang: ")
	fmt.Scan(&panjang)
	fmt.Println("Masukkan lebar: ")
	fmt.Scan(&lebar)
	luas = panjang * lebar
	keliling = 2 * (panjang + lebar)
	fmt.Println("Luas persegi panjang: ", luas)
	fmt.Println("Keliling persegi panjang: ", keliling)
	os.Exit(0)
}
