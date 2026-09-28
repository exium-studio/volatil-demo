// src/features/internal/pricing/hooks/use-internal-pricing.ts

import {
  createPricing,
  getPricingList,
  updatePricing,
} from "@/features/internal/pricing/services/internal.pricing.service";
import type {
  CreatePricingPayload,
  PricingQueryParams,
  UpdatePricingPayload,
} from "@/features/internal/pricing/types/internal.pricing.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useInternalPricingListQuery = (params?: PricingQueryParams) => {
  const query = useQuery({
    queryKey: queryKeys.internal.pricing.list(params as Record<string, unknown>),
    queryFn: ({ signal }) => getPricingList(params, signal),
  });

  return {
    ...query,
    items: query.data?.items ?? [],
    pagination: query.data?.pagination,
  };
};

export const useUpdateInternalPricing = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("update-internal-pricing", {
    group: "Master Tarif PNBP",
    loadingMessage: {
      title: "Memperbarui tarif...",
    },
    successMessage: {
      title: "Tarif berhasil diperbarui",
    },
    errorMessage: {
      title: "Gagal memperbarui tarif",
    },
  });

  return useMutation({
    mutationFn: (payload: UpdatePricingPayload) =>
      updatePricing(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.pricing.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.home.all,
      });
    },
    onError: toastHandlers.onError,
  });
};

export const useCreateInternalPricing = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("create-internal-pricing", {
    group: "Master Tarif PNBP",
    loadingMessage: {
      title: "Menambahkan tarif baru...",
    },
    successMessage: {
      title: "Tarif baru berhasil ditambahkan",
    },
    errorMessage: {
      title: "Gagal menambahkan tarif baru",
    },
  });

  return useMutation({
    mutationFn: (payload: CreatePricingPayload) =>
      createPricing(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.pricing.all,
      });
    },
    onError: toastHandlers.onError,
  });
};
