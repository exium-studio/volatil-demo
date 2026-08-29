# Volatil Frontend - API & Schema Documentation

Dokumentasi endpoint API, Data Transfer Object (DTO), request/response payload, serta model interoperabilitas data spasial di Volatil.

---

## Daftar Isi

### A. Shared Services (Publik / Lintas Role)

1. [Auth & Session](#1-auth--session)
2. [Pusat Bantuan (Help Center)](#2-pusat-bantuan-help-center)
3. [Notifikasi & Inbox](#3-notifikasi--inbox)
4. [GeoServer Proxy Endpoints](#4-geoserver-proxy-endpoints)

### B. Role: Mitra

5. [Mitra - Data Request & IGT Spasial](#5-mitra---data-request--igt-spasial)
6. [Mitra - Keranjang & Order Provisioning Spasial](#6-mitra---keranjang--order-provisioning-spasial)
7. [Mitra - My Data & Transaksi](#7-mitra---my-data--transaksi)
8. [Mitra - Dashboard & Statistik](#8-mitra---dashboard--statistik)

### C. Role: Internal (Admin / Verifikator)

9. [Internal - Master IGT Layers & Data Management](#9-internal---master-igt-layers--data-management)
10. [Internal - Master GeoServer](#10-internal---master-geoserver)
11. [Internal - Interop Batch Review](#11-internal---interop-batch-review)
12. [Internal - Tarif & Pricing Management](#12-internal---tarif--pricing-management)
13. [Internal - Purchase Limit Configuration](#13-internal---purchase-limit-configuration)
14. [Internal - User Management](#14-internal---user-management)
15. [Internal - Dashboard & Statistik Sistem](#15-internal---dashboard--statistik-sistem)

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

## 4. GeoServer Proxy Endpoints

Frontend **dilarang keras** melakukan request langsung ke URL GeoServer production fisik. Seluruh akses layer spasial dialihkan melalui endpoint proxy Backend.

### Ada 2 Endpoint Proxy Utama (WFS & WMS)

- `GET /api/proxy/geoserver/wms` (Stream Binary Tiles/Image)
- `GET /api/proxy/geoserver/wfs` (Stream GeoJSON Features)

### Skema Akses & Autentikasi:

1. **Master IGT / Katalog Data IGT (Web Client & Internal)**:
   - **Konteks**: Digunakan saat eksplorasi data katalog IGT di modul Mitra (_Data Request_) dan modul Internal (_Manajemen Data IGT_).
   - **Mekanisme Auth**: Dikelola penuh oleh Backend melalui **Session / JWT via `httpOnly` Cookie**.
   - **Parameter FE**: Frontend **tidak perlu** mengirim kredensial ataupun `apiKey`. Frontend cukup mengirimkan parameter **`geoserverId`** (ID master geoserver terdaftar) dan **`typeName`** (atau `layers` pada WMS).
   - **Peran Backend**: Backend mencocokkan `geoserverId` ke tabel Master GeoServer, membaca kredensial terenkripsi di server, menyuntikkan basic auth secara internal, lalu meneruskan request ke GeoServer fisik.
   - contoh url : https://domain-be/proxy/geoserver/wms?geoserverId=alskjdasldkjasldkj;typeName=kontoltempur

2. **Mitra Service URL (Layer Hasil Pembelian / Provisioning)**:
   - **Konteks**: Khusus data/layer hasil provisioning yang sudah dibeli dan berstatus lunas (`settled`) oleh Mitra.
   - **Mekanisme Auth**: Menggunakan **`apiKey`** unik milik Mitra (misal: `?apiKey=mtr_live_xyz...` atau header `X-API-Key`).
   - **Peruntukan**: Disediakan bagi Mitra untuk mengintegrasikan layer yang telah dibeli ke software GIS eksternal (seperti QGIS, ArcGIS, atau script automasi data) di luar aplikasi web browser Volatil.
   - contoh url : https://domain-be/proxy/geoserver/wms?geoserverId=alskjdasldkjasldkj;typeName=kontoltempur;apiKey=mtr_live_xyz

   Akses geoserver mitra hardcode by system, config di env aja, karna memang termasuk desain arsitektur system, ada 1 geoserver esential untuk mitra volatil

   # GeoServer Mitra Volatil

   VITE_GEOSERVER_MITRA_VOLATIL_URL=https://geoserver-volatil.exium.web.id/geoserver
   VITE_GEOSERVER_MITRA_VOLATIL_CREDENTIAL_USERNAME=admin
   VITE_GEOSERVER_MITRA_VOLATIL_CREDENTIAL_PASSWORD=geoserver

---

### 4.1 WMS Proxy

- **Endpoint**: `GET /api/proxy/wms`
- **Query Params**:
  - **Identifikasi Server & Layer**:
    - `geoserverId`: ID Master GeoServer target (wajib).
    - `layers` / `typeName`: Nama workspace dan layer target (contoh: `testing_workspace:TEST_BIDANG_TANAH` atau `volatil:igt_provisioned_mitra1_bidang`).
  - **Standar OGC WMS**: `SERVICE=WMS`, `REQUEST=GetMap`, `BBOX`, `WIDTH`, `HEIGHT`, `FORMAT=image/png`, `SRS` / `CRS=EPSG:4326`, `TRANSPARENT=TRUE`, `STYLES`, `VERSION=1.3.0`, dll.
- **Backend Behavior**:
  1. Validasi session cookie $\rightarrow$ resolve user/mitra.
  2. Ambil metadata server fisik dari tabel Master GeoServer berdasarkan `geoserverId`.
  3. Teruskan request ke server target dengan kredensial tersimpan secara aman.
  4. Stream response binary gambar tile (`image/png`, `image/jpeg`) langsung ke browser FE.
- **Response**: Raw image tile stream dari GeoServer.

### 4.2 WFS Proxy

- **Endpoint**: `GET /api/proxy/wfs`
- **Query Params**:
  - **Identifikasi Server & Layer**:
    - `geoserverId`: ID Master GeoServer target (wajib).
    - `typeName` / `typeNames`: Nama workspace dan feature type target.
  - **Standar OGC WFS**: `SERVICE=WFS`, `REQUEST=GetFeature`, `CQL_FILTER`, `SRSNAME=EPSG:4326`, `OUTPUTFORMAT=application/json`, `MAXFEATURES`, `RESULTTYPE`, `VERSION=2.0.0` / `1.1.0`, dll.
- **Backend Behavior**:
  1. Validasi session cookie $\rightarrow$ resolve user/mitra.
  2. Ambil konfigurasi server dari Master GeoServer via `geoserverId`.
  3. Eksekusi query WFS ke GeoServer target.
  4. Stream data GeoJSON (`application/json`) ke browser FE.
- **Response**: `GeoJSON.FeatureCollection`

### 4.3 Security Rules (Wajib Implementasi Backend)

1. **Zero Credential Exposure**: Kredensial GeoServer (Basic Auth / Master Password) **tidak boleh pernah dikirimkan ke Frontend** dalam format apapun.
2. **Session Verification**: Backend wajib memvalidasi token JWT / session pengguna sebelum meneruskan (_forward_) request ke GeoServer.
3. **Prevent Horizontal Access**: Backend memvalidasi bahwa layer hasil provisioning hanya dapat diakses oleh mitra pemilik order atau pengguna internal yang berwenang (`403 Forbidden`).
4. **Rate Limiting**: Penerapan rate limit per user/session untuk menjaga stabilitas instance GeoServer.
5. **Audit Logging**: Mencatat log akses WFS/WMS setiap kali request dieksekusi (parameter: `userId`/`mitraId`, `geoserverId`, `typeName`, `timestamp`, `ipAddress`).

---

# B. Role: Mitra

## 5. Mitra - Data Request & IGT Spasial

Modul eksplorasi layer IGT aktif, filter spasial wilayah administrasi, serta query feature via WFS/AOI untuk pengajuan data mitra.

### 5.1 List IGT Layers (Public / Active Layers)

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

### 5.2 Query IGT by AOI (Polygon / Upload SHP/GeoJSON)

- **By AOI Polygon**: `POST /api/mitra/data-request/by-aoi`
  - **Payload**: GeoJSON Polygon (`{ geometry: GeoJSON.Polygon }`)
- **By Uploaded File**: `POST /api/mitra/data-request/upload-aoi`
  - **Payload**: `FormData` (`file: File`) (.zip shp, .geojson, .kml)
- **Get Catalog**: `GET /api/mitra/data-request/catalog`
  - **Params**: `page?: number`, `pageSize?: number`, `search?: string`

### 5.3 Filter Options Wilayah & Tema

- `GET /api/mitra/data-request/filter-options/basis`
- `GET /api/mitra/data-request/filter-options/tema`
- `GET /api/igt/filter-options/kecamatan?kabupatenId={id}`
- `GET /api/igt/filter-options/kelurahan?kecamatanId={id}`

---

## 6. Mitra - Keranjang & Order Batch Provisioning Spasial

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
// 1. Basis IGT Data IGT
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
    geoserverBaseUrl: string; // Base URL GeoServer workspace
    typeName: string; // Format: workspace:layerName
    wfsUrl: string; // Generated by BE: {geoserverBaseUrl}/ows
    wmsUrl: string; // Generated by BE: {geoserverBaseUrl}/wms
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
  geoserverBaseUrl: string; // Base URL GeoServer workspace — contoh: https://igtpr.atrbpn.go.id/geoserver/testing_workspace
  typeName: string; // Format: workspace:layerName — contoh: testing_workspace:TEST_BIDANG_TANAH
  wfsUrl: string; // Generated by FE: {geoserverBaseUrl}/ows
  wmsUrl: string; // Generated by FE: {geoserverBaseUrl}/wms
};
```

### 9.3 Update Master IGT Layer

- **Endpoint**: `PUT /api/internal/igt-layers/{id}`
- **Payload**: `Partial<CreateMasterIgtLayerPayload>`

### 9.4 Delete Master IGT Layer

- **Endpoint**: `DELETE /api/internal/igt-layers/{id}`
- **Response**: `200 OK` / `{ success: true }`

### 9.5 Get GeoServer Workspaces (Dropdown Helper)

Mengambil daftar workspace dari GeoServer yang dipilih untuk kebutuhan dropdown form registrasi layer IGT baru. List GeoServer itu sendiri diambil via `GET /api/internal/master-geoserver` (Modul 10.1).

- **Endpoint**: `GET /api/internal/master-geoserver/{geoserverId}/workspaces`
- **Response**:

```typescript
type GeoServerWorkspacesResponse = {
  workspaces: string[]; // Contoh: ["testing_workspace", "volatil_staging", "atr_kawasan"]
};
```

### 9.6 Get GeoServer Layers by Workspace (Dropdown Helper)

Mengambil daftar layer/featuretype yang tersedia di dalam workspace yang dipilih beserta metadata spasialnya (bounding box, spatial basis) agar form registrasi layer IGT dapat terisi otomatis.

- **Endpoint**: `GET /api/internal/master-geoserver/{geoserverId}/workspaces/{workspaceName}/layers`
- **Response**:

```typescript
type GeoServerWorkspaceLayersResponse = {
  layers: Array<{
    name: string; // "TEST_BIDANG_TANAH"
    title: string; // "Bidang Tanah UAT Badung"
    typeName: string; // "testing_workspace:TEST_BIDANG_TANAH"
    abstract?: string;
    srs: string; // "EPSG:4326"
    geometryType?: "Polygon" | "MultiPolygon" | "Point" | "LineString";
    spatialBasis?: "bidang" | "kawasan"; // Auto-detected by Backend
    bbox?: [number, number, number, number]; // [minX, minY, maxX, maxY]
  }>;
};
```

---

## 10. Internal - Master GeoServer

Modul pengelolaan master kredensial dan endpoint GeoServer utama di lingkungan internal ATR/BPN. Endpoint ini digunakan untuk registrasi server penyedia layer spasial serta provisioning auto-publishing layer PostGIS.

Pengahapusan data GeoServer menerapkan **Soft Delete (`deletedAt`)** dengan masa retensi otomatis 30 hari sebelum dihapus permanen oleh background cron job, agar batch transaksi permohonan data mitra yang sedang dalam antrean pemrosesan tidak terganggu.

### 10.1 List Master GeoServer

- **Endpoint**: `GET /api/internal/master-geoserver`
- **Query Params**:
  - `page?: number` (Default: `1`)
  - `pageSize?: number` (Default: `10`)
  - `search?: string` (Pencarian nama server, URL, atau username)
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

### 10.2 Detail Master GeoServer

- **Endpoint**: `GET /api/internal/master-geoserver/{id}`
- **Response**: `MasterGeoserverItem`

### 10.3 Create Master GeoServer

- **Endpoint**: `POST /api/internal/master-geoserver`
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

- **Response**: `MasterGeoserverItem`

### 10.4 Update Master GeoServer

- **Endpoint**: `PUT /api/internal/master-geoserver/{id}`
- **Payload**: `Partial<CreateMasterGeoserverPayload>`
- **Response**: `MasterGeoserverItem`

### 10.5 Delete Master GeoServer (Soft Delete)

Menandai server sebagai terarsip / terhapus secara logis (`deletedAt` terisi timestamp).

- **Endpoint**: `DELETE /api/internal/master-geoserver/{id}`
- **Response**: `200 OK` / `{ success: true, deletedAt: string }`

---

## 11. Internal - Interop Batch Review

Modul bagi Internal User untuk mereview dan memberikan keputusan persetujuan (_approval_) terhadap permohonan data spasial batch yang telah selesai diproses oleh Interop Engine (`pending_review`).

### 11.1 List Batches Pending Review

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

### 11.2 Detail Batch Review

- **Endpoint**: `GET /api/internal/interop/batches/{batchId}`
- **Response**: `CartBatchDetailResponse`

### 11.3 Approve Batch

Menyetujui batch permohonan data. Status batch berubah menjadi `approved` dan masa tenggang TTL 24 jam (`expiredAt`) mulai dihitung aktif.

- **Endpoint**: `PUT /api/internal/interop/batches/{batchId}/approve`
- **Payload**: `{}` (Empty JSON)
- **Response**: `200 OK` / `{ success: true, message: "Batch berhasil disetujui" }`
- **Side Effect**: Notifikasi inbox (`BATCH_APPROVED`) otomatis dikirimkan ke akun Mitra terkait.

### 11.4 Reject Batch

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

## 12. Internal - Tarif & Pricing Management

Modul pengelolaan tarif PNBP layer IGT (tarif per bidang objek spasial, tarif per hektar kawasan, ambang batas minimal pembelian, serta kode PNBP resmi ATR/BPN). Nilai tarif dan batas minimal ini digunakan oleh Interop Engine saat validasi keranjang dan kalkulasi total harga batch di keranjang mitra.

### 12.1 List Master Tarif

- **Endpoint**: `GET /api/internal/pricing`
- **Params**:
  - `page?: number`
  - `pageSize?: number`
  - `search?: string`
  - `spatialBasis?: "bidang" | "kawasan"`
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
  kodePnbp?: string; // Kode akun / klasifikasi PNBP resmi ATR/BPN
  spatialBasis: "bidang" | "kawasan";
  unitPrice: number; // Nilai tarif nominal (IDR)
  unitLabel: string; // misal: "per bidang" | "per hektar"
  minPurchase?: number; // Batas minimal pembelian kuota
  minUnit?: string; // "Bidang" | "Ha"
  effectiveDate: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};
```

### 11.2 Create Master Tarif

- **Endpoint**: `POST /api/internal/pricing`
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

- **Response**: `201 Created` / `{ success: true, message: "Tarif berhasil ditambahkan" }`

### 11.3 Update / Set Tarif Layer

- **Endpoint**: `PUT /api/internal/pricing/{id}`
- **Payload**:

```typescript
type UpdatePricingPayload = {
  id: string;
  unitPrice: number;
  kodePnbp?: string;
  minPurchase?: number;
  description?: string;
};
```

- **Response**: `200 OK` / `{ success: true, message: "Tarif berhasil diperbarui" }`

---

## 13. Internal - Purchase Limit Configuration

Modul pengelolaan ambang batas minimum pemesanan data spasial IGT (_purchase limit rules_) untuk mencegah permohonan data di bawah kuota minimum.

### 13.1 Get Purchase Limits

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

### 13.2 Update Purchase Limit

- **Endpoint**: `PUT /api/internal/purchase-limits/{id}`
- **Payload**:

```typescript
type UpdatePurchaseLimitRequest = {
  minimumValue: number;
};
```

- **Response**: `200 OK` / `{ success: true, message: "Batas minimum pembelian berhasil diperbarui" }`

---

## 14. Internal - User Management

Modul pengelolaan akun pengguna sistem, aktivasi status (aktif/nonaktif), penugasan peran (`mitra` vs `internal`), dan statistik agregat pengguna.

### 14.1 List Users

- **Endpoint**: `GET /api/internal/user-management`
- **Params**:
  - `page?: number`
  - `limit?: number` (atau `pageSize`)
  - `search?: string`
  - `role?: "internal" | "mitra"`
  - `status?: "active" | "inactive"`
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

### 14.2 User Detail

- **Endpoint**: `GET /api/internal/user-management/{id}`
- **Response**:

```typescript
type AdminUserDetailApiResponse = {
  data: BackendAdminUserItem;
};
```

### 14.3 Update Status User

- **Endpoint**: `PATCH /api/internal/user-management/{id}/status`
- **Payload**:

```typescript
type UpdateUserStatusPayload = {
  status: "active" | "inactive";
};
```

- **Response**: `200 OK` / `AdminUserDetailApiResponse`

### 14.4 Statistik Pengguna

- **Endpoint**: `GET /api/internal/user-management/statistics`
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

## 15. Internal - Dashboard & Statistik Sistem

Modul agregasi metrik operasional IGT (basis spasial, status publikasi, registrasi mitra), tren perolehan PNBP spasial, leaderboard mitra & layer terpopuler untuk admin internal ATR/BPN.

### 15.1 Internal Dashboard Overview

- **Endpoint**: `GET /api/internal/home?period={1d|1w|1m|1y|all}`
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
};
```
