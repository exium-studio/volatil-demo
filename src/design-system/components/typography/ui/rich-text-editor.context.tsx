// src/design-system/components/typography/ui/rich-text-editor.context.tsx

"use client";

import * as React from "react";

import type { RichTextEditorContextValue } from "../types/rich-text-editor.type";

export const RichTextEditorContext =
  React.createContext<RichTextEditorContextValue | null>(null);

RichTextEditorContext.displayName = "RichTextEditorContext";

export function useRichTextEditorContext() {
  const context = React.useContext(RichTextEditorContext);
  if (!context) {
    throw new Error(
      "useRichTextEditorContext must be used within a RichTextEditorRoot",
    );
  }
  return context;
}
