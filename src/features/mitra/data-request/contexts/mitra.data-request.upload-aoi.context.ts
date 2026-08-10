// src/features/mitra/data-request/contexts/mitra.data-request.upload-aoi.context.ts

import type { AoiLayer } from "@/features/mitra/data-request/types/mitra.data-request.upload-aoi.type";
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

export type MitraDataRequestUploadAoiContextValue = {
  aoiLayers: AoiLayer[];
  setAoiLayers: Dispatch<SetStateAction<AoiLayer[]>>;
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
