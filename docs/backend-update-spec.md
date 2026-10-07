# Spesifikasi Pembaruan Backend (BE Update Spec)

Dokumen ini berisi spesifikasi teknis dan acceptance criteria terbaru untuk tim Backend terkait **Standarisasi Manajemen Master Layer IGT & URL Service GeoServer (Strict SSOT)**.

---

## 1. Standarisasi Manajemen Master Layer IGT & URL Service GeoServer

### 1.1. Latar Belakang & Masalah Sebelumnya

1. `id` di database sebelumnya diisi string `workspace:layerName` bukannya UUID murni.
2. Naming convention basis IGT tidak seragam (`spatialBasis` vs `igtBasis`).
3. Master IGT hanya bisa dibuat jika memilih layer spesifik, belum mendukung pendaftaran master data level **Workspace penuh** (`layerName = null`).
4. URL Service GeoServer (WMS/WFS) terpisah-pisah dan tidak membedakan antara Full URL (siap render/copy) vs Base URL (untuk custom query).

### 1.2. Skema Entity / Tabel `master_igt_layers`

- `id` (UUID, Primary Key, Auto-generated)
- `geoserverId` (UUID, Foreign Key ke tabel `master_geoservers`)
- `title` (String, wajib)
- `description` (Text, nullable)
- `igtBasis` (Enum / String: `"bidang"` | `"kawasan"`, wajib — menggantikan `spatialBasis`)
- `workspaceName` (String, wajib)
- `layerName` (String, nullable — `NULL` jika master data level workspace)
- `typeName` (String, **NOT NULL**):
  - Jika `layerName` ada: `"${workspaceName}:${layerName}"`
  - Jika `layerName` null: `"${workspaceName}"`
- `bbox` (Array 4 Float `[minLng, minLat, maxLng, maxLat]`, nullable — di-cache dari GeoServer)
- `isActive` (Boolean, default `true`)
- `defaultVisible` (Boolean, default `false`)
- `zIndex` (Integer, default `1`)
- `createdAt` (Timestamp with timezone)
- `updatedAt` (Timestamp with timezone)

---

## 2. Standarisasi Response Service GeoServer (`wms` & `wfs`) & Kebijakan Strict SSOT

> [!IMPORTANT]
> **Kebijakan Strict SSOT**: Seluruh URL GeoServer (WMS dan WFS) dikontrol 100% oleh Backend sebagai Single Source of Truth. Frontend **tidak melakukan konstruksi URL manual** atau fallback buatan.

Seluruh endpoint yang mengembalikan data layer/workspace GeoServer (`GET /api/internal/igt-layers`, `GET /api/mitra/igt-layers`, `GET /api/mitra/workspaces`, `GET /api/mitra/workspaces/:id`) **wajib menyertakan objek `wms` dan `wfs` secara lengkap beserta parameter OGC deklaratif**:

```json
{
  "wms": {
    "url": "https://geoserver-domain/geoserver/wms?service=WMS&version=1.1.1&request=GetMap&layers={typeName}&format=image/png&transparent=true&srs=EPSG:3857",
    "baseUrl": "https://geoserver-domain/geoserver/wms",
    "version": "1.1.1",
    "layers": "{typeName}",
    "format": "image/png",
    "srs": "EPSG:3857",
    "transparent": true
  },
  "wfs": {
    "url": "https://geoserver-domain/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames={typeName}&outputFormat=application/json&srsName=EPSG:4326",
    "baseUrl": "https://geoserver-domain/geoserver/wfs",
    "version": "2.0.0",
    "typeName": "{typeName}",
    "outputFormat": "application/json",
    "srsName": "EPSG:4326"
  }
}
```

> [!NOTE]
> **Fungsi Pembagian Properti**:
>
> - `url`: Full URL siap pakai (siap render di MapLibre tile raster, download fitur, atau copy-paste URL).
> - `baseUrl`: Base endpoint murni GeoServer saat Frontend/Client ingin meng-append custom query (`CQL_FILTER`, `startIndex`, `maxFeatures`, `propertyName`).
> - `version`, `srs` / `srsName`, `format`, `typeName`: Metadata deklaratif agar Frontend & SIG Client (QGIS) tidak perlu hardcode atau menebak-nebak format OGC.

