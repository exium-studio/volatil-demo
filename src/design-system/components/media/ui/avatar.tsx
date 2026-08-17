// src/design-system/components/media/ui/avatar.tsx

import type {
  AvatarFallbackProps,
  AvatarImageProps,
  AvatarProps,
  AvatarRootProps,
} from "@/design-system/components/media/types/avatar.type";
import { Avatar as ChakraAvatar } from "@chakra-ui/react";
import { forwardRef } from "react";

// Compound Parts
const AvatarRoot = forwardRef<HTMLDivElement, AvatarRootProps>((props, ref) => {
  return <ChakraAvatar.Root ref={ref} {...props} />;
});

const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  (props, ref) => {
    return <ChakraAvatar.Image ref={ref} {...props} />;
  },
);

const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  (props, ref) => {
    return <ChakraAvatar.Fallback ref={ref} {...props} />;
  },
);

const AvatarIcon = ChakraAvatar.Icon;

export const AvatarPrimitive = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Icon: AvatarIcon,
};

// Closed Component
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>((props, ref) => {
  const { name, src, srcSet, loading, icon, fallback, children, ...restProps } =
    props;

  return (
    <ChakraAvatar.Root ref={ref} {...restProps}>
      <ChakraAvatar.Fallback name={name}>
        {icon || fallback}
      </ChakraAvatar.Fallback>
      <ChakraAvatar.Image src={src} srcSet={srcSet} loading={loading} />
      {children}
    </ChakraAvatar.Root>
  );
});
