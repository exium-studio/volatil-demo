// src/routes/__root.tsx

import "@/app.css";
import { ChakraSystemProvider } from "@/design-system/chakra/providers/chakra-system.provider";
import { ColorModeProvider } from "@/design-system/chakra/providers/color-mode-provider";
import { Toaster } from "@/design-system/components/toast";
import { DebugMenu } from "@/design-system/components/utilities/ui/debug-menu";
import { OfflineAlert } from "@/design-system/components/utilities/ui/offline-alert";
import { APP } from "@/design-system/constants/_meta";
import { LocaleProvider } from "@/shared/libs/i18n/locale-provider";
import { globalSearchParamsSchema } from "@/shared/schemas/root-search.params-schema";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/wix-madefor-text";
import { HeadContent, Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  validateSearch: globalSearchParamsSchema,
  component: RootComponent,
  head: () => ({
    meta: [
      { title: APP.title },
      { name: "description", content: APP.description },
    ],
  }),
});

function RootComponent() {
  return (
    <ColorModeProvider>
      <ChakraSystemProvider>
        <LocaleProvider>
          <>
            <HeadContent />
            <Outlet />
          </>

          <>
            <Toaster />
            <OfflineAlert />
            <DebugMenu />
          </>
        </LocaleProvider>
      </ChakraSystemProvider>
    </ColorModeProvider>
  );
}
