import { create } from "zustand";
import type {
  DrawGeometryType,
  DrawPoint,
  MapDrawStore,
} from "@/design-system/components/map/types/map.type";

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
