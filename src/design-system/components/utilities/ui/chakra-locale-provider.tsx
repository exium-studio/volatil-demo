// src/design-system/components/utilities/ui/chakra-locale-provider.tsx

import type { ChakraLocaleProviderProps } from "@/design-system/components/utilities/types/chakra-locale-provider.type";
import { useLocale } from "@/shared/libs/i18n/locale-provider";
import { LocaleProvider as ChakraLocaleProvider } from "@chakra-ui/react";

export const LocaleProvider = (props: ChakraLocaleProviderProps) => {
  const { children, ...restProps } = props;
  const { locale } = useLocale();

  return (
    <ChakraLocaleProvider locale={locale} {...restProps}>
      {children}
    </ChakraLocaleProvider>
  );
};
