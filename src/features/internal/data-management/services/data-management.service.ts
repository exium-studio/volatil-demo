// src/features/internal/data-management/services/data-management.service.ts

import {
  createMasterIgtLayerApi,
  deleteMasterIgtLayerApi,
  fetchGeoServerWorkspaceLayersApi,
  fetchGeoServerWorkspacesApi,
  fetchMasterIgtLayersApi,
  updateMasterIgtLayerApi,
} from "@/features/internal/data-management/api/data-management.api";
import type {
  CreateMasterIgtLayerPayload,
  GeoServerWorkspaceLayersResponse,
  GeoServerWorkspacesResponse,
  MasterIgtLayersQueryParams,
  MasterIgtLayersResponse,
  UpdateMasterIgtLayerPayload,
} from "@/features/internal/data-management/types/data-management.type";

export const getMasterIgtLayers = async (
  params?: MasterIgtLayersQueryParams,
  signal?: AbortSignal,
): Promise<MasterIgtLayersResponse> => {
  return fetchMasterIgtLayersApi(params, signal);
};

export const getGeoServerWorkspaces = async (
  geoserverId: string,
  signal?: AbortSignal,
): Promise<GeoServerWorkspacesResponse> => {
  if (!geoserverId) return { workspaces: [] };
  return fetchGeoServerWorkspacesApi(geoserverId, signal);
};

export const getGeoServerWorkspaceLayers = async (
  geoserverId: string,
  workspaceName: string,
  signal?: AbortSignal,
): Promise<GeoServerWorkspaceLayersResponse> => {
  if (!geoserverId || !workspaceName) return { layers: [] };
  return fetchGeoServerWorkspaceLayersApi(geoserverId, workspaceName, signal);
};

export const createMasterIgtLayer = async (
  payload: CreateMasterIgtLayerPayload,
  signal?: AbortSignal,
): Promise<void> => {
  await createMasterIgtLayerApi(payload, signal);
};

export const updateMasterIgtLayer = async (
  payload: UpdateMasterIgtLayerPayload,
  signal?: AbortSignal,
): Promise<void> => {
  await updateMasterIgtLayerApi(payload, signal);
};

export const deleteMasterIgtLayer = async (
  id: string,
  signal?: AbortSignal,
): Promise<void> => {
  await deleteMasterIgtLayerApi(id, signal);
};
