// src/features/mitra/my-data/types/my-data.type.ts

import type { BoxProps } from "@/design-system/components/layout/types/box.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { PaginatedResponse } from "@/shared/types/common-response.type";
import type { MyDataStatus } from "@/shared/types/status.type";

export type { MyDataStatus };
export type MyDataSpatialBasis = "bidang" | "kawasan";

export type MaskedSecretFieldProps = BoxProps & {
  value: string;
  defaultVisible?: boolean;
};

export type MyDataItem = {
  id: string;
  label: string | null;
  title: string;
  spatialBasis: MyDataSpatialBasis;
  wfsUrl: string | null;
  wmsUrl: string | null;
  externalWfsUrl?: string | null;
  externalWmsUrl?: string | null;
  wfsTypeName?: string;
  wmsLayers?: string;
  status: MyDataStatus;
  expiresAt: string;
  bbox?: [number, number, number, number];
  invoiceUrl?: string | null;
  tteInvoiceUrl?: string | null;
  tte?: boolean;
};

export type MitraWorkspaceItem = {
  id: string;
  workspaceName: string;
  orderId: string;
  orderNumber?: string;
  transactionNumber?: string;
  userId?: number | string;
  status: MyDataStatus;
  wmsUrl: string | null;
  wfsUrl?: string | null;
  qgisWmsUrl?: string | null;
  qgisWfsUrl?: string | null;
  apiKey?: string | null;
  layersCount: number;
  layers: MyDataItem[];
  createdAt: string;
  expiresAt: string;
  invoiceUrl?: string | null;
  tteInvoiceUrl?: string | null;
  tte?: boolean;
};

export type MitraWorkspaceQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  status?: MyDataStatus;
};

export type MitraWorkspaceListResponse = PaginatedResponse<MitraWorkspaceItem>;

export type WorkspaceUrlInfo = {
  workspaceName: string;
  wmsUrl: string;
  wfsUrl: string;
  qgisWmsUrl: string;
  qgisWfsUrl: string;
  note?: string;
};

export type MyDataQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  basis?: MyDataSpatialBasis;
  status?: MyDataStatus;
};

export type MyDataResponse = PaginatedResponse<MyDataItem> & {
  apiKey?: string | null;
  workspaceUrl?: WorkspaceUrlInfo | null;
};

export type MitraMyDataViewProps = StackProps;

export type MitraMyDataWorkspaceDetailSearch = {
  layerId?: string;
};

export type MyDataDetailAttributeListProps = {
  item: MyDataItem;
  onBack: () => void;
};

export type UpdateMyDataItemPayload = {
  label: string | null;
};

export type MitraMyDataWorkspaceTriggerProps = {
  workspaceUrl?: WorkspaceUrlInfo | null;
  apiKey?: string | null;
  children?: React.ReactNode;
  modalKey?: string;
};

export type MitraMyDataWorkspaceModalContentProps = {
  workspaceUrl: WorkspaceUrlInfo;
  apiKey?: string | null;
  close: () => void;
};

export type MitraMyDataWorkspaceTabsContentProps = {
  isActive?: boolean;
};

export type MitraMyDataEditTriggerProps = {
  item: MyDataItem;
  children?: React.ReactNode;
  modalKey?: string;
};

export type MitraMyDataEditModalContentProps = {
  item: MyDataItem;
  close: () => void;
};


