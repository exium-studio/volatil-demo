// src\features\auth\services\auth.service.ts

// src\features\auth\services\auth.service.ts

import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import {
  getAuthMeApi,
  getSsoInternalUrlApi,
  getTotpSetupApi,
  postLoginApi,
  postLoginTotpVerifyApi,
  postLogoutApi,
  postResetPasswordConfirmApi,
  postResetPasswordRequestApi,
  postResetPasswordVerifyOtpApi,
  postResetPasswordVerifyTotpApi,
  postSsoInternalCallbackApi,
  postSsoInternalLogoutUrlApi,
  postTotpSetupConfirmApi,
} from "@/features/auth/api/auth.api";
import type {
  AuthLoginData,
  SigninPayload,
  TotpSetupConfirmPayload,
  TotpSetupData,
  TotpVerifyPayload,
} from "@/features/auth/types/auth.service.type";
import type {
  ResetPasswordConfirmData,
  ResetPasswordConfirmPayload,
  ResetPasswordRequestData,
  ResetPasswordRequestPayload,
  ResetPasswordVerifyOtpData,
  ResetPasswordVerifyOtpPayload,
  ResetPasswordVerifyTotpData,
  ResetPasswordVerifyTotpPayload,
} from "@/features/auth/types/reset-password.type";


