// src/features/branding/components/ui/features-carousel.tsx

"use client";

import { Carousel } from "@/design-system/components/disclosure/ui/carousel";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Image } from "@/design-system/components/media/ui/image";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { IMAGES_PATH } from "@/shared/constants/paths";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

const CAROUSEL_ITEMS = [
  {
    image: `${IMAGES_PATH}/signin_carousel/1.png`,
    title: "Beranda Pengguna",
    description:
      "Dashboard yang menyajikan ringkasan status data IGT, informasi keranjang pembelian, statistik alur keuangan, dan riwayat transaksi dalam satu tampilan terintegrasi untuk memudahkan pemantauan aktivitas pengguna.",
  },
  {
    image: `${IMAGES_PATH}/signin_carousel/2.png`,
    title: "Peta Interaktif",
    description:
      "Peta Interaktif memungkinkan pengguna menyeleksi data IGT-PR berdasarkan area pada peta dan menambahkan data terpilih ke keranjang pembelian.",
  },
  {
    image: `${IMAGES_PATH}/signin_carousel/3.png`,
    title: "Tiket Laporan",
    description:
      "Tiket Laporan memudahkan pengguna untuk mengirim laporan, melampirkan dokumen pendukung, serta memantau proses penanganan dan tanggapan dari administrator dalam satu platform terintegrasi.",
  },
];

export type FeaturesCarouselProps = StackProps & {};

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
      <Carousel.Root
        loop
        autoplay={{
          delay: 6000,
        }}
        slideCount={CAROUSEL_ITEMS.length}
        flex={1}
        gap={4}
        pos={"relative"}
      >
        <Carousel.Control flex={1} gap={[4, null, 6]}>
          <Carousel.ItemGroup
            w={"full"}
            flex={1}
            rounded={theme.radii.container}
            bg={"whiteAlpha.200"}
          >
            {CAROUSEL_ITEMS.map((carousel, index) => (
              <Carousel.Item
                key={index}
                index={index}
                flex={1}
                gap={4}
                p={[4, null, 6]}
                color={"white"}
              >
                <P fontSize={"xl"} fontWeight={"semibold"} textAlign={"center"}>
                  {carousel.title}
                </P>

                <Image
                  src={carousel.image}
                  alt={`Image ${index + 1}`}
                  objectFit={"contain"}
                  w={"full"}
                  mt={4}
                  aspectRatio={16 / 10}
                />

                <P textAlign={"center"} mt={"auto"}>
                  {carousel.description}
                </P>
              </Carousel.Item>
            ))}
          </Carousel.ItemGroup>

          <HStack align={"center"} gap={4} w={"full"}>
            <Carousel.PrevTrigger asChild>
              <Carousel.ActionButton
                color={"white"}
                borderColor={"white"}
                _hover={{
                  bg: "an1",
                }}
              >
                <AppIcon icon={ArrowLeftIcon} />
              </Carousel.ActionButton>
            </Carousel.PrevTrigger>

            <Box w={"full"}>
              <Carousel.Indicators
                bg={"bodyLight"}
                boxSize={1.5}
                transition={"200ms"}
                transformOrigin={"center"}
                w={"full"}
                _current={{
                  opacity: 1,
                }}
              />
            </Box>

            <Carousel.NextTrigger asChild>
              <Carousel.ActionButton
                color={"white"}
                borderColor={"white"}
                _hover={{
                  bg: "an1",
                }}
              >
                <AppIcon icon={ArrowRightIcon} />
              </Carousel.ActionButton>
            </Carousel.NextTrigger>
          </HStack>
        </Carousel.Control>
      </Carousel.Root>
    </VStack>
  );
};
