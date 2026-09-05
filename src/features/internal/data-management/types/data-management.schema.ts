// src/features/internal/data-management/types/data-management.schema.ts

import { z } from "zod";

export const masterIgtLayerFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Nama/Judul layer wajib diisi"),
  description: z.string().optional(),
  isActive: z.boolean(),
  geoserverId: z.string().min(1, "Master GeoServer wajib dipilih"),
  workspace: z.string().min(1, "Workspace GeoServer wajib dipilih"),
  typeName: z.string().min(1, "Layer / Feature Type wajib dipilih"),
  spatialBasis: z.enum(["bidang", "kawasan"]),
  zIndex: z.number().min(1).max(100),
});