> [!CAUTION]
> **BREAKING CHANGE (CLEAN BREAK / NO BACKWARD COMPATIBILITY)**:
>
> Standar ini merupakan **Breaking Change** yang disepakati untuk membersihkan inkonsistensi arsitektur data lama:
>
> 1. Field `spatialBasis` **dihapus total**, wajib gunakan **`igtBasis`**.
> 2. Field string flat `wmsUrl` & `wfsUrl` di root layer **dihapus total**, wajib gunakan objek **`wms`** dan **`wfs`**.
> 3. Kolom `id` pada tabel `master_igt_layers` **wajib berupa UUID murni**, dilarang keras menyimpan string `workspace:layerName` di kolom `id`.
> 4. Layer identifier GeoServer yang sesungguhnya distandarisasi di field **`typeName`** (`workspaceName:layerName`).

---

## 3. Endpoint Manajemen Master Layer IGT

### 3.1. `POST /api/internal/igt-layers` (Create Master IGT)

> [!IMPORTANT]
> **Standarisasi ID (Auto-generated UUID)**:
> Kolom `id` **wajib berupa UUID (v4) murni** yang di-generate otomatis oleh Backend saat insert data ke database (sama seperti entity `master_geoservers`, `users`, `orders`).
> Backend **dilarang keras** menerima atau menyimpan string `workspace:layerName` ke kolom `id`. Identifier GeoServer disimpan secara terpisah di kolom **`typeName`**.

**Request Body** (Client tidak mengirim `id`, `id` dibuat oleh Backend):

```json
{
  "title": "ZNT Badung",
  "description": "Zona Nilai Tanah Wilayah Kabupaten Badung",
  "igtBasis": "kawasan",
  "geoserverId": "283396d5-3052-4466-8812-e741559075d5",
  "workspaceName": "volatil-master-layer-igt",
  "layerName": "TEST_ZNT_BADUNG",
  "typeName": "volatil-master-layer-igt:TEST_ZNT_BADUNG",
  "isActive": true,
  "defaultVisible": false,
  "zIndex": 1
}
```

> _Catatan_: Jika master data level workspace (tanpa layer spesifik), kirim `"layerName": null` dan `"typeName": "volatil-master-layer-igt"`.

**Response (201 Created)**:

```json
{
  "success": true,
  "code": 201,
  "message": "Berhasil menambahkan master layer IGT",
  "data": {
    "id": "e4b1c2a3-9876-4abc-9def-1234567890ab",
    "title": "ZNT Badung",
    "description": "Zona Nilai Tanah Wilayah Kabupaten Badung",
    "igtBasis": "kawasan",
    "geoserverId": "283396d5-3052-4466-8812-e741559075d5",
    "geoserver": {
      "id": "283396d5-3052-4466-8812-e741559075d5",
      "name": "Staging Geoserver (Volatil)",
      "baseUrl": "https://geoserver-volatil.exium.web.id/geoserver"
    },
    "workspaceName": "volatil-master-layer-igt",
    "layerName": "TEST_ZNT_BADUNG",
    "typeName": "volatil-master-layer-igt:TEST_ZNT_BADUNG",
    "wms": {
      "url": "https://geoserver-volatil.exium.web.id/geoserver/wms?service=WMS&version=1.1.1&request=GetMap&layers=volatil-master-layer-igt:TEST_ZNT_BADUNG&format=image/png&transparent=true",
      "baseUrl": "https://geoserver-volatil.exium.web.id/geoserver/wms"
    },
    "wfs": {
      "url": "https://geoserver-volatil.exium.web.id/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=volatil-master-layer-igt:TEST_ZNT_BADUNG&outputFormat=application/json",
      "baseUrl": "https://geoserver-volatil.exium.web.id/geoserver/wfs"
    },
    "bbox": [115.083844, -8.849307, 115.251528, -8.239852],
    "isActive": true,
    "defaultVisible": false,
    "zIndex": 1,
    "createdAt": "2026-10-07T04:00:00.000Z",
    "updatedAt": "2026-10-07T04:00:00.000Z"
  }
}
```

### 3.2. `PUT /api/internal/igt-layers/:id` (Update Master IGT)

> [!WARNING]
> **Bug di BE Saat Ini**:
> Saat admin mengubah master GeoServer (`geoserverId`) atau mengubah `workspaceName`/`layerName`, Backend tidak meng-update relasi endpoint GeoServer dan **tidak me-regenerasi URL WMS/WFS** sehingga layer tetap mengarah ke URL GeoServer lama.

