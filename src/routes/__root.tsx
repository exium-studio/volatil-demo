// src/routes/__root.tsx

import "@/app.css";
import { ChakraSystemProvider } from "@/design-system/chakra/providers/chakra-system.provider";
import { ColorModeProvider } from "@/design-system/chakra/providers/color-mode-provider";
import { Toaster } from "@/design-system/components/toast";
import { DebugMenu } from "@/design-system/components/utilities/ui/debug-menu";
import { OfflineAlert } from "@/design-system/components/utilities/ui/offline-alert";
import { LocaleProvider } from "@/shared/libs/i18n/locale-provider";
import { globalSearchParamsSchema } from "@/shared/schemas/root-search.params-schema";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/wix-madefor-text";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  validateSearch: globalSearchParamsSchema,
  component: RootComponent,
});

function RootComponent() {
  return (
    <ColorModeProvider>
      <ChakraSystemProvider>
        <LocaleProvider>
          <Toaster />

          <OfflineAlert />

          <DebugMenu />

          <Outlet />
        </LocaleProvider>
      </ChakraSystemProvider>
    </ColorModeProvider>
  );
}
