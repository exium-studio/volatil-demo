// src/features/internal/master-geoserver/types/master-geoserver.type.ts

import type {
  PaginatedParams,
  PaginationMeta,
} from "@/shared/types/common-response.type";

export type MasterGeoserverItem = {
  id: string;
  name: string;
  baseUrl: string;
  username: string;
  password?: string;
  description?: string;
  isActive?: boolean;
  status?: "active" | "inactive" | "unreachable";
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MasterGeoserverQueryParams = PaginatedParams;

export type MasterGeoserverListResponse = {
  items: MasterGeoserverItem[];
  pagination: PaginationMeta;
};

export type CreateMasterGeoserverPayload = {
  name: string;
  baseUrl: string;
  username: string;
  password?: string;
  description?: string;
  isActive?: boolean;
};

export type UpdateMasterGeoserverPayload =
  Partial<CreateMasterGeoserverPayload> & {
    id: string;
  };

export type TestGeoserverConnectionPayload = {
  baseUrl: string;
  username?: string;
  password?: string;
};

export type TestGeoserverConnectionResponse = {
  success: boolean;
  message: string;
  version?: string;
  latencyMs?: number;
  workspacesCount?: number;
};

import { masterGeoserverFormSchema } from "@/features/internal/master-geoserver/types/master-geoserver.schema";
import type { ReactNode } from "react";
import type { z } from "zod";
export type MasterGeoserverFormValues = z.infer<typeof masterGeoserverFormSchema>;

export type InternalMasterGeoserverCreateTriggerProps = {
  modalKey?: string;
  children?: ReactNode;
};

export type InternalMasterGeoserverCreateModalContentProps = {
  close: () => void;
};

export type InternalMasterGeoserverEditTriggerProps = {
  modalKey?: string;
  item: MasterGeoserverItem;
  children?: ReactNode;
};

export type InternalMasterGeoserverEditModalContentProps = {
  item: MasterGeoserverItem;
  close: () => void;
};

export type InternalMasterGeoserverTestResultAlertProps = {
  testResult?: TestGeoserverConnectionResponse | null;
  testError?: string | null;
};

