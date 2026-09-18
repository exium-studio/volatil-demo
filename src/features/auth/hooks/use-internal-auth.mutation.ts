// src/features/auth/hooks/use-internal-auth.mutation.ts

import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import { authService } from "@/features/auth/services/auth.service";
import type {
  AuthLoginData,
  SigninPayload,
  TotpSetupConfirmPayload,
  TotpSetupData,
  TotpVerifyPayload,
} from "@/features/auth/types/auth.service.type";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import type { User } from "@/shared/types/common-response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export const useInternalSigninStep1Mutation = () => {
  // Handlers
  const toastHandlers = mutationToastHandlers("auth-internal-step1", {
    group: "Autentikasi Pegawai",
    loadingMessage: {
      title: "Memverifikasi kredensial...",
    },
    successMessage: {
      title: "Kredensial valid!",
    },
  });

  return useMutation<AuthLoginData<User>, Error, SigninPayload>({
    mutationFn: (payload: SigninPayload) =>
      authService.loginInternalStep1(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: (data) => {
      if ("accessToken" in data && data.accessToken) {
        toastHandlers.onSuccess();
      }
    },
    onError: (error) => {
      toastHandlers.onError(error);
    },
  });
};

export const useInternalTotpVerifyMutation = () => {
  // Hooks
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Handlers
  const toastHandlers = mutationToastHandlers("auth-internal-totp-verify", {
    group: "Verifikasi Authenticator",
    loadingMessage: {
      title: "Memverifikasi kode 6-digit...",
    },
    successMessage: {
      title: "Login berhasil!",
    },
  });

  return useMutation<User, Error, TotpVerifyPayload>({
    mutationFn: (payload: TotpVerifyPayload) =>
      authService.verifyTotp(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      queryClient.clear();
      useMapLayerStore.getState().resetLayers();
      void navigate({ to: "/internal/welcome" });
    },
    onError: (error) => {
      toastHandlers.onError(error);
    },
  });
};

export const useInternalTotpSetupMutation = () => {
  // Handlers
  const toastHandlers = mutationToastHandlers("auth-internal-totp-setup", {
    group: "Setup Authenticator",
    loadingMessage: {
      title: "Menyiapkan QR Code Authenticator...",
    },
    successMessage: {
      title: "QR Code siap discan.",
    },
  });

  return useMutation<TotpSetupData, Error, string>({
    mutationFn: (mfaToken: string) => authService.getTotpSetup(mfaToken),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
    },
    onError: (error) => {
      toastHandlers.onError(error);
    },
  });
};

export const useInternalTotpConfirmMutation = () => {
  // Hooks
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Handlers
  const toastHandlers = mutationToastHandlers("auth-internal-totp-confirm", {
    group: "Aktivasi Authenticator",
    loadingMessage: {
      title: "Mengaktifkan Google Authenticator...",
    },
    successMessage: {
      title: "Aktivasi berhasil! Selamat datang.",
    },
  });

  return useMutation<User, Error, { mfaToken: string; payload: TotpSetupConfirmPayload }>({
    mutationFn: ({ mfaToken, payload }) =>
      authService.confirmTotpSetup(mfaToken, payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      queryClient.clear();
      useMapLayerStore.getState().resetLayers();
      void navigate({ to: "/internal/welcome" });
    },
    onError: (error) => {
      toastHandlers.onError(error);
    },
  });
};
