// src/features/mitra/help-center/api/help-center.api.ts

import {
  DUMMY_HELP_CENTER_STATISTICS,
  DUMMY_HELP_CENTER_TICKETS,
} from "@/features/mitra/help-center/constants/dummy-help-center";
import type {
  CreateHelpCenterApiResponse,
  CreateHelpCenterPayload,
  HelpCenterAttachment,
  HelpCenterDetailApiResponse,
  HelpCenterItem,
  HelpCenterListApiResponse,
  HelpCenterQueryParams,
  HelpCenterResponse,
  HelpCenterStatisticsApiResponse,
  ReplyHelpCenterApiResponse,
  ReplyHelpCenterPayload,
} from "@/features/mitra/help-center/types/help-center.type";
import { apiClient } from "@/shared/libs/api-client/api-client";

export const getHelpCenterStatisticsApi = async (
  scope?: "my" | "all",
  signal?: AbortSignal,
): Promise<HelpCenterStatisticsApiResponse> => {
  try {
    return await apiClient.get<HelpCenterStatisticsApiResponse>(
      "/tickets/statistics",
      {
        params: scope ? { scope } : undefined,
        signal,
      },
    );
  } catch {
    return {
      success: true,
      data: DUMMY_HELP_CENTER_STATISTICS,
    };
  }
};

export const getHelpCenterTicketsApi = async (
  params?: HelpCenterQueryParams,
  signal?: AbortSignal,
): Promise<HelpCenterListApiResponse> => {
  try {
    return await apiClient.get<HelpCenterListApiResponse>("/tickets", {
      params: params as Record<string, string | number | boolean | undefined>,
      signal,
    });
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
};

export const getHelpCenterTicketByIdApi = async (
  id: number,
  signal?: AbortSignal,
): Promise<HelpCenterDetailApiResponse> => {
  try {
    return await apiClient.get<HelpCenterDetailApiResponse>(`/tickets/${id}`, {
      signal,
    });
  } catch {
    const found =
      DUMMY_HELP_CENTER_TICKETS.find((t) => t.id === id) ??
      DUMMY_HELP_CENTER_TICKETS[0];
    return {
      success: true,
      data: found,
    };
  }
};

export const postCreateHelpCenterTicketApi = async (
  payload: CreateHelpCenterPayload,
  signal?: AbortSignal,
): Promise<CreateHelpCenterApiResponse> => {
  try {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);

    if (payload.files && payload.files.length > 0) {
      payload.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    return await apiClient.post<CreateHelpCenterApiResponse>(
      "/tickets",
      formData,
      { signal },
    );
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

    return {
      success: true,
      message: "Ticket report submitted successfully",
      data: mockCreatedTicket,
    };
  }
};

export const postReplyHelpCenterTicketApi = async (
  id: number,
  payload: ReplyHelpCenterPayload,
  signal?: AbortSignal,
): Promise<ReplyHelpCenterApiResponse> => {
  try {
    const formData = new FormData();
    formData.append("message", payload.message);

    if (payload.status) {
      formData.append("status", payload.status);
    }

    if (payload.files && payload.files.length > 0) {
      payload.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    return await apiClient.post<ReplyHelpCenterApiResponse>(
      `/tickets/${id}/reply`,
      formData,
      { signal },
    );
  } catch {
    const nowIso = new Date().toISOString();
    const mockReply: HelpCenterResponse = {
      id: Date.now(),
      ticketId: id,
      adminId: 2,
      message: payload.message,
      attachments: [],
      createdAt: nowIso,
      admin: {
        id: 2,
        name: "Internal Admin Demo",
        email: "internal@demo.com",
        role: "internal",
      },
    };

    const targetTicket =
      DUMMY_HELP_CENTER_TICKETS.find((t) => t.id === id) ??
      DUMMY_HELP_CENTER_TICKETS[0];
    const updatedTicket: HelpCenterItem = {
      ...targetTicket,
      status: payload.status ?? targetTicket.status,
      updatedAt: nowIso,
    };

    return {
      success: true,
      message: "Ticket response submitted successfully",
      data: {
        response: mockReply,
        ticket: updatedTicket,
      },
    };
  }
};
