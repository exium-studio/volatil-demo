// src/features/auth/hooks/use-sso-status.query.ts

import { fetchPublicSsoStatusApi } from "@/features/auth/api/auth.api";
import type { PublicSsoStatus } from "@/features/auth/types/sso.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_OFF_SSO_STATUS: PublicSsoStatus = {
  mitra: {
    isEnabled: false,
  },
  internal: {
    isEnabled: false,
  },
};

export const usePublicSsoStatusQuery = () => {
  return useQuery<PublicSsoStatus, Error>({
    queryKey: queryKeys.auth.ssoStatus(),
    queryFn: async ({ signal }) => {
      try {
        const res = await fetchPublicSsoStatusApi(signal);
        return res.data;
      } catch {
        if (isDummyDataEnabled()) {
          return {
            mitra: { isEnabled: true },
            internal: { isEnabled: true },
          };
        }
        return DEFAULT_OFF_SSO_STATUS;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
