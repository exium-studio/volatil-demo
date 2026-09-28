// src/design-system/components/overlay/stores/dialog-animation-store.ts

import type {
  DialogAnimationStore,
  Point,
} from "@/design-system/components/overlay/types/dialog.type";
import { create } from "zustand";

export const DIALOG_OFFSET_X_VAR = "--dialog-offset-x";
export const DIALOG_OFFSET_Y_VAR = "--dialog-offset-y";

const DEFAULT_POINT: Point = { x: 0, y: 0 };

export const useDialogAnimationStore = create<DialogAnimationStore>()(
  (set, get) => ({
    dialogs: {},
    zIndexCounter: 0,

    setClickOrigin(modalKey, clickOrigin, targetElement = null) {
      set((state) => ({
        dialogs: {
          ...state.dialogs,
          [modalKey]: {
            clickOrigin,
            targetElement:
              targetElement ?? state.dialogs[modalKey]?.targetElement ?? null,
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
            clickOrigin: state.dialogs[modalKey]?.clickOrigin ?? DEFAULT_POINT,
            targetElement: state.dialogs[modalKey]?.targetElement ?? null,
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

    getTargetElement(modalKey) {
      return get().dialogs[modalKey]?.targetElement ?? null;
    },

    clear(modalKey) {
      set((state) => {
        const dialogs = { ...state.dialogs };
        delete dialogs[modalKey];
        return { dialogs };
      });
    },
  }),
);

let lastGlobalPointerPoint: Point | null = null;
let lastGlobalPointerTarget: HTMLElement | null = null;

if (typeof window !== "undefined") {
  window.addEventListener(
    "pointerdown",
    (e: PointerEvent) => {
      lastGlobalPointerPoint = {
        x: e.clientX,
        y: e.clientY,
      };
      if (e.target instanceof HTMLElement) {
        lastGlobalPointerTarget = e.target;
      }
    },
    { capture: true, passive: true },
  );

  window.addEventListener(
    "resize",
    () => {
      const store = useDialogAnimationStore.getState();
      for (const modalKey of Object.keys(store.dialogs)) {
        updateDialogOffset(modalKey);
      }
    },
    { passive: true },
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
    const point = target as Point;
    useDialogAnimationStore.getState().setClickOrigin(modalKey, point, null);
    updateDialogOffset(modalKey);
    return;
  }

  if (target instanceof HTMLElement) {
    const rect = target.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const point = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      useDialogAnimationStore
        .getState()
        .setClickOrigin(modalKey, point, target);
      updateDialogOffset(modalKey);
      return;
    }
  }

  if (lastGlobalPointerPoint) {
    useDialogAnimationStore
      .getState()
      .setClickOrigin(
        modalKey,
        lastGlobalPointerPoint,
        lastGlobalPointerTarget,
      );
    updateDialogOffset(modalKey);
    return;
  }
}

export function updateDialogOffset(modalKey: string) {
  const storeState = useDialogAnimationStore.getState();
  const currentDialog = storeState.dialogs[modalKey];
  const targetElement = currentDialog?.targetElement;

  let clickOriginX = 0;
  let clickOriginY = 0;

  // 1. If targetElement is still in the DOM, dynamically recalculate from its latest bounding box
  if (targetElement && targetElement.isConnected) {
    const rect = targetElement.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      clickOriginX = rect.left + rect.width / 2;
      clickOriginY = rect.top + rect.height / 2;
      storeState.setClickOrigin(
        modalKey,
        { x: clickOriginX, y: clickOriginY },
        targetElement,
      );
    }
  }

  // 2. If no target element or not in DOM, use current stored origin
  if (clickOriginX === 0 && clickOriginY === 0) {
    const origin = storeState.getClickOrigin(modalKey);
    clickOriginX = origin.x;
    clickOriginY = origin.y;
  }

  // 3. Fallback to lastGlobalPointerPoint if still empty
  if (clickOriginX === 0 && clickOriginY === 0 && lastGlobalPointerPoint) {
    clickOriginX = lastGlobalPointerPoint.x;
    clickOriginY = lastGlobalPointerPoint.y;
    storeState.setClickOrigin(
      modalKey,
      lastGlobalPointerPoint,
      lastGlobalPointerTarget,
    );
  }

  if (clickOriginX === 0 && clickOriginY === 0) {
    storeState.setDialogOffset(modalKey, { x: 0, y: 0 });
    return;
  }

  const offsetX = clickOriginX - window.innerWidth / 2;
  const offsetY = clickOriginY - window.innerHeight / 2;

  storeState.setDialogOffset(modalKey, {
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

