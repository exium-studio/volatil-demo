import { z } from "zod";

export const updateMyDataItemSchema = z.object({
  label: z.string().trim().nullable(),
});
