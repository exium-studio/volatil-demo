// src/features/notification/types/inbox.type.ts

export type InboxCategory = "transaksi" | "sistem" | "bantuan" | "akun";

export type InboxItem = {
  id: string;
  title: string;
  message: string;
  category: InboxCategory;
  isRead: boolean;
  actionUrl?: string;
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
