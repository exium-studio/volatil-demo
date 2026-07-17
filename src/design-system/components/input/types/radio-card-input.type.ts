// src/design-system/components/input/types/radio-card-input.type.ts

import { RadioCard as ChakraRadioCard } from "@chakra-ui/react";

export type RadioCardInputRootProps = ChakraRadioCard.RootProps;

export type RadioCardInputLabelProps = ChakraRadioCard.LabelProps;

export type RadioCardInputItemProps = ChakraRadioCard.ItemProps & {
  hideCheckedOutline?: boolean;
};

export type RadioCardInputItemControlProps = ChakraRadioCard.ItemControlProps;

export type RadioCardInputItemTextProps = ChakraRadioCard.ItemTextProps;

export type RadioCardInputItemDescriptionProps =
  ChakraRadioCard.ItemDescriptionProps;

export type RadioCardInputItemIndicatorProps =
  ChakraRadioCard.ItemIndicatorProps;
