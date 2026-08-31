// src/features/internal/mitra-registration/hooks/use-mitra-registration.query.ts

import { toast } from "@/design-system/components/toast";
import {
  approveInternalMitraRegistration,
  getInternalMitraRegistrationDetail,
  getInternalMitraRegistrationsList,
  rejectInternalMitraRegistration,
} from "@/features/internal/mitra-registration/services/mitra-registration.service";
import type {
  ApproveMitraRegistrationPayload,
  InternalMitraRegistrationItem,
  InternalMitraRegistrationListResponse,
  InternalMitraRegistrationQueryParams,
  RejectMitraRegistrationPayload,
} from "@/features/internal/mitra-registration/types/mitra-registration.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useInternalMitraRegistrationsQuery = (
  params?: InternalMitraRegistrationQueryParams,
) => {
  const query = useQuery<InternalMitraRegistrationListResponse, Error>({
    queryKey: queryKeys.internal.mitraRegistration.list(params),
    queryFn: ({ signal }) => getInternalMitraRegistrationsList(params, signal),
  });

  return {
    ...query,
    items: query.data?.items ?? [],
    pagination: query.data?.pagination,
    total: query.data?.pagination?.totalItems ?? 0,
    totalPages: query.data?.pagination?.totalPages ?? 1,
  };
};

export const useInternalMitraRegistrationDetailQuery = (
  id: string | number,
) => {
  return useQuery<InternalMitraRegistrationItem | null, Error>({
    queryKey: queryKeys.internal.mitraRegistration.detail(id),
    queryFn: ({ signal }) => getInternalMitraRegistrationDetail(id, signal),
    enabled: Boolean(id),
  });
};

export const useApproveMitraRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation<
    InternalMitraRegistrationItem,
    Error,
    ApproveMitraRegistrationPayload
  >({
    mutationFn: (payload) => approveInternalMitraRegistration(payload),
    onSuccess: (data) => {
      toast.success("Permohonan Disetujui", {
        description: `Permohonan mitra ${data.namaInstansi} berhasil disetujui. Berkas kontrak telah diunggah dan akun aktif.`,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.mitraRegistration.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.home.all,
      });
    },
    onError: (error) => {
      toast.error("Gagal Menyetujui Permohonan", {
        description: error.message || "Terjadi kesalahan saat memproses persetujuan.",
      });
    },
  });
};

export const useRejectMitraRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation<
    InternalMitraRegistrationItem,
    Error,
    RejectMitraRegistrationPayload
  >({
    mutationFn: (payload) => rejectInternalMitraRegistration(payload),
    onSuccess: (data) => {
      toast.success("Permohonan Ditolak", {
        description: `Permohonan mitra ${data.namaInstansi} telah ditolak dengan alasan resmi.`,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.mitraRegistration.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.internal.home.all,
      });
    },
    onError: (error) => {
      toast.error("Gagal Menolak Permohonan", {
        description: error.message || "Terjadi kesalahan saat memproses penolakan.",
      });
    },
  });
};
