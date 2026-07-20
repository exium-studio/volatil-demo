// src/design-system/components/media/ui/image.tsx

import { useState } from "react";

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { AspectRatio } from "@/design-system/components/layout/ui/aspect-ratio";
import type { AspectRatioProps } from "@/design-system/components/layout/types/aspect-ratio.type";
import { Center } from "@/design-system/components/layout/ui/center";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import type { ImageProps } from "@/design-system/components/media/types/image.type";
import { Box, Image as ChakraImage } from "@chakra-ui/react";
import { ImageOffIcon } from "lucide-react";

export const Image = (props: ImageProps) => {
  return <ImageImpl key={props.src} {...props} />;
};

const ImageImpl = (props: ImageProps) => {
  const {
    // Image props
    src,
    alt,
    onLoad,
    onError,
    objectFit,
    objectPosition,
    loading,
    crossOrigin,
    referrerPolicy,
    srcSet,
    sizes,
    fallback,
    // AspectRatio props
    aspectRatio,
    ...aspectRatioProps
  } = props;

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

  if (status === "failed") {
    return (
      fallback ?? (
        <AspectRatio {...aspectRatioProps} ratio={aspectRatio}>
          <ImageFallback />
        </AspectRatio>
      )
    );
  }

  return (
    <AspectRatio {...aspectRatioProps} ratio={aspectRatio}>
      <Box position={"relative"} w={"100%"} h={"100%"}>
        {status === "loading" && <Skeleton position={"absolute"} inset={0} />}

        <ChakraImage
          src={src}
          alt={alt}
          w={"100%"}
          h={"100%"}
          objectFit={objectFit ?? "contain"}
          objectPosition={objectPosition}
          loading={loading}
          crossOrigin={crossOrigin}
          referrerPolicy={referrerPolicy}
          srcSet={srcSet}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          display={status === "loading" ? "none" : undefined}
        />
      </Box>
    </AspectRatio>
  );
};

/** Icon size as a fraction of the container's dimension. */
const ICON_SIZE_RATIO = 0.5;

export const ImageFallback = (props: AspectRatioProps) => {
  return (
    <Center
      bg={"bg.subtle"}
      color={"fg.subtle"}
      position={"absolute"}
      inset={"0"}
      {...props}
    >
      <AppIcon
        icon={ImageOffIcon}
        boxSize={`${ICON_SIZE_RATIO * 100}%`}
        strokeWidth={(2 + ICON_SIZE_RATIO) * ICON_SIZE_RATIO}
      />
    </Center>
  );
};
