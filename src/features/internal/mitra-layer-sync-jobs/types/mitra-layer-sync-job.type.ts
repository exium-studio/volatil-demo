// src/features/internal/mitra-layer-sync-jobs/types/mitra-layer-sync-job.type.ts

import type {
  PaginatedParams,
  PaginationMeta,
} from "@/shared/types/common-response.type";
import type { ComponentType } from "react";

export type MitraLayerSyncJobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export type MitraLayerSyncJobStatusConfig = {
  label: string;
  colorPalette: "blue" | "orange" | "green" | "red";
  icon: ComponentType<{ className?: string; size?: string | number }>;
};

export type MitraLayerSyncJobItem = {
  id: string;
  layerId: string;
  layerTitle: string;
  workspaceName: string;
  typeName: string;
  status: MitraLayerSyncJobStatus;
  progress: number; // 0 - 100
  totalMitraLayers: number;
  processedMitraLayers: number;
  triggeredByUserId: string;
  triggeredByUserName: string;
  errorMessage?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
};

export type MitraLayerSyncJobsQueryParams = PaginatedParams & {
  status?: MitraLayerSyncJobStatus;
};

export type MitraLayerSyncJobsResponse = {
  items: MitraLayerSyncJobItem[];
  pagination: PaginationMeta;
};

export type TriggerMitraLayerSyncPayload = {
  layerId: string;
};

export type TriggerMitraLayerSyncResponse = {
  jobId: string;
  layerId: string;
  status: MitraLayerSyncJobStatus;
  message: string;
  createdAt: string;
};

export type MitraLayerSyncJobStreamEvent =
  | {
      event: "job_created" | "job_started" | "job_progress" | "job_completed" | "job_failed";
      data: MitraLayerSyncJobItem;
    }
  | {
      event: "connected" | "ping";
      data: { timestamp: string };
    };

export type MitraLayerSyncJobDataViewProps = {
  initialLimit?: number;
  showPagination?: boolean;
  showFilters?: boolean;
  roundedTop?: number | string;
};

