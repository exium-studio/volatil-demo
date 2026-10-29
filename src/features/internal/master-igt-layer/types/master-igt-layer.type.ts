// src/features/internal/master-igt-layer/types/master-igt-layer.type.ts

import type {
  PaginatedParams,
  PaginationMeta,
} from "@/shared/types/common-response.type";

export type IgtBasisType = "bidang" | "kawasan";

export type PublishStatusType = "all" | "published" | "draft";

export type MasterIgtLayerSearch = {
  basisIgt?: IgtBasisType;
  isActive?: string | number | boolean;
};

// Deprecated alias for backwards compatibility
export type MasterIgtDataManagementSearch = MasterIgtLayerSearch;

export type PublishStatusTypeConfig = {
  value: PublishStatusType;
  label: string;
  colorPalette: "gray" | "green";
};

export type MasterIgtLayerServiceConfig = {
  url: string;
  baseUrl: string;
};

export type MasterIgtLayerAttributeConfig = {
  attribute: string;
  visible: boolean;
  dataType?: string;
};

export type MasterIgtLayerItem = {
  id: string;
  title: string;
  description?: string;
  igtBasis: IgtBasisType;
  bbox?: [number, number, number, number];
  isActive: boolean;
  defaultVisible?: boolean;
  zIndex?: number;
  minZoom?: number;
  geoserverId: string;
  geoserver: {
    id: string;
    name: string;
    baseUrl: string;
  };
  workspaceName: string;
  layerName: string | null;
  typeName: string; // Not null: either "workspace:layer" or "workspace"
  wms: MasterIgtLayerServiceConfig;
  wfs: MasterIgtLayerServiceConfig;
  attributes?: MasterIgtLayerAttributeConfig[];
  createdAt: string;
  updatedAt: string;
};

export type MasterIgtLayersQueryParams = PaginatedParams & {
  igtBasis?: IgtBasisType;
  isActive?: boolean;
};

export type MasterIgtLayersResponse = {
  items: MasterIgtLayerItem[];
  pagination: PaginationMeta;
};

export type CreateMasterIgtLayerPayload = {
  geoserverId: string;
  workspaceName: string;
  layerName?: string | null;
  typeName: string;
  title: string;
  description?: string;
  igtBasis: IgtBasisType;
  isActive: boolean;
  defaultVisible?: boolean;
  zIndex?: number;
  minZoom?: number;
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
  igtBasis?: IgtBasisType;
  spatialBasis?: IgtBasisType;
  bbox?: [number, number, number, number];
};

export type GeoServerWorkspaceLayersResponse = {
  layers: GeoServerWorkspaceLayerOption[];
};

import { masterIgtLayerFormSchema } from "@/features/internal/master-igt-layer/types/master-igt-layer.schema";
import type { ReactNode } from "react";
import type { z } from "zod";
export type MasterIgtLayerFormValues = z.infer<typeof masterIgtLayerFormSchema>;

export type GeoserverCascadeSelectProps = {
  parentModalKey: string;
  selectedGeoserverId: string;
  onGeoserverChange: (geoserverId: string) => void;
  selectedWorkspace: string;
  onWorkspaceChange: (workspace: string) => void;
  selectedLayerName?: string | null;
  selectedTypeName?: string;
  onLayerChange: (
    layerName: string | null,
    typeName: string,
    layerDetail?: GeoServerWorkspaceLayerOption,
  ) => void;
  errors?: {
    geoserverId?: { message?: string };
    workspaceName?: { message?: string };
    workspace?: { message?: string };
    layerName?: { message?: string };
    typeName?: { message?: string };
  };
};

export type InternalMasterIgtLayerCreateTriggerProps = {
  modalKey?: string;
  children?: ReactNode;
};

export type InternalMasterIgtLayerCreateModalContentProps = {
  modalKey: string;
  close: () => void;
};

export type InternalMasterIgtLayerEditTriggerProps = {
  modalKey?: string;
  item: MasterIgtLayerItem;
  children?: ReactNode;
};

export type InternalMasterIgtLayerEditModalContentProps = {
  modalKey: string;
  item: MasterIgtLayerItem;
  close: () => void;
};

export type MasterIgtLayerDetailSearch = {
  tab?: "config" | "attribute";
};

export type InternalMasterIgtLayerConfigFormProps = {
  item: MasterIgtLayerItem;
  onSuccess?: () => void;
};

export type UpdateMasterIgtLayerAttributesPayload = {
  id: string;
  attributes: MasterIgtLayerAttributeConfig[];
};

export type InternalMasterIgtLayerAttributeListProps = {
  item: MasterIgtLayerItem;
  onSuccess?: () => void;
};

// Aliases for compatibility
export type InternalDataManagementCreateTriggerProps = InternalMasterIgtLayerCreateTriggerProps;
export type InternalDataManagementCreateModalContentProps = InternalMasterIgtLayerCreateModalContentProps;
export type InternalDataManagementEditTriggerProps = InternalMasterIgtLayerEditTriggerProps;
export type InternalDataManagementEditModalContentProps = InternalMasterIgtLayerEditModalContentProps;
export type InternalDataManagementConfigFormProps = InternalMasterIgtLayerConfigFormProps;
export type InternalDataManagementAttributeListProps = InternalMasterIgtLayerAttributeListProps;

