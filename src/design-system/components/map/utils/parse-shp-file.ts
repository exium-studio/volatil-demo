// src/design-system/components/map/utils/parse-shp-file.ts

import type { ShpWorkerResult } from "@/design-system/components/map/types/map.utils.type";
import ShpWorker from "@/design-system/components/map/workers/shp.worker.ts?worker";
import type GeoJSON from "geojson";

export const parseShpFile = (
  file: File,
): Promise<GeoJSON.FeatureCollection> => {
  return new Promise((resolve, reject) => {
    const worker = new ShpWorker();

    worker.onmessage = (e: MessageEvent<ShpWorkerResult>) => {
      worker.terminate();
      if (e.data.ok) {
        resolve(e.data.data);
      } else {
        reject(new Error(e.data.error));
      }
    };

    worker.onerror = (err) => {
      worker.terminate();
      reject(new Error(err.message));
    };

    void file.arrayBuffer().then((buffer) => {
      worker.postMessage(buffer, [buffer]);
    });
  });
};
