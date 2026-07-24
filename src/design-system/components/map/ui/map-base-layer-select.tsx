// src/design-system/components/map/ui/map-base-layer-select.tsx

import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import {
  BASE_LAYER_OPTIONS,
  getBaseLayerOption,
} from "@/design-system/components/map/constants/base-layer-style.constant";
import { useMapBaseLayerStore } from "@/design-system/components/map/stores/map-base-layer.store";
import { Image } from "@/design-system/components/media/ui/image";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { Box } from "@chakra-ui/react";

const ITEM_WIDTH = "64px";

export const MapBaseLayerSelect = () => {
  // Stores
  const { activeStyleKey, setActiveStyleKey } = useMapBaseLayerStore();
  const { theme } = useThemeStore();

  // Constants
  const activeStyle = getBaseLayerOption(activeStyleKey);

  return (
    <Popover.Root
      positioning={{
        placement: "top-start",
        offset: {
          crossAxis: -2,
        },
      }}
    >
      <Popover.Trigger>
        <Box>
          <Tooltip
            content={"Gaya Peta Base"}
            positioning={{ placement: "left" }}
          >
            <Center cursor={"pointer"}>
              <Image
                src={activeStyle.thumbnail}
                aspectRatio={1}
                w={"36px"}
                rounded={theme.radii.component}
              />
            </Center>
          </Tooltip>
        </Box>
      </Popover.Trigger>

      <Popover.Content>
        <Popover.Header p={3} borderBottom={"1px solid"} borderColor={"border"}>
          <P fontWeight={"semibold"}>{"Pilih Gaya Peta"}</P>
        </Popover.Header>

        <Popover.Body p={2}>
          <HStack gap={1} align={"flex-start"}>
            {BASE_LAYER_OPTIONS.map((styleKey) => {
              const isSelected = activeStyleKey === styleKey;
              const item = getBaseLayerOption(styleKey);

              return (
                <VStack
                  key={styleKey}
                  w={ITEM_WIDTH}
                  align={"center"}
                  gap={1}
                  cursor={"pointer"}
                  transition={"200ms"}
                  onClick={() => setActiveStyleKey(styleKey)}
                >
                  <Center
                    p={1}
                    rounded={theme.radii.component}
                    border={"1px solid"}
                    borderColor={
                      isSelected ? `${theme.colorPalette}.solid` : "transparent"
                    }
                    transition={"200ms"}
                  >
                    <Image
                      src={item.thumbnail}
                      aspectRatio={1}
                      w={"52px"}
                      rounded={`calc(${theme.radii.component} - 2px)`}
                    />
                  </Center>

                  <P
                    fontSize={"sm"}
                    textAlign={"center"}
                    whiteSpace={"normal"}
                    lineHeight={"1.2"}
                  >
                    {item.label}
                  </P>

                  <InfoTip
                    appIconProps={{
                      size: "xs",
                      color: "fg.subtle",
                    }}
                  >
                    {item.description}
                  </InfoTip>
                </VStack>
              );
            })}
          </HStack>
        </Popover.Body>
      </Popover.Content>
    </Popover.Root>
  );
};
