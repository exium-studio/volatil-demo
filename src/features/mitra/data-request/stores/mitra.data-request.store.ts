// src/features/mitra/data-request/stores/mitra.data-request.store.ts

import { toast } from "@/design-system/components/toast";
import { calculateSpatialCoverageStream } from "@/features/mitra/data-request/api/mitra.data-request-calculation.api";
import type {
  CalculateSpatialCoverageResult,
  CalculateSpatialStreamEvent,
} from "@/features/mitra/data-request/types/mitra.data-request.calculation.type";
import type { MitraDataRequestStore } from "@/features/mitra/data-request/types/mitra.data-request.store.type";
import { buildIgtCqlFilter } from "@/features/mitra/data-request/utils/build-igt-cql-filter";
import { create } from "zustand";

let currentAbortController: AbortController | null = null;

const initialCatalogState = {
  appliedAdministrativeFilters: {},
  draftAdministrativeFilters: {},
  adminBoundaryPolygon: null,
  cqlFilter: undefined,
  isCatalogAoiVisible: true,
  isCatalogCoverageVisible: true,
  isCatalogBidangVisible: true,
};

const initialUploadAoiState = {
  uploadedFile: null,
  selectedFeatureId: null,
  confirmedFeature: null,
  isUploadAoiVisible: true,
  isUploadCoverageVisible: true,
  isUploadBidangVisible: true,
};

const initialDrawAoiState = {
  confirmedPolygon: null,
  isDrawAoiVisible: true,
  isDrawCoverageVisible: true,
  isDrawBidangVisible: true,
};

const initialCalculationState = {
  isCalculating: false,
  progressStage: "idle" as const,
  progressPercentage: 0,
  progressMessage: "",
  result: null,
  calculationResults: {},
  lastCalculationKeys: {},
  error: null,
};

