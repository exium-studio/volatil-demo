// src/design-system/components/layout/ui/page-container.tsx

"use client";

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { VStack } from "@/design-system/components/layout/ui/flex-box";

export const PageContainer = (props: StackProps) => {
  return <VStack minH={"100dvh"} {...props} />;
};
