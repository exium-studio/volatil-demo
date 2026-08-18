// src/features/internal/user-management/types/user-management.api.type.ts

import type {
  UserManagementItem,
  UserManagementStatsResponse,
  UserRole,
  UserStatus,
} from "@/features/internal/user-management/types/user-management.type";
import type {
  ApiResponse,
  PaginationMeta,
} from "@/shared/types/common-response.type";

/** Backend Raw User Object from /api/internal/user-management */
export type BackendAdminUserItem = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  organizationName: string | null;
  joinedAt: string;
  updatedAt?: string;
  totalPurchases?: number;
  totalPlotsPurchased?: number;
  totalAreaPurchasedHa?: number;
  totalIgtDataCount?: number;
  lastTotalSpending?: string | number;
};

/** Backend Raw Statistics Object from /api/internal/user-management/statistics */
export type BackendAdminUsersStatistics = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  breakdownByRole: {
    internal: number;
    mitra: number;
  };
};

export type AdminUsersApiResponse = ApiResponse<BackendAdminUserItem[]> & {
  pagination?: PaginationMeta;
};

export type AdminUserDetailApiResponse = ApiResponse<BackendAdminUserItem>;

export type AdminUsersStatisticsApiResponse =
  ApiResponse<BackendAdminUsersStatistics>;

export type UserManagementUsersListResponse = {
  users: UserManagementItem[];
  total: number;
  totalPages: number;
  currentPage: number;
};

export type UserManagementStatsServiceResponse = UserManagementStatsResponse;
