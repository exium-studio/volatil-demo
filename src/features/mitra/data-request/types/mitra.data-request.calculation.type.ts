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
  layerId?: string;
  sourceLayerId?: string;
  sourceLayerTitle?: string;
  title?: string;
  typeName?: string;
  spatialBasis?: IgtBasisType;
  wfsUrl?: string;
  wmsUrl?: string;
  cqlFilter?: string;
  selectionType?: SelectionType;
};

export type CalculateSpatialCoverageRequest = {
  selectionType?: SelectionType;
  cqlFilter?: string;
  aoiPolygon?:
    | GeoJSON.Polygon
    | GeoJSON.MultiPolygon
    | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
    | null;
  layers?: CalculateSpatialItemParam[];
  items?: CalculateSpatialItemParam[];
  administrativeFilter?: {
    kodeProvinsi?: string;
    kodeKabupaten?: string;
    kodeKecamatan?: string;
    kodeDesa?: string;
  };
};

export type CalculateSpatialCalculatedItem = {
  id?: string;
  sourceLayerId: string;
  sourceLayerTitle: string;
  spatialBasis: IgtBasisType;
  featuresCount: number;
  areaHa?: number;
  unitPrice: number;
  subtotalPrice: number;
};

export type CalculateSpatialCoverageResult = {
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

