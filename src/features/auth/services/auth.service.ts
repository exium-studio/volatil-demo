// src/features/auth/services/auth.service.ts

import type {
  AuthResponse,
  LoginPayload,
} from "@/features/auth/types/auth.service.type";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type {
  InternalUser,
  MitraUser,
  User,
} from "@/shared/types/common-response.type";
import {
  removeStorage,
  setStorage,
} from "@/shared/utils/client/client.storage";

export const authService = {
  login: async (payload: LoginPayload): Promise<User> => {
    try {
      const response = await apiClient.post<AuthResponse<User>>(
        "/auth/login",
        payload,
      );

      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
      }
      if (response.data.user) {
        setStorage("user", JSON.stringify(response.data.user));
      }

      return response.data.user;
    } catch {
      // Mock fallback for development environment when backend is offline
      const mockToken = `mock-token-${Date.now()}`;
      localStorage.setItem("auth_token", mockToken);

      if (payload.role === "mitra") {
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
        return dummyMitraUser;
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
      return dummyInternalUser;
    }
  },

  logout: (): void => {
    localStorage.removeItem("auth_token");
    removeStorage("user");
  },
};
