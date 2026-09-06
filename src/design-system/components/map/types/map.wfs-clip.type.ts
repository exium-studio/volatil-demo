export type WfsClipStatus = "idle" | "fetching" | "clipping" | "done" | "error";

export type WfsClipStore = {
  clippingPolygon: GeoJSON.Feature<GeoJSON.Polygon> | null;
  rawWfsFeatures: GeoJSON.FeatureCollection | null;
  clippedFeatures: GeoJSON.FeatureCollection | null;
  status: WfsClipStatus;
  error: string | null;

  setClippingPolygon: (
    polygon: GeoJSON.Feature<GeoJSON.Polygon> | null,
  ) => void;
  setRawWfsFeatures: (fc: GeoJSON.FeatureCollection | null) => void;
  setClippedFeatures: (fc: GeoJSON.FeatureCollection | null) => void;
  setStatus: (s: WfsClipStatus) => void;
  setError: (e: string | null) => void;
  reset: () => void;
};

