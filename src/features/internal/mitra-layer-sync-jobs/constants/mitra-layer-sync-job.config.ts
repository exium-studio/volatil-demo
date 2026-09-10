// src/features/internal/mitra-layer-sync-jobs/constants/mitra-layer-sync-job.config.ts

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import type {
  MitraLayerSyncJobStatus,
  MitraLayerSyncJobStatusConfig,
} from "@/features/internal/mitra-layer-sync-jobs/types/mitra-layer-sync-job.type";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  LoaderIcon,
} from "lucide-react";

export const MITRA_LAYER_SYNC_JOB_STATUS_MAP: Record<
  MitraLayerSyncJobStatus,
  MitraLayerSyncJobStatusConfig
> = {
  queued: {
    label: "Dalam Antrean",
    colorPalette: "blue",
    icon: ClockIcon,
  },
  processing: {
    label: "Sedang Diproses",
    colorPalette: "orange",
    icon: LoaderIcon,
  },
  completed: {
    label: "Selesai",
    colorPalette: "green",
    icon: CheckCircleIcon,
  },
  failed: {
    label: "Gagal",
    colorPalette: "red",
    icon: AlertCircleIcon,
  },
};

export const MITRA_LAYER_SYNC_JOB_STATUS_OPTIONS: FocusSelectOption[] = [
  {
    value: "all",
    label: "Semua Status",
  },
  {
    value: "queued",
    label: "Dalam Antrean",
  },
  {
    value: "processing",
    label: "Sedang Diproses",
  },
  {
    value: "completed",
    label: "Selesai",
  },
  {
    value: "failed",
    label: "Gagal",
  },
];
