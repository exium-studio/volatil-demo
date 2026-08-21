// src/features/internal/user-management/services/user-management.service.ts

import {
  fetchAdminUserDetailApi,
  fetchAdminUsersApi,
  fetchAdminUsersStatisticsApi,
  patchAdminUserStatusApi,
} from "@/features/internal/user-management/api/user-management.api";
import type {
  BackendAdminUserItem,
  BackendAdminUsersStatistics,
  UserManagementUsersListResponse,
} from "@/features/internal/user-management/types/user-management.api.type";
import type {
  UpdateUserStatusPayload,
  UserManagementItem,
  UserManagementQueryParams,
  UserManagementStatsResponse,
} from "@/features/internal/user-management/types/user-management.type";
import { getUserSession } from "@/shared/utils/user/user-session.utils";

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

/** Transforms backend admin user item into normalized UserManagementItem */
export const normalizeAdminUserItem = (
  raw: BackendAdminUserItem,
): UserManagementItem => ({
  id: String(raw.id),
  name: raw.name,
  email: raw.email,
  role: raw.role,
  agencyOrCompany:
    raw.organizationName ||
    (raw.role === "internal" ? "ATR/BPN" : "Mitra Pengguna"),
  status: raw.status,
  phoneNumber: undefined,
  lastLoginAt: raw.updatedAt ?? raw.joinedAt,
  createdAt: raw.joinedAt,
});

/** Transforms backend statistics response into normalized UserManagementStatsResponse */
export const normalizeAdminUsersStatistics = (
  raw: BackendAdminUsersStatistics,
): UserManagementStatsResponse => ({
  totalUsers: raw.totalUsers,
  statusStats: {
    active: raw.activeUsers,
    inactive: raw.inactiveUsers,
  },
  roleStats: {
    internal: raw.breakdownByRole?.internal ?? 0,
    mitra: raw.breakdownByRole?.mitra ?? 0,
  },
});

export const getAdminUsersList = async (
  params?: UserManagementQueryParams,
  signal?: AbortSignal,
): Promise<UserManagementUsersListResponse> => {
  const response = await fetchAdminUsersApi(params, signal);
  const rawUsers = response.data ?? [];
  const pagination = response.pagination;

  return {
    users: rawUsers.map(normalizeAdminUserItem),
    total: pagination?.totalItems ?? rawUsers.length,
    totalPages: pagination?.totalPages ?? 1,
    currentPage: pagination?.currentPage ?? params?.page ?? 1,
  };
};

export const getAdminUsersStatistics = async (
  signal?: AbortSignal,
): Promise<UserManagementStatsResponse> => {
  const response = await fetchAdminUsersStatisticsApi(signal);
  if (response.data) {
    return normalizeAdminUsersStatistics(response.data);
  }
  return EMPTY_STATS;
};

export const getAdminUserDetail = async (
  id: string | number,
  signal?: AbortSignal,
): Promise<UserManagementItem | null> => {
  const response = await fetchAdminUserDetailApi(id, signal);
  if (response.data) {
    return normalizeAdminUserItem(response.data);
  }
  return null;
};

export const updateAdminUserStatus = async (
  payload: UpdateUserStatusPayload,
  signal?: AbortSignal,
): Promise<UserManagementItem> => {
  const currentUser = getUserSession();
  if (
    payload.status === "inactive" &&
    currentUser &&
    (String(currentUser.id) === String(payload.id) ||
      (currentUser.email &&
        currentUser.email.toLowerCase() === String(payload.id).toLowerCase()))
  ) {
    throw new Error(
      "Anda tidak dapat menonaktifkan atau men-suspend akun Anda sendiri.",
    );
  }

  const response = await patchAdminUserStatusApi(payload, signal);
  if (response.data) {
    return normalizeAdminUserItem(response.data);
  }
  return {
    id: String(payload.id),
    name: "User",
    email: "",
    role: "mitra",
    agencyOrCompany: "",
    status: payload.status,
    createdAt: new Date().toISOString(),
  };
};
