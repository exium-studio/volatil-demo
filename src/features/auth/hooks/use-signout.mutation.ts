// src/features/auth/hooks/use-signout.mutation.ts

import { authService } from "@/features/auth/services/auth.service";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export const useSignoutMutation = () => {
  // Hooks
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Handlers
  const toastHandlers = mutationToastHandlers("auth-signout", {
    group: "Autentikasi",
    loadingMessage: {
      title: "Memproses keluar...",
    },
    successMessage: {
      title: "Berhasil keluar!",
    },
  });

  return useMutation({
    mutationFn: () => authService.logout(),
    onMutate: toastHandlers.onLoading,
    onSuccess: () => {
      toastHandlers.onSuccess();
      queryClient.clear();
      navigate({ to: "/" });
    },
    onError: toastHandlers.onError,
  });
};
