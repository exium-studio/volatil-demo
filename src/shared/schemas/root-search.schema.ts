// src/shared/schemas/root-search.schema.ts

import { modalSchema } from "@/design-system/components/overlay/schemas/modal.schema";
import { settingsNavKeySchema } from "@/features/settings/schemas/setting-nav-key.schema";
import { z } from "zod";

export const rootSearchSchema = z.object({
  activeModalKey: modalSchema.optional(),
  activeSettingNavKey: settingsNavKeySchema.optional(),
});
