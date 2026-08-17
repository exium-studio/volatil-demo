// src/features/mitra/help-center/types/help-center.type.ts

import type { ReactNode } from "react";

export type HelpCenterStatus = "open" | "in_progress" | "resolved" | "closed";

export type HelpCenterAttachment = {
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
};

export type HelpCenterUser = {
  id: number;
  name: string;
  email: string;
  role: "mitra" | "internal";
};

export type HelpCenterResponse = {
  id: number;
  ticketId: number;
  adminId: number;
  message: string;
  attachments: HelpCenterAttachment[];
  createdAt: string;
  admin: HelpCenterUser;
};

export type HelpCenterItem = {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: HelpCenterStatus;
  attachments: HelpCenterAttachment[];
  createdAt: string;
  updatedAt: string;
  user: HelpCenterUser;
  responses: HelpCenterResponse[];
};

export type HelpCenterStatistics = {
  totalTickets: number;
  activeTickets: number;
  resolvedTickets: number;
  breakdown: {
    open: number;
    inProgress: number;
    closed: number;
  };
};

export type HelpCenterQueryParams = {
  scope?: "all" | "my";
  status?: "active" | "history" | HelpCenterStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
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

export type HelpCenterListApiResponse = {
  success: boolean;
  data: HelpCenterItem[];
  pagination: HelpCenterPagination;
};

export type HelpCenterStatisticsApiResponse = {
  success: boolean;
  data: HelpCenterStatistics;
};

export type HelpCenterDetailApiResponse = {
  success: boolean;
  data: HelpCenterItem;
};

export type CreateHelpCenterPayload = {
  title: string;
  description: string;
  files?: File[];
};

export type CreateHelpCenterApiResponse = {
  success: boolean;
  message?: string;
  data: HelpCenterItem;
};

export type ReplyHelpCenterPayload = {
  message: string;
  status?: HelpCenterStatus;
  files?: File[];
};

export type ReplyHelpCenterApiResponse = {
  success: boolean;
  message?: string;
  data: {
    response: HelpCenterResponse;
    ticket: HelpCenterItem;
  };
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
