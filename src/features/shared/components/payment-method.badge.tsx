// src\features\shared\components\payment-method.badge.tsx

// src\features\shared\components\payment-method.badge.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { PAYMENT_METHOD_MAP } from "@/features/shared/constants/volatil.ssot-map";
import type { PaymentMethod } from "@/features/mitra/cart/types/mitra.cart.order.type";
import type { PaymentMethodBadgeProps } from "@/features/shared/types/badge.type";

export const PaymentMethodBadge = (props: PaymentMethodBadgeProps) => {
  // Props
  const {
    children,
    showIcon = false,
    variant = "subtle",
    ...restProps
  } = props;

  // Derived Values
  const methodKey = (children ?? "") as PaymentMethod;
  const config = PAYMENT_METHOD_MAP[methodKey];

  if (!children) {
    return <P>{"-"}</P>;
  }

  return (
    <Badge
      colorPalette={config?.colorPalette ?? "gray"}
      variant={variant}
      {...restProps}
    >
      {showIcon && config?.icon && <AppIcon icon={config.icon} size={"xs"} />}


      {config?.label ?? children}
    </Badge>
  );
};
