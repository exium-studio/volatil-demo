// src/features/data-request/contexts/data-request.upload-aoi.context.ts

import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import type { IgtDataResponse } from "@/features/data-request/types/data-request.type";
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

type DataListState = {
  selectedItems: FormattedListItem[];
  uploadedFiles: File[];
};

export type DataRequestUploadAoiContextValue = {
  igtData: IgtDataResponse | null;
  dataListState: DataListState;
  setDataListState: Dispatch<SetStateAction<DataListState>>;
};

export const DataRequestUploadAoiContext =
  createContext<DataRequestUploadAoiContextValue | null>(null);

export function useDataRequestUploadAoiContext() {
  const context = useContext(DataRequestUploadAoiContext);

  if (!context) {
    throw new Error(
      "useDataRequestUploadAoiContext must be used within DataRequestUploadAoiContext.Provider",
    );
  }

  return context;
}
