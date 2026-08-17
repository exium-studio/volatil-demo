// src/features/mitra/support-ticket/types/support-ticket.type.ts

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export type TicketAttachment = {
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
};

export type TicketUser = {
  id: number;
  name: string;
  email: string;
  role: "mitra" | "internal";
};

export type TicketResponse = {
  id: number;
  ticketId: number;
  adminId: number;
  message: string;
  attachments: TicketAttachment[];
  createdAt: string;
  admin: TicketUser;
};

export type TicketItem = {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: TicketStatus;
  attachments: TicketAttachment[];
  createdAt: string;
  updatedAt: string;
  user: TicketUser;
  responses: TicketResponse[];
};

export type TicketStatistics = {
  totalTickets: number;
  activeTickets: number;
  resolvedTickets: number;
  breakdown: {
    open: number;
    inProgress: number;
    closed: number;
  };
};

export type TicketQueryParams = {
  scope?: "all" | "my";
  status?: "active" | "history" | TicketStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
};

export type TicketPagination = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type TicketListApiResponse = {
  success: boolean;
  data: TicketItem[];
  pagination: TicketPagination;
};

export type TicketStatisticsApiResponse = {
  success: boolean;
  data: TicketStatistics;
};

export type TicketDetailApiResponse = {
  success: boolean;
  data: TicketItem;
};

export type CreateTicketPayload = {
  title: string;
  description: string;
  files?: File[];
};

export type CreateTicketApiResponse = {
  success: boolean;
  message?: string;
  data: TicketItem;
};

export type ReplyTicketPayload = {
  message: string;
  status?: TicketStatus;
  files?: File[];
};

export type ReplyTicketApiResponse = {
  success: boolean;
  message?: string;
  data: {
    response: TicketResponse;
    ticket: TicketItem;
  };
};

export type CreateSupportTicketTriggerProps = {
  children: React.ReactNode;
  modalKey?: string;
  onSubmitTicket?: (
    title: string,
    description: string,
    files?: File[],
  ) => Promise<void> | void;
  isLoading?: boolean;
};

export type CreateSupportTicketModalProps = CreateSupportTicketTriggerProps;

