// src/design-system/components/map/types/map.master-igt-layer-select.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";

export type MapMasterIgtLayerItemProps = Omit<StackProps, "onToggle"> & {
  layer: IgtLayerItem;
  index: number;
  isEnabled: boolean;
  opacity: number;
  isSymbologyEnabled?: boolean;
  onToggle: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  onToggleSymbology?: (id: string) => void;
  onReorder: (sourceIndex: number, targetIndex: number) => void;
};
