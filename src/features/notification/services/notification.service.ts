// src/features/notification/services/notification.service.ts

import type { HistoryEntry } from "@/design-system/components/toast/types/toast.type";
import type { NotificationItem } from "@/features/notification/types/notification.type";

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
    toastId: entry.toastId,
    version: entry.version,
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
