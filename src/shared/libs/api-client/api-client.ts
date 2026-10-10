// src/shared/libs/api-client/api-client.ts

import { toast } from "@/design-system/components/toast";
import { ApiError } from "@/shared/libs/api-client/api-error";
import { t } from "@/shared/libs/i18n";

import type { RequestOptions } from "@/shared/types/api-client.type";

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
};

export const apiClient = {
  request: async <T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> => {
    const { body, params, headers: customHeaders, ...restOptions } = options;

    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
    let url =
      endpoint.startsWith("http://") || endpoint.startsWith("https://")
        ? endpoint
        : `${baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes("?") ? "&" : "?") + queryString;
      }
    }

    const token = getAuthToken();

    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(customHeaders as Record<string, string>),
    };

    let serializedBody: BodyInit | null = null;
    if (body) {
      if (body instanceof FormData || body instanceof URLSearchParams) {
        serializedBody = body;
      } else {
        headers["Content-Type"] = "application/json";
        serializedBody = JSON.stringify(body);
      }
    }

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers,
        body: serializedBody,
      });

      if (!response.ok) {
        let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
        let errorCode: string | undefined = undefined;
        let errorData: Record<string, string[]> | undefined = undefined;

        try {
          const jsonError = await response.json();
          if (jsonError.message) errorMessage = jsonError.message;
          if (jsonError.code) errorCode = String(jsonError.code);
          if (jsonError.errors) errorData = jsonError.errors;
        } catch {
          // Fallback if response is not JSON
        }

        const isAuthLoginEndpoint =
          endpoint.includes("/api/auth/login") ||
          endpoint.includes("/api/auth/sso/internal/callback") ||
          endpoint.includes("/api/auth/login/totp-verify");

        let isToastFired = false;

        // 1. KASUS AUTH_EXPIRED (status 400 with code AUTH_EXPIRED or 401/403 on protected routes)
        const isAuthExpired =
          errorCode === "AUTH_EXPIRED" ||
          (!isAuthLoginEndpoint && (response.status === 401 || response.status === 403));

        if (isAuthExpired) {
          if (typeof window !== "undefined") {
            const currentPath =
              window.location.pathname.replace(/\/$/, "") || "/";
            const isSigninRoute =
              currentPath === "/" || currentPath === "/admin";

            if (!isSigninRoute && !isAuthLoginEndpoint) {
              localStorage.removeItem("auth_token");
              localStorage.removeItem("user");
              sessionStorage.removeItem("user");
              sessionStorage.removeItem("keycloakIdToken");

              const toastTitle =
                response.status === 403
                  ? t["error.forbidden"]()
                  : t["error.unauthorized"]();

              toast.error(toastTitle, {
                id: "auth-session-expired-toast",
                group: t["common.system"](),
                description:
                  errorMessage ||
                  (response.status === 403
                    ? t["error.forbidden"]()
                    : t["error.unauthorized"]()),
              });
              isToastFired = true;

              const isInternal =
                window.location.pathname.startsWith("/internal") ||
                window.location.pathname.startsWith("/admin");

              window.location.replace(isInternal ? "/admin" : "/");
            }
          }
        } else if (
          // 2. KASUS FATAL SERVER ERROR (code SOMETHING_WRONG or HTTP 500)
          errorCode === "SOMETHING_WRONG" ||
          response.status === 500
        ) {
          if (!options.suppressToast && typeof window !== "undefined") {
            toast.error(errorMessage || "Terjadi kendala pada sistem. Silakan coba beberapa saat lagi.", {
              id: options.toastId ?? "server-fatal-error-toast",
            });
            isToastFired = true;
          }
        }

        // 3. SEMUA ERROR LAINNYA (Validation 400/422, Business Logic, 404):
        // PASS-THROUGH TANPA TOAST GLOBAL (Biarkan UI / useMutation yang handle toast contextual)
        throw new ApiError(
          errorMessage,
          response.status,
          errorCode,
          errorData,
          isToastFired,
        );
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        throw err;
      }
      if ((err as { name?: string }).name === "AbortError") {
        throw err;
      }

      // Notify application of network/connection drop if actually offline
      if (
        typeof window !== "undefined" &&
        typeof navigator !== "undefined" &&
        !navigator.onLine
      ) {
        window.dispatchEvent(new CustomEvent("app:network-offline"));
      }

      const networkMsg =
        err instanceof Error ? err.message : "Terjadi kesalahan jaringan";

      let isNetworkToastFired = false;
      if (!options.suppressToast && typeof window !== "undefined") {
        toast.error(networkMsg, {
          id: options.toastId ?? "network-error-toast",
        });
        isNetworkToastFired = true;
      }

      throw new ApiError(
        networkMsg,
        0,
        undefined,
        undefined,
        isNetworkToastFired,
      );
    }
  },

  get: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
    apiClient.request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> =>
    apiClient.request<T>(endpoint, { ...options, method: "POST", body }),

  put: <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> =>
    apiClient.request<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> =>
    apiClient.request<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
    apiClient.request<T>(endpoint, { ...options, method: "DELETE" }),
};
