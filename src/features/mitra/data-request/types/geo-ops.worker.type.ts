// src/features/mitra/data-request/types/geo-ops.worker.type.ts

import type { KawasanCoverageResult } from "@/features/mitra/data-request/types/mitra.data-request.coverage.type";
import type GeoJSON from "geojson";

export type GeoOpsWorkerRequestType = "CLIP_AND_UNION_KAWASAN" | "UNION_GEOJSON_POLYGONS";

export type GeoOpsWorkerRequest =
  | {
      id: string;
      type: "CLIP_AND_UNION_KAWASAN";
      payload: {
        rawFeatures: GeoJSON.Feature[];
        aoiPolygon:
          | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
          | GeoJSON.Polygon
          | GeoJSON.MultiPolygon
          | null
          | undefined;
      };
    }
  | {
      id: string;
      type: "UNION_GEOJSON_POLYGONS";
      payload: {
        featureCollection: GeoJSON.FeatureCollection;
      };
    };

export type GeoOpsWorkerResponse =
  | {
      id: string;
      ok: true;
      type: "CLIP_AND_UNION_KAWASAN";
      data: KawasanCoverageResult;
    }
  | {
      id: string;
      ok: true;
      type: "UNION_GEOJSON_POLYGONS";
      data: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | null;
    }
  | {
      id: string;
      ok: true;
      type: "PROGRESS";
      progress: number;
      message?: string;
    }
  | {
      id: string;
      ok: false;
      type: "ERROR";
      error: string;
    };
