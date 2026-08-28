// src/features/internal/home/types/internal.home.leaderboard.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { SpatialBasisType } from "@/features/internal/data-management/types/data-management.type";

export type InternalHomeLeaderboardProps = StackProps;

export type TopMitraAcquisitionItem = {
  rank: number;
  mitraId: string;
  mitraName: string;
  agencyOrCompany: string;
  totalOrders: number;
  totalVolume: string; // misal "125.000 Bidang" atau "45.000 Ha"
  totalSpending: number;
};

export type TopIgtLayerItem = {
  rank: number;
  layerId: string;
  layerTitle: string;
  spatialBasis: SpatialBasisType;
  totalAcquisitions: number;
  totalVolume: number;
  unit: "bidang" | "ha";
  totalPnbpRevenue: number;
};

export type SystemHealthMetricItem = {
  key: string;
  title: string;
  status: "healthy" | "warning" | "critical";
  value: string;
  subValue: string;
  colorPalette: string;
};
