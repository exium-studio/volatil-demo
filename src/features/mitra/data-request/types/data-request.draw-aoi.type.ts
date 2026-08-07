// src/features/mitra/data-request/types/data-request.draw-aoi.type.ts

import type { DataListItemActionsGenerator } from "@/design-system/components/data-display/types/data-list.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { IgtDataItem } from "@/features/mitra/data-request/types/igt-by-aoi.type";

export type DrawAoiGuideAlertProps = StackProps & {
  isLoading: boolean;
  isDrawing: boolean;
  hasFinishedDraw: boolean;
  isVisible?: boolean;
};

export type DrawAoiDataListProps = {
  igtItems: IgtDataItem[];
  itemActions: DataListItemActionsGenerator<IgtDataItem>[];
  onResetDraw: () => void;
};
