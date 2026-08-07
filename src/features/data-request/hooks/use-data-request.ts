// src/features/data-request/hooks/use-data-request.ts

import { useGlobalMap } from "@/features/clip/hooks/use-global-map";
import {
  getIgtByAoi,
  getIgtByUploadedAoi,
  getIgtCatalog,
  getIgtGeometryById,
  type GetIgtCatalogParams,
} from "@/features/data-request/services/data-request.api";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation, useQuery } from "@tanstack/react-query";
import type GeoJSON from "geojson";

export const useIgtCatalog = (params?: GetIgtCatalogParams) => {
  const query = useQuery({
    queryKey: queryKeys.dataRequest.catalog(params),
    queryFn: ({ signal }) => getIgtCatalog(params, signal),
  });

  return {
    ...query,
    igtData: query.data,
    items: query.data?.items ?? [],
    meta: query.data?.meta,
  };
};

export const useFetchIgtByAoi = () => {
  const toast = mutationToastHandlers("igt-fetch-by-aoi", {
    loadingMessage: {
      title: "Mengambil data IGT di area AOI Anda...",
    },
    successMessage: {
      title: "Data IGT berhasil ditemukan",
    },
  });

  return useMutation({
    mutationFn: (geometry: GeoJSON.Polygon) => getIgtByAoi(geometry),
    onMutate: toast.onLoading,
    onSuccess: toast.onSuccess,
    onError: toast.onError,
  });
};

export const useFetchIgtByUploadedAoi = () => {
  const toast = mutationToastHandlers("igt-fetch-by-uploaded-aoi", {
    loadingMessage: {
      title: "Memproses file AOI Anda...",
    },
    successMessage: {
      title: "Data IGT berbasis AOI berhasil diproses",
    },
  });

  return useMutation({
    mutationFn: (file: File) => getIgtByUploadedAoi(file),
    onMutate: toast.onLoading,
    onSuccess: toast.onSuccess,
    onError: toast.onError,
  });
};

export const useFlyToIgtGeometry = () => {
  const map = useGlobalMap();

  return useMutation({
    mutationFn: async (id: string) => {
      const fc = await getIgtGeometryById(id);
      const feature = fc.features[0];
      if (!feature?.geometry || !map) return;

      const geom = feature.geometry;
      let lng = 0;
      let lat = 0;

      if (geom.type === "Point") {
        [lng, lat] = geom.coordinates as [number, number];
      } else if (geom.type === "Polygon" && geom.coordinates[0]?.length > 0) {
        const ring = geom.coordinates[0];
        const sumLng = ring.reduce((acc, c) => acc + c[0], 0);
        const sumLat = ring.reduce((acc, c) => acc + c[1], 0);
        lng = sumLng / ring.length;
        lat = sumLat / ring.length;
      }

      map.flyTo({ center: [lng, lat], zoom: 16 });
    },
  });
};
