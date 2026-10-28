// src/design-system/components/input/ui/string-array-input.tsx

import { Button, IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { StringArrayInputProps } from "@/design-system/components/input/types/string-array-input.type";
import { FieldContext } from "@/design-system/components/input/context/field.context";
import { Input } from "@/design-system/components/input/ui/input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { P } from "@/design-system/components/typography/ui/p";
import { isEmptyArray } from "@/shared/utils/data/array";
import { PlusIcon, Trash2Icon } from "lucide-react";

export const StringArrayInput = (props: StringArrayInputProps) => {
  // Props
  const {
    value = [],
    onChange,
    placeholder = "Masukkan nilai...",
    addButtonText = "Tambah Item",
    emptyText = "Belum ada item ditambahkan.",
    itemPrefix,
    maxItems,
  } = props;

  // Handlers
  const handleAddItem = () => {
    if (maxItems && value.length >= maxItems) return;
    onChange?.([...value, ""]);
  };

  const handleItemChange = (index: number, nextText: string) => {
    const nextList = [...value];
    nextList[index] = nextText;
    onChange?.(nextList);
  };

  const handleRemoveItem = (index: number) => {
    const nextList = value.filter((_, idx) => idx !== index);
    onChange?.(nextList);
  };

  const canAdd = !maxItems || value.length < maxItems;

  return (
    <FieldContext.Provider value={null}>
      <VStack align={"stretch"} gap={"sm"} w={"full"}>
        {isEmptyArray(value) && (
          <P fontSize={"xs"} color={"fg.muted"} py={1}>
            {emptyText}
          </P>
        )}

        {!isEmptyArray(value) && (
          <VStack align={"stretch"} gap={"xs"} w={"full"}>
            {value.map((item, index) => (
              <HStack key={index} gap={"xs"} align={"center"} w={"full"}>
                {itemPrefix && (
                  <P fontSize={"xs"} color={"fg.muted"} fontWeight={"medium"}>
                    {itemPrefix}
                  </P>
                )}

                <Input
                  value={item}
                  placeholder={placeholder}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  w={"full"}
                />

                <IconButton
                  type={"button"}
                  aria-label={`Hapus item ke-${index + 1}`}
                  variant={"outline"}
                  colorPalette={"red"}
                  onClick={() => handleRemoveItem(index)}
                >
                  <AppIcon icon={Trash2Icon} />
                </IconButton>
              </HStack>
            ))}
          </VStack>
        )}

        {canAdd && (
          <Button
            type={"button"}
            variant={"outline"}
            onClick={handleAddItem}
            w={"full"}
          >
            <AppIcon icon={PlusIcon} />
            {addButtonText}
          </Button>
        )}
      </VStack>
    </FieldContext.Provider>
  );
};
