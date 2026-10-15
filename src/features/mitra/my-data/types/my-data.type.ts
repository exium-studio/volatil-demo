// src/features/mitra/my-data/types/my-data.type.ts

import type { BoxProps } from "@/design-system/components/layout/types/box.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { SelectionType } from "@/features/mitra/cart/types/mitra.cart.order.type";
import type { PaginatedResponse } from "@/shared/types/common-response.type";
import type { OrderStatus } from "@/shared/types/status.type";
import type GeoJSON from "geojson";

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
  sourceLayerId?: string;
  sourceLayerTitle?: string;
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
  featuresCount?: number | null;
  areaHa?: number | null;
  invoiceUrl?: string | null;
  tteInvoiceUrl?: string | null;
  tte?: boolean;
  apiKey?: string | null;
  zIndex?: number;
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
  extensionCount?: number;
  invoiceUrl?: string | null;
  tteInvoiceUrl?: string | null;
  tte?: boolean;
  aoiPolygon?:
    | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
    | GeoJSON.Polygon
    | GeoJSON.MultiPolygon
    | null;
  selectionType?: SelectionType | string | null;
  kawasanCoverageHa?: number | null;
  bidangCoverageCount?: number | null;
  canRenew?: boolean;
  renewalEligibility?: RenewalEligibilityInfo | null;
};

export type WorkspaceActiveStatus = "all" | "active" | "almost_expired" | "expired";

export type MitraWorkspaceQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  status?: OrderStatus;
  activeStatus?: WorkspaceActiveStatus;
};

export type MitraWorkspaceListResponse = PaginatedResponse<MitraWorkspaceItem> & {
  apiKey?: string | null;
  workspaceUrl?: WorkspaceUrlInfo | null;
};

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

export type MitraMyDataSearch = {
  activeStatus?: WorkspaceActiveStatus;
};

export type MitraMyDataWorkspaceDetailSearch = {
  layerId?: string;
  apiKey?: string;
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
  paymentMethod?: string;
};

export type RenewWorkspacePolicySnapshot = {
  accessDays: number;
  maxExtensionCount: number;
  extensionWindowDays: number;
  currentExtensionIndex: number;
};

export type RenewWorkspaceResponse = {
  workspaceId: string;
  orderId: string;
  orderNumber: string;
  billingCode: string;
  totalAmount: number;
  expiresAt: string;
  expiredAt?: string;
  extendedUntil: string;
  status: "pending_payment" | "paid";
  policySnapshot?: RenewWorkspacePolicySnapshot;
};

export type MitraWorkspaceRenewalTriggerProps = {
  workspace: MitraWorkspaceItem;
  children?: React.ReactNode;
  renderTrigger?: (params: {
    eligibility: ExtensionEligibility;
    open: () => void;
    isOpen: boolean;
  }) => React.ReactNode;
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
export type RenewalEligibilityInfo = {
  canRenew: boolean;
  reason?: string | null;
  daysRemaining?: number;
  extensionWindowDays?: number;
  isInWindow?: boolean;
  currentExtensions?: number;
  maxAllowedExtensions?: number;
  isExtensionLimitReached?: boolean;
};

export type ExtensionEligibility = {
  canExtend: boolean;
  daysRemaining: number;
  reason?: string;
  extensionWindowDays?: number;
  isInWindow?: boolean;
  currentExtensions?: number;
  maxAllowedExtensions?: number;
  isExtensionLimitReached?: boolean;
};
