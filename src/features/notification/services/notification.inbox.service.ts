// src/features/notification/services/notification.inbox.service.ts

import {
  getInboxListApi,
  markInboxAsReadApi,
} from "@/features/notification/api/notification.inbox.api";
import type { InboxListResponse } from "@/features/notification/types/inbox.type";

export const notificationInboxService = {
  getInboxList: async (signal?: AbortSignal): Promise<InboxListResponse> => {
    return getInboxListApi(signal);
  },

  markAsRead: async (id: string, signal?: AbortSignal): Promise<void> => {
    return markInboxAsReadApi(id, signal);
  },
};
