// src/shared/hooks/use-object-url.ts

import { useEffect, useState } from "react";

export function useObjectUrl(file: File | undefined): string | undefined {
  const [url, setUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!file) {
      // eslint-disable-next-line -- helper, not main component logic
      setUrl(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
}
