// src/features/map/store/map-draw.store.ts

import { create } from "zustand";
import type {
  DrawGeometryType,
  DrawPoint,
} from "@/design-system/components/map/types/map.type";

interface MapDrawStore {
  geometryType: DrawGeometryType;
  isDrawing: boolean;
  points: DrawPoint[];
  start: (geometryType: DrawGeometryType) => void;
  addPoint: (point: DrawPoint) => void;
  finish: () => void;
  cancel: () => void;
}

const initialState = {
  geometryType: "polygon" as DrawGeometryType,
  isDrawing: false,
  points: [] as DrawPoint[],
};

export const useMapDrawStore = create<MapDrawStore>((set) => ({
  ...initialState,

  start: (geometryType) => set({ geometryType, isDrawing: true, points: [] }),

  addPoint: (point) => set((state) => ({ points: [...state.points, point] })),

  finish: () => set({ isDrawing: false }),

  cancel: () => set({ ...initialState }),
}));
