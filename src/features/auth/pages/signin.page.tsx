// src/features/auth/pages/signin.page.tsx

"use client";

import { AtrLogo } from "@/design-system/components/branding/ui/atr-logo";
import { Button } from "@/design-system/components/button/ui/button";
import { Carousel } from "@/design-system/components/disclosure/ui/carousel";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { Input } from "@/design-system/components/input/ui/input";
import { PasswordInput } from "@/design-system/components/input/ui/password-input";
import { SegmentedControl } from "@/design-system/components/input/ui/segmented-control";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { PageContainer } from "@/design-system/components/layout/ui/page-container";
import { Image } from "@/design-system/components/media/ui/image";
import { P, PSerif } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { IMAGES_PATH } from "@/shared/constants/paths";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useState } from "react";

type Role = "mitra" | "internal";
type SigninMap = Record<
  Role,
  {
    component: React.ReactNode;
  }
>;
type RoleOption = {
  label: string;
  value: Role;
};

const SIGNIN_CAROUSEL = [
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

export const SigninPage = () => {
  // Stores
  const { theme } = useThemeStore();

  // State
  const [role, setRole] = useState<Role>("mitra");

  // Constants
  const SIGNIN_MAP: SigninMap = {
    mitra: {
      component: <MitraSignin />,
    },
    internal: {
      component: <InternalSignin />,
    },
  };
  const ROLE_OPTIONS: RoleOption[] = [
    {
      label: "Mitra Kementrian ATR/BPN",
      value: "mitra",
    },
    {
      label: "Internal Kementrian ATR/BPN",
      value: "internal",
    },
  ];

  return (
    <PageContainer align={"center"} justify={"center"}>
      <SimpleGrid
        columns={[1, null, 2]}
        flex={1}
        overflow={"clip"}
        w={"full"}
        maxW={"1200px"}
        maxH={"720px"}
        // border={"1px solid"}
        borderColor={"border.subtle"}
        rounded={theme.radii.container}
        // shadow={"md"}
      >
        <SigninCarousel />

        <VStack align={"center"} justify={"center"} p={[4, null, 12]}>
          <HStack align={"center"} gap={2}>
            <AtrLogo />

            <VStack>
              <P fontSize={"lg"} fontWeight={"semibold"}>
                Kementrian ATR/BPM
              </P>

              <PSerif>Melayani Profesional Terpercaya</PSerif>
            </VStack>
          </HStack>

          <VStack flex={1} align={"center"} mt={16}>
            <VStack align={"center"} gap={1}>
              <P fontSize={"2xl"} fontWeight={"semibold"} textAlign={"center"}>
                Selamat Datang Kembali👋🏻
              </P>

              <P color={"fg.muted"} textAlign={"center"}>
                Pastikan informasi yang dimasukkan sudah benar!
              </P>
            </VStack>

            <VStack flex={1} gap={10} mt={4}>
              <SegmentedControl
                options={ROLE_OPTIONS}
                defaultValue={"mitra"}
                onValueChange={(details) => {
                  setRole(details.value as Role);
                }}
                mt={4}
              />

              <VStack flex={1}>{SIGNIN_MAP[role].component}</VStack>
            </VStack>
          </VStack>
        </VStack>
      </SimpleGrid>
    </PageContainer>
  );
};

const SigninCarousel = () => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <VStack
      p={[4, null, 6]}
      rounded={theme.radii.container}
      bg={`${theme.colorPalette}.solid`}
    >
      <Carousel.Root
        slideCount={SIGNIN_CAROUSEL.length}
        flex={1}
        gap={4}
        pos={"relative"}
      >
        <Carousel.Control flex={1} gap={[4, null, 6]}>
          <VStack
            flex={1}
            rounded={theme.radii.container}
            bg={"whiteAlpha.200"}
          >
            <Carousel.ItemGroup w={"full"}>
              {SIGNIN_CAROUSEL.map((carousel, index) => (
                <Carousel.Item key={index} index={index} color={"white"}>
                  <VStack gap={4} p={[4, null, 6]}>
                    <P
                      fontSize={"xl"}
                      fontWeight={"semibold"}
                      textAlign={"center"}
                    >
                      {carousel.title}
                    </P>

                    <Image
                      src={carousel.image}
                      alt={`Image ${index + 1}`}
                      objectFit={"contain"}
                      w={"full"}
                    />

                    <P textAlign={"center"}>{carousel.description}</P>
                  </VStack>
                </Carousel.Item>
              ))}
            </Carousel.ItemGroup>
          </VStack>

          <HStack align={"center"} gap={4} w={"full"}>
            <Carousel.PrevTrigger asChild>
              <Carousel.ActionButton
                color={"white"}
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

const MitraSignin = () => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <VStack flex={1}>
      <Fieldset mb={"auto"}>
        <Field label={"Email"}>
          <Input placeholder={"jolitos@email.com"} />
        </Field>

        <Field label={"Kata Sandi"}>
          <PasswordInput placeholder={"••••••••"} />
        </Field>

        <P
          ml={"auto"}
          color={`${theme.colorPalette}.fg`}
          cursor={"pointer"}
          borderBottom={"1px solid"}
          borderColor={"transparent"}
          _hover={{ borderColor: `${theme.colorPalette}` }}
        >
          Lupa kata sandi?
        </P>
      </Fieldset>

      <Button primary type={"submit"}>
        Masuk
      </Button>
    </VStack>
  );
};

const InternalSignin = () => {
  return (
    <VStack>
      <Fieldset>
        <Field label={"Email"}>
          <Input />
        </Field>

        <Field label={"Kata Sandi"}>
          <PasswordInput />
        </Field>
      </Fieldset>
    </VStack>
  );
};
