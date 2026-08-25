// src/features/mitra/help-center/services/help-center.service.ts

import {
  getHelpCenterStatisticsApi,
  getHelpCenterTicketByIdApi,
  getHelpCenterTicketsApi,
  postCreateHelpCenterTicketApi,
  postRejectHelpCenterTicketApi,
  postReplyHelpCenterTicketApi,
  postResolveHelpCenterTicketApi,
} from "@/features/mitra/help-center/api/help-center.api";
import type {
  CreateHelpCenterApiResponse,
  HelpCenterListApiResponse,
  ReplyHelpCenterApiResponse,
} from "@/features/mitra/help-center/types/help-center.api.type";
import type {
  CreateHelpCenterPayload,
  HelpCenterItem,
  HelpCenterQueryParams,
  HelpCenterStatistics,
  HelpCenterStatus,
  RejectHelpCenterPayload,
  ReplyHelpCenterPayload,
  ResolveHelpCenterPayload,
} from "@/features/mitra/help-center/types/help-center.type";

const EMPTY_STATISTICS: HelpCenterStatistics = {
  totalTickets: 0,
  activeTickets: 0,
  resolvedTickets: 0,
  breakdown: {
    submitted: 0,
    inReview: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
  },
};

const normalizeHelpCenterStatus = (
  rawStatus: string | undefined,
): HelpCenterStatus => {
  switch (rawStatus) {
    case "in_review":
      return "in_review";
    case "in_progress":
      return "in_progress";
    case "resolved":
    case "closed":
      return "resolved";
    case "rejected":
      return "rejected";
    case "submitted":
    case "open":
    default:
      return "submitted";
  }
};

export const helpCenterService = {
  getStatistics: async (
    scope?: "my" | "all",
    signal?: AbortSignal,
  ): Promise<HelpCenterStatistics> => {
    try {
      const response = await getHelpCenterStatisticsApi(scope, signal);
      return response.data ?? EMPTY_STATISTICS;
    } catch {
      return EMPTY_STATISTICS;
    }
  },

  getTickets: async (
    params?: HelpCenterQueryParams,
    signal?: AbortSignal,
  ): Promise<HelpCenterListApiResponse> => {
    try {
      const response = await getHelpCenterTicketsApi(params, signal);
      const normalizedData = (response.data ?? []).map((ticket) => ({
        ...ticket,
        status: normalizeHelpCenterStatus(ticket.status),
      }));

      return {
        ...response,
        data: normalizedData,
      };
    } catch {
      return {
        success: false,
        data: [],
        pagination: {
          totalItems: 0,
          totalPages: 1,
          currentPage: params?.page ?? 1,
          itemsPerPage: params?.limit ?? 10,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }
  },

  getTicketById: async (
    id: number | string,
    signal?: AbortSignal,
  ): Promise<HelpCenterItem | null> => {
    try {
      const response = await getHelpCenterTicketByIdApi(id, signal);
      if (!response.data) return null;
      return {
        ...response.data,
        status: normalizeHelpCenterStatus(response.data.status),
      };
    } catch {
      return null;
    }
  },

  createTicket: async (
    payload: CreateHelpCenterPayload,
    signal?: AbortSignal,
  ): Promise<CreateHelpCenterApiResponse> => {
    return postCreateHelpCenterTicketApi(payload, signal);
  },

  replyTicket: async (
    id: number | string,
    payload: ReplyHelpCenterPayload,
    signal?: AbortSignal,
  ): Promise<ReplyHelpCenterApiResponse> => {
    return postReplyHelpCenterTicketApi(id, payload, signal);
  },

  resolveTicket: async (
    id: number | string,
    payload: ResolveHelpCenterPayload,
    signal?: AbortSignal,
  ): Promise<ReplyHelpCenterApiResponse> => {
    return postResolveHelpCenterTicketApi(id, payload, signal);
  },

  rejectTicket: async (
    id: number | string,
    payload: RejectHelpCenterPayload,
    signal?: AbortSignal,
  ): Promise<ReplyHelpCenterApiResponse> => {
    return postRejectHelpCenterTicketApi(id, payload, signal);
  },
};
