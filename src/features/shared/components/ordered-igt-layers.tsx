// src/features/shared/components/ordered-igt-layers-preview.cell.tsx

import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { IgtBasisBadge } from "@/features/shared/components/igt-basis.badge";
import type {
  OrderedIgtLayersPreviewCellProps,
  OrderedIgtLayersPreviewModalContentProps,
} from "@/features/shared/types/ordered-igt-layers-preview.type";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatCurrency,
  formatNumber,
} from "@/shared/utils/formatter/number.formatter";
import { useId, useMemo } from "react";

export const OrderedIgtLayers = (props: OrderedIgtLayersPreviewCellProps) => {
  // Props
  const {
    items = [],
    orderNumber,
    coverageHa,
    maxVisible = 2,
    modalKey: customModalKey,
    ...restProps
  } = props;

  // Hooks
  const generatedId = useId();
  const effectiveModalKey =
    customModalKey || `ordered-layers-modal-${orderNumber || generatedId}`;
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: effectiveModalKey,
  });

  // Derived Values
  const totalCount = items.length;
  const displayedItems = useMemo(
    () => items.slice(0, maxVisible),
    [items, maxVisible],
  );
  const remainingCount = Math.max(0, totalCount - maxVisible);

  const displayedNames = useMemo(
    () =>
      displayedItems
        .map((it) => it.sourceLayerTitle || it.title || it.sourceLayerId || "-")
        .join(", "),
    [displayedItems],
  );

  if (isEmptyArray(items)) {
    return <P color={"fg.subtle"}>{"-"}</P>;
  }

  return (
    <>
      <Tooltip content={"Klik untuk melihat detail seluruh daftar layer IGT"}>
        <VStack
          align={"start"}
          gap={"2xs"}
          w={"200px"}
          cursor={"pointer"}
          role={"button"}
          tabIndex={0}
          onClick={() => open()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              open();
            }
          }}
          {...restProps}
        >
          {/* Main Layer Names & Overflow Badge */}
          <HStack gap={"xs"} wrap={"wrap"} align={"center"} w={"full"}>
            <ClampedP>{displayedNames}</ClampedP>

            {remainingCount > 0 && (
              <Badge
                size={"xs"}
                variant={"surface"}
                colorPalette={"blue"}
                fontWeight={"semibold"}
              >
                {`+${remainingCount}`}
              </Badge>
            )}
          </HStack>
        </VStack>
      </Tooltip>

      {/* Modal View for Full Layer List */}
      <Modal.Root
        modalKey={modalKey}
        opened={isOpen}
        open={open}
        close={close}
        size={"lg"}
      >
        <OrderedIgtLayersPreviewModalContent
          items={items}
          orderNumber={orderNumber}
          coverageHa={coverageHa}
          close={close}
        />
      </Modal.Root>
    </>
  );
};

export const OrderedIgtLayersPreviewModalContent = (
  props: OrderedIgtLayersPreviewModalContentProps,
) => {
  // Props
  const { items, orderNumber, coverageHa } = props;

  // Derived Values
  const totalCount = items.length;
  const totalBidang = useMemo(
    () =>
      items
        .filter((it) => it.spatialBasis === "bidang")
        .reduce((sum, it) => sum + (it.featuresCount ?? 0), 0),
    [items],
  );

  const hasTotalPrice = useMemo(
    () => items.some((it) => (it.subtotalPrice ?? 0) > 0),
    [items],
  );

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />

        <VStack gap={"2xs"}>
          <Modal.Title>{`Daftar Layer IGT`}</Modal.Title>

          {orderNumber && (
            <P fontSize={"sm"} color={"fg.muted"}>
              {`No. Pesanan: ${orderNumber}`}
            </P>
          )}
        </VStack>
      </Modal.Header>

      <Modal.Body>
        <VStack align={"stretch"} gap={"md"}>
          {/* Summary */}
          <VStack gap={"xs"} p={"sm"} bg={"bg.subtle"} rounded={"md"}>
            <P>{`${formatNumber(totalCount)} Total Layer IGT`}</P>

            {totalBidang > 0 && (
              <P
                fontSize={"sm"}
              >{`${formatNumber(totalBidang)} Total Bidang`}</P>
            )}

            {coverageHa != null && coverageHa > 0 && (
              <P fontSize={"sm"}>
                {`${formatNumber(coverageHa, { maximumFractionDigits: 2 })} ha Luas Cakupan Kawasan`}
              </P>
            )}
          </VStack>

          {/* List of Ordered Layers */}
          <VStack align={"stretch"} gap={"sm"}>
            {items.map((item, index) => {
              const displayName = item.sourceLayerTitle || "-";
              const isBidang = item.spatialBasis === "bidang";
              const isKawasan = item.spatialBasis === "kawasan";

              let countOrAreaDetail = "-";
              if (isBidang && (item.featuresCount ?? 0) > 0) {
                countOrAreaDetail = `${formatNumber(item.featuresCount ?? 0)} bidang`;
              } else if (isKawasan && (item.areaHa ?? 0) > 0) {
                countOrAreaDetail = `${formatNumber(item.areaHa ?? 0, { maximumFractionDigits: 2 })} ha`;
              } else if ((item.featuresCount ?? 0) > 0) {
                countOrAreaDetail = `${formatNumber(item.featuresCount ?? 0)} fitur`;
              }

              return (
                <Box
                  key={item.id || item.sourceLayerId || index}
                  p={"sm"}
                  rounded={"md"}
                  border={"1px solid"}
                  borderColor={"border.subtle"}
                  bg={"bg.body"}
                >
                  <HStack justify={"space-between"} align={"start"} gap={"sm"}>
                    {/* Number & Title */}
                    <HStack align={"start"} gap={"sm"} flex={1} minW={0}>
                      <VStack align={"start"} gap={"2xs"} flex={1} minW={0}>
                        <HStack align={"center"} gap={"xs"}>
                          <P wordBreak={"break-word"}>{displayName}</P>

                          {item.spatialBasis && (
                            <IgtBasisBadge size={"xs"}>
                              {item.spatialBasis}
                            </IgtBasisBadge>
                          )}
                        </HStack>

                        {item.sourceLayerId &&
                          item.sourceLayerId !== displayName && (
                            <P fontSize={"sm"} color={"fg.subtle"}>
                              {item.sourceLayerId}
                            </P>
                          )}
                      </VStack>
                    </HStack>

                    {/* Basis Badge & Quantities */}
                    <VStack align={"end"} gap={"2xs"} flexShrink={0}>
                      <P
                        fontSize={"sm"}
                        fontWeight={"medium"}
                        color={"fg.muted"}
                      >
                        {countOrAreaDetail}
                      </P>

                      {hasTotalPrice && (item.subtotalPrice ?? 0) > 0 && (
                        <P fontSize={"sm"} fontWeight={"semibold"}>
                          {formatCurrency(item.subtotalPrice ?? 0)}
                        </P>
                      )}
                    </VStack>
                  </HStack>
                </Box>
              );
            })}
          </VStack>
        </VStack>
      </Modal.Body>
    </Modal.Content>
  );
};
