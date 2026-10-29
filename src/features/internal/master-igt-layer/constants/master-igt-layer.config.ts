// src/features/internal/master-igt-layer/constants/master-igt-layer.config.ts

import type { PublishStatusType, PublishStatusTypeConfig } from "@/features/internal/master-igt-layer/types/master-igt-layer.type";

/**
 * SSOT Configuration Map for Master IGT Layer Publish Status
 */
export const PUBLISH_STATUS_CONFIG_MAP: Record<
  PublishStatusType,
  PublishStatusTypeConfig
> = {
  all: {
    value: "all",
    label: "Semua Status",
    colorPalette: "gray",
  },
  published: {
    value: "published",
    label: "Publik",
    colorPalette: "green",
  },
  draft: {
    value: "draft",
    label: "Draft",
    colorPalette: "gray",
  },
};

/**
 * Array options derived from SSOT Map for select inputs
 */
export const PUBLISH_STATUS_OPTIONS = Object.values(PUBLISH_STATUS_CONFIG_MAP);
