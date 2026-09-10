# API Docs Rule

## Wajib Update `docs/api/api-docs.md`

Setiap kali agent mengerjakan task yang berhubungan dengan:

- Request/response ke backend (endpoint baru, perubahan payload, perubahan response shape)
- Perubahan autentikasi atau mekanisme koneksi (SSE, WebSocket, dll.)
- Penambahan/penghapusan field pada type yang menjadi contract antara FE dan BE
- Perubahan query params, path params, atau header yang dikirim ke BE

Maka agent **WAJIB** memperbarui `docs/api/api-docs.md` sebagai bagian dari task yang sama, **bukan sebagai task terpisah**.

## Aturan Penulisan Docs

- Semua type dalam docs harus **hardcoded** — tidak boleh hanya menyebut nama namespace/type (contoh: `CartOrderItem[]` dilarang, harus inline field-by-field)
- Payload dan response harus lengkap dengan semua field beserta tipenya
- Jika ada mekanisme auth non-standar (misal query param token untuk SSE), dokumentasikan secara eksplisit
