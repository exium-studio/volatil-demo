// src/features/mitra/billing/hooks/use-simponi-status.query.ts

import { fetchPublicSimponiStatusApi } from "@/features/mitra/billing/api/simponi-status.api";
import type { PublicSimponiStatus } from "@/features/mitra/billing/types/simponi-status.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_OFF_SIMPONI_STATUS: PublicSimponiStatus = {
  isEnabled: false,
};

export const usePublicSimponiStatusQuery = () => {
  return useQuery<PublicSimponiStatus, Error>({
    queryKey: queryKeys.mitra.billing.simponiStatus(),
    queryFn: async ({ signal }) => {
      try {
        const res = await fetchPublicSimponiStatusApi(signal);
        return res.data;
      } catch {
        if (isDummyDataEnabled()) {
          return {
            isEnabled: true,
          };
        }
        return DEFAULT_OFF_SIMPONI_STATUS;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
