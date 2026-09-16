import type {
  AuthLoginResponse,
  AuthMeResponse,
  SigninPayload,
  SsoInternalCallbackPayload,
  SsoInternalCallbackResponse,
  SsoInternalLogoutPayload,
  SsoInternalLogoutResponse,
  SsoInternalUrlParams,
  SsoInternalUrlResponse,
} from "@/features/auth/types/auth.service.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse, User } from "@/shared/types/common-response.type";

export const postLoginApi = async (
  payload: SigninPayload,
  signal?: AbortSignal,
): Promise<AuthLoginResponse<User>> => {
  return apiClient.post<AuthLoginResponse<User>>(
    "/api/auth/login",
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
  return apiClient.get<AuthMeResponse<User>>("/api/auth/me", { signal });
};

export const postLogoutApi = async (
  signal?: AbortSignal,
): Promise<ApiResponse<null>> => {
  return apiClient.post<ApiResponse<null>>("/api/auth/logout", {}, { signal });
};

export const getSsoInternalUrlApi = async (
  params: SsoInternalUrlParams,
  signal?: AbortSignal,
): Promise<SsoInternalUrlResponse> => {
  return apiClient.get<SsoInternalUrlResponse>(
    "/api/auth/sso/internal/url",
    {
      params: {
        redirectUri: params.redirectUri,
        state: params.state,
      },
      signal,
    },
  );
};

export const postSsoInternalCallbackApi = async (
  payload: SsoInternalCallbackPayload,
  signal?: AbortSignal,
): Promise<SsoInternalCallbackResponse> => {
  return apiClient.post<SsoInternalCallbackResponse>(
    "/api/auth/sso/internal/callback",
    payload,
    {
      credentials: "include",
      signal,
    },
  );
};

export const postSsoInternalLogoutUrlApi = async (
  payload: SsoInternalLogoutPayload,
  signal?: AbortSignal,
): Promise<SsoInternalLogoutResponse> => {
  return apiClient.post<SsoInternalLogoutResponse>(
    "/api/auth/sso/internal/logout-url",
    payload,
    {
      credentials: "include",
      signal,
    },
  );
};

