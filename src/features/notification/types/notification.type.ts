// src/features/notification/types/notification.type.ts

import type { ToastVariant } from "@/design-system/components/toast/types/toast.types";
import type { ReactNode } from "react";

export type NotificationSourceType = "toast" | "system";

export type NotificationItem = {
  id: string;
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

export type NotificationFilterType = "all" | "toast" | "system";

export type NotificationQueryParams = {
  filter?: NotificationFilterType;
  search?: string;
  unreadOnly?: boolean;
};
