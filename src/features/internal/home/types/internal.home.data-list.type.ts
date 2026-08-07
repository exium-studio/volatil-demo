// src/features/internal/home/types/internal.home.data-list.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { IgtBasis } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";

export type InternalHomeDataListProps = StackProps;

export type SyncStatus = "connected" | "disconnected" | "syncing";

export type InternalHomeDataListItem = Record<string, unknown> & {
  id: string;
  layerFileName: string;
  syncStatus: SyncStatus;
  lastSyncTime: string;
  igtBasis: IgtBasis;
  wfsApiLink: string;
  wfsApiCode: string;
};
