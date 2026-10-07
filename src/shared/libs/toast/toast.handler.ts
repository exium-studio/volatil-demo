// src/shared/libs/toast/toast.handler.ts

import { toast } from "@/design-system/components/toast";
import { ApiError } from "@/shared/libs/api-client/api-error";
import type { MutationToastOptions } from "@/shared/types/toast-handler.type";

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
      // Close any active loading toast created by onMutate
      toast.close(toastId);

      // If the error was already handled and toasted by apiClient and no custom errorMessage is configured, skip duplicate toast
      const isAlreadyHandled =
        error instanceof ApiError && Boolean(error.isHandled);
      if (isAlreadyHandled && !options.errorMessage) {
        return;
      }

      let errorMessageString = "Terjadi kesalahan";
      if (error instanceof Error) {
        errorMessageString = error.message;
      }

      const title = options.errorMessage?.title ?? errorMessageString;
      const description =
        options.errorMessage?.description ??
        (options.errorMessage?.title &&
        errorMessageString !== options.errorMessage.title
          ? errorMessageString
          : undefined);

      toast.error(title, {
        id: toastId,
        group,
        description,
      });
    },
  };
};
