import {
  approveOrderApi,
  fetchInternalOrderDetailApi,
  fetchInternalOrdersApi,
  provisionOrderApi,
  rejectOrderApi,
} from "@/features/internal/batch-review/api/batch-review.api";
import type {
  ApproveOrderPayload,
  InternalOrderListQueryParams,
  ProvisionOrderPayload,
  RejectOrderPayload,
} from "@/features/internal/batch-review/types/order-review.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useInternalOrdersQuery = (params?: InternalOrderListQueryParams) => {
  const query = useQuery({
    queryKey: ["internal", "orders", params],
    queryFn: ({ signal }) => fetchInternalOrdersApi(params, signal),
  });

  return {
    ...query,
    items: query.data?.items ?? [],
    pagination: query.data?.pagination,
  };
};

export const useInternalOrderDetailQuery = (orderId?: string) => {
  return useQuery({
    queryKey: ["internal", "order", orderId],
    queryFn: ({ signal }) =>
      orderId ? fetchInternalOrderDetailApi(orderId, signal) : null,
    enabled: Boolean(orderId),
  });
};

export const useProvisionOrder = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("provision-order", {
    group: "Review Pesanan",
    loadingMessage: {
      title: "Membuat layanan WMS...",
      description: "Memotong AOI dan mempublish layer ke GeoServer...",
    },
    successMessage: {
      title: "Layanan WMS berhasil dibuat!",
      description: "Status pesanan diperbarui menjadi pending review.",
    },
    errorMessage: {
      title: "Gagal membuat layanan WMS",
    },
  });

  return useMutation({
    mutationFn: (payload: ProvisionOrderPayload) => provisionOrderApi(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: ["internal", "orders"],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.home.all,
      });
    },
    onError: toastHandlers.onError,
  });
};

export const useApproveOrder = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("approve-order", {
    group: "Review Pesanan",
    loadingMessage: {
      title: "Menyetujui pesanan...",
    },
    successMessage: {
      title: "Pesanan berhasil disetujui",
    },
    errorMessage: {
      title: "Gagal menyetujui pesanan",
    },
  });

  return useMutation({
    mutationFn: (payload: ApproveOrderPayload) => approveOrderApi(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: ["internal", "orders"],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.home.all,
      });
    },
    onError: toastHandlers.onError,
  });
};

export const useRejectOrder = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("reject-order", {
    group: "Review Pesanan",
    loadingMessage: {
      title: "Menolak pesanan...",
    },
    successMessage: {
      title: "Pesanan telah ditolak",
    },
    errorMessage: {
      title: "Gagal menolak pesanan",
    },
  });

  return useMutation({
    mutationFn: (payload: RejectOrderPayload) => rejectOrderApi(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: ["internal", "orders"],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.home.all,
      });
    },
    onError: toastHandlers.onError,
  });
};

// Aliases
export const useInternalBatchesQuery = useInternalOrdersQuery;
export const useInternalBatchDetailQuery = (id?: string) => useInternalOrderDetailQuery(id);
export const useApproveBatch = useApproveOrder;
export const useRejectBatch = useRejectOrder;