export const useMitraDataRequestStore = create<MitraDataRequestStore>()(
  (set, get) => ({
    // Catalog State & Actions
    ...initialCatalogState,
    setAppliedAdministrativeFilters: (filters) =>
      set({
        appliedAdministrativeFilters: filters,
        cqlFilter: buildIgtCqlFilter(filters),
      }),
    setDraftAdministrativeFilters: (filters) =>
      set({ draftAdministrativeFilters: filters }),
    setAdminBoundaryPolygon: (adminBoundaryPolygon) =>
      set({ adminBoundaryPolygon }),
    setIsCatalogAoiVisible: (isCatalogAoiVisible) =>
      set({ isCatalogAoiVisible }),
    setIsCatalogCoverageVisible: (isCatalogCoverageVisible) =>
      set({ isCatalogCoverageVisible }),
    setIsCatalogBidangVisible: (isCatalogBidangVisible) =>
      set({ isCatalogBidangVisible }),
    resetCatalog: () =>
      set((state) => {
        const updatedResults = { ...state.calculationResults };
        const updatedKeys = { ...state.lastCalculationKeys };
        delete updatedResults["catalog"];
        delete updatedKeys["catalog"];
        return {
          ...initialCatalogState,
          calculationResults: updatedResults,
          lastCalculationKeys: updatedKeys,
          result:
            state.result?.selectionType === "catalog" ? null : state.result,
        };
      }),

    // Upload AOI State & Actions
    ...initialUploadAoiState,
    setUploadedFile: (fileOrUpdater) =>
      set((state) => ({
        uploadedFile:
          typeof fileOrUpdater === "function"
            ? fileOrUpdater(state.uploadedFile)
            : fileOrUpdater,
      })),
    setSelectedFeatureId: (selectedFeatureId) => set({ selectedFeatureId }),
    setConfirmedFeature: (confirmedFeature) => set({ confirmedFeature }),
    toggleUploadFeatureVisibility: (featureId) =>
      set((state) => {
        if (!state.uploadedFile) return {};
        return {
          uploadedFile: {
            ...state.uploadedFile,
            features: state.uploadedFile.features.map((f) =>
              f.id === featureId
                ? { ...f, isVisibleOnMap: !f.isVisibleOnMap }
                : f,
            ),
          },
        };
      }),
    setIsUploadAoiVisible: (isUploadAoiVisible) => set({ isUploadAoiVisible }),
    setIsUploadCoverageVisible: (isUploadCoverageVisible) =>
      set({ isUploadCoverageVisible }),
    setIsUploadBidangVisible: (isUploadBidangVisible) =>
      set({ isUploadBidangVisible }),
    resetUploadAoi: () =>
      set((state) => {
        const updatedResults = { ...state.calculationResults };
        const updatedKeys = { ...state.lastCalculationKeys };
        delete updatedResults["upload_aoi"];
        delete updatedKeys["upload_aoi"];
        return {
          confirmedFeature: null,
          isUploadAoiVisible: true,
          isUploadCoverageVisible: true,
          isUploadBidangVisible: true,
          calculationResults: updatedResults,
          lastCalculationKeys: updatedKeys,
          result:
            state.result?.selectionType === "upload_aoi" ? null : state.result,
        };
      }),
    resetUploadFile: () =>
      set((state) => {
        const updatedResults = { ...state.calculationResults };
        const updatedKeys = { ...state.lastCalculationKeys };
        delete updatedResults["upload_aoi"];
        delete updatedKeys["upload_aoi"];
        return {
          ...initialUploadAoiState,
          calculationResults: updatedResults,
          lastCalculationKeys: updatedKeys,
          result:
            state.result?.selectionType === "upload_aoi" ? null : state.result,
        };
      }),

    // Draw AOI State & Actions
    ...initialDrawAoiState,
    setConfirmedPolygon: (confirmedPolygon) => set({ confirmedPolygon }),
    setIsDrawAoiVisible: (isDrawAoiVisible) => set({ isDrawAoiVisible }),
    setIsDrawCoverageVisible: (isDrawCoverageVisible) =>
      set({ isDrawCoverageVisible }),
    setIsDrawBidangVisible: (isDrawBidangVisible) =>
      set({ isDrawBidangVisible }),
    resetDrawAoi: () =>
      set((state) => {
        const updatedResults = { ...state.calculationResults };
        const updatedKeys = { ...state.lastCalculationKeys };
        delete updatedResults["draw_aoi"];
        delete updatedKeys["draw_aoi"];
        return {
          ...initialDrawAoiState,
          calculationResults: updatedResults,
          lastCalculationKeys: updatedKeys,
          result:
            state.result?.selectionType === "draw_aoi" ? null : state.result,
        };
      }),

    // Calculation State & Actions
    ...initialCalculationState,
    setResult: (result, selectionType) =>
      set((state) => {
        const key = selectionType ?? result?.selectionType;
        return {
          result,
          calculationResults: key
            ? { ...state.calculationResults, [key]: result }
            : state.calculationResults,
        };
      }),
    abortCalculation: () => {
      if (currentAbortController) {
        currentAbortController.abort();
        currentAbortController = null;
      }
    },
    resetCalculation: (selectionType) => {
      if (currentAbortController) {
        currentAbortController.abort();
        currentAbortController = null;
      }
      if (selectionType) {
        set((state) => {
          const updatedResults = { ...state.calculationResults };
          const updatedKeys = { ...state.lastCalculationKeys };
          delete updatedResults[selectionType];
          delete updatedKeys[selectionType];
          return {
            calculationResults: updatedResults,
            lastCalculationKeys: updatedKeys,
            result: state.result?.selectionType === selectionType ? null : state.result,
            isCalculating: false,
            progressStage: "idle",
            progressPercentage: 0,
            progressMessage: "",
            error: null,
          };
        });
      } else {
        set({
          ...initialCalculationState,
        });
      }
    },
    calculate: async (request, calcKey) => {
      const selectionType = request.selectionType ?? "catalog";
      const currentCache = get().calculationResults[selectionType];
      const lastKey = get().lastCalculationKeys[selectionType];

      // If already calculated with the same stable trigger key, reuse persistent cache without re-requesting
      if (calcKey && lastKey === calcKey && currentCache) {
        set({
          result: currentCache,
          isCalculating: false,
          progressStage: "idle",
          progressPercentage: 100,
        });
        return currentCache;
      }

      if (currentAbortController) {
        currentAbortController.abort();
        currentAbortController = null;
      }

      const controller = new AbortController();
      currentAbortController = controller;

      set({
        isCalculating: true,
        progressStage: "downloading",
        progressPercentage: 10,
        progressMessage: "Menginisialisasi kalkulasi spasial di server...",
        result: null,
        error: null,
      });

      return new Promise<CalculateSpatialCoverageResult | null>((resolve) => {
        const handleEvent = (event: CalculateSpatialStreamEvent) => {
          if (event.type === "progress") {
            set({
              progressStage: event.stage,
              progressPercentage: event.percentage,
              progressMessage: event.message,
            });
          } else if (event.type === "completed") {
            const finalResult = {
              ...event.data,
              selectionType: request.selectionType,
            };
            set((state) => ({
              result: finalResult,
              calculationResults: {
                ...state.calculationResults,
                [selectionType]: finalResult,
              },
              lastCalculationKeys: calcKey
                ? {
                    ...state.lastCalculationKeys,
                    [selectionType]: calcKey,
                  }
                : state.lastCalculationKeys,
              isCalculating: false,
              progressStage: "idle",
              progressPercentage: 100,
              progressMessage: "Kalkulasi spasial selesai.",
            }));
            resolve(finalResult);
          } else if (event.type === "error") {
            set({
              error: event.message,
              isCalculating: false,
              progressStage: "idle",
            });
            toast.error(event.message || "Gagal melakukan kalkulasi spasial", {
              group: "Kalkulasi Spasial",
            });
            resolve(null);
          }
        };

        void calculateSpatialCoverageStream(
          request,
          {
            onEvent: handleEvent,
            onError: (err) => {
              set({
                error: err.message,
                isCalculating: false,
                progressStage: "idle",
              });
              toast.error(err.message || "Gagal melakukan kalkulasi spasial", {
                group: "Kalkulasi Spasial",
              });
              resolve(null);
            },
          },
          controller.signal,
        );
      });
    },

    // Global Reset on route unmount
    resetAll: () => {
      if (currentAbortController) {
        currentAbortController.abort();
        currentAbortController = null;
      }
      set({
        ...initialCatalogState,
        ...initialUploadAoiState,
        ...initialDrawAoiState,
        ...initialCalculationState,
      });
    },
  }),
);
