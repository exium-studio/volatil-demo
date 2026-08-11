// src/features/mitra/data-request/hooks/use-mitra-data-request.ts

import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import {
  addToCartAll,
  addToCartSelected,
  getIgtByAoi,
  getIgtByUploadedAoi,
  getIgtCatalog,
  getIgtGeometryById,
  type MitraDataRequestGetCatalogParams,
} from "@/features/mitra/data-request/services/mitra.data-request.api";
import type {
  MitraDataRequestAddAllPayload,
  MitraDataRequestAddSelectedPayload,
} from "@/features/mitra/data-request/types/mitra.data-request.cart.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type GeoJSON from "geojson";

export const useIgtCatalog = (params?: MitraDataRequestGetCatalogParams) => {
  const query = useQuery({
    queryKey: queryKeys.mitra.dataRequest.catalog(params),
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

export const useAddToCartSelected = () => {
  const queryClient = useQueryClient();
  const toast = mutationToastHandlers("add-to-cart-selected", {
    loadingMessage: {
      title: "Menambahkan item terpilih ke keranjang...",
    },
    successMessage: {
      title: "Berhasil menambahkan item ke keranjang",
    },
  });

  return useMutation({
    mutationFn: (payload: MitraDataRequestAddSelectedPayload) =>
      addToCartSelected(payload),
    onMutate: toast.onLoading,
    onSuccess: () => {
      toast.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.cart.all,
      });
    },
    onError: toast.onError,
  });
};

export const useAddToCartAll = () => {
  const queryClient = useQueryClient();
  const toast = mutationToastHandlers("add-to-cart-all", {
    loadingMessage: {
      title: "Menambahkan seluruh item ke keranjang...",
    },
    successMessage: {
      title: "Berhasil menambahkan seluruh item ke keranjang",
    },
  });

  return useMutation({
    mutationFn: (payload: MitraDataRequestAddAllPayload) =>
      addToCartAll(payload),
    onMutate: toast.onLoading,
    onSuccess: () => {
      toast.onSuccess();
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.cart.all,
      });
    },
    onError: toast.onError,
  });
};

export const useFlyToIgtGeometry = () => {
  const map = useMapInstanceStore((state) => state.map);

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
        const sumLng = ring.reduce((acc: number, c: number[]) => acc + c[0], 0);
        const sumLat = ring.reduce((acc: number, c: number[]) => acc + c[1], 0);
        lng = sumLng / ring.length;
        lat = sumLat / ring.length;
      }

      map.flyTo({ center: [lng, lat], zoom: 16 });
    },
  });
};
