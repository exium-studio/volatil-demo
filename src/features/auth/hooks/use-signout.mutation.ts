// src/features/auth/hooks/use-signout.mutation.ts

// src\features\auth\hooks\use-signout.mutation.ts

// src\features\auth\hooks\use-signout.mutation.ts

import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import { authService } from "@/features/auth/services/auth.service";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
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
    onSuccess: ({ logoutUrl, role }) => {
      toastHandlers.onSuccess();
      queryClient.setQueryData(queryKeys.auth.me(), null);
      queryClient.clear();
      useMapLayerStore.getState().resetLayers();

      if (logoutUrl) {
        window.location.href = logoutUrl;
        return;
      }

      if (role === "internal") {
        void navigate({ to: "/admin" });
      } else {
        void navigate({ to: "/" });
      }
    },
    onError: toastHandlers.onError,
  });
};

