# Volatil - API & Schema Documentation

Dokumentasi endpoint API, Data Transfer Object (DTO), request/response payload, serta model interoperabilitas data spasial di Volatil.

---

## Ringkasan Hak Akses & Kategori Middleware

Endpoint dikelompokkan ke dalam 4 kategori hak akses utama:

1. **`[PUBLIC]`**: Endpoint publik yang dapat diakses tanpa autentikasi/token (Login, Pendaftaran Mitra, Cek Status Registrasi, WFS Batas Wilayah Administrasi).
2. **`[SHARED / AUTHENTICATED]`**: Endpoint privat yang dapat diakses oleh semua pengguna terautentikasi (baik role `mitra` maupun `internal`) menggunakan session token / cookie (Profile, Logout, Help Center, Inbox, GeoServer Proxy).
3. **`[MITRA ONLY]`**: Endpoint khusus pengguna dengan role `mitra` (Dashboard Mitra, Data Request Spasial, Keranjang & Checkout, My Data, Riwayat Transaksi).
4. **`[INTERNAL ONLY]`**: Endpoint khusus administrator dan verifikator internal ATR/BPN (Dashboard Sistem, Verifikasi Pendaftaran Mitra, Review Permohonan Spasial, Master IGT Layers & Sinkronisasi, Master GeoServer, Monitoring Transaksi, Tarif PNBP, Purchase Limit, User Management).

---

## Daftar Isi

