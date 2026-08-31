// src/features/auth/hooks/use-mitra-registration.mutation.ts

import { toast } from "@/design-system/components/toast";
import {
  getMitraRegistrationStatus,
  submitMitraRegistration,
} from "@/features/auth/services/mitra-registration.service";
import type {
  MitraRegistrationCreatedData,
  MitraRegistrationFormValues,
} from "@/features/auth/types/mitra-registration.type";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useMitraRegistrationMutation = () => {
  return useMutation<MitraRegistrationCreatedData, Error, MitraRegistrationFormValues>({
    mutationFn: (values) => submitMitraRegistration(values),
    onSuccess: (data) => {
      toast.success("Permohonan Berhasil Dikirim", {
        description: `Nomor registrasi Anda: ${data.registrationNumber}. Silakan simpan nomor ini untuk memantau status persetujuan.`,
      });
    },
    onError: (error) => {
      toast.error("Gagal Mengajukan Permohonan", {
        description: error.message || "Silakan periksa kembali data yang diunggah.",
      });
    },
  });
};

export const useRegistrationStatusQuery = (
  registrationNumber: string,
  enabled: boolean = false,
) => {
  return useQuery({
    queryKey: ["public", "registration-status", registrationNumber],
    queryFn: ({ signal }) => getMitraRegistrationStatus(registrationNumber, signal),
    enabled: Boolean(registrationNumber) && enabled,
    retry: false,
  });
};
