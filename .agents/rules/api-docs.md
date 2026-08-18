---
trigger: always_on
---

# 📖 API Documentation - Backend Volatil

Dokumentasi resmi untuk seluruh endpoint REST API pada **Backend Volatil (IGTPR 2026)**.  
File ini menjadi acuan utama dan **wajib diperbarui setiap kali ada penambahan atau perubahan endpoint API**.

---

## 🌐 Base URL

- **Production / Staging**: `https://volatil-be.exium.web.id`
- **Local Development**: `http://localhost:3001`

---

## 🔐 Standar Autentikasi (Bearer Token)

Sebagian besar endpoint yang dilindungi memerlukan token JWT yang dikirimkan melalui **Header HTTP**:

```http
Authorization: Bearer <your_access_token>
```

### Role Pengguna:

1. **`internal`** (Administrator): Memiliki akses penuh ke seluruh fitur dan endpoint admin.
2. **`mitra`** (User / Partner): Memiliki akses ke fitur operasional mitra.

### Akun Demo untuk Development / Testing:

| Role                   | Email               | Password      |
| :--------------------- | :------------------ | :------------ |
| **MITRA** _(User)_     | `mitra@demo.com`    | `mitra123`    |
| **INTERNAL** _(Admin)_ | `internal@demo.com` | `internal123` |

---

## 📑 Daftar Endpoint

### 1. Sistem & Health Check

#### `GET /`

Mengecek status root backend.

- **Auth**: Tidak perlu
- **Response `200 OK`**:

```json
{
  "message": "Express.js backend with PostgreSQL/PostGIS is running!"
}
```

#### `GET /health`

Liveness/readiness probe untuk monitoring container.

- **Auth**: Tidak perlu
- **Response `200 OK`**:

```json
{
  "status": "OK",
  "timestamp": "2026-08-17T05:00:00.000Z"
}
```

#### `GET /check-db`

Mengecek konektivitas database PostgreSQL dan status modul PostGIS.

- **Auth**: Tidak perlu
- **Response `200 OK`**:

```json
{
  "success": true,
  "message": "Database connection is healthy and connected successfully!",
  "database": {
    "host": "db",
    "name": "backend_volatil",
    "port": "5432",
    "user": "postgres"
  },
  "postgresVersion": "PostgreSQL 15.3...",
  "postgisVersion": "POSTGIS=\"3.3.3...\""
}
```

---

### 2. Autentikasi & Akun (`/auth`)

#### `POST /auth/login`

Login menggunakan email dan password untuk mendapatkan Bearer Access Token.

- **Auth**: Tidak perlu
- **Request Body**:

```json
{
  "email": "internal@demo.com",
  "password": "internal123"
}
```

- **Response `200 OK`**:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "tokenType": "Bearer",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 2,
      "name": "Internal Admin Demo",
      "email": "internal@demo.com",
      "role": "internal"
    }
  }
}
```

- **Response `401 Unauthorized`**:

```json
{
  "success": false,
  "message": "Invalid email or password."
}
```

---

#### `GET /auth/me`

Mendapatkan data profil user yang sedang login.

- **Auth**: `Bearer Token` (Semua Role)
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**:

```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Internal Admin Demo",
    "email": "internal@demo.com",
    "role": "internal",
    "keycloakId": null
  }
}
```

---

### 3. Role-Protected Dashboard Areas

#### `GET /admin/dashboard`

Area khusus role internal/administrator.

- **Auth**: `Bearer Token` (**Hanya Role `internal`**)
- **Response `200 OK`**:

```json
{
  "success": true,
  "message": "Welcome to Admin Dashboard, Internal Admin Demo!",
  "user": { ... }
}
```

- **Response `403 Forbidden`** (Jika diakses oleh role `mitra`):

```json
{
  "success": false,
  "message": "Forbidden: Access restricted to roles [internal]. Your role is 'mitra'."
}
```

---

#### `GET /mitra/dashboard`

Area khusus role mitra (juga dapat diakses oleh internal).

- **Auth**: `Bearer Token` (**Role `mitra` & `internal`**)
- **Response `200 OK`**:

```json
{
  "success": true,
  "message": "Welcome to Mitra Area, Mitra User Demo!",
  "user": { ... }
}
```

---

### 4. Spasial / GIS (`/locations`)

#### `GET /locations`

Mengambil semua data titik lokasi geografis.

- **Auth**: Tidak perlu
- **Response `200 OK`**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Monas, Jakarta",
      "geom": {
        "type": "Point",
        "coordinates": [106.827153, -6.175392]
      },
      "createdAt": "2026-08-17T04:00:00.000Z",
      "updatedAt": "2026-08-17T04:00:00.000Z"
    }
  ]
}
```

