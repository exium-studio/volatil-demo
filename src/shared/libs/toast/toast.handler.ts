// src/shared/libs/toast/toast.handler.ts

export type ToastMessageConfig = {
  title: string;
  description?: string;
};

export type MutationToastOptions = {
  loadingMessage?: ToastMessageConfig;
  successMessage?: ToastMessageConfig;
  errorMessage?: ToastMessageConfig;
};

/**
 * Mutation Toast Handler Helper
 *
 * Wraps onMutate (loading toast), onSuccess (success toast), and onError (error toast).
 */
export const mutationToastHandlers = (
  _key: string,
  options: MutationToastOptions = {},
) => {
  return {
    onLoading: () => {
      if (options.loadingMessage) {
        console.log(`[Toast Loading]: ${options.loadingMessage.title}`);
      }
    },
    onSuccess: () => {
      if (options.successMessage) {
        console.log(`[Toast Success]: ${options.successMessage.title}`);
      }
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      console.error(
        `[Toast Error]: ${options.errorMessage?.title ?? message}`,
      );
    },
  };
};
