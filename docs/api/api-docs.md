# Volatil - API & Schema Documentation

Dokumentasi endpoint API, Data Transfer Object (DTO), request/response payload, serta model interoperabilitas data spasial di Volatil.

---

## Ringkasan Hak Akses & Middleware

Sistem Volatil memiliki 2 role pengguna:

- **`mitra`**: Pengguna eksternal mitra ATR/BPN yang mengajukan permohonan data spasial, melakukan pembayaran, dan mengelola layer IGT miliknya.
- **`internal`**: Administrator / verifikator internal ATR/BPN yang mengelola master katalog data, master GeoServer, tarif PNBP, batas pembelian, validasi permohonan data spasial, dan monitoring sistem.

### Kategori Middleware:

- **`Public`**: Endpoint terbuka, dapat diakses tanpa autentikasi session (misal: login).
- **`Authenticated (Mitra & Internal)`**: Memerlukan session cookie yang valid, dapat diakses oleh role `mitra` maupun `internal`.
- **`Mitra Only`**: Khusus pengguna dengan role `mitra`. Pengguna dengan role `internal` atau unauthenticated tidak dapat mengakses.
- **`Internal Only`**: Khusus pengguna dengan role `internal`. Pengguna dengan role `mitra` atau unauthenticated tidak dapat mengakses.
- **`API Key (Mitra Service)`**: Akses proxy WMS/WFS khusus integrasi software GIS eksternal menggunakan `apiKey` milik mitra.

---

## Daftar Isi

