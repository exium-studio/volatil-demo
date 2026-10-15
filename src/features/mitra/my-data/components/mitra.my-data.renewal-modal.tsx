// src/features/mitra/my-data/components/mitra.my-data.renewal-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP, P, TNum } from "@/design-system/components/typography/ui/p";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { usePricingPolicy } from "@/features/mitra/data-request/hooks/use-pricing-policy";
import { useRenewMitraWorkspace } from "@/features/mitra/my-data/hooks/use-mitra-my-data";
import type {
  MitraWorkspaceRenewalModalContentProps,
  MitraWorkspaceRenewalTriggerProps,
  RenewWorkspaceResponse,
} from "@/features/mitra/my-data/types/my-data.type";
import { checkOrderExtensionEligibility } from "@/features/mitra/my-data/utils/extension.utils";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import {
  formatCurrency,
  formatNumber,
} from "@/shared/utils/formatter/number.formatter";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ClockPlusIcon,
  ReceiptIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

export const MitraWorkspaceRenewalTrigger = (
  props: MitraWorkspaceRenewalTriggerProps,
) => {
  // Props
  const {
    modalKey: customModalKey = `mitra-workspace-renew-${props.workspace.id}`,
    workspace,
    children,
    renderTrigger,
  } = props;

  // Stores & Hooks
  const { systemPolicies } = usePricingPolicy();

  // Eligibility: Prioritizes backend fields (workspace.renewalEligibility / workspace.canRenew)
  const eligibility = useMemo(() => {
    return checkOrderExtensionEligibility(workspace, systemPolicies);
  }, [workspace, systemPolicies]);

  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey,
  });

  const isMounted = useMountTimeout({
    isOpen,
    mountDelay: 0,
    unmountDelay: 250,
  });

  const triggerNode = useMemo(() => {
    if (renderTrigger) {
      return renderTrigger({ eligibility, open, isOpen });
    }
    if (children) {
      return children;
    }
    return (
      <Tooltip content={eligibility.reason ?? "Perpanjang Layanan"}>
        <Button
          size={"xs"}
          variant={"outline"}
          disabled={!eligibility.canExtend}
        >
          <AppIcon icon={ClockPlusIcon} />
          {"Perpanjang"}
        </Button>
      </Tooltip>
    );
  }, [renderTrigger, children, eligibility, open, isOpen]);

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"md"}
    >
      <Modal.Trigger asChild={Boolean(children || renderTrigger)}>
        {triggerNode}
      </Modal.Trigger>

      {isMounted && (
        <MitraWorkspaceRenewalModalContent
          workspace={workspace}
          close={close}
        />
      )}
    </Modal.Root>
  );
};

