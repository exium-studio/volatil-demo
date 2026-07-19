// src/design-system/components/branding/brand-watermark.tsx

import type { BrandWatermarkProps } from "@/design-system/components/branding/types/brand-watermark.type";
import { ExternalLink } from "@/design-system/components/navigation/ui/link";
import { P } from "@/design-system/components/typography/ui/p";
import { APP } from "@/design-system/constants/_meta";
import { useThemeStore } from "@/design-system/stores/use-theme-store";

// ---------------------------------------------------------------------------

export const BrandWatermark = (props: BrandWatermarkProps) => {
  // Props
  const { ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  // States
  const currentYear = new Date().getFullYear();

  return (
    <P textAlign={"center"} color={"fg.muted"} {...restProps}>
      © {currentYear} powered by{" "}
      <ExternalLink
        href={APP.link}
        target={"_blank"}
        fontWeight={"bold"}
        _hover={{
          color: `${theme.colorPalette}.fg`,
        }}
      >
        {APP.poweredBy}
      </ExternalLink>
    </P>
  );
};
