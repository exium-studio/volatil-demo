// src/design-system/components/disclosure/ui/carousel.tsx

"use client";

import type { IconButtonProps } from "@/design-system/components/button/types/button.type";
import { IconButton } from "@/design-system/components/button/ui/button";
import type {
  CarouselControlProps,
  CarouselIndicatorGroupProps,
  CarouselIndicatorProps,
  CarouselIndicatorsProps,
  CarouselItemGroupProps,
  CarouselItemProps,
  CarouselNextTriggerProps,
  CarouselPrevTriggerProps,
  CarouselRootProps,
} from "@/design-system/components/disclosure/type/carousel.type";
import { Carousel as ChakraCarousel } from "@chakra-ui/react";
import { forwardRef } from "react";

const CarouselRoot = forwardRef<HTMLDivElement, CarouselRootProps>(
  (props, ref) => {
    return <ChakraCarousel.Root ref={ref} {...props} />;
  },
);

const CarouselControl = forwardRef<HTMLDivElement, CarouselControlProps>(
  (props, ref) => {
    return (
      <ChakraCarousel.Control
        ref={ref}
        display={"flex"}
        flexDir={"column"}
        {...props}
      />
    );
  },
);

const CarouselPrevTrigger = forwardRef<
  HTMLButtonElement,
  CarouselPrevTriggerProps
>((props, ref) => {
  return <ChakraCarousel.PrevTrigger ref={ref} {...props} />;
});

const CarouselNextTrigger = forwardRef<
  HTMLButtonElement,
  CarouselNextTriggerProps
>((props, ref) => {
  return <ChakraCarousel.NextTrigger ref={ref} {...props} />;
});

const CarouselItemGroup = forwardRef<HTMLDivElement, CarouselItemGroupProps>(
  (props, ref) => {
    return <ChakraCarousel.ItemGroup ref={ref} {...props} />;
  },
);

const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  (props, ref) => {
    return (
      <ChakraCarousel.Item
        ref={ref}
        display={"flex"}
        flexDir={"column"}
        {...props}
      />
    );
  },
);

const CarouselIndicatorGroup = forwardRef<
  HTMLDivElement,
  CarouselIndicatorGroupProps
>((props, ref) => {
  return <ChakraCarousel.IndicatorGroup ref={ref} {...props} />;
});

const CarouselIndicator = forwardRef<HTMLButtonElement, CarouselIndicatorProps>(
  (props, ref) => {
    return <ChakraCarousel.Indicator ref={ref} {...props} />;
  },
);

const CarouselIndicators = (props: CarouselIndicatorsProps) => {
  return <ChakraCarousel.Indicators opacity={0.5} {...props} />;
};

const CarouselActionButton = (props: IconButtonProps) => {
  return (
    <IconButton variant={"outline"} zIndex={1} rounded={"full"} {...props} />
  );
};

export const Carousel = {
  Root: CarouselRoot,
  Control: CarouselControl,
  PrevTrigger: CarouselPrevTrigger,
  NextTrigger: CarouselNextTrigger,
  ItemGroup: CarouselItemGroup,
  Item: CarouselItem,
  IndicatorGroup: CarouselIndicatorGroup,
  Indicator: CarouselIndicator,
  Indicators: CarouselIndicators,
  ActionButton: CarouselActionButton,
};
