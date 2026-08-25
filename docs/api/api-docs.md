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
6. [Mitra - My Data & Transaksi](#6-mitra---my-data--transaksi)
7. [Mitra - Dashboard & Statistik](#7-mitra---dashboard--statistik)

### C. Role: Internal (Admin / Verifikator)

8. [Internal - User Management](#8-internal---user-management)
9. [Internal - Dashboard & Statistik Sistem](#9-internal---dashboard--statistik-sistem)

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
    orderNumber?: string;
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

### 2.2 Create Tiket Laporan (dengan Transaksi Terkait)

- **Endpoint**: `POST /api/tickets`
- **Content-Type**: `multipart/form-data`
- **Form Data Fields**:
  - `title` _(string, required)_: Judul laporan
  - `description` _(string, required)_: Rincian kendala
  - `transactionId` _(string, optional)_: UUID transaksi/order terkait
  - `orderNumber` _(string, optional)_: Nomor order terkait (contoh: `ORD-2026-00192`)
  - `priority` _(string, optional)_: `low` | `medium` | `high` | `urgent`
  - `category` _(string, optional)_: Kategori isu
  - `files` _(binary array, optional)_: Berkas lampiran gambar, dokumen, atau video

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

Modul eksplorasi katalog IGT, filter spasial wilayah administrasi, serta query feature via WFS/AOI untuk pengajuan data mitra.

### 4.1 Katalog IGT

- **Endpoint**: `GET /api/igt/catalog`
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
type IgtCatalogResponse = {
  items: Array<{
    id: string;
    title: string;
    spatialBasis: "bidang" | "kawasan";
    bbox: [number, number, number, number]; // [minX, minY, maxX, maxY] EPSG:4326
    visible: boolean;
    wfs?: {
      wfsUrl: string;
      wfsTypeName: string;
    };
    wms?: {
      wmsUrl: string;
      layers: string;
    };
  }>;
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
};
```

### 4.2 Query IGT by AOI (Polygon / Upload SHP/GeoJSON)

- **By AOI Polygon**: `POST /api/igt/by-aoi`
  - **Payload**: GeoJSON Polygon (`geometry: GeoJSON.Polygon`)
- **By Uploaded File**: `POST /api/igt/by-uploaded-aoi`
  - **Payload**: `FormData` (`file: File`) (.zip shp, .geojson, .kml)

### 4.3 Filter Options Wilayah Administrasi

- `GET /api/igt/filter-options/provinsi`
- `GET /api/igt/filter-options/kabupaten?provinsiId={id}`
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
    selectionType:
      | "administrative_filter"
      | "aoi_polygon"
      | "selected_features"
      | "whole_layer";
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

### 5.2 Ambil Batch Aktif di Keranjang

- **Endpoint**: `GET /api/mitra/cart/active-batch`
- **Response**:

```typescript
type ActiveCartBatchResponse = {
  batchId: string;
  status: "preparing" | "ready" | "expired";
  createdAt: string;
  readyAt?: string;
  expiredAt?: string; // Datetime ISO (TTL 24 jam setelah status 'ready' untuk hitung mundur countdown)
  totalPrice: number;
  items: Array<{
    id: string;
    sourceLayerId: string;
    sourceLayerTitle: string;
    spatialBasis: "bidang" | "kawasan";
    selectionType:
      | "administrative_filter"
      | "aoi_polygon"
      | "selected_features"
      | "whole_layer";
    featuresCount: number;
    areaHa?: number;
    unitPrice: number;
    subtotalPrice: number;
    wfsUrl?: string;
    wmsUrl?: string;
  }>;
};
```

### 5.3 Hapus Batch dari Keranjang (Cancel / Clear)

- **Endpoint**: `DELETE /api/mitra/cart/batches/{batchId}`
- **Response**: `200 OK` / `{ success: true, message: "Batch keranjang berhasil dibatalkan" }`

### 5.4 Checkout Batch (Request Kode Billing)

- **Endpoint**: `POST /api/mitra/cart/batches/{batchId}/checkout`
- **Payload**:

```typescript
type CheckoutBatchRequest = {
  paymentMethod: "MPN_GEN2" | "VA_MANDIRI" | "VA_BRI" | "VA_BCA" | "QRIS";
};
```

- **Response**:

```typescript
type CheckoutBatchResponse = {
  orderId: string;
  transactionNumber: string;
  orderNumber: string;
  billingCode: string;
  paymentMethod: string;
  totalAmount: number;
  status: "pending";
  createdAt: string;
  billingExpiredAt: string;
};
```

### 5.5 Cek Status Pembayaran Order (Manual / Trigger)

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

## 6. Mitra - My Data & Riwayat Transaksi

### 6.1 My Data (Layer Aktif Mitra)

- **Endpoint**: `GET /api/mitra/my-data`
- **Response**: Daftar layer aktif hasil provisioning yang telah lunas (`settled`) beserta URL WFS/WMS proxy dan tanggal kadaluwarsa akses.

### 6.2 Riwayat Transaksi Mitra

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
      selectionType: string;
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

## 7. Kamus Log Denum (Enumerations)

Berikut adalah ringkasan seluruh enum/konstanta yang digunakan di modul transaksi, keranjang, dan order (dapat langsung di-copy):

```typescript
// 1. Basis Spasial Data IGT
export type SpatialBasisType = "bidang" | "kawasan";

// 2. Tipe Seleksi Area Pemotongan Data
export type SelectionType =
  | "administrative_filter"
  | "aoi_polygon"
  | "selected_features"
  | "whole_layer";

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

- **Endpoint**: `GET /api/mitra/home/summary?period={1d|1w|1m|1y|all}`
- **Response**:
  - `dataSummary`: Breakdown bidang vs kawasan (active, almostExpired, expired).
  - `financialFlow`: Riwayat nominal belanja data spasial per periode.
  - `cartSummary`: Total item aktif di keranjang saat ini.

---

# C. Role: Internal (Admin / Verifikator)

## 9. Internal - User Management

### 9.1 List Users

- **Endpoint**: `GET /api/internal/users`
- **Params**: `page?: number`, `limit?: number`, `role?: string`, `search?: string`

### 9.2 User Detail

- **Endpoint**: `GET /api/internal/users/{id}`

### 9.3 Update Status / Role User

- **Endpoint**: `PUT /api/internal/users/{id}`

---

## 10. Internal - Dashboard & Statistik Sistem

### 10.1 Internal Dashboard Overview

- **Endpoint**: `GET /api/internal/home/summary?period={1d|1w|1m|1y|all}`
- **Response**: Statistik pengguna aktif, permohonan data masuk, volume transaksi, dan utilisasi resource server.
