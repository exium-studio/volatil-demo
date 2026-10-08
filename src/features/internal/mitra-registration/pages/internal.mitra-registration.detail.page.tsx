// src/features/internal/mitra-registration/pages/internal.mitra-registration.detail.page.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import { Button } from "@/design-system/components/button/ui/button";
import { FileIcon } from "@/design-system/components/data-display/ui/file-item";
import { Accordion } from "@/design-system/components/disclosure/ui/accordion";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Center } from "@/design-system/components/layout/ui/center";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { ExternalLink } from "@/design-system/components/navigation/ui/link";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { InternalMitraRegistrationApproveTrigger } from "@/features/internal/mitra-registration/components/internal.mitra-registration.approve-modal";
import { InternalMitraRegistrationRejectTrigger } from "@/features/internal/mitra-registration/components/internal.mitra-registration.reject-modal";
import { useInternalMitraRegistrationDetailQuery } from "@/features/internal/mitra-registration/hooks/use-mitra-registration.query";
import type {
  MitraRegistrationDetailFieldItem,
  MitraRegistrationDocumentItem,
} from "@/features/internal/mitra-registration/types/mitra-registration.type";

import { MitraRegistrationStatusBadge } from "@/features/shared/components/mitra-registration-status.badge";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Building2Icon,
  CheckCircleIcon,
  ExternalLinkIcon,
  FileTextIcon,
  MailIcon,
  PhoneIcon,
  SquareArrowOutUpRightIcon,
  UserCheckIcon,
  XCircleIcon,
} from "lucide-react";
import { useMemo } from "react";

