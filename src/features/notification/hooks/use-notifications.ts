// src/features/notification/hooks/use-notifications.ts

import { useToastHistory } from "@/design-system/components/toast/hooks/use-toast-history";
import {
  DUMMY_SYSTEM_NOTIFICATIONS,
  mapToastHistoryToNotificationItem,
} from "@/features/notification/services/notification.service";
import type {
  NotificationFilterType,
  NotificationItem,
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
  const [filter, setFilter] = useState<NotificationFilterType>("all");
  const [search, setSearch] = useState<string>("");
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);

  // Derived Values: Convert Toast Entries to Notification Items
  const toastItems = useMemo<NotificationItem[]>(
    () => toastHistoryEntries.map(mapToastHistoryToNotificationItem),
    [toastHistoryEntries],
  );

  // Derived Values: Combined All Notifications
  const allNotifications = useMemo<NotificationItem[]>(() => {
    const combined = [...toastItems, ...systemNotifications];
    return combined.sort((a, b) => b.timestamp - a.timestamp);
  }, [toastItems, systemNotifications]);

  // Derived Values: Filtered Notifications
  const filteredNotifications = useMemo<NotificationItem[]>(() => {
    return allNotifications.filter((item) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "toast" && item.sourceType === "toast") ||
        (filter === "system" && item.sourceType === "system");

      const matchesUnread = !unreadOnly || !item.read;

      const trimmedSearch = search.trim().toLowerCase();
      const matchesSearch =
        !trimmedSearch ||
        item.title.toLowerCase().includes(trimmedSearch) ||
        (item.description &&
          item.description.toLowerCase().includes(trimmedSearch)) ||
        (item.category && item.category.toLowerCase().includes(trimmedSearch));

      return matchesFilter && matchesUnread && matchesSearch;
    });
  }, [allNotifications, filter, unreadOnly, search]);

  // Derived Values: Stats
  const unreadCount = useMemo(
    () => allNotifications.filter((n) => !n.read).length,
    [allNotifications],
  );

  const toastCount = useMemo(
    () => toastItems.length,
    [toastItems],
  );

  const systemCount = useMemo(
    () => systemNotifications.length,
    [systemNotifications],
  );

  // Handlers
  const handleMarkItemRead = (id: string, sourceType: "toast" | "system") => {
    if (sourceType === "toast") {
      markRead(id);
    } else {
      setSystemNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
      );
    }
  };

  const handleDeleteItem = (id: string, sourceType: "toast" | "system") => {
    if (sourceType === "toast") {
      deleteOne(id);
    } else {
      setSystemNotifications((prev) => prev.filter((item) => item.id !== id));
    }
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
    notifications: filteredNotifications,
    allNotifications,
    filter,
    setFilter,
    search,
    setSearch,
    unreadOnly,
    setUnreadOnly,
    unreadCount,
    toastCount,
    systemCount,
    totalCount: allNotifications.length,
    markItemRead: handleMarkItemRead,
    deleteItem: handleDeleteItem,
    markAllRead: handleMarkAllRead,
    clearAllHistory: handleClearAllHistory,
  };
};
