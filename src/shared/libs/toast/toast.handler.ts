// src/shared/libs/toast/toast.handler.ts

import { toast } from "@/design-system/components/toast";

export type ToastMessageConfig = {
  title: string;
  description?: string;
};

export type MutationToastOptions = {
  group?: string;
  loadingMessage?: ToastMessageConfig;
  successMessage?: ToastMessageConfig;
  errorMessage?: ToastMessageConfig;
};

/**
 * Mutation Toast Handler Helper
 *
 * Connects TanStack Query mutation lifecycle (onMutate, onSuccess, onError)
 * directly to the application's Toast Engine with categorized groups.
 */
export const mutationToastHandlers = (
  key: string,
  options: MutationToastOptions = {},
) => {
  const toastId = `mutation-toast-${key}`;
  const group = options.group;

  return {
    onLoading: () => {
      if (options.loadingMessage) {
        toast.loading(options.loadingMessage.title, {
          id: toastId,
          group,
          description: options.loadingMessage.description,
        });
      }
    },
    onSuccess: () => {
      if (options.successMessage) {
        toast.success(options.successMessage.title, {
          id: toastId,
          group,
          description: options.successMessage.description,
        });
      } else {
        toast.close(toastId);
      }
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error(options.errorMessage?.title ?? message, {
        id: toastId,
        group,
        description: options.errorMessage?.description,
      });
    },
  };
};