- **Path Param**: `id` (UUID)
- **Request Body**:

```json
{
  "title": "ZNT Badung (Updated)",
  "description": "Zona Nilai Tanah Wilayah Kabupaten Badung Terbaru",
  "igtBasis": "kawasan",
  "geoserverId": "550e8400-e29b-41d4-a716-446655440000",
  "workspaceName": "volatil-staging",
  "layerName": "TEST_ZNT_BADUNG_V2",
  "typeName": "volatil-staging:TEST_ZNT_BADUNG_V2",
  "isActive": true,
  "defaultVisible": false,
  "zIndex": 1
}
```

**Aturan Bisnis & Mekanisme Update di Backend**:

1. **Update Foreign Key Relasi:** Update `geoserverId` pada record layer ke Master GeoServer yang baru.
2. **Dynamic URL Regeneration:** Ambil `baseUrl` dari tabel `master_geoservers` berdasarkan `geoserverId` baru, lalu susun ulang properti `wms.url`, `wms.baseUrl`, `wfs.url`, dan `wfs.baseUrl`:
   - `wms.baseUrl` = `"${geoserver.baseUrl}/wms"`
   - `wms.url` = `"${wms.baseUrl}?service=WMS&version=1.1.1&request=GetMap&layers=${typeName}&format=image/png&transparent=true&srs=EPSG:3857"`
   - `wfs.baseUrl` = `"${geoserver.baseUrl}/wfs"`
   - `wfs.url` = `"${wfs.baseUrl}?service=WFS&version=2.0.0&request=GetFeature&typeNames=${typeName}&outputFormat=application/json&srsName=EPSG:4326"`
3. **Response**: Mengembalikan data master layer IGT terbaru beserta objek `wms` & `wfs` yang **sudah mengarah ke GeoServer baru**.

### 3.3. `GET /api/internal/igt-layers` & `GET /api/mitra/igt-layers`

- Mengembalikan array `items` dengan struktur terstandarisasi di atas (`id` berupa UUID, `igtBasis`, `workspaceName`, `layerName`, `typeName`, `wms: { url, baseUrl, version, layers, format, srs, transparent }`, `wfs: { url, baseUrl, version, typeName, outputFormat, srsName }`).

---

## 4. Standarisasi Endpoint Perhitungan Data Request (`POST /api/mitra/data-request/calculate`)

Endpoint ini digunakan untuk menghitung ringkasan cakupan AOI kawasan dan rincian feature/bidang yang masuk dalam poligon permohonan.

### 4.1. Response Schema Baku (Non-Redundant)

```json
{
  "done": true,
  "data": {
    "coverageKawasan": {
      "areaHa": 176.9543,
      "polygon": {
        "type": "Polygon",
        "coordinates": [
          [
            [115.1355, -8.6638],
            [115.1355, -8.66375],
            [115.1354, -8.6637],
            [115.132088149, -8.6614],
            [115.138294, -8.652213],
            [115.149516, -8.664608],
            [115.141623455, -8.670211727],
            [115.1355, -8.6638]
          ]
        ]
      }
    },
    "summary": {
      "bidang": {
        "unitPrice": 7500,
        "featureCount": 0,
        "subtotalPrice": 0
      },
      "kawasan": {
        "unitPrice": 20000,
        "featureCount": 55,
        "subtotalPrice": 3540000
      },
      "totalPrice": 3540000
    },
    "validation": {
      "isValid": false,
      "message": "Minimum pembelian untuk kawasan adalah 1000 Ha (saat ini: 176.9543 Ha)."
    },
    "items": [
      {
        "layerId": "testing_workspace:TEST_BIDANG_TANAH",
        "title": "Bidang Tanah",
        "igtBasis": "bidang",
        "featureCount": 0,
        "areaHa": 0
      },
      {
        "layerId": "volatil-master-layer-igt:TEST_BIDANG_TANAH",
        "title": "Bidang Tanah Backup",
        "igtBasis": "bidang",
        "featureCount": 0,
        "areaHa": 0
      },
      {
        "layerId": "volatil-master-layer-igt:TEST_RTRW_BADUNG",
        "title": "RTRW BACKUP",
        "igtBasis": "kawasan",
        "featureCount": 23,
        "areaHa": 176.2548
      },
      {
        "layerId": "testing_workspace:TEST_ZNT_BADUNG",
        "title": "ZNT BADUNG",
        "igtBasis": "kawasan",
        "featureCount": 16,
        "areaHa": 175.4888
      },
      {
        "layerId": "volatil-master-layer-igt:TEST_ZNT_BADUNG",
        "title": "ZNT Badung Backup",
        "igtBasis": "kawasan",
        "featureCount": 16,
        "areaHa": 175.4888
      }
    ]
  }
}
```

