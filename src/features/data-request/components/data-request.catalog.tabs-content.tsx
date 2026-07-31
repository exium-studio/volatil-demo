import { IconButton } from "@/design-system/components/button/ui/button";
import type { TabsContentProps } from "@/design-system/components/disclosure/type/tabs.type";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { P } from "@/design-system/components/typography/ui/p";
import {
  PADDING_MD,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import { SlidersHorizontalIcon } from "lucide-react";

export type DataRequestCatalogTabsContentProps = TabsContentProps & {};

export const DataRequestCatalogTabsContent = (
  props: DataRequestCatalogTabsContentProps,
) => {
  return (
    <Tabs.Content {...props} p={0}>
      <HStack
        wrap={"wrap"}
        justify={"space-between"}
        gap={SPACING_MD}
        p={PADDING_MD}
      >
        <VStack gap={1}>
          <P>Daftar Katalog Anda</P>
          <P fontSize={"sm"} color={"fg.subtle"}>
            Daftar seluruh kalatog data yang tersedia.
          </P>
        </VStack>

        <HStack align={"center"} gap={SPACING_SM}>
          <SearchInput />

          <IconButton variant={"outline"}>
            <AppIcon icon={SlidersHorizontalIcon} />
          </IconButton>
        </HStack>
      </HStack>
    </Tabs.Content>
  );
};
