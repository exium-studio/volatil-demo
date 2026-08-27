// src/features/internal/data-management/hooks/use-data-management.ts

import {
  createMasterIgtLayerApi,
  deleteMasterIgtLayerApi,
  fetchMasterIgtLayersApi,
  updateMasterIgtLayerApi,
} from "@/features/internal/data-management/api/data-management.api";
import type {
  CreateMasterIgtLayerPayload,
  MasterIgtLayersQueryParams,
  UpdateMasterIgtLayerPayload,
} from "@/features/internal/data-management/types/data-management.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useMasterIgtLayersQuery = (params?: MasterIgtLayersQueryParams) => {
  const query = useQuery({
    queryKey: queryKeys.internal.dataManagement.layers(
      params as Record<string, unknown>,
    ),
    queryFn: ({ signal }) => fetchMasterIgtLayersApi(params, signal),
  });

  return {
    ...query,
    items: query.data?.items ?? [],
    pagination: query.data?.pagination,
  };
};

export const useUpdateMasterIgtLayer = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("update-master-igt-layer", {
    group: "Manajemen Data IGT",
    loadingMessage: {
      title: "Menyimpan perubahan layer...",
    },
    successMessage: {
      title: "Data layer berhasil diperbarui",
    },
    errorMessage: {
      title: "Gagal memperbarui data layer",
    },
  });

  return useMutation({
    mutationFn: (payload: UpdateMasterIgtLayerPayload) =>
      updateMasterIgtLayerApi(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.dataManagement.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.map.all,
      });
    },
    onError: toastHandlers.onError,
  });
};

export const useCreateMasterIgtLayer = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("create-master-igt-layer", {
    group: "Manajemen Data IGT",
    loadingMessage: {
      title: "Mendaftarkan layer IGT baru...",
    },
    successMessage: {
      title: "Layer IGT baru berhasil didaftarkan",
    },
    errorMessage: {
      title: "Gagal mendaftarkan layer IGT baru",
    },
  });

  return useMutation({
    mutationFn: (payload: CreateMasterIgtLayerPayload) =>
      createMasterIgtLayerApi(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.dataManagement.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.map.all,
      });
    },
    onError: toastHandlers.onError,
  });
};

export const useDeleteMasterIgtLayer = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("delete-master-igt-layer", {
    group: "Manajemen Data IGT",
    loadingMessage: {
      title: "Menghapus layer IGT...",
    },
    successMessage: {
      title: "Layer IGT berhasil dihapus",
    },
    errorMessage: {
      title: "Gagal menghapus layer IGT",
    },
  });

  return useMutation({
    mutationFn: (id: string) => deleteMasterIgtLayerApi(id),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.dataManagement.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.map.all,
      });
    },
    onError: toastHandlers.onError,
  });
};
