// src/features/mitra/data-request/types/mitra.data-request.type.ts

import type { MitraDataRequestIgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
import type { PaginatedResponse } from "@/shared/types/common-response.type";

export type MitraDataRequestIgtDataResponse = PaginatedResponse<MitraDataRequestIgtDataItem>;

// Aliases for compatibility
export type IgtDataResponse = MitraDataRequestIgtDataResponse;
