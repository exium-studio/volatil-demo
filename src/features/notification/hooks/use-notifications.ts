// src/features/notification/hooks/use-notifications.ts

import { DEFAULT_TOAST_GROUP } from "@/design-system/components/toast/core/toast.config";
import { useToastHistory } from "@/design-system/components/toast/hooks/use-toast-history";
import type { ToastRecord } from "@/design-system/components/toast/types/toast.types";
import { mapToastHistoryToNotificationItem } from "@/features/notification/services/notification.service";
import type {
  NotificationCategoryGroup,
  NotificationItem,
} from "@/features/notification/types/notification.type";
import { useMemo } from "react";

export const useNotifications = () => {
  // Hooks (Toast History Engine Store)
  const {
    all: toastHistoryEntries,
    deleteOne,
    deleteMany,
    clear,
  } = useToastHistory();

  // Derived Values: Convert Toast Entries to Notification Items
  const toastItems = useMemo<NotificationItem[]>(
    () => toastHistoryEntries.map(mapToastHistoryToNotificationItem),
    [toastHistoryEntries],
  );

  // Derived Values: Group into Categories (e.g. Permohonan Data, Pusat Bantuan, Sistem)
  const categoryGroups = useMemo<NotificationCategoryGroup[]>(() => {
    const groupedMap = new Map<string, NotificationItem[]>();

    for (const item of toastItems) {
      const category = item.category || DEFAULT_TOAST_GROUP;
      const list = groupedMap.get(category) ?? [];
      list.push(item);
      groupedMap.set(category, list);
    }

    const groups: NotificationCategoryGroup[] = [];

    groupedMap.forEach((items, groupName) => {
      // Sort items within group by timestamp descending
      const sorted = [...items].sort((a, b) => b.timestamp - a.timestamp);

      // Convert items to ToastRecord for standard ToastStack + ToastItem reuse
      const records: ToastRecord[] = sorted.map((item) => ({
        id: item.id,
        group: groupName,
        variant: item.variant,
        title: item.title,
        description: item.description,
        status: "visible",
        createdAt: item.timestamp,
        updatedAt: item.timestamp,
        duration: null,
        remainingDuration: null,
        paused: false,
        isDeletedFromHistory: false,
      }));

      groups.push({
        groupName,
        records,
      });
    });

    // Sort groups so group with newest notification comes first
    return groups.sort((a, b) => {
      const aTime = a.records[0]?.createdAt ?? 0;
      const bTime = b.records[0]?.createdAt ?? 0;
      return bTime - aTime;
    });
  }, [toastItems]);

  const totalNotifications = useMemo(() => {
    return categoryGroups.reduce((acc, g) => acc + g.records.length, 0);
  }, [categoryGroups]);

  // Handlers
  const handleDeleteNotification = (id: string) => {
    deleteOne(id);
  };

  const handleDeleteGroup = (groupRecords: ToastRecord[]) => {
    const ids = groupRecords.map((r) => r.id);
    deleteMany(ids);
  };

  const handleClearAllHistory = () => {
    clear();
  };

  return {
    categoryGroups,
    totalNotifications,
    deleteNotification: handleDeleteNotification,
    deleteGroup: handleDeleteGroup,
    clearAllHistory: handleClearAllHistory,
  };
};
