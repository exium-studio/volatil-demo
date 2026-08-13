import { getPaginatedMyData } from "@/features/mitra/my-data/services/my-data.service";
import type {
  MyDataQueryParams,
  MyDataResponse,
} from "@/features/mitra/my-data/types/my-data.type";
import { dummyMitraMyDataItems } from "@/shared/constants/dummy-data/dummy-my-data";
import { apiClient } from "@/shared/libs/api-client/api-client";
import type { ApiResponse } from "@/shared/types/common-response.type";

export const getMyData = async (
  params: MyDataQueryParams,
  signal?: AbortSignal,
): Promise<MyDataResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<MyDataResponse>>(
      "/mitra/my-data",
      { params, signal },
    );
    return response.data ?? getPaginatedMyData(dummyMitraMyDataItems, params);
  } catch (error) {
    console.warn("getMyData API error, falling back to dummy data:", error);
    return getPaginatedMyData(dummyMitraMyDataItems, params);
  }
};
