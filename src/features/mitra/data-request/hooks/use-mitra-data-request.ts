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
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
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

export const useIgtByAoi = () => {
  const toastHandlers = mutationToastHandlers("igt-by-aoi", {
    group: "Pencarian AOI",
    loadingMessage: { title: "Mencari data spasial berdasarkan AOI..." },
    successMessage: { title: "Data spasial berhasil ditemukan!" },
    errorMessage: { title: "Gagal mengambil data berdasarkan AOI" },
  });

  return useMutation({
    mutationFn: (geometry: GeoJSON.Polygon) => getIgtByAoi(geometry),
    onMutate: toastHandlers.onLoading,
    onSuccess: (data) => {
      toastHandlers.onSuccess();
      return data;
    },
    onError: toastHandlers.onError,
  });
};

export const useIgtByUploadedAoi = () => {
  const toastHandlers = mutationToastHandlers("igt-by-uploaded-aoi", {
    group: "Upload AOI",
    loadingMessage: { title: "Mengunggah file AOI dan memproses..." },
    successMessage: { title: "File AOI berhasil diproses!" },
    errorMessage: { title: "Gagal memproses file AOI" },
  });

  return useMutation({
    mutationFn: (file: File) => getIgtByUploadedAoi(file),
    onMutate: toastHandlers.onLoading,
    onSuccess: (data) => {
      toastHandlers.onSuccess();
      return data;
    },
    onError: toastHandlers.onError,
  });
};

export type AddToCartLayerParam = {
  layerId: string;
  typeName: string;
  title?: string;
  spatialBasis?: "bidang" | "kawasan";
  featuresCount?: number;
  areaHa?: number;
  cqlFilter?: string;
};

/**
 * Add ALL WFS features matching the given filter/AOI to cart.
 */
export const useAddToCartAll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: AddToCartLayerParam) => {
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
      const layerDisplayName =
        params.title ||
        params.typeName.split(":")[1]?.replace(/_/g, " ") ||
        params.typeName;
      const toastId = `add-to-cart-${params.layerId}-${Date.now()}`;
      toast.loading(`Menambahkan data layer "${layerDisplayName}" ke keranjang...`, {
        id: toastId,
        group: "Keranjang",
      });
      return { toastId };
    },
    onSuccess: (_, params, context) => {
      const toastId = context?.toastId;
      const layerDisplayName =
        params.title ||
        params.typeName.split(":")[1]?.replace(/_/g, " ") ||
        params.typeName;

      let countDetail = "";
      if (params.spatialBasis === "bidang" && (params.featuresCount ?? 0) > 0) {
        countDetail = ` (${formatNumber(params.featuresCount ?? 0)} bidang)`;
      } else if (
        params.spatialBasis === "kawasan" &&
        (params.areaHa ?? 0) > 0
      ) {
        countDetail = ` (${formatNumber(params.areaHa ?? 0, { maximumFractionDigits: 2 })} ha)`;
      }

      toast.success(
        `Batch "${layerDisplayName}"${countDetail} berhasil ditambahkan ke keranjang transaksi! Total tagihan siap dibayar.`,
        { id: toastId, group: "Keranjang" },
      );
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "active-batch"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["mitra", "cart", "batches"],
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

/**
 * Add multiple selected IGT layers to cart in a single request and 1 toast.
 */
export const useAddToCartMultipleLayers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { layers: AddToCartLayerParam[] }) => {
      const payload: AddToCartBatchRequest = {
        items: params.layers.map((l) => ({
          sourceLayerId: l.layerId,
          selectionType: "catalog",
          cqlFilter: l.cqlFilter,
        })),
      };
      return createCartBatch(payload);
    },
    onMutate: (params) => {
      const count = params.layers.length;
      const toastId = `add-to-cart-multi-${Date.now()}`;
      const firstLayerTitle =
        params.layers[0]?.title ||
        params.layers[0]?.typeName.split(":")[1]?.replace(/_/g, " ") ||
        params.layers[0]?.typeName;

      const title =
        count === 1
          ? `Menambahkan layer "${firstLayerTitle}" ke keranjang...`
          : `Menambahkan ${count} Layer IGT ke keranjang...`;

      toast.loading(title, { id: toastId, group: "Keranjang" });
      return { toastId, count };
    },
    onSuccess: (_, params, context) => {
      const toastId = context?.toastId ?? `add-to-cart-${Date.now()}`;
      const count = params.layers.length;

      let totalBidang = 0;
      let totalKawasanHa = 0;

      params.layers.forEach((l) => {
        if (l.spatialBasis === "bidang") {
          totalBidang += l.featuresCount ?? 0;
        } else if (l.spatialBasis === "kawasan") {
          totalKawasanHa += l.areaHa ?? 0;
        }
      });

      const countParts: string[] = [];
      if (totalBidang > 0) {
        countParts.push(`${formatNumber(totalBidang)} bidang`);
      }
      if (totalKawasanHa > 0) {
        countParts.push(
          `${formatNumber(totalKawasanHa, { maximumFractionDigits: 2 })} ha`,
        );
      }
      const countDetail =
        countParts.length > 0 ? ` (${countParts.join(", ")})` : "";

      const firstLayerTitle =
        params.layers[0]?.title ||
        params.layers[0]?.typeName.split(":")[1]?.replace(/_/g, " ") ||
        params.layers[0]?.typeName;

      const title =
        count === 1
          ? `Layer "${firstLayerTitle}"${countDetail} berhasil ditambahkan ke keranjang`
          : `Berhasil menambahkan ${count} Layer IGT${countDetail} ke keranjang`;

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
