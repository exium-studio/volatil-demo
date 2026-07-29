// src/shared/constants/dummy-data.ts

import type { HomeDataResponse } from "@/features/home/types/home.data-summary.type";

export const homeData: HomeDataResponse = {
  dataSummary: {
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
  },
  cartSummary: {
    totalField: 150,
    totalArea: 45,
    totalIgtData: 195,
    subtotalPrice: 15000000,
  },
};
