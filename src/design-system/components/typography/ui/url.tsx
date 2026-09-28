// src/design-system/components/typography/ui/url.tsx

import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import type { UrlProps } from "@/design-system/components/typography/types/url.type";
import { memo } from "react";

export const Url = memo((props: UrlProps) => {
  // Props
  const {
    url,
    label = "Salin URL",
    isExternalLink = true,
    maxW = "280px",
    ...restProps
  } = props;

  if (!url) {
    return <P color={"fg.subtle"}>{"-"}</P>;
  }

  return (
    <HStack gap={"xs"} align={"center"} maxW={maxW} w={"full"} {...restProps}>
      <ClampedP
        as={isExternalLink ? "a" : "p"}
        href={isExternalLink ? url : undefined}
        target={isExternalLink ? "_blank" : undefined}
        rel={isExternalLink ? "noopener noreferrer" : undefined}
        fontFamily={"mono"}
        fontSize={"xs"}
        color={"fg.muted"}
        flex={1}
        minW={0}
        _hover={
          isExternalLink
            ? {
                color: "fg",
                textDecoration: "underline",
              }
            : undefined
        }
      >
        {url}
      </ClampedP>

      <ClipboardButton
        value={url}
        variant={"ghost"}
        aria-label={label}
        flexShrink={0}
      />
    </HStack>
  );
});
