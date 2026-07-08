// src/design-system/components/branding/brand-watermark.tsx

"use client";

import { Link } from "@/design-system/components/navigation/ui/link";
import { P, type PProps } from "@/design-system/components/typography/ui/p";
import { APP } from "@/design-system/constants/_meta";
import { useThemeStore } from "@/design-system/stores/use-theme-store";

// ---------------------------------------------------------------------------

export const BrandWatermark = (props: PProps) => {
  // Props
  const { ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  // States
  const currentYear = new Date().getFullYear();

  return (
    <P textAlign={"center"} color={"fg.muted"} {...restProps}>
      © {currentYear} powered by{" "}
      <Link
        to={APP.link}
        target={"_blank"}
        fontWeight={"bold"}
        _hover={{
          color: `${theme.colorPalette}.fg`,
        }}
      >
        {APP.poweredBy}
      </Link>
    </P>
  );
};
