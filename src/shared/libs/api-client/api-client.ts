import { router } from "@/app/router";
import { toast } from "@/design-system/components/toast";
import { ApiError } from "@/shared/libs/api-client/api-error";
import type { RequestOptions } from "@/shared/types/api-client.type";

<<<<<<< HEAD
export type { RequestOptions };
=======
import type { RequestOptions } from "@/shared/types/api-client.type";
>>>>>>> fd4996e3 (refactor: overhaul design system toast architecture, introduce shared utility types, and refine component interfaces across features)

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

        const isAuthEndpoint =
          endpoint.includes("/auth/me") || endpoint.includes("/auth/verify");

        if (response.status === 401 || (response.status === 403 && isAuthEndpoint)) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
            sessionStorage.removeItem("user");

            // If we are on private pages or not already on login root, navigate to root
            const isPublicPage =
              window.location.pathname === "/" ||
              window.location.pathname === "/admin";
            if (!isPublicPage) {
              toast.error(
                response.status === 401
                  ? "Sesi Anda telah berakhir"
                  : "Akses Akun Ditolak",
                {
                  id: "auth-session-expired-toast",
                  group: "Sistem",
                  description:
                    errorMessage ||
                    "Akun Anda tidak memiliki akses atau telah dinonaktifkan.",
                },
              );

              void router.navigate({ to: "/" });
            }
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
      throw new ApiError(
        err instanceof Error ? err.message : "Terjadi kesalahan jaringan",
        0,
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
