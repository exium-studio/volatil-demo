// src/features/mitra/my-data/services/mitra.my-data.service.ts

import {
  fetchMitraWorkspaceDetailApi,
  fetchMitraWorkspacesApi,
  fetchMyDataApi,
  updateMyDataItemApi,
} from "@/features/mitra/my-data/api/mitra.my-data.api";
import type {
  MitraWorkspaceItem,
  MitraWorkspaceListResponse,
  MitraWorkspaceQueryParams,
  MyDataItem,
  MyDataQueryParams,
  MyDataResponse,
  UpdateMyDataItemPayload,
} from "@/features/mitra/my-data/types/my-data.type";
import {
  dummyApiKey,
  dummyMitraMyDataItems,
  dummyMitraWorkspaces,
  dummyWorkspaceUrl,
} from "@/shared/constants/dummy-data/dummy-my-data";
import { createPaginationMeta } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

export const getPaginatedWorkspaces = (
  items: MitraWorkspaceItem[],
  params?: MitraWorkspaceQueryParams,
): MitraWorkspaceListResponse => {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const search = params?.search?.trim().toLowerCase();

  const filtered = items.filter((item) => {
    const matchesStatus = !params?.status || item.status === params.status;
    const matchesQuery =
      !search ||
      item.workspaceName.toLowerCase().includes(search) ||
      (item.orderNumber && item.orderNumber.toLowerCase().includes(search)) ||
      (item.transactionNumber &&
        item.transactionNumber.toLowerCase().includes(search)) ||
      (item.wmsUrl && item.wmsUrl.toLowerCase().includes(search)) ||
      item.layers.some((l) => l.title.toLowerCase().includes(search));

    return matchesStatus && matchesQuery;
  });

  const startIndex = (page - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  return {
    items: paginated,
    pagination: createPaginationMeta(page, pageSize, filtered.length),
  };
};

export const getMitraWorkspaces = async (
  params?: MitraWorkspaceQueryParams,
  signal?: AbortSignal,
): Promise<MitraWorkspaceListResponse> => {
  try {
    const response = await fetchMitraWorkspacesApi(params, signal);
    if (response.data) {
      return response.data;
    }
    return isDummyDataEnabled()
      ? getPaginatedWorkspaces(dummyMitraWorkspaces, params)
      : { items: [], pagination: createPaginationMeta(1, 10, 0) };
  } catch (error) {
    if (isDummyDataEnabled()) {
      return getPaginatedWorkspaces(dummyMitraWorkspaces, params);
    }
    throw error;
  }
};

export const getMitraWorkspaceDetail = async (
  workspaceId: string,
  signal?: AbortSignal,
): Promise<MitraWorkspaceItem | null> => {
  try {
    const response = await fetchMitraWorkspaceDetailApi(workspaceId, signal);
    if (response.data) {
      return response.data;
    }
    if (isDummyDataEnabled()) {
      return (
        dummyMitraWorkspaces.find(
          (w) =>
            w.id === workspaceId ||
            w.orderId === workspaceId ||
            w.workspaceName === workspaceId,
        ) ?? null
      );
    }
    return null;
  } catch (error) {
    if (isDummyDataEnabled()) {
      return (
        dummyMitraWorkspaces.find(
          (w) =>
            w.id === workspaceId ||
            w.orderId === workspaceId ||
            w.workspaceName === workspaceId,
        ) ?? null
      );
    }
    throw error;
  }
};

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
    apiKey: dummyApiKey,
    workspaceUrl: dummyWorkspaceUrl,
    pagination: createPaginationMeta(
      params.page,
      params.pageSize,
      filteredItems.length,
    ),
  };
};

const EMPTY_MY_DATA_RESPONSE: MyDataResponse = {
  items: [],
  apiKey: null,
  workspaceUrl: null,
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

export const updateMyData = async (
  id: string,
  payload: UpdateMyDataItemPayload,
): Promise<MyDataItem> => {
  try {
    const response = await updateMyDataItemApi(id, payload);
    if (response.data) {
      return response.data;
    }
    throw new Error("No data returned from updateMyDataItemApi");
  } catch (error) {
    if (isDummyDataEnabled()) {
      const existing = dummyMitraMyDataItems.find((item) => item.id === id);
      if (!existing) {
        throw new Error(`Data layer dengan ID ${id} tidak ditemukan`, {
          cause: error,
        });
      }
      existing.label = payload.label;
      return existing;
    }
    throw error;
  }
};



