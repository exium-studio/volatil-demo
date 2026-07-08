// src/design-system/components/overlay/utils/fullscreen-animation-registry.ts

type FullscreenAnimator = (next: boolean) => void;

const registry = new Map<string, FullscreenAnimator>();

export function registerFullscreenAnimator(
  modalKey: string,
  fn: FullscreenAnimator,
) {
  registry.set(modalKey, fn);
}

export function unregisterFullscreenAnimator(modalKey: string) {
  registry.delete(modalKey);
}

export function triggerFullscreenAnimation(modalKey: string, next: boolean) {
  registry.get(modalKey)?.(next);
}
