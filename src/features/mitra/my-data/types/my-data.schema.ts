// src/features/mitra/my-data/types/my-data.schema.ts

import { z } from "zod";

export const updateMyDataItemSchema = z.object({
  label: z.string().trim().nullable(),
});
