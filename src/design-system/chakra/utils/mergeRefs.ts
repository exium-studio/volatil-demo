// src/design-system/chakra/utils/mergeRefs.ts

import { mergeRefs as chakraMergeRefs } from "@chakra-ui/react";

export const mergeRefs = <T>(...refs: (React.Ref<T> | undefined)[]) => {
  return chakraMergeRefs(...refs);
};
