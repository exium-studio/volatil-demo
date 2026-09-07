// src/features/mitra/data-request/services/geo-ops-worker.service.ts

import type {
  GeoOpsWorkerRequest,
  GeoOpsWorkerResponse,
} from "@/features/mitra/data-request/types/geo-ops.worker.type";
import type { KawasanCoverageResult } from "@/features/mitra/data-request/types/mitra.data-request.coverage.type";
import GeoOpsWorker from "@/features/mitra/data-request/workers/geo-ops.worker.ts?worker";
import type GeoJSON from "geojson";

/**
 * Dispatches clipping and unary union computations to a dedicated background Web Worker.
 * Keeps main thread, MapLibre GL animation loops, and React state interactions 100% smooth.
 */
export const runClipAndUnionKawasanInWorker = (
  rawFeatures: GeoJSON.Feature[],
  aoiPolygon:
    | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
    | GeoJSON.Polygon
    | GeoJSON.MultiPolygon
    | null
    | undefined,
  signal?: AbortSignal,
): Promise<KawasanCoverageResult> => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const worker = new GeoOpsWorker();
    const requestId = `clip_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const cleanup = () => {
      signal?.removeEventListener("abort", onAbort);
      worker.terminate();
    };

    const onAbort = () => {
      cleanup();
      reject(new DOMException("Aborted", "AbortError"));
    };

    signal?.addEventListener("abort", onAbort, { once: true });

    worker.onmessage = (e: MessageEvent<GeoOpsWorkerResponse>) => {
      const resp = e.data;
      if (resp.id !== requestId) return;

      cleanup();

      if (resp.ok && resp.type === "CLIP_AND_UNION_KAWASAN") {
        resolve(resp.data);
      } else if (!resp.ok) {
        reject(new Error(resp.error));
      }
    };

    worker.onerror = (err) => {
      cleanup();
      reject(new Error(err.message || "GeoOps Worker error"));
    };

    const request: GeoOpsWorkerRequest = {
      id: requestId,
      type: "CLIP_AND_UNION_KAWASAN",
      payload: {
        rawFeatures,
        aoiPolygon,
      },
    };

    worker.postMessage(request);
  });
};

/**
 * Dispatches unary union across feature collection to worker.
 */
export const runUnionGeoJsonPolygonsInWorker = (
  featureCollection: GeoJSON.FeatureCollection,
  signal?: AbortSignal,
): Promise<GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null> => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const worker = new GeoOpsWorker();
    const requestId = `union_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const cleanup = () => {
      signal?.removeEventListener("abort", onAbort);
      worker.terminate();
    };

    const onAbort = () => {
      cleanup();
      reject(new DOMException("Aborted", "AbortError"));
    };

    signal?.addEventListener("abort", onAbort, { once: true });

    worker.onmessage = (e: MessageEvent<GeoOpsWorkerResponse>) => {
      const resp = e.data;
      if (resp.id !== requestId) return;

      cleanup();

      if (resp.ok && resp.type === "UNION_GEOJSON_POLYGONS") {
        resolve(resp.data);
      } else if (!resp.ok) {
        reject(new Error(resp.error));
      }
    };

    worker.onerror = (err) => {
      cleanup();
      reject(new Error(err.message || "GeoOps Worker error"));
    };

    const request: GeoOpsWorkerRequest = {
      id: requestId,
      type: "UNION_GEOJSON_POLYGONS",
      payload: {
        featureCollection,
      },
    };

    worker.postMessage(request);
  });
};
