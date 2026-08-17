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
