// src/design-system/components/utilities/types/chakra-locale-provider.type.ts

import type { LocaleProviderProps } from "@chakra-ui/react";

export type ChakraLocaleProviderProps = Omit<
  LocaleProviderProps,
  "locale"
> & {};
