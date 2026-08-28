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
10. [Internal - Interop Batch Review](#10-internal---interop-batch-review)
11. [Internal - Tarif & Pricing Management](#11-internal---tarif--pricing-management)
12. [Internal - Purchase Limit Configuration](#12-internal---purchase-limit-configuration)
13. [Internal - User Management](#13-internal---user-management)
14. [Internal - Dashboard & Statistik Sistem](#14-internal---dashboard--statistik-sistem)

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

Sistem notifikasi in-app untuk Mitra dan Internal user. Setiap notifikasi masuk ke inbox user yang bersangkutan. Pada frontend, setiap notifikasi baru juga memicu visual _toast notification_ secara realtime (via SSE atau polling).

### 3.1 List Notifikasi

- **Endpoint**: `GET /api/notifications`
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
    metadata?: Record<string, unknown>; // misal batchId, rejectionReason, orderId, dll
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
  | "BATCH_PENDING_REVIEW" // → Dikirim ke internal user: ada batch baru perlu direview
  | "BATCH_APPROVED" // → Dikirim ke mitra: batch disetujui, silakan checkout
  | "BATCH_REJECTED" // → Dikirim ke mitra: batch ditolak + reason penolakan
  | "BATCH_EXPIRED" // → Dikirim ke mitra: batch kadaluwarsa, tabel provisioned & layer dihapus
  | "PAYMENT_SETTLED"; // → Dikirim ke mitra: pembayaran lunas & akses layer aktif
```

### 3.2 Tandai Notifikasi Telah Dibaca

- **Endpoint**: `PUT /api/notifications/{id}/read`
- **Response**: `200 OK` / `{ success: true }`

### 3.3 Tandai Semua Notifikasi Telah Dibaca

- **Endpoint**: `PUT /api/notifications/read-all`
- **Response**: `200 OK` / `{ success: true }`

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
      wfsUrl: string; // URL Proxy BE: "/api/proxy/wfs?layerId={id}"
      wfsTypeName: string;
    };
    wms: {
      wmsUrl: string; // URL Proxy BE: "/api/proxy/wms?layerId={id}"
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

Setelah `POST /api/mitra/cart/batches` berhasil (`200 OK`), Backend langsung memicu (_spawn_) asynchronous background job via **Interop Engine**.

#### Flow per Batch:

1. **Batch Item Handling**: 1 batch memuat $N$ layer IGT yang dipilih oleh Mitra.
2. **PostGIS Live Table Creation**: Interop Engine membuat **1 tabel PostGIS per IGT layer per mitra** dengan konvensi penamaan:

   ```text
   igt_provisioned_{mitraId}_{sourceLayerId}
   ```

   > [!NOTE]
   > Format penamaan tidak menyertakan `batchId` karena data bersifat **live/update** (bukan snapshot statis). Jika mitra membeli layer yang sama pada batch berikutnya, tabel yang sama akan di-overwrite / di-reclip berdasarkan AOI / filter terbaru.

3. **Skema Tabel Provisioned (`igt_provisioned_{mitraId}_{sourceLayerId}`)**:
   - `feature_id`: Foreign Key ke Master IGT (digunakan untuk sinkronisasi update otomatis).
   - `geometry`: Hasil pemotongan spasial (`ST_Intersection` / `ST_Clip`) dari master layer IGT sesuai AOI / filter administratif mitra (tipe PostGIS geometry).
   - `source_layer_id`: Referensi ke identifier layer IGT asal.
   - `mitra_id`: Foreign Key kepemilikan data mitra.
   - `batch_id`: ID batch transaksi terakhir yang me-provision tabel ini.
   - `provisioned_at`: Timestamp proses provision / re-clip terakhir.
   - `external_attribute_ref`: _(Nullable)_ Hook untuk integrasi atribut dari sumber eksternal di masa depan.

4. **Penyimpanan Parameter AOI & Filter Administratif di Database (`batch_items`)**:
   - `aoi_polygon` (GeoJSON Polygon/MultiPolygon)
   - `administrative_filter` (JSON provinsi, kabupaten, kecamatan, desa)
   - `cql_filter` (string CQL)
   - `selection_type` (`"catalog"` | `"upload_aoi"` | `"draw_aoi"`)
   - _Parameter ini tersimpan permanen di DB dan digunakan untuk proses re-provision otomatis saat master data IGT diperbarui atau saat re-order batch._

5. **Perlindungan Atribut Private IGT**:
   - Kolom atribut private/sensitif IGT **tidak disimpan di tabel provisioned**, melainkan bersumber dari sistem/tabel eksternal secara modular via referensi `external_attribute_ref`.

6. **GeoServer Provisioned Layer Auto-Publishing**:
   - GeoServer Provisioned mem-publish layer baru secara otomatis dari tabel provisioned (1 layer per tabel PostGIS) dan di-refresh setiap kali tabel diupdate.

7. **Status Transition & Internal Notification**:
   - Setelah seluruh layer di dalam batch berhasil di-provision oleh Interop Engine, status batch berubah menjadi `pending_review`.
   - Notifikasi inbox otomatis dikirimkan ke **Internal User** untuk meninjau permohonan data batch yang baru.

#### Scalability & Auto-Sync Update:

- **Tabel Provisioned Terisolasi**: Bersifat per-mitra (_isolated_), tidak ada data sharing antar mitra.
- **Live Sync**: Ketika layer Master IGT diperbarui, seluruh tabel provisioned yang berelasi akan otomatis di-reclip ulang dan GeoServer layer di-refresh.
- **Subscriber Tracking**: Backend mengelola tabel `master_igt_subscribers` untuk melacak mitra mana saja yang memiliki tabel provisioned aktif dari masing-masing master layer.

#### Infrastruktur GeoServer (2 Server Terpisah):

```
GeoServer Master (Private Network, Internal Only)
└── Hanya diakses Backend Interop Engine untuk proses clipping
└── workspace: master_igt

GeoServer Provisioned (Private Network, Akses via BE Proxy)
└── workspace: provisioned
    └── igt_provisioned_{mitraId}_{sourceLayerId}
```

_Kredensial disimpan pada environment variable Backend:_

```env
GEOSERVER_MASTER_URL=
GEOSERVER_MASTER_USERNAME=
GEOSERVER_MASTER_PASSWORD=

GEOSERVER_PROVISIONED_URL=
GEOSERVER_PROVISIONED_USERNAME=
GEOSERVER_PROVISIONED_PASSWORD=
```

---

### 5.1.2 Validasi Saat Add to Cart

Sebelum batch keranjang dibuat, Backend **wajib** melakukan validasi kuota batas minimum pemesanan:

- **Basis `bidang`**: Minimum **1.000 bidang** per item layer.
- **Basis `kawasan`**: Minimum **1.000 ha** per item layer.
- Nilai ambang batas minimum diambil secara dinamis dari tabel konfigurasi `purchase_limits` (dapat dikelola melalui modul [Internal - Purchase Limit Configuration](#10-internal---purchase-limit-configuration)).

Jika terdapat item yang tidak memenuhi batas minimum, request ditolak dengan respon `400 Bad Request`:

```typescript
type CartValidationErrorResponse = {
  error: "BELOW_MINIMUM_LIMIT";
  message: string;
  detail: Array<{
    sourceLayerId: string;
    spatialBasis: "bidang" | "kawasan";
    requested: number;
    minimum: number;
    unit: "bidang" | "ha";
  }>;
};
```

---

### 5.2 Ambil Daftar Batch di Keranjang

- **Endpoint**: `GET /api/mitra/cart/batches`
- **Params**: `status?: "preparing" | "pending_review" | "approved" | "rejected" | "expired"`
- **Response**:

```typescript
type CartBatchListResponse = {
  batches: Array<{
    batchId: string;
    status: BatchStatus;
    createdAt: string;
    readyAt?: string;
    approvedAt?: string;
    expiredAt?: string; // Datetime ISO (TTL 24 jam setelah status 'approved' untuk hitung mundur countdown)
    rejectionReason?: string; // Terisi jika status = 'rejected'
    totalPrice?: number; // Bernilai undefined/null jika status masih 'preparing' / 'pending_review'
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
  status: BatchStatus;
  createdAt: string;
  readyAt?: string;
  approvedAt?: string;
  expiredAt?: string;
  rejectionReason?: string;
  totalPrice?: number;
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
> **Batch Lifecycle & TTL Countdown**:
>
> ```
> preparing → pending_review → approved → (checkout) → settled
>                            ↘ rejected (wajib ada reason)
>
> approved → expired (TTL 24 jam habis, tabel provisioned + GeoServer layer dihapus)
> ```
>
> - Masa tenggang TTL 24 jam (`expiredAt`) **mulai dihitung saat batch berstatus `approved`**.
> - Selama status batch masih `preparing` atau `pending_review`, nilai total harga dan tarif akhir belum selesai difinalisasi.

### 5.4 Kosongkan / Hapus Batch dari Keranjang

- **Endpoint**: `DELETE /api/mitra/cart/batches/{batchId}`
- **Response**: `200 OK` / `{ success: true, message: "Batch keranjang berhasil dihapus" }`

### 5.5 Re-order Batch Kadaluwarsa (Shortcut)

Memungkinkan Mitra mengajukan ulang permohonan batch yang sudah kadaluwarsa (`expired`) dengan parameter AOI/filter yang sama persis tanpa perlu input ulang dari peta.

- **Endpoint**: `POST /api/mitra/cart/batches/{batchId}/reorder`
- **Payload**: `{}` (Empty JSON — Backend otomatis mengambil AOI & filter dari tabel `batch_items` batch lama)
- **Response**: `AddToCartBatchResponse` (Batch baru dengan status `"preparing"`)

### 5.6 Pembayaran Batch (1 Batch = 1 Transaksi & Request Kode Billing)

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

### 5.7 Cek Status Pembayaran Order (Manual / Trigger)

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

Frontend **dilarang keras** melakukan request langsung ke URL GeoServer production. Seluruh akses GeoServer dialihkan melalui endpoint proxy Backend.

**Autentikasi**: Menggunakan Session / JWT via `httpOnly` cookie yang otomatis disertakan pada setiap request. Frontend tidak menyimpan atau mengirimkan kredensial GeoServer apapun.

**Resolusi GeoServer Internal**:
Backend melakukan resolusi `layerId` secara otomatis berdasarkan status order Mitra:

- **Belum Beli / Permohonan**: Forward request ke **GeoServer Master** (hanya data geometri dasar).
- **Sudah Beli & Lunas (`settled`)**: Forward request ke **GeoServer Provisioned** (tabel PostGIS `igt_provisioned_{mitraId}_{sourceLayerId}` milik mitra).

### 6.1 WMS Proxy

- **Endpoint**: `GET /api/proxy/wms`
- **Query Params**:
  - Standar WMS: `SERVICE`, `REQUEST`, `LAYERS`, `BBOX`, `WIDTH`, `HEIGHT`, `FORMAT`, `SRS` / `CRS`, `TRANSPARENT`, `STYLES`, `VERSION`, dll.
  - Wajib: `layerId` (digunakan Backend untuk resolve layer & validasi akses).
- **Backend Behavior**:
  1. Validasi session cookie $\rightarrow$ resolve `mitraId`.
  2. Cek apakah Mitra memiliki order berstatus `settled` untuk `layerId` tersebut:
     - **Belum Lunas**: Forward ke **GeoServer Master**.
     - **Lunas (`settled`)**: Forward ke **GeoServer Provisioned**.
  3. Override parameter `LAYERS` dengan nama layer GeoServer yang sesuai.
  4. Stream response binary gambar (`image/png`, `image/jpeg`) langsung ke Frontend.
- **Response**: Raw image tile stream dari GeoServer.

### 6.2 WFS Proxy

- **Endpoint**: `GET /api/proxy/wfs`
- **Query Params**:
  - Standar WFS: `SERVICE`, `REQUEST`, `TYPENAMES` / `TYPENAME`, `CQL_FILTER`, `SRSNAME`, `OUTPUTFORMAT`, `MAXFEATURES`, `RESULTTYPE`, `VERSION`, dll.
  - Wajib: `layerId`.
- **Backend Behavior**:
  1. Validasi session cookie $\rightarrow$ resolve `mitraId`.
  2. Cek hak akses & status kepemilikan layer Mitra:
     - **Belum Lunas**: Forward ke **GeoServer Master**.
     - **Lunas (`settled`)**: Forward ke **GeoServer Provisioned** (tabel `igt_provisioned_{mitraId}_{sourceLayerId}`).
  3. Override parameter `TYPENAMES` dengan nama layer yang sesuai.
  4. Stream GeoJSON response (`application/json`) ke Frontend.
- **Response**: `GeoJSON.FeatureCollection`

### 6.3 Security Rules (Wajib Implementasi Backend)

1. **Zero Credential Exposure**: Kredensial GeoServer (Basic Auth / Master Token) **tidak boleh pernah dikirimkan ke Frontend** dalam format apapun.
2. **Session Verification**: Backend wajib memvalidasi token JWT / session pengguna sebelum meneruskan (_forward_) request ke GeoServer.
3. **Prevent Horizontal Access**: Backend memvalidasi bahwa `TYPENAMES` / `LAYERS` yang diminta adalah layer milik mitra yang sedang login. Mitra A tidak dapat mengakses layer hasil provisioning milik Mitra B (`403 Forbidden`).
4. **Rate Limiting**: Penerapan rate limit per `mitraId` per endpoint untuk menjaga stabilitas GeoServer.
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

// 3. Status Batch Aktif Keranjang (Interop Engine Provisioning & Review)
export type BatchStatus =
  | "preparing"
  | "pending_review"
  | "approved"
  | "rejected"
  | "expired";
export type CartBatchStatus = BatchStatus;

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

## 10. Internal - Interop Batch Review

Modul bagi Internal User untuk mereview dan memberikan keputusan persetujuan (_approval_) terhadap permohonan data spasial batch yang telah selesai diproses oleh Interop Engine (`pending_review`).

### 10.1 List Batches Pending Review

- **Endpoint**: `GET /api/internal/interop/batches`
- **Response**:

```typescript
type InternalBatchListResponse = {
  batches: Array<{
    batchId: string;
    mitraId: string;
    mitraName: string;
    status: "pending_review";
    createdAt: string;
    items: Array<{
      id: string;
      sourceLayerId: string;
      sourceLayerTitle: string;
      spatialBasis: "bidang" | "kawasan";
      featuresCount: number;
      areaHa?: number;
      selectionType: "catalog" | "upload_aoi" | "draw_aoi";
    }>;
  }>;
  total: number;
};
```

### 10.2 Detail Batch Review

- **Endpoint**: `GET /api/internal/interop/batches/{batchId}`
- **Response**: `CartBatchDetailResponse`

### 10.3 Approve Batch

Menyetujui batch permohonan data. Status batch berubah menjadi `approved` dan masa tenggang TTL 24 jam (`expiredAt`) mulai dihitung aktif.

- **Endpoint**: `PUT /api/internal/interop/batches/{batchId}/approve`
- **Payload**: `{}` (Empty JSON)
- **Response**: `200 OK` / `{ success: true, message: "Batch berhasil disetujui" }`
- **Side Effect**: Notifikasi inbox (`BATCH_APPROVED`) otomatis dikirimkan ke akun Mitra terkait.

### 10.4 Reject Batch

Menolak batch permohonan data dengan alasan penolakan yang wajib diisi.

- **Endpoint**: `PUT /api/internal/interop/batches/{batchId}/reject`
- **Payload**:

```typescript
type RejectBatchRequest = {
  reason: string; // Wajib diisi, tidak boleh string kosong
};
```

- **Response**: `200 OK` / `{ success: true, message: "Batch berhasil ditolak" }`
- **Side Effect**: Notifikasi inbox (`BATCH_REJECTED`) otomatis dikirimkan ke akun Mitra beserta alasan penolakannya.

---

## 11. Internal - Tarif & Pricing Management

Modul pengelolaan tarif PNBP layer IGT (tarif per bidang objek spasial, tarif per hektar kawasan, ambang batas minimal pembelian, serta kode PNBP resmi ATR/BPN). Nilai tarif dan batas minimal ini digunakan oleh Interop Engine saat validasi keranjang dan kalkulasi total harga batch di keranjang mitra.

### 11.1 List Master Tarif

- **Endpoint**: `GET /api/internal/pricing`
- **Response**:

```typescript
type PricingListResponse = {
  items: Array<TarifItem>;
};

type TarifItem = {
  id: string;
  spatialBasis: "bidang" | "kawasan";
  kodePnbp: string; // Kode akun / klasifikasi PNBP resmi ATR/BPN per basis spasial
  unitPrice: number; // Nilai tarif nominal (IDR)
  unitLabel: string; // "Bidang" | "Ha"
  minPurchase: number; // Batas minimal pembelian (misal: 1000 bidang / 1000 ha)
  minUnit: string; // "Bidang" | "Ha"
  effectiveDate: string;
  updatedAt: string;
  updatedBy: string;
};
```

### 11.2 Update / Set Tarif Layer

- **Endpoint**: `PUT /api/internal/pricing/{id}`
- **Payload**:

```typescript
type UpdateTarifRequest = {
  unitPrice: number;
  kodePnbp: string; // Wajib diisi saat update tarif
  minPurchase?: number; // Nilai ambang batas minimal pembelian yang diperbarui
  effectiveDate?: string;
};
```

---

## 12. Internal - Purchase Limit Configuration

Modul pengelolaan ambang batas minimum pemesanan data spasial IGT (_purchase limit rules_) untuk mencegah permohonan data di bawah kuota minimum.

### 12.1 Get Purchase Limits

- **Endpoint**: `GET /api/internal/purchase-limits`
- **Response**:

```typescript
type PurchaseLimitsResponse = {
  limits: Array<{
    id: string;
    spatialBasis: "bidang" | "kawasan";
    minimumValue: number; // misal: 1000 bidang / 1000 ha
    unit: "bidang" | "ha";
    updatedAt: string;
    updatedBy: string;
  }>;
};
```

### 12.2 Update Purchase Limit

- **Endpoint**: `PUT /api/internal/purchase-limits/{id}`
- **Payload**:

```typescript
type UpdatePurchaseLimitRequest = {
  minimumValue: number;
};
```

- **Response**: `200 OK` / `{ success: true, message: "Batas minimum pembelian berhasil diperbarui" }`

---

## 13. Internal - User Management

Modul pengelolaan akun pengguna sistem, aktivasi status (aktif/nonaktif), penugasan peran (`mitra` vs `internal`), dan statistik agregat pengguna.

### 13.1 List Users

- **Endpoint**: `GET /api/internal/users`
- **Params**:
  - `page?: number`
  - `pageSize?: number`
  - `search?: string`
  - `role?: "internal" | "mitra"`
  - `status?: "active" | "inactive"`
- **Response**:

```typescript
type UserManagementListResponse = {
  items: Array<UserManagementItem>;
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
};

type UserManagementItem = {
  id: string;
  name: string;
  email: string;
  role: "internal" | "mitra";
  agencyOrCompany: string;
  status: "active" | "inactive";
  phoneNumber?: string;
  lastLoginAt?: string;
  createdAt: string;
};
```

### 13.2 User Detail

- **Endpoint**: `GET /api/internal/users/{id}`
- **Response**: `UserManagementItem`

### 13.3 Update Status / Role User

- **Endpoint**: `PUT /api/internal/users/{id}`
- **Payload**:

```typescript
type UpdateUserStatusPayload = {
  status: "active" | "inactive";
  role?: "internal" | "mitra";
};
```

- **Response**: `200 OK` / `{ success: true, message: "Status pengguna berhasil diperbarui" }`

### 13.4 Statistik Pengguna

- **Endpoint**: `GET /api/internal/users/statistics`
- **Response**:

```typescript
type UserManagementStatsResponse = {
  totalUsers: number;
  statusStats: {
    active: number;
    inactive: number;
  };
  roleStats: {
    internal: number;
    mitra: number;
  };
};
```

---

## 14. Internal - Dashboard & Statistik Sistem

Modul agregasi metrik operasional IGT, tren perolehan PNBP spasial, leaderboard mitra & layer terpopuler, serta spesifikasi utilisasi server untuk admin internal ATR/BPN.

### 14.1 Internal Dashboard Overview

- **Endpoint**: `GET /api/internal/home?period={1d|1w|1m|1y|all}`
- **Response**:

```typescript
type InternalHomeDataResponse = {
  dataSummary: Record<
    "1d" | "1w" | "1m" | "1y" | "all",
    {
      field: { active: number; inactive: number };
      area: { active: number; inactive: number };
    }
  >;
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
      field: number; // Volume akuisisi IGT bidang
      area: number; // Volume akuisisi IGT kawasan (ha)
      revenue: number; // PNBP nominal (IDR)
    }>
  >;
  topMitraList: Array<{
    rank: number;
    mitraId: string;
    mitraName: string;
    agencyOrCompany: string;
    totalOrders: number;
    totalVolume: string; // misal "84.500 Bidang"
    totalSpending: number; // Akumulasi spending (IDR)
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
  systemHealth: Array<{
    key: string;
    title: string; // "Beban CPU Cluster", "Penggunaan Memori (RAM)", "Kapasitas Storage Spasial (NVMe)", "Bandwidth & Throughput WFS"
    status: "healthy" | "warning" | "critical";
    value: string;
    subValue: string;
    colorPalette: string;
  }>;
};
```
