// src\features\mitra\data-request\stores\mitra.data-request-calculation.store.ts

// src\features\mitra\data-request\stores\mitra.data-request-calculation.store.ts

import { toast } from "@/design-system/components/toast";
import { calculateSpatialCoverageStream } from "@/features/mitra/data-request/api/mitra.data-request-calculation.api";
import type {
  CalculateSpatialCoverageResult,
  CalculateSpatialStreamEvent,
  MitraDataRequestCalculationState,
} from "@/features/mitra/data-request/types/mitra.data-request.calculation.type";
import { create } from "zustand";

let currentAbortController: AbortController | null = null;

export const useMitraDataRequestCalculationStore =
  create<MitraDataRequestCalculationState>()((set) => ({
    isCalculating: false,
    progressStage: "idle",
    progressPercentage: 0,
    progressMessage: "",
    result: null,
    error: null,

    abort: () => {
      if (currentAbortController) {
        currentAbortController.abort();
        currentAbortController = null;
      }
    },

    reset: () => {
      if (currentAbortController) {
        currentAbortController.abort();
        currentAbortController = null;
      }
      set({
        isCalculating: false,
        progressStage: "idle",
        progressPercentage: 0,
        progressMessage: "",
        result: null,
        error: null,
      });
    },

    setResult: (result) => set({ result }),

    calculate: async (request) => {
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
            set({
              result: finalResult,
              isCalculating: false,
              progressStage: "idle",
              progressPercentage: 100,
              progressMessage: "Kalkulasi spasial selesai.",
            });
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
  }));
