// src/design-system/components/map/ui/map-controls/map-base-layer-select.tsx

import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Grid } from "@/design-system/components/layout/ui/grid";
import {
  MAP_BASE_LAYER_OPTIONS,
  getBaseLayerOption,
} from "@/design-system/components/map/constants/map.basemap-options";
import { useMapBaseMapStore } from "@/design-system/components/map/stores/map.base-map.store";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { Image } from "@/design-system/components/media/ui/image";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/use-theme-store";

export const MapBaseLayerSelect = () => {
  // Stores
  const { activeStyleKey, setActiveStyleKey } = useMapBaseMapStore();
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
        <MapOverlayContainer p={"2px"}>
          <Tooltip
            content={"Gaya Peta Base"}
            positioning={{ placement: "left" }}
          >
            <Center cursor={"pointer"}>
              <Image
                src={activeStyle.thumbnail}
                aspectRatio={2 / 1}
                objectFit={"cover"}
                w={"64px"}
                rounded={`calc(${theme.radii.component} - 2px)`}
              />
            </Center>
          </Tooltip>
        </MapOverlayContainer>
      </Popover.Trigger>

      <Popover.Content>
        <Popover.Header p={3} borderBottom={"1px solid"} borderColor={"border"}>
          <P fontWeight={"semibold"}>{"Pilih Gaya Peta"}</P>
        </Popover.Header>

        <Popover.Body
          className={"noScroll"}
          w={["full", null, "400px"]}
          p={2}
          overflowY={"auto"}
        >
          <Grid
            gridTemplateColumns={"repeat(auto-fill, minmax(100px, 1fr))"}
            gapY={4}
          >
            {MAP_BASE_LAYER_OPTIONS.map((styleKey) => {
              const isSelected = activeStyleKey === styleKey;
              const item = getBaseLayerOption(styleKey);

              return (
                <VStack
                  key={styleKey}
                  align={"center"}
                  gap={2}
                  transition={"200ms"}
                >
                  <Image
                    src={item.thumbnail}
                    aspectRatio={2 / 1}
                    w={"120px"}
                    objectFit={"cover"}
                    rounded={`calc(${theme.radii.component} - 2px)`}
                    cursor={"pointer"}
                    outline={isSelected ? "2px solid" : undefined}
                    outlineColor={`${theme.colorPalette}.solid`}
                    outlineOffset={"2px"}
                    onClick={() => setActiveStyleKey(styleKey)}
                  />

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
