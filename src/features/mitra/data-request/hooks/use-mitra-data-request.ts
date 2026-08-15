// src/features/mitra/data-request/hooks/use-mitra-data-request.ts

import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import {
  addAllToCartFromWfs,
  addSelectedToCart,
} from "@/features/mitra/cart/services/mitra.cart.service";
import {
  getIgtByAoi,
  getIgtByUploadedAoi,
  getIgtCatalog,
  getIgtGeometryById,
  type MitraDataRequestGetCatalogParams,
} from "@/features/mitra/data-request/services/mitra.data-request.service";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/shared/libs/toast/toast.handler";
import { highlightFeatureOnMap } from "@/features/mitra/data-request/utils/highlight-feature-on-map";
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

/** Add selected WFS features to cart (by their IDs). */
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
    mutationFn: (featureIds: string[]) => addSelectedToCart(featureIds),
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

/**
 * Add ALL WFS features matching the given filter/AOI to cart.
 * Fetches all matching feature IDs from WFS (no pagination limit), stores them.
 */
export const useAddToCartAll = () => {
  const queryClient = useQueryClient();
  const toast = mutationToastHandlers("add-to-cart-all", {
    loadingMessage: {
      title: "Mengambil & menambahkan seluruh item ke keranjang...",
    },
    successMessage: {
      title: "Berhasil menambahkan seluruh item ke keranjang",
    },
  });

  return useMutation({
    mutationFn: (params: { typeName: string; wfsUrl: string; cqlFilter?: string }) =>
      addAllToCartFromWfs(params),
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

      highlightFeatureOnMap(map, feature);
    },
  });
};
