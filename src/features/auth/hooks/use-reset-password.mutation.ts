// src\features\auth\hooks\use-reset-password.mutation.ts

import { authService } from "@/features/auth/services/auth.service";
import type {
  ResetPasswordConfirmData,
  ResetPasswordConfirmPayload,
  ResetPasswordRequestData,
  ResetPasswordRequestPayload,
  ResetPasswordVerifyOtpData,
  ResetPasswordVerifyOtpPayload,
  ResetPasswordVerifyTotpData,
  ResetPasswordVerifyTotpPayload,
} from "@/features/auth/types/reset-password.type";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation } from "@tanstack/react-query";

export const useResetPasswordRequestMutation = () => {
  const toastHandlers = mutationToastHandlers("auth-reset-password-request", {
    group: "Reset Kata Sandi",
    loadingMessage: {
      title: "Mengirim kode verifikasi...",
    },
    successMessage: {
      title: "Kode verifikasi terkirim!",
    },
  });

  return useMutation<ResetPasswordRequestData, Error, ResetPasswordRequestPayload>({
    mutationFn: (payload: ResetPasswordRequestPayload) =>
      authService.requestResetPassword(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
    },
    onError: (error) => {
      toastHandlers.onError(error);
    },
  });
};

export const useResetPasswordVerifyOtpMutation = () => {
  const toastHandlers = mutationToastHandlers("auth-reset-password-verify-otp", {
    group: "Reset Kata Sandi",
    loadingMessage: {
      title: "Memverifikasi kode OTP...",
    },
    successMessage: {
      title: "Kode OTP valid!",
    },
  });

  return useMutation<ResetPasswordVerifyOtpData, Error, ResetPasswordVerifyOtpPayload>({
    mutationFn: (payload: ResetPasswordVerifyOtpPayload) =>
      authService.verifyResetPasswordOtp(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
    },
    onError: (error) => {
      toastHandlers.onError(error);
    },
  });
};

export const useResetPasswordVerifyTotpMutation = () => {
  const toastHandlers = mutationToastHandlers("auth-reset-password-verify-totp", {
    group: "Reset Kata Sandi",
    loadingMessage: {
      title: "Memverifikasi kode Authenticator...",
    },
    successMessage: {
      title: "Kode Authenticator valid!",
    },
  });

  return useMutation<ResetPasswordVerifyTotpData, Error, ResetPasswordVerifyTotpPayload>({
    mutationFn: (payload: ResetPasswordVerifyTotpPayload) =>
      authService.verifyResetPasswordTotp(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
    },
    onError: (error) => {
      toastHandlers.onError(error);
    },
  });
};

export const useResetPasswordConfirmMutation = () => {
  const toastHandlers = mutationToastHandlers("auth-reset-password-confirm", {
    group: "Reset Kata Sandi",
    loadingMessage: {
      title: "Menyimpan kata sandi baru...",
    },
    successMessage: {
      title: "Kata sandi berhasil diperbarui!",
    },
  });

  return useMutation<ResetPasswordConfirmData, Error, ResetPasswordConfirmPayload>({
    mutationFn: (payload: ResetPasswordConfirmPayload) =>
      authService.confirmResetPassword(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
    },
    onError: (error) => {
      toastHandlers.onError(error);
    },
  });
};

