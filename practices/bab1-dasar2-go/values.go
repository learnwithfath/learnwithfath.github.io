package main

import "fmt"

func main() {
	// => Tipe data String <=
	fmt.Println("Hello World")

	// Concatenation
	fmt.Println("Hello" + " " + "World")

	// Interpolation
	fmt.Println("Hello", "World")

	// Multi line string
	message := `Hello
i'm "Go" Nice to meet you`
	fmt.Println(message)

	// => Tipe data Integer <=
	fmt.Println(1)
	// Operasi matematika
	fmt.Println("1 + 1 =", 1+1)
	fmt.Println("7 - 3 =", 7-3)
	fmt.Println("5 * 2 =", 5*2)
	fmt.Println("10 / 3 =", 10/3) // Integer division
	fmt.Println("10 % 3 =", 10%3) // Modulus (sisa bagi)

	// Tipe integer
	var a int = 42      // Platform dependent (32 or 64 bit)
	var b int8 = 127    // -128 to 127
	var c int16 = 32767 // -32768 to 32767
	var d uint = 42     // Unsigned (hanya positif)
	fmt.Println(a, b, c, d)

	// => Tipe data Float <=
	fmt.Println("7.0 / 3.0 =", 7.0/3.0)
	fmt.Println("3.14 * 2 =", 3.14*2)
	var x float32 = 3.14
	var y float64 = 3.141592653589793

	fmt.Printf("float32: %.2f\n", x)
	fmt.Printf("float64: %.15f\n", y)

	// => Tipe data Boolean <=
	fmt.Println(true)
	fmt.Println(false)
	fmt.Println(1 == 1)
	fmt.Println(1 != 1)
	fmt.Println(1 < 1)
	fmt.Println(1 > 1)
	fmt.Println(1 <= 1)
	fmt.Println(1 >= 1)
}
