---
trigger: model_decision
---

# No Silent Fallback & Explicit Error Feedback Rule

## Larangan Fallback Diam-diam (Mutlak)

1. **DILARANG MENGGUNAKAN DUMMY / SILENT FALLBACK**:
   - Dilarang membuat fallback data dummy secara otomatis saat request API atau query ke backend/GeoServer mengalami kegagalan, kecuali jika user secara eksplisit memerintahkannya.
   - Dilarang melakukan normalisasi ambigu atau manipulasi URL tanpa kontrak yang jelas dari backend.

2. **FEEDBACK ERROR WAJIB EKSPLISIT & JELAS**:
   - Jika request API gagal (misal: data IGT layer, GeoServer SLD, metadata wilayah, dll.), throw error secara langsung agar ditangkap oleh UI layer atau React Query.
   - Tampilkan toast error atau komponen `RetryState` dengan judul dan deskripsi pesan error yang jelas bagi pengembang maupun pengguna.

3. **SIMBOLOGI & SLD GEOSERVER**:
   - Jika pengambilan aturan SLD / GetLegendGraphic dari GeoServer gagal atau mengembalikan response kosong, render state retry (`RetryState`) dengan tombol coba lagi (`onRetry`), bukan merender dummy/fallback swatch sintetis.
