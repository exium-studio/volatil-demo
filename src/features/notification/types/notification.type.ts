// src/features/notification/types/notification.type.ts

import type {
  ToastItemData,
  ToastVariant,
} from "@/design-system/components/toast/types/toast.types";
import type { ReactNode } from "react";

export type NotificationSourceType = "toast" | "system";

export type NotificationItem = {
  id: string;
  toastId: string;
  version: number;
  sourceType: NotificationSourceType;
  variant: ToastVariant;
  title: string;
  description?: string;
  timestamp: number;
  read: boolean;
  category?: string;
  metadata?: Record<string, unknown>;
  icon?: ReactNode;
};

export type NotificationCategoryGroup = {
  groupName: string;
  toasts: ToastItemData[];
};

export type NotificationTabValue = "inbox" | "notifications";

export type NotificationHeaderProps = {
  activeTab: NotificationTabValue;
  totalNotifications: number;
  unreadCount: number;
};

export type NotificationTabsProps = {
  activeTab: NotificationTabValue;
  unreadCount: number;
  totalNotifications: number;
  onTabChange: (value: NotificationTabValue) => void;
  categoryGroups: NotificationCategoryGroup[];
  hasNotifications: boolean;
  isReady: boolean;
  isPending: boolean;
  onDeleteGroup: (toasts: ToastItemData[]) => void;
  onDeleteNotification: (id: string) => void;
  onClearAllHistory: () => void;
};

export type NotificationToastHistoryContentProps = {
  categoryGroups: NotificationCategoryGroup[];
  hasNotifications: boolean;
  isReady: boolean;
  isPending: boolean;
  onDeleteGroup: (toasts: ToastItemData[]) => void;
  onDeleteNotification: (id: string) => void;
  onClearAllHistory: () => void;
};

