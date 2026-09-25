# Dokumentasi & Spesifikasi Modul Reset Password Pegawai (Internal Only)

Dokumen ini ditujukan untuk **Tim Backend (BE)** sebagai panduan implementasi endpoint API untuk modul **Reset Password & Ubah Kata Sandi Akun Internal** pada sistem IGTPR Volatil.

---

## 1. Ikhtisar & Arsitektur Alur (Flow)

Modul ini **khusus melayani akun dengan role `internal` (Pegawai ATR/BPN)**.

Terdapat 2 skenario penggunaan utama:

```mermaid
graph TD
    subgraph Flow A: Unauthenticated Reset (Lupa Kata Sandi)
        A1[1. Input Email Pegawai di Form Login Internal] --> A2[POST /api/auth/reset-password/request]
        A2 -->|Kirim OTP / Token ke Email Kedinasan| A3[2. Input Kode OTP & Kata Sandi Baru di Modal]
        A3 --> A4[POST /api/auth/reset-password/confirm]
        A4 -->|Verifikasi Sukses| A5[Kata Sandi Direset & User Bisa Login]
    end

    subgraph Flow B: Authenticated Password Change (Profil Popover)
        B1[1. Klik 'Ubah / Reset Kata Sandi' di Profile Popover] --> B2[Modal Ubah Kata Sandi Terbuka]
        B2 --> B3[Input: Sandi Lama + Sandi Baru + Konfirmasi]
        B3 --> B4[POST /api/auth/change-password]
        B4 -->|Validasi Sukses| B5[Kata Sandi Berhasil Diperbarui]
        B2 -.->|Jika Lupa Sandi Lama| A1
    end
```

---

## 2. Rincian Endpoint API

### 2.1 Request Kode OTP / Reset Token (Step 1 - Lupa Sandi)

Digunakan ketika pegawai internal lupa kata sandi dan meminta kode verifikasi ke email kedinasan.

- **Method**: `POST`
- **Path**: `/api/auth/reset-password/request`
- **Akses**: `Public`
- **Rate Limit Disarankan**: Max 3 request per 15 menit per email / IP
- **Content-Type**: `application/json`

#### Request Payload
```json
{
  "email": "pegawai@atrbpn.go.id"
}
```

#### Response Sukses (200 OK)
```json
{
  "success": true,
  "message": "Kode verifikasi reset kata sandi telah dikirim ke email Anda.",
  "data": {
    "email": "pegawai@atrbpn.go.id",
    "expiresIn": 300
  }
}
```

#### Skenario Error:
- **404 Not Found / 400 Bad Request** (Email bukan akun internal / tidak terdaftar):
```json
{
  "success": false,
  "message": "Email kedinasan tidak terdaftar sebagai akun internal."
}
```
- **429 Too Many Requests** (Rate limit terlampaui):
```json
{
  "success": false,
  "message": "Terlalu banyak permintaan reset kata sandi. Silakan tunggu beberapa saat lagi."
}
```

---

### 2.2 Konfirmasi Kode OTP & Set Kata Sandi Baru (Step 2 - Lupa Sandi)

Digunakan untuk memvalidasi token/OTP yang dikirimkan ke email dan mengupdate password pegawai internal.

- **Method**: `POST`
- **Path**: `/api/auth/reset-password/confirm`
- **Akses**: `Public`
- **Content-Type**: `application/json`

#### Request Payload
```json
{
  "email": "pegawai@atrbpn.go.id",
  "resetToken": "123456",
  "newPassword": "PasswordBaru@123",
  "confirmPassword": "PasswordBaru@123"
}
```

#### Response Sukses (200 OK)
```json
{
  "success": true,
  "message": "Kata sandi akun internal Anda telah berhasil direset.",
  "data": {
    "success": true,
    "message": "Kata sandi akun internal Anda telah berhasil direset."
  }
}
```

#### Skenario Error:
- **400 Bad Request / 401 Unauthorized** (Kode salah / token kedaluwarsa):
```json
{
  "success": false,
  "message": "Kode verifikasi salah atau telah kedaluwarsa."
}
```
- **422 Unprocessable Entity** (Validasi panjang sandi kurang dari 8 karakter / konfirmasi tidak cocok):
```json
{
  "success": false,
  "message": "Konfirmasi kata sandi tidak sesuai dengan kata sandi baru."
}
```

---

### 2.3 Ubah Kata Sandi (Authenticated Staff via Profile Popover)

Digunakan saat pegawai internal sudah login dan ingin mengganti kata sandinya dari aplikasi.

- **Method**: `POST`
- **Path**: `/api/auth/change-password`
- **Akses**: `Authenticated (Internal Role Only)`
- **Header**: `Authorization: Bearer <accessToken>` atau Cookie Session
- **Content-Type**: `application/json`

#### Request Payload
```json
{
  "currentPassword": "PasswordLama@123",
  "newPassword": "PasswordBaru@123",
  "confirmPassword": "PasswordBaru@123"
}
```

#### Response Sukses (200 OK)
```json
{
  "success": true,
  "message": "Kata sandi Anda berhasil diperbarui.",
  "data": {
    "success": true,
    "message": "Kata sandi Anda berhasil diperbarui."
  }
}
```

#### Skenario Error:
- **400 Bad Request** (Kata sandi lama tidak cocok):
```json
{
  "success": false,
  "message": "Kata sandi saat ini tidak sesuai."
}
```
- **401 Unauthorized** (Session habis / invalid token):
```json
{
  "success": false,
  "message": "Sesi Anda telah kedaluwarsa, silakan login kembali."
}
```
- **403 Forbidden** (Bukan role internal):
```json
{
  "success": false,
  "message": "Akses ditolak. Fitur ini khusus untuk pengguna internal."
}
```

---

## 3. Catatan Keamanan & Rekomendasi Teknis BE

1. **Format Token & Masa Berlaku (OTP/Token):**
   - Masa berlaku OTP/Token reset password direkomendasikan **5 menit (300 detik)**.
   - Format kode dapat berupa 6 digit angka numerik atau secure alphanumeric token.
   - Setiap kali kode berhasil digunakan atau kedaluwarsa, token harus di-invalidate (one-time use).

2. **Validasi Role Akun:**
   - Endpoint `/api/auth/reset-password/request` dan `/api/auth/reset-password/confirm` harus memastikan bahwa akun yang direset adalah akun dengan `role: "internal"`.

3. **Hashing Kata Sandi:**
   - Gunakan algoritma hashing standar industri (misal: Argon2id atau Bcrypt dengan salt rounds $\ge 10$).

4. **Invalidasi Sesi Aktif (Optional Best Practice):**
   - Ketika kata sandi berhasil diubah atau direset, pertimbangkan untuk mencabut (revoke) semua refresh token atau active session lama dari user tersebut demi keamanan.