- [1. PUBLIC ENDPOINTS](#1-public-endpoints)
  - [1.1 Auth & Session](#11-auth--session)
  - [1.2 Pendaftaran Calon Mitra](#12-pendaftaran-calon-mitra)
  - [1.3 Geometri Wilayah Administrasi (WFS Resolver)](#13-geometri-wilayah-administrasi-wfs-resolver)
- [2. SHARED ENDPOINTS (AUTHENTICATED)](#2-shared-endpoints-authenticated)
  - [2.1 Profil & Session](#21-profil--session)
  - [2.2 Pusat Bantuan (Help Center)](#22-pusat-bantuan-help-center)
  - [2.3 Notifikasi & Inbox](#23-notifikasi--inbox)
  - [2.4 GeoServer Proxy](#24-geoserver-proxy)
- [3. MITRA ONLY ENDPOINTS](#3-mitra-only-endpoints)
  - [3.1 Dashboard & Statistik Mitra](#31-dashboard--statistik-mitra)
  - [3.2 Data Request & Eksplorasi IGT Spasial](#32-data-request--eksplorasi-igt-spasial)
  - [3.3 Keranjang & Order Provisioning Spasial](#33-keranjang--order-provisioning-spasial)
  - [3.4 My Data & Riwayat Transaksi](#34-my-data--riwayat-transaksi)
- [4. INTERNAL ONLY ENDPOINTS](#4-internal-only-endpoints)
  - [4.1 Dashboard & Statistik Sistem](#41-dashboard--statistik-sistem)
  - [4.2 Pendaftaran Kemitraan (Mitra Registration)](#42-pendaftaran-kemitraan-mitra-registration)
  - [4.3 Review Permohonan Data Spasial (Interop Order Review)](#43-review-permohonan-data-spasial-interop-order-review)
  - [4.4 Master IGT Layers & Sinkronisasi Mitra](#44-master-igt-layers--sinkronisasi-mitra)
  - [4.5 Master GeoServer](#45-master-geoserver)
  - [4.6 Monitoring & Statistik Transaksi Internal](#46-monitoring--statistik-transaksi-internal)
  - [4.7 Tarif PNBP & Pricing Management](#47-tarif-pnbp--pricing-management)
  - [4.8 Batas Pembelian (Purchase Limit)](#48-batas-pembelian-purchase-limit)
  - [4.9 User Management](#49-user-management)
- [5. KAMUS ENUM & SSOT STATUS](#5-kamus-enum--ssot-status)

---

# 1. PUBLIC ENDPOINTS

Endpoint terbuka yang dapat diakses oleh publik tanpa memerlukan session token / header Authorization.

## 1.1 Auth & Session

### Sign In / Login
- **Endpoint**: `POST /api/auth/login`
- **Akses**: `Public`
- **Payload**:
```typescript
type SignInPayload = {
  email: string;
  password: string;
};
```
- **Response (200 OK)**:
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

---

## 1.2 Pendaftaran Calon Mitra

### Registrasi Mitra Baru
- **Endpoint**: `POST /api/auth/register`
- **Akses**: `Public`
- **Payload**: `multipart/form-data`
  - `namaInstansi` *(string, required)*: Nama instansi / perusahaan
  - `alamatKantor` *(string, required)*: Alamat kantor operasional
  - `nib` *(string, required)*: Nomor Induk Berusaha
  - `npwp` *(string, required)*: Nomor Pokok Wajib Pajak
  - `website` *(string, optional)*: URL website resmi
  - `namaPenanggungJawab` *(string, required)*: Nama PIC
  - `jabatan` *(string, required)*: Jabatan PIC
  - `email` *(string, required)*: Email resmi calon mitra (untuk akun SSO)
  - `nomorHp` *(string, required)*: Nomor HP / WhatsApp aktif
  - `suratPermohonan` *(file, required)*: Surat permohonan kerjasama kemitraan (PDF)
  - `dokumenDik` *(file, required)*: Dokumen Informasi Kebutuhan Data (DIK) (PDF)
  - `suratPernyataanHukum` *(file, required)*: Surat pernyataan tunduk pada ketentuan hukum (PDF)
  - `suratKomitmenEvaluasi` *(file, required)*: Surat komitmen evaluasi berkala pemanfaatan IGT (PDF)
  - `suratKomitmenPerbaikan` *(file, required)*: Surat komitmen perbaikan mutu & kepatuhan data (PDF)
  - `proposalTeknis` *(file, required)*: Proposal teknis rencana pemanfaatan spasial (PDF)
- **Response (201 Created)**:
```typescript
type MitraRegistrationCreatedData = {
  registrationNumber: string;
  message: string;
};
```

### Cek Status Registrasi Mitra
- **Endpoint**: `GET /api/auth/registration-status/{registrationNumber}`
- **Akses**: `Public`
- **Response (200 OK)**:
```typescript
type MitraRegistrationStatusData = {
  registrationNumber: string;
  namaInstansi: string;
  status: "pending_verification" | "verified" | "rejected";
  statusDescription?: string;
  contractDocument?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt?: string;
};
```

---

## 1.3 Geometri Wilayah Administrasi (WFS Resolver)

### WFS Batas Wilayah Administrasi
Digunakan untuk mengambil GeoJSON polygon geometri batas wilayah administrasi terdalam yang dipilih user (Provinsi / Kabupaten / Kecamatan / Kelurahan) via GeoServer WFS Proxy:
- **Endpoint**: `GET /api/proxy/wfs`
- **Akses**: `Public`
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
- **Output**: `GeoJSON.FeatureCollection` (Polygon / MultiPolygon) yang di-resolve menjadi single `aoiPolygon`.

---

# 2. SHARED ENDPOINTS (AUTHENTICATED)

Endpoint privat yang memerlukan token / cookie autentikasi yang valid dan dapat diakses oleh role `mitra` maupun `internal`.

## 2.1 Profil & Session

### User Profile
- **Endpoint**: `GET /api/auth/me`
- **Akses**: `Authenticated (Mitra & Internal)`
- **Response (200 OK)**:
```typescript
type UserProfileResponse = {
  id: string | number;
  name: string;
  email: string;
  role: "internal" | "mitra";
  organizationName?: string;
};
```

### Logout
- **Endpoint**: `POST /api/auth/logout`
- **Akses**: `Authenticated (Mitra & Internal)`
- **Response (200 OK)**: `{ success: true, message: "Logged out successfully" }`

---

## 2.2 Pusat Bantuan (Help Center)

### Get List Tiket
- **Endpoint**: `GET /api/tickets`
- **Akses**: `Authenticated (Mitra & Internal)` *(Mitra hanya melihat tiket miliknya, Internal melihat semua tiket)*
- **Params**:
  - `scope?: "all" | "my"`
  - `status?: "active" | "history" | "submitted" | "in_review" | "in_progress" | "resolved" | "rejected"`
  - `search?: string`
  - `page?: number`
  - `limit?: number`
- **Response (200 OK)**:
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

### Create Tiket Laporan
- **Endpoint**: `POST /api/tickets`
- **Akses**: `Authenticated (Mitra & Internal)`
- **Payload**: `multipart/form-data`
  - `title` *(string, required)*: Judul laporan
  - `description` *(string, required)*: Rincian kendala
  - `transactionId` *(string, optional)*: ID transaksi terkait
  - `priority` *(string, optional)*: `low` | `medium` | `high` | `urgent`
  - `category` *(string, optional)*: Kategori kendala
  - `files` *(binary array, optional)*: Berkas lampiran foto, dokumen, atau video

### Detail Tiket
- **Endpoint**: `GET /api/tickets/{id}`
- **Akses**: `Authenticated (Mitra & Internal)`

### Balas Tiket (Reply Ticket)
- **Endpoint**: `POST /api/tickets/{id}/reply`
- **Akses**: `Authenticated (Mitra & Internal)`
- **Payload**: `multipart/form-data` (`message`, `status`, `files`)

---

## 2.3 Notifikasi & Inbox

### Get List Inbox / Notifikasi
- **Endpoint**: `GET /api/inbox`
- **Akses**: `Authenticated (Mitra & Internal)`
- **Params**:
  - `page?: number`
  - `pageSize?: number`
  - `category?: "transaksi" | "sistem" | "bantuan" | "akun"`
  - `isRead?: boolean`
  - `search?: string`
- **Response (200 OK)**:
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

### Tandai Notifikasi Telah Dibaca
- **Endpoint**: `PATCH /api/inbox/{id}/read`
- **Akses**: `Authenticated (Mitra & Internal)`
- **Response (200 OK)**: `{ success: true }`

### Tandai Semua Notifikasi Telah Dibaca
- **Endpoint**: `PATCH /api/inbox/read-all`
- **Akses**: `Authenticated (Mitra & Internal)`
- **Response (200 OK)**: `{ success: true }`

### Hapus Notifikasi
- **Endpoint**: `DELETE /api/inbox/{id}`
- **Akses**: `Authenticated (Mitra & Internal)`

### Hapus Semua Notifikasi
- **Endpoint**: `DELETE /api/inbox/clear-all`
- **Akses**: `Authenticated (Mitra & Internal)`

---

## 2.4 GeoServer Proxy

Seluruh akses tile dan fitur spasial dialihkan melalui endpoint proxy Backend demi keamanan kredensial master GeoServer.

### WMS Proxy
- **Endpoint**: `GET /api/proxy/wms`
- **Akses**: `Authenticated (Mitra & Internal)` *(via cookie)* atau `API Key (Mitra Service)` *(via `apiKey` query param / header)*
- **Query Params**:
  - `layerId` *(string, required)*: ID layer target (contoh: `testing_workspace:TEST_BIDANG_TANAH`).
  - Standar OGC WMS (`SERVICE=WMS`, `REQUEST=GetMap`, `BBOX`, `WIDTH`, `HEIGHT`, `FORMAT=image/png`, `SRS=EPSG:3857`, dll.)
- **Response**: Raw image tile stream dari GeoServer fisik.

### WFS Proxy
- **Endpoint**: `GET /api/proxy/wfs`
- **Akses**: `Authenticated (Mitra & Internal)` *(via cookie)*
- **Query Params**:
  - `layerId` *(string, required)*: ID layer target.
  - Standar OGC WFS (`SERVICE=WFS`, `REQUEST=GetFeature`, `CQL_FILTER`, `SRSNAME=EPSG:4326`, `OUTPUTFORMAT=application/json`, dll.)
- **Response**: `GeoJSON.FeatureCollection` / JSON Schema.

---

# 3. MITRA ONLY ENDPOINTS

Endpoint khusus yang hanya dapat diakses oleh user dengan role `mitra`.

## 3.1 Dashboard & Statistik Mitra (Mitra Home)

Setiap widget/section pada halaman Mitra Home memiliki endpoint independen agar data dimuat secara modular:

### 3.1.1 Ketersediaan Data Spasial IGT (Data Availability)
Menyajikan statistik total ketersediaan dataset spasial IGT yang terintegrasi di sistem (Total Layer, Berbasis Bidang, dan Berbasis Kawasan).
- **Endpoint**: `GET /api/mitra/home/data-availability`
- **Akses**: `Mitra Only`
- **Header**: `Authorization: Bearer <token>` atau Session Cookie
- **Response (200 OK)**:
```typescript
type MitraDataAvailabilityResponse = {
  success: boolean;
  message?: string;
  data: {
    totalIgt: number; // Total seluruh dataset IGT terintegrasi
    bidang: number;   // Total layer IGT berbasis bidang tanah / persil
    kawasan: number;  // Total layer IGT berbasis kawasan / tata ruang
  };
};
```
*Contoh Response JSON:*
```json
{
  "success": true,
  "data": {
    "totalIgt": 30,
    "bidang": 10,
    "kawasan": 20
  }
}
```

---

### 3.1.2 Ringkasan Data Anda (Data Summary)
Menyajikan ringkasan status kepemilikan data IGT milik akun mitra yang sedang login (Aktif, Hampir Kedaluwarsa, dan Kedaluwarsa) untuk tipe Bidang dan Kawasan sesuai filter periode.
- **Endpoint**: `GET /api/mitra/home/data-summary`
- **Akses**: `Mitra Only`
- **Query Params**:
  - `period?: "1d" | "1w" | "1m" | "1y" | "all"` (Default: `"all"`)
- **Response (200 OK)**:
```typescript
type MitraDataSummaryResponse = {
  success: boolean;
  message?: string;
  data: {
    field: {
      active: number;
      almostExpired: number;
      expired: number;
    };
    area: {
      active: number;
      almostExpired: number;
      expired: number;
    };
  };
};
```
*Contoh Response JSON:*
```json
{
  "success": true,
  "data": {
    "field": {
      "active": 220,
      "almostExpired": 35,
      "expired": 18
    },
    "area": {
      "active": 110,
      "almostExpired": 18,
      "expired": 7
    }
  }
}
```

---

### 3.1.3 Ringkasan Keranjang Pembelian (Cart Summary)
Menyajikan ringkasan item yang ada di keranjang belanja aktif milik mitra (Total bidang, total luas kawasan, total dataset, dan subtotal biaya).
- **Endpoint**: `GET /api/mitra/home/cart-summary`
- **Akses**: `Mitra Only`
- **Response (200 OK)**:
```typescript
type MitraCartSummaryResponse = {
  success: boolean;
  message?: string;
  data: {
    totalField: number;    // Total kuantitas bidang
    totalArea: number;     // Total luas kawasan (Hektar / ha)
    totalIgtData: number;  // Total layer/dataset IGT di keranjang
    subtotalPrice: number; // Subtotal nominal harga (IDR)
  };
};
```
*Contoh Response JSON:*
```json
{
  "success": true,
  "data": {
    "totalField": 12,
    "totalArea": 4,
    "totalIgtData": 16,
    "subtotalPrice": 15000000
  }
}
```

---

### 3.1.4 Statistik Alur Keuangan (Financial Flow)
Menyajikan data grafik runtun waktu (*time series*) transaksi pengeluaran pembelian data spasial mitra berdasarkan periode.
- **Endpoint**: `GET /api/mitra/home/financial-flow`
- **Akses**: `Mitra Only`
- **Query Params**:
  - `period?: "1d" | "1w" | "1m" | "1y" | "all"` (Default: `"all"`)
- **Response (200 OK)**:
```typescript
type MitraFinancialFlowResponse = {
  success: boolean;
  message?: string;
  data: {
    period: "1d" | "1w" | "1m" | "1y" | "all";
    totalSpending?: number;
    currency?: string;
    breakdown: Array<{
      label: string; // Label waktu (e.g. "00:00", "Sen", "Minggu 1", "Jan", "2024")
      sale: number;  // Nominal transaksi pada titik waktu tersebut (IDR)
    }>;
  };
};
```
*Contoh Response JSON:*
```json
{
  "success": true,
  "data": {
    "period": "1w",
    "totalSpending": 44400000,
    "currency": "IDR",
    "breakdown": [
      { "label": "Sen", "sale": 4500000 },
      { "label": "Sel", "sale": 5200000 },
      { "label": "Rab", "sale": 3800000 },
      { "label": "Kam", "sale": 6000000 },
      { "label": "Jum", "sale": 7500000 },
      { "label": "Sab", "sale": 9000000 },
      { "label": "Min", "sale": 8200000 }
    ]
  }
}
```

---

### 3.1.5 Riwayat Transaksi Terbaru (Last Transactions)
Menyajikan 5 transaksi paling baru milik mitra untuk tabel widget transaksi terakhir.
- **Endpoint**: `GET /api/mitra/transactions` *(atau `GET /api/transactions`)*
- **Akses**: `Mitra Only`
- **Query Params**:
  - `page=1`
  - `pageSize=5`
  - `sortOrder?: "desc"`
- **Response (200 OK)**: Format paginated list standar transaksi (Lihat detail DTO di [Seksi 3.4](#34-my-data--riwayat-transaksi)).

---

## 3.2 Data Request & Eksplorasi IGT Spasial

### List IGT Layers Aktif
- **Endpoint**: `GET /api/mitra/igt-layers`
- **Akses**: `Mitra Only`
- **Params**: `page?: number`, `limit?: number`, `search?: string`, `basis?: "bidang" | "kawasan"`, `tema?: string`
- **Response (200 OK)**:
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

### Query IGT by AOI Polygon
- **Endpoint**: `POST /api/mitra/data-request/by-aoi`
- **Akses**: `Mitra Only`
- **Payload**: `{ geometry: GeoJSON.Polygon }`

### Query IGT by Upload AOI File
- **Endpoint**: `POST /api/mitra/data-request/upload-aoi`
- **Akses**: `Mitra Only`
- **Payload**: `FormData` (`file: File`) (.zip shp, .geojson, .kml)

### Get IGT Catalog
- **Endpoint**: `GET /api/mitra/data-request/catalog`
- **Akses**: `Mitra Only`
- **Params**: `page?: number`, `pageSize?: number`, `search?: string`

### Filter Options Wilayah & Tema
- `GET /api/mitra/data-request/filter-options/basis` — **Akses**: `Mitra Only`
- `GET /api/mitra/data-request/filter-options/tema` — **Akses**: `Mitra Only`

### Kebijakan Tarif & Batas Pembelian (Pricing & Policies)
- **Endpoint**: `GET /api/mitra/data-request/policies`
- **Akses**: `Mitra Only`
- **Response (200 OK)**:
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

## 3.3 Keranjang & Order Provisioning Spasial

### Add to Cart (Buat Order Keranjang)
- **Endpoint**: `POST /api/mitra/cart/orders`
- **Akses**: `Mitra Only`
- **Payload**:
```typescript
type AddToCartOrderRequest = {
  selectionType: "catalog" | "upload_aoi" | "draw_aoi";
  aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
  coveragePolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
  items: Array<{
    sourceLayerId: string;
    cqlFilter?: string;
    wfsUrl?: string;
    wmsUrl?: string;
  }>;
};
```
- **Response (201 Created)**:
```typescript
type AddToCartOrderResponse = {
  orderId: string;
  status: OrderStatus;
  estimatedTotalPrice: number;
  createdAt: string;
};
```

### Ambil Daftar Order di Keranjang
- **Endpoint**: `GET /api/mitra/cart/orders`
- **Akses**: `Mitra Only`
- **Params**: `status?: OrderStatus`
- **Response (200 OK)**:
```typescript
type OrderListResponse = {
  orders: Array<{
    orderId: string;
    status: OrderStatus;
    selectionType: "catalog" | "upload_aoi" | "draw_aoi";
    aoiPolygon?: GeoJSON.MultiPolygon | GeoJSON.Polygon;
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
      bbox?: [number, number, number, number];
    }>;
  }>;
  total: number;
};
```

### Ambil Detail Order di Keranjang
- **Endpoint**: `GET /api/mitra/cart/orders/{orderId}`
- **Akses**: `Mitra Only`

### Hapus Order dari Keranjang
- **Endpoint**: `DELETE /api/mitra/cart/orders/{orderId}`
- **Akses**: `Mitra Only`

### Re-order Pesanan
- **Endpoint**: `POST /api/mitra/cart/orders/{orderId}/reorder`
- **Akses**: `Mitra Only`

### Checkout & Request Kode Billing (Bayar)
- **Endpoint**: `POST /api/mitra/cart/orders/{orderId}/checkout`
- **Akses**: `Mitra Only`
- **Payload**:
```typescript
type CheckoutOrderRequest = {
  paymentMethod?: "MPN_GEN2" | "VA_MANDIRI" | "VA_BRI" | "VA_BCA" | "QRIS";
};
```
- **Response (200 OK)**:
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

### Cek Status Pembayaran (Trigger Bayar)
- **Endpoint**: `GET /api/mitra/orders/{orderId}/status`
- **Akses**: `Mitra Only`
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

## 3.4 My Data & Riwayat Transaksi

### My Data (Layer Aktif Mitra)
- **Endpoint**: `GET /api/mitra/my-data`
- **Akses**: `Mitra Only`
- **Params**: `page?: number`, `pageSize?: number`, `search?: string`, `basis?: "bidang" | "kawasan"`, `status?: OrderStatus`
- **Response (200 OK)**:
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
    pagination: PaginationMeta;
  };
  timestamp: string;
};
```

### Riwayat Transaksi Mitra
- **Endpoint**: `GET /api/mitra/transaction-history`
- **Akses**: `Mitra Only`
- **Params**: `page?: number`, `pageSize?: number`, `search?: string`, `status?: TransactionStatus`
- **Response (200 OK)**:
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
  pagination: PaginationMeta;
};
```

---

# 4. INTERNAL ONLY ENDPOINTS

Endpoint khusus yang hanya dapat diakses oleh verifikator / admin ATR/BPN dengan role `internal`.

## 4.1 Dashboard & Statistik Sistem

- `GET /api/internal/home/igt-basis` — Ringkasan jumlah layer per basis (bidang/kawasan)
- `GET /api/internal/home/publication-status` — Status publikasi layer master (active/inactive)
- `GET /api/internal/home/mitra-registration` — Ringkasan jumlah calon mitra terdaftar vs menunggu verifikasi
- `GET /api/internal/home/trends?period={1d|1w|1m|1y|all}` — Tren volume akuisisi dan PNBP
- `GET /api/internal/home/leaderboard?period={1d|1w|1m|1y|all}` — Top Mitra dan Top Layer terpopuler

---

## 4.2 Pendaftaran Kemitraan (Mitra Registration)

Modul verifikasi data pendaftaran kemitraan calon mitra eksternal, pengecekan 6 berkas persyaratan legal/teknis, serta persetujuan penerbitan kontrak atau penolakan.

### 1. List Pendaftaran Mitra
- **Endpoint**: `GET /api/internal/mitra-registrations`
- **Akses**: `Internal Only`
- **Query Params**:
  - `page?: number` (default: 1)
  - `pageSize?: number` (default: 10)
  - `search?: string` (nama instansi, nomor registrasi, NIB, nama PIC)
  - `status?: "pending_verification" | "verified" | "rejected" | "all"`
- **Response (200 OK)**:
```typescript
type InternalMitraRegistrationListResponse = {
  items: Array<{
    id: string;
    registrationNumber: string;
    userId?: number;
    organizationName: string;
    officeAddress: string;
    nib: string;
    npwp: string;
    website?: string | null;
    picName: string;
    position: string;
    email: string;
    phoneNumber: string;
    status: "pending_verification" | "verified" | "rejected";
    statusDescription?: string;
    verifiedAt?: string | null;
    verifiedBy?: string | null;
    createdAt: string;
    updatedAt?: string;
  }>;
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};
```

### 2. Detail Pendaftaran Mitra
- **Endpoint**: `GET /api/internal/mitra-registrations/{id}`
- **Akses**: `Internal Only`
- **Response (200 OK)**:
```typescript
type InternalMitraRegistrationDetailResponse = {
  id: string;
  registrationNumber: string;
  organizationName: string;
  officeAddress: string;
  nib: string;
  npwp: string;
  website?: string | null;
  picName: string;
  position: string;
  email: string;
  phoneNumber: string;
  status: "pending_verification" | "verified" | "rejected";
  statusDescription?: string;
  documents: {
    suratPermohonan?: { url: string; originalName?: string; mimeType?: string; size?: number };
    dokumenDik?: { url: string; originalName?: string; mimeType?: string; size?: number };
    suratPernyataanHukum?: { url: string; originalName?: string; mimeType?: string; size?: number };
    suratKomitmenEvaluasi?: { url: string; originalName?: string; mimeType?: string; size?: number };
    suratKomitmenPerbaikan?: { url: string; originalName?: string; mimeType?: string; size?: number };
    proposalTeknis?: { url: string; originalName?: string; mimeType?: string; size?: number };
  };
  contractDocument?: string | null;
  rejectionReason?: string | null;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  createdAt: string;
  updatedAt?: string;
};
```

### 3. Setujui Pendaftaran Mitra & Unggah Kontrak Kerjasama
- **Endpoint**: `POST /api/internal/mitra-registrations/{id}/approve`
- **Akses**: `Internal Only`
- **Payload**: `multipart/form-data`
  - `contractDocument` *(file, required)*: Berkas kontrak kemitraan resmi bertandatangan (PDF)
- **Response (200 OK)**: Mengembalikan data registrasi yang telah berstatus `"verified"`.

### 4. Tolak Pendaftaran Mitra
- **Endpoint**: `POST /api/internal/mitra-registrations/{id}/reject`
- **Akses**: `Internal Only`
- **Payload**:
```typescript
type RejectMitraRegistrationPayload = {
  rejectionReason: string;
};
```
- **Response (200 OK)**: Mengembalikan data registrasi yang telah berstatus `"rejected"`.

---

## 4.3 Review Permohonan Data Spasial (Interop Order Review)

### List Orders Review Permohonan
- **Endpoint**: `GET /api/internal/interop/orders`
- **Akses**: `Internal Only`
- **Params**: `page?: number`, `pageSize?: number`, `search?: string`, `status?: "paid" | "pending_review" | "all"`
- **Response (200 OK)**:
```typescript
type InternalOrderListResponse = {
  items: Array<{
    orderId: string;
    mitraId: string;
    mitraName: string;
    status: OrderStatus;
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
      bbox?: [number, number, number, number];
    }>;
  }>;
  pagination: PaginationMeta;
};
```

### Detail Order Review
- **Endpoint**: `GET /api/internal/interop/orders/{orderId}`
- **Akses**: `Internal Only`

### Trigger Provisioning GeoServer (Create Service WMS)
- **Endpoint**: `POST /api/mitra/orders/{orderId}/provision`
- **Akses**: `Internal Only`

### Approve Order (Input URL Wrapper INTEROP)
- **Endpoint**: `PUT /api/internal/interop/orders/{orderId}/approve`
- **Akses**: `Internal Only`
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

### Reject Order
- **Endpoint**: `PUT /api/internal/interop/orders/{orderId}/reject`
- **Akses**: `Internal Only`
- **Payload**: `{ reason: string }`

---

## 4.4 Master IGT Layers & Sinkronisasi Mitra

### List Master IGT Layers
- **Endpoint**: `GET /api/internal/igt-layers`
- **Akses**: `Internal Only`
- **Params**: `page?: number`, `limit?: number`, `search?: string`, `isActive?: boolean`, `basis?: "bidang" | "kawasan"`

### Create Master IGT Layer
- **Endpoint**: `POST /api/internal/igt-layers`
- **Akses**: `Internal Only`

### Update Master IGT Layer
- **Endpoint**: `PUT /api/internal/igt-layers/{id}`
- **Akses**: `Internal Only`

### Delete Master IGT Layer (Soft Delete)
- **Endpoint**: `DELETE /api/internal/igt-layers/{id}`
- **Akses**: `Internal Only`

### Trigger Sinkronisasi Pembaruan Layer Mitra (Queue Job)
- **Endpoint**: `POST /api/internal/igt-layers/sync-mitra`
- **Akses**: `Internal Only`
- **Payload**: `{ layerIds: string[] }`
- **Response**: `202 Accepted`

### List & Detail Antrean Job Sinkronisasi
- `GET /api/internal/mitra-layer-sync-jobs` — List background jobs
- `GET /api/internal/mitra-layer-sync-jobs/{jobId}` — Detail single job

### Real-time Job Progress Stream (SSE)
- **Endpoint**: `GET /api/internal/mitra-layer-sync-jobs/stream?token=<JWT_TOKEN>`
- **Akses**: `Internal Only`
- **Stream Event**: `job_created`, `job_started`, `job_progress`, `job_completed`, `job_failed`

---

## 4.5 Master GeoServer

- `GET /api/internal/master-geoserver` — List master geoserver
- `GET /api/internal/master-geoserver/{id}` — Detail master geoserver
- `POST /api/internal/master-geoserver` — Tambah kredensial geoserver baru
- `PUT /api/internal/master-geoserver/{id}` — Edit kredensial geoserver
- `DELETE /api/internal/master-geoserver/{id}` — Hapus master geoserver (soft delete)
- `GET /api/internal/master-geoserver/{geoserverId}/workspaces` — Ambil daftar workspace aktif
- `GET /api/internal/master-geoserver/{geoserverId}/workspaces/{workspaceName}/layers` — Ambil daftar layer dalam workspace

---

## 4.6 Monitoring & Statistik Transaksi Internal

### Ringkasan Statistik Transaksi
- **Endpoint**: `GET /api/internal/transactions/statistics`
- **Akses**: `Internal Only`
- **Response (200 OK)**: `{ activeOrders: number, settledTransactions: number, netWorth: number }`

### Daftar Transaksi Global Internal
- **Endpoint**: `GET /api/internal/transactions`
- **Akses**: `Internal Only`
- **Params**: `page?: number`, `pageSize?: number`, `search?: string`, `transactionStatus?: TransactionStatus`, `orderStatus?: OrderStatus`, `selectionType?: string`, `startDate?: string`, `endDate?: string`

### Detail Transaksi Internal
- **Endpoint**: `GET /api/internal/transactions/{id}`
- **Akses**: `Internal Only`

---

## 4.7 Tarif PNBP & Pricing Management

- `GET /api/internal/pricing` — List aturan tarif per layer / basis
- `POST /api/internal/pricing` — Buat konfigurasi tarif baru
- `PUT /api/internal/pricing/{id}` — Update konfigurasi tarif

---

## 4.8 Batas Pembelian (Purchase Limit)

- `GET /api/internal/purchase-limits` — Ambil aturan minimum order (bidang / kawasan ha)
- `PUT /api/internal/purchase-limits/{id}` — Update ambang batas minimum order

---

## 4.9 User Management

- `GET /api/internal/user-management` — List seluruh user (internal & mitra)
- `GET /api/internal/user-management/{id}` — Detail user
- `PATCH /api/internal/user-management/{id}/status` — Aktivasi / nonaktifkan user (`status: "active" | "inactive"`)
- `GET /api/internal/user-management/statistics` — Statistik total pengguna, active, inactive, dan breakdown role

---

# 5. KAMUS ENUM & SSOT STATUS

### 1. SSOT Status Transaksi & Pembayaran (`TransactionStatus`)
```typescript
export type TransactionStatus =
  | "pending"   // Menunggu Pembayaran
  | "paid"      // Terbayar / Settled
  | "expired"   // Kedaluwarsa
  | "failed"    // Gagal
  | "refunded"; // Dikembalikan
```

### 2. SSOT Status Order & Layanan Spasial (`OrderStatus`)
```typescript
export type OrderStatus =
  | "preparing"        // Penyiapkan / kalkulasi pesanan
  | "pending_payment"  // Menunggu Pembayaran
  | "paid"             // Terbayar
  | "processing"       // Sedang Diproses (Interop Engine)
  | "pending_review"   // Menunggu Validasi Admin
  | "rejected"         // Ditolak Admin
  | "ready";           // Siap Digunakan
```

### 3. SSOT Status Pendaftaran Mitra (`MitraRegistrationStatus`)
```typescript
export type MitraRegistrationStatus =
  | "pending_verification" // Menunggu Verifikasi Berkas
  | "verified"             // Terverifikasi / Disetujui (Akun SSO Aktif)
  | "rejected";            // Ditolak
```

### 4. SSOT Status Layer Aktif Mitra (`MyDataStatus`)
```typescript
export type MyDataStatus =
  | "queued"        // Dalam Antrean
  | "provisioning"  // Menyiapkan Layanan WMS
  | "ready"         // Siap Digunakan
  | "active"        // Aktif
  | "failed"        // Gagal
  | "expired"       // Kedaluwarsa
  | "revoked";      // Dicabut
```

### 5. SSOT Role Pengguna (`UserRole`)
```typescript
export type UserRole = "internal" | "mitra";
```
