// src/shared/constants/dummy-data/dummy-mitra-transactions.ts

import type { MitraTransactionItem } from "@/features/mitra/help-center/types/mitra.transaction.type";

export const DUMMY_MITRA_TRANSACTIONS: MitraTransactionItem[] = [
  {
    id: "ord-001-uuid",
    orderNumber: "ORD-2026-00192",
    billingCode: "82026031800192",
    status: "ready",
    totalPrice: 15000000,
    orderedAt: "2026-03-18T10:30:00Z",
    items: [
      {
        id: "item-1",
        sourceLayerId: "testing_workspace:TEST_RTRW_BADUNG",
        sourceLayerTitle: "RTRW Badung",
      },
    ],
  },
  {
    id: "ord-002-uuid",
    orderNumber: "ORD-2026-00185",
    billingCode: "82026031500185",
    status: "processing",
    totalPrice: 7500000,
    orderedAt: "2026-03-15T14:15:00Z",
    items: [
      {
        id: "item-2",
        sourceLayerId: "testing_workspace:TEST_BIDANG_TANAH",
        sourceLayerTitle: "Bidang Tanah",
      },
    ],
  },
  {
    id: "ord-003-uuid",
    orderNumber: "ORD-2026-00171",
    billingCode: "82026031000171",
    status: "pending_payment",
    totalPrice: 3200000,
    orderedAt: "2026-03-10T09:00:00Z",
    items: [
      {
        id: "item-3",
        sourceLayerId: "testing_workspace:TEST_ZNT_BADUNG",
        sourceLayerTitle: "ZNT Badung",
      },
    ],
  },
  {
    id: "ord-004-uuid",
    orderNumber: "ORD-2026-00140",
    billingCode: "82026022800140",
    status: "rejected",
    totalPrice: 4800000,
    orderedAt: "2026-02-28T16:45:00Z",
    items: [
      {
        id: "item-4",
        sourceLayerId: "testing_workspace:TEST_RTRW_BADUNG",
        sourceLayerTitle: "RTRW Badung",
      },
    ],
  },
];
