// src/shared/constants/dummy-data/dummy-inbox.ts

import type { InboxItem } from "@/features/notification/types/inbox.type";

export const DUMMY_INBOX_ITEMS: InboxItem[] = [
  {
    id: "inbox-1",
    title: "Permohonan Data Disetujui",
    message: "Permohonan data IGT RTRW Badung (ORD-2026-00192) telah disetujui oleh admin. Silakan aktifkan kredensial akses Anda.",
    category: "transaksi",
    isRead: false,
    actionUrl: "/my-data",
    createdAt: "2026-03-18T10:35:00Z",
  },
  {
    id: "inbox-2",
    title: "Tiket Bantuan Ditanggapi",
    message: "Tiket laporan #102 ('Payment gagal tapi saldo berkurang') telah mendapat tanggapan baru dari tim teknis.",
    category: "bantuan",
    isRead: false,
    actionUrl: "/help-center/102",
    createdAt: "2026-03-17T15:20:00Z",
  },
  {
    id: "inbox-3",
    title: "Masa Aktif Layer Mendekati Batas",
    message: "Masa aktif akses WFS Layer ZNT Badung akan berakhir dalam 3 hari. Segera lakukan perpanjangan jika masih dibutuhkan.",
    category: "sistem",
    isRead: true,
    actionUrl: "/my-data",
    createdAt: "2026-03-15T08:00:00Z",
  },
  {
    id: "inbox-4",
    title: "Pemeliharaan Sistem Terjadwal",
    message: "Akan dilakukan pemeliharaan server GeoServer pada hari Sabtu pukul 01:00 - 04:00 WIB. Layanan WMS/WFS mungkin mengalami kendala sesaat.",
    category: "sistem",
    isRead: true,
    createdAt: "2026-03-10T12:00:00Z",
  },
];
