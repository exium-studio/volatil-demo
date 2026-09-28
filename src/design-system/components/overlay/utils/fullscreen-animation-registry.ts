import type { FullscreenAnimator } from "@/design-system/components/overlay/types/modal.type";

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
