// src/shared/constants/dummy-data/dummy-mitra-layer-sync-jobs.ts

import type {
  MitraLayerSyncJobItem,
  MitraLayerSyncJobsResponse,
} from "@/features/internal/mitra-layer-sync-jobs/types/mitra-layer-sync-job.type";
import { createPaginationMeta } from "@/shared/types/common-response.type";

export const DUMMY_MITRA_LAYER_SYNC_JOBS: MitraLayerSyncJobItem[] = [
  {
    id: "sync_job_001",
    layerId: "testing_workspace:TEST_RTRW_BADUNG",
    layerTitle: "RTRW Badung",
    workspaceName: "testing_workspace",
    typeName: "testing_workspace:TEST_RTRW_BADUNG",
    status: "completed",
    progress: 100,
    totalMitraLayers: 8,
    processedMitraLayers: 8,
    triggeredByUserId: "usr_admin_01",
    triggeredByUserName: "Admin Geospasial",
    createdAt: "2026-09-09T08:15:00Z",
    startedAt: "2026-09-09T08:15:05Z",
    completedAt: "2026-09-09T08:17:22Z",
  },
  {
    id: "sync_job_002",
    layerId: "testing_workspace:TEST_ZNT_BADUNG",
    layerTitle: "ZNT Badung",
    workspaceName: "testing_workspace",
    typeName: "testing_workspace:TEST_ZNT_BADUNG",
    status: "completed",
    progress: 100,
    totalMitraLayers: 14,
    processedMitraLayers: 14,
    triggeredByUserId: "usr_admin_01",
    triggeredByUserName: "Admin Geospasial",
    createdAt: "2026-09-09T14:30:00Z",
    startedAt: "2026-09-09T14:30:04Z",
    completedAt: "2026-09-09T14:33:45Z",
  },
  {
    id: "sync_job_003",
    layerId: "testing_workspace:TEST_BIDANG_TANAH",
    layerTitle: "Bidang Tanah",
    workspaceName: "testing_workspace",
    typeName: "testing_workspace:TEST_BIDANG_TANAH",
    status: "processing",
    progress: 65,
    totalMitraLayers: 20,
    processedMitraLayers: 13,
    triggeredByUserId: "usr_admin_02",
    triggeredByUserName: "Verifikator Spasial",
    createdAt: "2026-09-10T03:40:00Z",
    startedAt: "2026-09-10T03:40:10Z",
  },
  {
    id: "sync_job_004",
    layerId: "testing_workspace:LBS2024_BADUNG",
    layerTitle: "Lahan Baku Sawah (LBS) Badung 2024",
    workspaceName: "testing_workspace",
    typeName: "testing_workspace:LBS2024_BADUNG",
    status: "queued",
    progress: 0,
    totalMitraLayers: 6,
    processedMitraLayers: 0,
    triggeredByUserId: "usr_admin_01",
    triggeredByUserName: "Admin Geospasial",
    createdAt: "2026-09-10T03:52:00Z",
  },
  {
    id: "sync_job_005",
    layerId: "testing_workspace:TEST_LP2B_BADUNG",
    layerTitle: "Lahan Pertanian Pangan Berkelanjutan (LP2B)",
    workspaceName: "testing_workspace",
    typeName: "testing_workspace:TEST_LP2B_BADUNG",
    status: "completed",
    progress: 100,
    totalMitraLayers: 5,
    processedMitraLayers: 5,
    triggeredByUserId: "usr_admin_01",
    triggeredByUserName: "Admin Geospasial",
    createdAt: "2026-09-08T11:20:00Z",
    startedAt: "2026-09-08T11:20:06Z",
    completedAt: "2026-09-08T11:22:15Z",
  },
  {
    id: "sync_job_006",
    layerId: "testing_workspace:TEST_RDTR_KUTA",
    layerTitle: "RDTR Kawasan Strategis Kuta",
    workspaceName: "testing_workspace",
    typeName: "testing_workspace:TEST_RDTR_KUTA",
    status: "completed",
    progress: 100,
    totalMitraLayers: 11,
    processedMitraLayers: 11,
    triggeredByUserId: "usr_admin_02",
    triggeredByUserName: "Verifikator Spasial",
    createdAt: "2026-09-08T09:00:00Z",
    startedAt: "2026-09-08T09:00:05Z",
    completedAt: "2026-09-08T09:03:10Z",
  },
  {
    id: "sync_job_007",
    layerId: "testing_workspace:TEST_RAWAN_BENCANA",
    layerTitle: "Peta Kawasan Rawan Bencana",
    workspaceName: "testing_workspace",
    typeName: "testing_workspace:TEST_RAWAN_BENCANA",
    status: "failed",
    progress: 40,
    totalMitraLayers: 10,
    processedMitraLayers: 4,
    errorMessage: "Koneksi timeout ke dedicated geoserver service mitra ID mit_042",
    triggeredByUserId: "usr_admin_01",
    triggeredByUserName: "Admin Geospasial",
    createdAt: "2026-09-07T16:10:00Z",
    startedAt: "2026-09-07T16:10:08Z",
    completedAt: "2026-09-07T16:12:40Z",
  },
  {
    id: "sync_job_008",
    layerId: "testing_workspace:TEST_KADASTER_MENGWI",
    layerTitle: "Kadaster Pendaftaran Mengwi",
    workspaceName: "testing_workspace",
    typeName: "testing_workspace:TEST_KADASTER_MENGWI",
    status: "completed",
    progress: 100,
    totalMitraLayers: 9,
    processedMitraLayers: 9,
    triggeredByUserId: "usr_admin_01",
    triggeredByUserName: "Admin Geospasial",
    createdAt: "2026-09-07T10:00:00Z",
    startedAt: "2026-09-07T10:00:05Z",
    completedAt: "2026-09-07T10:02:50Z",
  },
  {
    id: "sync_job_009",
    layerId: "testing_workspace:TEST_SEMPADAN_PANTAI",
    layerTitle: "Garis Sempadan Pantai Selatan",
    workspaceName: "testing_workspace",
    typeName: "testing_workspace:TEST_SEMPADAN_PANTAI",
    status: "completed",
    progress: 100,
    totalMitraLayers: 7,
    processedMitraLayers: 7,
    triggeredByUserId: "usr_admin_02",
    triggeredByUserName: "Verifikator Spasial",
    createdAt: "2026-09-06T13:45:00Z",
    startedAt: "2026-09-06T13:45:07Z",
    completedAt: "2026-09-06T13:47:30Z",
  },
  {
    id: "sync_job_010",
    layerId: "testing_workspace:TEST_PENGGUNAAN_TANAH",
    layerTitle: "Peta Penggunaan Tanah Eksisting",
    workspaceName: "testing_workspace",
    typeName: "testing_workspace:TEST_PENGGUNAAN_TANAH",
    status: "completed",
    progress: 100,
    totalMitraLayers: 12,
    processedMitraLayers: 12,
    triggeredByUserId: "usr_admin_01",
    triggeredByUserName: "Admin Geospasial",
    createdAt: "2026-09-06T08:30:00Z",
    startedAt: "2026-09-06T08:30:05Z",
    completedAt: "2026-09-06T08:34:12Z",
  },
];

export const createDummyMitraLayerSyncJobsResponse = (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}): MitraLayerSyncJobsResponse => {
  let filtered = [...DUMMY_MITRA_LAYER_SYNC_JOBS];

  if (params?.status && params.status !== "all") {
    filtered = filtered.filter((j) => j.status === params.status);
  }

  if (params?.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (j) =>
        j.layerTitle.toLowerCase().includes(q) ||
        j.id.toLowerCase().includes(q) ||
        j.typeName.toLowerCase().includes(q),
    );
  }

  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const startIndex = (page - 1) * pageSize;
  const pagedItems = filtered.slice(startIndex, startIndex + pageSize);

  return {
    items: pagedItems,
    pagination: createPaginationMeta(page, pageSize, filtered.length),
  };
};
