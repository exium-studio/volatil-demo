// src/features/auth/hooks/use-sso-signin.mutation.ts

// src\features\auth\hooks\use-sso-signin.mutation.ts

// src\features\auth\hooks\use-sso-signin.mutation.ts

import { authService } from "@/features/auth/services/auth.service";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation } from "@tanstack/react-query";

export const useSsoSigninMutation = () => {
  // Handlers
  const toastHandlers = mutationToastHandlers("auth-sso-signin", {
    group: "Autentikasi SSO",
    loadingMessage: {
      title: "Menyiapkan sesi SSO Keycloak...",
    },
    successMessage: {
      title: "Mengarahkan ke SSO ATR/BPN...",
    },
  });

  return useMutation<string, Error, void>({
    mutationFn: () => authService.getSsoLoginUrl(),
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
