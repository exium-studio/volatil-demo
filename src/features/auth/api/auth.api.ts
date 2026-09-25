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
  TotpSetupConfirmPayload,
  TotpSetupConfirmResponse,
  TotpSetupResponse,
  TotpVerifyPayload,
  TotpVerifyResponse,
} from "@/features/auth/types/auth.service.type";
import type {
  ResetPasswordConfirmPayload,
  ResetPasswordConfirmResponse,
  ResetPasswordRequestPayload,
  ResetPasswordRequestResponse,
  ResetPasswordVerifyOtpPayload,
  ResetPasswordVerifyOtpResponse,
} from "@/features/auth/types/reset-password.type";
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

export const postLoginTotpVerifyApi = async (
  payload: TotpVerifyPayload,
  signal?: AbortSignal,
): Promise<TotpVerifyResponse<User>> => {
  return apiClient.post<TotpVerifyResponse<User>>(
    "/api/auth/login/totp-verify",
    payload,
    { signal },
  );
};

export const getTotpSetupApi = async (
  mfaToken: string,
  signal?: AbortSignal,
): Promise<TotpSetupResponse> => {
  return apiClient.get<TotpSetupResponse>("/api/auth/totp/setup", {
    headers: {
      Authorization: `Bearer ${mfaToken}`,
    },
    signal,
  });
};

export const postTotpSetupConfirmApi = async (
  mfaToken: string,
  payload: TotpSetupConfirmPayload,
  signal?: AbortSignal,
): Promise<TotpSetupConfirmResponse<User>> => {
  return apiClient.post<TotpSetupConfirmResponse<User>>(
    "/api/auth/totp/setup/confirm",
    payload,
    {
      headers: {
        Authorization: `Bearer ${mfaToken}`,
      },
      signal,
    },
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

export const postResetPasswordRequestApi = async (
  payload: ResetPasswordRequestPayload,
  signal?: AbortSignal,
): Promise<ResetPasswordRequestResponse> => {
  return apiClient.post<ResetPasswordRequestResponse>(
    "/api/auth/internal/reset-password/request",
    payload,
    { signal },
  );
};

export const postResetPasswordVerifyOtpApi = async (
  payload: ResetPasswordVerifyOtpPayload,
  signal?: AbortSignal,
): Promise<ResetPasswordVerifyOtpResponse> => {
  return apiClient.post<ResetPasswordVerifyOtpResponse>(
    "/api/auth/internal/reset-password/verify-otp",
    payload,
    { signal },
  );
};

export const postResetPasswordConfirmApi = async (
  payload: ResetPasswordConfirmPayload,
  signal?: AbortSignal,
): Promise<ResetPasswordConfirmResponse> => {
  return apiClient.post<ResetPasswordConfirmResponse>(
    "/api/auth/internal/reset-password/confirm",
    payload,
    { signal },
  );
};



