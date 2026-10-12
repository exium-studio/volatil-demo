// src/features/notification/api/notification.inbox.api.ts

import { DUMMY_INBOX_ITEMS } from "@/shared/constants/dummy-data/dummy-inbox";
import type {
  InboxItem,
  InboxListResponse,
  InboxQueryParams,
} from "@/features/notification/types/inbox.type";
import { resolveInboxUI } from "@/features/notification/constants/inbox-code-resolver";
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
      ApiResponse<{
        items: InboxItem[];
        unreadCount: number;
        pagination: {
          totalItems: number;
          totalPages: number;
          currentPage: number;
          itemsPerPage: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      }> | InboxListResponse
    >("/api/inbox", {
      params,
      signal,
    });

    const rawData =
      response && typeof response === "object" && "data" in response && response.data
        ? response.data
        : (response as InboxListResponse);

    const items = rawData.items ?? [];
    const unreadCount = rawData.unreadCount ?? 0;
    const rawTotal = "total" in rawData ? (rawData.total as number) : undefined;
    const rawPagination = "pagination" in rawData ? rawData.pagination : undefined;

    const pagination = rawPagination ?? {
      totalItems: rawTotal ?? items.length,
      totalPages: Math.ceil((rawTotal ?? items.length) / (params?.pageSize ?? 10)) || 1,
      currentPage: params?.page ?? 1,
      itemsPerPage: params?.pageSize ?? 10,
      hasNextPage: false,
      hasPrevPage: false,
    };

    return {
      items,
      unreadCount,
      pagination,
      total: pagination.totalItems,
      page: pagination.currentPage,
      pageSize: pagination.itemsPerPage,
    };
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
        const boolIsRead =
          params.isRead === true || params.isRead === "true";
        filtered = filtered.filter((i) => i.isRead === boolIsRead);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter((i) => {
          const resolved = resolveInboxUI(i);
          return (
            resolved.title.toLowerCase().includes(q) ||
            resolved.message.toLowerCase().includes(q)
          );
        });
      }

      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 10;
      const totalItems = filtered.length;
      const totalPages = Math.ceil(totalItems / pageSize) || 1;
      const startIndex = (page - 1) * pageSize;
      const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

      return {
        items: paginatedItems,
        unreadCount: filtered.filter((i) => !i.isRead).length,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
          itemsPerPage: pageSize,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        total: totalItems,
        page,
        pageSize,
      };
    }
    throw error;
  }
};

export const getInboxUnreadCountApi = async (
  signal?: AbortSignal,
): Promise<number> => {
  try {
    const response = await apiClient.get<
      ApiResponse<{ unreadCount: number }> | { unreadCount: number }
    >("/api/inbox/unread-count", { signal });

    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      response.data
    ) {
      return response.data.unreadCount ?? 0;
    }

    return (response as { unreadCount: number })?.unreadCount ?? 0;
  } catch (error) {
    if (isDummyDataEnabled()) {
      return localDummyInbox.filter((item) => !item.isRead).length;
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
