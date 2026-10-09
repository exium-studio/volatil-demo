// src/features/mitra/data-request/types/mitra.data-request.calculation.type.ts

import type {
  IgtBasisType,
  SelectionType,
} from "@/features/mitra/cart/types/mitra.cart.order.type";
import type GeoJSON from "geojson";

export type CalculateSpatialCalculationStage =
  | "downloading"
  | "clipping"
  | "union"
  | "validating"
  | "idle"
  | (string & {});

export type CalculateSpatialItemParam = {
  sourceLayerId: string;
  typeName?: string;
  title?: string;
  spatialBasis?: IgtBasisType;
};

export type CalculateSpatialCoverageRequest = {
  selectionType: SelectionType;
  aoiPolygon: GeoJSON.Polygon | GeoJSON.MultiPolygon;
  items: CalculateSpatialItemParam[];
  administrativeFilter?: {
    kodeProvinsi?: string;
    kodeKabupaten?: string;
    kodeKecamatan?: string;
    kodeDesa?: string;
  };
};

export type CalculateSpatialCoverageKawasan = {
  areaHa: number;
  polygon: GeoJSON.Polygon | GeoJSON.MultiPolygon;
};

export type CalculateSpatialSummaryItem = {
  unitPrice: number;
  featureCount: number;
  subtotalPrice: number;
};

export type CalculateSpatialSummary = {
  bidang: CalculateSpatialSummaryItem;
  kawasan: CalculateSpatialSummaryItem;
  totalPrice: number;
};

export type CalculateSpatialValidation = {
  isValid: boolean;
  isBidangValid?: boolean;
  isKawasanValid?: boolean;
  message?: string;
};

export type CalculateSpatialPolicy = {
  minimumBidangCount?: number;
  minimumKawasanHa?: number;
  pricePerBidang?: number;
  pricePerKawasanHa?: number;
};

export type CalculateSpatialCalculatedItem = {
  id?: string;
  layerId?: string;
  sourceLayerId: string;
  sourceLayerTitle: string;
  title?: string;
  igtBasis: IgtBasisType;
  spatialBasis: IgtBasisType;
  featureCount: number;
  featuresCount: number;
  areaHa?: number;
  unitPrice?: number;
  subtotalPrice?: number;
};

export type RawCalculateSpatialItem = {
  id?: string;
  layerId?: string;
  sourceLayerId?: string;
  title?: string;
  sourceLayerTitle?: string;
  igtBasis?: IgtBasisType;
  spatialBasis?: IgtBasisType;
  featureCount?: number;
  featuresCount?: number;
  areaHa?: number;
  unitPrice?: number;
  subtotalPrice?: number;
};

export type RawCalculateSpatialPolicy = {
  minimumBidangCount?: number;
  minBidangCount?: number;
  minimumKawasanHa?: number;
  minKawasanHa?: number;
  pricePerBidang?: number;
  unitPriceBidang?: number;
  pricePerKawasanHa?: number;
  unitPriceKawasan?: number;
};

export type RawCalculateSpatialResponse = {
  data?: RawCalculateSpatialResponse;
  coverageKawasan?: CalculateSpatialCoverageKawasan;
  summary?: CalculateSpatialSummary;
  policy?: RawCalculateSpatialPolicy;
  config?: RawCalculateSpatialPolicy;
  validation?: CalculateSpatialValidation;
  coveragePolygon?: GeoJSON.Polygon | GeoJSON.MultiPolygon | null;
  totalBidangCount?: number;
  totalKawasanCount?: number;
  totalKawasanAreaHa?: number;
  subtotalBidangPrice?: number;
  subtotalKawasanPrice?: number;
  estimatedTotalPrice?: number;
  isPurchaseLimitValid?: boolean;
  purchaseLimitMessage?: string;
  items?: RawCalculateSpatialItem[];
  selectionType?: SelectionType;
};

export type CalculateSpatialCoverageResult = {
  coverageKawasan?: CalculateSpatialCoverageKawasan;
  summary?: CalculateSpatialSummary;
  policy?: CalculateSpatialPolicy;
  validation?: CalculateSpatialValidation;
  coveragePolygon: GeoJSON.Polygon | GeoJSON.MultiPolygon | null;
  totalBidangCount: number;
  totalKawasanCount: number;
  totalKawasanAreaHa: number;
  subtotalBidangPrice: number;
  subtotalKawasanPrice: number;
  estimatedTotalPrice: number;
  isPurchaseLimitValid: boolean;
  purchaseLimitMessage?: string;
  items: CalculateSpatialCalculatedItem[];
  selectionType?: SelectionType;
};

export type CalculateSpatialConnectedEvent = {
  type: "connected";
  message?: string;
  data?: Record<string, unknown>;
};

export type CalculateSpatialProgressEvent = {
  type: "progress";
  stage: CalculateSpatialCalculationStage;
  percentage: number;
  message: string;
  currentLayer?: number;
  totalLayers?: number;
  currentFeature?: number;
  totalFeatures?: number;
};

export type CalculateSpatialCompletedEvent = {
  type: "completed";
  data: CalculateSpatialCoverageResult;
};

export type CalculateSpatialErrorEvent = {
  type: "error";
  message: string;
  code?: string;
};

export type CalculateSpatialStreamEvent =
  | CalculateSpatialConnectedEvent
  | CalculateSpatialProgressEvent
  | CalculateSpatialCompletedEvent
  | CalculateSpatialErrorEvent;

export type CalculateSpatialStreamCallbacks = {
  onEvent?: (event: CalculateSpatialStreamEvent) => void;
  onConnected?: () => void;
  onProgress?: (data: {
    stage: string;
    percentage: number;
    message: string;
    currentLayer?: number;
    totalLayers?: number;
  }) => void;
  onCompleted?: (result: CalculateSpatialCoverageResult) => void;
  onError?: (error: Error) => void;
};

export type MitraDataRequestCalculationState = {
  isCalculating: boolean;
  progressStage: CalculateSpatialCalculationStage;
  progressPercentage: number;
  progressMessage: string;
  result: CalculateSpatialCoverageResult | null;
  error: string | null;
  calculate: (
    request: CalculateSpatialCoverageRequest,
  ) => Promise<CalculateSpatialCoverageResult | null>;
  reset: () => void;
  setResult: (result: CalculateSpatialCoverageResult | null) => void;
  abort: () => void;
};

