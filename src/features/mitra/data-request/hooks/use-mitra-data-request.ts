// src/features/mitra/data-request/hooks/use-mitra-data-request.ts

import { toast } from "@/design-system/components/toast";
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
    pagination: query.data?.pagination,
  };
};

export const useFetchIgtByAoi = () => {
  const toastHandlers = mutationToastHandlers("igt-fetch-by-aoi", {
    loadingMessage: {
      title: "Mengambil data IGT di area AOI Anda...",
    },
    successMessage: {
      title: "Berhasil memuat data IGT untuk area AOI",
    },
  });

  return useMutation({
    mutationFn: (geometry: GeoJSON.Polygon) => getIgtByAoi(geometry),
    onMutate: toastHandlers.onLoading,
    onSuccess: toastHandlers.onSuccess,
    onError: toastHandlers.onError,
  });
};

export const useFetchIgtByUploadedAoi = () => {
  const toastHandlers = mutationToastHandlers("igt-fetch-by-uploaded-aoi", {
    loadingMessage: {
      title: "Memproses berkas AOI dan mengambil data IGT...",
    },
    successMessage: {
      title: "Berhasil memproses berkas AOI",
    },
  });

  return useMutation({
    mutationFn: (file: File) => getIgtByUploadedAoi(file),
    onMutate: toastHandlers.onLoading,
    onSuccess: toastHandlers.onSuccess,
    onError: toastHandlers.onError,
  });
};

/** Add selected WFS features to cart (by their IDs). Dynamic toast ID per item/row. */
export const useAddToCartSelected = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (featureIds: string[]) => addSelectedToCart(featureIds),
    onMutate: (featureIds) => {
      const itemKey =
        featureIds.length === 1 ? featureIds[0] : `batch-${Date.now()}`;
      const toastId = `add-to-cart-${itemKey}`;

      const title =
        featureIds.length === 1
          ? `Menambahkan item "${featureIds[0]}" ke keranjang...`
          : `Menambahkan ${featureIds.length} item terpilih ke keranjang...`;

      toast.loading(title, { id: toastId });
      return { toastId, featureIds };
    },
    onSuccess: (_, featureIds, context) => {
      const toastId = context?.toastId ?? `add-to-cart-${Date.now()}`;

      const title =
        featureIds.length === 1
          ? `Item "${featureIds[0]}" berhasil ditambahkan ke keranjang`
          : `Berhasil menambahkan ${featureIds.length} item ke keranjang`;

      toast.success(title, { id: toastId });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.cart.all,
      });
    },
    onError: (error, _featureIds, context) => {
      const toastId = context?.toastId ?? `add-to-cart-${Date.now()}`;
      const message =
        error instanceof Error ? error.message : "Gagal menambahkan ke keranjang";
      toast.error(message, { id: toastId });
    },
  });
};

/**
 * Add ALL WFS features matching the given filter/AOI to cart.
 * Unique dynamic toast ID per layer typeName & action execution.
 */
export const useAddToCartAll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      typeName: string;
      wfsUrl: string;
      cqlFilter?: string;
    }) => addAllToCartFromWfs(params),
    onMutate: (params) => {
      const toastId = `add-to-cart-${params.typeName}-${Date.now()}`;
      toast.loading(
        `Mengambil & menambahkan seluruh item ${params.typeName} ke keranjang...`,
        { id: toastId },
      );
      return { toastId };
    },
    onSuccess: (_, params, context) => {
      const toastId = context?.toastId;
      toast.success(
        `Berhasil menambahkan seluruh item ${params.typeName} ke keranjang`,
        { id: toastId },
      );
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.cart.all,
      });
    },
    onError: (error, _params, context) => {
      const toastId = context?.toastId;
      const message =
        error instanceof Error ? error.message : "Gagal menambahkan ke keranjang";
      toast.error(message, { id: toastId });
    },
  });
};

export const useFlyToIgtGeometry = () => {
  const map = useMapInstanceStore((state) => state.map);

  return useMutation({
    mutationFn: async (params: {
      id: string;
      layerName: string;
      wfsUrl: string;
    }) => {
      const feature = await getIgtGeometryById(
        params.id,
        params.layerName,
        params.wfsUrl,
      );
      return feature;
    },
    onSuccess: (feature) => {
      if (feature && map) {
        highlightFeatureOnMap(map, feature, { zoom: 16 });
      }
    },
  });
};
