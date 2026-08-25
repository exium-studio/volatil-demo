// src/features/mitra/my-data/services/mitra.my-data.service.ts

import { fetchMyDataApi } from "@/features/mitra/my-data/api/mitra.my-data.api";
import type {
  MyDataItem,
  MyDataQueryParams,
  MyDataResponse,
} from "@/features/mitra/my-data/types/my-data.type";
import { dummyMitraMyDataItems } from "@/shared/constants/dummy-data/dummy-my-data";
import { createPaginationMeta } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const matchesSearch = (item: MyDataItem, search: string) =>
  [
    item.id,
    item.title,
    item.spatialBasis,
    item.wfsUrl,
    item.wmsUrl,
  ].some((value) => value?.toLowerCase().includes(search));

export const getPaginatedMyData = (
  items: MyDataItem[],
  params: MyDataQueryParams,
): MyDataResponse => {
  const search = params.search?.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    const matchesStatus = !params.status || item.status === params.status;
    const matchesBasis = !params.basis || item.spatialBasis === params.basis;
    const matchesQuery = !search || matchesSearch(item, search);
    return matchesStatus && matchesBasis && matchesQuery;
  });
  const startIndex = (params.page - 1) * params.pageSize;

  return {
    items: filteredItems.slice(startIndex, startIndex + params.pageSize),
    pagination: createPaginationMeta(
      params.page,
      params.pageSize,
      filteredItems.length,
    ),
  };
};

const EMPTY_MY_DATA_RESPONSE: MyDataResponse = {
  items: [],
  pagination: createPaginationMeta(1, 10, 0),
};

export const getMyData = async (
  params: MyDataQueryParams,
  signal?: AbortSignal,
): Promise<MyDataResponse> => {
  try {
    const response = await fetchMyDataApi(params, signal);
    if (response.data) {
      return response.data;
    }
    return isDummyDataEnabled()
      ? getPaginatedMyData(dummyMitraMyDataItems, params)
      : EMPTY_MY_DATA_RESPONSE;
  } catch (error) {
    if (isDummyDataEnabled()) {
      console.warn("getMyData API error, falling back to dummy data:", error);
      return getPaginatedMyData(dummyMitraMyDataItems, params);
    }
    throw error;
  }
};
