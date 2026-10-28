// src/features/mitra/data-request/api/mitra.data-request-policies.api.ts

import type {
  MasterPricingItem,
  SystemPolicyItem,
} from "@/features/mitra/data-request/types/mitra.data-request.pricing-policy.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

/**
 * Fetch Master Pricing (Tarif PNBP & Minimum Purchase per Basis) from database.
 * GET /api/mitra/data-request/pricing
 */
export const fetchMasterPricingApi = async (
  signal?: AbortSignal,
): Promise<MasterPricingItem[]> => {
  const raw = await apiClient.get<ApiResponse<MasterPricingItem[]>>(
    "/api/mitra/data-request/pricing",
    { signal },
  );

  if (raw && "data" in raw && Array.isArray(raw.data)) {
    return raw.data;
  }

  if (Array.isArray(raw)) {
    return raw;
  }

  return [];
};

/**
 * Fetch System Policies (Kebijakan Sistem) from database.
 * GET /api/mitra/data-request/policies
 */
export const fetchSystemPoliciesApi = async (
  signal?: AbortSignal,
): Promise<SystemPolicyItem[]> => {
  const raw = await apiClient.get<ApiResponse<SystemPolicyItem[]>>(
    "/api/mitra/data-request/policies",
    { signal },
  );

  if (raw && "data" in raw && Array.isArray(raw.data)) {
    return raw.data;
  }

  if (Array.isArray(raw)) {
    return raw;
  }

  return [];
};
