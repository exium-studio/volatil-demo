// src/features/mitra/my-data/types/my-data.type.ts

import type { BoxProps } from "@/design-system/components/layout/types/box.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { PaginatedResponse } from "@/shared/types/common-response.type";
import type { OrderStatus } from "@/shared/types/status.type";

export type { OrderStatus };
export type MyDataSpatialBasis = "bidang" | "kawasan";

export type MaskedSecretFieldProps = BoxProps & {
  value: string;
  defaultVisible?: boolean;
};

export type MyDataServiceConfig = {
  url: string;
  baseUrl: string;
};

export type MyDataItem = {
  id: string;
  label: string | null;
  title: string;
  igtBasis?: MyDataSpatialBasis;
  spatialBasis: MyDataSpatialBasis;
  wms?: MyDataServiceConfig;
  wfs?: MyDataServiceConfig;
  wfsUrl: string | null;
  wmsUrl: string | null;
  externalWfsUrl?: string | null;
  externalWmsUrl?: string | null;
  wfsTypeName?: string;
  wmsLayers?: string;
  status: OrderStatus;
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
  status: OrderStatus;
  wms?: MyDataServiceConfig;
  wfs?: MyDataServiceConfig;
  wmsUrl: string | null;
  wfsUrl?: string | null;
  qgisWmsUrl?: string | null;
  qgisWfsUrl?: string | null;
  apiKey?: string | null;
  bbox?: [number, number, number, number];
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
  status?: OrderStatus;
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
  status?: OrderStatus;
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

export type RenewWorkspacePayload = {
  durationMonths?: number;
  paymentMethod?: string;
};

export type RenewWorkspaceResponse = {
  orderId: string;
  orderNumber: string;
  billingCode: string;
  totalAmount: number;
  expiresAt: string;
  extendedUntil: string;
  status: "pending_payment" | "paid";
};

export type MitraWorkspaceRenewalTriggerProps = {
  workspace: MitraWorkspaceItem;
  children?: React.ReactNode;
  modalKey?: string;
};

export type MitraWorkspaceRenewalModalContentProps = {
  workspace: MitraWorkspaceItem;
  close: () => void;
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



