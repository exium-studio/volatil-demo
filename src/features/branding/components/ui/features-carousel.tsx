// src/features/branding/components/ui/features-carousel.tsx

"use client";

import { IgtLogo } from "@/design-system/components/branding/ui/igt-logo";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { Image } from "@/design-system/components/media/ui/image";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type { FeaturesCarouselProps } from "@/features/branding/types/branding.type";
import { PATH_CONFIG } from "@/shared/constants/paths";

const FEATURE_ITEM = {
  image: `${PATH_CONFIG.images}/signin_carousel/1.png`,
  title: "Layanan Jasa Akses IGT",
  description:
    "Layanan Jasa Akses IGT merupakan layanan penyediaan akses terhadap Informasi Geospasial Tematik (IGT) Pertanahan dan Ruang secara digital melalui mekanisme integrasi sistem berupa Web Map Service (WMS) kepada Pelaksana Kerja Sama dengan melakukan pengayaan data dengan mengintegrasikan IGT untuk menghasilkan informasi geospasial baru sesuai dengan kebutuhan pemanfaatan dan ketentuan yang berlaku.",
};

export const FeaturesCarousel = (props: FeaturesCarouselProps) => {
  // Props
  const { ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  return (
    <VStack
      p={[4, null, 6]}
      rounded={theme.radii.container}
      bg={`${theme.colorPalette}.solid`}
      {...restProps}
    >
      <VStack
        pos={"relative"}
        w={"full"}
        flex={1}
        rounded={theme.radii.container}
        bg={"whiteAlpha.200"}
        gap={4}
        p={[4, null, 6]}
        color={"white"}
        overflow={"clip"}
      >
        <IgtLogo
          pos={"absolute"}
          top={"-50px"}
          right={"-50px"}
          boxSize={"300px"}
          opacity={0.1}
          filter={"brightness(0) invert(1)"}
        />

        <Image
          src={FEATURE_ITEM.image}
          alt={"Image 1"}
          objectFit={"contain"}
          w={"full"}
          my={"auto"}
          aspectRatio={16 / 10}
        />

        <VStack gap={"sm"}>
          <P fontSize={"xl"} fontWeight={"semibold"}>
            {FEATURE_ITEM.title}
          </P>

          <P mt={"auto"}>{FEATURE_ITEM.description}</P>
        </VStack>
      </VStack>
    </VStack>
  );
};
