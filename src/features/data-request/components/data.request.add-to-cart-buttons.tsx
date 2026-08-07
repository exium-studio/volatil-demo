// src/features/data-request/components/data.request.add-to-cart-buttons.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { ButtonGroup } from "@/design-system/components/button/ui/button-group";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { ToggleTip } from "@/design-system/components/input/ui/toggle-tip";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { PADDING_MD, SPACING_SM } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { isEmptyArray } from "@/shared/utils/data/array";
import { InfoIcon, ShoppingCartIcon } from "lucide-react";

export type DataRequestAddToCartButtonsProps = StackProps & {
  selectedItems?: FormattedListItem[];
  totalItems?: number;
  onAddAllClick?: () => void;
  onAddSelectedClick?: () => void;
};

export const DataRequestAddToCartButtons = (
  props: DataRequestAddToCartButtonsProps,
) => {
  // Props
  const {
    onAddAllClick,
    onAddSelectedClick,
    selectedItems,
    totalItems = 0,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  return (
    <HStack
      align={"center"}
      justify={"space-between"}
      gap={SPACING_SM}
      p={PADDING_MD}
      rounded={theme.radii.container}
      bg={"bg.body"}
      {...restProps}
    >
      <ButtonGroup flex={1} attached>
        <ToggleTip
          content={
            "Tambah semua data (termasuk di semua halaman yang tersedia/terfilter)"
          }
        >
          <IconButton
            primary
            variant={"outline"}
            roundedRight={0}
            borderRight={"none"}
          >
            <AppIcon icon={InfoIcon} />
          </IconButton>
        </ToggleTip>

        <Button primary variant={"outline"} flex={1} onClick={onAddAllClick}>
          {/* <AppIcon icon={ShoppingCartIcon} /> */}
          {/* TODO: use data result length (accross page) */}
          Tambah semua ({totalItems}) ...
        </Button>
      </ButtonGroup>

      <Button
        primary
        flex={1}
        disabled={isEmptyArray(selectedItems)}
        onClick={onAddSelectedClick}
      >
        <AppIcon icon={ShoppingCartIcon} />
        Tambah yang dipilih ({selectedItems?.length ?? 0})
      </Button>
    </HStack>
  );
};
