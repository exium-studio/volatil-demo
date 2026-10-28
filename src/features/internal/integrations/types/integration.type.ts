// src/features/internal/integration/types/integration.type.ts

export type IntegrationType = "sso" | "smtp" | "simponi";

// SSO Keycloak Types
export type SsoEntityConfig = {
  isEnabled: boolean;
  issuerUrl: string;
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  hasClientSecret?: boolean;
};

export type SsoIntegrationConfig = {
  mitra: SsoEntityConfig;
  internal: SsoEntityConfig;
};

export type SsoFormValues = {
  mitra: Omit<SsoEntityConfig, "hasClientSecret" | "isEnabled">;
  internal: Omit<SsoEntityConfig, "hasClientSecret">;
};

// Layanan Email (SMTP) Types
export type SmtpSecurity = "SSL" | "STARTTLS" | "NONE";

export type SmtpIntegrationConfig = {
  host: string;
  port: number;
  security: SmtpSecurity;
  user: string;
  password?: string;
  fromEmail: string;
  fromName: string;
  rejectUnauthorized: boolean;
  updatedAt?: string;
};

export type SmtpFormValues = {
  host: string;
  port: number;
  security: SmtpSecurity;
  user: string;
  password?: string;
  fromEmail: string;
  fromName: string;
  rejectUnauthorized: boolean;
};

export type SmtpTestPayload = {
  targetEmail: string;
  config?: Partial<SmtpFormValues>;
};

export type SmtpTestFormValues = {
  targetEmail: string;
};

export type SmtpTestModalProps = {
  modalKey?: string;
  currentConfig?: Partial<SmtpFormValues>;
};

// Billing SIMPONI (PNBP) Types
export type SimponiIntegrationConfig = {
  baseUrl: string;
  kodeKl: string;
  kodeSatker: string;
  kodeAkun: string;
  apiKey?: string;
  billingExpiryHours: number;
  isSimulator: boolean;
  isEnabled: boolean;
  updatedAt?: string;
};

export type SimponiFormValues = {
  baseUrl: string;
  kodeKl: string;
  kodeSatker: string;
  kodeAkun: string;
  apiKey?: string;
  billingExpiryHours: number;
  isSimulator: boolean;
  isEnabled: boolean;
};

// Common Backend Integration Response
export type IntegrationConfigResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
