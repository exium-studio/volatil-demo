📖 API Documentation - Backend Volatil

Dokumentasi resmi untuk seluruh endpoint REST API pada Backend Volatil (IGTPR 2026).
File ini menjadi acuan utama dan wajib diperbarui setiap kali ada penambahan atau perubahan endpoint API.
🌐 Base URL

    Production / Staging: https://volatil-be.exium.web.id
    Local Development: http://localhost:3001

🔐 Standar Autentikasi (Bearer Token)

Sebagian besar endpoint yang dilindungi memerlukan token JWT yang dikirimkan melalui Header HTTP:

Authorization: Bearer <your_access_token>

Role Pengguna:

    internal (Administrator): Memiliki akses penuh ke seluruh fitur dan endpoint admin.
    mitra (User / Partner): Memiliki akses ke fitur operasional mitra.

Akun Demo untuk Development / Testing:
Role Email Password
MITRA (User) mitra@demo.com mitra123
INTERNAL (Admin) internal@demo.com internal123
📑 Daftar Endpoint

1. Sistem & Health Check
   GET /

Mengecek status root backend.

    Auth: Tidak perlu
    Response 200 OK:

{
"message": "Express.js backend with PostgreSQL/PostGIS is running!"
}

GET /health

Liveness/readiness probe untuk monitoring container.

    Auth: Tidak perlu
    Response 200 OK:

{
"status": "OK",
"timestamp": "2026-08-17T05:00:00.000Z"
}

GET /check-db

Mengecek konektivitas database PostgreSQL dan status modul PostGIS.

    Auth: Tidak perlu
    Response 200 OK:

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

2. Autentikasi & Akun (/api/auth)
   POST /api/auth/login

Login menggunakan email dan password untuk mendapatkan Bearer Access Token.

    Auth: Tidak perlu
    Request Body:

{
"email": "internal@demo.com",
"password": "internal123"
}

    Response 200 OK:

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

    Response 401 Unauthorized:

{
"success": false,
"message": "Invalid email or password."
}

GET /api/auth/me

Mendapatkan data profil user yang sedang login.

    Auth: Bearer Token (Semua Role)
    Headers: Authorization: Bearer <token>
    Response 200 OK:

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

3. Role-Protected Dashboard Areas
   GET /api/internal/dashboard

Area khusus role internal/administrator.

    Auth: Bearer Token (Hanya Role internal)
    Response 200 OK:

{
"success": true,
"message": "Welcome to Internal Dashboard, Internal Admin Demo!",
"user": { ... }
}

    Response 403 Forbidden (Jika diakses oleh role mitra):

{
"success": false,
"message": "Forbidden: Access restricted to roles [internal]. Your role is 'mitra'."
}

GET /api/mitra/dashboard

Area khusus role mitra (juga dapat diakses oleh internal).

    Auth: Bearer Token (Role mitra & internal)
    Response 200 OK:

{
"success": true,
"message": "Welcome to Mitra Area, Mitra User Demo!",
"user": { ... }
}

4. Spasial / GIS (/api/locations)
   GET /api/locations

Mengambil semua data titik lokasi geografis.

    Auth: Tidak perlu
    Response 200 OK:

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

POST /api/locations

Menambahkan data koordinat titik lokasi baru.

    Auth: Bearer Token (Semua Role terotentikasi)
    Headers:
        Authorization: Bearer <token>
        Content-Type: application/json
    Request Body:

{
"name": "Kantor Pusat",
"latitude": -6.2088,
"longitude": 106.8456
}

    Response 201 Created:

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

5. Modul Tiket & Laporan (/api/tickets)
   GET /api/tickets/statistics

Mengambil data statistik laporan untuk widget dashboard (Laporan Aktif, Selesai, Total, dan Rincian Status).

    Auth: Bearer Token (Semua Role)
    Headers: Authorization: Bearer <token>
    Query Parameters:
        scope (opsional): my (khusus laporan user) atau all (default untuk admin)
    Response 200 OK:

{
"success": true,
"data": {
"totalTickets": 12,
"activeTickets": 5,
"resolvedTickets": 7,
"breakdown": {
"submitted": 2,
"inReview": 2,
"inProgress": 1,
"resolved": 7,
"rejected": 0
}
}
}

GET /api/tickets

