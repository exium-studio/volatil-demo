// src/features/mitra/support-ticket/services/support-ticket.service.ts

import {
  getTicketByIdApi,
  getTicketsApi,
  getTicketStatisticsApi,
  postCreateTicketApi,
  postReplyTicketApi,
} from "@/features/mitra/support-ticket/api/support-ticket.api";
import type {
  CreateTicketPayload,
  ReplyTicketPayload,
  TicketDetailApiResponse,
  TicketItem,
  TicketListApiResponse,
  TicketQueryParams,
  TicketStatistics,
  TicketStatisticsApiResponse,
} from "@/features/mitra/support-ticket/types/support-ticket.type";

export const supportTicketService = {
  getStatistics: async (
    scope?: "my" | "all",
    signal?: AbortSignal,
  ): Promise<TicketStatistics> => {
    const response: TicketStatisticsApiResponse = await getTicketStatisticsApi(
      scope,
      signal,
    );
    return response.data;
  },

  getTickets: async (
    params?: TicketQueryParams,
    signal?: AbortSignal,
  ): Promise<TicketListApiResponse> => {
    return getTicketsApi(params, signal);
  },

  getTicketById: async (
    id: number,
    signal?: AbortSignal,
  ): Promise<TicketItem> => {
    const response: TicketDetailApiResponse = await getTicketByIdApi(
      id,
      signal,
    );
    return response.data;
  },

  createTicket: async (
    payload: CreateTicketPayload,
    signal?: AbortSignal,
  ): Promise<TicketItem> => {
    const response = await postCreateTicketApi(payload, signal);
    return response.data;
  },

  replyTicket: async (
    id: number,
    payload: ReplyTicketPayload,
    signal?: AbortSignal,
  ) => {
    const response = await postReplyTicketApi(id, payload, signal);
    return response.data;
  },
};
