// src/features/notification/services/notification.service.ts

import type { HistoryEntry } from "@/design-system/components/toast/types/toast.types";
import type { NotificationItem } from "@/features/notification/types/notification.type";

export const DUMMY_SYSTEM_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "sys-notif-1",
    sourceType: "system",
    variant: "info",
    title: "Permohonan Data IGT Disetujui",
    description:
      "Permohonan Data IGT RTRW Kabupaten Badung telah diverifikasi dan disetujui oleh Administrator.",
    timestamp: Date.now() - 3600000 * 2, // 2 hours ago
    read: false,
    category: "Permohonan Data",
  },
  {
    id: "sys-notif-2",
    sourceType: "system",
    variant: "success",
    title: "Kuota Pengunduhan Diperbarui",
    description:
      "Penambahan kuota pengunduhan data sebanyak 50 bidang tanah telah berhasil ditambahkan ke akun Anda.",
    timestamp: Date.now() - 3600000 * 24, // 1 day ago
    read: true,
    category: "Akun Mitra",
  },
  {
    id: "sys-notif-3",
    sourceType: "system",
    variant: "warning",
    title: "Pembaruan Layanan GeoServer",
    description:
      "Layanan WFS & WMS GeoServer Wilayah Bali akan mengalami pemeliharaan rutin pada hari Sabtu pukul 01:00 WIB.",
    timestamp: Date.now() - 3600000 * 48, // 2 days ago
    read: true,
    category: "Sistem & Layanan",
  },
];

export const mapToastHistoryToNotificationItem = (
  entry: HistoryEntry,
): NotificationItem => {
  const rawTitle = entry.title;
  const rawDescription = entry.description;

  const titleString =
    typeof rawTitle === "string"
      ? rawTitle
      : rawTitle
        ? String(rawTitle)
        : "Notifikasi Sistem";

  const descriptionString =
    typeof rawDescription === "string"
      ? rawDescription
      : rawDescription
        ? String(rawDescription)
        : undefined;

  return {
    id: entry.historyEntryId,
    sourceType: "toast",
    variant: entry.variant,
    title: titleString,
    description: descriptionString,
    timestamp: entry.createdAt,
    read: entry.read,
    category: entry.group,
    metadata: entry.metadata,
  };
};
