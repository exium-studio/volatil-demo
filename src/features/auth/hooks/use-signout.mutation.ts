import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
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
    mutationFn: () => {
      const currentUser = authService.getCurrentUser();
      const role = currentUser?.role;
      return authService.logout().then(() => ({ role }));
    },
    onMutate: toastHandlers.onLoading,
    onSuccess: ({ role }) => {
      toastHandlers.onSuccess();
      queryClient.clear();
      useMapLayerStore.getState().resetLayers();
      if (role === "internal") {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/" });
      }
    },
    onError: toastHandlers.onError,
  });
};
