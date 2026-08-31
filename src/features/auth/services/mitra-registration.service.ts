// src/features/auth/services/mitra-registration.service.ts

import {
  fetchRegistrationStatusApi,
  postRegisterMitraApi,
} from "@/features/auth/api/mitra-registration.api";
import type {
  MitraRegistrationCreatedData,
  MitraRegistrationFormValues,
  MitraRegistrationStatusData,
} from "@/features/auth/types/mitra-registration.type";

export const submitMitraRegistration = async (
  values: MitraRegistrationFormValues,
  signal?: AbortSignal,
): Promise<MitraRegistrationCreatedData> => {
  const formData = new FormData();

  // Text Fields
  formData.append("namaInstansi", values.namaInstansi.trim());
  formData.append("alamatKantor", values.alamatKantor.trim());
  formData.append("nib", values.nib.trim());
  formData.append("npwp", values.npwp.trim());
  if (values.website?.trim()) {
    formData.append("website", values.website.trim());
  }
  formData.append("namaPenanggungJawab", values.namaPenanggungJawab.trim());
  formData.append("jabatan", values.jabatan.trim());
  formData.append("email", values.email.trim());
  formData.append("nomorHp", values.nomorHp.trim());
  if (values.password?.trim()) {
    formData.append("password", values.password.trim());
  }

  // 6 Required Documents
  if (values.suratPermohonan[0]) {
    formData.append("suratPermohonan", values.suratPermohonan[0]);
  }
  if (values.dokumenDik[0]) {
    formData.append("dokumenDik", values.dokumenDik[0]);
  }
  if (values.suratPernyataanHukum[0]) {
    formData.append("suratPernyataanHukum", values.suratPernyataanHukum[0]);
  }
  if (values.suratKomitmenEvaluasi[0]) {
    formData.append("suratKomitmenEvaluasi", values.suratKomitmenEvaluasi[0]);
  }
  if (values.suratKomitmenPerbaikan[0]) {
    formData.append("suratKomitmenPerbaikan", values.suratKomitmenPerbaikan[0]);
  }
  if (values.proposalTeknis[0]) {
    formData.append("proposalTeknis", values.proposalTeknis[0]);
  }

  const response = await postRegisterMitraApi(formData, signal);
  if (!response.data) {
    throw new Error(response.message || "Gagal mengajukan permohonan mitra.");
  }
  return response.data;
};

export const getMitraRegistrationStatus = async (
  registrationNumber: string,
  signal?: AbortSignal,
): Promise<MitraRegistrationStatusData> => {
  const response = await fetchRegistrationStatusApi(registrationNumber, signal);
  if (!response.data) {
    throw new Error(
      response.message || "Nomor registrasi tidak ditemukan atau belum terdaftar.",
    );
  }
  return response.data;
};
