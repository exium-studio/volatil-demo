// src/design-system/components/feedback/ui/state.welcome.tsx

import type { WelcomeStateProps } from "@/design-system/components/feedback/types/state.welcome.type";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { P } from "@/design-system/components/typography/ui/p";
import { t } from "@/shared/libs/i18n";

export const WelcomeState = (props: WelcomeStateProps) => {
  // Props
  const {
    title = t["common.welcome_intro"](),
    subtitle = "Semoga harini berjalan lancar",
    ...restProps
  } = props;

  return (
    <PanelContentContainer
      align={"center"}
      justify={"center"}
      gap={"xs"}
      p={"md"}
      {...restProps}
    >
      <VStack align={"center"} gap={"xs"}>
        <P fontSize={"lg"} fontWeight={"medium"} textAlign={"center"}>
          {title}
        </P>

        <P color={"fg.subtle"} textAlign={"center"}>
          {subtitle}
        </P>
      </VStack>
    </PanelContentContainer>
  );
};
