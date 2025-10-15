package main

import "fmt"

func main() {

	// With var
	var name string = "John"
	var age int = 30
	var isStudent bool = true
	var height float64 = 5.9
	fmt.Println(name)
	fmt.Println(age)
	fmt.Println(isStudent)
	fmt.Println(height)

	// Without var / type inference
	var name2 = "John"
	var age2 = 30
	var isStudent2 = true
	var height2 = 5.9
	fmt.Println(name2)
	fmt.Println(age2)
	fmt.Println(isStudent2)
	fmt.Println(height2)

	// Short variable declaration
	name3 := "John"
	age3 := 30
	isStudent3 := true
	height3 := 5.9
	fmt.Println(name3)
	fmt.Println(age3)
	fmt.Println(isStudent3)
	fmt.Println(height3)

	// Multiple variable declaration
	name4, age4, isStudent4, height4 := "John", 30, true, 5.9
	fmt.Println(name4)
	fmt.Println(age4)
	fmt.Println(isStudent4)
	fmt.Println(height4)

	// Reassign variable
	name4 = "Jane"
	age4 = 25
	isStudent4 = false
	height4 = 5.5
	fmt.Println(name4)
	fmt.Println(age4)
	fmt.Println(isStudent4)
	fmt.Println(height4)

	// Group variable declaration
	var (
		name5      = "John"
		age5       = 30
		isStudent5 = true
		height5    = 5.9
	)
	fmt.Println(name5)
	fmt.Println(age5)
	fmt.Println(isStudent5)
	fmt.Println(height5)

	// Update variable
	name5 = "Jane"
	age5 = 25
	isStudent5 = false
	height5 = 5.5
	fmt.Println(name5)
	fmt.Println(age5)
	fmt.Println(isStudent5)
	fmt.Println(height5)
	// Increment variable
	age5++
	fmt.Println(age5)
	// Shorthand operator
	age5 += 1
	fmt.Println(age5)
	// Decrement variable
	age5--
	fmt.Println(age5)
	// Variable tanpa nilai awal punya "zero value"
	var name6 string
	var age6 int
	var isStudent6 bool
	var height6 float64
	fmt.Println(name6)
	fmt.Println(age6)
	fmt.Println(isStudent6)
	fmt.Println(height6)
}
