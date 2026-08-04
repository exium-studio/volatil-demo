// src/features/data-request/components/data.request.add-to-cart-buttons.tsx

import type { ButtonGroupProps } from "@/design-system/components/button/types/button-group.type";
import { Button } from "@/design-system/components/button/ui/button";
import { ButtonGroup } from "@/design-system/components/button/ui/button-group";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { PADDING_MD, SPACING_SM } from "@/design-system/constants/styles";
import { isEmptyArray } from "@/shared/utils/data/array";
import { ShoppingCartIcon } from "lucide-react";

export type DataRequestAddToCartButtonsProps = ButtonGroupProps & {
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

  return (
    <ButtonGroup
      align={"center"}
      justify={"space-between"}
      gap={SPACING_SM}
      p={PADDING_MD}
      bg={"bg.body"}
      {...restProps}
    >
      <Button primary variant={"outline"} flex={1} onClick={onAddAllClick}>
        <AppIcon icon={ShoppingCartIcon} />
        {/* TODO: use data result length (accross page) */}
        Tambah semua ({totalItems})
      </Button>

      <Button
        primary
        flex={1}
        disabled={isEmptyArray(selectedItems)}
        onClick={onAddSelectedClick}
      >
        <AppIcon icon={ShoppingCartIcon} />
        Tambah yang dipilih ({selectedItems?.length ?? 0})
      </Button>
    </ButtonGroup>
  );
};
