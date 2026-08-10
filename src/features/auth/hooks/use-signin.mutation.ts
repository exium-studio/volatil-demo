// src/features/auth/hooks/use-signin.mutation.ts

// import type { SigninPayload } from "@/features/auth/types/auth.service.type";
// import { authService } from "@/features/auth/services/auth.service";
// import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
// import { useMutation } from "@tanstack/react-query";
// import { useNavigate } from "@tanstack/react-router";

// export const useSigninMutation = () => {
//   // Hooks
//   const navigate = useNavigate();

//   // Handlers
//   const toastHandlers = mutationToastHandlers("auth-signin", {
//     loadingMessage: {
//       title: "Memproses masuk...",
//     },
//     successMessage: {
//       title: "Berhasil masuk!",
//     },
//   });

//   return useMutation({
//     mutationFn: (payload: SigninPayload) => authService.login(payload),
//     onMutate: toastHandlers.onLoading,
//     onSuccess: (_, variables) => {
//       toastHandlers.onSuccess();
//       if (variables.role === "mitra") {
//         navigate({ to: "/mitra/welcome" });
//       } else {
//         navigate({ to: "/internal/welcome" });
//       }
//     },
//     onError: toastHandlers.onError,
//   });
// };

import type { SigninPayload } from "@/features/auth/types/auth.service.type";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

const SIMULATE_CREDENTIALS = {
  mitra: {
    email: import.meta.env.VITE_SIMULATE_MITRA_EMAIL,
    password: import.meta.env.VITE_SIMULATE_MITRA_PASSWORD,
  },
  internal: {
    email: import.meta.env.VITE_SIMULATE_INTERNAL_EMAIL,
    password: import.meta.env.VITE_SIMULATE_INTERNAL_PASSWORD,
  },
} as const;

const simulateLogin = async (
  payload: SigninPayload,
): Promise<{ role: SigninPayload["role"] }> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  console.log("payload:", payload);
  console.log("mitra creds:", SIMULATE_CREDENTIALS.mitra);
  console.log("internal creds:", SIMULATE_CREDENTIALS.internal);

  if (
    payload.email === SIMULATE_CREDENTIALS.mitra.email &&
    payload.password === SIMULATE_CREDENTIALS.mitra.password
  ) {
    return { role: "mitra" };
  }

  if (
    payload.email === SIMULATE_CREDENTIALS.internal.email &&
    payload.password === SIMULATE_CREDENTIALS.internal.password
  ) {
    return { role: "internal" };
  }

  throw new Error("Email atau password salah");
};

export const useSigninMutation = () => {
  // Hooks
  const navigate = useNavigate();

  // Handlers
  const toastHandlers = mutationToastHandlers("auth-signin", {
    loadingMessage: {
      title: "Memproses masuk...",
    },
    successMessage: {
      title: "Berhasil masuk!",
    },
  });

  return useMutation({
    // TODO: Ganti ke authService.login(payload) setelah BE ready
    // mutationFn: (payload: LoginPayload) => authService.login(payload),
    mutationFn: simulateLogin,
    onMutate: toastHandlers.onLoading,
    onSuccess: (data) => {
      toastHandlers.onSuccess();
      if (data.role === "mitra") {
        navigate({ to: "/mitra/welcome" });
      } else {
        navigate({ to: "/internal/welcome" });
      }
    },
    onError: toastHandlers.onError,
  });
};
