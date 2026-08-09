// src/design-system/components/branding/ui/atr-logo.tsx

"use client";

import type { ImageProps } from "@/design-system/components/media/types/image.type";
import { Image } from "@/design-system/components/media/ui/image";
import { PATH_CONFIG } from "@/shared/constants/paths";

export const AtrLogo = (props: ImageProps) => {
  return <Image src={`${PATH_CONFIG.images}/atr_logo.png`} boxSize={12} {...props} />;
};
