// src/shared/constants/dummy-data/dummy-inbox.ts

import type { InboxItem } from "@/features/notification/types/inbox.type";

export const DUMMY_INBOX_ITEMS: InboxItem[] = [
  {
    id: "inbox-1",
    title: "Peringatan Masa Aktif: Sisa 1 Minggu (H-7)",
    message:
      "Masa aktif layanan data spasial IGT pada workspace 'ws_ord_20260829_003' (Bidang Tanah) akan kedaluwarsa dalam 7 hari (15 Okt 2026). Segera lakukan perpanjangan layanan untuk menjaga kelangsungan akses interoperabilitas WMS/WFS Anda.",
    category: "kedaluwarsa",
    isRead: false,
    actionUrl: "/mitra/my-data/22a298d6-e948-49a7-a8ac-4374c3f3f063",
    actionLabel: "Buka Data Saya",
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
    title: "Pembelian Berhasil & Workspace Siap Digunakan",
    message:
      "Pembelian data IGT RTRW & ZNT Badung (ORD-20260830-001) telah berhasil diverifikasi dan diprovisi. Layanan WMS/WFS Interop pada workspace siap digunakan.",
    category: "transaksi",
    isRead: false,
    actionUrl: "/mitra/my-data/22a298d6-e948-49a7-a8ac-4374c3f3f063",
    actionLabel: "Buka Data Saya",
    metadata: {
      workspaceId: "22a298d6-e948-49a7-a8ac-4374c3f3f063",
      orderId: "ord-2026-0830-001",
    },
    createdAt: "2026-10-04T19:30:00Z",
  },
  {
    id: "inbox-3",
    title: "Tiket Bantuan Ditanggapi",
    message:
      "Tiket laporan #102 ('Payment gagal tapi saldo berkurang') telah mendapat tanggapan baru dari tim teknis.",
    category: "bantuan",
    isRead: true,
    actionUrl: "/help-center",
    actionLabel: "Lihat Tiket",
    createdAt: "2026-10-03T15:20:00Z",
  },
  {
    id: "inbox-4",
    title: "Pemeliharaan Sistem Terjadwal",
    message:
      "Akan dilakukan pemeliharaan server GeoServer pada hari Sabtu pukul 01:00 - 04:00 WIB. Layanan WMS/WFS mungkin mengalami kendala sesaat.",
    category: "sistem",
    isRead: true,
    createdAt: "2026-10-01T12:00:00Z",
  },
];