> [!NOTE]
>
> - `coverageKawasan.polygon`: GeoJSON Polygon gabungan/union dari cakupan kawasan yang beririsan dengan AOI.
> - `items`: Array ringkasan per layer IGT yang beririsan (menggunakan `igtBasis`: `"bidang"` | `"kawasan"`).
> - `validation`: Objek validasi batas minimum/aturan bisnis pengajuan data request.

---

## 5. Pemisahan Siklus Hidup Workspace vs Riwayat Transaksi & Endpoint Perpanjangan (Workspace Renewal)

### 5.1. Masalah & Bug Saat Ini di Backend

1. **Workspace Tercampur dengan Transaksi:**
   - Backend saat ini mengambil/me-generate data Workspace (`GET /api/mitra/my-data` / `GET /api/mitra/workspaces`) berdasarkan tabel **Transaksi**.
   - Akibatnya: Setiap kali mitra melakukan perpanjangan (renewal) masa aktif, Backend malah membuat **Workspace Baru** (duplikasi workspace) alih-alih meng-update `expiresAt` pada Workspace yang sudah ada.
2. **Konsep Entity yang Seharusnya (Domain Separation):**
   - **Tabel `workspaces` (Entity Persistent):** 1 Mitra memiliki workspace perorangan/instansi dengan kumpulan layer aktif dan `expiresAt`. ID Workspace bersifat tetap (Persistent).
   - **Tabel `transactions` / `orders` (Audit Log & Billing):** Menyimpan setiap peristiwa pembayaran (Order Baru, Perpanjangan Masa Aktif, Penambahan Layer). Transaksi baru bertambah, tetapi Workspace **tetap 1 dan hanya `expiresAt`-nya yang diperpanjang (expanded)**.

---

### 5.2. Endpoint Perpanjang Masa Aktif Workspace (`POST /api/mitra/my-data/:workspaceId/renew` atau `/api/mitra/workspaces/:id/renew`)

Endpoint ini digunakan mitra untuk memperpanjang durasi masa aktif seluruh/sebagian layer pada workspace yang telah dimiliki.

**Request Body**:

```json
{
  "durationMonths": 12,
  "paymentMethod": "MPN_GEN2"
}
```

**Aturan Bisnis di Backend**:

1. Buat record transaksi baru di tabel `orders`/`transactions` dengan tipe `"renewal"` dan status awal `"pending_payment"`.
2. Generate kode billing PNBP (`billingCode`, `totalAmount`, `billingExpiredAt`).
3. **DILARANG** membuat baris baru di tabel `workspaces`.
4. Setelah transaksi dibayar (`paid`), Backend **hanya meng-update field `expiresAt` (atau `extendedUntil`) pada Workspace terkait**:
   - Jika workspace belum expired: `newExpiresAt = currentExpiresAt + durationMonths`
   - Jika workspace sudah expired: `newExpiresAt = now + durationMonths`

**Response (200 OK / 201 Created)**:

```json
{
  "success": true,
  "code": 200,
  "message": "Permohonan perpanjangan masa aktif workspace berhasil dibuat",
  "data": {
    "workspaceId": "ws-mitra-001",
    "orderId": "ord-renew-ws-001-2026",
    "orderNumber": "RNW-202609-0012",
    "billingCode": "8202699881122",
    "totalAmount": 1500000,
    "status": "pending_payment",
    "expiresAt": "2026-10-07T04:00:00.000Z",
    "extendedUntil": "2027-10-07T04:00:00.000Z",
    "createdAt": "2026-10-07T11:19:00.000Z",
    "billingExpiredAt": "2026-10-09T11:19:00.000Z"
  }
}
```

---

### 5.3. Endpoint List Workspace Mitra (`GET /api/mitra/my-data` / `GET /api/mitra/workspaces`)

- Query data **wajib bersumber dari tabel `workspaces`**, bukan hasil `SELECT ... FROM transactions`.
- Response mengembalikan list workspace milik mitra dengan relasi layer IGT yang aktif beserta URL service GeoServer WMS/WFS masing-masing.

