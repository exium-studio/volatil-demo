// src/features/internal/security-monitoring/api/security-monitoring.api.ts

import { apiClient } from "@/shared/libs/api-client/api-client";
import type {
  MapServiceActivityLogItem,
  SecurityLogQueryParams,
  SecurityOverviewStats,
  SecurityUserQueryParams,
  UserRiskItem,
  UserRiskScoreHistoryItem,
} from "@/features/internal/security-monitoring/types/security-monitoring.type";

export async function fetchSecurityOverviewApi(
  signal?: AbortSignal,
): Promise<{ success: boolean; data: SecurityOverviewStats }> {
  return apiClient.request<{ success: boolean; data: SecurityOverviewStats }>(
    "/api/internal/security/overview",
    { method: "GET", signal },
  );
}

export async function fetchSecurityUsersApi(
  params: SecurityUserQueryParams = {},
  signal?: AbortSignal,
): Promise<{
  success: boolean;
  data: {
    items: UserRiskItem[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}> {
  return apiClient.request("/api/internal/security/users", {
    method: "GET",
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      riskLevel: params.riskLevel,
      standingStatus: params.standingStatus,
      search: params.search,
    },
    signal,
  });
}

export async function fetchSecurityUserDetailApi(
  userId: string,
  signal?: AbortSignal,
): Promise<{
  success: boolean;
  data: {
    profile: UserRiskItem;
    histories: UserRiskScoreHistoryItem[];
    recentLogs: MapServiceActivityLogItem[];
  };
}> {
  return apiClient.request(`/api/internal/security/users/${userId}`, {
    method: "GET",
    signal,
  });
}

export async function executeUserSecurityActionApi(
  userId: string,
  action: "RESET_SCORE" | "THROTTLE" | "SUSPEND",
  reason?: string,
): Promise<{ success: boolean; message: string; data: UserRiskItem }> {
  return apiClient.request(`/api/internal/security/users/${userId}/action`, {
    method: "POST",
    body: { action, reason },
  });
}

export async function fetchSecurityLogsApi(
  params: SecurityLogQueryParams = {},
  signal?: AbortSignal,
): Promise<{
  success: boolean;
  data: {
    items: MapServiceActivityLogItem[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}> {
  return apiClient.request("/api/internal/security/logs", {
    method: "GET",
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      userId: params.userId,
      layerName: params.layerName,
      isSuspicious: params.isSuspicious,
      statusCode: params.statusCode,
    },
    signal,
  });
}
