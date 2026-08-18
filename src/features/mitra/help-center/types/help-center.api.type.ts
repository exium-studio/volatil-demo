// src/features/mitra/help-center/types/help-center.api.type.ts

import type {
  HelpCenterItem,
  HelpCenterPagination,
  HelpCenterResponse,
  HelpCenterStatistics,
} from "@/features/mitra/help-center/types/help-center.type";

export type HelpCenterListApiResponse = {
  success: boolean;
  data: HelpCenterItem[];
  pagination: HelpCenterPagination;
};

export type HelpCenterStatisticsApiResponse = {
  success: boolean;
  data: HelpCenterStatistics;
};

export type HelpCenterDetailApiResponse = {
  success: boolean;
  data: HelpCenterItem;
};

export type CreateHelpCenterApiResponse = {
  success: boolean;
  message?: string;
  data: HelpCenterItem;
};

export type ReplyHelpCenterApiResponse = {
  success: boolean;
  message?: string;
  data: {
    response: HelpCenterResponse;
    ticket: HelpCenterItem;
  };
};
