// src/design-system/components/input/context/field.context.ts

import type { FieldContextValue } from "@/design-system/components/input/types/field-context.type";
import { createContext, useContext } from "react";

export const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContextValue(): FieldContextValue | null {
  return useContext(FieldContext);
}
