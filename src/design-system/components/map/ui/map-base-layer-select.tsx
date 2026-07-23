// src/design-system/components/map/ui/map-base-layer-select.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import {
  BASE_LAYER_OPTIONS,
  type BaseLayerStyleKey,
} from "@/design-system/components/map/constants/base-layer-style.constant";
import { useMapBaseLayerStore } from "@/design-system/components/map/stores/map-base-layer.store";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { Box } from "@chakra-ui/react";
import {
  CheckIcon,
  GlobeIcon,
  LayersIcon,
  MoonIcon,
  PaletteIcon,
  SunIcon,
  SunMoonIcon,
} from "lucide-react";
import type { ElementType } from "react";

const BASE_LAYER_ICON_MAP: Record<BaseLayerStyleKey, ElementType> = {
  color: PaletteIcon,
  "plain-light": SunIcon,
  "plain-dark": MoonIcon,
  "plain-adaptive": SunMoonIcon,
  satellite: GlobeIcon,
};

export const MapBaseLayerSelect = () => {
  // Stores
  const { activeStyleId, setActiveStyleId } = useMapBaseLayerStore();
  const { theme } = useThemeStore();

  return (
    <Popover.Root
    // positioning={{ placement: "left-start" }}
    >
      <Popover.Trigger>
        <Box>
          <Tooltip
            content={"Gaya Peta Base"}
            positioning={{ placement: "left" }}
          >
            <Box>
              <IconButton
                aria-label={"Pilih gaya peta"}
                size={"sm"}
                variant={"ghost"}
              >
                <LayersIcon size={16} />
              </IconButton>
            </Box>
          </Tooltip>
        </Box>
      </Popover.Trigger>

      <Popover.Content width={"260px"} p={0}>
        <Popover.Header
          p={3}
          pb={2}
          borderBottom={"1px solid"}
          borderColor={"border.subtle"}
        >
          <Popover.Title fontSize={"sm"} fontWeight={"semibold"}>
            {"Pilih Gaya Peta"}
          </Popover.Title>
        </Popover.Header>

        <Popover.Body p={2}>
          <VStack gap={1} align={"stretch"}>
            {BASE_LAYER_OPTIONS.map((item) => {
              const isSelected = activeStyleId === item.id;
              const IconComp = BASE_LAYER_ICON_MAP[item.id];

              return (
                <HStack
                  key={item.id}
                  p={2}
                  rounded={theme.radii.component}
                  cursor={"pointer"}
                  bg={
                    isSelected ? `${theme.colorPalette}.subtle` : "transparent"
                  }
                  _hover={{
                    bg: isSelected
                      ? `${theme.colorPalette}.subtle`
                      : "bg.muted",
                  }}
                  transition={"200ms"}
                  onClick={() => setActiveStyleId(item.id)}
                  justify={"space-between"}
                  align={"center"}
                >
                  <HStack gap={2.5} align={"center"}>
                    <Box
                      p={1.5}
                      rounded={"md"}
                      bg={
                        isSelected ? `${theme.colorPalette}.solid` : "bg.muted"
                      }
                      color={
                        isSelected
                          ? `${theme.colorPalette}.contrast`
                          : "fg.muted"
                      }
                    >
                      <IconComp size={16} />
                    </Box>

                    <VStack gap={0} align={"start"}>
                      <P
                        fontWeight={isSelected ? "bold" : "medium"}
                        color={
                          isSelected ? `${theme.colorPalette}.fg` : "fg.default"
                        }
                      >
                        {item.label}
                      </P>
                      <P color={"fg.subtle"}>{item.description}</P>
                    </VStack>
                  </HStack>

                  {isSelected && (
                    <Box color={`${theme.colorPalette}.fg`}>
                      <CheckIcon size={16} />
                    </Box>
                  )}
                </HStack>
              );
            })}
          </VStack>
        </Popover.Body>
      </Popover.Content>
    </Popover.Root>
  );
};
