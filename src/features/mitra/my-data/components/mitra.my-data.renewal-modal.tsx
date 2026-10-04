// src/features/mitra/my-data/components/mitra.my-data.renewal-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useRenewMitraWorkspace } from "@/features/mitra/my-data/hooks/use-mitra-my-data";
import type {
  MitraWorkspaceRenewalModalContentProps,
  MitraWorkspaceRenewalTriggerProps,
} from "@/features/mitra/my-data/types/my-data.type";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { formatCurrency } from "@/shared/utils/formatter/number.formatter";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  CalendarCheckIcon,
  ClockIcon,
  CreditCardIcon,
  LayersIcon,
  RotateCwIcon,
  SparklesIcon,
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
  } = props;

  // Stores & Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey,
  });

  const isMounted = useMountTimeout({
    isOpen,
    mountDelay: 0,
    unmountDelay: 250,
  });

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"lg"}
    >
      <Modal.Trigger>
        {children ? (
          children
        ) : (
          <Button size={"sm"} variant={"outline"} colorPalette={"orange"}>
            <AppIcon icon={RotateCwIcon} />
            {"Perpanjang Layanan"}
          </Button>
        )}
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
  const { theme } = useThemeStore();

  // Navigation & Router
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
        <HStack justify={"space-between"} align={"center"} w={"full"} pr={"lg"}>
          <HStack gap={3} align={"center"}>
            <AppIcon icon={RotateCwIcon} />
            <VStack align={"start"} gap={0}>
              <Heading size={"md"}>{"Perpanjang Masa Aktif Layanan"}</Heading>
              <P fontSize={"xs"} color={"fg.muted"}>
                {"Perbarui lisensi WMS/WFS Interop GeoServer untuk workspace ini"}
              </P>
            </VStack>
          </HStack>
          <Modal.CloseButton />
        </HStack>
      </Modal.Header>

      <Modal.Body>
        <VStack gap={"md"} align={"stretch"} w={"full"} py={"xs"}>
          {/* Workspace Summary Card */}
          <Box
            p={"md"}
            bg={"bg.subtle"}
            rounded={theme.radii.component}
            borderWidth={"1px"}
            borderColor={"border.subtle"}
          >
            <VStack align={"stretch"} gap={"sm"}>
              <HStack justify={"space-between"} align={"center"}>
                <P fontSize={"xs"} color={"fg.muted"}>
                  {"Workspace Target"}
                </P>
                <Badge variant={"subtle"} colorPalette={"brand"}>
                  <AppIcon icon={LayersIcon} size={"xs"} />
                  {`${workspace.layersCount || workspace.layers.length} Layer`}
                </Badge>
              </HStack>
              <Heading size={"sm"} fontFamily={"mono"}>
                {workspace.workspaceName}
              </Heading>
              <P fontSize={"xs"} color={"fg.subtle"}>
                {`ID: ${workspace.id}`}
              </P>
            </VStack>
          </Box>

          {/* Expiration Comparison */}
          <HStack gap={"sm"} align={"stretch"} w={"full"}>
            <Box
              flex={1}
              p={"sm"}
              bg={"bg.surface"}
              rounded={theme.radii.component}
              borderWidth={"1px"}
              borderColor={"border.subtle"}
            >
              <VStack align={"start"} gap={1}>
                <HStack gap={1} align={"center"}>
                  <AppIcon icon={ClockIcon} size={"xs"} />
                  <P fontSize={"xs"} color={"fg.muted"}>
                    {"Masa Aktif Saat Ini"}
                  </P>
                </HStack>
                <P fontSize={"sm"} fontWeight={"medium"}>
                  {currentFormattedExpiry}
                </P>
              </VStack>
            </Box>

            <Box
              flex={1}
              p={"sm"}
              bg={"brand.subtle"}
              rounded={theme.radii.component}
              borderWidth={"1px"}
              borderColor={"brand.muted"}
            >
              <VStack align={"start"} gap={1}>
                <HStack gap={1} align={"center"}>
                  <AppIcon icon={CalendarCheckIcon} size={"xs"} />
                  <P fontSize={"xs"} color={"brand.fg"}>
                    {`Setelah Diperpanjang (+${durationMonths} Bln)`}
                  </P>
                </HStack>
                <P fontSize={"sm"} fontWeight={"bold"} color={"brand.fg"}>
                  {newExtendedExpiry}
                </P>
              </VStack>
            </Box>
          </HStack>

          {/* Pricing Breakdown */}
          <Box
            p={"md"}
            bg={"bg.canvas"}
            rounded={theme.radii.component}
            borderWidth={"1px"}
            borderColor={"border.muted"}
          >
            <VStack align={"stretch"} gap={"sm"}>
              <HStack justify={"space-between"} align={"center"}>
                <P fontSize={"xs"} color={"fg.muted"}>
                  {"Durasi Paket"}
                </P>
                <Badge variant={"solid"} colorPalette={"teal"}>
                  {"12 Bulan (1 Tahun)"}
                </Badge>
              </HStack>

              <Separator borderColor={"border.subtle"} />

              <HStack justify={"space-between"} align={"center"}>
                <VStack align={"start"} gap={0}>
                  <P fontSize={"sm"} fontWeight={"medium"}>
                    {"Total Biaya Perpanjangan"}
                  </P>
                  <P fontSize={"xs"} color={"fg.muted"}>
                    {"Termasuk pemeliharaan service WMS/WFS Interop"}
                  </P>
                </VStack>
                <Heading size={"md"} color={"brand.fg"}>
                  <TNum>{formatCurrency(estimatedPrice)}</TNum>
                </Heading>
              </HStack>
            </VStack>
          </Box>

          <Box
            p={"sm"}
            bg={"bg.subtle"}
            rounded={theme.radii.component}
            borderLeftWidth={"3px"}
            borderLeftColor={"blue.solid"}
          >
            <HStack align={"center"} gap={2}>
              <AppIcon icon={SparklesIcon} size={"sm"} />
              <P fontSize={"xs"} color={"fg.muted"}>
                {
                  "Setelah Anda melakukan pembayaran, masa aktif workspace akan otomatis diperpanjang dan seluruh service interop GeoServer kembali berstatus Ready."
                }
              </P>
            </HStack>
          </Box>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <HStack justify={"flex-end"} gap={"sm"} w={"full"}>
          <Button variant={"outline"} onClick={close}>
            {"Batal"}
          </Button>
          <Button
            variant={"solid"}
            colorPalette={"brand"}
            onClick={handleProceedToPayment}
            loading={renewMutation.isPending}
          >
            <AppIcon icon={CreditCardIcon} />
            {"Lanjut ke Pembayaran"}
            <AppIcon icon={ArrowRightIcon} />
          </Button>
        </HStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
