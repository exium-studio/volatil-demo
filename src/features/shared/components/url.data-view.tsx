// src/features/shared/components/url.data-view.tsx

import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { ExternalLink } from "@/design-system/components/navigation/ui/link";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type { UrlDataViewProps } from "@/features/shared/types/url.data-view.type";
import { memo, useEffect, useRef, useState } from "react";

export const UrlDataView = memo((props: UrlDataViewProps) => {
  // Props
  const {
    url,
    label = "Salin URL",
    isExternalLink = true,
    maxW = "280px",
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Refs & States
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [overflowOffset, setOverflowOffset] = useState<number>(0);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    const containerW = containerRef.current.clientWidth;
    const textW = textRef.current.scrollWidth;
    if (textW > containerW) {
      setOverflowOffset(textW - containerW);
    } else {
      setOverflowOffset(0);
    }
  }, [url]);

  if (!url) {
    return <P color={"fg.subtle"}>{"-"}</P>;
  }

  // Duration scales naturally with distance, minimum 3s, roughly 35px/s
  const durationSec = Math.max(3, Math.min(8, overflowOffset / 35));

  const linkContent = (
    <Box
      ref={textRef}
      as={"span"}
      display={"inline-block"}
      whiteSpace={"nowrap"}
      fontSize={"xs"}
      fontFamily={"mono"}
      color={"fg.muted"}
      transition={
        isInteracting
          ? `transform ${durationSec}s ease-in-out`
          : "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)"
      }
      transform={
        isInteracting && overflowOffset > 0
          ? `translateX(-${overflowOffset}px)`
          : "translateX(0px)"
      }
      _hover={{
        color: "fg.info",
      }}
    >
      {url}
    </Box>
  );

  return (
    <HStack
      gap={"xs"}
      align={"center"}
      rounded={theme.radii.component}
      bg={"bg.subtle"}
      pr={"2xs"}
      maxW={maxW}
      w={"full"}
      overflow={"hidden"}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocus={() => setIsInteracting(true)}
      onBlur={() => setIsInteracting(false)}
      onTouchStart={() => setIsInteracting(true)}
      onTouchEnd={() => setIsInteracting(false)}
      {...restProps}
    >
      <Box
        ref={containerRef}
        flex={1}
        minW={0}
        overflow={"hidden"}
        position={"relative"}
        maskImage={
          overflowOffset > 0
            ? "linear-gradient(to right, transparent, black 12px, black calc(100% - 12px), transparent)"
            : undefined
        }
      >
        {isExternalLink ? (
          <ExternalLink
            href={url}
            display={"inline-block"}
            maxW={"full"}
            verticalAlign={"middle"}
            mx={"sm"}
          >
            {linkContent}
          </ExternalLink>
        ) : (
          linkContent
        )}
      </Box>

      <ClipboardButton
        value={url}
        variant={"ghost"}
        size={"xs"}
        aria-label={label}
        flexShrink={0}
      />
    </HStack>
  );
});
