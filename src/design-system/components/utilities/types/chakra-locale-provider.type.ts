import type { LocaleProviderProps } from "@chakra-ui/react";

export type ChakraLocaleProviderProps = Omit<
  LocaleProviderProps,
  "locale"
> & {};
