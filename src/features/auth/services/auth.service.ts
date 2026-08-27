// src/features/auth/services/auth.service.ts

import {
  getAuthMeApi,
  postLoginApi,
  postLogoutApi,
} from "@/features/auth/api/auth.api";
import type { SigninPayload } from "@/features/auth/types/auth.service.type";
import { ApiError } from "@/shared/libs/api-client/api-error";
import type {
  InternalUser,
  MitraUser,
  User,
} from "@/shared/types/common-response.type";
import {
  removeStorage,
  setStorage,
} from "@/shared/utils/client/client.storage";
import { getUserSession } from "@/shared/utils/user/user-session.utils";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

export const authService = {
  login: async (
    payload: SigninPayload,
    signal?: AbortSignal,
  ): Promise<User> => {
    try {
      const response = await postLoginApi(payload, signal);

      if (response.data.accessToken) {
        localStorage.setItem("auth_token", response.data.accessToken);
      }
      if (response.data.user) {
        setStorage("user", JSON.stringify(response.data.user));
      }

      return response.data.user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (!isDummyDataEnabled()) {
        throw error;
      }
      // Mock fallback for development environment when backend is offline and dummy data is enabled
      const mockToken = `mock-token-${Date.now()}`;
      localStorage.setItem("auth_token", mockToken);

      if (payload.role === "internal") {
        const dummyInternalUser: InternalUser = {
          id: "2",
          email: payload.email,
          name: "Internal Admin Demo",
          role: "internal",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setStorage("user", JSON.stringify(dummyInternalUser));
        return dummyInternalUser;
      }

      const dummyMitraUser: MitraUser = {
        id: "1",
        email: payload.email,
        name: "Mitra User Demo",
        role: "mitra",
        companyName: "PT Nusantara Citra Mandiri",
        companyRegistrationNumber: "REG-987654321",
        purchasedQuota: 100,
        tier: "premium",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setStorage("user", JSON.stringify(dummyMitraUser));
      return dummyMitraUser;
    }
  },

  verifyMe: async (signal?: AbortSignal): Promise<User | null> => {
    const token = localStorage.getItem("auth_token");
    if (!token) return null;

    try {
      const response = await getAuthMeApi(signal);
      if (response.data) {
        setStorage("user", JSON.stringify(response.data));
        return response.data;
      }
      return null;
    } catch (error) {
      if (error instanceof ApiError) {
        localStorage.removeItem("auth_token");
        removeStorage("user");
        return null;
      }
      if (!isDummyDataEnabled()) {
        localStorage.removeItem("auth_token");
        removeStorage("user");
        return null;
      }
      return getUserSession();
    }
  },

  logout: async (signal?: AbortSignal): Promise<void> => {
    try {
      await postLogoutApi(signal);
    } catch {
      // Ignore network / offline error during logout
    } finally {
      localStorage.removeItem("auth_token");
      removeStorage("user");
    }
  },

  getCurrentUser: (): User | null => {
    return getUserSession();
  },

  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  },
};
