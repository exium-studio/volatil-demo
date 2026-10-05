// src/features/user-guide/types/user-guide.api.type.ts

import type { UserGuideItem } from "@/features/user-guide/types/user-guide.type";

export type UserGuideListApiResponse = {
  success: boolean;
  message?: string;
  data: UserGuideItem[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type UserGuideDetailApiResponse = {
  success: boolean;
  message?: string;
  data: UserGuideItem;
};

export type UserGuideMutationApiResponse = {
  success: boolean;
  message: string;
  data?: UserGuideItem;
};
