// src/features/notification/api/notification.inbox.api.ts

import type { InboxListResponse } from "@/features/notification/types/inbox.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";
import { DUMMY_INBOX_ITEMS } from "@/shared/constants/dummy-data/dummy-inbox";

export const getInboxListApi = async (
  signal?: AbortSignal,
): Promise<InboxListResponse> => {
  if (isDummyDataEnabled()) {
    return {
      items: DUMMY_INBOX_ITEMS,
      total: DUMMY_INBOX_ITEMS.length,
      unreadCount: DUMMY_INBOX_ITEMS.filter((i) => !i.isRead).length,
    };
  }

  return apiClient.get<InboxListResponse>("/api/v1/inbox", { signal });
};

export const markInboxAsReadApi = async (
  id: string,
  signal?: AbortSignal,
): Promise<void> => {
  if (isDummyDataEnabled()) {
    return;
  }

  await apiClient.patch(`/api/v1/inbox/${id}/read`, {}, { signal });
};
