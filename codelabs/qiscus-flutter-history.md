author: HelloGod Team
summary: Panduan mengintegrasikan Chat History Archive Service ke dalam aplikasi Flutter yang menggunakan Qiscus Multichannel Widget.
id: qiscus-flutter-history
categories: Flutter,Mobile,Qiscus
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Mengintegrasikan Chat History Archive di Flutter

## Overview
Duration: 0:02:00

Selamat datang di codelab lanjutan! Pada tutorial sebelumnya, Anda telah membangun backend mandiri (*Golang*) untuk mengarsipkan pesan obrolan Qiscus. Di codelab ini, Anda akan belajar cara mengkonsumsi API arsip tersebut ke dalam aplikasi klien **Flutter** Anda.

Codelab ini dikhususkan bagi aplikasi yang menggunakan fitur *sessional mode* (Token kadaluarsa setelah obrolan berstatus *resolved* / selesai). Kita akan menggunakan metode ***silent fallback***: Jika *room* sudah tidak dapat diakses secara *live* melalui Qiscus SDK (mendapat error 403), aplikasi akan secara otomatis memanggil backend Anda dan menampilkannya pada UI *read-only*.

### Apa yang Akan Anda Pelajari
* Mendeteksi *Exception* status 403 Unauthorized dari SDK Qiscus.
* Menyusun `Repository` untuk mengorkestrasi logika pemanggilan (SDK vs API).
* Membangun tampilan UI obrolan mode *read-only* murni di Flutter.
* Melakukan sinkronisasi data arsip dengan aman.

### Prasyarat
* Proyek Flutter yang sudah menggunakan `qiscus_multichannel_widget`.
* `Chat History Archive Service` (Golang Backend) yang berjalan secara lokal atau *cloud*.

## Mengatur Konfigurasi & Model Data
Duration: 0:05:00

### 1. Menambahkan Dependensi
Tambahkan dependensi berikut ke dalam file `pubspec.yaml` proyek Flutter Anda untuk keperluan pemanggilan HTTP dan penanggalan:

```yaml
dependencies:
  http: ^1.2.1
  shared_preferences: ^2.3.2
  intl: ^0.19.0
```
Lalu jalankan perintah: `flutter pub get`

### 2. Konfigurasi Endpoint Backend
Buatlah file konfigurasi yang menunjuk ke backend arsip Anda.

```dart
// lib/config/app_config.dart
class AppConfig {
  AppConfig._();
  static const String backendBaseUrl = 'http://localhost:8080';
  static const String qiscusAppId = 'vvmxt-mcz1gxflybkyeul'; // Ganti dengan AppID Anda
}
```

### 3. Model Data Pesan Arsip
Buat kelas `ArchivedMessage` untuk melakukan *parsing* JSON secara aman dari API backend Anda.

```dart
// lib/features/chat_history/archived_message_model.dart
class ArchivedMessage {
  // Field: id, text, senderName, timestamp, dll.
  // ...
  
  bool get isCustomer => !senderEmail.contains('@qismo.com') &&
      !senderEmail.contains('@qiscus.com') &&
      type != 'system';
}
```

## Membangun Service dan Repository
Duration: 0:08:00

### 1. Service API (HTTP Client)
Buat `ChatHistoryService` untuk mengabstraksikan pemanggilan GET HTTP menggunakan header `Authorization: Bearer <JWT>`.

```dart
// lib/features/chat_history/chat_history_service.dart
Future<ArchivedRoom> fetchHistory({required String roomId, required String userJwt}) async {
  final uri = Uri.parse('${AppConfig.backendBaseUrl}/api/v1/chat-history/$roomId');
  final response = await http.get(uri, headers: {'Authorization': 'Bearer $userJwt'});
  // Validasi dan return JSON
}
```

### 2. The Repository (Logika Fallback)
Di sinilah letak keajaiban utama. `ChatHistoryRepository` akan mencoba mengambil data *live* dari Qiscus SDK terlebih dahulu. Jika SDK mengembalikan *Unauthorized*, ia akan menangkap kesalahan tersebut dan melakukan *fallback* ke API backend kita.

```dart
// lib/features/chat_history/chat_history_repository.dart
Future<ChatHistoryResult> getMessages(...) async {
  try {
    final qiscus = await multichannel.qiscus.future;
    final room = await qiscus.getChatRoomWithMessages(roomId: roomId);
    return LiveMessages(room); // Obrolan masih berjalan
  } catch (e) {
    if (!QiscusErrorHelper.isUnauthorized(e)) {
      return FetchError('Unexpected error: $e');
    }
  }

  // Jika sampai sini, berarti mendapat 403 (Sesi kedaluwarsa)
  try {
    final archive = await _service.fetchHistory(roomId: roomId.toString(), userJwt: userJwt);
    return ArchivedMessages(archive); // Menampilkan histori arsip
  } catch (e) {
    return FetchError('Gagal memuat arsip.');
  }
}
```

## Membuat UI Read-Only & Menghubungkan
Duration: 0:05:00

### 1. Layar History
Ketika kita mendapat `ArchivedMessages`, kita akan menampilkan *screen* baru yang khusus ditujukan hanya untuk membaca pesan tanpa adanya `TextField` (input text box). Gunakan `ListView.builder` standar dari material Flutter.

### 2. Modifikasi Layar Login / Navigasi
Update alur navigasi aplikasi Anda ketika pengguna berhasil *login* atau menekan tombol obrolan.

```dart
// lib/login_screen.dart
final repo = ChatHistoryRepository(multichannel: multichannel);
final result = await repo.getMessages(roomId: roomId, userJwt: tokenJWT);

switch (result) {
  case LiveMessages():
    // Tampilkan Widget Asli Qiscus dengan input
    Navigator.push(context, MaterialPageRoute(builder: (_) => QChatRoomScreen(...)));
  case ArchivedMessages(:final archive):
    // Tampilkan Screen khusus sejarah obrolan
    Navigator.push(context, MaterialPageRoute(builder: (_) => ChatHistoryScreen(archive: archive)));
  case FetchError(:final message):
    // Tampilkan Snackbar gagal
}
```

## Kesimpulan
Duration: 0:01:00

### Selamat!
Anda telah berhasil melengkapi aplikasi pelayanan pelanggan Qiscus (*sessional mode*) dengan perlindungan *fallback* tingkat lanjut. 

Dengan cara ini:
- Server Qiscus akan otomatis *pruning* (membersihkan) sesi sesuai kuota Anda.
- Aplikasi klien Flutter Anda tetap sanggup menampilkan riwayat transaksi kepada pelanggan Anda secara apik tanpa terputus, ditenagai oleh database *PostgreSQL* lokal.

Kini Anda dapat mencoba menguji aplikasi dengan cara *login* ke *room* yang telah ditutup (*resolved*)!
