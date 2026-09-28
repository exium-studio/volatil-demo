// src/features/notification/hooks/use-inbox.query.ts

import { notificationInboxService } from "@/features/notification/services/notification.inbox.service";
import type { InboxQueryParams } from "@/features/notification/types/inbox.type";
import { useInfiniteQuery } from "@/shared/hooks/use-infinite-query";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useInboxQuery = (params?: InboxQueryParams) => {
  return useInfiniteQuery({
    queryKey: queryKeys.mitra.notification.inboxList(params),
    fetcher: (fetchParams) =>
      notificationInboxService.getInboxList(fetchParams, fetchParams.signal),
    params,
    pageSize: params?.pageSize ?? 10,
    staleTime: 60 * 1000,
  });
};

export const useMarkInboxAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationInboxService.markAsRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.notification.all,
      });
    },
  });
};

export const useMarkAllInboxAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationInboxService.markAllAsRead(),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.notification.all,
      });
    },
  });
};

export const useDeleteInboxItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationInboxService.deleteInbox(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.notification.all,
      });
    },
  });
};

export const useClearAllInbox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationInboxService.clearAllInbox(),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.notification.all,
      });
    },
  });
};
