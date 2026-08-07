// src/features/mitra/data-request/contexts/mitra.data-request.upload-aoi.context.ts

import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import type { IgtDataResponse } from "@/features/mitra/data-request/types/mitra.data-request.type";
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

export type MitraDataRequestUploadAoiContextValue = {
  igtData: IgtDataResponse | null;
  dataListState: DataListState;
  setDataListState: Dispatch<SetStateAction<DataListState>>;
};

export const MitraDataRequestUploadAoiContext =
  createContext<MitraDataRequestUploadAoiContextValue | null>(null);

export function useMitraDataRequestUploadAoiContext() {
  const context = useContext(MitraDataRequestUploadAoiContext);

  if (!context) {
    throw new Error(
      "useMitraDataRequestUploadAoiContext must be used within MitraDataRequestUploadAoiContext.Provider",
    );
  }

  return context;
}
