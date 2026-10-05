// src/features/user-guide/types/user-guide.type.ts

import type { ReactNode } from "react";

export type UserGuideCategory = "mitra" | "internal" | "general" | "api";

export type UserGuideTargetRole = "mitra" | "internal" | "all";

export type UserGuideItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: UserGuideCategory;
  targetRole: UserGuideTargetRole;
  version: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  isPublished: boolean;
  downloadCount: number;
  orderIndex: number;
  author: string;
  createdAt: string;
  updatedAt: string;
};

export type UserGuideQueryParams = {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  targetRole?: string;
  isPublished?: boolean;
};

export type UserGuideFormValues = {
  id?: string;
  title: string;
  description: string;
  category: UserGuideCategory;
  targetRole: UserGuideTargetRole;
  version: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  isPublished: boolean;
  orderIndex: number;
};

export type CreateUserGuidePayload = Omit<UserGuideFormValues, "id">;

export type UpdateUserGuidePayload = Partial<UserGuideFormValues>;

export type UserGuideListResponse = {
  items: UserGuideItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UserGuideModalProps = {
  modalKey?: string;
  portalType?: "mitra" | "internal" | "all";
  opened?: boolean;
  open?: () => void;
  close?: () => void;
};

export type UserGuideTriggerProps = {
  modalKey?: string;
  portalType?: "mitra" | "internal" | "all";
  variant?: "button" | "link" | "banner";
  children?: ReactNode;
};

export type UserGuideFormModalProps = {
  modalKey?: string;
  initialData?: UserGuideItem | null;
  mode?: "create" | "edit";
  children?: ReactNode;
};

export type InternalUserGuideTableViewProps = {
  initialLimit?: number;
  showPagination?: boolean;
  showFilters?: boolean;
  roundedTop?: number | string;
};
