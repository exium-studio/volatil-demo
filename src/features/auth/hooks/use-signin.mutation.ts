import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import { authService } from "@/features/auth/services/auth.service";
import type { SigninPayload } from "@/features/auth/types/auth.service.type";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import type { User } from "@/shared/types/common-response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export const useSigninMutation = () => {
  // Hooks
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
      queryClient.clear();
      useMapLayerStore.getState().resetLayers();
      if (user.role === "mitra") {
        navigate({ to: "/mitra/welcome" });
      } else {
        navigate({ to: "/internal/welcome" });
      }
    },
    onError: (error) => {
      toastHandlers.onError(error);
    },
  });
};
