import type {
  CalculateSpatialPolicy,
  CalculateSpatialValidation,
} from "@/features/mitra/data-request/types/mitra.data-request.calculation.type";

export type MitraDataRequestSpatialSummaryProps = {
  totalBidangCount?: number;
  totalKawasanCount?: number;
  totalKawasanAreaHa?: number;
  subtotalBidangPrice?: number;
  subtotalKawasanPrice?: number;
  pricePerBidang?: number;
  pricePerKawasanHa?: number;
  minBidangCount?: number;
  minKawasanHa?: number;
  calculatedPolicy?: CalculateSpatialPolicy;
  validation?: CalculateSpatialValidation;
  estimatedTotalPrice?: number;
  isPurchaseLimitValid?: boolean;
  purchaseLimitMessage?: string;
  isCalculating?: boolean;
  progressMessage?: string;
  progressPercentage?: number;
  hasAoiPolygon?: boolean;
  hasKawasanCoveragePolygon?: boolean;
  hasBidangLayer?: boolean;
  hasKawasanLayer?: boolean;
  aoiColorPalette?: string;
  isAoiVisible?: boolean;
  isKawasanCoverageVisible?: boolean;
  isBidangVisible?: boolean;
  isFetchingBidang?: boolean;
  selectionType?: string;
  onToggleAoiVisible?: () => void;
  onToggleKawasanCoverageVisible?: () => void;
  onToggleBidangVisible?: () => void;
  onFlyToAoi?: () => void;
  onFlyToKawasanCoverage?: () => void;
  onFlyToBidang?: () => void;
};

