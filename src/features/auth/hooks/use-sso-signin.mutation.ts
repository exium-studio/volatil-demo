// src/features/auth/hooks/use-sso-signin.mutation.ts

import { authService } from "@/features/auth/services/auth.service";
import type { SsoPortal } from "@/features/auth/types/sso.type";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation } from "@tanstack/react-query";

export const useSsoSigninMutation = (defaultPortal: SsoPortal = "internal") => {
  // Handlers
  const toastHandlers = mutationToastHandlers("auth-sso-signin", {
    group: "Autentikasi SSO",
    loadingMessage: {
      title: "Menyiapkan sesi SSO Keycloak...",
    },
    successMessage: {
      title:
        defaultPortal === "mitra"
          ? "Mengarahkan ke SSO Mitra ATR/BPN..."
          : "Mengarahkan ke SSO Pegawai ATR/BPN...",
    },
  });

  return useMutation<string, Error, SsoPortal | void>({
    mutationFn: (portal) =>
      authService.getSsoLoginUrl(portal || defaultPortal),
    onMutate: toastHandlers.onLoading,
    onSuccess: (loginUrl) => {
      toastHandlers.onSuccess();
      window.location.href = loginUrl;
    },
    onError: (error) => {
      toastHandlers.onError(error);
    },
  });
};
