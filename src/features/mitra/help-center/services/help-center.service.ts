// src/features/mitra/help-center/services/help-center.service.ts

import {
  getHelpCenterStatisticsApi,
  getHelpCenterTicketByIdApi,
  getHelpCenterTicketsApi,
  postCreateHelpCenterTicketApi,
  postReplyHelpCenterTicketApi,
} from "@/features/mitra/help-center/api/help-center.api";
import {
  DUMMY_HELP_CENTER_STATISTICS,
  DUMMY_HELP_CENTER_TICKETS,
} from "@/features/mitra/help-center/constants/dummy-help-center";
import type {
  CreateHelpCenterPayload,
  HelpCenterAttachment,
  HelpCenterItem,
  HelpCenterListApiResponse,
  HelpCenterQueryParams,
  HelpCenterStatistics,
  ReplyHelpCenterPayload,
} from "@/features/mitra/help-center/types/help-center.type";

export const helpCenterService = {
  getStatistics: async (
    scope?: "my" | "all",
    signal?: AbortSignal,
  ): Promise<HelpCenterStatistics> => {
    try {
      const response = await getHelpCenterStatisticsApi(scope, signal);
      return response.data ?? DUMMY_HELP_CENTER_STATISTICS;
    } catch {
      return DUMMY_HELP_CENTER_STATISTICS;
    }
  },

  getTickets: async (
    params?: HelpCenterQueryParams,
    signal?: AbortSignal,
  ): Promise<HelpCenterListApiResponse> => {
    try {
      return await getHelpCenterTicketsApi(params, signal);
    } catch {
      const search = params?.search?.trim().toLowerCase();
      const filtered = search
        ? DUMMY_HELP_CENTER_TICKETS.filter(
            (t) =>
              t.title.toLowerCase().includes(search) ||
              t.description.toLowerCase().includes(search),
          )
        : DUMMY_HELP_CENTER_TICKETS;

      return {
        success: true,
        data: filtered,
        pagination: {
          totalItems: filtered.length,
          totalPages: 1,
          currentPage: 1,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }
  },

  getTicketById: async (
    id: number,
    signal?: AbortSignal,
  ): Promise<HelpCenterItem> => {
    try {
      const response = await getHelpCenterTicketByIdApi(id, signal);
      return response.data;
    } catch {
      const found =
        DUMMY_HELP_CENTER_TICKETS.find((t) => t.id === id) ??
        DUMMY_HELP_CENTER_TICKETS[0];
      return found;
    }
  },

  createTicket: async (
    payload: CreateHelpCenterPayload,
    signal?: AbortSignal,
  ): Promise<HelpCenterItem> => {
    try {
      const response = await postCreateHelpCenterTicketApi(payload, signal);
      return response.data;
    } catch {
      const nowIso = new Date().toISOString();
      const mockAttachments: HelpCenterAttachment[] = (payload.files ?? []).map(
        (file, index) => ({
          originalName: file.name,
          fileName: `${Date.now()}-${index}-${file.name}`,
          mimeType: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
        }),
      );

      const mockCreatedTicket: HelpCenterItem = {
        id: Date.now(),
        userId: 1,
        title: payload.title,
        description: payload.description,
        status: "open",
        attachments: mockAttachments,
        createdAt: nowIso,
        updatedAt: nowIso,
        user: {
          id: 1,
          name: "Mitra User Demo",
          email: "mitra@demo.com",
          role: "mitra",
        },
        responses: [],
      };

      return mockCreatedTicket;
    }
  },

  replyTicket: async (
    id: number,
    payload: ReplyHelpCenterPayload,
    signal?: AbortSignal,
  ) => {
    try {
      const response = await postReplyHelpCenterTicketApi(id, payload, signal);
      return response.data;
    } catch {
      const nowIso = new Date().toISOString();
      const mockAttachments: HelpCenterAttachment[] = (payload.files ?? []).map(
        (file, index) => ({
          originalName: file.name,
          fileName: `${Date.now()}-${index}-${file.name}`,
          mimeType: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
        }),
      );

      return {
        id: Date.now(),
        ticketId: id,
        userId: 1,
        message: payload.message,
        attachments: mockAttachments,
        createdAt: nowIso,
        user: {
          id: 1,
          name: "Mitra User Demo",
          email: "mitra@demo.com",
          role: "mitra",
        },
      };
    }
  },
};
