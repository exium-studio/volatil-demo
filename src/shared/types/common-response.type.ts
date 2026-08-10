// src/shared/types/common-response.type.ts

// Common
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  code: string;
  errors?: Record<string, string[]>;
  timestamp: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number; // grand total items
    totalPages: number;
    totalBidang?: number;
    totalKawasan?: number;
  };
};

export type PaginatedParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export type IgtThemeItem = {
  name: string;
  description?: string | null;
};

// Auth
export type UserRole = "internal" | "mitra";

export type BaseUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type InternalUser = BaseUser & {
  role: "internal";
};

export type MitraUser = BaseUser & {
  role: "mitra";
  companyName: string;
  companyRegistrationNumber: string;
  purchasedQuota: number;
  tier: "standard" | "premium" | "enterprise";
};

export type User = InternalUser | MitraUser;

// GIS
export type GeoJsonFeature<TProperties = Record<string, unknown>> = {
  type: "Feature";
  id?: string | number;
  geometry: {
    type: "Point" | "LineString" | "Polygon" | "MultiPolygon";
    coordinates: number[] | number[][] | number[][][] | number[][][][];
  };
  properties: TProperties;
};

export type GeoJsonFeatureCollection<TProperties = Record<string, unknown>> = {
  type: "FeatureCollection";
  features: GeoJsonFeature<TProperties>[];
};
