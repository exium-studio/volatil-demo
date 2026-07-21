// src/design-system/components/layout/ui/page-container.tsx

import type { PageContainerProps } from "@/design-system/components/layout/types/page-container.type";
import { VStack } from "@/design-system/components/layout/ui/flex-box";

export const PageContainer = (props: PageContainerProps) => {
  return <VStack minH={"100dvh"} {...props} />;
};
