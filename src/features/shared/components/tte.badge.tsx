// src/features/shared/components/tte.badge.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import type { TteBadgeProps } from "@/features/shared/types/badge.type";
import {
  CheckCircle2Icon,
  ClockIcon,
  FileCheckIcon,
  FileTextIcon,
} from "lucide-react";

export const TteBadge = (props: TteBadgeProps) => {
  // Props
  const {
    tte: tteProp,
    children,
    showIcon = true,
    variant = "subtle",
    invoiceUrl,
    tteInvoiceUrl,
    showInvoiceButtons = true,
    ...restProps
  } = props;

  // Derived Values
  const isTte =
    tteProp !== undefined && tteProp !== null
      ? Boolean(tteProp)
      : typeof children === "boolean"
        ? children
        : children === "true" || children === "TTE" || Boolean(tteInvoiceUrl);

  const hasInvoice = Boolean(invoiceUrl);
  const hasTteInvoice = Boolean(tteInvoiceUrl);
  const shouldRenderButtons =
    showInvoiceButtons && (hasInvoice || hasTteInvoice);

  const badgeElement = (
    <Badge
      colorPalette={isTte ? "green" : "gray"}
      variant={variant}
      {...restProps}
    >
      {showIcon && (
        <AppIcon icon={isTte ? CheckCircle2Icon : ClockIcon} size={"xs"} />
      )}

      {isTte ? "TTE Terpasang" : "Belum TTE"}
    </Badge>
  );

  if (!shouldRenderButtons) {
    return badgeElement;
  }

  return (
    <HStack align={"center"} gap={"xs"}>
      {badgeElement}

      {hasInvoice && (
        <Button
          size={"2xs"}
          variant={"outline"}
          onClick={(e) => {
            e.stopPropagation();
            if (invoiceUrl) {
              window.open(invoiceUrl, "_blank");
            }
          }}
        >
          <AppIcon icon={FileTextIcon} size={"xs"} />
          {"Faktur"}
        </Button>
      )}

      {hasTteInvoice && (
        <Button
          size={"2xs"}
          variant={"outline"}
          onClick={(e) => {
            e.stopPropagation();
            if (tteInvoiceUrl) {
              window.open(tteInvoiceUrl, "_blank");
            }
          }}
        >
          <AppIcon icon={FileCheckIcon} size={"xs"} />
          {"Faktur + TTE"}
        </Button>
      )}
    </HStack>
  );
};