import { useAdministrativeFilterStore } from "@/features/mitra/data-request/stores/igt-layer.store";
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

      if ("accessToken" in response.data && response.data.accessToken) {
        localStorage.setItem("auth_token", response.data.accessToken);
      }
      if ("user" in response.data && response.data.user) {
        setStorage("user", JSON.stringify(response.data.user));
        return response.data.user;
      }

      throw new ApiError("Respon login tidak valid", 400);
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
          nip: "198805202010121002",
          kantorId: "94efc28c-e837-4581-9bd2-a16fcf7c79d1",
          namaKantor: "Kantah Kota Adm. Jakarta Pusat",
          tipeKantor: "KANTAH",
          tipeUser: "PNS",
          internalRoles: ["operator_warkah", "verifikator_kadastral"],
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

  loginInternalStep1: async (
    payload: SigninPayload,
    signal?: AbortSignal,
  ): Promise<AuthLoginData<User>> => {
    try {
      const response = await postLoginApi(payload, signal);

      if ("accessToken" in response.data && response.data.accessToken) {
        localStorage.setItem("auth_token", response.data.accessToken);
        if (response.data.user) {
          setStorage("user", JSON.stringify(response.data.user));
        }
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (!isDummyDataEnabled()) {
        throw error;
      }

      // Mock fallback for development environment when backend is offline and dummy data is enabled
      if (payload.email === "internal@demo.com") {
        const mockToken = `mock-token-${Date.now()}`;
        localStorage.setItem("auth_token", mockToken);
        const dummyInternalUser: InternalUser = {
          id: "3",
          email: payload.email,
          name: "Internal Admin Demo",
          role: "internal",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          nip: "198805202010121002",
          kantorId: "94efc28c-e837-4581-9bd2-a16fcf7c79d1",
          namaKantor: "Kantah Kota Adm. Jakarta Pusat",
          tipeKantor: "KANTAH",
          tipeUser: "PNS",
          internalRoles: ["operator_warkah", "verifikator_kadastral"],
        };
        setStorage("user", JSON.stringify(dummyInternalUser));
        return {
          tokenType: "Bearer",
          accessToken: mockToken,
          user: dummyInternalUser,
        };
      }

      if (payload.email === "pmotematik@gmail.com") {
        return {
          requiresTotpSetup: true,
          mfaToken: `mock-mfa-token-${Date.now()}`,
          mfaTokenExpiresIn: 300,
        };
      }

      return {
        mfaRequired: true,
        mfaToken: `mock-mfa-token-${Date.now()}`,
        mfaTokenExpiresIn: 300,
      };
    }
  },

  verifyTotp: async (
    payload: TotpVerifyPayload,
    signal?: AbortSignal,
  ): Promise<User> => {
    try {
      const response = await postLoginTotpVerifyApi(payload, signal);

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

      // Mock fallback
      const mockToken = `mock-token-${Date.now()}`;
      localStorage.setItem("auth_token", mockToken);
      const dummyInternalUser: InternalUser = {
        id: "1",
        email: "internal@demo.com",
        name: "PMO Tematik",
        role: "internal",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nip: "198805202010121002",
        kantorId: "94efc28c-e837-4581-9bd2-a16fcf7c79d1",
        namaKantor: "Direktorat Jenderal IGTPR / ATR-BPN",
        tipeKantor: "PUSAT",
        tipeUser: "PNS",
        internalRoles: ["pmo_tematik", "administrator"],
      };
      setStorage("user", JSON.stringify(dummyInternalUser));
      return dummyInternalUser;
    }
  },

  getTotpSetup: async (
    mfaToken: string,
    signal?: AbortSignal,
  ): Promise<TotpSetupData> => {
    try {
      const response = await getTotpSetupApi(mfaToken, signal);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (!isDummyDataEnabled()) {
        throw error;
      }

      // Mock fallback
      return {
        qrCodeDataUrl:
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='%23f1f5f9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-size='14'>Mock QR Code</text></svg>",
        manualEntryKey: "JBSWY3DPEHPK3PXP",
        issuer: "IGTPR Volatil",
        accountName: "pmotematik@gmail.com",
      };
    }
  },

  confirmTotpSetup: async (
    mfaToken: string,
    payload: TotpSetupConfirmPayload,
    signal?: AbortSignal,
  ): Promise<User> => {
    try {
      const response = await postTotpSetupConfirmApi(mfaToken, payload, signal);

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

      // Mock fallback
      const mockToken = `mock-token-${Date.now()}`;
      localStorage.setItem("auth_token", mockToken);
      const dummyInternalUser: InternalUser = {
        id: "1",
        email: "pmotematik@gmail.com",
        name: "PMO Tematik",
        role: "internal",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nip: "198805202010121002",
        kantorId: "94efc28c-e837-4581-9bd2-a16fcf7c79d1",
        namaKantor: "Direktorat Jenderal IGTPR / ATR-BPN",
        tipeKantor: "PUSAT",
        tipeUser: "PNS",
        internalRoles: ["pmo_tematik"],
      };
      setStorage("user", JSON.stringify(dummyInternalUser));
      return dummyInternalUser;
    }
  },

  getSsoLoginUrl: async (signal?: AbortSignal): Promise<string> => {
    const state = crypto.randomUUID();
    const callbackUrl = `${window.location.origin}/auth/callback/keycloak`;

    sessionStorage.setItem("sso_state", state);
    sessionStorage.setItem("sso_redirect_uri", callbackUrl);

    const response = await getSsoInternalUrlApi(
      {
        redirectUri: callbackUrl,
        state,
      },
      signal,
    );

    return response.data.loginUrl;
  },

  handleSsoCallback: async (
    code: string,
    state: string,
    signal?: AbortSignal,
  ): Promise<User> => {
    const stateFromStorage = sessionStorage.getItem("sso_state");
    const storedRedirectUri = sessionStorage.getItem("sso_redirect_uri");
    const callbackUrl =
      storedRedirectUri || `${window.location.origin}/auth/callback/keycloak`;

    // Clear state after usage
    sessionStorage.removeItem("sso_state");
    sessionStorage.removeItem("sso_redirect_uri");

    if (!code || !state || !stateFromStorage || state !== stateFromStorage) {
      throw new Error(
        "State mismatch atau kode otorisasi tidak valid! Kemungkinan serangan CSRF.",
      );
    }

    const response = await postSsoInternalCallbackApi(
      {
        code,
        redirectUri: callbackUrl,
      },
      signal,
    );

    if (response.data.accessToken) {
      localStorage.setItem("auth_token", response.data.accessToken);
    }
    if (response.data.keycloakIdToken) {
      sessionStorage.setItem("keycloakIdToken", response.data.keycloakIdToken);
    }
    if (response.data.user) {
      setStorage("user", JSON.stringify(response.data.user));
    }

    return response.data.user;
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
      return getUserSession();
    } catch (error) {
      if (error instanceof ApiError) {
        // Only clear auth on 401 Unauthorized or 403 Forbidden (account banned/disabled)
        if (error.statusCode === 401 || error.statusCode === 403) {
          localStorage.removeItem("auth_token");
          removeStorage("user");
          sessionStorage.removeItem("keycloakIdToken");
          return null;
        }

        // For server errors (500, 502, 503, 504) or other non-auth errors, keep user session
        return getUserSession();
      }

      // For network errors / offline / aborted requests, do not clear token, fallback to cached user session
      return getUserSession();
    }
  },

  logout: async (
    signal?: AbortSignal,
  ): Promise<{ logoutUrl?: string | null; role?: string }> => {
    const currentUser = getUserSession();
    const role = currentUser?.role;
    const idToken = sessionStorage.getItem("keycloakIdToken");
    let keycloakLogoutUrl: string | null = null;

    try {
      if (role === "internal") {
        const postLogoutUri = `${window.location.origin}/admin`;
        const response = await postSsoInternalLogoutUrlApi(
          {
            idToken: idToken || undefined,
            postLogoutRedirectUri: postLogoutUri,
          },
          signal,
        );
        if (response.data?.logoutUrl) {
          keycloakLogoutUrl = response.data.logoutUrl;
        }
      } else {
        await postLogoutApi(signal);
      }
    } catch {
      // Ignore network / offline error during logout
    } finally {
      localStorage.removeItem("auth_token");
      removeStorage("user");
      sessionStorage.removeItem("keycloakIdToken");
      sessionStorage.removeItem("sso_state");
      sessionStorage.removeItem("sso_redirect_uri");
      useMapLayerStore.getState().resetLayers();
      useAdministrativeFilterStore.getState().setAppliedAdministrativeFilters({});
    }

    return { logoutUrl: keycloakLogoutUrl, role };
  },

  getCurrentUser: (): User | null => {
    return getUserSession();
  },

  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  },

  requestResetPassword: async (
    payload: ResetPasswordRequestPayload,
    signal?: AbortSignal,
  ): Promise<ResetPasswordRequestData> => {
    try {
      const response = await postResetPasswordRequestApi(payload, signal);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (!isDummyDataEnabled()) {
        throw error;
      }

      // Mock fallback for development environment when backend is offline
      return {
        message:
          "Kode verifikasi reset kata sandi telah dikirimkan ke email Anda.",
        email: payload.email,
        expiresIn: 300,
        resetToken: "123456",
      };
    }
  },

  verifyResetPasswordOtp: async (
    payload: ResetPasswordVerifyOtpPayload,
    signal?: AbortSignal,
  ): Promise<ResetPasswordVerifyOtpData> => {
    try {
      const response = await postResetPasswordVerifyOtpApi(payload, signal);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (!isDummyDataEnabled()) {
        throw error;
      }

      // Mock fallback
      return {
        success: true,
        message: "Kode OTP berhasil diverifikasi.",
        email: payload.email,
        resetToken: payload.resetToken,
      };
    }
  },

  verifyResetPasswordTotp: async (
    payload: ResetPasswordVerifyTotpPayload,
    signal?: AbortSignal,
  ): Promise<ResetPasswordVerifyTotpData> => {
    try {
      const response = await postResetPasswordVerifyTotpApi(payload, signal);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (!isDummyDataEnabled()) {
        throw error;
      }

      // Mock fallback
      return {
        success: true,
        message: "Kode Google Authenticator berhasil diverifikasi.",
        email: payload.email,
        resetToken: payload.totpCode,
      };
    }
  },

  confirmResetPassword: async (
    payload: ResetPasswordConfirmPayload,
    signal?: AbortSignal,
  ): Promise<ResetPasswordConfirmData> => {
    try {
      const response = await postResetPasswordConfirmApi(payload, signal);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (!isDummyDataEnabled()) {
        throw error;
      }

      // Mock fallback
      return {
        success: true,
        message:
          "Kata sandi akun Anda berhasil diperbarui. Silakan masuk menggunakan kata sandi baru.",
      };
    }
  },
};



