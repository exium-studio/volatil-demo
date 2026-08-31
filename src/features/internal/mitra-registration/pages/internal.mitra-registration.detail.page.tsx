// src/features/internal/mitra-registration/pages/internal.mitra-registration.detail.page.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { InternalMitraRegistrationApproveTrigger } from "@/features/internal/mitra-registration/components/internal.mitra-registration.approve-modal";
import { InternalMitraRegistrationRejectTrigger } from "@/features/internal/mitra-registration/components/internal.mitra-registration.reject-modal";
import { useInternalMitraRegistrationDetailQuery } from "@/features/internal/mitra-registration/hooks/use-mitra-registration.query";
import type { MitraRegistrationStatus } from "@/features/internal/mitra-registration/types/mitra-registration.type";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Building2Icon,
  CheckCircle2Icon,
  ClockIcon,
  DownloadIcon,
  FileTextIcon,
  GlobeIcon,
  MailIcon,
  PhoneIcon,
  UserCheckIcon,
  XCircleIcon,
} from "lucide-react";
import { useMemo } from "react";

const STATUS_CONFIG: Record<
  MitraRegistrationStatus,
  { label: string; colorPalette: string; icon: typeof CheckCircle2Icon }
> = {
  pending_verification: {
    label: "Menunggu Verifikasi",
    colorPalette: "orange",
    icon: ClockIcon,
  },
  approved: {
    label: "Disetujui",
    colorPalette: "green",
    icon: CheckCircle2Icon,
  },
  rejected: {
    label: "Ditolak",
    colorPalette: "red",
    icon: XCircleIcon,
  },
};

