// src/features/mitra/support-ticket/types/support-ticket.type.ts

export type TicketStatus = "active" | "resolved" | "pending";

export type TicketAttachment = {
  id: string;
  fileName: string;
  fileType: "image" | "video" | "document";
  url?: string;
};

export type TicketReply = {
  id: string;
  authorName: string;
  authorRole: "admin" | "user";
  isVerified?: boolean;
  avatarUrl?: string;
  createdAt: string;
  content: string;
};

export type TicketItem = {
  id: string;
  authorName: string;
  isCurrentUser?: boolean;
  avatarUrl?: string;
  createdAt: string;
  status: TicketStatus;
  title: string;
  description: string;
  attachments?: TicketAttachment[];
  upvotesCount: number;
  isUpvoted?: boolean;
  replies?: TicketReply[];
};

export type TicketSummaryMetrics = {
  activeCount: number;
  resolvedCount: number;
  totalCount: number;
};

export type TicketFilterParams = {
  tab: "all" | "mine";
  search?: string;
  range?: "1H" | "1M" | "1B" | "1T" | "all";
};
