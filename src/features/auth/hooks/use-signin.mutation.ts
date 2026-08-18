// src/features/auth/hooks/use-signin.mutation.ts

import { authService } from "@/features/auth/services/auth.service";
import type { SigninPayload } from "@/features/auth/types/auth.service.type";
import type { User } from "@/shared/types/common-response.type";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export const useSigninMutation = () => {
  // Hooks
  const navigate = useNavigate();

  // Handlers
  const toastHandlers = mutationToastHandlers("auth-signin", {
    group: "Autentikasi",
    loadingMessage: {
      title: "Memproses masuk...",
    },
    successMessage: {
      title: "Berhasil masuk!",
    },
  });

  return useMutation<User, Error, SigninPayload>({
    mutationFn: (payload: SigninPayload) => authService.login(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: (user) => {
      toastHandlers.onSuccess();
      if (user.role === "mitra") {
        navigate({ to: "/mitra/welcome" });
      } else {
        navigate({ to: "/internal/welcome" });
      }
    },
    onError: toastHandlers.onError,
  });
};
