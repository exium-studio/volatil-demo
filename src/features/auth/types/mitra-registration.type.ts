// src/features/auth/types/mitra-registration.type.ts

export type MitraRegistrationStatus =
  | "pending_verification"
  | "approved"
  | "rejected";

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
  email?: string;
  createdAt?: string;
};

export type MitraRegistrationStatusData = {
  id?: string | number;
  registrationNumber: string;
  namaInstansi?: string;
  status: MitraRegistrationStatus;
  statusDescription?: string;
  contractDocument?: string | null;
  rejectionReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
