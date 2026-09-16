author: LearnWithFath Team
summary: Part 2 dari seri Qiscus Sessional Chat History — integrasikan backend proxy dari Part 1 ke app React Native yang memakai @qiscus-community/react-native-multichannel-widget. Termasuk tiga bug nyata (layar putih setelah reload, tombol back yang salah trigger logout, initiateChat yang diam-diam no-op) dan cara membuat sesi baru dengan topik tersimpan di SDK.
id: qiscus-sessional-chat-history-part-2-react-native-app
categories: React Native,Mobile,Qiscus,API
tags: react-native, qiscus, sessional, chat-history, mobile, jest
environments: Web
status: Published
feedback link: https://github.com/learnwithfath/learnwithfath.github.io/issues

# Qiscus Sessional Chat History — Part 2: Integrasi di React Native App

## Overview
Duration: 0:03:00

Ini Part 2 dari seri **Qiscus Sessional Chat History**. Kalau belum mengikuti Part 1, disarankan mulai dari sana — backend proxy yang dibangun di sana adalah kontrak data yang dipakai di seluruh codelab ini.

Positive
: **Belum baca Part 1?** Mulai dari sini: [learnwithfath.github.io/qiscus-sessional-chat-history-part-1-backend-proxy/#0](https://learnwithfath.github.io/qiscus-sessional-chat-history-part-1-backend-proxy/#0)

### Apa yang Akan Anda Bangun

Sebuah layar **"Riwayat Percakapan"** di app React Native yang memakai `@qiscus-community/react-native-multichannel-widget`, tanpa mengubah satu baris pun kode library itu sendiri:

* Daftar sesi (aktif + selesai), dengan judul = topik percakapan, subjudul = pesan terakhir.
* Transkrip read-only untuk sesi yang sudah selesai.
* Tombol "mulai percakapan baru" dengan dialog topik singkat.
* Semua nilai spesifik klien (App ID, Channel ID, base URL backend) lewat satu file konfigurasi — ganti klien, ganti satu file.

### Prasyarat

* Sudah menyelesaikan Part 1 (backend proxy jalan di `localhost:8081`)
* Project React Native yang sudah memakai `@qiscus-community/react-native-multichannel-widget`
* Familiar dengan React hooks dan TypeScript

Negative
: Seri ini **tidak** mengubah kode library (`src/`) sama sekali. Semua yang dibangun di sini murni memanfaatkan hook publik yang sudah diekspor library — pola ini penting kalau kamu bekerja dengan dependency yang di-maintain tim lain: jangan fork, cari hook/API publiknya.

### Ambil kodenya — clone versi yang sudah jadi

**Cara tercepat:** clone branch hasil codelab ini langsung, sudah lengkap dengan semua file di `example/src/history/*` yang dibahas di bagian selanjutnya:

```bash
git clone --branch feature/chat-history-viewer --single-branch \
  https://github.com/amed12/react-native-multichannel-widget.git
cd react-native-multichannel-widget
yarn install
cp example/src/env.example.ts example/src/env.local.ts
# isi env.local.ts dengan App ID, Channel ID, dan base URL backend milikmu
```

Repo ini **public**, tidak perlu SSH key atau akun GitHub apa pun untuk clone. Branch `feature/chat-history-viewer` sengaja terpisah dari `main` — `main` di fork ini tetap sinkron dengan [library resminya](https://github.com/qiscus-community/react-native-multichannel-widget), jadi kode contoh riwayat chat tidak tercampur dengan kode library yang sebenarnya.

Positive
: Kalau mau memahami setiap bagian dari nol (disarankan kalau kamu belajar), lanjutkan baca bagian-bagian di bawah — isinya sama persis dengan yang ada di branch hasil clone di atas, dijelaskan potongan demi potongan.

## Kontrak Data dan API Client
Duration: 0:05:00

### Tipe data yang sinkron dengan backend

```typescript
// history/types.ts
export type Session = {
  room_id: string;
  name: string;
  started_at: string;
  is_resolved: boolean;
  last_message: string;
  topic: string; // kosong untuk sesi lama yang dibuat sebelum fitur topik ada
};

export type ArchivedMessage = {
  id: string;
  sender_role: 'user' | 'agent' | 'bot' | 'system';
  sender_name: string;
  type: string;
  text: string;
  payload: unknown;
  created_at: string;
};

export type Paginated<T> = { data: T[]; next_cursor: string | null };
```

### API client — dan kenapa `fresh` bukan opsional dari sudut pandang UI

Ingat bug cache di Part 1: room baru bisa "hilang" sampai TTL cache habis. Klien yang tahu kapan ini terjadi (mount pertama, pull-to-refresh, atau baru saja membuat sesi) — jadi parameter `fresh` ada di level API client, bukan disembunyikan di backend.

```typescript
// history/api.ts
export function fetchSessions(
  userId: string,
  cursor?: string | null,
  fresh?: boolean
): Promise<Paginated<Session>> {
  const params = new URLSearchParams();
  if (cursor) params.set('cursor', cursor);
  if (fresh) params.set('fresh', '1');
  const query = params.toString();
  return get(`/api/v1/sessions${query ? `?${query}` : ''}`, userId);
}
```

```typescript
// history/useSessions.ts
export function useSessions(userId: string) {
  const [state, setState] = useState<State>({ sessions: [], loading: true, error: null, nextCursor: null });

  const load = useCallback(async (cursor?: string | null) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      // "First page" load (cursor == null) SELALU fresh — mencakup mount awal,
      // pull-to-refresh, dan balik ke sini setelah membuat sesi baru.
      // Pagination (loadMore) tetap pakai cache.
      const page = await fetchSessions(userId, cursor, cursor == null);
      setState((prev) => ({
        sessions: cursor ? [...prev.sessions, ...page.data] : page.data,
        loading: false, error: null, nextCursor: page.next_cursor,
      }));
    } catch (e) {
      setState((prev) => ({ ...prev, loading: false, error: String(e) }));
    }
  }, [userId]);

  useEffect(() => { load(null); }, [load]);

  return { sessions: state.sessions, loading: state.loading, error: state.error,
           hasMore: state.nextCursor != null, refresh: () => load(null), loadMore: () => load(state.nextCursor) };
}
```

## Konfigurasi yang Mudah Diganti Antar Klien
Duration: 0:04:00

Prinsip yang sama seperti backend di Part 1: **ganti klien = ganti satu file, bukan ganti kode.**

```typescript
// env.example.ts (di-commit, template)
export const QISCUS_APP_ID = 'your-qiscus-app-id';
export const QISCUS_CHANNEL_ID = 'your-channel-id';
export const HISTORY_API_BASE_URL_ANDROID = 'http://10.0.2.2:8081';
export const HISTORY_API_BASE_URL_DEFAULT = 'http://localhost:8081';
export const DEV_AUTH_TOKENS: Record<string, string> = {};
```

```typescript
// env.ts (di-commit) — re-export dari file lokal yang di-gitignore
export * from './env.local';
```

```bash
cp env.example.ts env.local.ts
# isi env.local.ts dengan App ID, Channel ID, dan base URL milikmu
```

Negative
: `env.local.ts` **wajib** masuk `.gitignore`. Jangan pernah commit token/App ID asli — bahkan untuk App ID yang "cuma identifier" sekalipun, biasakan memisahkan nilai per-deployment dari kode sejak awal, supaya kebiasaan ini otomatis berlaku juga untuk nilai yang benar-benar rahasia.

### Kenapa alamat backend beda per platform

```typescript
export function getHistoryApiBaseUrl(): string {
  const { Platform } = require('react-native');
  return Platform.select({
    android: HISTORY_API_BASE_URL_ANDROID, // 10.0.2.2 — alias emulator Android ke host machine
    default: HISTORY_API_BASE_URL_DEFAULT,  // localhost — iOS Simulator berbagi network namespace dgn host
  });
}
```

Kalau alamat ini salah (misal pakai `10.0.2.2` di iOS Simulator), gejalanya **bukan** error langsung — `fetch()` akan menggantung menunggu koneksi yang tidak akan pernah connect, sampai timeout. Dari sudut pandang user, ini kelihatan seperti "loading terus", bukan error. Kalau ketemu gejala ini, cek dulu alamat host sebelum menduga bug lain.

## Membangun Layar Riwayat
Duration: 0:10:00

### Kenapa tidak pakai `Header` bawaan library

Godaan pertama saat butuh header konsisten adalah reuse `Header` yang sudah diekspor library. **Jangan** — komponen itu didesain khusus untuk layar chat aktif:

```typescript
// Header bawaan library membaca state GLOBAL milik chat-room:
function useSubtitle(subtitle?: string) {
  return useComputedAtomValue((get) => {
    const isTyping = get(typingStatusAtom);        // status "typing" chat aktif
    if (isTyping) return 'Typing...';
    return get(subtitleAtom);                        // daftar partisipan chat aktif
  });
}
```

Kalau dipakai di layar SessionList, subtitle-nya akan menampilkan **sisa data partisipan chat terakhir** yang bocor dari state global — bukan apa yang kamu maksudkan. Solusinya: bikin header sendiri, sederhana, yang title/subtitle-nya murni dari props:

```typescript
// HistoryHeader.tsx — komponen sendiri, BUKAN dari library
export function HistoryHeader(props: { title: string; subtitle?: string; onBack?: () => void }) {
  return (
    <View style={styles.container}>
      {props.onBack != null && (
        <TouchableOpacity onPress={props.onBack}><Text style={styles.backIcon}>‹</Text></TouchableOpacity>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{props.title}</Text>
        {props.subtitle != null && <Text style={styles.subtitle} numberOfLines={1}>{props.subtitle}</Text>}
      </View>
    </View>
  );
}
```

### SessionList — judul dari topik, bukan nama user

```typescript
// SessionList.tsx (potongan)
<Text style={styles.itemTitle} numberOfLines={1}>
  {item.topic || item.name}
</Text>
<Text style={styles.itemLastMessage} numberOfLines={1}>
  {item.last_message || 'Belum ada pesan'}
</Text>
```

Nama user tidak informatif sebagai judul kalau app-nya cuma dipakai satu user untuk semua sesi (kasus umum saat testing). Topik lebih menjelaskan "sesi ini soal apa" — dan supaya topik itu **awet** (tidak hilang begitu chat berlanjut panjang dan `last_message` berubah), topik disimpan di tempat yang berbeda dari pesan biasa. Kita bahas caranya di bagian berikutnya.

## Bug #1 — Layar Putih Setelah Reload
Duration: 0:08:00

Ini bug yang paling instruktif di seri ini, karena murni bug **logika kondisi render**, bukan sesuatu yang kelihatan jelas dari luar.

### Gejala

App jalan normal setelah login manual. Tapi begitu di-reload (Cmd+R, atau app di-relaunch), layar jadi **putih total** — tidak ada error di console, tidak ada crash.

### Root cause

```typescript
// App.tsx — versi BERMASALAH
const [userId, setUserId] = useState<string | null>(null); // state lokal terpisah!

// ...
onLogin={async (loginUserId, displayName) => {
  setUserId(loginUserId); // cuma keisi lewat jalur login manual
  // ...
}}
```

Library punya mekanisme sendiri: `useCurrentUser()` (dari state global) **otomatis di-restore dari `AsyncStorage`** setiap kali app di-mount ulang — tanpa lewat `onLogin`. Jadi begitu reload:

* `currentUser` (dari library) → terisi lagi dari `AsyncStorage`, **bukan `null`**.
* `userId` (state lokal App.tsx) → reset ke `null`, karena tidak pernah direstore.

Lihat kondisi render-nya:

```typescript
{currentUser == null && <Login />}                                          // false — currentUser sudah ada
{currentUser != null && userId != null && screen === 'sessions' && <SessionList />}  // false — userId null!
{currentUser != null && screen === 'chat' && <Chat />}                       // false — screen direset ke 'sessions'
```

**Tidak ada satu kondisi pun yang match** — tidak ada yang di-render sama sekali. Layar putih.

### Fix

```typescript
// App.tsx — versi BENAR
// Diturunkan dari currentUser (bukan state lokal terpisah), supaya tetap
// sinkron ketika library restore sesi dari AsyncStorage saat reload.
const userId = currentUser?.id ?? null;
```

Positive
: **Pelajaran umum:** kalau sebuah nilai bisa direstore secara implisit oleh library/framework di luar kendali komponenmu (session restore, cache hydration, dll), jangan simpan salinan lokalnya sendiri yang cuma diisi lewat satu jalur (misal `onLogin`). Turunkan dari sumber yang sama yang dipakai proses restore itu.

## Bug #2 — Tombol Back Salah Logout
Duration: 0:05:00

### Gejala

Tombol back di layar chat aktif langsung logout user, padahal seharusnya cuma balik ke daftar sesi.

### Root cause

```typescript
// Chat.tsx — versi lama, sisa dari sebelum ada SessionList
return <MultichannelWidget onBack={() => widget.clearUser()} />;
```

Ini sisa kode dari sebelum ada layar daftar sesi — waktu itu Chat adalah satu-satunya layar setelah login, jadi "back" secara wajar berarti logout. Begitu ditambah SessionList sebagai layar navigasi baru, semantik "back" berubah, tapi kode ini tidak ikut diupdate.

### Fix — plus dialog konfirmasi yang konsisten

```typescript
// Chat.tsx
type IProps = { onBack: () => void }; // dioper dari parent, bukan hardcode clearUser
export function Chat(props: IProps) {
  return <MultichannelWidget onBack={props.onBack} />;
}

// App.tsx
<Chat onBack={() => setScreen({ name: 'sessions' })} />
```

Logout sekarang cuma terjadi dari tombol back di header `SessionList` — dan itu pun lewat dialog konfirmasi tema custom (bukan `Alert.alert` bawaan OS yang gaya visualnya beda-beda), dipakai bersama oleh tombol header **dan** hardware back Android, supaya dua jalur itu konsisten:

```typescript
<ConfirmDialog
  visible={showLogoutConfirm}
  title="Keluar dari akun?"
  destructive
  onConfirm={() => { setShowLogoutConfirm(false); widget.clearUser(); }}
  onCancel={() => setShowLogoutConfirm(false)}
/>
```

## Bug #3 — "Mulai Percakapan Baru" yang Diam-diam Tidak Ngapa-ngapain
Duration: 0:08:00

### Gejala

Kalau semua sesi sudah "Selesai", tidak ada cara jelas untuk mulai chat baru — dan mencoba panggil `widget.initiateChat()` lagi (yang biasa dipakai saat login pertama) tidak menghasilkan apa-apa.

### Root cause

```typescript
// use-multichannel-widget.ts (di dalam library)
const initiateChat = useAtomCallbackWithDeps(async (get) => {
  if (isLoggedIn) return; // <- diam-diam no-op kalau user sudah login!
  // ...
}, [appId]);
```

Guard ini masuk akal untuk mencegah panggilan ganda saat login pertama — tapi efek sampingnya, memanggil `widget.initiateChat()` lagi setelah user sudah login **tidak melakukan apa-apa sama sekali**, tanpa error.

### Fix — pakai hook level rendah yang diekspor publik

Library juga mengekspor `useInitiateChat()` — versi tanpa guard itu, yang benar-benar mengecek status resolved dan membuka room baru kalau perlu:

```typescript
const initiateChat = useInitiateChat(); // hook publik, level rendah

async function startNewConversation(topic: string) {
  // Kalau room terakhir masih aktif (belum resolved), ini cuma reuse room
  // yang sama — tidak akan membuat duplikat percakapan aktif.
  await initiateChat({ userId: currentUser.id, name: currentUser.name, channelId: CHANNEL_ID });
  setPendingTopic(topic || null);
  setScreen({ name: 'chat' });
}
```

Positive
: **Pelajaran umum:** kalau sebuah fungsi publik "sengaja no-op" untuk mencegah efek samping tertentu (di sini: panggilan ganda saat login), cek dulu apakah library juga mengekspor versi level-rendah tanpa guard itu — daripada menyimpulkan fitur itu "tidak mungkin dilakukan".

## Topik yang Bertahan — Menyimpan di `room.extras`, Bukan Cuma Pesan
Duration: 0:07:00

Topik yang cuma jadi pesan pertama akan "terkubur" begitu chat berlanjut panjang (`last_message` berubah menunjuk ke pesan lain). Solusi yang lebih awet: simpan topik di **room-level `extras`** lewat `qiscus.updateChatRoom(...)` — field yang sama yang dibaca backend sebagai `room_options.topic` di Part 1.

### Risiko yang harus dimitigasi: overwrite `is_resolved`

`is_resolved` (yang seluruh logic sessional bergantung padanya) hidup di JSON blob yang **sama** dengan `topic`. Kalau `updateChatRoom` mengirim objek baru tanpa menyertakan field lama, risikonya field itu ter-overwrite tanpa sengaja.

```typescript
// Chat.tsx — dikirim SETELAH room benar-benar siap (bukan langsung di App.tsx,
// untuk menghindari race condition timing React state vs promise initiateChat)
useEffect(() => {
  if (room == null || pendingTopic == null) return;

  (async () => {
    // 1. Kirim sebagai pesan pertama — natural di transkrip, otomatis jadi last_message.
    const message = qiscus.generateMessage({ roomId: room.id, text: pendingTopic });
    await sendMessage(message);

    // 2. SPREAD extras yang ADA dulu, baru tambahkan topic — supaya is_resolved
    //    dan field lain yang dikelola Qiscus tidak ikut hilang.
    await qiscus.updateChatRoom(room.id, room.name, room.avatarUrl, {
      ...room.extras,
      topic: pendingTopic,
    });
  })();
}, [room, pendingTopic]);
```

Negative
: Selalu **baca state yang ada dulu, gabungkan, baru tulis** — bukan tulis objek baru dari nol — setiap kali API pihak ketiga menyimpan beberapa field custom di satu blob JSON yang sama. Ini pola umum di banyak platform (metadata/extras/custom fields), bukan cuma spesifik Qiscus.

## Menjalankan Test
Duration: 0:04:00

### Bug tersembunyi lain: dua instance React di Jest

```
Cannot read properties of null (reading 'useState')
```

`example/` (folder demo di monorepo) punya salinan `react` sendiri di `node_modules` bersarang, berbeda instance dari `react` di root — bikin hooks gagal lintas boundary saat `react-test-renderer` dipakai. Fix-nya di level konfigurasi Jest, bukan di kode fitur:

```json
{
  "jest": {
    "moduleNameMapper": {
      "^react$": "<rootDir>/node_modules/react",
      "^react-test-renderer$": "<rootDir>/node_modules/react-test-renderer"
    }
  }
}
```

```bash
yarn typecheck
yarn lint
yarn jest example/src/history
```

## Ringkasan
Duration: 0:02:00

### Yang Sudah Anda Bangun

* ✅ Layar riwayat percakapan lengkap: daftar sesi, transkrip read-only, mulai sesi baru dengan topik.
* ✅ Tiga bug nyata diperbaiki: layar putih setelah reload (state lokal vs restore session), tombol back yang salah logout, dan `initiateChat` yang diam-diam no-op.
* ✅ Topik percakapan tersimpan awet di `room.extras`, dengan mitigasi merge yang aman.
* ✅ Konfigurasi client-agnostic — ganti klien lewat satu file `env.local.ts`.

### Apa Selanjutnya

* Ulangi Part 1 dengan kredensial Qiscus App ID milikmu sendiri, lalu sambungkan ke app dari Part 2 ini.
* Coba pola `getAuthToken` yang WAJIB diganti untuk produksi — hubungkan ke backend auth klien sungguhan, bukan token dev statis.
* Eksplorasi pola "baca-gabung-tulis" untuk `extras`/metadata di API pihak ketiga lain yang kamu pakai — ini bukan pola khusus Qiscus.

Kalau kamu melewatkan Part 1 atau mau baca ulang detail bug di sisi backend (bentuk respons `get_user_rooms`, urutan `load_comments`, dan cache TTL), kembali ke sana:

Positive
: **Kembali ke Part 1 — Backend Proxy Generik dengan Go:** [learnwithfath.github.io/qiscus-sessional-chat-history-part-1-backend-proxy/#0](https://learnwithfath.github.io/qiscus-sessional-chat-history-part-1-backend-proxy/#0)

## Sumber
Duration: 0:01:00

* [Versi siap pakai — branch `feature/chat-history-viewer`](https://github.com/amed12/react-native-multichannel-widget/tree/feature/chat-history-viewer)
* [react-native-multichannel-widget (Qiscus Community)](https://github.com/qiscus-community/react-native-multichannel-widget)
* [Jotai — state management yang dipakai library ini](https://jotai.org/)
* [React Native Platform module](https://reactnative.dev/docs/platform)
