// src/shared/utils/dom/dispatch-native-input-event.ts

export function dispatchNativeInputEvent(
  input: HTMLInputElement,
  value: string,
) {
  const nativeSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  )?.set;

  nativeSetter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}
