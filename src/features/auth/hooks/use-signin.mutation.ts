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
import type {
  InternalUser,
  MitraUser,
} from "@/shared/types/common-response.type";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { setStorage } from "@/shared/utils/client/client.storage";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

const SIMULATE_CREDENTIALS = {
  mitra: {
    email: import.meta.env.VITE_SIMULATE_MITRA_EMAIL ?? "mitra@demo.com",
    password: import.meta.env.VITE_SIMULATE_MITRA_PASSWORD ?? "mitra123",
  },
  internal: {
    email: import.meta.env.VITE_SIMULATE_INTERNAL_EMAIL ?? "internal@demo.com",
    password: import.meta.env.VITE_SIMULATE_INTERNAL_PASSWORD ?? "internal123",
  },
} as const;

const simulateLogin = async (
  payload: SigninPayload,
): Promise<{ role: SigninPayload["role"] }> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const isMitra =
    payload.email === SIMULATE_CREDENTIALS.mitra.email &&
    payload.password === SIMULATE_CREDENTIALS.mitra.password;

  const isInternal =
    payload.email === SIMULATE_CREDENTIALS.internal.email &&
    payload.password === SIMULATE_CREDENTIALS.internal.password;

  if (!isMitra && !isInternal) {
    throw new Error("Email atau password salah");
  }

  const role: SigninPayload["role"] = isMitra ? "mitra" : "internal";
  const mockToken = `mock-token-${role}-${Date.now()}`;
  localStorage.setItem("auth_token", mockToken);

  if (role === "mitra") {
    const dummyMitraUser: MitraUser = {
      id: "mitra-123",
      email: payload.email,
      name: "Mitra Volatil",
      role: "mitra",
      companyName: "PT Volatil Sukses Makmur",
      companyRegistrationNumber: "REG-987654321",
      purchasedQuota: 100,
      tier: "premium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStorage("user", JSON.stringify(dummyMitraUser));
    return { role: "mitra" };
  }

  const dummyInternalUser: InternalUser = {
    id: "internal-123",
    email: payload.email,
    name: "Internal Admin",
    role: "internal",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  setStorage("user", JSON.stringify(dummyInternalUser));
  return { role: "internal" };
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
