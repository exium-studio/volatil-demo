// src/features/mitra/data-request/types/mitra.data-request.draw-aoi.type.ts

import type { TabsContentProps } from "@/design-system/components/disclosure/type/tabs.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { IgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";

export type MitraDataRequestDrawAoiTabsContentProps = TabsContentProps & {
  isActive?: boolean;
};

export type DrawAoiGuideAlertProps = StackProps & {
  isLoading: boolean;
  isDrawing: boolean;
  hasFinishedDraw: boolean;
  isVisible?: boolean;
};

export type DrawAoiDataViewProps = {
  igtItems: IgtDataItem[];
  onResetDraw: () => void;
};

export type DrawAoiAttributeViewProps = {
  aoiCqlFilter: string;
  confirmedPolygon?: GeoJSON.Feature<GeoJSON.Polygon> | null;
  onResetDraw: () => void;
};
