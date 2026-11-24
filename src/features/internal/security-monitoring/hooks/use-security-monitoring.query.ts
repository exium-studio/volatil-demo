// src/features/internal/security-monitoring/hooks/use-security-monitoring.query.ts

import {
  executeUserSecurityActionApi,
  fetchSecurityLogsApi,
  fetchSecurityOverviewApi,
  fetchSecurityUserDetailApi,
  fetchSecurityUsersApi,
} from "@/features/internal/security-monitoring/api/security-monitoring.api";
import type {
  SecurityLogQueryParams,
  SecurityUserQueryParams,
} from "@/features/internal/security-monitoring/types/security-monitoring.type";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSecurityOverviewQuery = () => {
  return useQuery({
    queryKey: ["internal", "security", "overview"],
    queryFn: async ({ signal }) => {
      const res = await fetchSecurityOverviewApi(signal);
      return res.data;
    },
  });
};

export const useSecurityUsersQuery = (params: SecurityUserQueryParams) => {
  return useQuery({
    queryKey: ["internal", "security", "users", params],
    queryFn: async ({ signal }) => {
      const res = await fetchSecurityUsersApi(params, signal);
      return res.data;
    },
  });
};

export const useSecurityUserDetailQuery = (userId?: string) => {
  return useQuery({
    queryKey: ["internal", "security", "user-detail", userId],
    queryFn: async ({ signal }) => {
      if (!userId) return null;
      const res = await fetchSecurityUserDetailApi(userId, signal);
      return res.data;
    },
    enabled: Boolean(userId),
  });
};

export const useSecurityLogsQuery = (params: SecurityLogQueryParams) => {
  return useQuery({
    queryKey: ["internal", "security", "logs", params],
    queryFn: async ({ signal }) => {
      const res = await fetchSecurityLogsApi(params, signal);
      return res.data;
    },
  });
};

export const useExecuteSecurityAction = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("execute-security-action", {
    group: "Security Monitoring",
    loadingMessage: { title: "Menerapkan tindakan proteksi..." },
    successMessage: { title: "Tindakan proteksi berhasil diterapkan" },
    errorMessage: { title: "Gagal menerapkan tindakan proteksi" },
  });

  return useMutation({
    mutationFn: ({
      userId,
      action,
      reason,
    }: {
      userId: string;
      action: "RESET_SCORE" | "THROTTLE" | "SUSPEND";
      reason?: string;
    }) => executeUserSecurityActionApi(userId, action, reason),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: ["internal", "security"],
      });
    },
    onError: toastHandlers.onError,
  });
};
