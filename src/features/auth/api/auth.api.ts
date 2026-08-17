// src/features/auth/api/auth.api.ts

import type {
  AuthResponse,
  SigninPayload,
} from "@/features/auth/types/auth.service.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse, User } from "@/shared/types/common-response.type";

export const postLoginApi = async (
  payload: SigninPayload,
  signal?: AbortSignal,
): Promise<AuthResponse<User>> => {
  return apiClient.post<AuthResponse<User>>("/auth/login", payload, { signal });
};

export const postLogoutApi = async (
  signal?: AbortSignal,
): Promise<ApiResponse<null>> => {
  return apiClient.post<ApiResponse<null>>("/auth/logout", {}, { signal });
};
