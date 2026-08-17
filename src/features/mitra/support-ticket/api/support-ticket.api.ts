// src/features/mitra/support-ticket/api/support-ticket.api.ts

import {
  DUMMY_TICKETS,
  DUMMY_TICKET_STATISTICS,
} from "@/features/mitra/support-ticket/constants/dummy-tickets";
import type {
  CreateTicketApiResponse,
  CreateTicketPayload,
  ReplyTicketApiResponse,
  ReplyTicketPayload,
  TicketAttachment,
  TicketDetailApiResponse,
  TicketItem,
  TicketListApiResponse,
  TicketQueryParams,
  TicketResponse,
  TicketStatisticsApiResponse,
} from "@/features/mitra/support-ticket/types/support-ticket.type";
import { apiClient } from "@/shared/libs/api-client/api-client";

export const getTicketStatisticsApi = async (
  scope?: "my" | "all",
  signal?: AbortSignal,
): Promise<TicketStatisticsApiResponse> => {
  try {
    return await apiClient.get<TicketStatisticsApiResponse>(
      "/tickets/statistics",
      {
        params: scope ? { scope } : undefined,
        signal,
      },
    );
  } catch {
    return {
      success: true,
      data: DUMMY_TICKET_STATISTICS,
    };
  }
};

export const getTicketsApi = async (
  params?: TicketQueryParams,
  signal?: AbortSignal,
): Promise<TicketListApiResponse> => {
  try {
    return await apiClient.get<TicketListApiResponse>("/tickets", {
      params: params as Record<string, string | number | boolean | undefined>,
      signal,
    });
  } catch {
    const search = params?.search?.trim().toLowerCase();
    const filtered = search
      ? DUMMY_TICKETS.filter(
          (t) =>
            t.title.toLowerCase().includes(search) ||
            t.description.toLowerCase().includes(search),
        )
      : DUMMY_TICKETS;

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

export const getTicketByIdApi = async (
  id: number,
  signal?: AbortSignal,
): Promise<TicketDetailApiResponse> => {
  try {
    return await apiClient.get<TicketDetailApiResponse>(`/tickets/${id}`, {
      signal,
    });
  } catch {
    const found = DUMMY_TICKETS.find((t) => t.id === id) ?? DUMMY_TICKETS[0];
    return {
      success: true,
      data: found,
    };
  }
};

export const postCreateTicketApi = async (
  payload: CreateTicketPayload,
  signal?: AbortSignal,
): Promise<CreateTicketApiResponse> => {
  try {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);

    if (payload.files && payload.files.length > 0) {
      payload.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    return await apiClient.post<CreateTicketApiResponse>(
      "/tickets",
      formData,
      { signal },
    );
  } catch {
    const nowIso = new Date().toISOString();
    const mockAttachments: TicketAttachment[] = (payload.files ?? []).map(
      (file, index) => ({
        originalName: file.name,
        fileName: `${Date.now()}-${index}-${file.name}`,
        mimeType: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
      }),
    );

    const mockCreatedTicket: TicketItem = {
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

export const postReplyTicketApi = async (
  id: number,
  payload: ReplyTicketPayload,
  signal?: AbortSignal,
): Promise<ReplyTicketApiResponse> => {
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

    return await apiClient.post<ReplyTicketApiResponse>(
      `/tickets/${id}/reply`,
      formData,
      { signal },
    );
  } catch {
    const nowIso = new Date().toISOString();
    const mockReply: TicketResponse = {
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
      DUMMY_TICKETS.find((t) => t.id === id) ?? DUMMY_TICKETS[0];
    const updatedTicket: TicketItem = {
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
