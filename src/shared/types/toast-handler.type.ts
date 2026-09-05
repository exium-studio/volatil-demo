<<<<<<< HEAD
// src/shared/types/toast-handler.type.ts

=======
>>>>>>> fd4996e3 (refactor: overhaul design system toast architecture, introduce shared utility types, and refine component interfaces across features)
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
