// src/features/mitra/data-request/hooks/use-mitra-data-request.ts

import { toast } from "@/design-system/components/toast";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { createCartBatch } from "@/features/mitra/cart/services/mitra.cart.service";
import type { AddToCartBatchRequest } from "@/features/mitra/cart/types/mitra.cart.batch.type";
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
    mutationFn: (params: { layerId: string; featureIds: string[] }) => {
      const payload: AddToCartBatchRequest = {
        items: [
          {
            sourceLayerId: params.layerId,
            selectionType: "catalog",
            selectedFeatureIds: params.featureIds,
          },
        ],
      };
      return createCartBatch(payload);
    },
    onMutate: (params) => {
      const itemKey =
        params.featureIds.length === 1
          ? params.featureIds[0]
          : `batch-${Date.now()}`;
      const toastId = `add-to-cart-${itemKey}`;

      const title =
        params.featureIds.length === 1
          ? `Menambahkan item "${params.featureIds[0]}" ke keranjang...`
          : `Menambahkan ${params.featureIds.length} item terpilih ke keranjang...`;

      toast.loading(title, { id: toastId, group: "Keranjang" });
      return { toastId, featureIds: params.featureIds };
    },
    onSuccess: (_, params, context) => {
      const toastId = context?.toastId ?? `add-to-cart-${Date.now()}`;

      const title =
        params.featureIds.length === 1
          ? `Item "${params.featureIds[0]}" berhasil ditambahkan ke keranjang`
          : `Berhasil menambahkan ${params.featureIds.length} item ke keranjang`;

      toast.success(title, { id: toastId, group: "Keranjang" });
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "batches"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "active-batch"],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.cart.all,
      });
    },
    onError: (error, _params, context) => {
      const toastId = context?.toastId ?? `add-to-cart-${Date.now()}`;
      const message =
        error instanceof Error
          ? error.message
          : "Gagal menambahkan ke keranjang";
      toast.error(message, { id: toastId, group: "Keranjang" });
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
      layerId: string;
      typeName: string;
      cqlFilter?: string;
    }) => {
      const payload: AddToCartBatchRequest = {
        items: [
          {
            sourceLayerId: params.layerId,
            selectionType: "catalog",
            cqlFilter: params.cqlFilter,
          },
        ],
      };
      return createCartBatch(payload);
    },
    onMutate: (params) => {
      const toastId = `add-to-cart-${params.typeName}-${Date.now()}`;
      toast.loading(`Memproses penyiapan batch data ${params.typeName}...`, {
        id: toastId,
        group: "Keranjang",
      });
      return { toastId };
    },
    onSuccess: (_, params, context) => {
      const toastId = context?.toastId;
      toast.success(
        `Batch ${params.typeName} berhasil dibuat! Sistem Interop sedang menyiapkan data.`,
        { id: toastId, group: "Keranjang" },
      );
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "active-batch"],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.mitra.cart.all,
      });
    },
    onError: (error, _params, context) => {
      const toastId = context?.toastId;
      const message =
        error instanceof Error
          ? error.message
          : "Gagal membuat batch transaksi";
      toast.error(message, { id: toastId, group: "Keranjang" });
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
