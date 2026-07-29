// src/shared/schemas/root-search.params-schema.ts

import { modalSchema } from "@/design-system/components/overlay/schemas/modal.schema";
import { settingsNavKeySchema } from "@/features/settings/schemas/setting-nav-key.schema";
import { z } from "zod";

export const globalSearchParamsSchema = z.object({
  activeModalKey: modalSchema.optional(),
  activeSettingNavKey: settingsNavKeySchema.optional(),
});
