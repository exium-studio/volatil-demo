// src/features/auth/hooks/use-sso-callback.mutation.ts

import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import { authService } from "@/features/auth/services/auth.service";
import type { SsoCallbackParams } from "@/features/auth/types/sso.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import type { User } from "@/shared/types/common-response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export const useSsoCallbackMutation = () => {
  // Hooks
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Handlers
  const toastHandlers = mutationToastHandlers("auth-sso-callback", {
    group: "Autentikasi SSO",
    loadingMessage: {
      title: "Memverifikasi sesi SSO...",
    },
    successMessage: {
      title: "Autentikasi SSO Berhasil!",
    },
  });

  return useMutation<User, Error, SsoCallbackParams>({
    mutationFn: ({ code, state }: SsoCallbackParams) =>
      authService.handleSsoCallback(code, state),
    onMutate: toastHandlers.onLoading,
    onSuccess: (user) => {
      toastHandlers.onSuccess();
      queryClient.setQueryData(queryKeys.auth.me(), user);
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "auth",
      });
      useMapLayerStore.getState().resetLayers();
      if (user.role === "internal") {
        void navigate({ to: "/internal/welcome" });
      } else {
        void navigate({ to: "/mitra/welcome" });
      }
    },
    onError: (error) => {
      toastHandlers.onError(error);
    },
  });
};
