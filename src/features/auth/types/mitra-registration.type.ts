// src/features/auth/types/mitra-registration.type.ts

import type { MitraRegistrationStatus } from "@/shared/types/status.type";

export type { MitraRegistrationStatus };

export type MitraRegistrationDocumentFile = {
  url: string;
  size?: number;
  fileName?: string;
  mimeType?: string;
  originalName?: string;
};

export type MitraRegistrationDocumentsMap = {
  suratPermohonan?: MitraRegistrationDocumentFile | null;
  dokumenDik?: MitraRegistrationDocumentFile | null;
  suratPernyataanHukum?: MitraRegistrationDocumentFile | null;
  suratKomitmenEvaluasi?: MitraRegistrationDocumentFile | null;
  suratKomitmenPerbaikan?: MitraRegistrationDocumentFile | null;
  proposalTeknis?: MitraRegistrationDocumentFile | null;
};

export type MitraRegistrationFormValues = {
  namaInstansi: string;
  alamatKantor: string;
  nib: string;
  npwp: string;
  website?: string;
  namaPenanggungJawab: string;
  jabatan: string;
  email: string;
  nomorHp: string;
  password?: string;
  suratPermohonan: File[];
  dokumenDik: File[];
  suratPernyataanHukum: File[];
  suratKomitmenEvaluasi: File[];
  suratKomitmenPerbaikan: File[];
  proposalTeknis: File[];
};

export type MitraRegistrationCreatedData = {
  id: string | number;
  registrationNumber: string;
  status: MitraRegistrationStatus;
  namaInstansi?: string;
  organizationName?: string;
  email?: string;
  createdAt?: string;
};

export type MitraRegistrationStatusData = {
  id?: string | number;
  registrationNumber: string;
  userId?: number;
  organizationName?: string;
  officeAddress?: string;
  nib?: string;
  npwp?: string;
  website?: string | null;
  picName?: string;
  position?: string;
  email?: string;
  phoneNumber?: string;
  status: MitraRegistrationStatus;
  statusDescription?: string | null;
  verifiedAt?: string | null;
  verifiedBy?: number | string | null;
  documents?: MitraRegistrationDocumentsMap | null;
  contractDocument?: MitraRegistrationDocumentFile | string | null;
  rejectionReason?: string | null;
  createdAt?: string;
  updatedAt?: string;

  // Compatibility aliases
  namaInstansi?: string;
  alamatKantor?: string;
  namaPenanggungJawab?: string;
  jabatan?: string;
  nomorHp?: string;
};