export function InternalMitraRegistrationDetailPage() {
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

  const companyInfoFields: MitraRegistrationDetailFieldItem[] = useMemo(() => {
    if (!registration) return [];
    return [
      {
        label: "Nama Instansi / Perusahaan",
        value:
          registration.organizationName ?? registration.namaInstansi ?? "-",
      },
      {
        label: "Nomor Induk Berusaha (NIB)",
        value: registration.nib || "-",
      },
      {
        label: "Nomor Pokok Wajib Pajak (NPWP)",
        value: registration.npwp || "-",
      },
      {
        label: "Situs Web",
        value: registration.website ? (
          <ExternalLink
            href={
              registration.website.startsWith("http")
                ? registration.website
                : `https://${registration.website}`
            }
          >
            <HStack gap={1} align={"center"}>
              <P fontWeight={"medium"}>{registration.website}</P>
              <AppIcon icon={ExternalLinkIcon} size={"xs"} color={"fg.muted"} />
            </HStack>
          </ExternalLink>
        ) : (
          <P color={"fg.muted"}>{"-"}</P>
        ),
      },
      {
        label: "Alamat Kantor Operasional",
        value: registration.officeAddress ?? registration.alamatKantor ?? "-",
        isFullWidth: true,
      },
    ];
  }, [registration]);

  const picInfoFields: MitraRegistrationDetailFieldItem[] = useMemo(() => {
    if (!registration) return [];
    return [
      {
        label: "Nama Penanggung Jawab",
        value: registration.picName ?? registration.namaPenanggungJawab ?? "-",
      },
      {
        label: "Jabatan",
        value: registration.position ?? registration.jabatan ?? "-",
      },
      {
        label: "Email Resmi (SSO)",
        value: (
          <HStack align={"center"} gap={1.5}>
            <AppIcon icon={MailIcon} size={"xs"} color={"fg.muted"} />
            <P fontWeight={"medium"}>{registration.email || "-"}</P>
          </HStack>
        ),
      },
      {
        label: "Nomor HP / WhatsApp",
        value: (
          <HStack align={"center"} gap={1.5}>
            <AppIcon icon={PhoneIcon} size={"xs"} color={"fg.muted"} />
            <P fontWeight={"medium"}>
              {registration.phoneNumber ?? registration.nomorHp ?? "-"}
            </P>
          </HStack>
        ),
      },
    ];
  }, [registration]);

  const documents: MitraRegistrationDocumentItem[] = useMemo(() => {
    if (!registration) return [];
    const docs = registration.documents;
    return [
      {
        title: "1. Surat Permohonan Kemitraan",
        url: docs?.suratPermohonan?.url ?? registration.suratPermohonan,
        desc:
          docs?.suratPermohonan?.originalName ??
          "Surat resmi pengajuan kerjasama kemitraan",
        mimeType: docs?.suratPermohonan?.mimeType ?? "application/pdf",
        fileName: docs?.suratPermohonan?.fileName,
        size: docs?.suratPermohonan?.size,
      },
      {
        title: "2. Dokumen DIK",
        url: docs?.dokumenDik?.url ?? registration.dokumenDik,
        desc:
          docs?.dokumenDik?.originalName ?? "Dokumen Informasi Kebutuhan Data",
        mimeType: docs?.dokumenDik?.mimeType ?? "application/pdf",
        fileName: docs?.dokumenDik?.fileName,
        size: docs?.dokumenDik?.size,
      },
      {
        title: "3. Surat Pernyataan Hukum",
        url:
          docs?.suratPernyataanHukum?.url ?? registration.suratPernyataanHukum,
        desc:
          docs?.suratPernyataanHukum?.originalName ??
          "Surat pernyataan tunduk pada ketentuan hukum",
        mimeType: docs?.suratPernyataanHukum?.mimeType ?? "application/pdf",
        fileName: docs?.suratPernyataanHukum?.fileName,
        size: docs?.suratPernyataanHukum?.size,
      },
      {
        title: "4. Surat Komitmen Evaluasi (Lampiran III)",
        url:
          docs?.suratKomitmenEvaluasi?.url ??
          registration.suratKomitmenEvaluasi,
        desc:
          docs?.suratKomitmenEvaluasi?.originalName ??
          "Komitmen evaluasi berkala pemanfaatan IGT",
        mimeType: docs?.suratKomitmenEvaluasi?.mimeType ?? "application/pdf",
        fileName: docs?.suratKomitmenEvaluasi?.fileName,
        size: docs?.suratKomitmenEvaluasi?.size,
      },
      {
        title: "5. Surat Komitmen Perbaikan (Lampiran IV)",
        url:
          docs?.suratKomitmenPerbaikan?.url ??
          registration.suratKomitmenPerbaikan,
        desc:
          docs?.suratKomitmenPerbaikan?.originalName ??
          "Komitmen perbaikan mutu & kepatuhan data",
        mimeType: docs?.suratKomitmenPerbaikan?.mimeType ?? "application/pdf",
        fileName: docs?.suratKomitmenPerbaikan?.fileName,
        size: docs?.suratKomitmenPerbaikan?.size,
      },
      {
        title: "6. Proposal Teknis Pemanfaatan IGT",
        url: docs?.proposalTeknis?.url ?? registration.proposalTeknis,
        desc:
          docs?.proposalTeknis?.originalName ??
          "Proposal teknis rencana pemanfaatan spasial",
        mimeType: docs?.proposalTeknis?.mimeType ?? "application/pdf",
        fileName: docs?.proposalTeknis?.fileName,
        size: docs?.proposalTeknis?.size,
      },
    ];
  }, [registration]);

  if (isLoading) {
    return (
      <AppContentContainer>
        <Skeleton w={"full"} p={"md"} />
      </AppContentContainer>
    );
  }

  if (!registration) {
    return (
      <AppContentContainer h={"auto"}>
        <Center flex={1} p={"xl"}>
          <P color={"fg.muted"}>{"Data pendaftaran mitra tidak ditemukan."}</P>
        </Center>
      </AppContentContainer>
    );
  }

  return (
    <AppContentContainer flex={1} position={"relative"} overflowY={"auto"}>
      <Container.Root withContext flex={1} overflowY={"auto"}>
        <Container.Body overflowY={"auto"}>
          {/* Header Bar */}
          <HeaderContainer px={"xs"}>
            <HStack
              justify={"space-between"}
              align={"center"}
              w={"full"}
              wrap={"wrap"}
              gap={"sm"}
            >
              <HStack gap={3} align={"center"}>
                <BackButton
                  onClick={() => {
                    void navigate({ to: "/internal/mitra-registration" });
                  }}
                />

                <VStack align={"start"} gap={"2xs"}>
                  <Heading size={"md"}>
                    {registration.registrationNumber}
                  </Heading>
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
                      <AppIcon icon={CheckCircleIcon} />
                      {"Setujui & Unggah Kontrak"}
                    </Button>
                  </InternalMitraRegistrationApproveTrigger>
                </HStack>
              )}

              {registration.contractDocument?.url && (
                <ExternalLink
                  href={registration.contractDocument?.url}
                  variant={"plain"}
                >
                  <Button>
                    <AppIcon icon={SquareArrowOutUpRightIcon} />

                    <P>{"Berkas kontrak"}</P>
                  </Button>
                </ExternalLink>
              )}
            </HStack>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          <VStack overflowY={"auto"}>
            {/* Status & Metadata Bar */}
            <HStack gap={"md"} wrap={"wrap"} align={"center"} p={"md"}>
              <MitraRegistrationStatusBadge size={"sm"} showIcon={true}>
                {registration.status}
              </MitraRegistrationStatusBadge>

              <P fontSize={"xs"} color={"fg.muted"}>
                {`Diajukan: ${formatUtcDateTime(registration.createdAt, preferredTimezone)}`}
              </P>

              {registration.verifiedAt && (
                <P fontSize={"xs"} color={"fg.muted"}>
                  {`Diverifikasi: ${formatUtcDateTime(registration.verifiedAt, preferredTimezone)}`}
                </P>
              )}
            </HStack>

            <Separator borderColor={"bg.canvas"} />

            {/* Main Info Sections Accordion */}
            <Accordion.Root
              multiple={true}
              defaultValue={["company-info", "pic-info", "documents"]}
              w={"full"}
            >
              {/* Section 1: Data Perusahaan */}
              <Accordion.Item value={"company-info"}>
                <Accordion.ItemTrigger px={"md"} py={"sm"}>
                  <HStack align={"center"} gap={2} flex={1}>
                    <AppIcon icon={Building2Icon} color={"fg.subtle"} />

                    <Heading>{"Informasi Instansi / Perusahaan"}</Heading>
                  </HStack>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>

                <Accordion.ItemContent>
                  <Accordion.ItemBody px={"md"} pb={"md"} pt={0}>
                    <SimpleGrid columns={[1, null, 2]} gap={"md"}>
                      {companyInfoFields.map((field) => (
                        <VStack
                          key={field.label}
                          align={"start"}
                          gap={"2xs"}
                          gridColumn={
                            field.isFullWidth
                              ? [null, null, "span 2"]
                              : undefined
                          }
                        >
                          <P fontSize={"xs"} color={"fg.subtle"}>
                            {field.label}
                          </P>

                          {typeof field.value === "string" ? (
                            <P fontWeight={"medium"}>{field.value}</P>
                          ) : (
                            field.value
                          )}
                        </VStack>
                      ))}
                    </SimpleGrid>
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>

              {/* Section 2: Penanggung Jawab */}
              <Accordion.Item value={"pic-info"}>
                <Accordion.ItemTrigger px={"md"} py={"sm"}>
                  <HStack align={"center"} gap={2} flex={1}>
                    <AppIcon icon={UserCheckIcon} color={"fg.subtle"} />

                    <Heading>{"Penanggung Jawab & Kontak"}</Heading>
                  </HStack>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>

                <Accordion.ItemContent>
                  <Accordion.ItemBody px={"md"} pb={"md"} pt={0}>
                    <SimpleGrid columns={[1, null, 2]} gap={"md"}>
                      {picInfoFields.map((field) => (
                        <VStack
                          key={field.label}
                          align={"start"}
                          gap={"2xs"}
                          gridColumn={
                            field.isFullWidth
                              ? [null, null, "span 2"]
                              : undefined
                          }
                        >
                          <P fontSize={"xs"} color={"fg.subtle"}>
                            {field.label}
                          </P>

                          {typeof field.value === "string" ? (
                            <P fontWeight={"medium"}>{field.value}</P>
                          ) : (
                            field.value
                          )}
                        </VStack>
                      ))}
                    </SimpleGrid>
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>

              {/* Section 3: 6 Berkas Dokumen Persyaratan */}
              <Accordion.Item value={"documents"}>
                <Accordion.ItemTrigger px={"md"} py={"sm"}>
                  <HStack align={"center"} gap={2} flex={1}>
                    <AppIcon icon={FileTextIcon} color={"fg.muted"} />
                    <Heading>{"Berkas Dokumen Persyaratan"}</Heading>
                  </HStack>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>

                <Accordion.ItemContent>
                  <Accordion.ItemBody px={"md"} pb={"md"} pt={0}>
                    <VStack gap={0} w={"full"} align={"stretch"}>
                      {documents.map((doc, idx) => (
                        <HStack
                          key={doc.title}
                          w={"full"}
                          py={3}
                          justify={"space-between"}
                          align={"center"}
                          gap={"md"}
                          borderBottom={
                            idx < documents.length - 1 ? "1px solid" : "none"
                          }
                          borderColor={"border.subtle"}
                        >
                          <HStack gap={3} flex={1} minW={0} align={"center"}>
                            <FileIcon
                              mimeType={doc.mimeType ?? "application/pdf"}
                              size={"lg"}
                              color={"fg.muted"}
                              flexShrink={0}
                            />

                            <VStack
                              align={"start"}
                              gap={"2xs"}
                              flex={1}
                              minW={0}
                            >
                              <ClampedP
                                fontWeight={"medium"}
                                fontSize={"sm"}
                                title={doc.title}
                              >
                                {doc.title}
                              </ClampedP>

                              <ClampedP
                                fontSize={"xs"}
                                color={"fg.muted"}
                                title={doc.desc}
                              >
                                {doc.desc}
                              </ClampedP>
                            </VStack>
                          </HStack>

                          {doc.url ? (
                            <ExternalLink
                              href={doc.url}
                              download={true}
                              variant={"plain"}
                            >
                              <Button size={"xs"} variant={"outline"}>
                                <AppIcon icon={SquareArrowOutUpRightIcon} />
                                {"Tinjau Dokumen"}
                              </Button>
                            </ExternalLink>
                          ) : (
                            <Badge
                              colorPalette={"gray"}
                              variant={"subtle"}
                              size={"xs"}
                            >
                              {"Belum Diunggah"}
                            </Badge>
                          )}
                        </HStack>
                      ))}
                    </VStack>
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            </Accordion.Root>
          </VStack>
        </Container.Body>
      </Container.Root>
    </AppContentContainer>
  );
}
