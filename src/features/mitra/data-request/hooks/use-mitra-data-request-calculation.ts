// src/features/mitra/data-request/hooks/use-mitra-data-request-calculation.ts

import { toast } from "@/design-system/components/toast";
import { calculateSpatialCoverageStream } from "@/features/mitra/data-request/api/mitra.data-request-calculation.api";
import type {
  CalculateSpatialCalculationStage,
  CalculateSpatialCoverageRequest,
  CalculateSpatialCoverageResult,
  CalculateSpatialStreamEvent,
} from "@/features/mitra/data-request/types/mitra.data-request.calculation.type";
import { useCallback, useRef, useState } from "react";

export const useMitraDataRequestCalculation = () => {
  // States
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [progressStage, setProgressStage] =
    useState<CalculateSpatialCalculationStage>("idle");
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>("");
  const [result, setResult] = useState<CalculateSpatialCoverageResult | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsCalculating(false);
    setProgressStage("idle");
    setProgressPercentage(0);
    setProgressMessage("");
    setResult(null);
    setError(null);
  }, []);

  const calculate = useCallback(
    async (
      request: CalculateSpatialCoverageRequest,
    ): Promise<CalculateSpatialCoverageResult | null> => {
      // Abort any ongoing calculation
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsCalculating(true);
      setProgressStage("downloading");
      setProgressPercentage(10);
      setProgressMessage("Menginisialisasi kalkulasi spasial di server...");
      setError(null);

      return new Promise<CalculateSpatialCoverageResult | null>((resolve) => {
        const handleEvent = (event: CalculateSpatialStreamEvent) => {
          if (event.type === "progress") {
            setProgressStage(event.stage);
            setProgressPercentage(event.percentage);
            setProgressMessage(event.message);
          } else if (event.type === "completed") {
            setResult(event.data);
            setIsCalculating(false);
            setProgressStage("idle");
            setProgressPercentage(100);
            setProgressMessage("Kalkulasi spasial selesai.");
            resolve(event.data);
          } else if (event.type === "error") {
            setError(event.message);
            setIsCalculating(false);
            setProgressStage("idle");
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
              setError(err.message);
              setIsCalculating(false);
              setProgressStage("idle");
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
    [],
  );

  return {
    isCalculating,
    progressStage,
    progressPercentage,
    progressMessage,
    result,
    error,
    calculate,
    reset,
    setResult,
  };
};
