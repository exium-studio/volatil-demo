// src/features/internal/user-management/hooks/use-user-management.query.ts

import {
  getAdminUserDetail,
  getAdminUsersList,
  getAdminUsersStatistics,
  updateAdminUserStatus,
} from "@/features/internal/user-management/services/user-management.service";
import type {
  UpdateUserStatusPayload,
  UserManagementQueryParams,
  UserManagementStatsResponse,
} from "@/features/internal/user-management/types/user-management.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const EMPTY_STATS: UserManagementStatsResponse = {
  totalUsers: 0,
  statusStats: {
    active: 0,
    inactive: 0,
  },
  roleStats: {
    internal: 0,
    mitra: 0,
  },
};

export const useUserManagementUsersQuery = (
  params?: UserManagementQueryParams,
) => {
  const query = useQuery({
    queryKey: queryKeys.internal.userManagement.data(
      params as Record<string, unknown>,
    ),
    queryFn: ({ signal }) => getAdminUsersList(params, signal),
  });

  return {
    ...query,
    users: query.data?.users ?? [],
    total: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    currentPage: query.data?.currentPage ?? 1,
  };
};

export const useUserManagementStatsQuery = () => {
  const query = useQuery({
    queryKey: queryKeys.internal.userManagement.statistics(),
    queryFn: ({ signal }) => getAdminUsersStatistics(signal),
    staleTime: 60 * 1000,
  });

  return {
    ...query,
    stats: query.data ?? EMPTY_STATS,
  };
};

export const useUserManagementDetailQuery = (id: string | number) => {
  return useQuery({
    queryKey: queryKeys.internal.userManagement.detail(id),
    queryFn: ({ signal }) => getAdminUserDetail(id, signal),
    enabled: Boolean(id),
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  const toastHandlers = mutationToastHandlers("update-user-status", {
    group: "Manajemen Pengguna",
    loadingMessage: {
      title: "Memperbarui status pengguna...",
    },
    successMessage: {
      title: "Status pengguna berhasil diperbarui",
    },
    errorMessage: {
      title: "Gagal memperbarui status pengguna",
    },
  });

  return useMutation({
    mutationFn: (payload: UpdateUserStatusPayload) =>
      updateAdminUserStatus(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.userManagement.all,
      });
    },
    onError: toastHandlers.onError,
  });
};

/** Backward compatibility hook for existing consumers */
export const useUserManagementQuery = (params?: UserManagementQueryParams) => {
  const usersQuery = useUserManagementUsersQuery(params);
  const statsQuery = useUserManagementStatsQuery();

  return {
    isLoading: usersQuery.isLoading || statsQuery.isLoading,
    isFetching: usersQuery.isFetching || statsQuery.isFetching,
    users: usersQuery.users,
    total: usersQuery.total,
    totalPages: usersQuery.totalPages,
    currentPage: usersQuery.currentPage,
    stats: statsQuery.stats,
    refetch: async () => {
      await Promise.all([usersQuery.refetch(), statsQuery.refetch()]);
    },
  };
};
