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
        let errorData: Record<string, string[]> | undefined = undefined;

        try {
          const jsonError = await response.json();
          if (jsonError.message) errorMessage = jsonError.message;
          if (jsonError.errors) errorData = jsonError.errors;
        } catch {
          // Fallback if response is not JSON
        }

        const isAuthLoginEndpoint =
          endpoint.includes("/api/auth/login") ||
          endpoint.includes("/api/auth/sso/internal/callback") ||
          endpoint.includes("/api/auth/login/totp-verify");

        if (response.status === 401 || response.status === 403) {
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
                response.status === 401
                  ? t["error.unauthorized"]()
                  : t["error.forbidden"]();

              toast.error(toastTitle, {
                id: "auth-session-expired-toast",
                group: t["common.system"](),
                description:
                  errorMessage ||
                  (response.status === 401
                    ? t["error.unauthorized"]()
                    : t["error.forbidden"]()),
              });

              const isInternal =
                window.location.pathname.startsWith("/internal") ||
                window.location.pathname.startsWith("/admin");

              window.location.replace(isInternal ? "/admin" : "/");
            }
          }
        } else {
          // Fire error toast for all other non-OK responses (400, 422, 500, etc.)
          if (!options.suppressToast && typeof window !== "undefined") {
            let detailDescription: string | undefined = undefined;
            if (errorData && typeof errorData === "object") {
              const errorEntries = Object.entries(errorData);
              if (errorEntries.length > 0) {
                const messages = errorEntries
                  .flatMap(([field, msgs]) =>
                    Array.isArray(msgs)
                      ? msgs.map((m) =>
                          field !== "file" && field !== "general"
                            ? `${field}: ${m}`
                            : m,
                        )
                      : [String(msgs)],
                  )
                  .filter(Boolean);
                if (messages.length > 0) {
                  detailDescription = messages.join(", ");
                }
              }
            }

            if (detailDescription && detailDescription === errorMessage) {
              detailDescription = undefined;
            }

            toast.error(errorMessage, {
              id: options.toastId,
              description: detailDescription,
            });
          }
        }

        throw new ApiError(errorMessage, response.status, errorData);
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

      if (!options.suppressToast && typeof window !== "undefined") {
        toast.error(networkMsg, {
          id: options.toastId ?? "network-error-toast",
        });
      }

      throw new ApiError(networkMsg, 0);
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