- [Auth & Session](#auth--session)
- [Pusat Bantuan (Help Center)](#pusat-bantuan-help-center)
- [Notifikasi & Inbox](#notifikasi--inbox)
- [GeoServer Proxy Endpoints](#geoserver-proxy-endpoints)
- [Data Request & IGT Spasial](#data-request--igt-spasial)
- [Keranjang & Order Provisioning Spasial](#keranjang--order-provisioning-spasial)
- [My Data & Riwayat Transaksi](#my-data--riwayat-transaksi)
- [Dashboard & Statistik Mitra](#dashboard--statistik-mitra)
- [Master IGT Layers & Data Management](#master-igt-layers--data-management)
- [Master GeoServer](#master-geoserver)
- [Interop Batch Review](#interop-batch-review)
- [Tarif & Pricing Management](#tarif--pricing-management)
- [Purchase Limit Configuration](#purchase-limit-configuration)
- [User Management](#user-management)
- [Dashboard & Statistik Sistem](#dashboard--statistik-sistem)

---

# Auth & Session

## Sign In

- **Endpoint**: `POST /api/auth/sign-in`
- **Middleware / Akses**: `Public`
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

## User Profile

- **Endpoint**: `GET /api/auth/me`
- **Middleware / Akses**: `Authenticated (Mitra & Internal)`
- **Response**: Profile user yang sedang login beserta role aktif.

## Logout

- **Endpoint**: `POST /api/auth/logout`
- **Middleware / Akses**: `Authenticated (Mitra & Internal)`
- **Response**: `200 OK` / `{ success: true, message: "Logged out successfully" }`

---

# Pusat Bantuan (Help Center)

Modul penanganan tiket kendala, integrasi transaksi terkait, lampiran berkas, dan balasan laporan.

## Get List Tiket

- **Endpoint**: `GET /api/tickets`
- **Middleware / Akses**: `Authenticated (Mitra & Internal)` _(Mitra hanya melihat tiket miliknya, Internal melihat semua tiket)_
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

## Create Tiket Laporan

- **Endpoint**: `POST /api/tickets`
- **Middleware / Akses**: `Authenticated (Mitra & Internal)`
- **Content-Type**: `multipart/form-data`
- **Form Data Fields**:
  - `title` _(string, required)_: Judul laporan
  - `description` _(string, required)_: Rincian kendala
  - `transactionId` _(string, optional)_: ID transaksi terkait
  - `priority` _(string, optional)_: `low` | `medium` | `high` | `urgent`
  - `category` _(string, optional)_: Kategori kendala
  - `files` _(binary array, optional)_: Berkas lampiran foto, dokumen, atau video

## Detail Tiket

- **Endpoint**: `GET /api/tickets/{id}`
- **Middleware / Akses**: `Authenticated (Mitra & Internal)`

## Balas Tiket (Reply Ticket)

- **Endpoint**: `POST /api/tickets/{id}/reply`
- **Middleware / Akses**: `Authenticated (Mitra & Internal)`
- **Content-Type**: `multipart/form-data`
- **Form Data Fields**:
  - `message` _(string, required)_
  - `status` _(string, optional)_
  - `files` _(binary array, optional)_

## Selesaikan / Tolak Tiket (Resolve or Reject)

- **Resolve**: `POST /api/tickets/{id}/resolve`
- **Reject**: `POST /api/tickets/{id}/reject`
- **Middleware / Akses**: `Internal Only`
- **Payload**:
  - `reason` _(string, required)_: Alasan penyelesaian atau penolakan laporan

---

# Notifikasi & Inbox

Sistem notifikasi in-app untuk Mitra dan Internal user.

## List Notifikasi

- **Endpoint**: `GET /api/notifications`
- **Middleware / Akses**: `Authenticated (Mitra & Internal)`
- **Params**:
  - `page?: number`
  - `limit?: number`
  - `isRead?: boolean`
- **Response**:

```typescript
type NotificationsResponse = {
  items: Array<{
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    metadata?: Record<string, unknown>;
  }>;
  unreadCount: number;
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
};

type NotificationType =
  | "PAYMENT_SETTLED" // → Notifikasi ke mitra: pembayaran berhasil, layanan WMS disiapkan
  | "BATCH_PENDING_REVIEW" // → Notifikasi ke internal: ada layanan baru yang perlu divalidasi
  | "BATCH_APPROVED" // → Notifikasi ke mitra: layanan WMS disetujui & aktif di My Data
  | "BATCH_REJECTED" // → Notifikasi ke mitra: permohonan layanan ditolak + reason penolakan
  | "BATCH_EXPIRED"; // → Notifikasi ke mitra: batch transaksi kadaluwarsa
```

## Tandai Notifikasi Telah Dibaca

- **Endpoint**: `PUT /api/notifications/{id}/read`
- **Middleware / Akses**: `Authenticated (Mitra & Internal)`
- **Response**: `200 OK` / `{ success: true }`

## Tandai Semua Notifikasi Telah Dibaca

- **Endpoint**: `PUT /api/notifications/read-all`
- **Middleware / Akses**: `Authenticated (Mitra & Internal)`
- **Response**: `200 OK` / `{ success: true }`

---

# GeoServer Proxy Endpoints

Seluruh akses layer spasial dialihkan melalui endpoint proxy Backend demi keamanan kredensial master GeoServer.

## WMS Proxy

- **Endpoint**: `GET /api/proxy/wms`
- **Middleware / Akses**: `Authenticated (Mitra & Internal)` _(via cookie)_ atau `API Key (Mitra Service)` _(via `apiKey` query param / header)_
- **Query Params**:
  - `layerId` _(string, required)_: ID layer target (contoh: `testing_workspace:TEST_BIDANG_TANAH`).
  - Standar OGC WMS (`SERVICE=WMS`, `REQUEST=GetMap`, `BBOX`, `WIDTH`, `HEIGHT`, `FORMAT=image/png`, `SRS=EPSG:3857`, dll.)
- **Response**: Raw image tile stream dari GeoServer fisik.

## WFS Proxy

- **Endpoint**: `GET /api/proxy/wfs`
- **Middleware / Akses**: `Authenticated (Mitra & Internal)` _(via cookie)_
- **Query Params**:
  - `layerId` _(string, required)_: ID layer target.
  - Standar OGC WFS (`SERVICE=WFS`, `REQUEST=GetFeature`, `CQL_FILTER`, `SRSNAME=EPSG:4326`, `OUTPUTFORMAT=application/json`, dll.)
- **Response**: `GeoJSON.FeatureCollection` / JSON Schema.

## GeoServer Workspaces Proxy

- **Endpoint**: `GET /api/internal/master-geoserver/{geoserverId}/workspaces`
- **Middleware / Akses**: `Internal Only`
- **Response**:

```typescript
type GeoServerWorkspacesResponse = {
  workspaces: string[];
};
```

## GeoServer Workspace Layers Proxy

- **Endpoint**: `GET /api/internal/master-geoserver/{geoserverId}/workspaces/{workspaceName}/layers`
- **Middleware / Akses**: `Internal Only`
- **Response**:

```typescript
type GeoServerWorkspaceLayersResponse = {
  layers: Array<{
    name: string;
    title: string;
    typeName: string;
    abstract?: string;
    srs: string;
    geometryType?: "Polygon" | "MultiPolygon" | "Point" | "LineString";
    spatialBasis?: "bidang" | "kawasan";
    bbox?: [number, number, number, number];
  }>;
};
```

---

# Data Request & IGT Spasial

Modul eksplorasi layer IGT aktif, filter spasial wilayah administrasi, serta query feature via WFS/AOI untuk pengajuan data mitra.

## List IGT Layers (Public Active Layers)

- **Endpoint**: `GET /api/mitra/igt-layers`
- **Middleware / Akses**: `Mitra Only`
- **Params**:
  - `page?: number`, `limit?: number`, `search?: string`, `basis?: "bidang" | "kawasan"`, `tema?: string`, `provinsi?: string`, `kabupaten?: string`, `kecamatan?: string`, `kelurahan?: string`
- **Response**:

```typescript
type MitraIgtLayersResponse = {
  items: Array<{
    id: string;
    title: string;
    spatialBasis: "bidang" | "kawasan";
    bbox: [number, number, number, number];
    visible?: boolean;
    zIndex?: number;
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

## Query IGT by AOI Polygon

- **Endpoint**: `POST /api/mitra/data-request/by-aoi`
- **Middleware / Akses**: `Mitra Only`
- **Payload**: `{ geometry: GeoJSON.Polygon }`

## Query IGT by Upload AOI File

- **Endpoint**: `POST /api/mitra/data-request/upload-aoi`
- **Middleware / Akses**: `Mitra Only`
- **Payload**: `FormData` (`file: File`) (.zip shp, .geojson, .kml)

## Get IGT Catalog

- **Endpoint**: `GET /api/mitra/data-request/catalog`
- **Middleware / Akses**: `Mitra Only`
- **Params**: `page?: number`, `pageSize?: number`, `search?: string`

## Filter Options Wilayah & Tema

- `GET /api/mitra/data-request/filter-options/basis` — **Middleware / Akses**: `Mitra Only`
- `GET /api/mitra/data-request/filter-options/tema` — **Middleware / Akses**: `Mitra Only`
- `GET /api/igt/filter-options/kecamatan?kabupatenId={id}` — **Middleware / Akses**: `Mitra Only`
- `GET /api/igt/filter-options/kelurahan?kecamatanId={id}` — **Middleware / Akses**: `Mitra Only`

## Kebijakan Tarif & Batas Pembelian (Pricing & Policies)

- **Endpoint**: `GET /api/mitra/data-request/policies`
- **Middleware / Akses**: `Mitra Only`
- **Response**:

```typescript
type MitraPricingPolicyResponse = {
  policies: Array<{
    id: string;
    spatialBasis: "bidang" | "kawasan";
    unitPrice: number;
    unitLabel: string;
    minPurchase: number;
    minUnit: string;
    description?: string;
  }>;
  config: {
    minimumBidangCount: number;
    minimumKawasanHa: number;
    pricePerBidang: number;
    pricePerKawasanHa: number;
  };
};
```

---

# Keranjang & Order Provisioning Spasial

Modul transaksi data IGT berbasis **Batch Interop Spasial**.

### Alur Final Transaksi:

1. **Create Order (Add to Cart)**: Mitra memilih layer/fitur spasial dan memasukkan ke keranjang $\rightarrow$ status: `pending_payment` (TTL 24 jam).
2. **Totalan**: Total tagihan dan rincian tarif PNBP dikalkulasi secara instan.
3. **Bayar**: Mitra melakukan checkout $\rightarrow$ terbit Kode Billing PNBP ATR/BPN $\rightarrow$ bayar. Status order berubah menjadi `paid`.
4. **Create Service (Processing)**: Setelah status `paid`, **Interop Engine** otomatis mengeksekusi pemotongan data PostGIS dan auto-publishing GeoServer WMS/WFS (`processing` / `preparing`).
5. **Validasi Admin**: Setelah data siap, status menjadi `pending_verification` / `pending_review`. Admin Internal memvalidasi/memverifikasi layanan spasial dengan menginput URL wrapper resmi INTEROP Pusdatin sebelum aktivasi penuh (`approved` / `active`) ke My Data.

### SSOT Status Batch / Permohonan:

```typescript
type BatchStatus =
  | "pending_payment" // Menunggu pembayaran mitra (TTL 24 jam)
  | "paid" // Pembayaran telah terkonfirmasi
  | "preparing" // Interop engine sedang menyiapkan/memotong layer data WMS/WFS
  | "pending_review" // Menunggu validasi & input URL WMS INTEROP oleh admin internal
  | "approved" // Disetujui admin dan layer aktif untuk mitra
  | "rejected" // Ditolak admin (ditangguhkan sementara menunggu regulasi rekber)
  | "expired"; // Masa berlaku pembayaran atau data kadaluwarsa
```

## Add to Cart (Buat Batch Keranjang)

- **Endpoint**: `POST /api/mitra/cart/batches`
- **Middleware / Akses**: `Mitra Only`
- **Payload**:

```typescript
type AddToCartBatchRequest = {
  selectionType: "catalog" | "upload_aoi" | "draw_aoi";
  administrativeFilter?: {
    kodeProvinsi?: string;
    kodeKabupaten?: string;
    kodeKecamatan?: string;
    kodeDesa?: string;
  };
  aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
  cqlFilter?: string;
  items: Array<{
    sourceLayerId: string;
    cqlFilter?: string;
  }>;
};
```

- **Response**:

```typescript
type AddToCartBatchResponse = {
  batchId: string;
  status: "pending_payment";
  estimatedTotalPrice: number;
  createdAt: string;
};
```

## Ambil Daftar Batch di Keranjang

- **Endpoint**: `GET /api/mitra/cart/batches`
- **Middleware / Akses**: `Mitra Only`
- **Params**: `status?: "pending_payment" | "paid" | "preparing" | "pending_review" | "approved" | "rejected" | "expired"`
- **Response**:

```typescript
type CartBatchListResponse = {
  batches: Array<{
    batchId: string;
    status: BatchStatus;
    selectionType: "catalog" | "upload_aoi" | "draw_aoi";
    administrativeFilter?: {
      kodeProvinsi?: string;
      kodeKabupaten?: string;
      kodeKecamatan?: string;
      kodeDesa?: string;
    };
    aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
    cqlFilter?: string;
    createdAt: string;
    readyAt?: string;
    approvedAt?: string;
    expiredAt?: string;
    rejectionReason?: string;
    totalPrice: number;
    items: Array<{
      id: string;
      sourceLayerId: string;
      sourceLayerTitle: string;
      spatialBasis: "bidang" | "kawasan";
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

## Ambil Detail Batch di Keranjang

- **Endpoint**: `GET /api/mitra/cart/batches/{batchId}`
- **Middleware / Akses**: `Mitra Only`
- **Response**: `CartBatchDetailResponse`

## Hapus Batch dari Keranjang

- **Endpoint**: `DELETE /api/mitra/cart/batches/{batchId}`
- **Middleware / Akses**: `Mitra Only`
- **Response**: `200 OK` / `{ success: true, message: "Batch keranjang berhasil dihapus" }`

## Re-order Batch Kadaluwarsa

- **Endpoint**: `POST /api/mitra/cart/batches/{batchId}/reorder`
- **Middleware / Akses**: `Mitra Only`
- **Payload**: `{}`
- **Response**: `AddToCartBatchResponse`

## Checkout & Request Kode Billing (Bayar)

- **Endpoint**: `POST /api/mitra/cart/batches/{batchId}/checkout`
- **Middleware / Akses**: `Mitra Only`
- **Payload**:

```typescript
type CheckoutBatchRequest = {
  paymentMethod?: "MPN_GEN2" | "VA_MANDIRI" | "VA_BRI" | "VA_BCA" | "QRIS";
};
```

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

## Cek Status Pembayaran Billing (Kode Billing)

- **Endpoint**: `GET /api/mitra/billing/{billingCode}/status`
- **Middleware / Akses**: `Mitra Only`
- **Response**:

```typescript
type CheckPaymentStatusResponse = {
  billingCode: string;
  orderId?: string;
  batchId?: string;
  status:
    | "pending_payment"
    | "paid"
    | "preparing"
    | "pending_review"
    | "approved"
    | "rejected"
    | "expired";
  paidAt?: string;
  message?: string;
};
```

## Cek Status Pembayaran Order

- **Endpoint**: `GET /api/mitra/orders/{orderId}/status`
- **Middleware / Akses**: `Mitra Only`
- **Response**:

```typescript
type OrderPaymentStatusResponse = {
  orderId: string;
  transactionStatus: "pending" | "settled" | "paid" | "expired" | "failed";
  paidAt?: string;
};
```

---

# My Data & Riwayat Transaksi

## My Data (Layer Aktif Mitra)

- **Endpoint**: `GET /api/mitra/my-data`
- **Middleware / Akses**: `Mitra Only`
- **Response**: Daftar layer aktif hasil provisioning yang telah berstatus lunas (`settled`) dan disetujui validasi admin.

## Riwayat Transaksi Mitra

- **Endpoint**: `GET /api/mitra/transaction-history`
- **Middleware / Akses**: `Mitra Only`
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
    selectionType: "catalog" | "upload_aoi" | "draw_aoi";
    totalAmount: number;
    createdAt: string;
    paidAt?: string;
    expiredAt?: string;
    items: Array<{
      id: string;
      sourceLayerId: string;
      sourceLayerTitle: string;
      spatialBasis: "bidang" | "kawasan";
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

## Kamus Enum Transaksi & Spasial

```typescript
export type SpatialBasisType = "bidang" | "kawasan";
export type SelectionType = "catalog" | "upload_aoi" | "draw_aoi";
export type BatchStatus =
  | "ready"
  | "preparing"
  | "pending_review"
  | "approved"
  | "rejected"
  | "expired";
export type TransactionStatus = "pending" | "settled" | "expired" | "failed";
export type PaymentMethod =
  | "MPN_GEN2"
  | "VA_MANDIRI"
  | "VA_BRI"
  | "VA_BCA"
  | "QRIS";
export type OrderProvisionStatus =
  | "queued"
  | "provisioning"
  | "ready"
  | "failed"
  | "expired"
  | "revoked";
```

---

# Dashboard & Statistik Mitra

## Mitra Home Summary

- **Endpoint**: `GET /api/mitra/home?period={1d|1w|1m|1y|all}`
- **Middleware / Akses**: `Mitra Only`
- **Response**:
  - `dataSummary`: Breakdown bidang vs kawasan (active, almostExpired, expired).
  - `financialFlow`: Riwayat nominal belanja data spasial per periode.
  - `cartSummary`: Total item aktif di keranjang saat ini.

---

# Master IGT Layers & Data Management

Modul master pengelolaan konfigurasi layer IGT spasial. Mengaitkan identifier layer dengan `geoserverId` terdaftar dan `typeName`.

## List Master IGT Layers

- **Endpoint**: `GET /api/internal/igt-layers`
- **Middleware / Akses**: `Internal Only`
- **Params**:
  - `page?: number`, `limit?: number`, `search?: string`, `isActive?: boolean`, `basis?: "bidang" | "kawasan"`
- **Response**:

```typescript
type MasterIgtLayersResponse = {
  items: Array<{
    id: string;
    title: string;
    description?: string;
    spatialBasis: "bidang" | "kawasan";
    bbox: [number, number, number, number];
    isActive: boolean;
    zIndex?: number;
    geoserverId: string;
    geoserver: {
      id: string;
      name: string;
      baseUrl: string;
    };
    workspaceName: string;
    typeName: string;
    wfsUrl: string;
    wmsUrl: string;
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

## Create Master IGT Layer

- **Endpoint**: `POST /api/internal/igt-layers`
- **Middleware / Akses**: `Internal Only`
- **Payload**:

```typescript
type CreateMasterIgtLayerPayload = {
  id?: string;
  geoserverId: string;
  typeName: string;
  title: string;
  description?: string;
  spatialBasis: "bidang" | "kawasan";
  isActive: boolean;
  zIndex?: number;
};
```

## Update Master IGT Layer

- **Endpoint**: `PUT /api/internal/igt-layers/{id}`
- **Middleware / Akses**: `Internal Only`
- **Payload**: `Partial<CreateMasterIgtLayerPayload>`

## Delete Master IGT Layer (Soft Delete)

- **Endpoint**: `DELETE /api/internal/igt-layers/{id}`
- **Middleware / Akses**: `Internal Only`
- **Response**: `200 OK` / `{ success: true, message: "Layer IGT berhasil dihapus (retensi 30 hari)" }`

---

# Master GeoServer

Modul pengelolaan master kredensial dan endpoint GeoServer utama di lingkungan internal ATR/BPN.

## List Master GeoServer

- **Endpoint**: `GET /api/internal/master-geoserver`
- **Middleware / Akses**: `Internal Only`
- **Query Params**: `page?: number`, `pageSize?: number`, `search?: string`
- **Response**:

```typescript
type MasterGeoserverListResponse = {
  items: Array<{
    id: string;
    name: string;
    baseUrl: string;
    username: string;
    password?: string;
    description?: string;
    deletedAt?: string | null;
    createdAt: string;
    updatedAt: string;
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

## Detail Master GeoServer

- **Endpoint**: `GET /api/internal/master-geoserver/{id}`
- **Middleware / Akses**: `Internal Only`

## Create Master GeoServer

- **Endpoint**: `POST /api/internal/master-geoserver`
- **Middleware / Akses**: `Internal Only`
- **Payload**:

```typescript
type CreateMasterGeoserverPayload = {
  name: string;
  baseUrl: string;
  username: string;
  password?: string;
  description?: string;
};
```

## Update Master GeoServer

- **Endpoint**: `PUT /api/internal/master-geoserver/{id}`
- **Middleware / Akses**: `Internal Only`
- **Payload**: `Partial<CreateMasterGeoserverPayload>`

## Delete Master GeoServer (Soft Delete)

- **Endpoint**: `DELETE /api/internal/master-geoserver/{id}`
- **Middleware / Akses**: `Internal Only`
- **Response**: `200 OK` / `{ success: true, deletedAt: string }`

---

# Interop Batch Review

Modul bagi Internal User untuk memvalidasi dan memberikan persetujuan terhadap permohonan data spasial yang telah dibayar oleh mitra dan diproses oleh Interop Engine (`pending_review`).

## List Batches Pending Review

- **Endpoint**: `GET /api/internal/interop/batches`
- **Middleware / Akses**: `Internal Only`
- **Response**:

```typescript
type InternalBatchListResponse = {
  batches: Array<{
    batchId: string;
    mitraId: string;
    mitraName: string;
    status: "pending_review";
    selectionType: "catalog" | "upload_aoi" | "draw_aoi";
    createdAt: string;
    items: Array<{
      id: string;
      sourceLayerId: string;
      sourceLayerTitle: string;
      spatialBasis: "bidang" | "kawasan";
      featuresCount: number;
      areaHa?: number;
    }>;
  }>;
  total: number;
};
```

## Detail Batch Review

- **Endpoint**: `GET /api/internal/interop/batches/{batchId}`
- **Middleware / Akses**: `Internal Only`
- **Response**: `CartBatchDetailResponse`

## Approve Batch

- **Endpoint**: `PUT /api/internal/interop/batches/{batchId}/approve`
- **Middleware / Akses**: `Internal Only`
- **Payload**: `{}`
- **Response**: `200 OK` / `{ success: true, message: "Batch berhasil divalidasi dan disetujui" }`

## Reject Batch

- **Endpoint**: `PUT /api/internal/interop/batches/{batchId}/reject`
- **Middleware / Akses**: `Internal Only`
- **Payload**:

```typescript
type RejectBatchRequest = {
  reason: string;
};
```

- **Response**: `200 OK` / `{ success: true, message: "Batch berhasil ditolak" }`

---

# Tarif & Pricing Management

Modul pengelolaan tarif PNBP layer IGT.

## List Master Tarif

- **Endpoint**: `GET /api/internal/pricing`
- **Middleware / Akses**: `Internal Only`
- **Params**: `page?: number`, `pageSize?: number`, `search?: string`, `spatialBasis?: "bidang" | "kawasan"`
- **Response**:

```typescript
type PricingListResponse = {
  items: Array<PricingItem>;
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
};

type PricingItem = {
  id: string;
  layerId?: string;
  layerTitle?: string;
  kodePnbp?: string;
  spatialBasis: "bidang" | "kawasan";
  unitPrice: number;
  unitLabel: string;
  minPurchase?: number;
  minUnit?: string;
  effectiveDate: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};
```

## Create Master Tarif

- **Endpoint**: `POST /api/internal/pricing`
- **Middleware / Akses**: `Internal Only`
- **Payload**:

```typescript
type CreatePricingPayload = {
  layerId?: string;
  layerTitle?: string;
  spatialBasis: "bidang" | "kawasan";
  unitPrice: number;
  unitLabel: string;
  effectiveDate: string;
  description?: string;
};
```

## Update / Set Tarif Layer

- **Endpoint**: `PUT /api/internal/pricing/{id}`
- **Middleware / Akses**: `Internal Only`
- **Payload**: `Partial<CreatePricingPayload>`

---

# Purchase Limit Configuration

Modul pengelolaan ambang batas minimum pemesanan data spasial IGT (_purchase limit rules_).

## Get Purchase Limits

- **Endpoint**: `GET /api/internal/purchase-limits`
- **Middleware / Akses**: `Internal Only`
- **Response**:

```typescript
type PurchaseLimitsResponse = {
  limits: Array<{
    id: string;
    spatialBasis: "bidang" | "kawasan";
    minimumValue: number;
    unit: "bidang" | "ha";
    updatedAt: string;
    updatedBy: string;
  }>;
};
```

## Update Purchase Limit

- **Endpoint**: `PUT /api/internal/purchase-limits/{id}`
- **Middleware / Akses**: `Internal Only`
- **Payload**:

```typescript
type UpdatePurchaseLimitRequest = {
  minimumValue: number;
};
```

---

# User Management

Modul pengelolaan akun pengguna sistem, aktivasi status, dan peranan pengguna.

## List Users

- **Endpoint**: `GET /api/internal/user-management`
- **Middleware / Akses**: `Internal Only`
- **Params**: `page?: number`, `limit?: number`, `search?: string`, `role?: "internal" | "mitra"`, `status?: "active" | "inactive"`
- **Response**:

```typescript
type AdminUsersApiResponse = {
  data: Array<BackendAdminUserItem>;
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
};

type BackendAdminUserItem = {
  id: number;
  name: string;
  email: string;
  role: "internal" | "mitra";
  status: "active" | "inactive";
  organizationName: string | null;
  joinedAt: string;
  updatedAt?: string;
  totalPurchases?: number;
  totalPlotsPurchased?: number;
  totalAreaPurchasedHa?: number;
  totalIgtDataCount?: number;
  lastTotalSpending?: string | number;
};
```

## User Detail

- **Endpoint**: `GET /api/internal/user-management/{id}`
- **Middleware / Akses**: `Internal Only`

## Update Status User

- **Endpoint**: `PATCH /api/internal/user-management/{id}/status`
- **Middleware / Akses**: `Internal Only`
- **Payload**: `{ status: "active" | "inactive" }`

## Statistik Pengguna

- **Endpoint**: `GET /api/internal/user-management/statistics`
- **Middleware / Akses**: `Internal Only`
- **Response**:

```typescript
type AdminUsersStatisticsApiResponse = {
  data: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    breakdownByRole: {
      internal: number;
      mitra: number;
    };
  };
};
```

---

# Dashboard & Statistik Sistem

Modul agregasi metrik operasional IGT untuk admin internal ATR/BPN.

## Internal Dashboard Overview

- **Endpoint**: `GET /api/internal/home?period={1d|1w|1m|1y|all}`
- **Middleware / Akses**: `Internal Only`
- **Response**:

```typescript
type InternalHomeDataResponse = {
  igtBasis: {
    field: number;
    area: number;
  };
  igtPublicationStatus: {
    active: number;
    inactive: number;
  };
  mitraRegistration: {
    active: number;
    pendingVerification: number;
  };
  serviceRates: Array<{
    id: string;
    title: string;
    price: number;
    unit: string;
    kodePnbp?: string;
    minPurchase: number;
    minUnit: string;
    colorPalette?: string;
  }>;
  acquisitionTrends: Record<
    "1d" | "1w" | "1m" | "1y" | "all",
    Array<{
      label: string;
      field: number;
      area: number;
      revenue: number;
    }>
  >;
  topMitraList: Array<{
    rank: number;
    mitraId: string;
    mitraName: string;
    agencyOrCompany: string;
    totalOrders: number;
    totalVolume: string;
    totalSpending: number;
  }>;
  topIgtLayers: Array<{
    rank: number;
    layerId: string;
    layerTitle: string;
    spatialBasis: "bidang" | "kawasan";
    totalAcquisitions: number;
    totalVolume: number;
    unit: "bidang" | "ha";
    totalPnbpRevenue: number;
  }>;
};
```
