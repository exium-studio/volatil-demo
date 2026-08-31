// src/features/internal/mitra-registration/services/mitra-registration.service.ts

import {
  approveMitraRegistrationApi,
  fetchMitraRegistrationDetailApi,
  fetchMitraRegistrationsApi,
  rejectMitraRegistrationApi,
} from "@/features/internal/mitra-registration/api/mitra-registration.api";
import type {
  ApproveMitraRegistrationPayload,
  InternalMitraRegistrationItem,
  InternalMitraRegistrationListResponse,
  InternalMitraRegistrationQueryParams,
  RejectMitraRegistrationPayload,
} from "@/features/internal/mitra-registration/types/mitra-registration.type";

export const getInternalMitraRegistrationsList = async (
  params?: InternalMitraRegistrationQueryParams,
  signal?: AbortSignal,
): Promise<InternalMitraRegistrationListResponse> => {
  const response = await fetchMitraRegistrationsApi(params, signal);
  const items = response.data ?? [];
  const pagination = response.pagination ?? {
    currentPage: params?.page ?? 1,
    pageSize: params?.pageSize ?? 10,
    itemsPerPage: params?.pageSize ?? 10,
    totalItems: items.length,
    totalPages: Math.ceil(items.length / (params?.pageSize ?? 10)) || 1,
    hasNextPage: (params?.page ?? 1) < (Math.ceil(items.length / (params?.pageSize ?? 10)) || 1),
    hasPrevPage: (params?.page ?? 1) > 1,
  };

  return {
    items,
    pagination,
  };
};

export const getInternalMitraRegistrationDetail = async (
  id: string | number,
  signal?: AbortSignal,
): Promise<InternalMitraRegistrationItem | null> => {
  const response = await fetchMitraRegistrationDetailApi(id, signal);
  return response.data ?? null;
};

export const approveInternalMitraRegistration = async (
  payload: ApproveMitraRegistrationPayload,
  signal?: AbortSignal,
): Promise<InternalMitraRegistrationItem> => {
  const response = await approveMitraRegistrationApi(payload, signal);
  if (!response.data) {
    throw new Error(response.message || "Gagal menyetujui permohonan mitra.");
  }
  return response.data;
};

export const rejectInternalMitraRegistration = async (
  payload: RejectMitraRegistrationPayload,
  signal?: AbortSignal,
): Promise<InternalMitraRegistrationItem> => {
  const response = await rejectMitraRegistrationApi(payload, signal);
  if (!response.data) {
    throw new Error(response.message || "Gagal menolak permohonan mitra.");
  }
  return response.data;
};
