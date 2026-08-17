// src/features/notification/hooks/use-notifications.ts

import { useToastHistory } from "@/design-system/components/toast/hooks/use-toast-history";
import {
  DUMMY_SYSTEM_NOTIFICATIONS,
  mapToastHistoryToNotificationItem,
} from "@/features/notification/services/notification.service";
import type {
  NotificationItem,
  NotificationStackGroup,
} from "@/features/notification/types/notification.type";
import { useMemo, useState } from "react";

export const useNotifications = () => {
  // Hooks (Toast History Engine Store)
  const {
    all: toastHistoryEntries,
    deleteOne,
    clear,
    markRead,
    markAllRead,
  } = useToastHistory();

  // Local State for System Inbox Read/Delete Management
  const [systemNotifications, setSystemNotifications] = useState<
    NotificationItem[]
  >(DUMMY_SYSTEM_NOTIFICATIONS);

  // Derived Values: Convert Toast Entries to Notification Items
  const toastItems = useMemo<NotificationItem[]>(
    () => toastHistoryEntries.map(mapToastHistoryToNotificationItem),
    [toastHistoryEntries],
  );

  // Derived Values: Group into Notification Stacks (Grouped by toastId)
  const notificationStacks = useMemo<NotificationStackGroup[]>(() => {
    const combined = [...toastItems, ...systemNotifications];
    const groupedMap = new Map<string, NotificationItem[]>();

    for (const item of combined) {
      const groupKey = item.toastId || item.id;
      const list = groupedMap.get(groupKey) ?? [];
      list.push(item);
      groupedMap.set(groupKey, list);
    }

    const stacks: NotificationStackGroup[] = [];

    groupedMap.forEach((entries, toastId) => {
      // Sort entries inside stack by timestamp descending (latest update state on top)
      const sortedEntries = [...entries].sort(
        (a, b) => b.timestamp - a.timestamp,
      );
      const latest = sortedEntries[0];
      stacks.push({
        toastId,
        latest,
        entries: sortedEntries,
      });
    });

    // Sort stacks by latest timestamp descending
    return stacks.sort((a, b) => b.latest.timestamp - a.latest.timestamp);
  }, [toastItems, systemNotifications]);

  // Derived Values: Stats
  const unreadCount = useMemo(() => {
    return notificationStacks.filter((stack) => stack.entries.some((e) => !e.read)).length;
  }, [notificationStacks]);

  // Handlers
  const handleMarkStackRead = (toastId: string) => {
    const stack = notificationStacks.find((s) => s.toastId === toastId);
    if (!stack) return;

    stack.entries.forEach((item) => {
      if (item.sourceType === "toast") {
        markRead(item.id);
      }
    });

    setSystemNotifications((prev) =>
      prev.map((item) =>
        item.toastId === toastId || item.id === toastId
          ? { ...item, read: true }
          : item,
      ),
    );
  };

  const handleDeleteStack = (toastId: string) => {
    const stack = notificationStacks.find((s) => s.toastId === toastId);
    if (!stack) return;

    stack.entries.forEach((item) => {
      if (item.sourceType === "toast") {
        deleteOne(item.id);
      }
    });

    setSystemNotifications((prev) =>
      prev.filter((item) => item.toastId !== toastId && item.id !== toastId),
    );
  };

  const handleMarkAllRead = () => {
    markAllRead();
    setSystemNotifications((prev) =>
      prev.map((item) => ({ ...item, read: true })),
    );
  };

  const handleClearAllHistory = () => {
    clear();
    setSystemNotifications([]);
  };

  return {
    notificationStacks,
    totalStacks: notificationStacks.length,
    unreadCount,
    markStackRead: handleMarkStackRead,
    deleteStack: handleDeleteStack,
    markAllRead: handleMarkAllRead,
    clearAllHistory: handleClearAllHistory,
  };
};
