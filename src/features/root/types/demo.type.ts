// src/features/root/types/demo.type.ts

import type { ComponentType } from "react";

export type DemoPaletteItem = {
  palette: string;
  label: string;
  category: string;
};

export type DemoSectionHeaderProps = {
  title: string;
  icon: ComponentType<{ size?: string | number; className?: string }>;
  description?: string;
};
