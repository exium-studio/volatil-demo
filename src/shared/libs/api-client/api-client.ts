// src/shared/libs/api-client/api-client.ts

import { ApiError } from "@/shared/libs/api-client/api-error";
import { back } from "@/shared/utils/client/navigation";

export type RequestOptions = Omit<RequestInit, "body"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  params?: Record<string, string | number | boolean | undefined>;
};

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
};

export const apiClient = {
  request: async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
    const { body, params, headers: customHeaders, ...restOptions } = options;

    let url = endpoint;
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
        if (response.status === 401) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token");
            back();
          }
        }

        let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
        let errorData: Record<string, string[]> | undefined = undefined;

        try {
          const jsonError = await response.json();
          if (jsonError.message) errorMessage = jsonError.message;
          if (jsonError.errors) errorData = jsonError.errors;
        } catch {
          // Fallback if response is not JSON
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

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    apiClient.request<T>(endpoint, { ...options, method: "POST", body }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    apiClient.request<T>(endpoint, { ...options, method: "PUT", body }),

  delete: <T>(endpoint: string, options?: RequestOptions): Promise<T> =>
    apiClient.request<T>(endpoint, { ...options, method: "DELETE" }),
};
