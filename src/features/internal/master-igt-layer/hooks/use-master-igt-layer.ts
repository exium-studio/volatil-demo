// src/features/internal/master-igt-layer/hooks/use-master-igt-layer.ts

import {
  createMasterIgtLayer,
  deleteMasterIgtLayer,
  getGeoServerWorkspaceLayers,
  getGeoServerWorkspaces,
  getMasterIgtLayerById,
  getMasterIgtLayers,
  updateMasterIgtLayer,
  updateMasterIgtLayerAttributes,
} from "@/features/internal/master-igt-layer/services/master-igt-layer.service";
import type {
  CreateMasterIgtLayerPayload,
  MasterIgtLayersQueryParams,
  UpdateMasterIgtLayerAttributesPayload,
  UpdateMasterIgtLayerPayload,
} from "@/features/internal/master-igt-layer/types/master-igt-layer.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useMasterIgtLayersQuery = (
  params?: MasterIgtLayersQueryParams,
) => {
  const query = useQuery({
    queryKey: queryKeys.internal.masterIgtLayer.layers(
      params as Record<string, unknown>,
    ),
    queryFn: ({ signal }) => getMasterIgtLayers(params, signal),
  });

  return {
    ...query,
    items: query.data?.items ?? [],
    pagination: query.data?.pagination,
  };
};

export const useMasterIgtLayerDetailQuery = (layerId?: string) => {
  const query = useQuery({
    queryKey: queryKeys.internal.masterIgtLayer.layers({ id: layerId }),
    queryFn: async ({ signal }) => {
      if (!layerId) return null;
      return getMasterIgtLayerById(layerId, signal);
    },
    enabled: Boolean(layerId),
  });

  return {
    ...query,
    layer: query.data ?? null,
  };
};

export const useGeoServerWorkspacesQuery = (geoserverId?: string) => {
  const query = useQuery({
    queryKey: queryKeys.internal.masterIgtLayer.workspaces(geoserverId || ""),
    queryFn: ({ signal }) => getGeoServerWorkspaces(geoserverId || "", signal),
    enabled: Boolean(geoserverId),
    staleTime: 60 * 1000,
  });

  return {
    ...query,
    workspaces: query.data?.workspaces ?? [],
  };
};

export const useGeoServerWorkspaceLayersQuery = (
  geoserverId?: string,
  workspaceName?: string,
) => {
  const query = useQuery({
    queryKey: queryKeys.internal.masterIgtLayer.workspaceLayers(
      geoserverId || "",
      workspaceName || "",
    ),
    queryFn: ({ signal }) =>
      getGeoServerWorkspaceLayers(
        geoserverId || "",
        workspaceName || "",
        signal,
      ),
    enabled: Boolean(geoserverId && workspaceName),
    staleTime: 60 * 1000,
  });

  return {
    ...query,
    layers: query.data?.layers ?? [],
  };
};

export const useUpdateMasterIgtLayer = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("update-master-igt-layer", {
    group: "Manajemen Master Layer IGT",
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
      updateMasterIgtLayer(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.masterIgtLayer.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.map.all,
      });
    },
    onError: toastHandlers.onError,
  });
};

export const useUpdateMasterIgtLayerAttributes = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("update-master-igt-layer-attributes", {
    group: "Manajemen Master Layer IGT",
    loadingMessage: {
      title: "Menyimpan whitelist atribut layer...",
    },
    successMessage: {
      title: "Whitelist atribut layer berhasil diperbarui",
    },
    errorMessage: {
      title: "Gagal memperbarui whitelist atribut layer",
    },
  });

  return useMutation({
    mutationFn: (payload: UpdateMasterIgtLayerAttributesPayload) =>
      updateMasterIgtLayerAttributes(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.masterIgtLayer.all,
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
    group: "Manajemen Master Layer IGT",
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
      createMasterIgtLayer(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.masterIgtLayer.all,
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
    group: "Manajemen Master Layer IGT",
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
    mutationFn: (id: string) => deleteMasterIgtLayer(id),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.masterIgtLayer.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.map.all,
      });
    },
    onError: toastHandlers.onError,
  });
};
