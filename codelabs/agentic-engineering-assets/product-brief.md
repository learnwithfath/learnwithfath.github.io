# TaskForge Product Brief

## Problem

Tim kecil kehilangan konteks ketika pekerjaan berpindah antara chat, issue tracker, dan aplikasi mobile. TaskForge menyediakan satu alur ringan untuk membuat project, membagi task, bekerja offline, dan menyinkronkan perubahan dengan aman.

## Users and jobs

- Contributor: melihat assignment, memperbarui status, dan tetap bekerja saat offline.
- Lead: membuat project/task, menentukan assignee, dan melihat blocker.
- Administrator: mengelola member dan menelusuri audit event.

## Version 1 flows

1. Login dengan akun seed.
2. Buat project dan undang member.
3. Buat, assign, dan ubah status task: `todo → doing → done`.
4. Mobile menyimpan perubahan offline, lalu melakukan sync ketika kembali online.
5. Konflik version ditampilkan; tidak boleh ada silent overwrite.

## Non-goals

Tidak ada billing, public marketplace, arbitrary workflow builder, chat realtime, atau production SSO pada v1.

## Success evidence

- Go dan NestJS lulus contract suite yang sama.
- Next.js, Nuxt, Flutter, Compose, dan SwiftUI bekerja dengan kedua backend.
- Flow kritis mempunyai automated test dan trace ID.
- Build dapat direproduksi dari clean checkout.

## Constraints

- PostgreSQL adalah source of truth; Redis hanya cache/ephemeral coordination.
- Semua write memakai idempotency key dan optimistic version.
- Agent tidak memiliki credential produksi atau hak deploy tanpa approval.
