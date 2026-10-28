// src/features/mitra/my-data/hooks/use-mitra-my-data.ts

import {
  getMitraWorkspaceDetail,
  getMitraWorkspaces,
  getMyData,
  renewWorkspace,
  rotateApiKey,
  updateMyData,
} from "@/features/mitra/my-data/services/mitra.my-data.service";
import type {
  MitraWorkspaceItem,
  MitraWorkspaceListResponse,
  MitraWorkspaceQueryParams,
  MyDataItem,
  MyDataQueryParams,
  MyDataResponse,
  RenewWorkspacePayload,
  RenewWorkspaceResponse,
  RotateApiKeyResponse,
  UpdateMyDataItemPayload,
} from "@/features/mitra/my-data/types/my-data.type";
import { toast } from "@/design-system/components/toast/core/toast.manager";
import { createPaginationMeta } from "@/shared/types/common-response.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useMitraWorkspacesQuery = (
  params?: MitraWorkspaceQueryParams,
) => {
  const query = useQuery<MitraWorkspaceListResponse>({
    queryKey: queryKeys.mitra.workspaces.list(params),
    queryFn: ({ signal }) => getMitraWorkspaces(params, signal),
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    workspaces: query.data?.items ?? [],
    apiKey: query.data?.apiKey ?? null,
    workspaceUrl: query.data?.workspaceUrl ?? null,
    pagination:
      query.data?.pagination ??
      createPaginationMeta(params?.page ?? 1, params?.pageSize ?? 10, 0),
  };
};

export const useMitraWorkspaceDetailQuery = (workspaceId?: string) => {
  return useQuery<MitraWorkspaceItem | null>({
    queryKey: queryKeys.mitra.workspace.detail(workspaceId),
    queryFn: ({ signal }) =>
      workspaceId ? getMitraWorkspaceDetail(workspaceId, signal) : null,
    enabled: Boolean(workspaceId),
  });
};

export const useMitraMyDataQuery = (params: MyDataQueryParams) => {
  const query = useQuery<MyDataResponse>({
    queryKey: queryKeys.mitra.myData.list(params),
    queryFn: ({ signal }) => getMyData(params, signal),
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    myData: query.data ?? {
      items: [],
      pagination: createPaginationMeta(params.page, params.pageSize, 0),
    },
  };
};

export const useUpdateMyData = () => {
  const queryClient = useQueryClient();

  return useMutation<
    MyDataItem,
    Error,
    { id: string; payload: UpdateMyDataItemPayload }
  >({
    mutationFn: ({ id, payload }) => updateMyData(id, payload),
    onSuccess: (data) => {
      // 1. Direct cache update for active workspace detail query
      queryClient.setQueriesData<MitraWorkspaceItem | null>(
        { queryKey: queryKeys.mitra.workspace.all },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            layers: old.layers.map((l) =>
              l.id === data.id ? { ...l, label: data.label } : l,
            ),
          };
        },
      );

      // 2. Direct cache update for workspaces list query
      queryClient.setQueriesData<MitraWorkspaceListResponse>(
        { queryKey: queryKeys.mitra.workspaces.all },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            items: old.items.map((ws) => ({
              ...ws,
              layers: ws.layers.map((l) =>
                l.id === data.id ? { ...l, label: data.label } : l,
              ),
            })),
          };
        },
      );

      // 3. Invalidate related queries to ensure server/source alignment
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.workspace.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.workspaces.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.myData.all,
      });

      toast.create({
        variant: "success",
        title: "Berhasil",
        description: `Label layer "${data.title}" berhasil diperbarui`,
      });
    },
    onError: (error) => {
      toast.create({
        variant: "error",
        title: "Gagal Memperbarui",
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memperbarui label data layer",
      });
    },
  });
};

export const useRenewMitraWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RenewWorkspaceResponse,
    Error,
    { workspaceId: string; payload?: RenewWorkspacePayload }
  >({
    mutationFn: ({ workspaceId, payload }) =>
      renewWorkspace(workspaceId, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.myData.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.workspace.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.workspace.detail(variables.workspaceId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.workspaces.all,
      });
    },
    onError: (error) => {
      toast.create({
        variant: "error",
        title: "Gagal Memperpanjang",
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memproses perpanjangan masa aktif",
      });
    },
  });
};

export const useRotateMitraApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation<RotateApiKeyResponse, Error, void>({
    mutationFn: () => rotateApiKey(),
    onSuccess: (data) => {
      // Direct cache updates for workspaces list
      queryClient.setQueriesData<MitraWorkspaceListResponse>(
        { queryKey: queryKeys.mitra.workspaces.all },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            apiKey: data.apiKey,
          };
        },
      );

      // Direct cache updates for myData list
      queryClient.setQueriesData<MyDataResponse>(
        { queryKey: queryKeys.mitra.myData.all },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            apiKey: data.apiKey,
          };
        },
      );

      // Refetch / invalidate queries to ensure full synchronization
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.workspaces.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.myData.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.workspace.all,
      });

      toast.create({
        variant: "success",
        title: "API Key Diperbarui",
        description: "API Key berhasil diganti dan data telah disinkronkan",
      });
    },
    onError: (error) => {
      toast.create({
        variant: "error",
        title: "Gagal Mengganti API Key",
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat melakukan rotasi API Key",
      });
    },
  });
};
