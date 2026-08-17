// src/features/mitra/help-center/services/help-center.service.ts

import {
  getHelpCenterTicketByIdApi,
  getHelpCenterTicketsApi,
  getHelpCenterStatisticsApi,
  postCreateHelpCenterTicketApi,
  postReplyHelpCenterTicketApi,
} from "@/features/mitra/help-center/api/help-center.api";
import type {
  CreateHelpCenterPayload,
  HelpCenterDetailApiResponse,
  HelpCenterItem,
  HelpCenterListApiResponse,
  HelpCenterQueryParams,
  HelpCenterStatistics,
  HelpCenterStatisticsApiResponse,
  ReplyHelpCenterPayload,
} from "@/features/mitra/help-center/types/help-center.type";

export const helpCenterService = {
  getStatistics: async (
    scope?: "my" | "all",
    signal?: AbortSignal,
  ): Promise<HelpCenterStatistics> => {
    const response: HelpCenterStatisticsApiResponse =
      await getHelpCenterStatisticsApi(scope, signal);
    return response.data;
  },

  getTickets: async (
    params?: HelpCenterQueryParams,
    signal?: AbortSignal,
  ): Promise<HelpCenterListApiResponse> => {
    return getHelpCenterTicketsApi(params, signal);
  },

  getTicketById: async (
    id: number,
    signal?: AbortSignal,
  ): Promise<HelpCenterItem> => {
    const response: HelpCenterDetailApiResponse =
      await getHelpCenterTicketByIdApi(id, signal);
    return response.data;
  },

  createTicket: async (
    payload: CreateHelpCenterPayload,
    signal?: AbortSignal,
  ): Promise<HelpCenterItem> => {
    const response = await postCreateHelpCenterTicketApi(payload, signal);
    return response.data;
  },

  replyTicket: async (
    id: number,
    payload: ReplyHelpCenterPayload,
    signal?: AbortSignal,
  ) => {
    const response = await postReplyHelpCenterTicketApi(id, payload, signal);
    return response.data;
  },
};
