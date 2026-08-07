// src/features/mitra/data-request/types/mitra.data-request.type.ts

import type { IgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
import type { PaginatedResponse } from "@/shared/types/response.type";

export type IgtDataResponse = PaginatedResponse<IgtDataItem>;

export type MitraDataRequestIgtDataResponse = IgtDataResponse;
