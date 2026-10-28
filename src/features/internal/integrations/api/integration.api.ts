// src/features/internal/integrasi/api/integration.api.ts

import type {
  IntegrationConfigResponse,
  SimponiFormValues,
  SimponiIntegrationConfig,
  SmtpFormValues,
  SmtpIntegrationConfig,
  SmtpTestPayload,
  SsoFormValues,
  SsoIntegrationConfig,
} from "@/features/internal/integrations/types/integration.type";
import { apiClient } from "@/shared/libs/api-client/api-client";

export const fetchSsoIntegrationConfig = async (
  signal?: AbortSignal,
): Promise<IntegrationConfigResponse<SsoIntegrationConfig>> => {
  return apiClient.get<IntegrationConfigResponse<SsoIntegrationConfig>>(
    "/api/internal/integrations/sso",
    { signal },
  );
};

export const updateSsoIntegrationConfig = async (
  payload: SsoFormValues,
  signal?: AbortSignal,
): Promise<IntegrationConfigResponse<SsoIntegrationConfig>> => {
  return apiClient.put<IntegrationConfigResponse<SsoIntegrationConfig>>(
    "/api/internal/integrations/sso",
    { body: payload, signal },
  );
};

export const fetchSmtpIntegrationConfig = async (
  signal?: AbortSignal,
): Promise<IntegrationConfigResponse<SmtpIntegrationConfig>> => {
  return apiClient.get<IntegrationConfigResponse<SmtpIntegrationConfig>>(
    "/api/internal/integrations/smtp",
    { signal },
  );
};

export const updateSmtpIntegrationConfig = async (
  payload: SmtpFormValues,
  signal?: AbortSignal,
): Promise<IntegrationConfigResponse<SmtpIntegrationConfig>> => {
  return apiClient.put<IntegrationConfigResponse<SmtpIntegrationConfig>>(
    "/api/internal/integrations/smtp",
    { body: payload, signal },
  );
};

export const testSmtpConnection = async (
  payload: SmtpTestPayload,
  signal?: AbortSignal,
): Promise<{ success: boolean; message: string }> => {
  return apiClient.post<{ success: boolean; message: string }>(
    "/api/internal/integrations/smtp/test",
    { body: payload, signal },
  );
};

export const fetchSimponiIntegrationConfig = async (
  signal?: AbortSignal,
): Promise<IntegrationConfigResponse<SimponiIntegrationConfig>> => {
  return apiClient.get<IntegrationConfigResponse<SimponiIntegrationConfig>>(
    "/api/internal/integrations/simponi",
    { signal },
  );
};

export const updateSimponiIntegrationConfig = async (
  payload: SimponiFormValues,
  signal?: AbortSignal,
): Promise<IntegrationConfigResponse<SimponiIntegrationConfig>> => {
  return apiClient.put<IntegrationConfigResponse<SimponiIntegrationConfig>>(
    "/api/internal/integrations/simponi",
    { body: payload, signal },
  );
};
