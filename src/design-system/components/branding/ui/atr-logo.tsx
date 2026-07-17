// src/design-system/components/branding/ui/atr-logo.tsx

"use client";

import type { ImageProps } from "@/design-system/components/media/types/image.type";
import { Image } from "@/design-system/components/media/ui/image";
import { IMAGES_PATH } from "@/shared/constants/paths";

export const AtrLogo = (props: ImageProps) => {
  return <Image src={`${IMAGES_PATH}/atr_logo.png`} boxSize={16} {...props} />;
};
