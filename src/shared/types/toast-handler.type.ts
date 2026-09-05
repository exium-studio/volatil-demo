// src/shared/types/toast-handler.type.ts

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
