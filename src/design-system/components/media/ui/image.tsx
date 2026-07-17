// src/design-system/components/media/ui/image.tsx

import { useState } from "react";

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { CenterProps } from "@/design-system/components/layout/types/center.type";
import { Center } from "@/design-system/components/layout/ui/center";
import type { ImageProps } from "@/design-system/components/media/types/image.type";
import { Image as ChakraImage } from "@chakra-ui/react";
import { ImageOffIcon } from "lucide-react";

export const Image = (props: ImageProps) => {
  return <ImageImpl key={props.src} {...props} />;
};

const ImageImpl = (props: ImageProps) => {
  const { fallback, src, onLoad, onError, ...rest } = props;

  const [status, setStatus] = useState<"loading" | "loaded" | "failed">(
    src ? "loading" : "failed",
  );

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setStatus("loaded");
    onLoad?.(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setStatus("failed");
    onError?.(e);
  };

  const fallbackComponent = fallback ?? (
    <ImageFallback
      w={props.w ?? props.width ?? props.boxSize}
      h={props.h ?? props.height ?? props.boxSize}
      borderRadius={props.borderRadius}
    />
  );

  if (status === "failed") {
    return fallbackComponent;
  }

  return (
    <>
      {status === "loading" && fallbackComponent}
      <ChakraImage
        src={src}
        onLoad={handleLoad}
        onError={handleError}
        display={status === "loading" ? "none" : rest.display}
        {...rest}
      />
    </>
  );
};

/** Icon size as a fraction of the container's dimension (e.g. 0.4 = 40%). */
const ICON_SIZE_RATIO = 0.5;

export const ImageFallback = (props: CenterProps) => {
  // Props
  const { w, h, width, height, boxSize, ...rest } = props;

  // Match the dimension of the Image/Container
  const resolvedW = w ?? width ?? boxSize ?? "100%";
  const resolvedH = h ?? height ?? boxSize ?? "100%";

  // Icon boxSize = ICON_SIZE_RATIO of the container's dimension
  let resolvedIconBoxSize: string | number = `${ICON_SIZE_RATIO * 100}%`;

  const targetDimension = boxSize ?? w ?? width ?? h ?? height;
  if (typeof targetDimension === "number") {
    resolvedIconBoxSize = targetDimension * ICON_SIZE_RATIO;
  } else if (typeof targetDimension === "string") {
    if (targetDimension.endsWith("px")) {
      const val = parseFloat(targetDimension);
      if (!isNaN(val)) {
        resolvedIconBoxSize = `${val * ICON_SIZE_RATIO}px`;
      }
    } else if (targetDimension.endsWith("rem")) {
      const val = parseFloat(targetDimension);
      if (!isNaN(val)) {
        resolvedIconBoxSize = `${val * ICON_SIZE_RATIO}rem`;
      }
    } else if (targetDimension.endsWith("em")) {
      const val = parseFloat(targetDimension);
      if (!isNaN(val)) {
        resolvedIconBoxSize = `${val * ICON_SIZE_RATIO}em`;
      }
    }
  }

  return (
    <Center
      w={resolvedW}
      h={resolvedH}
      bg={"bg.subtle"}
      color={"fg.muted"}
      {...rest}
    >
      <AppIcon icon={ImageOffIcon} boxSize={resolvedIconBoxSize} />
    </Center>
  );
};
