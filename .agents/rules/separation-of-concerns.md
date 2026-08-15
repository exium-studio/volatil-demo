# Architecture, Modularity & Separation of Concerns Rules

Dokumen ini mendefinisikan aturan mutlak pemisahan tanggung jawab (Separation of Concerns), modularitas, dan skalabilitas kode pada codebase **ATR-BPN Volatil Frontend**.

---

## 1. Directory & Layering Hierarchy

Setiap feature di bawah `src/features/<feature-name>/` **wajib** mengikuti struktur layering berikut:

```
src/features/<feature-name>/
├── api/               # Murni Network I/O (fetch / axios / Geoserver WFS/WMS)
├── services/          # Business logic, orchestration, data transformations, session
├── hooks/             # React Query hooks, UI lifecycle hooks
├── components/        # Presentational & Feature-specific UI components
├── types/             # Type definitions lokal spesifik feature
└── utils/             # Helper fungsi murni (pure functions) lokal feature
```

---

## 2. API vs Service vs Utils (Pemisahan Tanggung Jawab)

| Layer | Lokasi & Penamaan | Tanggung Jawab Utama | Boleh Melakukan | DILARANG Melakukan |
| :--- | :--- | :--- | :--- | :--- |
| **API Layer** | `api/*.api.ts` | **Murni Network I/O** | - Memanggil `fetchApi`, WFS/WMS request, raw endpoint<br>- Parsing HTTP params/headers/body | - Menyimpan token/state ke localStorage<br>- Melakukan fallback mock/business logic<br>- React hooks/UI coupling |
| **Service Layer** | `services/*.service.ts` | **Business Logic & Orchestration** | - Mengonsumsi API layer<br>- Data formatting, mapping, validasi bisnis<br>- Handle session (token/user storage), fallback mock logic<br>- Ekstraksi DTO response ke Domain Model | - Render JSX / React state / Hooks<br>- Memanggil fetch langsung tanpa lewat API layer |
| **Utils Layer** | `utils/*.ts` | **Pure Helpers / Computations** | - Komputasi murni tanpa side-effect (e.g. centroid geometry, string formatter, bounds calculator)<br>- Reusable lintas feature jika diletakkan di `src/shared/utils/` | - Melakukan network request (I/O)<br>- Mengakses stateful / mutable business services |

### Rule Penting:
1. **API files** wajib berakhiran `.api.ts`.
2. **Service files** wajib berakhiran `.service.ts`.
3. **Komponen / Hooks TIDAK BOLEH memanggil `*.api.ts` secara langsung**, wajib melalui `*.service.ts` atau query hook yang mengonsumsi service.

---

## 3. Shared Mitra & Feature Modularity

1. **Shared Mitra Components & Hooks**:
   - Jika suatu komponen/hook digunakan bersama oleh lebih dari 1 sub-fitur mitra (contoh: `wfs-data-list`, shared modal, filter layout yang dipakai bersama di `data-request` dan `cart`), letakkan di **`src/features/mitra/shared/`**.
   - Dilarang menduplikasi kode yang sama persis antar fitur.
2. **Design System Boundaries**:
   - Komponen design system (`src/design-system/`) **DILARANG mengimpor dari `src/features/`** apa pun.
   - Jika design system butuh data/konteks (misal user session), gunakan helper dari `src/shared/utils/` atau context/props injection.

---

## 4. UI Trigger & Overlay Patterns

1. **Gunakan `Modal.Trigger` / Overlay Triggers**:
   - Komponen input yang membuka overlay/modal (seperti `FocusSelectInput`, date picker modal, confirmation modal) **wajib** membungkus trigger dengan `<Modal.Trigger asChild>`.
   - Hal ini memastikan koordinat klik pengguna (`onPointerDown`) terekam sehingga animasi pembukaan meluncur akurat dari titik asal klik (*click origin*).
2. **Controlled vs Uncontrolled Modularity**:
   - Komponen input interaktif wajib mendukung kedua mode:
     - **Controlled**: Mendengarkan prop `value` dan memanggil `onValueChange`.
     - **Uncontrolled**: Mengelola state internal mandiri dengan nilai awal dari `defaultValue`.
   - Sediakan opsi **custom trigger** (via prop `trigger` atau `children` sebagai ReactNode atau render function) agar fleksibel bagi consumer.

---

## 5. Map & GIS Modularity (MapLibre + GeoServer)

1. **Single Source of Truth untuk Layer Management**:
   - Semua penambahan layer Geoserver/WFS dikelola terpusat melalui config array di `useMapLayers`.
   - Hindari membuat hook dedicated per-layer yang berjalan di luar siklus `useMapLayers`.
2. **Highlight & Camera Actions**:
   - Fitur inspeksi spasial (seperti *"Lihat di Peta"*) harus memisahkan logic penambahan layer sementara dan animasi kamera ke dalam helper mandiri (`highlight-feature-on-map.ts`).
   - Gunakan `fitBounds` untuk `Polygon`/`MultiPolygon` dan `flyTo` untuk `Point`, dengan auto-cleanup timer.

---

## 6. Design System & Motion Standards (Prinsip Preservasi)

1. **Jaga Nilai Tuning Presisi Design System**:
   - Nilai token keyframe, kurva cubic-bezier, dan tuning durasi animasi di `chakra-system.ts` yang sudah disetel user bersifat **sakral/ground truth**.
   - DILARANG mengubah-ubah kurva fisika (`cubic-bezier`), persentase keyframes, atau timing animasi di design system inti kecuali secara eksplisit diminta spesifikasi angka barunya oleh user.
2. **Karakter Animasi Volatil**:
   - `scale-up-overshoot`: `0% scale(0.85)` -> `50% scale(1.015)` -> `100% scale(1)` dengan timing `cubic-bezier(0.4, 0, 0.2, 1)`.
   - `scale-up-overshoot-from-click-origin`: Memanfaatkan CSS variable `--dialog-offset-x/y` dari `Modal.Trigger`.

---

## 7. Zero-Violation Quality Gates

Setiap perubahan wajib memenuhi standar berikut sebelum dianggap selesai:
- `pnpm verify` (`eslint` & `tsc`) wajib **0 Error dan 0 Warning**.
- Header file path sinkron via `pnpm filepath:generate`.
- Jangan menyentuh/mengubah file di luar scope instruksi yang diberikan.

