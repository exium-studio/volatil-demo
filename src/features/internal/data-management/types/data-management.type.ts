// src/features/internal/data-management/types/data-management.type.ts

import type {
  PaginatedParams,
  PaginationMeta,
} from "@/shared/types/common-response.type";

export type IgtBasisType = "bidang" | "kawasan";
/** @deprecated alias for IgtBasisType */
export type SpatialBasisType = IgtBasisType;

export type PublishStatusType = "all" | "published" | "draft";

export type PublishStatusTypeConfig = {
  value: PublishStatusType;
  label: string;
  colorPalette: "gray" | "green";
};

export type MasterIgtLayerItem = {
  id: string;
  title: string;
  description?: string;
  spatialBasis: SpatialBasisType;
  bbox?: [number, number, number, number];
  isActive: boolean;
  zIndex?: number;
  geoserverId: string;
  geoserver: {
    id: string;
    name: string;
    baseUrl: string;
  };
  workspaceName: string;
  typeName: string; // format: workspace:layerName
  wfsUrl: string;
  wmsUrl: string;
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
  id?: string;
  geoserverId: string;
  typeName: string;
  title: string;
  description?: string;
  spatialBasis: SpatialBasisType;
  isActive: boolean;
  zIndex?: number;
};

export type UpdateMasterIgtLayerPayload =
  Partial<CreateMasterIgtLayerPayload> & {
    id: string;
  };

export type GeoServerWorkspacesResponse = {
  workspaces: string[];
};

export type GeoServerWorkspaceLayerOption = {
  name: string;
  title: string;
  typeName: string;
  abstract?: string;
  srs?: string;
  geometryType?: "Polygon" | "MultiPolygon" | "Point" | "LineString";
  spatialBasis?: SpatialBasisType;
  bbox?: [number, number, number, number];
};

export type GeoServerWorkspaceLayersResponse = {
  layers: GeoServerWorkspaceLayerOption[];
};

import { masterIgtLayerFormSchema } from "@/features/internal/data-management/types/data-management.schema";
import type { z } from "zod";
export type MasterIgtLayerFormValues = z.infer<typeof masterIgtLayerFormSchema>;
