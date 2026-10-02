// src/features/auth/hooks/use-auth-session.ts

import { authService } from "@/features/auth/services/auth.service";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import type { User } from "@/shared/types/common-response.type";
import { useQuery } from "@tanstack/react-query";

export const useAuthSession = () => {
  // Hooks
  const query = useQuery<User | null>({
    queryKey: queryKeys.auth.me(),
    queryFn: ({ signal }) => authService.verifyMe(signal),
    initialData: () => {
      const token = authService.getToken();
      return token ? authService.getCurrentUser() : null;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Derived Values
  const user = query.data ?? null;
  const token = user ? authService.getToken() : null;

  return {
    token,
    user,
    isLoading: query.isLoading,
    isAuthenticated: Boolean(token && user),
  };
};
