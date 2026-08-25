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

- **Endpoint**: `POST /api/v1/auth/sign-in`
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

- **Get Profile**: `GET /api/v1/auth/me`
- **Logout**: `POST /api/v1/auth/logout`

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

---

## 3. Notifikasi & Inbox

Modul pesan inbox resmi dan sinkronisasi riwayat toast notification sistem.

### 3.1 List Inbox Pesan

- **Endpoint**: `GET /api/v1/inbox`
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
};
```

### 3.2 Tandai Inbox Telah Dibaca

- **Endpoint**: `PATCH /api/v1/inbox/{id}/read`
- **Response**: `200 OK` / `void`

---

# B. Role: Mitra

## 4. Mitra - Data Request & IGT Spasial

Modul eksplorasi katalog IGT, filter spasial wilayah administrasi, serta query feature via WFS/AOI untuk pengajuan data mitra.

### 4.1 Katalog IGT

- **Endpoint**: `GET /api/v1/igt/catalog`
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

- **By AOI Polygon**: `POST /api/v1/igt/by-aoi`
  - **Payload**: GeoJSON Polygon (`geometry: GeoJSON.Polygon`)
- **By Uploaded File**: `POST /api/v1/igt/by-uploaded-aoi`
  - **Payload**: `FormData` (`file: File`) (.zip shp, .geojson, .kml)

### 4.3 Filter Options Wilayah Administrasi

- `GET /api/v1/igt/filter-options/provinsi`
- `GET /api/v1/igt/filter-options/kabupaten?provinsiId={id}`
- `GET /api/v1/igt/filter-options/kecamatan?kabupatenId={id}`
- `GET /api/v1/igt/filter-options/kelurahan?kecamatanId={id}`

---

## 5. Mitra - Keranjang & Order Provisioning Spasial

> [!NOTE]
> **TODO: Refactor Pending** — Skema endpoint cart, checkout, dan provisioning order di bawah ini belum final dan akan direfactor menyesuaikan arsitektur backend transaksi.

Modul transaksi data IGT, checkout, provisioning isolated PostGIS table per-mitra, GeoServer workspace provisioning, serta manajemen kredensial WFS/WMS (Hash-Only & Rotation).

### 5.1 Add to Cart

- **Endpoint**: `POST /api/v1/mitra/cart/add`
- **Payload**:

```typescript
type AddToCartRequest = {
  items: Array<{
    sourceLayerId: string;
    selectionType: "aoi" | "selected_features" | "whole_layer";
    /** Polygon/MultiPolygon dalam koordinat EPSG:4326 (lon/lat) */
    aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
    /** CQL query string untuk filter atribut/spasial */
    cqlFilter?: string;
    /** Daftar ID baris terpilih jika granular selection */
    selectedFeatureIds?: string[];
  }>;
};
```

### 5.2 Get Cart Summary & Items

- **Endpoint**: `GET /api/v1/mitra/cart`
- **Response**:

```typescript
type CartResponse = {
  items: Array<{
    id: string;
    sourceLayerId: string;
    sourceLayerTitle: string;
    spatialBasis: "bidang" | "kawasan";
    selectionType: "aoi" | "selected_features" | "whole_layer";
    aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
    cqlFilter?: string;
    selectedFeatureIds?: string[];
    estimatedFeaturesCount: number;
    estimatedAreaHa?: number;
    unitPrice: number;
    estimatedSubtotalPrice: number;
    createdAt: string;
  }>;
  summary: {
    totalItems: number;
    totalBidang: number;
    totalBidangPrice: number;
    totalKawasan: number;
    totalKawasanHa: number;
    totalKawasanPrice: number;
    grandTotal: number;
  };
};
```

### 5.3 Checkout / Create Order

- **Endpoint**: `POST /api/v1/mitra/cart/checkout`
- **Payload**:

```typescript
type CreateOrderCheckoutRequest = {
  cartItemIds?: string[];
  notes?: string;
};
```

- **Response**:

```typescript
type CreateOrderCheckoutResponse = {
  orderId: string;
  orderNumber: string;
  status:
    | "draft"
    | "pending_payment"
    | "processing"
    | "active"
    | "expired"
    | "rejected";
  billingCode: string;
  totalPrice: number;
  validatedAt: string;
  expiredAt: string;
};
```

### 5.4 Order Detail & Provisioned Spatial Layer

- **Endpoint**: `GET /api/v1/mitra/orders/{id}`
- **Response**:

```typescript
type OrderDetailResponse = {
  id: string;
  orderNumber: string;
  userId: string;
  status:
    | "draft"
    | "pending_payment"
    | "processing"
    | "active"
    | "expired"
    | "rejected";
  billingCode?: string;
  totalPrice: number;
  orderedAt: string;
  validatedAt: string;
  expiredAt?: string;
  items: Array<{
    id: string;
    sourceLayerId: string;
    sourceLayerTitle: string;
    spatialBasis: "bidang" | "kawasan";
    selectionType: "aoi" | "selected_features" | "whole_layer";
    snapshotFeaturesCount: number;
    snapshotAreaHa?: number;
    unitPrice: number;
    subtotalPrice: number;
    provisionedLayer?: {
      id: string;
      orderItemId: string;
      tableName: string; // PostGIS isolated table
      geoserverWorkspace: string;
      geoserverLayerName: string;
      proxyWfsUrl: string; // Proxy URL terproteksi
      proxyWmsUrl: string;
      apiKeyMasked: string | null; // e.g. "vtl_live_...9x4b"
      keyGeneratedAt: string | null;
      status:
        | "queued"
        | "provisioning"
        | "ready"
        | "failed"
        | "expired"
        | "revoked";
      validUntil: string;
    };
  }>;
};
```

### 5.5 Generate & Rotate API Key Kredensial Spasial (One-Time Reveal)

- **Endpoint**: `POST /api/v1/mitra/provisioned-layers/{id}/generate-key`
- **Payload**:

```typescript
type GenerateApiKeyRequest = {
  provisionedLayerId: string;
};
```

- **Response** _(Raw key hanya dikembalikan sekali dalam response ini, database hanya menyimpan hash)_:

```typescript
type GenerateApiKeyResponse = {
  provisionedLayerId: string;
  apiKeyMasked: string; // "vtl_live_...9x4b"
  rawApiKey: string; // "vtl_live_d83fa9c2..." (One-time Reveal)
  keyGeneratedAt: string;
};
```

---

## 6. Mitra - My Data & Transaksi

> [!NOTE]
> **TODO: Refactor Pending** — Skema endpoint `my-data` (layer aktif) dan riwayat transaksi mitra belum fix dan akan disesuaikan kembali pada iterasi backend berikutnya.

### 6.1 My Data (Layer Aktif Mitra)

- **Endpoint**: `GET /api/v1/mitra/my-data`
- **Response**: Daftar layer aktif ter-provisioning milik mitra beserta sisa waktu akses dan statistik pemakaian WFS/WMS proxy.

### 6.2 Riwayat Transaksi Mitra

- **Endpoint**: `GET /api/v1/mitra/transactions`
- **Response**:

```typescript
type MitraTransactionListResponse = {
  items: Array<{
    id: string;
    orderNumber: string;
    billingCode?: string;
    status:
      | "draft"
      | "pending_payment"
      | "processing"
      | "active"
      | "expired"
      | "rejected";
    totalPrice: number;
    orderedAt: string;
    items: Array<{
      id: string;
      sourceLayerId: string;
      sourceLayerTitle: string;
    }>;
  }>;
  total: number;
};
```

---

## 7. Mitra - Dashboard & Statistik

### 7.1 Mitra Home Summary

- **Endpoint**: `GET /api/v1/mitra/home/summary?period={1d|1w|1m|1y|all}`
- **Response**:
  - `dataSummary`: Breakdown bidang vs kawasan (active, almostExpired, expired).
  - `financialFlow`: Riwayat nominal belanja data spasial per periode.
  - `cartSummary`: Total item aktif di keranjang saat ini.

---

# C. Role: Internal (Admin / Verifikator)

## 8. Internal - User Management

### 8.1 List Users

- **Endpoint**: `GET /api/v1/internal/users`
- **Params**: `page?: number`, `limit?: number`, `role?: string`, `search?: string`

### 8.2 User Detail

- **Endpoint**: `GET /api/v1/internal/users/{id}`

### 8.3 Update Status / Role User

- **Endpoint**: `PUT /api/v1/internal/users/{id}`

---

## 9. Internal - Dashboard & Statistik Sistem

### 9.1 Internal Dashboard Overview

- **Endpoint**: `GET /api/v1/internal/home/summary?period={1d|1w|1m|1y|all}`
- **Response**: Statistik pengguna aktif, permohonan data masuk, volume transaksi, dan utilisasi resource server.
