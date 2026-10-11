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
  readAt?: string | null;
};

export type InboxQueryParams = {
  page?: number;
  pageSize?: number;
  category?: InboxCategory;
  isRead?: boolean | string;
  search?: string;
};

export type InboxPagination = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type InboxListResponse = {
  items: InboxItem[];
  unreadCount: number;
  pagination: InboxPagination;
  // Backward compatibility convenience fields
  total: number;
  page: number;
  pageSize: number;
};

export type InboxUnreadCountResponse = {
  unreadCount: number;
};

export type InboxActionSuccessResponse = {
  success: boolean;
  message?: string;
  data?: unknown;
};
