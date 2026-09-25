// src\features\mitra\data-request\types\mitra.data-request.spatial-summary.type.ts

// src\features\mitra\data-request\types\mitra.data-request.spatial-summary.type.ts

export type MitraDataRequestSpatialSummaryProps = {
  totalBidangCount?: number;
  totalKawasanCount?: number;
  totalKawasanAreaHa?: number;
  subtotalBidangPrice?: number;
  subtotalKawasanPrice?: number;
  pricePerBidang?: number;
  pricePerKawasanHa?: number;
  estimatedTotalPrice?: number;
  isPurchaseLimitValid?: boolean;
  purchaseLimitMessage?: string;
  isCalculating?: boolean;
  progressMessage?: string;
  progressPercentage?: number;
  hasAoiPolygon?: boolean;
  hasCoveragePolygon?: boolean;
  aoiColorPalette?: string;
  isAoiVisible?: boolean;
  isCoverageVisible?: boolean;
  selectionType?: string;
  onToggleAoiVisible?: () => void;
  onToggleCoverageVisible?: () => void;
  onFlyToAoi?: () => void;
  onFlyToCoverage?: () => void;
};
