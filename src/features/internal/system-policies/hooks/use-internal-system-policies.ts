// src/features/internal/system-policies/hooks/use-internal-system-policies.ts

import {
  fetchInternalSystemPoliciesApi,
  updateInternalSystemPolicyApi,
} from "@/features/internal/system-policies/api/internal.system-policies.api";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useInternalSystemPoliciesQuery = () => {
  const query = useQuery({
    queryKey: queryKeys.internal.systemPolicies.all,
    queryFn: async ({ signal }) => {
      const res = await fetchInternalSystemPoliciesApi(signal);
      return res.data ?? [];
    },
  });

  return {
    ...query,
    items: query.data ?? [],
  };
};

export const useUpdateInternalSystemPolicy = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("update-system-policy", {
    group: "Kebijakan Sistem",
    loadingMessage: {
      title: "Memperbarui kebijakan...",
    },
    successMessage: {
      title: "Kebijakan sistem berhasil diperbarui",
    },
    errorMessage: {
      title: "Gagal memperbarui kebijakan sistem",
    },
  });

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      updateInternalSystemPolicyApi(key, value),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.systemPolicies.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.dataRequest.policies(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.home.all,
      });
    },
    onError: toastHandlers.onError,
  });
};
