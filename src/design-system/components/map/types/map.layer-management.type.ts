import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { FlyToIgtLayerOptions } from "@/features/mitra/data-request/types/fly-to-layer.type";
import type React from "react";

export type GenericMapLayer = {
  id: string;
  title: string;
  spatialBasis?: "bidang" | "kawasan";
  igtBasis?: "bidang" | "kawasan";
  bbox?: [number, number, number, number];
  zIndex?: number;
  wfs?: {
    wfsTypeName?: string;
    wfsUrl?: string | null;
  };
  [key: string]: unknown;
};

export type MapLayerManagementItemProps<T extends GenericMapLayer = GenericMapLayer> = Omit<
  StackProps,
  "onToggle"
> & {
  layer: T;
  index: number;
  isEnabled: boolean;
  opacity: number;
  isSymbologyEnabled?: boolean;
  showSymbology?: boolean;
  onToggle: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  onToggleSymbology?: (id: string) => void;
  onReorder: (sourceIndex: number, targetIndex: number) => void;
  onFlyTo?: (layer: T, options?: FlyToIgtLayerOptions) => void;
};

export type MapLayerManagementTriggerRenderProps = {
  enabledCount: number;
  isOpen?: boolean;
};

export type MapLayerManagementPanelProps<T extends GenericMapLayer = GenericMapLayer> = {
  title: string;
  tooltipContent?: string;
  badgeLabel?: string;
  emptyLabel?: string;
  loadingLabel?: string;
  errorTitle?: string;
  errorMessage?: string;
  layers: T[];
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  onRetry?: () => void;
  showSymbology?: boolean;
  onToggleLayer?: (layer: T, nextChecked: boolean) => void;
  onFlyToLayer?: (layer: T) => void;
  children?:
    | React.ReactNode
    | ((props: MapLayerManagementTriggerRenderProps) => React.ReactNode);
};

export type MapMasterIgtLayerManagementProps = {
  children?:
    | React.ReactNode
    | ((props: MapLayerManagementTriggerRenderProps) => React.ReactNode);
};

export type MapWorkspaceLayerManagementProps = {
  children?:
    | React.ReactNode
    | ((props: MapLayerManagementTriggerRenderProps) => React.ReactNode);
};
