// src/features/auth/types/sso.type.ts

export type SsoPortal = "mitra" | "internal";

export type SsoCallbackSearch = {
  code?: string;
  state?: string;
  session_state?: string;
  error?: string;
  error_description?: string;
};

export type SsoCallbackParams = {
  code: string;
  state: string;
};

export type PublicSsoPortalConfig = {
  isEnabled: boolean;
  issuerUrl?: string;
  clientId?: string;
  redirectUri?: string;
  authEndpoint?: string;
  tokenEndpoint?: string;
  userinfoEndpoint?: string;
  logoutEndpoint?: string;
  loginUrl?: string;
};

export type PublicSsoStatus = {
  mitra: PublicSsoPortalConfig;
  internal: PublicSsoPortalConfig;
};

export type SsoUrlParams = {
  redirectUri: string;
  state: string;
  portal?: SsoPortal;
};

export type SsoCallbackPayload = {
  code: string;
  redirectUri: string;
  portal?: SsoPortal;
};
