// src/shared/constants/dummy-data/dummy-inbox.ts

import type { InboxItem } from "@/features/notification/types/inbox.type";

export const DUMMY_INBOX_ITEMS: InboxItem[] = [
  {
    id: "inbox-1",
    code: "WORKSPACE_EXPIRING_H7",
    category: "kedaluwarsa",
    isRead: false,
    metadata: {
      workspaceId: "22a298d6-e948-49a7-a8ac-4374c3f3f063",
      workspaceName: "Workspace Bidang Tanah RTRW",
      daysRemaining: 7,
      expiresAt: "2026-10-15T12:00:00.000Z",
    },
    createdAt: "2026-10-05T05:00:00Z",
  },
  {
    id: "inbox-2",
    code: "ORDER_READY",
    category: "transaksi",
    isRead: false,
    metadata: {
      workspaceId: "22a298d6-e948-49a7-a8ac-4374c3f3f063",
      workspaceName: "Workspace Bidang Tanah RTRW",
      orderId: "ord-2026-0830-001",
      orderNumber: "ORD-20260830-001",
    },
    createdAt: "2026-10-04T19:30:00Z",
  },
  {
    id: "inbox-3",
    code: "TICKET_REPLIED",
    category: "bantuan",
    isRead: true,
    metadata: {
      ticketId: "102",
      ticketNumber: "102",
      senderName: "Tim CS ATR/BPN",
    },
    createdAt: "2026-10-03T15:20:00Z",
  },
  {
    id: "inbox-4",
    code: "SYSTEM_ANNOUNCEMENT",
    category: "sistem",
    isRead: true,
    title: "Pemeliharaan Sistem Terjadwal",
    message:
      "Akan dilakukan pemeliharaan server GeoServer pada hari Sabtu pukul 01:00 - 04:00 WIB. Layanan WMS/WFS mungkin mengalami kendala sesaat.",
    createdAt: "2026-10-01T12:00:00Z",
  },
  {
    id: "inbox-5",
    code: "DATA_SYNC_COMPLETED",
    category: "sistem",
    title: "Pembaruan Data Spasial: Batas Wilayah Administrasi",
    message:
      "Layer spasial 'Batas Wilayah Administrasi' pada pesanan ORD-2026-0012 telah berhasil diperbarui dengan data master terbaru ATR/BPN.",
    actionUrl: "/mitra/my-data/mitra_workspace_12",
    actionLabel: "Buka Data Saya",
    isRead: false,
    createdAt: "2026-10-23T02:18:10.000Z",
    metadata: {
      jobId: "job_01j9a8bcde",
      layerId: "layer_batas_wilayah",
      layerTitle: "Batas Wilayah Administrasi",
      orderId: 12,
      orderNumber: "ORD-2026-0012",
      workspaceName: "mitra_workspace_12",
      syncedAt: "2026-10-23T02:18:10.000Z",
    },
  },
];
