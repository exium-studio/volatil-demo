// src/features/internal/integrasi/hooks/use-integration.query.ts

import {
  fetchSimponiIntegrationConfig,
  fetchSmtpIntegrationConfig,
  fetchSsoIntegrationConfig,
  testSmtpConnection,
  updateSimponiIntegrationConfig,
  updateSmtpIntegrationConfig,
  updateSsoIntegrationConfig,
} from "@/features/internal/integrations/api/integration.api";
import type {
  SimponiFormValues,
  SimponiIntegrationConfig,
  SmtpFormValues,
  SmtpIntegrationConfig,
  SmtpTestPayload,
  SsoFormValues,
  SsoIntegrationConfig,
} from "@/features/internal/integrations/types/integration.type";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// SSO Queries & Mutations
export const useSsoIntegrationQuery = () => {
  return useQuery<SsoIntegrationConfig, Error>({
    queryKey: queryKeys.internal.integrations.detail("sso"),
    queryFn: async ({ signal }) => {
      const res = await fetchSsoIntegrationConfig(signal);
      return res.data;
    },
  });
};

export const useUpdateSsoIntegrationMutation = () => {
  // Hooks
  const queryClient = useQueryClient();

  const toastHandlers = mutationToastHandlers("update-sso-integration", {
    group: "Integrasi Sistem",
    loadingMessage: {
      title: "Menyimpan konfigurasi SSO Keycloak...",
    },
    successMessage: {
      title: "Konfigurasi SSO Keycloak berhasil diperbarui!",
    },
    errorMessage: {
      title: "Gagal memperbarui konfigurasi SSO",
    },
  });

  return useMutation<SsoIntegrationConfig, Error, SsoFormValues>({
    mutationFn: async (payload) => {
      const res = await updateSsoIntegrationConfig(payload);
      return res.data;
    },
    onMutate: toastHandlers.onLoading,
    onError: toastHandlers.onError,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.integrations.detail("sso"),
      });
    },
  });
};

// SMTP Queries & Mutations
export const useSmtpIntegrationQuery = () => {
  return useQuery<SmtpIntegrationConfig, Error>({
    queryKey: queryKeys.internal.integrations.detail("smtp"),
    queryFn: async ({ signal }) => {
      const res = await fetchSmtpIntegrationConfig(signal);
      return res.data;
    },
  });
};

export const useUpdateSmtpIntegrationMutation = () => {
  // Hooks
  const queryClient = useQueryClient();

  const toastHandlers = mutationToastHandlers("update-smtp-integration", {
    group: "Integrasi Sistem",
    loadingMessage: {
      title: "Menyimpan konfigurasi Layanan Email (SMTP)...",
    },
    successMessage: {
      title: "Konfigurasi Layanan Email berhasil disimpan!",
    },
    errorMessage: {
      title: "Gagal memperbarui konfigurasi Layanan Email",
    },
  });

  return useMutation<SmtpIntegrationConfig, Error, SmtpFormValues>({
    mutationFn: async (payload) => {
      const res = await updateSmtpIntegrationConfig(payload);
      return res.data;
    },
    onMutate: toastHandlers.onLoading,
    onError: toastHandlers.onError,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.integrations.detail("smtp"),
      });
    },
  });
};

export const useTestSmtpMutation = () => {
  const toastHandlers = mutationToastHandlers("test-smtp-connection", {
    group: "Uji Coba Email",
    loadingMessage: {
      title: "Mengirim email uji coba...",
      description: "Menghubungkan ke server SMTP dan mengirimkan pesan verifikasi...",
    },
    successMessage: {
      title: "Email uji coba berhasil dikirim!",
      description: "Silakan periksa kotak masuk atau spam email penerima.",
    },
    errorMessage: {
      title: "Uji coba pengiriman email gagal",
    },
  });

  return useMutation<{ success: boolean; message: string }, Error, SmtpTestPayload>({
    mutationFn: async (payload) => {
      return testSmtpConnection(payload);
    },
    onMutate: toastHandlers.onLoading,
    onError: toastHandlers.onError,
    onSuccess: () => {
      toastHandlers.onSuccess();
    },
  });
};

// SIMPONI Queries & Mutations
export const useSimponiIntegrationQuery = () => {
  return useQuery<SimponiIntegrationConfig, Error>({
    queryKey: queryKeys.internal.integrations.detail("simponi"),
    queryFn: async ({ signal }) => {
      const res = await fetchSimponiIntegrationConfig(signal);
      return res.data;
    },
  });
};

export const useUpdateSimponiIntegrationMutation = () => {
  // Hooks
  const queryClient = useQueryClient();

  const toastHandlers = mutationToastHandlers("update-simponi-integration", {
    group: "Integrasi Sistem",
    loadingMessage: {
      title: "Menyimpan konfigurasi Billing SIMPONI...",
    },
    successMessage: {
      title: "Konfigurasi Billing SIMPONI berhasil diperbarui!",
    },
    errorMessage: {
      title: "Gagal memperbarui konfigurasi SIMPONI",
    },
  });

  return useMutation<SimponiIntegrationConfig, Error, SimponiFormValues>({
    mutationFn: async (payload) => {
      const res = await updateSimponiIntegrationConfig(payload);
      return res.data;
    },
    onMutate: toastHandlers.onLoading,
    onError: toastHandlers.onError,
    onSuccess: () => {
      toastHandlers.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.integrations.detail("simponi"),
      });
    },
  });
};
