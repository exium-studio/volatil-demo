// src/features/mitra/data-request/types/mitra.data-request.wfs.type.ts

import type { WFS_BIDANG_ATTRIBUTES } from "@/features/mitra/data-request/constants/mitra.data-request.constant";
import type GeoJSON from "geojson";

export type WfsBidangAttributeKey = (typeof WFS_BIDANG_ATTRIBUTES)[number];

export type WfsBidangProperties = Record<WfsBidangAttributeKey, string | number | null> &
  Record<string, unknown>;

export type WfsFeatureItem = GeoJSON.Feature<GeoJSON.Geometry, WfsBidangProperties>;
