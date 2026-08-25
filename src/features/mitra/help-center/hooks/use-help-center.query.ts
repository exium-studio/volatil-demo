// src/features/mitra/help-center/hooks/use-help-center.query.ts

import { helpCenterService } from "@/features/mitra/help-center/services/help-center.service";
import type {
  CreateHelpCenterPayload,
  HelpCenterQueryParams,
  RejectHelpCenterPayload,
  ReplyHelpCenterPayload,
  ResolveHelpCenterPayload,
} from "@/features/mitra/help-center/types/help-center.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useHelpCenterTicketsQuery = (params?: HelpCenterQueryParams) => {
  const query = useQuery({
    queryKey: queryKeys.mitra.helpCenter.tickets(
      params as Record<string, unknown>,
    ),
    queryFn: ({ signal }) => helpCenterService.getTickets(params, signal),
  });

  return {
    ...query,
    tickets: query.data?.data ?? [],
    pagination: query.data?.pagination ?? {
      totalItems: 0,
      totalPages: 1,
      currentPage: params?.page ?? 1,
      itemsPerPage: params?.limit ?? 10,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };
};

export const useHelpCenterStatisticsQuery = (scope?: "my" | "all") => {
  const query = useQuery({
    queryKey: queryKeys.mitra.helpCenter.statistics(scope),
    queryFn: ({ signal }) => helpCenterService.getStatistics(scope, signal),
    staleTime: 30 * 1000,
  });

  return {
    ...query,
    statistics: query.data ?? {
      totalTickets: 0,
      activeTickets: 0,
      resolvedTickets: 0,
    },
  };
};

export const useHelpCenterDetailQuery = (id: number | string) => {
  return useQuery({
    queryKey: queryKeys.mitra.helpCenter.detail(id),
    queryFn: ({ signal }) => helpCenterService.getTicketById(id, signal),
    enabled: Boolean(id),
  });
};

export const useCreateHelpCenterTicket = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("create-ticket", {
    group: "Pusat Bantuan",
    loadingMessage: {
      title: "Mengirim laporan...",
    },
    successMessage: {
      title: "Laporan berhasil dibuat!",
    },
    errorMessage: {
      title: "Gagal membuat laporan",
    },
  });

  return useMutation({
    mutationFn: (payload: CreateHelpCenterPayload) =>
      helpCenterService.createTicket(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.helpCenter.all,
      });
    },
    onError: toastHandlers.onError,
  });
};

export const useReplyHelpCenterTicket = (ticketId: number | string) => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers(`reply-ticket-${ticketId}`, {
    group: "Pusat Bantuan",
    loadingMessage: {
      title: "Mengirim balasan...",
    },
    successMessage: {
      title: "Balasan berhasil dikirim!",
    },
    errorMessage: {
      title: "Gagal mengirim balasan",
    },
  });

  return useMutation({
    mutationFn: (payload: ReplyHelpCenterPayload) =>
      helpCenterService.replyTicket(ticketId, payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.helpCenter.detail(ticketId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.helpCenter.detail(String(ticketId)),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.helpCenter.all,
      });
    },
    onError: toastHandlers.onError,
  });
};

export const useResolveHelpCenterTicket = (ticketId: number | string) => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers(`resolve-ticket-${ticketId}`, {
    group: "Pusat Bantuan",
    loadingMessage: {
      title: "Menyelesaikan laporan...",
    },
    successMessage: {
      title: "Laporan berhasil diselesaikan!",
    },
    errorMessage: {
      title: "Gagal menyelesaikan laporan",
    },
  });

  return useMutation({
    mutationFn: (payload: ResolveHelpCenterPayload) =>
      helpCenterService.resolveTicket(ticketId, payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.helpCenter.detail(ticketId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.helpCenter.detail(String(ticketId)),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.helpCenter.all,
      });
    },
    onError: toastHandlers.onError,
  });
};

export const useRejectHelpCenterTicket = (ticketId: number | string) => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers(`reject-ticket-${ticketId}`, {
    group: "Pusat Bantuan",
    loadingMessage: {
      title: "Menolak laporan...",
    },
    successMessage: {
      title: "Laporan berhasil ditolak",
    },
    errorMessage: {
      title: "Gagal menolak laporan",
    },
  });

  return useMutation({
    mutationFn: (payload: RejectHelpCenterPayload) =>
      helpCenterService.rejectTicket(ticketId, payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.helpCenter.detail(ticketId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.helpCenter.detail(String(ticketId)),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.helpCenter.all,
      });
    },
    onError: toastHandlers.onError,
  });
};
