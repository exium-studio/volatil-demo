import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import type { PageContainerProps } from "@/design-system/components/layout/types/page-container.type";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { DIMENSIONS, SPACING } from "@/design-system/constants/styles";

export const PageContainer = (props: PageContainerProps) => {
  return (
    <VStack minH={"100dvh"} overflowY={"auto"} pos={"relative"} {...props} />
  );
};

export const AppPageContainer = (props: PageContainerProps) => {
  return <VStack h={"100dvh"} overflowY={"auto"} pos={"relative"} {...props} />;
};

export const PanelContentContainer = (props: StackProps) => {
  return (
    <VStack
      flex={1}
      pos={"relative"}
      h={`calc(100% - ${DIMENSIONS.headerH})`}
      p={SPACING.md}
      gap={SPACING.sm}
      {...props}
    />
  );
};
