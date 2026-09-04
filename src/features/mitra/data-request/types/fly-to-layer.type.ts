// src/features/mitra/data-request/types/fly-to-layer.type.ts

import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";

export type FlyToIgtLayerOptions = {
  cqlFilter?: string;
  fetchBoundary?: boolean;
};

export type FlyToLayerTarget =
  | IgtLayerItem
  | {
      id: string;
      title?: string;
      bbox?: [number, number, number, number] | null;
      wfs?: {
        wfsTypeName?: string;
        wfsUrl?: string;
      };
      spatialBasis?: "bidang" | "kawasan";
    };
