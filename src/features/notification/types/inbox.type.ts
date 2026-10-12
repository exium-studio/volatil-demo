import type { ComponentType } from "react";

export type InboxCategory =
  | "transaksi"
  | "sistem"
  | "bantuan"
  | "akun"
  | "kedaluwarsa";

export type InboxResolvedUI = {
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  icon: ComponentType;
  colorPalette: "blue" | "green" | "orange" | "red" | "purple" | "gray";
};

export type InboxCode =
  // Transaksi
  | "ORDER_CREATED"
  | "ORDER_PAID"
  | "ORDER_PROVISIONING"
  | "ORDER_PENDING_REVIEW"
  | "ORDER_PENDING_TTE"
  | "ORDER_READY"
  | "ORDER_REJECTED"
  | "ORDER_CANCELLED"
  // Kedaluwarsa
  | "WORKSPACE_EXPIRING_H7"
  | "WORKSPACE_EXPIRING_H3"
  | "WORKSPACE_EXPIRING_H1"
  | "WORKSPACE_EXPIRED"
  // Bantuan
  | "TICKET_CREATED"
  | "TICKET_REPLIED"
  | "TICKET_RESOLVED"
  | "TICKET_CLOSED"
  // Akun
  | "MITRA_REGISTRATION_SUBMITTED"
  | "MITRA_REGISTRATION_VERIFIED"
  | "MITRA_REGISTRATION_REJECTED"
  | "SECURITY_PASSWORD_CHANGED"
  | "SECURITY_TOTP_ENABLED"
  // Internal
  | "INTERNAL_NEW_ORDER_REVIEW"
  | "INTERNAL_NEW_REGISTRATION"
  | "SYSTEM_ANNOUNCEMENT";

export type InboxItemMetadata = {
  orderId?: string;
  orderNumber?: string;
  billingCode?: string;
  totalAmount?: number;
  transactionNumber?: string;
  workspaceId?: string;
  workspaceName?: string;
  daysRemaining?: number;
  expiresAt?: string;
  expiredAt?: string;
  ticketId?: string;
  ticketNumber?: string;
  subject?: string;
  senderName?: string;
  registrationId?: string;
  companyName?: string;
  reason?: string;
  changedAt?: string;
  enabledAt?: string;
  mitraName?: string;
  announcementId?: string;
  [key: string]: unknown;
};

export type InboxItem = {
  id: string;
  code?: InboxCode;
  category: InboxCategory;
  isRead: boolean;
  metadata?: InboxItemMetadata;
  createdAt: string;
  readAt?: string | null;
  // Backward-compatibility fallback
  title?: string;
  message?: string;
  actionUrl?: string;
  actionLabel?: string;
};

export type InboxCardItemProps = {
  item: InboxItem;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
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
