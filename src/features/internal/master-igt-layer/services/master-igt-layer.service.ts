// src/features/internal/master-igt-layer/services/master-igt-layer.service.ts

import {
  createMasterIgtLayerApi,
  deleteMasterIgtLayerApi,
  fetchGeoServerWorkspaceLayersApi,
  fetchGeoServerWorkspacesApi,
  fetchMasterIgtLayerByIdApi,
  fetchMasterIgtLayersApi,
  updateMasterIgtLayerApi,
  updateMasterIgtLayerAttributesApi,
} from "@/features/internal/master-igt-layer/api/master-igt-layer.api";
import type {
  CreateMasterIgtLayerPayload,
  GeoServerWorkspaceLayersResponse,
  GeoServerWorkspacesResponse,
  MasterIgtLayerItem,
  MasterIgtLayersQueryParams,
  MasterIgtLayersResponse,
  UpdateMasterIgtLayerAttributesPayload,
  UpdateMasterIgtLayerPayload,
} from "@/features/internal/master-igt-layer/types/master-igt-layer.type";

export const getMasterIgtLayers = async (
  params?: MasterIgtLayersQueryParams,
  signal?: AbortSignal,
): Promise<MasterIgtLayersResponse> => {
  return fetchMasterIgtLayersApi(params, signal);
};

export const getMasterIgtLayerById = async (
  id: string,
  signal?: AbortSignal,
): Promise<MasterIgtLayerItem | null> => {
  if (!id) return null;
  return fetchMasterIgtLayerByIdApi(id, signal);
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

export const updateMasterIgtLayerAttributes = async (
  payload: UpdateMasterIgtLayerAttributesPayload,
  signal?: AbortSignal,
): Promise<void> => {
  await updateMasterIgtLayerAttributesApi(payload, signal);
};

export const deleteMasterIgtLayer = async (
  id: string,
  signal?: AbortSignal,
): Promise<void> => {
  await deleteMasterIgtLayerApi(id, signal);
};
