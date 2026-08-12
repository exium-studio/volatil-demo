// src/design-system/components/map/workers/shp.worker.ts

import shp from "shpjs";

self.onmessage = async (e: MessageEvent<ArrayBuffer>) => {
  try {
    const result = await shp(e.data);

    const fc: GeoJSON.FeatureCollection = Array.isArray(result)
      ? {
          type: "FeatureCollection",
          features: result.flatMap((r) => r.features),
        }
      : result;

    self.postMessage({ ok: true, data: fc });
  } catch (err) {
    self.postMessage({
      ok: false,
      error: err instanceof Error ? err.message : "Gagal memproses file .shp",
    });
  }
};
