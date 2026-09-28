// src/features/notification/api/notification.inbox.api.ts

import { DUMMY_INBOX_ITEMS } from "@/shared/constants/dummy-data/dummy-inbox";
import type {
  InboxListResponse,
  InboxQueryParams,
} from "@/features/notification/types/inbox.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

let localDummyInbox = [...DUMMY_INBOX_ITEMS];

export const getInboxListApi = async (
  params?: InboxQueryParams,
  signal?: AbortSignal,
): Promise<InboxListResponse> => {
  try {
    const response = await apiClient.get<
      ApiResponse<InboxListResponse> | InboxListResponse
    >("/api/inbox", {
      params,
      signal,
    });

    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      response.data
    ) {
      return response.data;
    }

    return response as InboxListResponse;
  } catch (error) {
    if (isDummyDataEnabled()) {
      console.warn(
        "getInboxListApi backend request failed, falling back to dummy data:",
        error,
      );
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
    throw error;
  }
};

export const markInboxAsReadApi = async (
  id: string,
  signal?: AbortSignal,
): Promise<void> => {
  try {
    await apiClient.patch(`/api/inbox/${id}/read`, {}, { signal });
  } catch (error) {
    if (isDummyDataEnabled()) {
      console.warn(
        "markInboxAsReadApi backend request failed, falling back to dummy state:",
        error,
      );
      localDummyInbox = localDummyInbox.map((item) =>
        item.id === id ? { ...item, isRead: true } : item,
      );
      return;
    }
    throw error;
  }
};

export const markAllInboxAsReadApi = async (
  signal?: AbortSignal,
): Promise<void> => {
  try {
    await apiClient.patch("/api/inbox/read-all", {}, { signal });
  } catch (error) {
    if (isDummyDataEnabled()) {
      console.warn(
        "markAllInboxAsReadApi backend request failed, falling back to dummy state:",
        error,
      );
      localDummyInbox = localDummyInbox.map((item) => ({
        ...item,
        isRead: true,
      }));
      return;
    }
    throw error;
  }
};

export const deleteInboxApi = async (
  id: string,
  signal?: AbortSignal,
): Promise<void> => {
  try {
    await apiClient.delete(`/api/inbox/${id}`, { signal });
  } catch (error) {
    if (isDummyDataEnabled()) {
      console.warn(
        "deleteInboxApi backend request failed, falling back to dummy state:",
        error,
      );
      localDummyInbox = localDummyInbox.filter((item) => item.id !== id);
      return;
    }
    throw error;
  }
};

export const clearAllInboxApi = async (
  signal?: AbortSignal,
): Promise<void> => {
  try {
    await apiClient.delete("/api/inbox/clear-all", { signal });
  } catch (error) {
    if (isDummyDataEnabled()) {
      console.warn(
        "clearAllInboxApi backend request failed, falling back to dummy state:",
        error,
      );
      localDummyInbox = [];
      return;
    }
    throw error;
  }
};
