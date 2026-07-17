// src/design-system/components/disclosure/ui/carousel.tsx

"use client";

import { forwardRef } from "react";
import { Carousel as ChakraCarousel } from "@chakra-ui/react";
import type {
  CarouselRootProps,
  CarouselControlProps,
  CarouselPrevTriggerProps,
  CarouselNextTriggerProps,
  CarouselItemGroupProps,
  CarouselItemProps,
  CarouselIndicatorGroupProps,
  CarouselIndicatorProps,
  CarouselIndicatorsProps,
} from "@/design-system/components/disclosure/type/carousel.type";
import { BACKDROP_FILTER_BLUR } from "@/design-system/constants/styles";

const CarouselRoot = forwardRef<HTMLDivElement, CarouselRootProps>(
  (props, ref) => {
    return <ChakraCarousel.Root ref={ref} {...props} />;
  },
);

const CarouselControl = forwardRef<HTMLDivElement, CarouselControlProps>(
  (props, ref) => {
    return <ChakraCarousel.Control ref={ref} {...props} />;
  },
);

const CarouselPrevTrigger = forwardRef<
  HTMLButtonElement,
  CarouselPrevTriggerProps
>((props, ref) => {
  return (
    <ChakraCarousel.PrevTrigger
      ref={ref}
      bg={"an2"}
      color={"white"}
      borderColor={"border.subtle"}
      backdropFilter={BACKDROP_FILTER_BLUR}
      {...props}
    />
  );
});

const CarouselNextTrigger = forwardRef<
  HTMLButtonElement,
  CarouselNextTriggerProps
>((props, ref) => {
  return (
    <ChakraCarousel.NextTrigger
      ref={ref}
      bg={"an2"}
      color={"white"}
      borderColor={"border.subtle"}
      backdropFilter={BACKDROP_FILTER_BLUR}
      {...props}
    />
  );
});

const CarouselItemGroup = forwardRef<HTMLDivElement, CarouselItemGroupProps>(
  (props, ref) => {
    return <ChakraCarousel.ItemGroup ref={ref} {...props} />;
  },
);

const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  (props, ref) => {
    return <ChakraCarousel.Item ref={ref} {...props} />;
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
};
