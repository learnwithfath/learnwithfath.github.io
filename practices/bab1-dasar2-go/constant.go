package main

import "fmt"

const Pi = 3.14
const appName = "My App"
const version = "1.0.0"

func main() {
	// Pi = 3.15 => error const cannot be redeclared
	fmt.Println(Pi)
	fmt.Println(appName)
	fmt.Println(version)

	// Constant didalam function
	const name = "John"
	fmt.Println(name)

	// Group constant
	const (
		name1      = "John"
		age1       = 30
		isStudent1 = true
	)
	fmt.Println(name1)
	fmt.Println(age1)
	fmt.Println(isStudent1)

	// Typed vs Untyped Constants

	// Untyped
	const a = 10
	var i int = a
	fmt.Printf("%T\n", i)

	// Typed
	const b = 10
	var j int = b
	// var g float64 = b => error
	fmt.Printf("%T\n", j)

	// Constant Expressions
	const (
		SecondPerMinute = 60
		MinutePerHour   = 60
		HourPerDay      = 24
		DayPerWeek      = 7

		SecondPerHour    = SecondPerMinute * MinutePerHour
		HourPerWeek      = HourPerDay * DayPerWeek
		DayPerMonth      = DayPerWeek * 4
		MonthPerYear     = 12
		YearPerDecade    = 10
		DecadePerCentury = 100

		KB = 1024
		MB = 1024 * KB
		GB = 1024 * MB
	)
	fmt.Println("1 Second =", SecondPerMinute, "Minutes")
	fmt.Println("1 Hour =", HourPerDay, "Days")
	fmt.Println("1 Day =", DayPerWeek, "Weeks")
	fmt.Println("1 Month =", MonthPerYear, "Years")
	fmt.Println("1 Year =", YearPerDecade, "Decades")
	fmt.Println("1 Decade =", DecadePerCentury, "Centuries")
	fmt.Println("1 KB =", KB, "Bytes")
	fmt.Println("1 MB =", MB, "Bytes")
	fmt.Println("1 GB =", GB, "Bytes")

	// Const iota (Auto Increment)
	const (
		Sunday = iota
		Monday
		Tuesday
		Wednesday
		Thursday
		Friday
		Saturday
	)
	fmt.Println("Sunday =", Sunday)
	fmt.Println("Monday =", Monday)
	fmt.Println("Tuesday =", Tuesday)
	fmt.Println("Wednesday =", Wednesday)
	fmt.Println("Thursday =", Thursday)
	fmt.Println("Friday =", Friday)
	fmt.Println("Saturday =", Saturday)
	const (
		Kilobyte = 1 << (10 * iota)
		Megabyte
		Gigabyte
	)
	fmt.Println("1 KB =", Kilobyte, "Bytes")
	fmt.Println("1 MB =", Megabyte, "Bytes")
	fmt.Println("1 GB =", Gigabyte, "Bytes")
}
