import type { Role } from "@/shared/types/auth.type";
import type {
  ApiResponse,
  InternalUser,
  User,
} from "@/shared/types/common-response.type";

export type SigninPayload = {
  email: string;
  password: string;
  role?: Role;
};

export type AuthLoginData<TUser = User> = {
  tokenType: "Bearer";
  accessToken: string;
  user: TUser;
};

export type AuthLoginResponse<TUser = User> = ApiResponse<AuthLoginData<TUser>>;

export type AuthMeResponse<TUser = User> = ApiResponse<TUser>;

// SSO Keycloak Types
export type SsoInternalUrlParams = {
  redirectUri: string;
  state: string;
};

export type SsoInternalUrlData = {
  loginUrl: string;
  state: string;
  redirectUri: string;
  hint?: string;
};

export type SsoInternalUrlResponse = ApiResponse<SsoInternalUrlData>;

export type SsoInternalCallbackPayload = {
  code: string;
  redirectUri: string;
};

export type SsoInternalCallbackData = {
  tokenType: "Bearer";
  accessToken: string;
  token?: string;
  expiresIn?: number;
  keycloakIdToken: string;
  user: InternalUser;
};

export type SsoInternalCallbackResponse = ApiResponse<SsoInternalCallbackData>;

export type SsoInternalLogoutPayload = {
  idToken?: string | null;
  postLogoutRedirectUri: string;
};

export type SsoInternalLogoutData = {
  logoutUrl?: string;
  hint?: string;
};

export type SsoInternalLogoutResponse = ApiResponse<SsoInternalLogoutData>;

