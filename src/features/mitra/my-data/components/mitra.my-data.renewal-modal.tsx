// src/features/mitra/my-data/components/mitra.my-data.renewal-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP, P, TNum } from "@/design-system/components/typography/ui/p";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { usePricingPolicy } from "@/features/mitra/data-request/hooks/use-pricing-policy";
import { usePricingPolicyStore } from "@/features/mitra/data-request/stores/pricing-policy.store";
import { useRenewMitraWorkspace } from "@/features/mitra/my-data/hooks/use-mitra-my-data";
import type {
  MitraWorkspaceRenewalModalContentProps,
  MitraWorkspaceRenewalTriggerProps,
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
import { useNavigate } from "@tanstack/react-router";
import { ArrowRightIcon, ClockPlusIcon } from "lucide-react";
import { useMemo } from "react";

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

  // Stores
  const {
    accessDurationDays,
    pricePerBidang,
    pricePerKawasanHa,
    calculateRenewalPrice,
  } = usePricingPolicyStore();

  // Navigation
  const navigate = useNavigate();

  // Mutations
  const renewMutation = useRenewMitraWorkspace();

  // Derived Values
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  const newExtendedExpiry = useMemo(() => {
    const date = new Date(workspace.expiresAt);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }
    const extended = new Date(date);
    extended.setDate(extended.getDate() + (accessDurationDays || 365));
    return formatUtcDateTime(extended.toISOString(), preferredTimezone);
  }, [workspace.expiresAt, accessDurationDays, preferredTimezone]);

  const currentFormattedExpiry = useMemo(() => {
    return formatUtcDateTime(workspace.expiresAt, preferredTimezone);
  }, [workspace.expiresAt, preferredTimezone]);

  const estimatedPrice = useMemo(() => {
    return calculateRenewalPrice(workspace);
  }, [calculateRenewalPrice, workspace]);

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

  // Handlers
  const handleProceedToPayment = () => {
    renewMutation.mutate(
      {
        workspaceId: workspace.id,
      },
      {
        onSuccess: (data) => {
          close();
          void navigate({
            to: "/mitra/billing/$billingCode",
            params: { billingCode: data.billingCode },
            search: { orderId: data.orderId },
          });
        },
      },
    );
  };

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
                  <AppIcon
                    icon={ArrowRightIcon}
                    size={"xs"}
                    color={"brand.fg"}
                  />
                  <P fontWeight={"semibold"} color={"brand.fg"}>
                    {newExtendedExpiry}
                  </P>
                </HStack>
              </HStack>
            </VStack>
          </Fieldset>

          {/* Pricing Summary */}
          <Fieldset legend={"Rincian Pembayaran"} containeredContent={true}>
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
              {hasCoverageBreakdown ? (
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
                        <TNum>{formatCurrency(estimatedPrice)}</TNum>
                      </P>
                    </HStack>
                    <Separator borderColor={"bg.canvas"} />
                  </>
                )
              )}

              <HStack justify={"space-between"} align={"center"}>
                <P fontWeight={"medium"}>{"Total Biaya"}</P>
                <P fontSize={"lg"} fontWeight={"bold"} color={"brand.fg"}>
                  <TNum>{formatCurrency(estimatedPrice)}</TNum>
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
