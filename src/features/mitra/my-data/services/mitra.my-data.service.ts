// src/features/mitra/my-data/services/mitra.my-data.service.ts

import { fetchMyDataApi } from "@/features/mitra/my-data/api/mitra.my-data.api";
import type {
  MyDataItem,
  MyDataQueryParams,
  MyDataResponse,
} from "@/features/mitra/my-data/types/my-data.type";
import { dummyMitraMyDataItems } from "@/shared/constants/dummy-data/dummy-my-data";
import { createPaginationMeta } from "@/shared/types/common-response.type";

const matchesSearch = (item: MyDataItem, search: string) =>
  [
    item.id,
    item.name,
    item.basis,
    item.purchasedBy.name,
    item.purchasedBy.email,
    item.transactionStatus,
    item.wfsUrl,
  ].some((value) => value?.toLocaleLowerCase().includes(search));

export const getPaginatedMyData = (
  items: MyDataItem[],
  params: MyDataQueryParams,
): MyDataResponse => {
  const search = params.search?.trim().toLocaleLowerCase();
  const filteredItems = items.filter((item) => {
    const matchesStatus = item.status === params.status;
    const matchesWfs = !params.basis || item.basis === params.basis;
    const matchesQuery = !search || matchesSearch(item, search);
    return matchesStatus && matchesWfs && matchesQuery;
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

export const getMyData = async (
  params: MyDataQueryParams,
  signal?: AbortSignal,
): Promise<MyDataResponse> => {
  try {
    const response = await fetchMyDataApi(params, signal);
    return response.data ?? getPaginatedMyData(dummyMitraMyDataItems, params);
  } catch (error) {
    console.warn("getMyData API error, falling back to dummy data:", error);
    return getPaginatedMyData(dummyMitraMyDataItems, params);
  }
};
