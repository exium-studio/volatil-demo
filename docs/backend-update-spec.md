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

Seluruh endpoint yang mengembalikan data layer/workspace GeoServer (`GET /api/internal/igt-layers`, `GET /api/mitra/igt-layers`, `GET /api/mitra/workspaces`, `GET /api/mitra/workspaces/:id`) **wajib menyertakan objek `wms` dan `wfs` secara lengkap**:

```json
{
  "wms": {
    "url": "https://geoserver-domain/geoserver/wms?service=WMS&version=1.1.1&request=GetMap&layers={typeName}&format=image/png&transparent=true",
    "baseUrl": "https://geoserver-domain/geoserver/wms"
  },
  "wfs": {
    "url": "https://geoserver-domain/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames={typeName}&outputFormat=application/json",
    "baseUrl": "https://geoserver-domain/geoserver/wfs"
  }
}
```

> [!CAUTION]
> **PENGHAPUSAN FIELD DEPRECATED (CLEAN BREAK / NO BACKWARD COMPATIBILITY)**:
> - Field `spatialBasis` **dihapus total**, wajib gunakan **`igtBasis`**.
> - Field `wmsUrl` & `wfsUrl` string flat di root layer **dihapus total**, wajib gunakan objek **`wms`** dan **`wfs`**.
> - Field `id` pada tabel `master_igt_layers` **wajib berupa UUID murni**, dilarang keras menyimpan string `workspace:layerName` di kolom `id`.

---

## 3. Endpoint Manajemen Master Layer IGT

### 3.1. `POST /api/internal/igt-layers` (Create Master IGT)
**Request Body**:
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
> *Catatan*: Jika master data level workspace (tanpa layer spesifik), kirim `"layerName": null` dan `"typeName": "volatil-master-layer-igt"`.

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
- **Path Param**: `id` (UUID)
- **Request Body**: Sama seperti create (termasuk `workspaceName`, `layerName`, `typeName`, `igtBasis`).
- **Response**: Mengembalikan data master layer IGT terbaru beserta objek `wms` & `wfs`.

### 3.3. `GET /api/internal/igt-layers` & `GET /api/mitra/igt-layers`
- Mengembalikan array `items` dengan struktur terstandarisasi di atas (`id` berupa UUID, `igtBasis`, `workspaceName`, `layerName`, `typeName`, `wms: {url, baseUrl}`, `wfs: {url, baseUrl}`).

---

## 4. Acceptance Checklist untuk Tim BE

- [ ] Tabel `master_igt_layers` menggunakan Primary Key `id` bertipe **UUID** (bukan string `workspace:layer`).
- [ ] Standarisasi field master IGT: `igtBasis` (`"bidang"` | `"kawasan"`), `workspaceName`, `layerName` (nullable), `typeName` (not null).
- [ ] Dukungan master IGT level workspace: jika `layerName` null, `typeName` berisi `"${workspaceName}"`.
- [ ] Response WMS/WFS GeoServer distandarisasi menjadi objek `{ wms: { url, baseUrl }, wfs: { url, baseUrl } }` (SSOT Backend).
- [ ] Pembersihan total (clean break): buang field deprecated `spatialBasis` dan string flat `wmsUrl`/`wfsUrl`.
