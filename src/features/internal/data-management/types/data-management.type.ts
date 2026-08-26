// src/features/internal/data-management/types/data-management.type.ts

import type { PaginatedParams, PaginationMeta } from "@/shared/types/common-response.type";

export type SpatialBasisType = "bidang" | "kawasan";

export type MasterIgtLayerItem = {
  id: string;
  title: string;
  description?: string;
  spatialBasis: SpatialBasisType;
  bbox: [number, number, number, number];
  isActive: boolean;
  wfs: {
    wfsUrl: string;
    wfsTypeName: string;
  };
  wms: {
    wmsUrl: string;
    layers: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type MasterIgtLayersQueryParams = PaginatedParams & {
  spatialBasis?: SpatialBasisType;
  isActive?: boolean;
};

export type MasterIgtLayersResponse = {
  items: MasterIgtLayerItem[];
  pagination: PaginationMeta;
};

export type CreateMasterIgtLayerPayload = {
  id: string;
  title: string;
  description?: string;
  spatialBasis: SpatialBasisType;
  bbox: [number, number, number, number];
  isActive: boolean;
  wfs: {
    wfsUrl: string;
    wfsTypeName: string;
  };
  wms: {
    wmsUrl: string;
    layers: string;
  };
};

export type UpdateMasterIgtLayerPayload = Partial<CreateMasterIgtLayerPayload> & {
  id: string;
};
