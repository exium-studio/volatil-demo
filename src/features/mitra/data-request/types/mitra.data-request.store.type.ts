// src/features/mitra/data-request/types/mitra.data-request.store.type.ts

import type {
  CalculateSpatialCalculationStage,
  CalculateSpatialCoverageRequest,
  CalculateSpatialCoverageResult,
} from "@/features/mitra/data-request/types/mitra.data-request.calculation.type";
import type {
  AoiFeatureItem,
  UploadedAoiFile,
} from "@/features/mitra/data-request/types/mitra.data-request.upload-aoi.type";
import type { FilterAdministrativeAreaValues } from "@/features/shared/types/filter.administrative-area.type";
import type GeoJSON from "geojson";

export type MitraDataRequestCatalogSlice = {
  appliedAdministrativeFilters: FilterAdministrativeAreaValues;
  draftAdministrativeFilters: FilterAdministrativeAreaValues;
  adminBoundaryPolygon: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null;
  cqlFilter: string | undefined;
  isCatalogAoiVisible: boolean;
  isCatalogCoverageVisible: boolean;
  isCatalogBidangVisible: boolean;
  setAppliedAdministrativeFilters: (filters: FilterAdministrativeAreaValues) => void;
  setDraftAdministrativeFilters: (filters: FilterAdministrativeAreaValues) => void;
  setAdminBoundaryPolygon: (
    polygon: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null,
  ) => void;
  setIsCatalogAoiVisible: (visible: boolean) => void;
  setIsCatalogCoverageVisible: (visible: boolean) => void;
  setIsCatalogBidangVisible: (visible: boolean) => void;
  resetCatalog: () => void;
};

export type MitraDataRequestUploadAoiSlice = {
  uploadedFile: UploadedAoiFile | null;
  selectedFeatureId: string | null;
  confirmedFeature: AoiFeatureItem | null;
  isUploadAoiVisible: boolean;
  isUploadCoverageVisible: boolean;
  isUploadBidangVisible: boolean;
  setUploadedFile: (
    fileOrUpdater:
      | UploadedAoiFile
      | null
      | ((prev: UploadedAoiFile | null) => UploadedAoiFile | null),
  ) => void;
  setSelectedFeatureId: (id: string | null) => void;
  setConfirmedFeature: (feature: AoiFeatureItem | null) => void;
  toggleUploadFeatureVisibility: (featureId: string) => void;
  setIsUploadAoiVisible: (visible: boolean) => void;
  setIsUploadCoverageVisible: (visible: boolean) => void;
  setIsUploadBidangVisible: (visible: boolean) => void;
  resetUploadAoi: () => void;
  resetUploadFile: () => void;
};

export type MitraDataRequestDrawAoiSlice = {
  confirmedPolygon: GeoJSON.Feature<GeoJSON.Polygon> | null;
  isDrawAoiVisible: boolean;
  isDrawCoverageVisible: boolean;
  isDrawBidangVisible: boolean;
  setConfirmedPolygon: (polygon: GeoJSON.Feature<GeoJSON.Polygon> | null) => void;
  setIsDrawAoiVisible: (visible: boolean) => void;
  setIsDrawCoverageVisible: (visible: boolean) => void;
  setIsDrawBidangVisible: (visible: boolean) => void;
  resetDrawAoi: () => void;
};

export type MitraDataRequestCalculationSlice = {
  isCalculating: boolean;
  progressStage: CalculateSpatialCalculationStage;
  progressPercentage: number;
  progressMessage: string;
  result: CalculateSpatialCoverageResult | null;
  calculationResults: Record<string, CalculateSpatialCoverageResult | null>;
  lastCalculationKeys: Record<string, string>;
  error: string | null;
  calculate: (
    request: CalculateSpatialCoverageRequest,
    calcKey?: string,
  ) => Promise<CalculateSpatialCoverageResult | null>;
  setResult: (
    result: CalculateSpatialCoverageResult | null,
    selectionType?: string,
  ) => void;
  resetCalculation: (selectionType?: string) => void;
  abortCalculation: () => void;
};

export type MitraDataRequestStore = MitraDataRequestCatalogSlice &
  MitraDataRequestUploadAoiSlice &
  MitraDataRequestDrawAoiSlice &
  MitraDataRequestCalculationSlice & {
    resetAll: () => void;
  };
