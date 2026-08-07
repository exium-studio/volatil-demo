// src/features/data-request/types/data-request.draw-aoi.type.ts

import type { DataListItemActionsGenerator } from "@/design-system/components/data-display/types/data-list.type";
import type { IgtDataItem } from "@/features/data-request/types/igt-by-aoi.type";

export type DrawAoiGuideAlertProps = {
  isLoading: boolean;
  isDrawing: boolean;
  hasFinishedDraw: boolean;
};

export type DrawAoiDataListProps = {
  igtItems: IgtDataItem[];
  itemActions: DataListItemActionsGenerator<IgtDataItem>[];
  onResetDraw: () => void;
};
