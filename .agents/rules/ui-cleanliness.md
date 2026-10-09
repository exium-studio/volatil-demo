---
description: "Aturan mutlak penulisan UI, larangan prop redundan, dan semantik warna domain"
alwaysApply: true
---

# UI Cleanliness & Domain Rules

## 1. Larangan Menuliskan Default Props (MUTLAK ANTI-NOISE)
- ❌ **DILARANG**: `<VStack align={"stretch"} ...>` ➡️ Default `VStack` di Exium sudah `align={"stretch"}`. Jangan tulis `align={"stretch"}`!
- ❌ **DILARANG**: `<HStack align={"center"} ...>` jika defaultnya sudah `center`.
- ❌ **DILARANG**: Membungkus anak langsung `<Container.Body>` dengan `<VStack>` tambahan yang tidak diperlukan.
- ❌ **DILARANG**: Menuliskan prop apa pun yang nilainya sama persis dengan default komponen di `@/design-system/`.

## 2. Larangan Raw Technical Leak di UI (MUTLAK)
- ❌ **DILARANG**: Menampilkan endpoint API mentah (seperti `/api/...`, `GET`, `POST`, nama route, atau JSON raw key) sebagai teks heading, label, atau badge di UI.
- Semua teks di UI harus berorientasi pada user/bisnis berbahasa Indonesia yang rapi.

## 3. Semantik Warna Domain IGT (MUTLAK)
- **Basis IGT Bidang** ➡️ WAJIB palette `blue`
- **Basis IGT Kawasan** ➡️ WAJIB palette `orange`
- **Mitra Status Active** ➡️ `teal` / `emerald`
- **Mitra Status Pending** ➡️ `orange` / `amber`
- **Mitra Status Rejected** ➡️ `red` / `rose`
- ❌ **DILARANG**: Menggunakan palette acak (misal `teal`, `purple`, `pink`) untuk entitas yang sudah memiliki standar semantik warna di atas.

## 4. Syntax & Code Style
- Semua nilai props wajib curly bracket: `value={"foo"}` bukan `value="foo"`.
- Destructure props di dalam body fungsi, bukan di parameter fungsi.
- Dilarang membuat inline type (wajib di `*.type.ts`).
- Jalankan ESLint / typecheck sebelum menyelesaikan pekerjaan.
