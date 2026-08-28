# Volatil Frontend - API & Schema Documentation

Dokumentasi endpoint API, Data Transfer Object (DTO), request/response payload, serta model interoperabilitas data spasial di Volatil.

---

## Daftar Isi

### A. Shared Services (Publik / Lintas Role)

1. [Auth & Session](#1-auth--session)
2. [Pusat Bantuan (Help Center)](#2-pusat-bantuan-help-center)
3. [Notifikasi & Inbox](#3-notifikasi--inbox)

### B. Role: Mitra

4. [Mitra - Data Request & IGT Spasial](#4-mitra---data-request--igt-spasial)
5. [Mitra - Keranjang & Order Provisioning Spasial](#5-mitra---keranjang--order-provisioning-spasial)
6. [GeoServer Proxy Endpoints](#6-geoserver-proxy-endpoints)
7. [Mitra - My Data & Transaksi](#7-mitra---my-data--transaksi)
8. [Mitra - Dashboard & Statistik](#8-mitra---dashboard--statistik)

### C. Role: Internal (Admin / Verifikator)

9. [Internal - Master IGT Layers & Data Management](#9-internal---master-igt-layers--data-management)
10. [Internal - Tarif & Pricing Management](#10-internal---tarif--pricing-management)
11. [Internal - User Management](#11-internal---user-management)
12. [Internal - Dashboard & Statistik Sistem](#12-internal---dashboard--statistik-sistem)

---

# A. Shared Services (Publik / Lintas Role)

## 1. Auth & Session

### 1.1 Sign In

- **Endpoint**: `POST /api/auth/sign-in`
- **Payload**:

```typescript
type SignInPayload = {
  email: string;
  password: string;
};
```

- **Response**:

```typescript
type SignInResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "mitra" | "internal";
    organizationName?: string;
  };
};
```

### 1.2 User Profile & Logout

- **Get Profile**: `GET /api/auth/me`
- **Logout**: `POST /api/auth/logout`

---

## 2. Pusat Bantuan (Help Center)

Modul penanganan tiket kendala, integrasi transaksi terkait, lampiran berkas, dan balasan laporan (dapat diakses oleh Mitra untuk membuat/melihat tiket miliknya, dan Internal untuk mengelola/menjawab tiket).

### 2.1 Get List Tiket

- **Endpoint**: `GET /api/tickets`
- **Params**:
  - `scope?: "all" | "my"`
  - `status?: "active" | "history" | "submitted" | "in_review" | "in_progress" | "resolved" | "rejected"`
  - `search?: string`
  - `page?: number`
  - `limit?: number`
- **Response**:

```typescript
type HelpCenterListApiResponse = {
  success: boolean;
  data: Array<{
    id: number;
    userId?: number;
    title: string;
    description: string;
    status: "submitted" | "in_review" | "in_progress" | "resolved" | "rejected";
    priority?: "low" | "medium" | "high" | "urgent";
    transactionId?: string;
    attachmentsCount?: number;
    repliesCount?: number;
    createdAt: string;
    updatedAt: string;
    user?: {
      id: number;
      name: string;
      email: string;
      role: "mitra" | "internal";
    };
  }>;
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};
```

### 2.2 Create Tiket Laporan

- **Endpoint**: `POST /api/tickets`
- **Content-Type**: `multipart/form-data`
- **Form Data Fields**:
  - `title` _(string, required)_: Judul laporan
  - `description` _(string, required)_: Rincian kendala
  - `transactionId` _(string, optional)_: ID transaksi terkait
  - `priority` _(string, optional)_: `low` | `medium` | `high` | `urgent`
  - `category` _(string, optional)_: Kategori kendala
  - `files` _(binary array, optional)_: Berkas lampiran foto, dokumen, atau video

### 2.3 Detail Tiket & Balasan

- **Get Detail**: `GET /api/tickets/{id}`
- **Reply Ticket**: `POST /api/tickets/{id}/reply` (`multipart/form-data`)
  - `message` _(string, required)_
  - `status` _(string, optional)_
  - `files` _(binary array, optional)_
- **Resolve / Reject Ticket (Internal Admin)**: `POST /api/tickets/{id}/resolve` / `POST /api/tickets/{id}/reject`
  - `reason` _(string, required)_: Catatan / alasan keputusan penyelesaian atau penolakan laporan

---

## 3. Notifikasi & Inbox

Modul pesan inbox resmi dan sinkronisasi riwayat notifikasi sistem.

### 3.1 List Inbox Pesan

- **Endpoint**: `GET /api/inbox`
- **Params**: `page?: number`, `pageSize?: number`, `category?: "transaksi" | "sistem" | "bantuan" | "akun"`, `isRead?: boolean`, `search?: string`
- **Response**:

```typescript
type InboxListResponse = {
  items: Array<{
    id: string;
    title: string;
    message: string;
    category: "transaksi" | "sistem" | "bantuan" | "akun";
    isRead: boolean;
    actionUrl?: string;
    createdAt: string;
  }>;
  total: number;
  unreadCount: number;
  page?: number;
  pageSize?: number;
};
```

### 3.2 Tandai Inbox Telah Dibaca

- **Endpoint**: `PATCH /api/inbox/{id}/read`
- **Response**: `200 OK` / `void`

### 3.3 Tandai Semua Inbox Telah Dibaca

- **Endpoint**: `PATCH /api/inbox/read-all`
- **Response**: `200 OK` / `void`

### 3.4 Hapus Pesan Inbox

- **Endpoint**: `DELETE /api/inbox/{id}`
- **Response**: `200 OK` / `void`

### 3.5 Bersihkan Semua Pesan Inbox

- **Endpoint**: `DELETE /api/inbox/clear-all`
- **Response**: `200 OK` / `void`

---

# B. Role: Mitra

## 4. Mitra - Data Request & IGT Spasial

Modul eksplorasi layer IGT aktif, filter spasial wilayah administrasi, serta query feature via WFS/AOI untuk pengajuan data mitra.

### 4.1 List IGT Layers (Public / Active Layers)

Dedicated endpoint bagi Mitra untuk mengambil daftar layer IGT yang berstatus aktif/publik. Digunakan untuk rendering layer WMS di peta dan pemilihan layer pada form permohonan data (WFS).

- **Endpoint**: `GET /api/mitra/igt-layers`
- **Params**:
  - `page?: number`
  - `limit?: number`
  - `search?: string`
  - `basis?: "bidang" | "kawasan"`
  - `tema?: string`
  - `provinsi?: string`
  - `kabupaten?: string`
  - `kecamatan?: string`
  - `kelurahan?: string`
- **Response**:

```typescript
type MitraIgtLayersResponse = {
  items: Array<{
    id: string;
    title: string;
    spatialBasis: "bidang" | "kawasan";
    bbox: [number, number, number, number]; // [minX, minY, maxX, maxY] EPSG:4326
    visible?: boolean;
    zIndex?: number; // Layer stacking order index (1 = bawah, 2 = tengah, 3 = atas)
    wfs: {
      wfsUrl: string;
      wfsTypeName: string;
    };
    wms: {
      wmsUrl: string;
      layers: string;
    };
  }>;
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
};
```

### 4.2 Query IGT by AOI (Polygon / Upload SHP/GeoJSON)

- **By AOI Polygon**: `POST /api/mitra/data-request/by-aoi`
  - **Payload**: GeoJSON Polygon (`{ geometry: GeoJSON.Polygon }`)
- **By Uploaded File**: `POST /api/mitra/data-request/upload-aoi`
  - **Payload**: `FormData` (`file: File`) (.zip shp, .geojson, .kml)
- **Get Catalog**: `GET /api/mitra/data-request/catalog`
  - **Params**: `page?: number`, `pageSize?: number`, `search?: string`

### 4.3 Filter Options Wilayah & Tema

- `GET /api/mitra/data-request/filter-options/basis`
- `GET /api/mitra/data-request/filter-options/tema`
- `GET /api/igt/filter-options/kecamatan?kabupatenId={id}`
- `GET /api/igt/filter-options/kelurahan?kecamatanId={id}`

---

## 5. Mitra - Keranjang & Order Batch Provisioning Spasial

Modul transaksi data IGT berbasis **Batch Interop Spasial**. Setelah mitra memasukkan layer ke keranjang, sistem membentuk 1 batch transaksi dan mengeksekusi pemotongan/penyiapan data via **INTEROP Engine** di background. Setelah data layer WFS/WMS siap (`ready`), berlaku masa tenggang **TTL 24 Jam** (`expiredAt`) bagi mitra untuk melakukan checkout/pembayaran.

### 5.1 Add to Cart (Buat Batch Keranjang)

- **Endpoint**: `POST /api/mitra/cart/batches`
- **Payload**:

```typescript
type AddToCartBatchRequest = {
  items: Array<{
    sourceLayerId: string;
    selectionType: "catalog" | "upload_aoi" | "draw_aoi";
    administrativeFilter?: {
      kodeProvinsi?: string;
      kodeKabupaten?: string;
      kodeKecamatan?: string;
      kodeDesa?: string;
    };
    aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
    cqlFilter?: string;
    selectedFeatureIds?: string[];
  }>;
};
```

- **Response**:

```typescript
type AddToCartBatchResponse = {
  batchId: string;
  status: "preparing";
  estimatedTotalPrice: number;
  createdAt: string;
};
```

### 5.1.1 Interop Engine — Provisioning Flow (Internal)

#### Trigger

Setelah `POST /api/mitra/cart/batches` berhasil (`200 OK`), Backend langsung memicu (spawn) asynchronous background job via **Interop Engine**.

#### Flow per Batch:

1. **Batch Item Handling**: 1 batch memuat $N$ layer IGT yang dipilih oleh Mitra.
2. **PostGIS Isolated Table Creation**: Interop Engine membuat **1 tabel PostGIS baru per layer IGT per mitra** dengan format penamaan:
   ```text
   igt_provisioned_{mitraId}_{sourceLayerId}_{batchId}
   ```
3. **Struktur Data Tabel Provisioned**:
   - Kolom `geometry`: Hasil pemotongan spasial (`ST_Intersection` / `ST_Clip`) dari master layer IGT sesuai dengan AOI poligon atau kriteria filter administratif mitra.
   - Kolom `feature_id`: Foreign reference ke feature master IGT (untuk kebutuhan audit trail dan referensi data).
   - **Perlindungan Atribut Sensitif**: Kolom atribut IGT yang bernilai komersial/sensitif **tidak disimpan secara langsung** pada tabel ini. Atribut disimpan pada tabel terpisah:
     ```text
     igt_attributes_{mitraId}_{sourceLayerId}_{batchId}
     ```
4. **Kebijakan Akses Tabel Atribut (`igt_attributes_*`)**:
   - Hanya dapat diakses setelah status batch bertransisi menjadi `ready`.
   - Mitra telah menyelesaikan proses checkout dan status transaksi pembayaran telah lunas (`settled`).
   - Akses dibatasi secara ketat melalui layer GeoServer provisioned yang terisolasi khusus untuk mitra yang bersangkutan.
5. **GeoServer Layer Auto-Publishing**: GeoServer mem-publish layer baru secara otomatis dari tabel provisioned tersebut (1 layer per tabel PostGIS).
6. **Finalisasi Batch & TTL Countdown**:
   - Setelah seluruh layer di dalam batch berhasil di-provision, status batch di-update menjadi `ready`.
   - Timestamp `readyAt` dicatat, dan masa tenggang TTL 24 jam mulai berjalan:
     ```text
     expiredAt = readyAt + 24 Jam
     ```

> [!IMPORTANT]
> **Security & Data Isolation Rule**:
> Tabel provisioned bersifat **per-mitra, strictly isolated** — tidak ada data sharing antar mitra meskipun membeli layer atau wilayah IGT yang identik. Hal ini menjamin integritas _data attribution_, audit trail transaksi, serta perlindungan hak akses per mitra.

---

### 5.2 Ambil Daftar Batch di Keranjang

- **Endpoint**: `GET /api/mitra/cart/batches`
- **Response**:

```typescript
type CartBatchListResponse = {
  batches: Array<{
    batchId: string;
    status: "preparing" | "ready" | "expired";
    createdAt: string;
    readyAt?: string;
    expiredAt?: string; // Datetime ISO (TTL 24 jam setelah status 'ready' untuk hitung mundur countdown)
    totalPrice?: number; // Bernilai undefined/null jika status masih 'preparing' (belum selesai dihitung Interop Engine)
    items: Array<{
      id: string;
      sourceLayerId: string;
      sourceLayerTitle: string;
      spatialBasis: "bidang" | "kawasan";
      selectionType: "catalog" | "upload_aoi" | "draw_aoi";
      featuresCount: number;
      areaHa?: number;
      unitPrice: number;
      subtotalPrice: number;
      wfsUrl?: string;
      wmsUrl?: string;
    }>;
  }>;
  total: number;
};
```

### 5.3 Ambil Detail Batch di Keranjang

- **Endpoint**: `GET /api/mitra/cart/batches/{batchId}`
- **Response**:

```typescript
type CartBatchDetailResponse = {
  batchId: string;
  status: "preparing" | "ready" | "expired";
  createdAt: string;
  readyAt?: string;
  expiredAt?: string;
  totalPrice?: number; // Total tagihan batch (tersedia saat status 'ready'). Jika 'preparing', bernilai null/0/menunggu.
  items: Array<{
    id: string;
    sourceLayerId: string;
    sourceLayerTitle: string;
    spatialBasis: "bidang" | "kawasan";
    selectionType: "catalog" | "upload_aoi" | "draw_aoi";
    featuresCount: number;
    areaHa?: number;
    unitPrice: number;
    subtotalPrice: number;
    wfsUrl?: string;
    wmsUrl?: string;
  }>;
};
```

> [!NOTE]
> **Skema Perhitungan Tarif (Pricing)**:
>
> - Penentuan tarif (`unitPrice`) diambil dari **Master Data Tarif PNBP** yang dikelola melalui modul [Internal - Tarif & Pricing Management](#9-internal---tarif--pricing-management).
> - Selama status batch masih `preparing`, nilai total harga dan tarif akhir belum selesai dikalkulasi secara final oleh Interop Engine dan UI akan menampilkan indikasi _"Menunggu penyiapan data..."_.

### 5.4 Kosongkan / Hapus Batch dari Keranjang

- **Endpoint**: `DELETE /api/mitra/cart/batches/{batchId}`
- **Response**: `200 OK` / `{ success: true, message: "Batch keranjang berhasil dihapus" }`

### 5.5 Pembayaran Batch (1 Batch = 1 Transaksi & Request Kode Billing)

- **Endpoint**: `POST /api/mitra/cart/batches/{batchId}/checkout`
- **Payload**: `{}` (Empty JSON / Opsional)
- **Response**:

```typescript
type CheckoutBatchResponse = {
  orderId: string;
  transactionNumber: string;
  orderNumber: string;
  billingCode: string;
  totalAmount: number;
  status: "pending";
  createdAt: string;
  billingExpiredAt: string;
};
```

### 5.6 Cek Status Pembayaran Order (Manual / Trigger)

- **Endpoint**: `GET /api/mitra/orders/{orderId}/status`
- **Response**:

```typescript
type OrderPaymentStatusResponse = {
  orderId: string;
  transactionStatus: "pending" | "settled" | "expired" | "failed";
  paidAt?: string;
};
```

---

## 6. GeoServer Proxy Endpoints

Backend wajib menyediakan endpoint proxy untuk seluruh akses GeoServer dari Frontend. Frontend **dilarang keras** melakukan request langsung ke URL GeoServer production.

### 6.1 WMS Proxy

- **Endpoint**: `GET /api/proxy/wms`
- **Query Params**:
  - Standar WMS: `SERVICE`, `REQUEST`, `LAYERS`, `BBOX`, `WIDTH`, `HEIGHT`, `FORMAT`, `SRS` / `CRS`, `TRANSPARENT`, `STYLES`, `VERSION`, dll.
  - Tambahan (Opsional): `layerId` (untuk validasi hak akses per layer).
- **Backend Behavior**:
  1. Validasi auth session / JWT Mitra.
  2. Validasi apakah Mitra memiliki hak akses aktif (`status = settled` dan belum `expired`) ke layer yang diminta.
  3. Forward request ke GeoServer internal menggunakan GeoServer credential milik Backend.
  4. Stream response binary gambar (`image/png`, `image/jpeg`) langsung ke Frontend.
- **Response**: Raw image tile stream dari GeoServer.

### 6.2 WFS Proxy

- **Endpoint**: `GET /api/proxy/wfs`
- **Query Params**:
  - Standar WFS: `SERVICE`, `REQUEST`, `TYPENAMES` / `TYPENAME`, `CQL_FILTER`, `SRSNAME`, `OUTPUTFORMAT`, `MAXFEATURES`, `RESULTTYPE`, `VERSION`, dll.
  - Tambahan (Opsional): `layerId`.
- **Backend Behavior**:
  1. Validasi auth session / JWT Mitra.
  2. Validasi hak akses data spasial Mitra.
  3. Mengarahkan / meng-override `TYPENAMES` ke nama layer tabel PostGIS hasil provisioning milik mitra (`igt_provisioned_{mitraId}_{sourceLayerId}_{batchId}`) bukan master layer global.
  4. Forward request ke GeoServer internal.
  5. Stream GeoJSON response (`application/json`) ke Frontend.
- **Response**: `GeoJSON.FeatureCollection`

### 6.3 Security Rules (Wajib Implementasi Backend)

1. **Zero Credential Exposure**: Kredensial GeoServer (Basic Auth / Master Token) **tidak boleh pernah dikirimkan ke Frontend** dalam format apapun.
2. **Session Verification**: Backend wajib memvalidasi token JWT / session pengguna sebelum meneruskan (_forward_) request ke GeoServer.
3. **Prevent Horizontal Access**: Backend memvalidasi bahwa `TYPENAMES` / `LAYERS` yang diminta adalah layer milik mitra yang sedang login. Mitra A tidak boleh dapat mengakses layer hasil provisioning Mitra B.
4. **Rate Limiting**: Penerapan rate limit per user session / IP address untuk menjaga stabilitas GeoServer.
5. **Audit Logging**: Mencatat log akses WFS/WMS setiap kali request dieksekusi (parameter: `mitraId`, `layerId`, `timestamp`, `params`, `ipAddress`).

---

## 7. Mitra - My Data & Riwayat Transaksi

### 7.1 My Data (Layer Aktif Mitra)

- **Endpoint**: `GET /api/mitra/my-data`
- **Response**: Daftar layer aktif hasil provisioning yang telah lunas (`settled`) beserta URL WFS/WMS proxy dan tanggal kadaluwarsa akses.

### 7.2 Riwayat Transaksi Mitra

- **Endpoint**: `GET /api/mitra/transaction-history`
- **Params**: `page?: number`, `pageSize?: number`, `search?: string`, `status?: "pending" | "settled" | "expired" | "failed"`
- **Response**:

```typescript
type TransactionHistoryResponse = {
  items: Array<{
    id: string;
    transactionNumber: string;
    orderNumber: string;
    billingCode: string;
    paymentMethod: string;
    transactionStatus: "pending" | "settled" | "expired" | "failed";
    totalAmount: number;
    createdAt: string;
    paidAt?: string;
    expiredAt?: string;
    items: Array<{
      id: string;
      sourceLayerId: string;
      sourceLayerTitle: string;
      spatialBasis: "bidang" | "kawasan";
      selectionType: "catalog" | "upload_aoi" | "draw_aoi";
      snapshotFeaturesCount: number;
      snapshotAreaHa?: number;
      unitPrice: number;
      subtotalPrice: number;
      provisionStatus:
        | "queued"
        | "provisioning"
        | "ready"
        | "failed"
        | "expired"
        | "revoked";
      proxyWfsUrl?: string;
      proxyWmsUrl?: string;
    }>;
  }>;
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};
```

---

### 7.3 Kamus Log Denum (Enumerations)

Berikut adalah ringkasan seluruh enum/konstanta yang digunakan di modul transaksi, keranjang, dan order:

```typescript
// 1. Basis Spasial Data IGT
export type SpatialBasisType = "bidang" | "kawasan";

// 2. Tipe Seleksi Area Pemotongan Data
export type SelectionType = "catalog" | "upload_aoi" | "draw_aoi";

// 3. Status Batch Aktif Keranjang (Interop Engine Provisioning)
export type CartBatchStatus = "preparing" | "ready" | "expired";

// 4. Status Transaksi / Invoice Pembayaran
export type TransactionStatus = "pending" | "settled" | "expired" | "failed";

// 5. Metode Kanal Pembayaran PNBP ATR/BPN
export type PaymentMethod =
  | "MPN_GEN2"
  | "VA_MANDIRI"
  | "VA_BRI"
  | "VA_BCA"
  | "QRIS";

// 6. Status Teknis Provisioning Layer di GeoServer / PostGIS
export type OrderProvisionStatus =
  | "queued"
  | "provisioning"
  | "ready"
  | "failed"
  | "expired"
  | "revoked";

// 7. Status Tiket Bantuan / Pengaduan Kendala
export type HelpCenterStatus =
  | "submitted"
  | "in_review"
  | "in_progress"
  | "resolved"
  | "rejected";
```

---

## 8. Mitra - Dashboard & Statistik

### 8.1 Mitra Home Summary

- **Endpoint**: `GET /api/mitra/home?period={1d|1w|1m|1y|all}`
- **Response**:
  - `dataSummary`: Breakdown bidang vs kawasan (active, almostExpired, expired).
  - `financialFlow`: Riwayat nominal belanja data spasial per periode.
  - `cartSummary`: Total item aktif di keranjang saat ini.

---

# C. Role: Internal (Admin / Verifikator)

## 9. Internal - Master IGT Layers & Data Management

Modul master pengelolaan konfigurasi layer IGT spasial (GeoServer WMS/WFS, metadata spasial, spatial basis bidang/kawasan, dan status publikasi layer).

### 9.1 List Master IGT Layers

- **Endpoint**: `GET /api/internal/igt-layers`
- **Params**:
  - `page?: number`
  - `limit?: number`
  - `search?: string`
  - `isActive?: boolean`
  - `basis?: "bidang" | "kawasan"`
- **Response**:

```typescript
type MasterIgtLayersResponse = {
  items: Array<{
    id: string;
    title: string;
    description?: string;
    spatialBasis: "bidang" | "kawasan";
    bbox: [number, number, number, number]; // [minX, minY, maxX, maxY] EPSG:4326
    isActive: boolean;
    zIndex?: number; // Layer stacking order index (1 = bawah, 2 = tengah, 3 = atas)
    wfs: {
      wfsUrl: string;
      wfsTypeName: string;
    };
    wms: {
      wmsUrl: string;
      layers: string;
    };
    createdAt: string;
    updatedAt: string;
  }>;
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
};
```

### 9.2 Create Master IGT Layer

- **Endpoint**: `POST /api/internal/igt-layers`
- **Payload**:

```typescript
type CreateMasterIgtLayerPayload = {
  id: string;
  title: string;
  description?: string;
  spatialBasis: "bidang" | "kawasan";
  bbox: [number, number, number, number];
  isActive: boolean;
  zIndex?: number;
  wfs: {
    wfsUrl: string;
    wfsTypeName: string;
  };
  wms: {
    wmsUrl: string;
    layers: string;
  };
};
```

### 9.3 Update Master IGT Layer

- **Endpoint**: `PUT /api/internal/igt-layers/{id}`
- **Payload**: `Partial<CreateMasterIgtLayerPayload>`

### 9.4 Delete Master IGT Layer

- **Endpoint**: `DELETE /api/internal/igt-layers/{id}`
- **Response**: `200 OK` / `{ success: true }`

---

## 10. Internal - Tarif & Pricing Management

Modul pengelolaan tarif PNBP layer IGT (tarif per bidang objek spasial, tarif per hektar kawasan, serta formula perhitungan PNBP ATR/BPN). Nilai tarif di modul ini digunakan oleh Interop Engine saat kalkulasi total harga batch di keranjang mitra.

### 10.1 List Master Tarif

- **Endpoint**: `GET /api/internal/pricing`
- **Response**:

```typescript
type PricingListResponse = {
  items: Array<{
    id: string;
    layerId?: string; // Optional: spesifik untuk layer tertentu atau default global
    spatialBasis: "bidang" | "kawasan";
    unitPrice: number; // Harga per bidang / per hektar (IDR)
    unitLabel: string; // "per bidang" | "per hektar"
    effectiveDate: string;
    isActive: boolean;
  }>;
};
```

### 10.2 Update / Set Tarif Layer

- **Endpoint**: `PUT /api/internal/pricing/{id}`
- **Payload**:

```typescript
type UpdatePricingPayload = {
  unitPrice: number;
  isActive: boolean;
};
```

---

## 11. Internal - User Management

### 11.1 List Users

- **Endpoint**: `GET /api/internal/users`
- **Params**: `page?: number`, `limit?: number`, `role?: string`, `search?: string`

### 11.2 User Detail

- **Endpoint**: `GET /api/internal/users/{id}`

### 11.3 Update Status / Role User

- **Endpoint**: `PUT /api/internal/users/{id}`

---

## 12. Internal - Dashboard & Statistik Sistem

### 12.1 Internal Dashboard Overview

- **Endpoint**: `GET /api/internal/home/summary?period={1d|1w|1m|1y|all}`
- **Response**: Statistik pengguna aktif, permohonan data masuk, volume transaksi, dan utilisasi resource server.
