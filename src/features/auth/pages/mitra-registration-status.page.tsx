// src/features/auth/pages/mitra-registration-status.page.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Input } from "@/design-system/components/input/ui/input";
import { ConstrainedContainer } from "@/design-system/components/layout/ui/constrained-container";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { PageContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P, PLink } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useRegistrationStatusQuery } from "@/features/auth/hooks/use-mitra-registration.mutation";
import type { MitraRegistrationStatus } from "@/features/auth/types/mitra-registration.type";
import { Link } from "@tanstack/react-router";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  ClockIcon,
  DownloadIcon,
  FileCheckIcon,
  SearchIcon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { Box } from "@/design-system/components/layout/ui/box";

const STATUS_CONFIG: Record<
  MitraRegistrationStatus,
  {
    label: string;
    colorPalette: string;
    icon: typeof CheckCircle2Icon;
    desc: string;
  }
> = {
  pending_verification: {
    label: "Menunggu Verifikasi",
    colorPalette: "orange",
    icon: ClockIcon,
    desc: "Permohonan Anda sedang diverifikasi oleh Tim Teknis Kementerian ATR/BPN.",
  },
  approved: {
    label: "Disetujui",
    colorPalette: "green",
    icon: CheckCircle2Icon,
    desc: "Permohonan telah disetujui. Akun SSO telah diaktifkan dan dokumen kontrak dapat diunduh.",
  },
  rejected: {
    label: "Ditolak",
    colorPalette: "red",
    icon: XCircleIcon,
    desc: "Permohonan tidak dapat disetujui. Silakan periksa alasan penolakan di bawah ini.",
  },
};

