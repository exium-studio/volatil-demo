// src/shared/constants/dummy-data/dummy-cart-batch.ts

import type {
  CartBatch,
} from "@/features/mitra/cart/types/mitra.cart.batch.type";

const now = new Date();
const readyAt1 = new Date(now.getTime() - 1000 * 60 * 30); // 30 mins ago
const expiredAt1 = new Date(readyAt1.getTime() + 1000 * 60 * 60 * 24); // 24 hours TTL

const readyAt2 = new Date(now.getTime() - 1000 * 60 * 120); // 2 hours ago
const expiredAt2 = new Date(readyAt2.getTime() + 1000 * 60 * 60 * 24);

export const DUMMY_CART_BATCHES: CartBatch[] = [
  {
    batchId: "btc-2026-0825-001",
    status: "pending_payment",
    selectionType: "draw_aoi",
    createdAt: new Date(now.getTime() - 1000 * 60 * 35).toISOString(),
    readyAt: readyAt1.toISOString(),
    expiredAt: expiredAt1.toISOString(),
    totalPrice: 1850000,
    items: [
      {
        id: "cbi-001",
        sourceLayerId: "geonode:bidang_tanah_rdtr",
        sourceLayerTitle: "Bidang Tanah RDTR Perkotaan",
        spatialBasis: "bidang",
        featuresCount: 24,
        unitPrice: 50000,
        subtotalPrice: 1200000,
        wfsUrl: "/api/mitra/layers/lyr-001/wfs",
        wmsUrl: "/api/mitra/layers/lyr-001/wms",
      },
      {
        id: "cbi-002",
        sourceLayerId: "geonode:kawasan_lindung_geologi",
        sourceLayerTitle: "Kawasan Lindung Geologi Nasional",
        spatialBasis: "kawasan",
        featuresCount: 2,
        areaHa: 13,
        unitPrice: 50000,
        subtotalPrice: 650000,
        wfsUrl: "/api/mitra/layers/lyr-002/wfs",
        wmsUrl: "/api/mitra/layers/lyr-002/wms",
      },
    ],
  },
  {
    batchId: "btc-2026-0825-002",
    status: "pending_payment",
    selectionType: "catalog",
    createdAt: new Date(now.getTime() - 1000 * 60 * 10).toISOString(),
    totalPrice: 950000,
    items: [
      {
        id: "cbi-003",
        sourceLayerId: "geonode:zona_nilai_tanah_2026",
        sourceLayerTitle: "Zona Nilai Tanah (ZNT) 2026",
        spatialBasis: "bidang",
        featuresCount: 19,
        unitPrice: 50000,
        subtotalPrice: 950000,
        wfsUrl: "/api/mitra/layers/lyr-003/wfs",
        wmsUrl: "/api/mitra/layers/lyr-003/wms",
      },
    ],
  },
  {
    batchId: "btc-2026-0825-003",
    status: "pending_payment",
    selectionType: "upload_aoi",
    createdAt: new Date(now.getTime() - 1000 * 60 * 130).toISOString(),
    readyAt: readyAt2.toISOString(),
    expiredAt: expiredAt2.toISOString(),
    totalPrice: 500000,
    items: [
      {
        id: "cbi-004",
        sourceLayerId: "geonode:peta_tematik_hutan",
        sourceLayerTitle: "Kawasan Hutan Produksi Terbatas",
        spatialBasis: "kawasan",
        featuresCount: 1,
        areaHa: 10,
        unitPrice: 50000,
        subtotalPrice: 500000,
        wfsUrl: "/api/mitra/layers/lyr-004/wfs",
        wmsUrl: "/api/mitra/layers/lyr-004/wms",
      },
    ],
  },
];

export const DUMMY_ACTIVE_CART_BATCH: CartBatch = DUMMY_CART_BATCHES[0];
