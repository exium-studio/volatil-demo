// src/features/internal/home/types/internal.home.data-list.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { MitraDataRequestIgtBasis } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";

export type InternalHomeIgtDataListProps = StackProps;

export type InternalHomeSyncStatus = "connected" | "disconnected" | "syncing";

export type InternalHomeIgtDataViewItem = Record<string, unknown> & {
  id: string;
  layerFileName: string;
  syncStatus: InternalHomeSyncStatus;
  lastSyncTime: string;
  igtBasis: MitraDataRequestIgtBasis;
  wfsApiLink: string;
  wfsApiCode: string;
};

// Aliases for compatibility
export type SyncStatus = InternalHomeSyncStatus;
