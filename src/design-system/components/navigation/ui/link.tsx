// src/design-system/components/navigation/ui/link.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import type {
  ExternalLinkProps,
  NavLinkProps,
} from "@/design-system/components/navigation/types/link.type";
import { P } from "@/design-system/components/typography/ui/p";
import { t } from "@/shared/libs/i18n";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as TanstackLink } from "@tanstack/react-router";
import { Link2OffIcon } from "lucide-react";

export const NavLink = (props: NavLinkProps) => {
  return <TanstackLink {...props} />;
};

export const ExternalLink = (props: ExternalLinkProps) => {
  // Props
  const { variant = "underline", _hover, href, ...restProps } = props;

  if (!href) {
    return (
      <HStack align={"center"} gap={"xs"}>
        <AppIcon
          icon={Link2OffIcon}
          color={"fg.muted"}
          size={restProps.iconSize}
        />

        <P
          color={"fg.muted"}
          textDecoration={"line-through"}
          fontSize={restProps.fontSize}
          fontWeight={restProps.fontWeight}
        >
          {t["common.link_not_found"]()}
        </P>
      </HStack>
    );
  }

  return (
    <ChakraLink
      href={href ?? undefined}
      target={"_blank"}
      _hover={
        variant === "underline"
          ? {
              textDecor: "underline",
              ..._hover,
            }
          : {
              textDecor: "none",
              ..._hover,
            }
      }
      {...restProps}
    />
  );
};
