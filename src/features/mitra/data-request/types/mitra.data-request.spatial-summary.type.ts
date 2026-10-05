// src/features/mitra/data-request/types/mitra.data-request.spatial-summary.type.ts

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
  hasBidangLayer?: boolean;
  aoiColorPalette?: string;
  isAoiVisible?: boolean;
  isCoverageVisible?: boolean;
  isBidangVisible?: boolean;
  isFetchingBidang?: boolean;
  selectionType?: string;
  onToggleAoiVisible?: () => void;
  onToggleCoverageVisible?: () => void;
  onToggleBidangVisible?: () => void;
  onFlyToAoi?: () => void;
  onFlyToCoverage?: () => void;
};
