// src/design-system/components/overlay/stores/dialog-animation-store.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const DIALOG_OFFSET_X_VAR = "--dialog-offset-x";
export const DIALOG_OFFSET_Y_VAR = "--dialog-offset-y";

type Point = {
  x: number;
  y: number;
};

type DialogAnimationState = {
  clickOrigin: Point;
  dialogOffset: Point;
};

type DialogAnimationStore = {
  dialogs: Record<string, DialogAnimationState>;
  zIndexCounter: number;

  setClickOrigin: (modalKey: string, clickOrigin: Point) => void;
  setDialogOffset: (modalKey: string, dialogOffset: Point) => void;

  getClickOrigin: (modalKey: string) => Point;
  getDialogOffset: (modalKey: string) => Point;

  clear: (modalKey: string) => void;
};

const DEFAULT_POINT: Point = { x: 0, y: 0 };

export const useDialogAnimationStore = create<DialogAnimationStore>()(
  persist(
    (set, get) => ({
      dialogs: {},
      zIndexCounter: 0,

      setClickOrigin(modalKey, clickOrigin) {
        set((state) => ({
          dialogs: {
            ...state.dialogs,
            [modalKey]: {
              clickOrigin,
              dialogOffset:
                state.dialogs[modalKey]?.dialogOffset ?? DEFAULT_POINT,
            },
          },
        }));
      },

      setDialogOffset(modalKey, dialogOffset) {
        set((state) => ({
          dialogs: {
            ...state.dialogs,
            [modalKey]: {
              clickOrigin:
                state.dialogs[modalKey]?.clickOrigin ?? DEFAULT_POINT,
              dialogOffset,
            },
          },
        }));
      },

      getClickOrigin(modalKey) {
        return get().dialogs[modalKey]?.clickOrigin ?? DEFAULT_POINT;
      },

      getDialogOffset(modalKey) {
        return get().dialogs[modalKey]?.dialogOffset ?? DEFAULT_POINT;
      },

      clear(modalKey) {
        set((state) => {
          const dialogs = { ...state.dialogs };
          delete dialogs[modalKey];
          return { dialogs };
        });
      },
    }),
    {
      name: "dialog-animation",

      partialize: (state) => ({
        dialogs: Object.fromEntries(
          Object.entries(state.dialogs).map(([modalKey, data]) => [
            modalKey,
            {
              clickOrigin: data.clickOrigin,
              dialogOffset: DEFAULT_POINT,
            },
          ]),
        ),
      }),
    },
  ),
);

let lastGlobalPointerPoint: Point | null = null;

if (typeof window !== "undefined") {
  window.addEventListener(
    "pointerdown",
    (e: PointerEvent) => {
      lastGlobalPointerPoint = {
        x: e.clientX,
        y: e.clientY,
      };
    },
    { capture: true, passive: true },
  );
}

export function updateClickOrigin(
  modalKey: string,
  target?: EventTarget | HTMLElement | Point | null,
) {
  if (
    target &&
    typeof target === "object" &&
    "x" in target &&
    "y" in target &&
    typeof (target as Point).x === "number" &&
    typeof (target as Point).y === "number"
  ) {
    useDialogAnimationStore.getState().setClickOrigin(modalKey, target as Point);
    return;
  }

  if (target instanceof HTMLElement) {
    const rect = target.getBoundingClientRect();
    useDialogAnimationStore.getState().setClickOrigin(modalKey, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    return;
  }

  if (lastGlobalPointerPoint) {
    useDialogAnimationStore
      .getState()
      .setClickOrigin(modalKey, lastGlobalPointerPoint);
    return;
  }
}

export function updateDialogOffset(modalKey: string) {
  let { x: clickOriginX, y: clickOriginY } = useDialogAnimationStore
    .getState()
    .getClickOrigin(modalKey);

  // If no origin recorded for this specific modalKey, fallback to lastGlobalPointerPoint
  if (clickOriginX === 0 && clickOriginY === 0 && lastGlobalPointerPoint) {
    clickOriginX = lastGlobalPointerPoint.x;
    clickOriginY = lastGlobalPointerPoint.y;
    useDialogAnimationStore
      .getState()
      .setClickOrigin(modalKey, lastGlobalPointerPoint);
  }

  if (clickOriginX === 0 && clickOriginY === 0) {
    useDialogAnimationStore
      .getState()
      .setDialogOffset(modalKey, { x: 0, y: 0 });
    return;
  }

  const offsetX = clickOriginX - window.innerWidth / 2;
  const offsetY = clickOriginY - window.innerHeight / 2;

  useDialogAnimationStore.getState().setDialogOffset(modalKey, {
    x: offsetX,
    y: offsetY,
  });
}

export function getDialogOffset(modalKey: string) {
  return useDialogAnimationStore.getState().getDialogOffset(modalKey);
}

export function clearDialogOffset(modalKey: string) {
  useDialogAnimationStore.getState().clear(modalKey);
}
