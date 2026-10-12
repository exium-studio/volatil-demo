// src/design-system/components/data-display/ui/masked-text.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import type { MaskedTextProps } from "@/design-system/components/data-display/types/masked-text.type";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { memo, useState } from "react";

export const MaskedText = memo((props: MaskedTextProps) => {
  // Props
  const {
    value,
    defaultVisible = false,
    maskLength = 16,
    maskChar = "•",
    withCopy = true,
    copyLabel = "Salin Teks",
    withToggle = true,
    ...restProps
  } = props;

  // States
  const [isVisible, setIsVisible] = useState<boolean>(defaultVisible);

  if (!value) {
    return <P color={"fg.subtle"}>{"-"}</P>;
  }

  const maskedString = maskChar.repeat(maskLength);

  return (
    <HStack gap={"xs"} align={"center"} w={"full"} {...restProps}>
      <HStack flex={1} minW={0} overflow={"hidden"}>
        {isVisible ? (
          <ClampedP flex={1} fontFamily={"mono"} userSelect={"all"}>
            {value}
          </ClampedP>
        ) : (
          <P fontFamily={"mono"} userSelect={"none"} lineClamp={1}>
            {maskedString}
          </P>
        )}
      </HStack>

      <HStack gap={"2xs"} flexShrink={0}>
        {withToggle && (
          <IconButton
            variant={"plain"}
            size={"sm"}
            aria-label={isVisible ? "Sembunyikan" : "Tampilkan"}
            onClick={() => setIsVisible((prev) => !prev)}
          >
            <AppIcon icon={isVisible ? EyeOffIcon : EyeIcon} />
          </IconButton>
        )}

        {withCopy && (
          <ClipboardButton
            value={value}
            variant={"plain"}
            size={"sm"}
            aria-label={copyLabel}
          />
        )}
      </HStack>
    </HStack>
  );
});
