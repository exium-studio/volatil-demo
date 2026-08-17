// src/features/internal/user-management/hooks/use-user-management.query.ts

import type {
  UserManagementQueryParams,
  UserManagementStatsResponse,
} from "@/features/internal/user-management/types/user-management.type";
import { getUserManagementData } from "@/features/internal/user-management/services/user-management.service";
import {
  dummyUserManagementList,
  dummyUserManagementStats,
} from "@/shared/constants/dummy-data/dummy-user-management-data";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQuery } from "@tanstack/react-query";

const fallbackStats: UserManagementStatsResponse = dummyUserManagementStats.all;

export const useUserManagementQuery = (params?: UserManagementQueryParams) => {
  const query = useQuery({
    queryKey: queryKeys.internal.userManagement.data(params as Record<string, unknown>),
    queryFn: ({ signal }) => getUserManagementData(params, signal),
  });

  const period = params?.period ?? "all";
  const userManagementData = query.data;

  const currentStats =
    userManagementData?.stats[period] ??
    dummyUserManagementStats[period] ??
    fallbackStats;

  return {
    ...query,
    users: userManagementData?.users ?? dummyUserManagementList,
    total: userManagementData?.total ?? dummyUserManagementList.length,
    stats: currentStats,
  };
};
