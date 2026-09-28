// src/features/internal/master-geoserver/services/master-geoserver.service.ts

import {
  createMasterGeoserverApi,
  deleteMasterGeoserverApi,
  fetchMasterGeoserverDetailApi,
  fetchMasterGeoserverListApi,
  updateMasterGeoserverApi,
} from "@/features/internal/master-geoserver/api/master-geoserver.api";
import type {
  CreateMasterGeoserverPayload,
  MasterGeoserverItem,
  MasterGeoserverListResponse,
  MasterGeoserverQueryParams,
  UpdateMasterGeoserverPayload,
} from "@/features/internal/master-geoserver/types/master-geoserver.type";
import {
  DUMMY_MASTER_GEOSERVER_ITEMS,
  DUMMY_MASTER_GEOSERVER_RESPONSE,
} from "@/shared/constants/dummy-data/dummy-master-geoserver";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const EMPTY_RESPONSE: MasterGeoserverListResponse = {
  items: [],
  pagination: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

export const getMasterGeoserverList = async (
  params?: MasterGeoserverQueryParams,
  signal?: AbortSignal,
): Promise<MasterGeoserverListResponse> => {
  try {
    const response = await fetchMasterGeoserverListApi(params, signal);
    const resultData =
      response && "data" in response && response.data
        ? response.data
        : (response as MasterGeoserverListResponse);

    if (resultData && Array.isArray(resultData.items)) {
      return resultData;
    }

    if (isDummyDataEnabled()) {
      let filtered = DUMMY_MASTER_GEOSERVER_ITEMS.filter(
        (item) => !item.deletedAt,
      );
      if (params?.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.baseUrl.toLowerCase().includes(query) ||
            item.username.toLowerCase().includes(query),
        );
      }

      return {
        items: filtered,
        pagination: {
          totalItems: filtered.length,
          totalPages: 1,
          currentPage: 1,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    return EMPTY_RESPONSE;
  } catch (error) {
    if (isDummyDataEnabled()) {
      console.warn("getMasterGeoserverList fallback to dummy data:", error);
      return DUMMY_MASTER_GEOSERVER_RESPONSE;
    }
    return EMPTY_RESPONSE;
  }
};

export const getMasterGeoserverDetail = async (
  id: string,
  signal?: AbortSignal,
): Promise<MasterGeoserverItem | null> => {
  try {
    const response = await fetchMasterGeoserverDetailApi(id, signal);
    const resultData =
      response && "data" in response && response.data
        ? response.data
        : (response as MasterGeoserverItem);

    if (resultData?.id) {
      return resultData;
    }

    if (isDummyDataEnabled()) {
      return (
        DUMMY_MASTER_GEOSERVER_ITEMS.find((item) => item.id === id) ?? null
      );
    }

    return null;
  } catch (error) {
    if (isDummyDataEnabled()) {
      console.warn("getMasterGeoserverDetail fallback to dummy data:", error);
      return (
        DUMMY_MASTER_GEOSERVER_ITEMS.find((item) => item.id === id) ?? null
      );
    }
    return null;
  }
};

export const createMasterGeoserver = async (
  payload: CreateMasterGeoserverPayload,
  signal?: AbortSignal,
): Promise<MasterGeoserverItem> => {
  try {
    const response = await createMasterGeoserverApi(payload, signal);
    const resultData =
      response && "data" in response && response.data
        ? response.data
        : (response as MasterGeoserverItem);

    if (resultData?.id) {
      return resultData;
    }

    return {
      id: `gs_${Date.now()}`,
      ...payload,
      deletedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    if (isDummyDataEnabled()) {
      return {
        id: `gs_${Date.now()}`,
        ...payload,
        deletedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    throw error;
  }
};

export const updateMasterGeoserver = async (
  payload: UpdateMasterGeoserverPayload,
  signal?: AbortSignal,
): Promise<MasterGeoserverItem> => {
  try {
    const response = await updateMasterGeoserverApi(payload, signal);
    const resultData =
      response && "data" in response && response.data
        ? response.data
        : (response as MasterGeoserverItem);

    if (resultData?.id) {
      return resultData;
    }

    return {
      id: payload.id,
      name: payload.name || "GeoServer",
      baseUrl: payload.baseUrl || "",
      username: payload.username || "",
      password: payload.password,
      description: payload.description,
      deletedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    if (isDummyDataEnabled()) {
      return {
        id: payload.id,
        name: payload.name || "GeoServer",
        baseUrl: payload.baseUrl || "",
        username: payload.username || "",
        password: payload.password,
        description: payload.description,
        deletedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    throw error;
  }
};

export const deleteMasterGeoserver = async (
  id: string,
  signal?: AbortSignal,
): Promise<boolean> => {
  try {
    const response = await deleteMasterGeoserverApi(id, signal);
    const resultData =
      response && "data" in response && response.data
        ? response.data
        : (response as { success: boolean });

    return Boolean(resultData?.success ?? true);
  } catch (error) {
    if (isDummyDataEnabled()) {
      const found = DUMMY_MASTER_GEOSERVER_ITEMS.find((item) => item.id === id);
      if (found) {
        found.deletedAt = new Date().toISOString();
      }
      return true;
    }
    throw error;
  }
};
