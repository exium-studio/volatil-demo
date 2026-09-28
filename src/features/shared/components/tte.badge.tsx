import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Badge } from "@/design-system/components/typography/ui/badge";
import type { TteBadgeProps } from "@/features/shared/types/badge.type";
import { CheckCircle2Icon, ClockIcon } from "lucide-react";

export const TteBadge = (props: TteBadgeProps) => {
  // Props
  const {
    tte: tteProp,
    children,
    showIcon = true,
    variant = "subtle",
    ...restProps
  } = props;

  // Derived Values
  const isTte = tteProp !== undefined ? Boolean(tteProp) : Boolean(children);

  return (
    <Badge
      colorPalette={isTte ? "green" : "gray"}
      variant={variant}
      {...restProps}
    >
      {showIcon && (
        <AppIcon
          icon={isTte ? CheckCircle2Icon : ClockIcon}
          size={"xs"}
        />
      )}

      {isTte ? "TTE Terpasang" : "Belum TTE"}
    </Badge>
  );
};
