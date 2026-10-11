// src/features/notification/services/notification.inbox.service.ts

import {
  clearAllInboxApi,
  deleteInboxApi,
  getInboxListApi,
  getInboxUnreadCountApi,
  markAllInboxAsReadApi,
  markInboxAsReadApi,
} from "@/features/notification/api/notification.inbox.api";
import type {
  InboxListResponse,
  InboxQueryParams,
} from "@/features/notification/types/inbox.type";

export const notificationInboxService = {
  getInboxList: async (
    params?: InboxQueryParams,
    signal?: AbortSignal,
  ): Promise<InboxListResponse> => {
    return getInboxListApi(params, signal);
  },

  getUnreadCount: async (signal?: AbortSignal): Promise<number> => {
    return getInboxUnreadCountApi(signal);
  },

  markAsRead: async (id: string, signal?: AbortSignal): Promise<void> => {
    return markInboxAsReadApi(id, signal);
  },

  markAllAsRead: async (signal?: AbortSignal): Promise<void> => {
    return markAllInboxAsReadApi(signal);
  },

  deleteInbox: async (id: string, signal?: AbortSignal): Promise<void> => {
    return deleteInboxApi(id, signal);
  },

  clearAllInbox: async (signal?: AbortSignal): Promise<void> => {
    return clearAllInboxApi(signal);
  },
};
