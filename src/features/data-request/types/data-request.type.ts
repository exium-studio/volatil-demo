// src/features/data-request/types/data-request.type.ts

import type { PaginatedResponse } from "@/shared/types/response.type";
import type { IgtDataItem } from "./igt-by-aoi.type";

// Data Responses
export type IgtDataResponse = PaginatedResponse<IgtDataItem>;
