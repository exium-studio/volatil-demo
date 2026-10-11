// src/features/mitra/my-data/components/mitra.my-data.renewal-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { usePricingPolicy } from "@/features/mitra/data-request/hooks/use-pricing-policy";
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
import { formatCurrency } from "@/shared/utils/formatter/number.formatter";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRightIcon, ClockPlusIcon } from "lucide-react";
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

  // Navigation
  const navigate = useNavigate();

  // States
  const [durationMonths] = useState<number>(12);

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
    extended.setMonth(extended.getMonth() + durationMonths);
    return formatUtcDateTime(extended.toISOString(), preferredTimezone);
  }, [workspace.expiresAt, durationMonths, preferredTimezone]);

  const currentFormattedExpiry = useMemo(() => {
    return formatUtcDateTime(workspace.expiresAt, preferredTimezone);
  }, [workspace.expiresAt, preferredTimezone]);

  const estimatedPrice = useMemo(() => {
    if (!workspace.layers || workspace.layers.length === 0) {
      return 1500000;
    }
    return workspace.layers.reduce((acc, layer) => {
      return acc + (layer.spatialBasis === "kawasan" ? 1500000 : 750000);
    }, 0);
  }, [workspace.layers]);

  // Handlers
  const handleProceedToPayment = () => {
    renewMutation.mutate(
      {
        workspaceId: workspace.id,
        payload: { durationMonths },
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
                <P fontWeight={"medium"}>{workspace.workspaceName}</P>
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
                <P fontWeight={"medium"}>{"12 Bulan (1 Tahun)"}</P>
              </HStack>

              <Separator borderColor={"bg.canvas"} />

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
