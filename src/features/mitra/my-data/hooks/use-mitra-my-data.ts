import {
  getMitraWorkspaceDetail,
  getMitraWorkspaces,
  getMyData,
  updateMyData,
} from "@/features/mitra/my-data/services/mitra.my-data.service";
import type {
  MitraWorkspaceItem,
  MitraWorkspaceListResponse,
  MitraWorkspaceQueryParams,
  MyDataItem,
  MyDataQueryParams,
  MyDataResponse,
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
    queryKey: ["mitra", "workspaces", params],
    queryFn: ({ signal }) => getMitraWorkspaces(params, signal),
    placeholderData: (previousData) => previousData,
  });

  return {
    ...query,
    workspaces: query.data?.items ?? [],
    pagination:
      query.data?.pagination ??
      createPaginationMeta(params?.page ?? 1, params?.pageSize ?? 10, 0),
  };
};

export const useMitraWorkspaceDetailQuery = (workspaceId?: string) => {
  return useQuery<MitraWorkspaceItem | null>({
    queryKey: ["mitra", "workspace", workspaceId],
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
