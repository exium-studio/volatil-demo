// src/features/auth/hooks/use-signin.mutation.ts

import type { LoginPayload } from "@/features/auth/types/auth.service.type";
import { authService } from "@/features/auth/services/auth.service";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export const useSigninMutation = () => {
  // Hooks
  const navigate = useNavigate();

  // Handlers
  const toastHandlers = mutationToastHandlers("auth-signin", {
    loadingMessage: {
      title: "Memproses masuk...",
    },
    successMessage: {
      title: "Berhasil masuk!",
    },
  });

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onMutate: toastHandlers.onLoading,
    onSuccess: (_, variables) => {
      toastHandlers.onSuccess();
      if (variables.role === "mitra") {
        navigate({ to: "/mitra/welcome" });
      } else {
        navigate({ to: "/internal/welcome" });
      }
    },
    onError: toastHandlers.onError,
  });
};
