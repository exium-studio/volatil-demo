// src/features/notification/types/inbox.type.ts

export type InboxCategory =
  | "transaksi"
  | "sistem"
  | "bantuan"
  | "akun"
  | "kedaluwarsa";

export type InboxCardItemProps = {
  item: InboxItem;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
};

export type InboxItemMetadata = {
  workspaceId?: string;
  workspaceName?: string;
  orderId?: string;
  expiresAt?: string;
  daysRemaining?: number;
  [key: string]: unknown;
};

export type InboxItem = {
  id: string;
  title: string;
  message: string;
  category: InboxCategory;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: InboxItemMetadata;
  createdAt: string;
};

export type InboxQueryParams = {
  page?: number;
  pageSize?: number;
  category?: InboxCategory;
  isRead?: boolean;
  search?: string;
};

export type InboxListResponse = {
  items: InboxItem[];
  total: number;
  unreadCount: number;
  page?: number;
  pageSize?: number;
};
