// src/features/auth/services/auth-guard.service.ts

import { authService } from "@/features/auth/services/auth.service";
import type { User, UserRole } from "@/shared/types/common-response.type";
import { queryClient } from "@/shared/libs/tanstack-query/query.client";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { redirect } from "@tanstack/react-router";

/**
 * Ensures the user session is authenticated via /api/auth/me query.
 * Falls back to local cached storage if network error occurs.
 */
export const ensureAuthenticatedUser = async (): Promise<User> => {
  const token = authService.getToken();
  if (!token) {
    throw redirect({
      to: "/",
    });
  }

  try {
    const user = await queryClient.fetchQuery({
      queryKey: queryKeys.auth.me(),
      queryFn: ({ signal }) => authService.verifyMe(signal),
      staleTime: 30 * 1000,
    });

    if (!user) {
      throw redirect({
        to: "/",
      });
    }

    return user;
  } catch (error) {
    // If it's already a TanStack router redirect, re-throw it
    if (error && typeof error === "object" && "isRedirect" in error) {
      throw error;
    }

    const fallbackUser = authService.getCurrentUser();
    if (fallbackUser) {
      return fallbackUser;
    }

    throw redirect({
      to: "/",
    });
  }
};

/**
 * Route guard helper for TanStack Router `beforeLoad`.
 * Enforces role isolation between 'internal' and 'mitra'.
 */
export const requireRoleGuard = async (requiredRole: UserRole): Promise<{ user: User }> => {
  const user = await ensureAuthenticatedUser();

  if (user.role !== requiredRole) {
    if (user.role === "internal") {
      throw redirect({
        to: "/internal/welcome",
      });
    } else {
      throw redirect({
        to: "/mitra/welcome",
      });
    }
  }

  return { user };
};

/**
 * Route guard helper for shared routes accessible by any authenticated role (internal or mitra).
 */
export const requireAuthenticatedGuard = async (): Promise<{ user: User }> => {
  const user = await ensureAuthenticatedUser();
  return { user };
};

/**
 * Route guard helper for Public login routes (e.g. `/` for mitra, `/admin` for internal).
 * Redirects already logged-in users to their respective home/welcome domain.
 */
export const redirectIfAuthenticated = async (): Promise<void> => {
  const token = authService.getToken();
  if (!token) return;

  const user = authService.getCurrentUser();
  if (user) {
    if (user.role === "internal") {
      throw redirect({
        to: "/internal/welcome",
      });
    } else {
      throw redirect({
        to: "/mitra/welcome",
      });
    }
  }
};
