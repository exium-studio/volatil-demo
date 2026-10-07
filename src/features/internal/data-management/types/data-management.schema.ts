// src/features/internal/data-management/types/data-management.schema.ts

import { z } from "zod";

export const masterIgtLayerFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Nama/Judul layer wajib diisi"),
  description: z.string().optional(),
  isActive: z.boolean(),
  defaultVisible: z.boolean(),
  geoserverId: z.string().min(1, "Master GeoServer wajib dipilih"),
  workspaceName: z.string().min(1, "Workspace GeoServer wajib dipilih"),
  layerName: z.string().nullable().optional(),
  typeName: z.string().min(1, "TypeName GeoServer wajib terisi"),
  igtBasis: z.enum(["bidang", "kawasan"]),
  zIndex: z.number().min(1).max(100),
});

