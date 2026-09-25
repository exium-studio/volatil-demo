// src\features\mitra\home\types\mitra.home.data-availability.type.ts

// src\features\mitra\home\types\mitra.home.data-availability.type.ts

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { LucideIcon } from "lucide-react";

export type MitraHomeDataAvailabilityProps = StackProps;

export type MitraHomeDataAvailabilityResponse = {
  totalIgt: number;
  bidang: number;
  kawasan: number;
};

export type MitraHomeDataAvailabilityStatItem = {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix: string;
  description: string;
  colorPalette: string;
};
