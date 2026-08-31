// src/features/internal/data-management/api/data-management.api.ts

import type {
  CreateMasterIgtLayerPayload,
  GeoServerWorkspaceLayerOption,
  GeoServerWorkspaceLayersResponse,
  GeoServerWorkspacesResponse,
  MasterIgtLayersQueryParams,
  MasterIgtLayersResponse,
  UpdateMasterIgtLayerPayload,
} from "@/features/internal/data-management/types/data-management.type";
import {
  DUMMY_GEOSERVER_WORKSPACES,
  DUMMY_MASTER_IGT_LAYERS_RESPONSE,
  getGeoServerWorkspaceLayersFallback,
} from "@/shared/constants/dummy-data/dummy-master-igt-layers";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

export const fetchMasterIgtLayersApi = async (
  params?: MasterIgtLayersQueryParams,
  signal?: AbortSignal,
): Promise<MasterIgtLayersResponse> => {
  try {
    const response = await apiClient.get<
      ApiResponse<MasterIgtLayersResponse> | MasterIgtLayersResponse
    >("/api/internal/igt-layers", {
      params: {
        page: params?.page,
        pageSize: params?.pageSize,
        search: params?.search,
        spatialBasis: params?.spatialBasis,
        isActive: params?.isActive,
      },
      signal,
    });

    const resultData =
      response && "data" in response && response.data
        ? response.data
        : (response as MasterIgtLayersResponse);

    if (resultData && Array.isArray(resultData.items)) {
      return resultData;
    }

    if (isDummyDataEnabled()) {
      return DUMMY_MASTER_IGT_LAYERS_RESPONSE;
    }

    return {
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
  } catch (error) {
    if (isDummyDataEnabled()) {
      console.warn("fetchMasterIgtLayersApi fallback to dummy data:", error);
      return DUMMY_MASTER_IGT_LAYERS_RESPONSE;
    }
    throw error;
  }
};

export const fetchGeoServerWorkspacesApi = async (
  geoserverId: string,
  signal?: AbortSignal,
): Promise<GeoServerWorkspacesResponse> => {
  try {
    const response = await apiClient.get<
      | ApiResponse<GeoServerWorkspacesResponse | string[]>
      | GeoServerWorkspacesResponse
      | string[]
    >(`/api/internal/master-geoserver/${geoserverId}/workspaces`, { signal });

    const resultData =
      response && "data" in response && response.data
        ? response.data
        : response;

    if (Array.isArray(resultData)) {
      return { workspaces: resultData };
    }

    if (
      resultData &&
      typeof resultData === "object" &&
      "workspaces" in resultData &&
      Array.isArray(resultData.workspaces)
    ) {
      return resultData as GeoServerWorkspacesResponse;
    }

    if (isDummyDataEnabled()) {
      return (
        DUMMY_GEOSERVER_WORKSPACES[geoserverId] ?? {
          workspaces: ["testing_workspace", "atr_kawasan", "volatil_staging"],
        }
      );
    }

    return { workspaces: [] };
  } catch (error) {
    if (isDummyDataEnabled()) {
      return (
        DUMMY_GEOSERVER_WORKSPACES[geoserverId] ?? {
          workspaces: ["testing_workspace", "atr_kawasan", "volatil_staging"],
        }
      );
    }
    throw error;
  }
};

export const fetchGeoServerWorkspaceLayersApi = async (
  geoserverId: string,
  workspaceName: string,
  signal?: AbortSignal,
): Promise<GeoServerWorkspaceLayersResponse> => {
  try {
    const response = await apiClient.get<
      | ApiResponse<GeoServerWorkspaceLayersResponse>
      | GeoServerWorkspaceLayersResponse
    >(
      `/api/internal/master-geoserver/${geoserverId}/workspaces/${workspaceName}/layers`,
      { signal },
    );

    const resultData =
      response && "data" in response && response.data
        ? response.data
        : response;

    if (Array.isArray(resultData)) {
      return { layers: resultData as GeoServerWorkspaceLayerOption[] };
    }

    if (
      resultData &&
      typeof resultData === "object" &&
      "layers" in resultData &&
      Array.isArray(resultData.layers)
    ) {
      return resultData as GeoServerWorkspaceLayersResponse;
    }

    if (isDummyDataEnabled()) {
      return getGeoServerWorkspaceLayersFallback(geoserverId, workspaceName);
    }

    return { layers: [] };
  } catch (error) {
    if (isDummyDataEnabled()) {
      return getGeoServerWorkspaceLayersFallback(geoserverId, workspaceName);
    }
    throw error;
  }
};

export const updateMasterIgtLayerApi = async (
  payload: UpdateMasterIgtLayerPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> => {
  return apiClient.put<ApiResponse<void>>(
    `/api/internal/igt-layers/${payload.id}`,
    payload,
    { signal },
  );
};

export const createMasterIgtLayerApi = async (
  payload: CreateMasterIgtLayerPayload,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> => {
  return apiClient.post<ApiResponse<void>>(
    "/api/internal/igt-layers",
    payload,
    { signal },
  );
};

export const deleteMasterIgtLayerApi = async (
  id: string,
  signal?: AbortSignal,
): Promise<ApiResponse<void>> => {
  return apiClient.delete<ApiResponse<void>>(
    `/api/internal/igt-layers/${id}`,
    { signal },
  );
};
