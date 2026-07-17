// src/design-system/components/toast/core/toast.event-bus.ts

import type {
  ToastEventListener,
  ToastEventMap,
  ToastEventName,
} from "@/design-system/components/toast/types/toast.types";

/**
 * Extending the engine (analytics, sound, telemetry, cross-tab sync, etc)
 * is just: `toastEventBus.on("show", (record) => { ... })`. No install/
 * uninstall ceremony — subscribe where you need it, unsubscribe via the
 * returned function if the subscriber can unmount.
 */
function createEventBus() {
  const listeners = new Map<ToastEventName, Set<ToastEventListener<ToastEventName>>>();

  function on<TEvent extends ToastEventName>(
    event: TEvent,
    listener: ToastEventListener<TEvent>,
  ): () => void {
    const set = listeners.get(event) ?? new Set();
    set.add(listener as ToastEventListener<ToastEventName>);
    listeners.set(event, set);
    return () => set.delete(listener as ToastEventListener<ToastEventName>);
  }

  function emit<TEvent extends ToastEventName>(event: TEvent, payload: ToastEventMap[TEvent]): void {
    listeners.get(event)?.forEach((listener) => listener(payload));
  }

  return { on, emit };
}

export const toastEventBus = createEventBus();
