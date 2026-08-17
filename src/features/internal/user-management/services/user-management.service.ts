// src/features/internal/user-management/services/user-management.service.ts

import { fetchUserManagementDataApi } from "@/features/internal/user-management/api/user-management.api";
import type {
  UserManagementDataResponse,
  UserManagementQueryParams,
} from "@/features/internal/user-management/types/user-management.type";
import {
  dummyUserManagementList,
  dummyUserManagementStats,
} from "@/shared/constants/dummy-data/dummy-user-management-data";

export const getUserManagementData = async (
  params?: UserManagementQueryParams,
  signal?: AbortSignal,
): Promise<UserManagementDataResponse> => {
  try {
    const response = await fetchUserManagementDataApi(params, signal);
    return response.data ?? filterFallbackData(params);
  } catch {
    return filterFallbackData(params);
  }
};

const filterFallbackData = (
  params?: UserManagementQueryParams,
): UserManagementDataResponse => {
  let filtered = [...dummyUserManagementList];

  if (params?.search) {
    const query = params.search.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.agencyOrCompany.toLowerCase().includes(query),
    );
  }

  if (params?.status) {
    filtered = filtered.filter((u) => u.status === params.status);
  }

  if (params?.role) {
    filtered = filtered.filter((u) => u.role === params.role);
  }

  const total = filtered.length;

  if (params?.page && params?.pageSize) {
    const start = (params.page - 1) * params.pageSize;
    filtered = filtered.slice(start, start + params.pageSize);
  }

  return {
    stats: dummyUserManagementStats,
    users: filtered,
    total,
  };
};
