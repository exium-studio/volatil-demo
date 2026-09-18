// src/shared/libs/i18n/index.ts

import { m } from "@/paraglide/messages";
import type { MessageFunction } from "./translation.type";

export const t = new Proxy(m, {
  get(target, prop, receiver) {
    if (typeof prop === "string") {
      if (prop in target) {
        return Reflect.get(target, prop, receiver);
      }
      const normalizedKey = prop.replace(/\./g, "_");
      if (normalizedKey in target) {
        return Reflect.get(target, normalizedKey, receiver);
      }
    }
    return Reflect.get(target, prop, receiver);
  },
}) as typeof m & Record<string, MessageFunction>;

export { getLocale, setLocale, locales } from "@/paraglide/runtime";
export * from "./utils";
