# Spesifikasi Update Response Order: Subtotal IGT Basis Bidang & Kawasan

Dokumen ini berisi spesifikasi kebutuhan field baru pada root object `data` order untuk Tim Backend (BE).

---

## 1. Latar Belakang & Masalah

Saat ini, response `GET /api/mitra/cart/orders/{orderId}`, `GET /api/mitra/cart/orders`, dan Server-Sent Events (SSE) `order_ready` hanya menyediakan `totalPrice` di root level serta `subtotalPrice` per individual item di array `items`.

Pada antarmuka ringkasan keranjang / tagihan (*Order Summary*), sistem menampilkan ringkasan subtotal harga per skema tarif PNBP:
1. **Subtotal IGT Basis Bidang** (total akumulasi biaya semua layer bertipe `spatialBasis: "bidang"`).
2. **Subtotal IGT Basis Kawasan** (total akumulasi biaya semua layer bertipe `spatialBasis: "kawasan"`).

Untuk memastikan perhitungan harga konsisten, deterministik, dan menjadi *Single Source of Truth* (SSOT) dari server, Backend perlu menyertakan 2 key subtotal ini langsung di level root object pesanan (`data`).

---

## 2. Spesifikasi Schema Baru

Tambahkan 2 field angka (`number`) pada root object order:

| Field Name | Type | Default | Deskripsi |
| :--- | :--- | :--- | :--- |
| `subtotalBidangPrice` | `number` | `0` | Total akumulasi biaya (IDR) untuk seluruh item dengan `spatialBasis: "bidang"`. Jika tidak ada layer bidang, bernilai `0`. |
| `subtotalKawasanPrice` | `number` | `0` | Total akumulasi biaya (IDR) untuk seluruh item dengan `spatialBasis: "kawasan"`. Jika tidak ada layer kawasan, bernilai `0`. |

> **Catatan Validasi**:
> `totalPrice` harus selalu sama dengan `subtotalBidangPrice + subtotalKawasanPrice`.

---

## 3. Contoh Format Response JSON (Expected)

### Endpoint: `GET /api/mitra/cart/orders/{orderId}`

```json
{
  "success": true,
  "data": {
    "orderId": "c0c8e9ee-3bff-4b09-9121-eeddf1f2324e",
    "batchId": "c0c8e9ee-3bff-4b09-9121-eeddf1f2324e",
    "status": "pending_payment",
    "selectionType": "draw_aoi",
    "createdAt": "2026-09-22T03:50:45.366Z",
    "subtotalBidangPrice": 0,
    "subtotalKawasanPrice": 24740000,
    "totalPrice": 24740000,
    "coverageHa": 1236.69,
    "areaHa": 1236.69,
    "featuresCount": 0,
    "aoiPolygon": {
      "type": "Polygon",
      "coordinates": [...]
    },
    "coveragePolygon": {
      "type": "MultiPolygon",
      "coordinates": [...]
    },
    "items": [
      {
        "id": "5632a1f3-7efd-4dff-95a1-5013dd2fd661",
        "sourceLayerId": "testing_workspace:TEST_RTRW_BADUNG",
        "sourceLayerTitle": "RTRW Kabupaten/Kota",
        "spatialBasis": "kawasan",
        "selectionType": "draw_aoi",
        "featuresCount": 1,
        "unitPrice": 20000,
        "subtotalPrice": 12370000,
        "areaHa": 1236.67
      },
      {
        "id": "ac1519aa-d982-4121-a8f1-b87b8e8b801b",
        "sourceLayerId": "testing_workspace:TEST_ZNT_BADUNG",
        "sourceLayerTitle": "Zona Nilai Tanah",
        "spatialBasis": "kawasan",
        "selectionType": "draw_aoi",
        "featuresCount": 1,
        "unitPrice": 20000,
        "subtotalPrice": 12370000,
        "areaHa": 650.59
      }
    ],
    "readyAt": "2026-09-22T03:50:50.961Z",
    "approvedAt": "2026-09-22T03:50:50.961Z"
  }
}
```

---

## 4. Endpoint & Event yang Perlu Diupdate oleh Backend

1. **`GET /api/mitra/cart/orders`** (List orders):
   - Sertakan `subtotalBidangPrice` dan `subtotalKawasanPrice` di setiap object order.
2. **`GET /api/mitra/cart/orders/{orderId}`** (Detail order):
   - Sertakan `subtotalBidangPrice` dan `subtotalKawasanPrice` pada root object `data`.
3. **`GET /api/mitra/cart/orders/stream`** (SSE stream):
   - Pada event payload `order_ready` dan `order_updated`, sertakan kedua key ini pada object `data.order`.
4. **`GET /api/internal/orders/review/{orderId}`** (Detail review admin internal):
   - Sertakan kedua key ini untuk konsistensi perhitungan tarif.
