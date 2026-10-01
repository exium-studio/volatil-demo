// src/design-system/components/map/types/map.master-igt-layer-select.type.ts

import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";

export type MapMasterIgtLayerItemProps = {
  layer: IgtLayerItem;
  isEnabled: boolean;
  opacity: number;
  isSymbologyEnabled?: boolean;
  onToggle: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
  onToggleSymbology?: (id: string) => void;
};
