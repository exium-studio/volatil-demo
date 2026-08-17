// src/features/internal/user-management/types/user-management.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { MitraHomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import type {
  PaginatedParams,
  UserRole,
} from "@/shared/types/common-response.type";

export type UserStatus = "active" | "inactive";

export type UserManagementItem = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  agencyOrCompany: string;
  status: UserStatus;
  phoneNumber?: string;
  lastLoginAt?: string;
  createdAt: string;
};

export type UserManagementStatusStats = {
  active: number;
  inactive: number;
};

export type UserManagementRoleStats = {
  internal: number;
  mitra: number;
};

export type UserManagementStatsResponse = {
  statusStats: UserManagementStatusStats;
  roleStats: UserManagementRoleStats;
};

export type UserManagementDataResponse = {
  stats: Record<MitraHomePeriod, UserManagementStatsResponse>;
  users: UserManagementItem[];
  total: number;
};

export type UserManagementQueryParams = PaginatedParams & {
  status?: UserStatus;
  role?: UserRole;
  period?: MitraHomePeriod;
};

export type UserManagementStatsStatusConfig = {
  key: UserStatus;
  label: string;
  colorPalette?: string;
  bg?: string;
  legendColor: string;
  striped: boolean;
};

export type UserManagementStatsRoleConfig = {
  key: UserRole;
  label: string;
  colorPalette?: string;
  bg?: string;
  legendColor: string;
  striped: boolean;
};

export type UserManagementStatsHeaderProps = {
  period: MitraHomePeriod;
  onPeriodChange: (period: MitraHomePeriod) => void;
};

export type UserManagementStatsChartsProps = {
  period: MitraHomePeriod;
};

export type UserManagementStatsLegendProps = StackProps & {
  legendColor: string;
  label: string;
  value: number;
};
