import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import type { IgtDataResponse } from "@/features/data-request/types/data-request.type";
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

type DataListState = {
  perPage: number;
  page: number;
  selectedItems: FormattedListItem[];
  uploadedFiles: File[];
};

export type DataRequestAoiContextValue = {
  igtData: IgtDataResponse | null;
  dataListState: DataListState;
  setDataListState: Dispatch<SetStateAction<DataListState>>;
};

export const DataRequestAoiContext =
  createContext<DataRequestAoiContextValue | null>(null);

export function useDataRequestAoiContext() {
  const context = useContext(DataRequestAoiContext);

  if (!context) {
    throw new Error(
      "useDataRequestAoi must be used within DataRequestAoiProvider",
    );
  }

  return context;
}
