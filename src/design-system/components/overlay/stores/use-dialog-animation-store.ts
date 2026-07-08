// src/design-system/components/overlay/stores/use-dialog-animation-store.ts

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

export function updateClickOrigin(
  modalKey: string,
  target: EventTarget | null,
) {
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const rect = target.getBoundingClientRect();

  useDialogAnimationStore.getState().setClickOrigin(modalKey, {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  });
}

export function updateDialogOffset(modalKey: string) {
  const { x: clickOriginX, y: clickOriginY } = useDialogAnimationStore
    .getState()
    .getClickOrigin(modalKey);

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
