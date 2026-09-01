// src/features/internal/mitra-registration/types/mitra-registration.type.ts

import type { MitraRegistrationStatus } from "@/features/auth/types/mitra-registration.type";
import type {
  PaginatedParams,
  PaginationMeta,
} from "@/shared/types/common-response.type";

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

export type InternalMitraRegistrationItem = {
  id: string;
  registrationNumber: string;
  userId?: number;
  organizationName: string;
  officeAddress: string;
  nib: string;
  npwp: string;
  website?: string | null;
  picName: string;
  position: string;
  email: string;
  phoneNumber: string;
  status: MitraRegistrationStatus;
  statusDescription?: string;
  documents?: MitraRegistrationDocumentsMap | null;
  contractDocument?: string | null;
  rejectionReason?: string | null;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  createdAt: string;
  updatedAt?: string;

  // Compatibility aliases
  namaInstansi?: string;
  alamatKantor?: string;
  namaPenanggungJawab?: string;
  jabatan?: string;
  nomorHp?: string;
  suratPermohonan?: string | null;
  dokumenDik?: string | null;
  suratPernyataanHukum?: string | null;
  suratKomitmenEvaluasi?: string | null;
  suratKomitmenPerbaikan?: string | null;
  proposalTeknis?: string | null;
};

export type InternalMitraRegistrationQueryParams = PaginatedParams & {
  status?: MitraRegistrationStatus | "all";
};

export type InternalMitraRegistrationListResponse = {
  items: InternalMitraRegistrationItem[];
  pagination: PaginationMeta;
};

export type ApproveMitraRegistrationPayload = {
  id: string | number;
  contractDocument: File;
};

export type RejectMitraRegistrationPayload = {
  id: string | number;
  rejectionReason: string;
};

export type MitraRegistrationDocumentItem = {
  title: string;
  url?: string | null;
  desc: string;
  mimeType?: string;
  fileName?: string;
  originalName?: string;
  size?: number;
};