Mengambil daftar laporan/tiket dengan filter dinamis dan pagination.

    Auth: Bearer Token (Semua Role)
    Headers: Authorization: Bearer <token>
    Query Parameters:
        scope (opsional): my (hanya tiket milik user pembuat) atau all (seluruh tiket di sistem, default untuk role internal). Role mitra otomatis dipaksa scope=my.
        status (opsional): active (menampilkan submitted, in_review, in_progress) atau history (menampilkan resolved, rejected) atau status spesifik (submitted, in_review, in_progress, resolved, rejected).
        search (opsional): Pencarian teks pada judul laporan (title), nama pelapor, atau instansi/perusahaan.
        startDate & endDate (opsional): Filter rentang tanggal laporan dibuat (YYYY-MM-DD).
        page / pageNumber (opsional, default: 1): Nomor halaman.
        itemPerPage / itemsPerPage / limit / perPage (opsional, default: 10, maks: 100): Jumlah data per halaman.
        sortBy (opsional, default: createdAt): Kolom pengurutan (createdAt, title, status).
        sortOrder (opsional, default: DESC): Arah pengurutan (ASC atau DESC).
    Contoh Request:
        GET /api/tickets?scope=all&status=active&page=1&itemPerPage=10
        GET /api/tickets?search=Nusantara&startDate=2026-08-01&endDate=2026-08-31
    Response 200 OK:

{
"success": true,
"data": [
{
"id": 1,
"title": "Kesalahan Pembacaan Data Geometri Bidang",
"description": "File GeoJSON yang diunggah tidak merender layer poligon dengan sempurna.",
"status": "in_progress",
"priority": "high",
"category": "Data Geospasial",
"user": {
"id": 1,
"name": "Mitra User Demo",
"email": "mitra@demo.com",
"role": "mitra"
},
"repliesCount": 2,
"attachmentsCount": 2,
"createdAt": "2026-08-17T05:00:00.000Z",
"updatedAt": "2026-08-17T05:30:00.000Z"
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

GET /api/tickets/:id

Melihat rincian detail 1 tiket beserta semua riwayat balasan (timeline replies) dan lampiran (attachments).

    Auth: Bearer Token (Role internal atau Pembuat Tiket)
    Headers: Authorization: Bearer <token>
    Response 200 OK:

{
"success": true,
"data": {
"id": 1,
"title": "Kesalahan Pembacaan Data Geometri Bidang",
"description": "File GeoJSON yang diunggah tidak merender layer poligon dengan sempurna.",
"status": "in_progress",
"priority": "high",
"category": "Data Geospasial",
"userId": 1,
"user": {
"id": 1,
"name": "Mitra User Demo",
"email": "mitra@demo.com",
"organizationName": "PT Nusantara Citra Mandiri",
"role": "mitra"
},
"attachments": [
{
"id": 1,
"originalFileName": "screenshot-polygon-error.png",
"storedFileName": "file-1723871200000-123456789.png",
"fileSize": 204850,
"fileType": "image/png",
"fileUrl": "http://localhost:3001/uploads/tickets/file-1723871200000-123456789.png",
"createdAt": "2026-08-17T05:00:00.000Z"
}
],
"replies": [
{
"id": 1,
"message": "Laporan telah kami terima dan sedang dianalisis oleh tim GIS Internal.",
"user": {
"id": 2,
"name": "Internal Admin Demo",
"email": "internal@demo.com",
"role": "internal"
},
"attachments": [
{
"id": 2,
"originalFileName": "revisi-koordinat.pdf",
"fileUrl": "http://localhost:3001/uploads/replies/file-1723872000000-987654321.pdf"
}
],
"createdAt": "2026-08-17T05:20:00.000Z"
}
],
"createdAt": "2026-08-17T05:00:00.000Z",
"updatedAt": "2026-08-17T05:20:00.000Z"
}
}

POST /api/tickets

Membuat tiket / laporan baru. Mendukung unggah multiple files (foto/dokumen PDF/ZIP/dokumen teknis maks 10MB per file).

    Auth: Bearer Token (Semua Role terotentikasi)
    Headers:
        Authorization: Bearer <token>
        Content-Type: multipart/form-data
    Form Data:
        title (string, required): Judul ringkas kendala/laporan.
        description (string, required): Penjelasan detail kendala.
        priority (string, opsional): low | medium | high | urgent (default: medium).
        category (string, opsional): Kategori tiket (contoh: Teknis, Data Geospasial, Akun, Lainnya).
        files (file binary, opsional, multiple): File bukti dukung (gambar .png/.jpg/.jpeg, dokumen .pdf/.doc/.docx/.zip).
    Response 201 Created:

{
"success": true,
"message": "Ticket created successfully.",
"data": {
"id": 2,
"title": "Permintaan Pembaruan Peta Dasar Tematik",
"description": "Mohon update batas deliniasi kawasan per 2026.",
"status": "submitted",
"priority": "medium",
"category": "Data Geospasial",
"userId": 1,
"attachments": [
{
"id": 3,
"originalFileName": "surat-permohonan.pdf",
"fileUrl": "http://localhost:3001/uploads/tickets/surat-permohonan-123.pdf"
}
],
"createdAt": "2026-08-17T05:35:00.000Z"
}
}

POST /api/tickets/:id/reply

Mengirim balasan respon pada tiket, mengubah status tiket, dan melampirkan file dokumen pendukung penyelesaian (Khusus Admin Internal).

    Auth: Bearer Token (Khusus Role internal)
    Headers:
        Authorization: Bearer <token>
        Content-Type: multipart/form-data (atau application/json jika tanpa file)
    Form Data / Body:
        message (string, required): Isi pesan balasan dari admin internal.
        status (string, opsional): Status baru untuk tiket (in_review | in_progress | resolved | rejected).
        files (file binary, opsional, multiple): Dokumen pendukung balasan.
    Response 201 Created:

{
"success": true,
"message": "Reply sent successfully.",
"data": {
"reply": {
"id": 3,
"ticketId": 2,
"userId": 2,
"message": "Peta tematik batas deliniasi telah diperbarui. Mohon dicek kembali.",
"attachments": [
{
"id": 4,
"originalFileName": "berita-acara-selesai.pdf",
"fileUrl": "http://localhost:3001/uploads/replies/berita-acara-selesai-456.pdf"
}
],
"createdAt": "2026-08-17T05:40:00.000Z"
},
"ticket": {
"id": 2,
"status": "resolved"
}
}
}

    Response 403 Forbidden (Jika diakses non-admin):

{
"success": false,
"message": "Forbidden: Access restricted to roles [internal]. Your role is 'mitra'."
}

6. Modul Manage User & Data (/api/internal/user-management) — Khusus Admin (Internal)
   GET /api/internal/users/statistics

Mengambil ringkasan statistik pengguna sistem (Pengguna Aktif, Pengguna Non Aktif, Total Pengguna, dan rincian per role).

    Auth: Bearer Token (Khusus Role internal)
    Headers: Authorization: Bearer <token>
    Response 200 OK:

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

GET /api/internal/user-management

Mengambil daftar seluruh pengguna dengan pencarian, filter status & role, serta pagination.

    Auth: Bearer Token (Khusus Role internal)
    Headers: Authorization: Bearer <token>
    Query Parameters:
        search (opsional): Kata kunci pencarian pada Nama, Email, atau Nama Perusahaan / Organisasi.
        status (opsional): active | inactive.
        role (opsional): internal | mitra.
        page / pageNumber (opsional, default: 1): Nomor halaman.
        itemPerPage / itemsPerPage / limit / perPage (opsional, default: 10, maks: 200): Mengatur jumlah data per halaman.
        sortBy (opsional, default: createdAt): Kolom sorting.
        sortOrder (opsional, default: DESC): Urutan sorting (DESC untuk latest / terbaru).
    Contoh Request:
        GET /api/internal/user-management?page=1&itemPerPage=10
        GET /api/internal/user-management?status=active&role=mitra&search=nusantara
    Response 200 OK:

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
"joinedAt": "2026-08-17T05:00:00.000Z"
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

GET /api/internal/users/:id

Melihat detail lengkap satu akun pengguna.

    Auth: Bearer Token (Khusus Role internal)
    Headers: Authorization: Bearer <token>
    Response 200 OK (Contoh Akun Mitra / User):

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
"updatedAt": "2026-08-17T05:00:00.000Z"
}
}

PATCH /api/internal/users/:id/status

Menonaktifkan (inactive) atau mengaktifkan kembali (active) akun pengguna.

    Auth: Bearer Token (Khusus Role internal)
    Headers:
        Authorization: Bearer <token>
        Content-Type: application/json
    Request Body (opsional):

{
"status": "inactive"
}

(Jika body kosong, status akan otomatis di-toggle).

    Response 200 OK:

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

📌 Panduan Menambahkan Endpoint Baru

Setiap pengembang yang menambahkan route/endpoint baru wajib mencatatnya pada file ini dengan format:

    Method & Path (contoh: POST /api/v1/resource)
    Deskripsi singkat
    Persyaratan Autentikasi & Role yang diizinkan
    Header yang diperlukan
    Request Body / Form-Data / Query Params (jika ada)
    Contoh Response Sukses & Gagal (Status code + JSON)
