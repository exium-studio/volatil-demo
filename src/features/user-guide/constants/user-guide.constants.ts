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
  UsersIcon,
} from "lucide-react";

export const USER_GUIDE_CATEGORY_MAP: Record<
  UserGuideCategory,
  { label: string; colorPalette: string; icon: typeof BookOpenIcon }
> = {
  mitra: {
    label: "Portal Mitra",
    colorPalette: "blue",
    icon: UsersIcon,
  },
  internal: {
    label: "Portal Internal",
    colorPalette: "purple",
    icon: ShieldCheckIcon,
  },
  general: {
    label: "Panduan Umum",
    colorPalette: "teal",
    icon: FileTextIcon,
  },
  api: {
    label: "Integrasi API / GIS",
    colorPalette: "amber",
    icon: Code2Icon,
  },
};

export const USER_GUIDE_TARGET_ROLE_MAP: Record<
  UserGuideTargetRole,
  { label: string; colorPalette: string }
> = {
  mitra: {
    label: "Mitra Saja",
    colorPalette: "blue",
  },
  internal: {
    label: "Internal Saja",
    colorPalette: "purple",
  },
  all: {
    label: "Semua Pengguna",
    colorPalette: "green",
  },
};

export const USER_GUIDE_CATEGORY_OPTIONS: FocusSelectOption[] = [
  { value: "all", label: "Semua Kategori" },
  { value: "mitra", label: "Portal Mitra" },
  { value: "internal", label: "Portal Internal" },
  { value: "general", label: "Panduan Umum" },
  { value: "api", label: "Integrasi API / GIS" },
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
