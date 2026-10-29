// src/features/auth/types/sso.type.ts

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

export type PublicSsoStatus = {
  mitra: {
    isEnabled: boolean;
  };
  internal: {
    isEnabled: boolean;
  };
};
