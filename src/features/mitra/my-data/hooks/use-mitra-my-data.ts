// src/features/mitra/my-data/hooks/use-mitra-my-data.ts

import {
  getMyData,
  updateMyData,
} from "@/features/mitra/my-data/services/mitra.my-data.service";
import type {
  MyDataItem,
  MyDataQueryParams,
  MyDataResponse,
  UpdateMyDataItemPayload,
} from "@/features/mitra/my-data/types/my-data.type";
import { toast } from "@/design-system/components/toast/core/toast.manager";
import { createPaginationMeta } from "@/shared/types/common-response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useMitraMyDataQuery = (params: MyDataQueryParams) => {
  const query = useQuery<MyDataResponse>({
    queryKey: ["mitra", "my-data", params],
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
        queryKey: ["mitra", "my-data"],
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
