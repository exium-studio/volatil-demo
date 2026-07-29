// src/shared/constants/dummy-data.ts

import type { HomeDataSummaryResponse } from "@/features/home/types/home.data-summary.type";

export const homeDataSummary: HomeDataSummaryResponse = {
  field: {
    active: 12000,
    almostExpired: 4000,
    expired: 2000,
  },
  area: {
    active: 8500,
    almostExpired: 3000,
    expired: 1500,
  },
};
