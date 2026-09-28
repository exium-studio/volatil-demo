// src/design-system/components/map/ui/map.controls/map.basemap-select.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Circle } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Grid } from "@/design-system/components/layout/ui/grid";
import {
  MAP_BASEMAP_MAP,
  MAP_BASEMAP_OPTIONS_LIST,
  getBasemapOption,
} from "@/design-system/components/map/constants/map.basemap-options";
import { useMapBaseMapStore } from "@/design-system/components/map/stores/map.base-map.store";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { Image } from "@/design-system/components/media/ui/image";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { P } from "@/design-system/components/typography/ui/p";
import { useColorMode } from "@/design-system/hooks/use-color-mode";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { MoonIcon, SunIcon } from "lucide-react";

export const MapBasemapSelect = () => {
  // Stores
  const { activeStyleKey, setActiveStyleKey } = useMapBaseMapStore();
  const { theme } = useThemeStore();

  // Hooks
  const { colorMode } = useColorMode();

  // Constants
  const activeStyle = getBasemapOption(activeStyleKey);
  const plainAdaptiveProps = {
    light: {
      thumbnail: MAP_BASEMAP_MAP["plain-light"].thumbnail,
      icon: SunIcon,
    },
    dark: {
      thumbnail: MAP_BASEMAP_MAP["plain-dark"].thumbnail,
      icon: MoonIcon,
    },
  };

  // Derived Values
  const isActiveStylePlainAdaptive = activeStyleKey === "plain-adaptive";

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
        <MapOverlayContainer p={"2px"}>
          <Tooltip
            content={"Gaya Peta Base"}
            positioning={{ placement: "top" }}
          >
            <Center pos={"relative"} cursor={"pointer"}>
              <Image
                src={
                  isActiveStylePlainAdaptive
                    ? plainAdaptiveProps[colorMode].thumbnail
                    : activeStyle.thumbnail
                }
                aspectRatio={1}
                objectFit={"cover"}
                w={["64px", null, "70px"]}
                rounded={`calc(${theme.radii.component} - 2px)`}
              />

              {isActiveStylePlainAdaptive && (
                <Circle
                  bg={"bg.body"}
                  pos={"absolute"}
                  left={-2}
                  bottom={-2}
                  p={"2xs"}
                >
                  <AppIcon
                    icon={plainAdaptiveProps[colorMode].icon}
                    size={"xs"}
                    color={"fg.muted"}
                  />
                </Circle>
              )}
            </Center>
          </Tooltip>
        </MapOverlayContainer>
      </Popover.Trigger>

      <Popover.Content>
        <Popover.Header p={3} borderBottom={"1px solid"} borderColor={"border"}>
          <P fontWeight={"medium"}>{"Peta Dasar"}</P>
        </Popover.Header>

        <Popover.Body
          className={"noScrollbar"}
          w={["full", null, "400px"]}
          p={2}
          overflowY={"auto"}
        >
          <Grid
            gridTemplateColumns={"repeat(auto-fill, minmax(100px, 1fr))"}
            gapY={4}
          >
            {MAP_BASEMAP_OPTIONS_LIST.map((styleKey) => {
              const isSelected = activeStyleKey === styleKey;
              const item = getBasemapOption(styleKey);
              const isPlainAdaptive = styleKey === "plain-adaptive";

              return (
                <VStack
                  key={styleKey}
                  align={"center"}
                  gap={2}
                  transition={"200ms"}
                >
                  <Center pos={"relative"}>
                    <Image
                      src={
                        isPlainAdaptive
                          ? plainAdaptiveProps[colorMode].thumbnail
                          : item.thumbnail
                      }
                      aspectRatio={1}
                      w={"112px"}
                      objectFit={"cover"}
                      rounded={`calc(${theme.radii.component} - 2px)`}
                      cursor={"pointer"}
                      outline={isSelected ? "2px solid" : undefined}
                      outlineColor={`${theme.colorPalette}.focusRing`}
                      outlineOffset={"2px"}
                      onClick={() => setActiveStyleKey(styleKey)}
                    />

                    {isPlainAdaptive && (
                      // <AppIcon
                      //   icon={plainAdaptiveProps[colorMode].icon}
                      //   size={"lg"}
                      //   pos={"absolute"}
                      //   left={1}
                      //   bottom={1}
                      //   color={"fg.inverted"}
                      // />

                      <Circle
                        bg={"bg.body"}
                        pos={"absolute"}
                        left={-2}
                        bottom={-2}
                        p={"2xs"}
                      >
                        <AppIcon
                          icon={plainAdaptiveProps[colorMode].icon}
                          size={"sm"}
                          color={"fg.muted"}
                        />
                      </Circle>
                    )}
                  </Center>

                  <HStack align={"center"} justify={"center"} gap={1}>
                    <P fontSize={"sm"} whiteSpace={"nowrap"} lineHeight={"1.2"}>
                      {item.label}
                    </P>

                    <InfoTip
                      variant={"icon"}
                      appIconProps={{
                        size: "xs",
                        color: "fg.subtle",
                      }}
                    >
                      {item.description}
                    </InfoTip>
                  </HStack>
                </VStack>
              );
            })}
          </Grid>
        </Popover.Body>
      </Popover.Content>
    </Popover.Root>
  );
};
