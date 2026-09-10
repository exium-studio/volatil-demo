// src/features/auth/hooks/use-auth-session.ts

import { authService } from "@/features/auth/services/auth.service";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import type { User } from "@/shared/types/common-response.type";
import { useQuery } from "@tanstack/react-query";

export const useAuthSession = () => {
  const token = authService.getToken();
  const cachedUser = authService.getCurrentUser();

  const query = useQuery<User | null>({
    queryKey: queryKeys.auth.me(),
    queryFn: ({ signal }) => authService.verifyMe(signal),
    initialData: cachedUser,
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
  });

  return {
    token,
    user: query.data ?? cachedUser,
    isLoading: query.isLoading,
    isAuthenticated: Boolean(token && (query.data ?? cachedUser)),
  };
};
