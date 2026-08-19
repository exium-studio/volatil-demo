// src/features/mitra/help-center/types/help-center.type.ts

import type { ReactNode } from "react";

export type HelpCenterStatus =
  | "submitted"
  | "in_review"
  | "in_progress"
  | "resolved"
  | "rejected";

export type HelpCenterAttachment = {
  id?: number;
  originalName?: string;
  originalFileName?: string;
  fileName?: string;
  storedFileName?: string;
  mimeType?: string;
  fileType?: string;
  size?: number;
  fileSize?: number;
  url?: string;
  fileUrl?: string;
  createdAt?: string;
};

export type HelpCenterUser = {
  id: number;
  name: string;
  email: string;
  role: "mitra" | "internal";
  organizationName?: string | null;
};

export type HelpCenterResponse = {
  id: number;
  ticketId?: number;
  adminId?: number;
  userId?: number;
  message: string;
  attachments?: HelpCenterAttachment[];
  createdAt: string;
  admin?: HelpCenterUser;
  user?: HelpCenterUser;
};

export type HelpCenterItem = {
  id: number;
  userId?: number;
  title: string;
  description: string;
  status: HelpCenterStatus;
  priority?: "low" | "medium" | "high" | "urgent";
  category?: string;
  attachments?: HelpCenterAttachment[];
  replies?: HelpCenterResponse[];
  responses?: HelpCenterResponse[];
  createdAt: string;
  updatedAt: string;
  user?: HelpCenterUser;
  repliesCount?: number;
  attachmentsCount?: number;
};

export type HelpCenterStatisticsBreakdown = {
  submitted?: number;
  inReview?: number;
  inProgress?: number;
  resolved?: number;
  rejected?: number;
};

export type HelpCenterStatistics = {
  totalTickets: number;
  activeTickets: number;
  resolvedTickets: number;
  breakdown?: HelpCenterStatisticsBreakdown;
};

export type HelpCenterQueryParams = {
  scope?: "all" | "my";
  status?: "active" | "history" | HelpCenterStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageNumber?: number;
  limit?: number;
  itemPerPage?: number;
  itemsPerPage?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
};

export type HelpCenterPagination = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type CreateHelpCenterPayload = {
  title: string;
  description: string;
  priority?: "low" | "medium" | "high" | "urgent";
  category?: string;
  files?: File[];
};

export type ReplyHelpCenterPayload = {
  message: string;
  status?: HelpCenterStatus;
  files?: File[];
};

export type CreateHelpCenterTriggerProps = {
  children: ReactNode;
  modalKey?: string;
  onSubmitTicket?: (
    title: string,
    description: string,
    files?: File[],
  ) => Promise<void> | void;
  isLoading?: boolean;
};

export type CreateHelpCenterModalProps = CreateHelpCenterTriggerProps;
