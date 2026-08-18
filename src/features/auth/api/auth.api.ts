// src/features/auth/api/auth.api.ts

import type {
  AuthLoginResponse,
  AuthMeResponse,
  SigninPayload,
} from "@/features/auth/types/auth.service.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse, User } from "@/shared/types/common-response.type";

export const postLoginApi = async (
  payload: SigninPayload,
  signal?: AbortSignal,
): Promise<AuthLoginResponse<User>> => {
  return apiClient.post<AuthLoginResponse<User>>(
    "/auth/login",
    {
      email: payload.email,
      password: payload.password,
    },
    { signal },
  );
};

export const getAuthMeApi = async (
  signal?: AbortSignal,
): Promise<AuthMeResponse<User>> => {
  return apiClient.get<AuthMeResponse<User>>("/auth/me", { signal });
};

export const postLogoutApi = async (
  signal?: AbortSignal,
): Promise<ApiResponse<null>> => {
  return apiClient.post<ApiResponse<null>>("/auth/logout", {}, { signal });
};
