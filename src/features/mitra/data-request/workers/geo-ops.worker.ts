// src/features/mitra/data-request/workers/geo-ops.worker.ts

import type {
  GeoOpsWorkerRequest,
  GeoOpsWorkerResponse,
} from "@/features/mitra/data-request/types/geo-ops.worker.type";
import { clipAndUnionKawasanFeatures } from "@/features/mitra/data-request/utils/clip-and-union-kawasan";
import { unionGeoJsonPolygons } from "@/features/mitra/data-request/utils/union-geojson-polygons";

self.onmessage = (e: MessageEvent<GeoOpsWorkerRequest>) => {
  const message = e.data;
  if (!message || !message.type) return;

  try {
    if (message.type === "CLIP_AND_UNION_KAWASAN") {
      const result = clipAndUnionKawasanFeatures(
        message.payload.rawFeatures,
        message.payload.aoiPolygon,
        (progress) => {
          const progressResponse: GeoOpsWorkerResponse = {
            id: message.id,
            ok: true,
            type: "PROGRESS",
            progress,
          };
          self.postMessage(progressResponse);
        },
      );

      const response: GeoOpsWorkerResponse = {
        id: message.id,
        ok: true,
        type: "CLIP_AND_UNION_KAWASAN",
        data: result,
      };
      self.postMessage(response);
      return;
    }

    if (message.type === "UNION_GEOJSON_POLYGONS") {
      const result = unionGeoJsonPolygons(message.payload.featureCollection);

      const response: GeoOpsWorkerResponse = {
        id: message.id,
        ok: true,
        type: "UNION_GEOJSON_POLYGONS",
        data: result,
      };
      self.postMessage(response);
      return;
    }
  } catch (err) {
    const response: GeoOpsWorkerResponse = {
      id: message.id,
      ok: false,
      type: "ERROR",
      error: err instanceof Error ? err.message : "Gagal memproses operasi geometri spasial",
    };
    self.postMessage(response);
  }
};
