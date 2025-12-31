author: Achmad Fathullah
summary: Panduan lengkap memanfaatkan paket dartz untuk pemrograman fungsional di Dart dan Flutter
id: dartz-functional-programming
categories: dart,functional-programming
environments: Web
status: Published
feedback link: https://github.com/yourusername/feedback
analytics account: 0

# Membangun Aplikasi Dart/Flutter yang Lebih Terukur dengan dartz

## Overview
Duration: 0:03:00

Codelab ini membimbing Anda memahami pendekatan pemrograman fungsional (FP) di ekosistem Dart/Flutter menggunakan paket [dartz](https://github.com/spebbe/dartz). Anda akan mempelajari cara memasang dependensi, mengenal tipe-tipe inti (Option, Either, Task/Evaluation), menggunakan koleksi immutable, hingga membuat studi kasus validasi dan pemanggilan API.

### Apa yang Akan Anda Pelajari
* Konsep dasar FP yang diterjemahkan ke dalam idiom Dart
* Menambah dan mengatur paket dartz pada proyek CLI maupun Flutter
* Menggunakan Option/Either untuk mengelola nilai nullable dan error
* Mengorkestrasi operasi asynchronous secara aman menggunakan Task/Evaluation
* Memanfaatkan koleksi immutable dan type class untuk pipeline data
* Menerapkan studi kasus validasi formulir + pemanggilan API

### Prasyarat
* Dart SDK ≥ 2.17 atau Flutter ≥ 3.0
* Pemahaman dasar tentang async/await dan struktur proyek Dart
* Sudah menginstall Git serta editor favorit (VS Code, IntelliJ, dll)

Positive
: dartz kompatibel dengan proyek Dart murni maupun Flutter sehingga mudah dipakai lintas platform.

## Persiapan Lingkungan
Duration: 0:05:00

### 1. Verifikasi Instalasi Dart / Flutter
Pastikan salah satu tersetup:

```bash
# Untuk pengguna Dart CLI
dart --version

# Untuk pengguna Flutter
flutter --version
```

Jika belum terpasang, ikuti dokumentasi resmi:
* Dart SDK: https://dart.dev/get-dart
* Flutter SDK: https://docs.flutter.dev/get-started/install

Negative
: Gunakan versi stable. Artefak beta mungkin belum mendukung Null Safety penuh yang dibutuhkan dartz ≥0.10.0.

### 2. Siapkan Workspace Proyek

```bash
mkdir dartz-lab && cd dartz-lab
```

Anda dapat memilih membuat aplikasi CLI (`dart create dartz_demo`) atau modul Flutter (`flutter create dartz_demo_app`).

## Menambahkan dartz ke Proyek
Duration: 0:04:00

### 1. Tambahkan Dependensi

```bash
cd dartz_demo
# Dart CLI
dart pub add dartz

# Flutter
flutter pub add dartz
```

`pubspec.yaml` Anda kini berisi entri:

```yaml
dependencies:
  dartz: ^0.10.1
```

### 2. Import di Kode

```dart
import 'package:dartz/dartz.dart';
```

Positive
: Semua tipe berada di namespace `dartz`, sehingga satu import sudah mencakup Option, Either, koleksi, dan type class.

## Mengenal Tipe Fungsional Utama
Duration: 0:12:00

### Option: Pengganti Nullable

```dart
import 'package:dartz/dartz.dart';

Option<int> parseInt(String raw) {
  final value = int.tryParse(raw);
  return optionOf(value); // Some(value) atau None()
}

void main() {
  final result = parseInt('42').map((n) => n * 2).getOrElse(() => 0);
  print(result); // 84
}
```

* `Some(value)` menyatakan nilai valid.
* `None()` menggantikan `null`, memaksa Anda memberi default lewat `getOrElse`.

### Either: Sukses atau Error yang Eksplisit

```dart
Either<String, double> safeDivide(double a, double b) {
  return b == 0
      ? left('Penyebut tidak boleh 0')
      : right(a / b);
}

void main() {
  final message = safeDivide(10, 0)
      .map((value) => 'Hasil: $value')
      .getOrElse((err) => 'Gagal: $err');
  print(message);
}
```

* Sisi kiri (`Left`) menampung error atau pesan kegagalan.
* Sisi kanan (`Right`) berisi nilai sukses.

### Task / TaskEither / Evaluation: Abstraksi Async
`Task` setara Future yang lazy, sedangkan `TaskEither<L, R>` memadukan async + error handling.

```dart
TaskEither<String, String> fetchUserProfile() {
  return TaskEither(() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return right('Profil lengkap pengguna');
  });
}

Future<void> main() async {
  final response = await fetchUserProfile().run();
  response.fold(
    (err) => print('Error: $err'),
    (data) => print('Sukses: $data'),
  );
}
```

`Evaluation` menyediakan memoization dan kontrol eksekusi (call-by-need). Gunakan ketika perhitungan mahal ingin ditunda namun tetap deterministik.

Negative
: Hindari mencampur `try/catch` di dalam `TaskEither`. Gunakan `TaskEither.tryCatch` agar stack trace tetap konsisten.

## Koleksi Immutable & Type Class
Duration: 0:08:00

dartz meliputi struktur data persisten: `IList`, `IVector`, `IMap`, `ISet`, serta AVLTree. Semua mendukung operasi logaritmik dan cocok untuk state management berbasis referensi.

```dart
final IList<int> numbers = ilist([1, 2, 3]);
final IList<int> doubled = numbers.map((n) => n * 2); // IList baru

final IMap<String, int> scores = imap({'alice': 87, 'budi': 92});
final updated = scores.put('cici', 95);
```

Type class bawaan (Functor, Monad, Applicative, Foldable) memungkinkan komposisi universal.

```dart
final IList<int> data = ilist([1, 2, 3, 4]);
final sum = data.foldLeft(0, (acc, value) => acc + value); // 10
```

Positive
: Koleksi immutable membantu Anda menghindari state shared yang sulit dilacak, terutama pada aplikasi Flutter dengan state management berbasis stream atau Riverpod.

## Studi Kasus: Validasi Form & Pemanggilan API
Duration: 0:12:00

Kita akan memverifikasi data registrasi dan memanggil API secara aman.

```dart
import 'package:dartz/dartz.dart';

typealias Validation<T> = Either<String, T>;

Validation<String> validateEmail(String value) {
  return value.contains('@') ? right(value) : left('Format email tidak valid');
}

Validation<String> validatePassword(String value) {
  return value.length >= 8 ? right(value) : left('Password minimal 8 karakter');
}

TaskEither<String, String> submitSignup({
  required String email,
  required String password,
}) {
  return TaskEither.tryCatch(
    () async {
      await Future.delayed(const Duration(milliseconds: 500));
      return 'Token-123';
    },
    (error, stackTrace) => 'Gagal koneksi: $error',
  );
}

Future<void> main() async {
  final result = validateEmail('user@email.com').flatMap(
    (email) => validatePassword('Rahasia123').flatMap(
      (password) => submitSignup(email: email, password: password),
    ),
  );

  final output = await result.run();
  output.fold(print, (token) => print('Berhasil, token: $token'));
}
```

Langkah penting:
1. Validasi setiap field mengembalikan `Either`. Gunakan `flatMap` untuk menghentikan alur ketika ditemukan error.
2. `TaskEither` menjalankan call async hanya jika validasi sukses.
3. `fold` di akhir menyatukan jalur sukses & gagal, cocok untuk UI toast/snackbar.

Negative
: Jangan mencampur `await` di tengah chain `flatMap`. Balut operasi async di `Task` agar tetap lazy dan testable.

## Testing & Observability
Duration: 0:05:00

Gunakan paket `test` bawaan Dart. Karena `Task`/`Evaluation` lazy, Anda bisa men-trigger secara eksplisit pada skenario uji.

```dart
import 'package:dartz/dartz.dart';
import 'package:test/test.dart';

void main() {
  test('validateEmail mengembalikan Left ketika invalid', () {
    final result = validateEmail('invalid');
    expect(result.isLeft(), isTrue);
  });

  test('TaskEither berhasil', () async {
    final value = await submitSignup(email: 'a@a.com', password: '12345678').run();
    expect(value.isRight(), isTrue);
  });
}
```

Positive
: Struktur pure function memudahkan membuat unit test deterministic tanpa perlu mocking kompleks.

## Next Steps
Duration: 0:02:00

* Jelajahi modul lanjutan seperti `Free`, `Lens`, dan `Conveyor` di repo dartz.
* Integrasikan dengan state management favorit (Bloc, Riverpod) menggunakan `TaskEither` untuk layer repository.
* Eksperimen membuat helper extension untuk menghubungkan dartz ke UI (misalnya `toSnackbarMessage`).

## Summary
Duration: 0:01:00

### Yang Sudah Anda Pelajari
* ✅ Cara memasang dan mengimport dartz
* ✅ Teknik praktis memakai Option, Either, Task/Evaluation
* ✅ Penggunaan koleksi immutable + type class
* ✅ Studi kasus validasi + pemanggilan API secara deklaratif
* ✅ Tips testing agar pipeline FP tetap terjaga

Selamat! Anda kini siap menerapkan pendekatan FP dengan dartz untuk membuat kode Dart/Flutter yang lebih aman, modular, dan mudah diuji.