export const InternalMitraRegistrationDetailPage = () => {
  // Hooks
  const { registrationId } = useParams({ strict: false }) as {
    registrationId: string;
  };
  const navigate = useNavigate();

  // Queries
  const { data: registration, isLoading } =
    useInternalMitraRegistrationDetailQuery(registrationId);

  // Derived Values
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  if (isLoading) {
    return (
      <PanelContentContainer h={"auto"}>
        <Skeleton h={"200px"} w={"full"} />
        <Skeleton h={"400px"} w={"full"} />
      </PanelContentContainer>
    );
  }

  if (!registration) {
    return (
      <PanelContentContainer h={"auto"}>
        <Center flex={1} p={"xl"}>
          <P color={"fg.muted"}>{"Data permohonan mitra tidak ditemukan."}</P>
        </Center>
      </PanelContentContainer>
    );
  }

  const statusConfig =
    STATUS_CONFIG[registration.status] || STATUS_CONFIG.pending_verification;

  const documents = [
    {
      title: "1. Surat Permohonan Kemitraan",
      url: registration.suratPermohonan,
      desc: "Surat resmi pengajuan kerjasama kemitraan",
    },
    {
      title: "2. Dokumen DIK",
      url: registration.dokumenDik,
      desc: "Dokumen Informasi Kebutuhan Data",
    },
    {
      title: "3. Surat Pernyataan Hukum",
      url: registration.suratPernyataanHukum,
      desc: "Surat pernyataan tunduk pada ketentuan hukum",
    },
    {
      title: "4. Surat Komitmen Evaluasi (Lampiran III)",
      url: registration.suratKomitmenEvaluasi,
      desc: "Komitmen evaluasi berkala pemanfaatan IGT",
    },
    {
      title: "5. Surat Komitmen Perbaikan (Lampiran IV)",
      url: registration.suratKomitmenPerbaikan,
      desc: "Komitmen perbaikan mutu & kepatuhan data",
    },
    {
      title: "6. Proposal Teknis Pemanfaatan IGT",
      url: registration.proposalTeknis,
      desc: "Proposal teknis rencana pemanfaatan spasial",
    },
  ];

  return (
    <PanelContentContainer flex={1} position={"relative"}>
      <Container.Root withContext flex={1}>
        <Container.Body overflowY={"auto"}>
          {/* Header Bar */}
          <HeaderContainer>
            <HStack justify={"space-between"} align={"center"} w={"full"}>
              <HStack gap={3}>
                <BackButton
                  onClick={() => {
                    void navigate({ to: "/internal/mitra-registration" });
                  }}
                />
                <VStack align={"start"} gap={0}>
                  <Heading size={"md"}>{registration.namaInstansi}</Heading>
                  <P fontSize={"xs"} color={"blue.600"} fontWeight={"semibold"}>
                    {registration.registrationNumber}
                  </P>
                </VStack>
              </HStack>

              {/* Action Buttons for Pending Registrations */}
              {registration.status === "pending_verification" && (
                <HStack gap={2}>
                  <InternalMitraRegistrationRejectTrigger
                    registration={registration}
                    onSuccessRedirect={() => {
                      void navigate({ to: "/internal/mitra-registration" });
                    }}
                  >
                    <Button variant={"outline"} colorPalette={"red"}>
                      <AppIcon icon={XCircleIcon} />
                      {"Tolak"}
                    </Button>
                  </InternalMitraRegistrationRejectTrigger>

                  <InternalMitraRegistrationApproveTrigger
                    registration={registration}
                    onSuccessRedirect={() => {
                      void navigate({ to: "/internal/mitra-registration" });
                    }}
                  >
                    <Button primary={true} colorPalette={"green"}>
                      <AppIcon icon={CheckCircle2Icon} />
                      {"Setujui & Unggah Kontrak"}
                    </Button>
                  </InternalMitraRegistrationApproveTrigger>
                </HStack>
              )}
            </HStack>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          {/* Status Bar */}
          <Box p={"md"} bg={"bg.subtle"}>
            <HStack justify={"space-between"} align={"center"} wrap={"wrap"} gap={"md"}>
              <HStack gap={3}>
                <Badge
                  size={"lg"}
                  colorPalette={statusConfig.colorPalette}
                  variant={"subtle"}
                >
                  <AppIcon icon={statusConfig.icon} />
                  {statusConfig.label}
                </Badge>

                <P fontSize={"xs"} color={"fg.muted"}>
                  {`Diajukan pada: ${formatUtcDateTime(registration.createdAt, preferredTimezone)}`}
                </P>
              </HStack>

              {registration.verifiedAt && (
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {`Diverifikasi pada: ${formatUtcDateTime(registration.verifiedAt, preferredTimezone)}`}
                </P>
              )}
            </HStack>
          </Box>

          {/* If Rejected Alert */}
          {registration.status === "rejected" && registration.rejectionReason && (
            <Box p={"md"}>
              <Alert.Root status={"error"} size={"sm"}>
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{"Alasan Penolakan Permohonan:"}</Alert.Title>
                  <Alert.Description>
                    {registration.rejectionReason}
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
            </Box>
          )}

          {/* If Approved & Has Contract */}
          {registration.status === "approved" && registration.contractDocument && (
            <Box p={"md"}>
              <Alert.Root status={"success"} size={"sm"}>
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{"Berkas Kontrak Kemitraan Resmi Telah Terbit"}</Alert.Title>
                  <Alert.Description>
                    <HStack justify={"space-between"} align={"center"} w={"full"} mt={1}>
                      <P fontSize={"xs"}>{"Salinan kontrak kerjasama telah diunggah dan dikirimkan ke mitra."}</P>
                      <a
                        href={registration.contractDocument}
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
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
            </Box>
          )}

          <Separator borderColor={"bg.canvas"} />

          {/* Main Info Columns */}
          <VStack p={"md"} gap={"lg"} align={"stretch"}>
            {/* Section 1: Data Perusahaan */}
            <Box>
              <HStack gap={2} mb={3} color={"blue.600"}>
                <AppIcon icon={Building2Icon} />
                <Heading size={"sm"}>{"Informasi Instansi / Perusahaan"}</Heading>
              </HStack>

              <SimpleGrid columns={[1, null, 2]} gap={4}>
                <Box p={3} bg={"bg.subtle"} rounded={"md"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Nama Instansi / Perusahaan"}
                  </P>
                  <P fontWeight={"semibold"}>{registration.namaInstansi}</P>
                </Box>

                <Box p={3} bg={"bg.subtle"} rounded={"md"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Nomor Induk Berusaha (NIB)"}
                  </P>
                  <P fontWeight={"semibold"}>{registration.nib}</P>
                </Box>

                <Box p={3} bg={"bg.subtle"} rounded={"md"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Nomor Pokok Wajib Pajak (NPWP)"}
                  </P>
                  <P fontWeight={"semibold"}>{registration.npwp}</P>
                </Box>

                <Box p={3} bg={"bg.subtle"} rounded={"md"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Situs Web"}
                  </P>
                  {registration.website ? (
                    <HStack gap={1}>
                      <AppIcon icon={GlobeIcon} size={"xs"} color={"fg.muted"} />
                      <a
                        href={
                          registration.website.startsWith("http")
                            ? registration.website
                            : `https://${registration.website}`
                        }
                        target={"_blank"}
                        rel={"noreferrer"}
                      >
                        <P color={"blue.600"} fontWeight={"medium"}>
                          {registration.website}
                        </P>
                      </a>
                    </HStack>
                  ) : (
                    <P color={"fg.muted"}>{"-"}</P>
                  )}
                </Box>

                <Box gridColumn={[null, null, "span 2"]} p={3} bg={"bg.subtle"} rounded={"md"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Alamat Kantor Operasional"}
                  </P>
                  <P fontWeight={"medium"}>{registration.alamatKantor}</P>
                </Box>
              </SimpleGrid>
            </Box>

            <Separator borderColor={"border.subtle"} />

            {/* Section 2: Penanggung Jawab */}
            <Box>
              <HStack gap={2} mb={3} color={"purple.600"}>
                <AppIcon icon={UserCheckIcon} />
                <Heading size={"sm"}>{"Penanggung Jawab & Kontak"}</Heading>
              </HStack>

              <SimpleGrid columns={[1, null, 2]} gap={4}>
                <Box p={3} bg={"bg.subtle"} rounded={"md"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Nama Penanggung Jawab"}
                  </P>
                  <P fontWeight={"semibold"}>{registration.namaPenanggungJawab}</P>
                </Box>

                <Box p={3} bg={"bg.subtle"} rounded={"md"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Jabatan"}
                  </P>
                  <P fontWeight={"semibold"}>{registration.jabatan}</P>
                </Box>

                <Box p={3} bg={"bg.subtle"} rounded={"md"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Email Resmi (SSO)"}
                  </P>
                  <HStack gap={1}>
                    <AppIcon icon={MailIcon} size={"xs"} color={"fg.muted"} />
                    <P fontWeight={"semibold"}>{registration.email}</P>
                  </HStack>
                </Box>

                <Box p={3} bg={"bg.subtle"} rounded={"md"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Nomor HP / WhatsApp"}
                  </P>
                  <HStack gap={1}>
                    <AppIcon icon={PhoneIcon} size={"xs"} color={"fg.muted"} />
                    <P fontWeight={"semibold"}>{registration.nomorHp}</P>
                  </HStack>
                </Box>
              </SimpleGrid>
            </Box>

            <Separator borderColor={"border.subtle"} />

            {/* Section 3: 6 Berkas Dokumen */}
            <Box>
              <HStack gap={2} mb={3} color={"orange.600"}>
                <AppIcon icon={FileTextIcon} />
                <Heading size={"sm"}>{"Verifikasi 6 Berkas Dokumen Persyaratan"}</Heading>
              </HStack>

              <SimpleGrid columns={[1, null, 2]} gap={4}>
                {documents.map((doc, idx) => (
                  <Box
                    key={idx}
                    p={4}
                    borderWidth={"1px"}
                    borderColor={"border.subtle"}
                    rounded={"md"}
                    bg={"bg.panel"}
                  >
                    <HStack justify={"space-between"} align={"start"}>
                      <VStack align={"start"} gap={1} flex={1} mr={2}>
                        <P fontWeight={"semibold"} fontSize={"sm"}>
                          {doc.title}
                        </P>
                        <P fontSize={"xs"} color={"fg.muted"}>
                          {doc.desc}
                        </P>
                      </VStack>

                      {doc.url ? (
                        <a
                          href={doc.url}
                          target={"_blank"}
                          rel={"noreferrer"}
                          download
                        >
                          <Button size={"xs"} variant={"outline"}>
                            <AppIcon icon={DownloadIcon} />
                            {"Unduh"}
                          </Button>
                        </a>
                      ) : (
                        <Badge colorPalette={"gray"} size={"xs"}>
                          {"Tersedia"}
                        </Badge>
                      )}
                    </HStack>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </VStack>
        </Container.Body>
      </Container.Root>
    </PanelContentContainer>
  );
};
