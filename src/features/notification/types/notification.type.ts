// src/features/notification/types/notification.type.ts

import type {
  ToastRecord,
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
  records: ToastRecord[];
};

