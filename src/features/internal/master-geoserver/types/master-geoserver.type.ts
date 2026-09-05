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
};

export type UpdateMasterGeoserverPayload =
  Partial<CreateMasterGeoserverPayload> & {
    id: string;
  };

import { masterGeoserverFormSchema } from "@/features/internal/master-geoserver/types/master-geoserver.schema";
import type { z } from "zod";
export type MasterGeoserverFormValues = z.infer<typeof masterGeoserverFormSchema>;
