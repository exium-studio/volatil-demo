// src/features/internal/master-geoserver/types/master-geoserver.schema.ts

import { z } from "zod";

export const masterGeoserverFormSchema = z.object({
  name: z.string().min(1, "Nama server wajib diisi"),
  baseUrl: z
    .string()
    .min(1, "Base URL GeoServer wajib diisi")
    .url("Format Base URL tidak valid"),
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().optional(),
  description: z.string().optional(),
});

export type MasterGeoserverFormValues = z.infer<
  typeof masterGeoserverFormSchema
>;