---

#### `POST /locations`

Menambahkan data koordinat titik lokasi baru.

- **Auth**: `Bearer Token` (Semua Role terotentikasi)
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body**:

```json
{
  "name": "Kantor Pusat",
  "latitude": -6.2088,
  "longitude": 106.8456
}
```

- **Response `201 Created`**:

```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "Kantor Pusat",
    "geom": {
      "type": "Point",
      "coordinates": [106.8456, -6.2088]
    },
    "createdAt": "2026-08-17T05:10:00.000Z",
    "updatedAt": "2026-08-17T05:10:00.000Z"
  }
}
```

---

### 5. Modul Tiket & Laporan (`/api/tickets`)

#### `GET /api/tickets/statistics`

Mengambil data statistik laporan untuk widget dashboard (Laporan Aktif, Selesai, Total, dan Rincian Status).

- **Auth**: `Bearer Token` (Semua Role)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `scope` (opsional): `my` (khusus laporan user) atau `all` (default untuk admin)
- **Response `200 OK`**:

```json
{
  "success": true,
  "data": {
    "totalTickets": 12,
    "activeTickets": 5,
    "resolvedTickets": 7,
    "breakdown": {
      "open": 3,
      "inProgress": 2,
      "closed": 7
    }
  }
}
```

---

#### `GET /api/tickets`

Mengambil daftar laporan dengan berbagai filter, pencarian teks, dan pagination.

- **Auth**: `Bearer Token` (Semua Role)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `scope` (opsional): `all` | `my` (Catatan: Role `mitra` otomatis dibatasi ke `my`).
  - `status` (opsional): `active` (open & in_progress) | `history` (resolved & closed) | `open` | `in_progress` | `resolved` | `closed`.
  - `search` (opsional): Kata kunci pencarian pada **Judul** atau **Deskripsi** laporan.
  - `startDate` (opsional): Filter tanggal mulai (format: `YYYY-MM-DD`).
  - `page` / `pageNumber` (opsional, default: `1`): Nomor halaman pagination.
  - `itemPerPage` / `itemsPerPage` / `limit` / `perPage` (opsional, default: `10`, maks: `200`): Mengatur jumlah item data yang ditampilkan per halaman.
  - `sortBy` (opsional, default: `createdAt`): Kolom pengurutan.
  - `sortOrder` (opsional, default: `DESC`): Urutan data (`DESC` untuk latest / terbaru paling atas).
- **Contoh Request**:
  - `GET /api/tickets?page=1&itemPerPage=5`
  - `GET /api/tickets?status=active&search=jaringan&startDate=2026-08-01&page=2&itemPerPage=15`
