// src/features/user-guide/constants/user-guide.constants.ts

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import type {
  UserGuideCategory,
  UserGuideTargetRole,
} from "@/features/user-guide/types/user-guide.type";
import {
  BookOpenIcon,
  Code2Icon,
  FileTextIcon,
  ShieldCheckIcon,
} from "lucide-react";

export const USER_GUIDE_CATEGORY_MAP: Record<
  UserGuideCategory,
  { label: string; colorPalette: string; icon: typeof BookOpenIcon }
> = {
  manual_book: {
    label: "Buku Panduan",
    colorPalette: "blue",
    icon: BookOpenIcon,
  },
  sop: {
    label: "SOP & Prosedur",
    colorPalette: "purple",
    icon: ShieldCheckIcon,
  },
  technical_spec: {
    label: "Spesifikasi Teknis",
    colorPalette: "amber",
    icon: Code2Icon,
  },
  regulation: {
    label: "Regulasi & Kebijakan",
    colorPalette: "teal",
    icon: FileTextIcon,
  },
};

export const USER_GUIDE_TARGET_ROLE_MAP: Record<
  UserGuideTargetRole,
  { label: string; colorPalette: string }
> = {
  all: {
    label: "Semua Pengguna",
    colorPalette: "green",
  },
  mitra: {
    label: "Mitra Saja",
    colorPalette: "blue",
  },
  internal: {
    label: "Internal Saja",
    colorPalette: "purple",
  },
};

export const USER_GUIDE_CATEGORY_OPTIONS: FocusSelectOption[] = [
  { value: "all", label: "Semua Kategori" },
  { value: "manual_book", label: "Buku Panduan" },
  { value: "sop", label: "SOP & Prosedur" },
  { value: "technical_spec", label: "Spesifikasi Teknis" },
  { value: "regulation", label: "Regulasi & Kebijakan" },
];

export const USER_GUIDE_TARGET_ROLE_OPTIONS: FocusSelectOption[] = [
  { value: "all", label: "Semua Pengguna" },
  { value: "mitra", label: "Mitra" },
  { value: "internal", label: "Internal" },
];

export const USER_GUIDE_PUBLISH_STATUS_OPTIONS: FocusSelectOption[] = [
  { value: "all", label: "Semua Status" },
  { value: "published", label: "Dipublikasikan" },
  { value: "draft", label: "Draf" },
];

/**
 * Resolves the MIME type from fileName or fileType for various document formats.
 */
export const resolveUserGuideMimeType = (
  fileName?: string,
  fileType?: string,
): string => {
  const ext = (
    fileName?.split(".").pop() ||
    fileType ||
    ""
  ).toLowerCase();

  switch (ext) {
    case "pdf":
      return "application/pdf";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "xls":
      return "application/vnd.ms-excel";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "ppt":
      return "application/vnd.ms-powerpoint";
    case "pptx":
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case "txt":
      return "text/plain";
    case "zip":
      return "application/zip";
    default:
      return "application/octet-stream";
  }
};
