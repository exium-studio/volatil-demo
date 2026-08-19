// src/features/mitra/data-request/types/mitra.data-request.draw-aoi.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { IgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";

export type DrawAoiGuideAlertProps = StackProps & {
  isLoading: boolean;
  isDrawing: boolean;
  hasFinishedDraw: boolean;
  isVisible?: boolean;
};

export type DrawAoiDataListProps = {
  igtItems: IgtDataItem[];
  onResetDraw: () => void;
};

export type DrawAoiAttributeListProps = {
  aoiCqlFilter: string;
  confirmedPolygon?: GeoJSON.Feature<GeoJSON.Polygon> | null;
  onResetDraw: () => void;
};
