// src/features/internal/master-geoserver/hooks/use-master-geoserver.ts

import {
  createMasterGeoserver,
  deleteMasterGeoserver,
  getMasterGeoserverDetail,
  getMasterGeoserverList,
  updateMasterGeoserver,
} from "@/features/internal/master-geoserver/services/master-geoserver.service";
import type {
  CreateMasterGeoserverPayload,
  MasterGeoserverQueryParams,
  UpdateMasterGeoserverPayload,
} from "@/features/internal/master-geoserver/types/master-geoserver.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useMasterGeoserverQuery = (
  params?: MasterGeoserverQueryParams,
) => {
  const query = useQuery({
    queryKey: queryKeys.internal.masterGeoserver.list(
      params as Record<string, unknown>,
    ),
    queryFn: ({ signal }) => getMasterGeoserverList(params, signal),
  });

  return {
    ...query,
    items: query.data?.items ?? [],
    pagination: query.data?.pagination,
  };
};

export const useMasterGeoserverDetailQuery = (id: string) => {
  return useQuery({
    queryKey: queryKeys.internal.masterGeoserver.detail(id),
    queryFn: ({ signal }) => getMasterGeoserverDetail(id, signal),
    enabled: Boolean(id),
  });
};

export const useCreateMasterGeoserver = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("create-master-geoserver", {
    group: "Master GeoServer",
    loadingMessage: {
      title: "Mendaftarkan GeoServer baru...",
    },
    successMessage: {
      title: "GeoServer baru berhasil didaftarkan",
    },
    errorMessage: {
      title: "Gagal mendaftarkan GeoServer baru",
    },
  });

  return useMutation({
    mutationFn: (payload: CreateMasterGeoserverPayload) =>
      createMasterGeoserver(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.masterGeoserver.all,
      });
    },
    onError: toastHandlers.onError,
  });
};

export const useUpdateMasterGeoserver = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("update-master-geoserver", {
    group: "Master GeoServer",
    loadingMessage: {
      title: "Menyimpan perubahan GeoServer...",
    },
    successMessage: {
      title: "Data GeoServer berhasil diperbarui",
    },
    errorMessage: {
      title: "Gagal memperbarui data GeoServer",
    },
  });

  return useMutation({
    mutationFn: (payload: UpdateMasterGeoserverPayload) =>
      updateMasterGeoserver(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.masterGeoserver.all,
      });
    },
    onError: toastHandlers.onError,
  });
};

export const useDeleteMasterGeoserver = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("delete-master-geoserver", {
    group: "Master GeoServer",
    loadingMessage: {
      title: "Menghapus GeoServer...",
    },
    successMessage: {
      title: "GeoServer berhasil dihapus",
    },
    errorMessage: {
      title: "Gagal menghapus GeoServer",
    },
  });

  return useMutation({
    mutationFn: (id: string) => deleteMasterGeoserver(id),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.masterGeoserver.all,
      });
    },
    onError: toastHandlers.onError,
  });
};
