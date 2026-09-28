// src/design-system/components/input/hooks/use-existing-files.ts

import type { UseExistingFilesOptions } from "@/design-system/components/input/types/file-input.type";
import { useState } from "react";

export function useExistingFiles(options: UseExistingFilesOptions) {
  // Options
  const { initialExistingFiles } = options;

  // States
  const [existingFiles, setExistingFiles] = useState(initialExistingFiles);

  function toggleMarkedForDelete(id: string) {
    setExistingFiles((prev) =>
      prev.map((file) =>
        file.id === id
          ? {
              ...file,
              markedForDelete: !file.markedForDelete,
            }
          : file,
      ),
    );
  }

  return {
    existingFiles,
    setExistingFiles,
    toggleMarkedForDelete,
  };
}
