// src/routes/__root.tsx

import "@/app.css";
import { ChakraSystemProvider } from "@/design-system/chakra/providers/chakra-system.provider";
import { ColorModeProvider } from "@/design-system/chakra/providers/color-mode-provider";
import { NotFoundPage } from "@/design-system/components/error-boundary/ui/not-found.page";
import { FocusAlerter } from "@/design-system/components/focus-alert/ui/focus-alerter";
import { Toaster } from "@/design-system/components/toast";
import { LocaleProvider as ChakraLocaleProvider } from "@/design-system/components/utilities/ui/chakra-locale-provider";
import { OfflineAlert } from "@/design-system/components/utilities/ui/offline-alert";
import { APP_CONFIG } from "@/design-system/constants/_meta";
import { LocaleProvider } from "@/shared/libs/i18n/locale-provider";
import { queryClient } from "@/shared/libs/tanstack-query/query.client";
import { globalSearchParamsSchema } from "@/shared/schemas/root.search-params-schema";
import "@fontsource-variable/figtree";
import "@fontsource-variable/outfit";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/wix-madefor-text";
import "@fontsource/sorts-mill-goudy";
import "@fontsource/ubuntu";
import { QueryClientProvider } from "@tanstack/react-query";
import { HeadContent, Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  validateSearch: globalSearchParamsSchema,
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  head: () => ({
    meta: [
      { title: APP_CONFIG.title },
      { name: "description", content: APP_CONFIG.description },
    ],
  }),
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeProvider>
        <ChakraSystemProvider>
          <LocaleProvider>
            <ChakraLocaleProvider>
              <>
                <HeadContent />
                <Outlet />
              </>

              <>
                <Toaster />
                <FocusAlerter />
                <OfflineAlert />
                {/* <DebugMenu /> */}
              </>
            </ChakraLocaleProvider>
          </LocaleProvider>
        </ChakraSystemProvider>
      </ColorModeProvider>
    </QueryClientProvider>
  );
}
