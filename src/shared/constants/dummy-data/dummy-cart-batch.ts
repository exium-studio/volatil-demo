// src/shared/constants/dummy-data/dummy-cart-batch.ts

import type { ActiveCartBatch } from "@/features/mitra/cart/types/mitra.cart.batch.type";

const now = new Date();
const readyAt = new Date(now.getTime() - 1000 * 60 * 30); // 30 mins ago
const expiredAt = new Date(readyAt.getTime() + 1000 * 60 * 60 * 24); // 24 hours TTL

export const DUMMY_ACTIVE_CART_BATCH: ActiveCartBatch = {
  batchId: "btc-2026-0825-001",
  status: "ready",
  createdAt: new Date(now.getTime() - 1000 * 60 * 35).toISOString(),
  readyAt: readyAt.toISOString(),
  expiredAt: expiredAt.toISOString(),
  totalPrice: 1850000,
  items: [
    {
      id: "cbi-001",
      sourceLayerId: "geonode:bidang_tanah_rdtr",
      sourceLayerTitle: "Bidang Tanah RDTR Perkotaan",
      spatialBasis: "bidang",
      selectionType: "aoi_polygon",
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
      selectionType: "administrative_filter",
      featuresCount: 2,
      areaHa: 13,
      unitPrice: 50000,
      subtotalPrice: 650000,
      wfsUrl: "/api/mitra/layers/lyr-002/wfs",
      wmsUrl: "/api/mitra/layers/lyr-002/wms",
    },
  ],
};