export const MitraRegistrationStatusPage = () => {
  // Stores
  const { theme } = useThemeStore();

  // States
  const [searchInput, setSearchInput] = useState<string>("");
  const [queryRegNumber, setQueryRegNumber] = useState<string>("");

  // Queries
  const {
    data: statusData,
    isLoading,
    isError,
    error,
  } = useRegistrationStatusQuery(queryRegNumber, Boolean(queryRegNumber));

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setQueryRegNumber(searchInput.trim().toUpperCase());
  };

  const statusConfig = statusData
    ? STATUS_CONFIG[statusData.status] || STATUS_CONFIG.pending_verification
    : null;

  return (
    <PageContainer p={[2, null, 6]} overflowY={"auto"}>
      <ConstrainedContainer py={4}>
        {/* Header */}
        <HStack align={"center"} justify={"space-between"} mb={8} w={"full"}>
          <BackButton />

          <Heading size={"2xl"} textAlign={"center"} flex={1} pr={"40px"}>
            {"Cek Status Kemitraan"}
          </Heading>

          <Box w={"buttonH"} minW={"buttonH"} aria-hidden={true} />
        </HStack>

        <Container.Root
          borderColor={"border.subtle"}
          rounded={theme.radii.container}
        >
          <HeaderContainer p={6}>
            <VStack align={"center"} textAlign={"center"} w={"full"} gap={1}>
              <P fontWeight={"semibold"} fontSize={"md"}>
                {"Pelacakan Pengajuan Kemitraan Publik"}
              </P>
              <P fontSize={"sm"} color={"fg.muted"} maxW={"560px"}>
                {
                  "Masukkan nomor registrasi permohonan yang Anda dapatkan saat pendaftaran (format: REG-2026-XXXXX)."
                }
              </P>
            </VStack>
          </HeaderContainer>

          <Separator borderColor={"border.subtle"} />

          <Container.Body p={[4, null, 6]}>
            {/* Search Box */}
            <VStack
              as={"form"}
              onSubmit={handleSearch}
              align={"stretch"}
              gap={4}
              mb={6}
            >
              <Field label={"Nomor Registrasi"}>
                <HStack gap={2}>
                  <Input
                    placeholder={"Contoh: REG-2026-00001"}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <Button
                    primary={true}
                    type={"submit"}
                    loading={isLoading}
                    disabled={!searchInput.trim()}
                  >
                    <AppIcon icon={SearchIcon} />
                    {"Lacak"}
                  </Button>
                </HStack>
              </Field>
            </VStack>

            {/* Results Section */}
            {isLoading && (
              <VStack gap={4} py={4}>
                <Skeleton h={"80px"} w={"full"} />
                <Skeleton h={"120px"} w={"full"} />
              </VStack>
            )}

            {isError && (
              <Alert.Root status={"error"} size={"sm"}>
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>
                    {"Nomor Registrasi Tidak Ditemukan"}
                  </Alert.Title>
                  <Alert.Description>
                    {error?.message ||
                      "Mohon pastikan nomor registrasi yang Anda masukkan sudah benar."}
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
            )}

            {statusData && statusConfig && (
              <VStack align={"stretch"} gap={4}>
                <Box
                  p={5}
                  bg={"bg.subtle"}
                  rounded={"md"}
                  borderWidth={"1px"}
                  borderColor={"border.subtle"}
                >
                  <HStack
                    justify={"space-between"}
                    align={"center"}
                    mb={4}
                    wrap={"wrap"}
                    gap={2}
                  >
                    <VStack align={"start"} gap={0}>
                      <P fontSize={"xs"} color={"fg.subtle"}>
                        {"Nomor Registrasi"}
                      </P>
                      <P fontSize={"lg"} fontWeight={"bold"} color={"blue.600"}>
                        {statusData.registrationNumber}
                      </P>
                    </VStack>

                    <Badge
                      size={"lg"}
                      colorPalette={statusConfig.colorPalette}
                      variant={"subtle"}
                    >
                      <AppIcon icon={statusConfig.icon} />
                      {statusConfig.label}
                    </Badge>
                  </HStack>

                  {statusData.namaInstansi && (
                    <Box mb={3}>
                      <P fontSize={"xs"} color={"fg.subtle"}>
                        {"Nama Instansi / Perusahaan"}
                      </P>
                      <P fontWeight={"semibold"}>{statusData.namaInstansi}</P>
                    </Box>
                  )}

                  <P fontSize={"sm"} color={"fg.muted"}>
                    {statusData.statusDescription || statusConfig.desc}
                  </P>

                  {/* If Approved with Contract Document */}
                  {statusData.status === "approved" &&
                    statusData.contractDocument && (
                      <Box
                        mt={4}
                        p={3}
                        bg={"green.50"}
                        rounded={"md"}
                        borderWidth={"1px"}
                        borderColor={"green.200"}
                      >
                        <HStack justify={"space-between"} align={"center"}>
                          <HStack gap={2}>
                            <AppIcon icon={FileCheckIcon} color={"green.600"} />
                            <VStack align={"start"} gap={0}>
                              <P
                                fontSize={"xs"}
                                fontWeight={"bold"}
                                color={"green.800"}
                              >
                                {"Dokumen Kontrak Kemitraan Resmi"}
                              </P>
                              <P fontSize={"xs"} color={"green.700"}>
                                {"Silakan unduh salinan berkas kontrak"}
                              </P>
                            </VStack>
                          </HStack>

                          <a
                            href={statusData.contractDocument}
                            target={"_blank"}
                            rel={"noreferrer"}
                            download
                          >
                            <Button size={"xs"} colorPalette={"green"}>
                              <AppIcon icon={DownloadIcon} />
                              {"Unduh Kontrak"}
                            </Button>
                          </a>
                        </HStack>
                      </Box>
                    )}

                  {/* If Rejected with Reason */}
                  {statusData.status === "rejected" &&
                    statusData.rejectionReason && (
                      <Box
                        mt={4}
                        p={3}
                        bg={"red.50"}
                        rounded={"md"}
                        borderWidth={"1px"}
                        borderColor={"red.200"}
                      >
                        <VStack align={"start"} gap={1}>
                          <HStack gap={2} color={"red.700"}>
                            <AppIcon icon={AlertCircleIcon} size={"sm"} />
                            <P fontSize={"xs"} fontWeight={"bold"}>
                              {"Alasan Penolakan Resmi:"}
                            </P>
                          </HStack>
                          <P fontSize={"sm"} color={"red.800"}>
                            {statusData.rejectionReason}
                          </P>
                        </VStack>
                      </Box>
                    )}
                </Box>
              </VStack>
            )}
          </Container.Body>
        </Container.Root>

        {/* Footer Link */}
        <VStack align={"center"} mt={6} gap={2}>
          <P fontSize={"sm"} color={"fg.muted"}>
            {"Belum mengajukan kemitraan? "}
            <Link to={"/register"}>
              <PLink fontWeight={"semibold"}>{"Daftar Kemitraan Baru"}</PLink>
            </Link>
          </P>

          <P fontSize={"sm"} color={"fg.muted"}>
            {"Kembali ke halaman utama? "}
            <Link to={"/"}>
              <PLink fontWeight={"semibold"}>{"Halaman Masuk"}</PLink>
            </Link>
          </P>
        </VStack>
      </ConstrainedContainer>
    </PageContainer>
  );
};
