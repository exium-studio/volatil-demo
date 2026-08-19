// src/features/notification/hooks/use-inbox.query.ts

import { notificationInboxService } from "@/features/notification/services/notification.inbox.service";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useInboxQuery = () => {
  const query = useQuery({
    queryKey: queryKeys.mitra.notification.inbox(),
    queryFn: ({ signal }) => notificationInboxService.getInboxList(signal),
    staleTime: 60 * 1000,
  });

  return {
    ...query,
    items: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    unreadCount: query.data?.unreadCount ?? 0,
  };
};

export const useMarkInboxAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationInboxService.markAsRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.notification.inbox(),
      });
    },
  });
};