---

## 6. Standarisasi Kolom `settledAt` & Alur Verifikasi Status Pembayaran (Inquiry SIMPONI)

### 6.1. Latar Belakang & Masalah Pembayaran SIMPONI / Bank Gateway

1. **Callback SIMPONI Rawan Gagal:**
   - Webhook/callback notifikasi dari gateway SIMPONI / MPN G2 Kemenkeu rawan timeout, delay, atau gagal terkirim karena pembatasan jaringan perbankan.
   - Hal ini menyebabkan transaksi berstatus `pending_payment` menggantung padahal uang mitra sudah terpotong di bank.
2. **Solusi: Active Inquiry on "Cek Status Pembayaran":**
   - Saat mitra atau sistem memicu pengecekan status (`GET /api/mitra/orders/:orderId/status`), Backend melakukan **inquiry aktif langsung ke SIMPONI**.
   - Begitu SIMPONI menyatakan dana masuk (settled), Backend **wajib mengisi timestamp pada kolom baru `settledAt` di tabel `orders`/`transactions`**.

---

### 6.2. Skema Kolom Baru pada Tabel `orders` / `transactions`

- **`settledAt`** (Timestamp with timezone, nullable):
  - Bernilai `NULL` saat order baru dibuat (`status = "pending_payment"`).
  - Diisi dengan timestamp waktu pelunasan/buku kas SIMPONI (atau `now()`) saat status berubah menjadi `"paid"`.

---

### 6.3. Endpoint Cek Status Pembayaran (`GET /api/mitra/orders/:orderId/status`)

- **Response (200 OK - Terbayar / Settled)**:

```json
{
  "success": true,
  "code": 200,
  "message": "Status pembayaran berhasil diverifikasi dari SIMPONI",
  "data": {
    "orderId": "ord-2026-0921-0089",
    "orderNumber": "ORD-202609-0089",
    "transactionStatus": "paid",
    "orderStatus": "paid",
    "billingCode": "8202699881122",
    "totalAmount": 3540000,
    "settledAt": "2026-10-07T11:30:15.000Z",
    "expiredAt": "2026-10-09T10:45:00.000Z",
    "createdAt": "2026-10-07T10:45:00.000Z"
  }
}
```

---

## 7. Acceptance Checklist untuk Tim BE

- [ ] Tabel `master_igt_layers` menggunakan Primary Key `id` bertipe **UUID** (bukan string `workspace:layer`).
- [ ] Standarisasi field master IGT: `igtBasis` (`"bidang"` | `"kawasan"`), `workspaceName`, `layerName` (nullable), `typeName` (not null).
- [ ] Dukungan master IGT level workspace: jika `layerName` null, `typeName` berisi `"${workspaceName}"`.
- [ ] Response WMS/WFS GeoServer distandarisasi menjadi objek `{ wms: { url, baseUrl }, wfs: { url, baseUrl } }` (SSOT Backend).
- [ ] **Fix Update Master IGT (`PUT /api/internal/igt-layers/:id`):** Saat `geoserverId`, `workspaceName`, atau `layerName` diubah, Backend wajib meng-update relasi Foreign Key dan otomatis **me-regenerasi URL `wms` & `wfs`** agar mengarah ke GeoServer yang baru.
- [ ] Endpoint `POST /api/mitra/data-request/calculate` mengembalikan struktur baku clean non-redundant (`coverageKawasan`, `summary`, `validation`, `items`).
- [ ] **Pemisahan Domain Workspace vs Transaksi:** `GET /api/mitra/my-data` mengambil data langsung dari entity `workspaces`, bukan dari tabel `transactions`.
- [ ] **Fix Renewal Workspace:** Perpanjangan workspace (`POST /.../renew`) tidak membuat Workspace baru, melainkan mencatat transaksi baru dan meng-update `expiresAt` pada Workspace yang ada saat lunas.
- [ ] **Kolom `settledAt` pada Tabel `orders`:** Wajib menambahkan kolom `settledAt` yang diisi timestamp pelunasan saat inquiry SIMPONI (`GET /api/mitra/orders/:id/status`) mengembalikan status `paid`.
- [ ] Pembersihan total (clean break): buang field deprecated `spatialBasis` dan string flat `wmsUrl`/`wfsUrl`.