export const MitraWorkspaceRenewalModalContent = (
  props: MitraWorkspaceRenewalModalContentProps,
) => {
  // Props
  const { workspace, close } = props;

  // States
  const [renewalResult, setRenewalResult] =
    useState<RenewWorkspaceResponse | null>(null);

  // Pricing Policy Hook (Source of truth for updated master tariffs from BE)
  const {
    pricePerBidang,
    pricePerKawasanHa,
    systemPolicies,
    isLoading: isPricingLoading,
  } = usePricingPolicy();

  // Mutations
  const renewMutation = useRenewMitraWorkspace();

  // Derived Values
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  const accessDurationDays = systemPolicies?.order_access_duration_days ?? 365;

  const currentFormattedExpiry = useMemo(() => {
    return formatUtcDateTime(workspace.expiresAt, preferredTimezone);
  }, [workspace.expiresAt, preferredTimezone]);

  const newExtendedExpiry = useMemo(() => {
    const date = new Date(workspace.expiresAt);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }
    const extended = new Date(date);
    extended.setDate(extended.getDate() + (accessDurationDays || 365));
    return formatUtcDateTime(extended.toISOString(), preferredTimezone);
  }, [workspace.expiresAt, accessDurationDays, preferredTimezone]);

  // Pricing Breakdown Calculation
  const bidangCount = Number(workspace.bidangCoverageCount ?? 0);
  const kawasanHa = Number(workspace.kawasanCoverageHa ?? 0);

  const subtotalBidang = useMemo(() => {
    if (bidangCount <= 0 || pricePerBidang <= 0) return 0;
    return bidangCount * pricePerBidang;
  }, [bidangCount, pricePerBidang]);

  const subtotalKawasan = useMemo(() => {
    if (kawasanHa <= 0 || pricePerKawasanHa <= 0) return 0;
    return kawasanHa * pricePerKawasanHa;
  }, [kawasanHa, pricePerKawasanHa]);

  const hasCoverageBreakdown = bidangCount > 0 || kawasanHa > 0;

  // Estimated total sum calculated directly from breakdown items
  const estimatedTotalPrice = useMemo(() => {
    if (hasCoverageBreakdown) {
      return subtotalBidang + subtotalKawasan;
    }
    // Fallback: per layer calculation if no coverage specified
    if (workspace.layers && workspace.layers.length > 0) {
      return workspace.layers.reduce((acc, layer) => {
        const basis = layer.spatialBasis ?? layer.igtBasis;
        const rate = basis === "kawasan" ? pricePerKawasanHa : pricePerBidang;
        return acc + rate;
      }, 0);
    }
    return 0;
  }, [
    hasCoverageBreakdown,
    subtotalBidang,
    subtotalKawasan,
    workspace.layers,
    pricePerKawasanHa,
    pricePerBidang,
  ]);

  // Handlers
  const handleProceedToPayment = () => {
    renewMutation.mutate(
      {
        workspaceId: workspace.id,
        payload: {},
      },
      {
        onSuccess: (data) => {
          setRenewalResult(data);
        },
      },
    );
  };

  // Render Instruction Step after Success (SSOT Backend)
  if (renewalResult) {
    const formattedExtendedUntil = formatUtcDateTime(
      renewalResult.extendedUntil,
      preferredTimezone,
    );

    return (
      <Modal.Content>
        <Modal.Header>
          <Modal.CloseButton />

          <VStack gap={"2xs"} w={"full"} align={"center"} pt={"xs"}>
            <Box color={"green.fg"}>
              <AppIcon icon={CheckCircle2Icon} size={"xl"} />
            </Box>

            <Modal.Title>{"Order Perpanjangan Dibuat"}</Modal.Title>

            <P color={"fg.muted"} textAlign={"center"} fontSize={"sm"}>
              {
                "Gunakan kode billing Simponi di bawah ini untuk menyelesaikan pembayaran."
              }
            </P>
          </VStack>
        </Modal.Header>

        <Modal.Body>
          <VStack gap={"md"} align={"stretch"} w={"full"}>
            {/* Billing Code Card */}
            <Box
              p={"md"}
              bg={"bg.subtle"}
              borderRadius={"md"}
              borderWidth={"1px"}
              borderColor={"border.muted"}
            >
              <VStack align={"stretch"} gap={"xs"}>
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"Kode Billing Simponi"}
                </P>

                <HStack justify={"space-between"} align={"center"}>
                  <P
                    fontSize={"xl"}
                    fontWeight={"bold"}
                    letterSpacing={"wider"}
                  >
                    <TNum>{renewalResult.billingCode}</TNum>
                  </P>

                  <ClipboardButton
                    value={renewalResult.billingCode}
                    size={"sm"}
                    variant={"outline"}
                  />
                </HStack>
              </VStack>
            </Box>

            {/* Order Details */}
            <Fieldset legend={"Rincian Perpanjangan"} containeredContent={true}>
              <VStack align={"stretch"} gap={"sm"}>
                <HStack justify={"space-between"} align={"center"}>
                  <P color={"fg.subtle"}>{"No. Order Perpanjangan"}</P>
                  <P fontWeight={"medium"}>{renewalResult.orderNumber}</P>
                </HStack>

                <HStack justify={"space-between"} align={"center"}>
                  <P color={"fg.subtle"}>{"Workspace"}</P>
                  <ClampedP fontWeight={"medium"}>
                    {workspace.workspaceName}
                  </ClampedP>
                </HStack>

                <HStack justify={"space-between"} align={"center"}>
                  <P color={"fg.subtle"}>{"Masa Aktif Baru"}</P>
                  <Badge variant={"subtle"} colorPalette={"brand"}>
                    {formattedExtendedUntil}
                  </Badge>
                </HStack>

                <Separator borderColor={"bg.canvas"} />

                <HStack justify={"space-between"} align={"center"}>
                  <P fontWeight={"medium"}>{"Total Tagihan"}</P>
                  <P fontSize={"lg"} fontWeight={"bold"} color={"brand.fg"}>
                    <TNum>{formatCurrency(renewalResult.totalAmount)}</TNum>
                  </P>
                </HStack>
              </VStack>
            </Fieldset>

            <P fontSize={"xs"} color={"fg.muted"} textAlign={"center"}>
              {
                "Masa aktif workspace akan diperbarui secara otomatis setelah pembayaran berhasil diverifikasi oleh sistem Simponi."
              }
            </P>
          </VStack>
        </Modal.Body>

        <Modal.Footer>
          <VStack gap={"xs"} w={"full"}>
            <Button primary={true} w={"full"} onClick={close}>
              {"Selesai"}
            </Button>
          </VStack>
        </Modal.Footer>
      </Modal.Content>
    );
  }

  // Initial Confirmation Step with Pricing Breakdown Preview
  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />

        <VStack gap={"2xs"} w={"full"}>
          <Modal.Title>{"Perpanjang Masa Aktif"}</Modal.Title>

          <P color={"fg.muted"} textAlign={"center"}>
            {"Perbarui masa aktif lisensi layanan geoserver workspace"}
          </P>
        </VStack>
      </Modal.Header>

      <Modal.Body>
        <VStack gap={"md"} align={"stretch"} w={"full"}>
          {/* Workspace Information */}
          <Fieldset legend={"Informasi Workspace"} containeredContent={true}>
            <VStack align={"stretch"} gap={"sm"}>
              <HStack justify={"space-between"} align={"center"}>
                <P color={"fg.subtle"}>{"Workspace"}</P>
                <ClampedP fontWeight={"medium"}>
                  {workspace.workspaceName}
                </ClampedP>
              </HStack>

              <HStack justify={"space-between"} align={"center"}>
                <P color={"fg.subtle"}>{"Jumlah Layer"}</P>
                <Badge variant={"subtle"} colorPalette={"brand"}>
                  {`${workspace.layersCount || workspace.layers.length} Layer`}
                </Badge>
              </HStack>

              <HStack justify={"space-between"} align={"center"}>
                <P color={"fg.subtle"}>{"Masa Aktif Saat Ini"}</P>
                <P fontWeight={"medium"}>{currentFormattedExpiry}</P>
              </HStack>

              <HStack justify={"space-between"} align={"center"}>
                <P color={"fg.subtle"}>{"Masa Aktif Baru"}</P>
                <HStack gap={"2xs"} align={"center"}>
                  <AppIcon icon={ArrowRightIcon} color={"blue.fg"} />
                  <P fontWeight={"semibold"} color={"brand.fg"}>
                    {newExtendedExpiry}
                  </P>
                </HStack>
              </HStack>
            </VStack>
          </Fieldset>

          {/* Pricing Preview Summary */}
          <Fieldset legend={"Estimasi Pembayaran"} containeredContent={true}>
            <VStack align={"stretch"} gap={"sm"}>
              <HStack justify={"space-between"} align={"center"}>
                <P color={"fg.subtle"}>{"Durasi Perpanjangan"}</P>
                <P fontWeight={"medium"}>
                  {accessDurationDays >= 365
                    ? `${Math.round(accessDurationDays / 30)} Bulan (${Math.round(accessDurationDays / 365)} Tahun)`
                    : `${accessDurationDays} Hari`}
                </P>
              </HStack>

              <Separator borderColor={"bg.canvas"} />

              {/* Subtotal & Breakdown Rows */}
              {isPricingLoading ? (
                <Skeleton height={"48px"} w={"full"} />
              ) : hasCoverageBreakdown ? (
                <>
                  {bidangCount > 0 && (
                    <HStack justify={"space-between"} align={"center"}>
                      <VStack align={"start"} gap={"2xs"}>
                        <P fontSize={"sm"} color={"fg.subtle"}>
                          {"Subtotal IGT (Bidang)"}
                        </P>

                        <P>
                          <TNum>{formatNumber(bidangCount)}</TNum>
                          {" bidang × "}
                          <TNum>{formatCurrency(pricePerBidang)}</TNum>
                        </P>
                      </VStack>
                      <P fontWeight={"medium"}>
                        <TNum>{formatCurrency(subtotalBidang)}</TNum>
                      </P>
                    </HStack>
                  )}

                  {kawasanHa > 0 && (
                    <HStack justify={"space-between"} align={"center"}>
                      <VStack align={"start"} gap={"2xs"}>
                        <P fontSize={"sm"} color={"fg.subtle"}>
                          {"Subtotal IGT (Kawasan)"}
                        </P>

                        <P>
                          <TNum>
                            {formatNumber(kawasanHa, {
                              maximumFractionDigits: 2,
                            })}
                          </TNum>
                          {" ha × "}
                          <TNum>{formatCurrency(pricePerKawasanHa)}</TNum>
                        </P>
                      </VStack>
                      <P fontWeight={"medium"}>
                        <TNum>{formatCurrency(subtotalKawasan)}</TNum>
                      </P>
                    </HStack>
                  )}

                  <Separator borderColor={"bg.canvas"} />
                </>
              ) : (
                workspace.layers &&
                workspace.layers.length > 0 && (
                  <>
                    <HStack justify={"space-between"} align={"center"}>
                      <VStack align={"start"} gap={"2xs"}>
                        <P color={"fg.subtle"}>{"Subtotal Tarif Layer"}</P>
                        <P fontSize={"xs"} color={"fg.muted"}>
                          {`${workspace.layers.length} Layer × Tarif Lisensi`}
                        </P>
                      </VStack>
                      <P fontWeight={"medium"}>
                        <TNum>{formatCurrency(estimatedTotalPrice)}</TNum>
                      </P>
                    </HStack>
                    <Separator borderColor={"bg.canvas"} />
                  </>
                )
              )}

              <HStack justify={"space-between"} align={"center"}>
                <P fontWeight={"medium"}>{"Estimasi Total Biaya"}</P>
                <P fontSize={"lg"} fontWeight={"bold"} color={"brand.fg"}>
                  {isPricingLoading ? (
                    <Skeleton height={"24px"} w={"100px"} />
                  ) : (
                    <TNum>{formatCurrency(estimatedTotalPrice)}</TNum>
                  )}
                </P>
              </HStack>
            </VStack>
          </Fieldset>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <VStack gap={"xs"} w={"full"}>
          <Button
            primary={true}
            w={"full"}
            loading={renewMutation.isPending}
            onClick={handleProceedToPayment}
          >
            <AppIcon icon={ReceiptIcon} />
            {"Lanjut ke Pembayaran"}
          </Button>

          <Button w={"full"} onClick={close}>
            {"Batal"}
          </Button>
        </VStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
