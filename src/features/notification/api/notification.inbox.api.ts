// src/features/notification/api/notification.inbox.api.ts

import { DUMMY_INBOX_ITEMS } from "@/shared/constants/dummy-data/dummy-inbox";
import type {
  InboxListResponse,
  InboxQueryParams,
} from "@/features/notification/types/inbox.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

let localDummyInbox = [...DUMMY_INBOX_ITEMS];

export const getInboxListApi = async (
  params?: InboxQueryParams,
  signal?: AbortSignal,
): Promise<InboxListResponse> => {
  if (isDummyDataEnabled()) {
    let filtered = [...localDummyInbox];

    if (params?.category) {
      filtered = filtered.filter((i) => i.category === params.category);
    }
    if (params?.isRead !== undefined) {
      filtered = filtered.filter((i) => i.isRead === params.isRead);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.message.toLowerCase().includes(q),
      );
    }

    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      total: filtered.length,
      unreadCount: filtered.filter((i) => !i.isRead).length,
      page,
      pageSize,
    };
  }

  return apiClient.get<InboxListResponse>("/api/v1/inbox", {
    params,
    signal,
  });
};

export const markInboxAsReadApi = async (
  id: string,
  signal?: AbortSignal,
): Promise<void> => {
  if (isDummyDataEnabled()) {
    localDummyInbox = localDummyInbox.map((item) =>
      item.id === id ? { ...item, isRead: true } : item,
    );
    return;
  }

  await apiClient.patch(`/api/v1/inbox/${id}/read`, {}, { signal });
};

export const markAllInboxAsReadApi = async (
  signal?: AbortSignal,
): Promise<void> => {
  if (isDummyDataEnabled()) {
    localDummyInbox = localDummyInbox.map((item) => ({
      ...item,
      isRead: true,
    }));
    return;
  }

  await apiClient.patch("/api/v1/inbox/read-all", {}, { signal });
};

export const deleteInboxApi = async (
  id: string,
  signal?: AbortSignal,
): Promise<void> => {
  if (isDummyDataEnabled()) {
    localDummyInbox = localDummyInbox.filter((item) => item.id !== id);
    return;
  }

  await apiClient.delete(`/api/v1/inbox/${id}`, { signal });
};

export const clearAllInboxApi = async (
  signal?: AbortSignal,
): Promise<void> => {
  if (isDummyDataEnabled()) {
    localDummyInbox = [];
    return;
  }

  await apiClient.delete("/api/v1/inbox/clear-all", { signal });
};