- **Response `200 OK`**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "title": "Kendala Sinyal di Titik Pos A",
      "description": "Terjadi penurunan kualitas sinyal sejak pagi hari...",
      "status": "open",
      "attachments": [
        {
          "originalName": "foto-kondisi.jpg",
          "fileName": "1723871234567-foto-kondisi.jpg",
          "mimeType": "image/jpeg",
          "size": 245120,
          "url": "https://volatil-be.exium.web.id/uploads/1723871234567-foto-kondisi.jpg"
        }
      ],
      "createdAt": "2026-08-17T05:20:00.000Z",
      "updatedAt": "2026-08-17T05:20:00.000Z",
      "user": {
        "id": 1,
        "name": "Mitra User Demo",
        "email": "mitra@demo.com",
        "role": "mitra"
      },
      "responses": []
    }
  ],
  "pagination": {
    "totalItems": 1,
    "totalPages": 1,
    "currentPage": 1,
    "itemsPerPage": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

#### `GET /api/tickets/:id`

Mendapatkan detail 1 laporan lengkap beserta riwayat lampiran dan balasan admin.

- **Auth**: `Bearer Token` (Role `internal` atau pemilik tiket `mitra`)
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "title": "Kendala Sinyal di Titik Pos A",
    "description": "Terjadi penurunan kualitas sinyal...",
    "status": "in_progress",
    "attachments": [ ... ],
    "createdAt": "2026-08-17T05:20:00.000Z",
    "updatedAt": "2026-08-17T05:30:00.000Z",
    "user": {
      "id": 1,
      "name": "Mitra User Demo",
      "email": "mitra@demo.com",
      "role": "mitra"
    },
    "responses": [
      {
        "id": 1,
        "ticketId": 1,
        "adminId": 2,
        "message": "Laporan telah kami terima dan tim teknis sedang menuju lokasi.",
        "attachments": [
          {
            "originalName": "surat-tugas.pdf",
            "fileName": "1723871999999-surat-tugas.pdf",
            "mimeType": "application/pdf",
            "size": 102400,
            "url": "https://volatil-be.exium.web.id/uploads/1723871999999-surat-tugas.pdf"
          }
        ],
        "createdAt": "2026-08-17T05:30:00.000Z",
        "admin": {
          "id": 2,
          "name": "Internal Admin Demo",
          "email": "internal@demo.com",
          "role": "internal"
        }
      }
    ]
  }
}
```

---

#### `POST /api/tickets`

Membuat laporan tiket baru dengan Judul, Deskripsi, dan Multiple Upload File/Foto (maks 10 file per kiriman).

- **Auth**: `Bearer Token` (Semua Role terotentikasi, umumnya `mitra`)
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Form-Data Fields**:
  - `title` _(text, required)_: Judul laporan
  - `description` _(text, required)_: Rincian deskripsi masalah
  - `files` _(file array, optional)_: Multiple file foto/dokumen (JPG, PNG, PDF, DOCX, XLSX, max 15MB/file)
- **Response `201 Created`**:

```json
{
  "success": true,
  "message": "Ticket report submitted successfully",
  "data": {
    "id": 2,
    "userId": 1,
    "title": "Laporan Kerusakan Perangkat",
    "description": "Perangkat sensor mati total setelah pemadaman listrik...",
    "status": "open",
    "attachments": [
      {
        "originalName": "foto1.jpg",
        "fileName": "1723872222222-foto1.jpg",
        "mimeType": "image/jpeg",
        "size": 312000,
        "url": "https://volatil-be.exium.web.id/uploads/1723872222222-foto1.jpg"
      }
    ],
    "createdAt": "2026-08-17T05:35:00.000Z",
    "updatedAt": "2026-08-17T05:35:00.000Z"
  }
}
```

---

#### `POST /api/tickets/:id/reply`

Memberikan balasan laporan dari Administrator (Internal) beserta lampiran dokumen pendukung dan opsi update status.

- **Auth**: `Bearer Token` (**Khusus Role `internal`**)
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Form-Data Fields**:
  - `message` _(text, required)_: Teks balasan admin
  - `status` _(text, optional)_: Update status tiket (`in_progress`, `resolved`, `closed`)
  - `files` _(file array, optional)_: Multiple dokumen pendukung balasan (max 10 file)
- **Response `201 Created`**:

```json
{
  "success": true,
  "message": "Ticket response submitted successfully",
  "data": {
    "response": {
      "id": 2,
      "ticketId": 2,
      "adminId": 2,
      "message": "Perangkat telah diganti dengan unit baru dan berfungsi normal kembali.",
      "attachments": [
        {
          "originalName": "berita-acara.pdf",
          "fileName": "1723873333333-berita-acara.pdf",
          "mimeType": "application/pdf",
          "size": 512000,
          "url": "https://volatil-be.exium.web.id/uploads/1723873333333-berita-acara.pdf"
        }
      ],
      "createdAt": "2026-08-17T05:40:00.000Z"
    },
    "ticket": {
      "id": 2,
      "status": "resolved",
      ...
    }
  }
}
```

- **Response `403 Forbidden`** (Jika diakses non-admin):

```json
{
  "success": false,
  "message": "Forbidden: Access restricted to roles [internal]. Your role is 'mitra'."
}
```

---

### 6. Modul Manage User & Data (`/api/internal/user-management`) — _Khusus Admin (Internal)_

#### `GET /api/internal/user-management/statistics`

Mengambil ringkasan statistik pengguna sistem (Pengguna Aktif, Pengguna Non Aktif, Total Pengguna, dan rincian per role).

- **Auth**: `Bearer Token` (**Khusus Role `internal`**)
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**:

```json
{
  "success": true,
  "data": {
    "totalUsers": 25,
    "activeUsers": 23,
    "inactiveUsers": 2,
    "breakdownByRole": {
      "internal": 5,
      "mitra": 20
    }
  }
}
```

---

#### `GET /api/internal/user-management`

Mengambil daftar seluruh pengguna dengan pencarian, filter status & role, serta pagination.

- **Auth**: `Bearer Token` (**Khusus Role `internal`**)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `search` (opsional): Kata kunci pencarian pada **Nama**, **Email**, atau **Nama Perusahaan / Organisasi**.
  - `status` (opsional): `active` | `inactive`.
  - `role` (opsional): `internal` | `mitra`.
  - `page` / `pageNumber` (opsional, default: `1`): Nomor halaman.
  - `itemPerPage` / `itemsPerPage` / `limit` / `perPage` (opsional, default: `10`, maks: `200`): Mengatur jumlah data per halaman.
  - `sortBy` (opsional, default: `createdAt`): Kolom sorting.
  - `sortOrder` (opsional, default: `DESC`): Urutan sorting (`DESC` untuk latest / terbaru).
- **Contoh Request**:
  - `GET /api/internal/user-management?page=1&itemPerPage=10`
  - `GET /api/internal/user-management?status=active&role=mitra&search=nusantara`
- **Response `200 OK`**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Mitra User Demo",
      "email": "mitra@demo.com",
      "role": "mitra",
      "status": "active",
      "organizationName": "PT Nusantara Citra Mandiri",
      "joinedAt": "2026-08-17T05:00:00.000Z",
      "totalPurchases": 5,
      "totalPlotsPurchased": 12,
      "totalAreaPurchasedHa": 145.5,
      "totalIgtDataCount": 8,
      "lastTotalSpending": "75000000.00"
    },
    {
      "id": 2,
      "name": "Internal Admin Demo",
      "email": "internal@demo.com",
      "role": "internal",
      "status": "active",
      "organizationName": "Kementerian / Badan IGTPR",
      "joinedAt": "2026-08-17T05:00:00.000Z"
    }
  ],
  "pagination": {
    "totalItems": 2,
    "totalPages": 1,
    "currentPage": 1,
    "itemsPerPage": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

#### `GET /api/internal/user-management/:id`

Melihat detail lengkap satu akun pengguna.

- **Auth**: `Bearer Token` (**Khusus Role `internal`**)
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK` (Contoh Akun Mitra / User)**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Mitra User Demo",
    "email": "mitra@demo.com",
    "role": "mitra",
    "status": "active",
    "organizationName": "PT Nusantara Citra Mandiri",
    "joinedAt": "2026-08-17T05:00:00.000Z",
    "updatedAt": "2026-08-17T05:00:00.000Z",
    "totalPurchases": 5,
    "totalPlotsPurchased": 12,
    "totalAreaPurchasedHa": 145.5,
    "totalIgtDataCount": 8,
    "lastTotalSpending": 75000000
  }
}
```

- **Response `200 OK` (Contoh Akun Admin Internal)**:

```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Internal Admin Demo",
    "email": "internal@demo.com",
    "role": "internal",
    "status": "active",
    "organizationName": "Kementerian / Badan IGTPR",
    "joinedAt": "2026-08-17T05:00:00.000Z",
    "updatedAt": "2026-08-17T05:00:00.000Z",
    "notes": "Akun Administrator Internal tidak memiliki riwayat pembelian produk IGT."
  }
}
```

---

#### `PATCH /api/internal/user-management/:id/status`

Menonaktifkan (`inactive`) atau mengaktifkan kembali (`active`) akun pengguna.

- **Auth**: `Bearer Token` (**Khusus Role `internal`**)
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body** _(opsional)_:

```json
{
  "status": "inactive"
}
```

_(Jika body kosong, status akan otomatis di-toggle)._

- **Response `200 OK`**:

```json
{
  "success": true,
  "message": "User status successfully updated to 'inactive'.",
  "data": {
    "id": 1,
    "name": "Mitra User Demo",
    "email": "mitra@demo.com",
    "role": "mitra",
    "status": "inactive",
    "organizationName": "PT Nusantara Citra Mandiri",
    "updatedAt": "2026-08-17T05:50:00.000Z"
  }
}
```

---

## 📌 Panduan Menambahkan Endpoint Baru

Setiap pengembang yang menambahkan route/endpoint baru wajib mencatatnya pada file ini dengan format:

1. **Method & Path** (contoh: `POST /api/v1/resource`)
2. **Deskripsi singkat**
3. **Persyaratan Autentikasi & Role yang diizinkan**
4. **Header yang diperlukan**
5. **Request Body / Form-Data / Query Params (jika ada)**
6. **Contoh Response Sukses & Gagal (Status code + JSON)**
