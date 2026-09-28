// src/features/mitra/my-data/components/mitra.my-data.masked-secret-field.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type { MaskedSecretFieldProps } from "@/features/mitra/my-data/types/my-data.type";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

export const MaskedSecretField = (props: MaskedSecretFieldProps) => {
  // Props
  const { value, defaultVisible = false, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  // States
  const [isVisible, setIsVisible] = useState<boolean>(defaultVisible);

  return (
    <Box
      w={"full"}
      px={3}
      py={2}
      borderWidth={"1px"}
      borderColor={"border.subtle"}
      rounded={theme.radii.component}
      bg={"bg.body"}
      {...restProps}
    >
      <HStack justify={"space-between"} align={"center"} gap={2} w={"full"}>
        <HStack flex={1} minW={0} overflow={"hidden"}>
          {isVisible ? (
            <P
              fontWeight={"medium"}
              fontFamily={"mono"}
              color={"blue.fg"}
              lineClamp={1}
              wordBreak={"break-all"}
            >
              {value}
            </P>
          ) : (
            <P
              fontFamily={"mono"}
              color={"fg.muted"}
              letterSpacing={"widest"}
              userSelect={"none"}
              lineClamp={1}
            >
              {"••••••••••••••••••••••••••••••••"}
            </P>
          )}
        </HStack>

        <HStack gap={1} flexShrink={0}>
          <IconButton
            variant={"ghost"}
            aria-label={isVisible ? "Sembunyikan" : "Tampilkan"}
            onClick={() => setIsVisible((prev) => !prev)}
          >
            <AppIcon icon={isVisible ? EyeOffIcon : EyeIcon} />
          </IconButton>

          <ClipboardButton value={value} variant={"ghost"} />
        </HStack>
      </HStack>
    </Box>
  );
};
