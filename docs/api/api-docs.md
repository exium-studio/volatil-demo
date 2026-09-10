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
- [Antrean Job Pembaruan Layer Mitra (Queue Jobs & SSE)](#antrean-job-pembaruan-layer-mitra-queue-jobs--sse)
- [Master GeoServer](#master-geoserver)
- [Review Permohonan (Internal Order Review)](#review-permohonan-internal-order-review)
- [Statistik & Monitoring Transaksi Internal](#statistik--monitoring-transaksi-internal)
- [Tarif & Pricing Management](#tarif--pricing-management)
- [Purchase Limit Configuration](#purchase-limit-configuration)
- [User Management](#user-management)
- [Dashboard & Statistik Sistem](#dashboard--statistik-sistem)

---

# Auth & Session

## Sign In / Login

- **Endpoint**: `POST /api/auth/login`
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

## Registrasi Mitra Eksternal

- **Endpoint**: `POST /api/auth/register`
- **Middleware / Akses**: `Public`
- **Payload**: `FormData` (nama, email, instansi/perusahaan, dokumen identitas, dokumen legalitas, nomor kontak)
- **Response**:

```typescript
type MitraRegistrationCreatedData = {
  registrationNumber: string;
  message: string;
};
```

## Cek Status Registrasi Mitra

- **Endpoint**: `GET /api/auth/registration-status/{registrationNumber}`
- **Middleware / Akses**: `Public`
- **Response**:

```typescript
type MitraRegistrationStatusData = {
  registrationNumber: string;
  organizationName: string;
  picName: string;
  email: string;
  phone: string;
  status: "submitted" | "in_review" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
};
```

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

Modul riwayat notifikasi sistem, tagihan pembayaran, tiket bantuan, dan informasi akun pengguna.

## Get List Inbox / Notifikasi

- **Endpoint**: `GET /api/inbox`
- **Middleware / Akses**: `Authenticated (Mitra & Internal)`
- **Params**:
  - `page?: number`
  - `pageSize?: number`
  - `category?: "transaksi" | "sistem" | "bantuan" | "akun"`
  - `isRead?: boolean`
  - `search?: string`
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

## Tandai Notifikasi Telah Dibaca

- **Endpoint**: `PATCH /api/inbox/{id}/read`
- **Middleware / Akses**: `Authenticated (Mitra & Internal)`
- **Response**: `200 OK` / `{ success: true }`

## Tandai Semua Notifikasi Telah Dibaca

- **Endpoint**: `PATCH /api/inbox/read-all`
- **Middleware / Akses**: `Authenticated (Mitra & Internal)`
- **Response**: `200 OK` / `{ success: true }`

## Hapus Notifikasi

- **Endpoint**: `DELETE /api/inbox/{id}`
- **Middleware / Akses**: `Authenticated (Mitra & Internal)`
- **Response**: `200 OK` / `{ success: true }`

## Hapus Semua Notifikasi

- **Endpoint**: `DELETE /api/inbox/clear-all`
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
- **Hierarchical Wilayah Indonesia API**:
  - `Provinsi`: `provinces.json` (via API Wilayah Indonesia / EMSIFA static API with caching)
  - `Kabupaten`: `regencies/{provinceId}.json`
  - `Kecamatan`: `districts/{regencyId}.json`
  - `Kelurahan`: `villages/{districtId}.json`

### WFS Batas Wilayah Administrasi (AOI Resolver)

Digunakan untuk mengambil GeoJSON polygon geometri batas wilayah administrasi terdalam yang dipilih user (Provinsi / Kabupaten / Kecamatan / Kelurahan) via GeoServer WFS Proxy:

- **Endpoint**: `GET /api/proxy/wfs`
- **Hierarchical Configuration Layer & Attribute Key**:
  - `provinsi`: layer `administrative_workspace:BATAS_PROVINSI`, attribute filter: `WADMPR`
  - `kabupaten`: layer `administrative_workspace:BATAS_KABUPATEN`, attribute filter: `WADMKK`
  - `kecamatan`: layer `administrative_workspace:BATAS_KECAMATAN`, attribute filter: `WADMKC`
  - `kelurahan`: layer `administrative_workspace:BATAS_DESA_KELURAHAN`, attribute filter: `WADMKD`
- **Params**:
  - `layerId`: Nama layer batas administrasi sesuai level
  - `service`: `WFS`
  - `version`: `2.0.0`
  - `request`: `GetFeature`
  - `outputFormat`: `application/json`
  - `srsName`: `EPSG:4326`
  - `cql_filter`: Filter nama/kode wilayah terdalam, e.g. `WADMKD ILIKE '%TEMBALANG%'` atau `WADMPR ILIKE '%BALI%'`
- **Output**: `GeoJSON.FeatureCollection` (Polygon / MultiPolygon) yang di-resolve oleh FE menjadi single `aoiPolygon` (melalui Turf.js unary union jika terdapat multi-features/islands).

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

Modul transaksi data IGT berbasis **Order & Interop Spasial**. Di database, transaksi dan order disimpan dalam **1 tabel `ORDER`** dengan 2 kolom status utama: `order_status` dan `transaction_status`.

### Alur Transaksi:

1. **Create Order (Add to Cart)**: Mitra memilih layer/fitur spasial dan memasukkan ke keranjang $\rightarrow$ `orderStatus: "pending_payment"`, `transactionStatus: undefined` (TTL 24 jam).
2. **Totalan**: Total tagihan dan rincian tarif PNBP dikalkulasi secara instan.
3. **Bayar**: Mitra melakukan checkout $\rightarrow$ terbit Kode Billing PNBP ATR/BPN $\rightarrow$ bayar. Status order berubah menjadi `orderStatus: "paid"`, `transactionStatus: "paid"`.
4. **Create Service (Processing)**: Setelah status `paid`, **Interop Engine** otomatis mengeksekusi pemotongan data PostGIS dan auto-publishing GeoServer WMS/WFS (`orderStatus: "processing"`).
5. **Validasi Admin**: Setelah data siap, status menjadi `orderStatus: "pending_review"`. Admin Internal memvalidasi/memverifikasi layanan spasial dengan menginput URL wrapper resmi INTEROP Pusdatin sebelum aktivasi penuh (`orderStatus: "ready"`) ke My Data.

### SSOT 1: Status Transaksi & Pembayaran (`TransactionStatus`)

```typescript
export type TransactionStatus =
  | "expired" // Masa bayar tagihan kedaluwarsa
  | "paid" // Pembayaran terkonfirmasi
  | "failed" // Pembayaran gagal
  | "refunded"; // Dana pembayaran dikembalikan
```

### SSOT 2: Status Order & Layanan Spasial (`OrderStatus`)

```typescript
export type OrderStatus =
  | "pending_payment" // Menunggu pembayaran mitra (TTL 24 jam)
  | "paid" // Pembayaran telah terkonfirmasi
  | "processing" // Interop engine sedang menyiapkan/memotong layer data WMS/WFS
  | "pending_review" // Menunggu validasi & input URL WMS INTEROP oleh admin internal
  | "rejected" // Ditolak admin
  | "ready"; // Layanan data siap digunakan
```

## Add to Cart (Buat Order Keranjang)

- **Endpoint**: `POST /api/mitra/cart/orders`
- **Middleware / Akses**: `Mitra Only`
- **Payload**:

```typescript
type CartOrderItemPayload = {
  sourceLayerId: string;
  cqlFilter?: string;
  wfsUrl?: string;
  wmsUrl?: string;
};

type AddToCartOrderRequest = {
  selectionType: "catalog" | "upload_aoi" | "draw_aoi";
  /** AOI Polygon boundary input user (wajib terisi untuk semua metode: Draw, Upload, Wilayah Administrasi/Catalog). Disimpan di DB sebagai referensi permanen provisioning */
  aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
  /** Coverage Polygon hasil clip ke boundary AOI dan unary union (Turf.js). Menjadi basis perhitungan luas kawasan (ha) oleh BE */
  coveragePolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
  /** Snapshot list layer IGT aktif yang dimasukkan ke keranjang */
  items: CartOrderItemPayload[];
  /** @deprecated Tidak lagi digunakan sebagai filter utama karena semua metode kini di-resolve langsung ke GeoJSON AOI Polygon di FE. Tetap dipertahankan untuk backward compatibility */
  administrativeFilter?: {
    kodeProvinsi?: string;
    kodeKabupaten?: string;
    kodeKecamatan?: string;
    kodeDesa?: string;
  };
  /** @deprecated Digantikan oleh aoiPolygon & coveragePolygon untuk spatial boundary query */
  cqlFilter?: string;
};
```

- **Response**:

```typescript
type AddToCartOrderResponse = {
  orderId: string;
  status: OrderStatus;
  estimatedTotalPrice: number;
  createdAt: string;
};
```

## Ambil Daftar Order di Keranjang

- **Endpoint**: `GET /api/mitra/cart/orders`
- **Middleware / Akses**: `Mitra Only`
- **Params**: `status?: OrderStatus`
- **Response**:

```typescript
type OrderListResponse = {
  orders: Array<{
    orderId: string;
    status: OrderStatus;
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
      /** Bounding box layer IGT: [minLon, minLat, maxLon, maxLat] (EPSG:4326) */
      bbox?: [number, number, number, number];
    }>;
  }>;
  total: number;
};
```

## Ambil Detail Order di Keranjang

- **Endpoint**: `GET /api/mitra/cart/orders/{orderId}`
- **Middleware / Akses**: `Mitra Only`
- **Response**:

```typescript
type CartOrderDetailResponse = {
  orderId: string;
  status: OrderStatus;
  /** Metode pengajuan AOI order ("catalog" | "upload_aoi" | "draw_aoi") */
  selectionType: "catalog" | "upload_aoi" | "draw_aoi";
  aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
  coveragePolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
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
    previewWmsUrl?: string;
    previewWfsUrl?: string;
    externalWfsUrl?: string | null;
    externalWmsUrl?: string | null;
    /** Bounding box layer IGT: [minLon, minLat, maxLon, maxLat] (EPSG:4326) */
    bbox?: [number, number, number, number];
  }>;
};
```

## Hapus Order dari Keranjang

- **Endpoint**: `DELETE /api/mitra/cart/orders/{orderId}`
- **Middleware / Akses**: `Mitra Only`
- **Response**: `200 OK` / `{ success: true, message: "Order keranjang berhasil dihapus" }`

## Re-order Pesanan

- **Endpoint**: `POST /api/mitra/cart/orders/{orderId}/reorder`
- **Middleware / Akses**: `Mitra Only`
- **Payload**: `{}`
- **Response**: `AddToCartOrderResponse`

## Checkout & Request Kode Billing (Bayar)

- **Endpoint**: `POST /api/mitra/cart/orders/{orderId}/checkout`
- **Middleware / Akses**: `Mitra Only`
- **Payload**:

```typescript
type CheckoutOrderRequest = {
  paymentMethod?: "MPN_GEN2" | "VA_MANDIRI" | "VA_BRI" | "VA_BCA" | "QRIS";
};
```

- **Response**:

```typescript
type CheckoutOrderResponse = {
  orderId: string;
  transactionNumber: string;
  orderNumber: string;
  billingCode: string;
  totalAmount: number;
  orderStatus: OrderStatus;
  createdAt: string;
  billingExpiredAt: string;
};
```

## Cek Status Pembayaran (Trigger Bayar)

- **Endpoint**: `GET /api/mitra/orders/{orderId}/status`
- **Middleware / Akses**: `Mitra Only`
- **Headers**: `Authorization: Bearer <TOKEN_MITRA>`
- **Keterangan**: Dipanggil oleh mitra untuk memverifikasi status pembayaran.
- **Response (200 OK)**:

```typescript
type OrderPaymentStatusResponse = {
  success: boolean;
  data: {
    orderId: string;
    transactionStatus: TransactionStatus;
    paidAt?: string;
  };
};
```

---

# My Data & Riwayat Transaksi

## My Data (Layer Aktif Mitra)

- **Endpoint**: `GET /api/mitra/my-data`
- **Middleware / Akses**: `Mitra Only`
- **Params**:
  - `page?: number`
  - `pageSize?: number`
  - `search?: string`
  - `basis?: "bidang" | "kawasan"`
  - `status?: OrderStatus`
- **Response**:

```typescript
type MyDataResponse = {
  success: boolean;
  message: string;
  data: {
    items: Array<{
      id: string;
      title: string;
      spatialBasis: "bidang" | "kawasan";
      wfsUrl: string | null;
      wmsUrl: string | null;
      externalWfsUrl?: string | null;
      externalWmsUrl?: string | null;
      wfsTypeName?: string;
      wmsLayers?: string;
      status: OrderStatus;
      expiresAt: string;
      bbox?: [number, number, number, number];
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
  timestamp: string;
};
```

## Riwayat Transaksi Mitra

- **Endpoint**: `GET /api/mitra/transaction-history`
- **Middleware / Akses**: `Mitra Only`
- **Params**: `page?: number`, `pageSize?: number`, `search?: string`, `status?: TransactionStatus`
- **Response**:

```typescript
type TransactionHistoryResponse = {
  items: Array<{
    id: string;
    orderId: string;
    transactionNumber: string;
    orderNumber?: string;
    billingCode: string;
    paymentMethod: string;
    transactionStatus: TransactionStatus;
    selectionType: "catalog" | "upload_aoi" | "draw_aoi";
    totalAmount: number;
    createdAt: string;
    paidAt?: string;
    expiredAt?: string;
    billingExpiredAt?: string;
    items: Array<{
      id: string;
      sourceLayerId: string;
      sourceLayerTitle: string;
      spatialBasis: "bidang" | "kawasan";
      snapshotFeaturesCount: number;
      snapshotAreaHa?: number;
      unitPrice: number;
      subtotalPrice: number;
      provisionStatus: OrderStatus;
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

## Kamus Enum Status (2 SSOT Utama)

### 1. SSOT Status Transaksi & Pembayaran (`TransactionStatus`)

Digunakan untuk status pembayaran & billing pada tabel `ORDER`:

```typescript
export type TransactionStatus =
  | "expired" // Masa bayar tagihan kedaluwarsa
  | "paid" // Pembayaran terkonfirmasi
  | "failed" // Pembayaran gagal
  | "refunded"; // Dana pembayaran dikembalikan
```

### 2. SSOT Status Order & Layanan Spasial (`OrderStatus`)

Digunakan untuk status operasional & provisioning data spasial pada tabel `ORDER`:

```typescript
export type OrderStatus =
  | "pending_payment" // Menunggu Pembayaran
  | "paid" // Terbayar
  | "processing" // Sedang Diproses (Interop Engine)
  | "pending_review" // Menunggu Validasi Admin
  | "rejected" // Ditolak Admin
  | "ready"; // Siap Digunakan
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

# Antrean Job Pembaruan Layer Mitra (Queue Jobs & SSE)

Modul background queue job dan Server-Sent Events (SSE) untuk menangani proses sinkronisasi layer data yang telah dibeli oleh mitra ketika data layer master ATR/BPN diperbarui dari sumber eksternal. Karena layer mitra berjalan di dedicated geoserver service masing-masing, proses ini dieksekusi secara asinkron (background queue) agar tidak memblokir antarmuka pengguna internal.

## 1. Trigger Pembaruan Layer Mitra (Queue Job)

- **Endpoint**: `POST /api/internal/igt-layers/{id}/sync-mitra`
- **Middleware / Akses**: `Internal Only`
- **Tipe Eksekusi**: Asynchronous Background Queue Job (HTTP 202 Accepted)
- **Keterangan**: Memicu antrean pekerjaan pembaruan layer turunan mitra yang memiliki relasi dengan layer master ID tersebut.
- **Payload**: `{}` (Empty body)
- **Response**: `202 Accepted`

```typescript
type TriggerMitraLayerSyncResponse = {
  jobId: string;
  layerId: string;
  status: "queued" | "processing" | "completed" | "failed";
  message: string;
  createdAt: string;
};
```

## 2. List Antrean Job Pembaruan Layer Mitra

- **Endpoint**: `GET /api/internal/mitra-layer-sync-jobs`
- **Middleware / Akses**: `Internal Only`
- **Query Params**:
  - `page?: number` (default: 1)
  - `pageSize?: number` (default: 10)
  - `search?: string` (pencarian berdasarkan ID job, judul layer, atau typename)
  - `status?: "queued" | "processing" | "completed" | "failed"`
- **Response**: `200 OK`

```typescript
type MitraLayerSyncJobItem = {
  id: string;
  layerId: string;
  layerTitle: string;
  workspaceName: string;
  typeName: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress: number; // 0 - 100%
  totalMitraLayers: number;
  processedMitraLayers: number;
  triggeredByUserId: string;
  triggeredByUserName: string;
  errorMessage?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
};

type MitraLayerSyncJobsResponse = {
  items: MitraLayerSyncJobItem[];
  pagination: PaginationMeta;
};
```

## 3. Detail Job Pembaruan Layer Mitra

- **Endpoint**: `GET /api/internal/mitra-layer-sync-jobs/{jobId}`
- **Middleware / Akses**: `Internal Only`
- **Response**: `200 OK` / `MitraLayerSyncJobItem`

## 4. Real-time Job Progress Stream (Server-Sent Events / SSE)

- **Endpoint**: `GET /api/internal/mitra-layer-sync-jobs/stream`
- **Optional Single Job Endpoint**: `GET /api/internal/mitra-layer-sync-jobs/{jobId}/stream`
- **Middleware / Akses**: `Internal Only`
- **Autentikasi**: Karena native `EventSource` tidak mendukung custom header `Authorization`, token JWT dikirim sebagai query param:
  - `?token=<JWT_TOKEN>` — BE harus membaca dan memvalidasi token dari `req.query.token`
  - Contoh: `GET /api/internal/mitra-layer-sync-jobs/stream?token=eyJhbGci...`
- **Headers** (response dari server):
  - `Content-Type: text/event-stream`
  - `Cache-Control: no-cache`
  - `Connection: keep-alive`
- **Stream Event Types**:
  - `event: job_created`: Dikirim ketika job baru dimasukkan ke dalam antrean.
  - `event: job_started`: Dikirim ketika worker mulai memproses sinkronisasi layer mitra.
  - `event: job_progress`: Dikirim secara periodik mengabarkan progres sinkronisasi (`progress: number`, `processedMitraLayers: number`).
  - `event: job_completed`: Dikirim saat seluruh layer mitra terkait berhasil disinkronisasi.
  - `event: job_failed`: Dikirim jika terjadi kegagalan (misal: koneksi timeout ke geoserver mitra) disertai `errorMessage`.
- **Contoh SSE Payload**:

```text
event: job_progress
data: {"id":"sync_job_003","layerId":"testing_workspace:TEST_BIDANG_TANAH","layerTitle":"Bidang Tanah","typeName":"testing_workspace:TEST_BIDANG_TANAH","status":"processing","progress":65,"totalMitraLayers":20,"processedMitraLayers":13,"triggeredByUserId":"usr_admin_02","triggeredByUserName":"Verifikator Spasial","createdAt":"2026-09-10T03:40:00Z","startedAt":"2026-09-10T03:40:10Z"}
```

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

# Review Permohonan (Internal Order Review)

Modul bagi Internal User untuk memproses permohonan data spasial yang telah dibayar mitra (`paid`), memicu pembuatan service GeoServer WMS/WFS (`provision`), serta memvalidasi dan memberikan persetujuan (`pending_review` $\rightarrow$ `ready`) setelah mendapatkan URL wrapper resmi INTEROP Pusdatin ATR/BPN.

> Filter default pada halaman Review Permohonan hanya menampilkan data dengan status `paid` (perlu Create WMS) dan `pending_review` (WMS siap di-review).

## Trigger Provisioning GeoServer (Create Service WMS)

- **Endpoint**: `POST /api/mitra/orders/{orderId}/provision`
- **Middleware / Akses**: `Internal / Mitra Auth Token`
- **Kapan Dipanggil**: User internal menekan tombol "Create Service WMS" pada daftar Review Permohonan untuk order berstatus `paid`.
- **Deskripsi**:
  1. Memvalidasi bahwa order sudah berstatus `paid`.
  2. Mengubah status operasional order menjadi `processing`.
  3. Menjalankan background worker `provisionOrderItems` untuk memotong AOI, membuat tabel PostGIS, dan mem-publish layer ke GeoServer internal beserta style SLD.
  4. Setelah selesai, status order otomatis berubah menjadi `pending_review` agar admin internal dapat meninjau dan menyalin link WMS internal Volatil.
- **Response (200 OK)**:

```typescript
type ProvisionOrderResponse = {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    orderStatus: OrderStatus;
    transactionStatus?: TransactionStatus;
  };
};
```

## List Orders Review Permohonan

- **Endpoint**: `GET /api/internal/interop/orders`
- **Middleware / Akses**: `Internal Only`
- **Params**: `page?: number`, `pageSize?: number`, `search?: string`, `status?: "paid" | "pending_review" | "all"`
- **Response**:

```typescript
type InternalOrderListResponse = {
  items: Array<{
    orderId: string;
    mitraId: string;
    mitraName: string;
    status: "pending_review" | "paid" | "approved" | "rejected" | "expired" | "cancelled";
    selectionType: "catalog" | "upload_aoi" | "draw_aoi";
    createdAt: string;
    readyAt?: string;
    expiredAt?: string;
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
      previewWmsUrl?: string;
      previewWfsUrl?: string;
      externalWfsUrl?: string | null;
      externalWmsUrl?: string | null;
      /** Bounding box layer IGT: [minLon, minLat, maxLon, maxLat] (EPSG:4326) */
      bbox?: [number, number, number, number];
    }>;
  }>;
  pagination: PaginationMeta;
};
```

## Detail Order Review

- **Endpoint**: `GET /api/internal/interop/orders/{orderId}`
- **Middleware / Akses**: `Internal Only`
- **Response**: `InternalOrderItem`

## Approve Order

- **Endpoint**: `PUT /api/internal/interop/orders/{orderId}/approve`
- **Middleware / Akses**: `Internal Only`
- **Payload**:

```typescript
type ApproveOrderPayload = {
  orderId: string;
  items?: Array<{
    sourceLayerId: string;
    externalWmsUrl?: string;
    externalWfsUrl?: string;
  }>;
};
```

- **Response**: `200 OK` / `{ success: true, message: "Order permohonan berhasil divalidasi dan disetujui" }`

## Reject Order

- **Endpoint**: `PUT /api/internal/interop/orders/{orderId}/reject`
- **Middleware / Akses**: `Internal Only`
- **Payload**:

```typescript
type RejectOrderRequest = {
  reason: string;
};
```

- **Response**: `200 OK` / `{ success: true, message: "Order permohonan berhasil ditolak" }`

---

# Statistik & Monitoring Transaksi Internal

Modul monitoring metrik pesanan dan riwayat seluruh transaksi mitra untuk admin internal ATR/BPN.

## Ringkasan Statistik Transaksi & Pesanan

Mengambil ringkasan metrik statistik pesanan di seluruh mitra untuk ditampilkan pada section card atas (pesanan aktif, pesanan selesai, dan total pendapatan/networth PNBP).

- **Endpoint**: `GET /api/internal/transactions/statistics`
- **Middleware / Akses**: `Internal Only`
- **Response**:

```typescript
type InternalTransactionStatisticsResponse = {
  activeOrders: number; // Total pesanan aktif / service yang sudah dibeli mitra dengan status aktif (ready / processing / pending_review)
  settledTransactions: number; // Total transaksi yang berhasil / settled (transactionStatus: "paid" & orderStatus: "ready")
  netWorth: number; // Total akumulasi pendapatan PNBP dari transaksi yang telah settled (dalam Rupiah)
};
```

## Daftar Transaksi Global Internal

Mengambil daftar seluruh transaksi dari seluruh mitra dengan fitur pagination, pencarian (nomor transaksi, nama mitra, kode billing), dan filter status pembayaran maupun tipe seleksi.

- **Endpoint**: `GET /api/internal/transactions`
- **Middleware / Akses**: `Internal Only`
- **Params**:
  - `page?: number` (default: `1`)
  - `pageSize?: number` (default: `10`)
  - `search?: string` (pencarian nomor transaksi, nama mitra, email, atau kode billing)
  - `transactionStatus?: TransactionStatus` (`"paid"` | `"expired"` | `"failed"` | `"refunded"`)
  - `orderStatus?: OrderStatus` (`"pending_payment"` | `"paid"` | `"processing"` | `"pending_review"` | `"ready"` | `"rejected"`)
  - `selectionType?: "catalog" | "upload_aoi" | "draw_aoi"`
  - `startDate?: string` (ISO format, filter rentang tanggal mulai)
  - `endDate?: string` (ISO format, filter rentang tanggal selesai)
- **Response**:

```typescript
type InternalTransactionItem = {
  id: string; // ID transaksi internal
  orderId: string; // ID order
  transactionNumber: string; // Nomor transaksi unik (e.g. "TRX-2026-00123")
  orderNumber?: string; // Nomor order permohonan (e.g. "ORD-2026-00192")
  billingCode: string; // Kode Billing Simponi / PNBP ATR/BPN
  paymentMethod: string; // Metode pembayaran (e.g. "QRIS", "Virtual Account Mandiri")
  transactionStatus: TransactionStatus; // "paid" | "expired" | "failed" | "refunded"
  orderStatus: OrderStatus; // "pending_payment" | "paid" | "processing" | "pending_review" | "ready" | "rejected"
  selectionType: "catalog" | "upload_aoi" | "draw_aoi";
  totalAmount: number; // Total nominal tagihan (IDR)
  mitra: {
    id: string;
    name: string;
    email: string;
    agencyOrCompany?: string;
  };
  createdAt: string; // ISO 8601 Timestamp
  paidAt?: string; // ISO 8601 Timestamp saat pembayaran terkonfirmasi
  expiredAt?: string; // ISO 8601 Timestamp masa berlaku layanan spasial
  billingExpiredAt?: string; // ISO 8601 Timestamp batas waktu pembayaran billing
  itemsCount: number; // Jumlah layer IGT dalam transaksi
  items: Array<{
    id: string;
    sourceLayerId: string;
    sourceLayerTitle: string;
    spatialBasis: "bidang" | "kawasan";
    snapshotFeaturesCount: number;
    snapshotAreaHa?: number;
    unitPrice: number;
    subtotalPrice: number;
    provisionStatus: OrderStatus;
  }>;
};

type InternalTransactionListResponse = {
  items: InternalTransactionItem[];
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

## Detail Transaksi Internal

Mengambil detail lengkap transaksi per id termasuk data layer spasial dan informasi mitra.

- **Endpoint**: `GET /api/internal/transactions/{id}`
- **Middleware / Akses**: `Internal Only`
- **Response**: `InternalTransactionItem`

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

Modul agregasi metrik operasional IGT untuk admin internal ATR/BPN. Diimplementasikan secara modular melalui endpoint terpisah per widget:

## Ringkasan Basis IGT

- **Endpoint**: `GET /api/internal/home/igt-basis`
- **Middleware / Akses**: `Internal Only`
- **Response**:

```typescript
type IgtBasisSummary = {
  field: number;
  area: number;
};
```

## Status Publikasi Layer IGT

- **Endpoint**: `GET /api/internal/home/publication-status`
- **Middleware / Akses**: `Internal Only`
- **Response**:

```typescript
type IgtPublicationStatusSummary = {
  active: number;
  inactive: number;
};
```

## Statistik Registrasi Mitra

- **Endpoint**: `GET /api/internal/home/mitra-registration`
- **Middleware / Akses**: `Internal Only`
- **Response**:

```typescript
type MitraRegistrationSummary = {
  active: number;
  pendingVerification: number;
};
```

## Tren Akuisisi & Pendapatan IGT

- **Endpoint**: `GET /api/internal/home/trends?period={1d|1w|1m|1y|all}`
- **Middleware / Akses**: `Internal Only`
- **Response**:

```typescript
type InternalHomeTrendItem = {
  label: string;
  field: number;
  area: number;
  revenue: number;
};
```

## Leaderboard Mitra & Layer Terpopuler

- **Endpoint**: `GET /api/internal/home/leaderboard?period={1d|1w|1m|1y|all}`
- **Middleware / Akses**: `Internal Only`
- **Response**:

```typescript
type InternalLeaderboardResponse = {
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
