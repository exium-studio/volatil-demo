// src/design-system/components/data-display/ui/stat-grid.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { P } from "@/design-system/components/typography/ui/p";
import { Span } from "@/design-system/components/typography/ui/span";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { PADDING_MD } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import type {
  StatGridDescriptionProps,
  StatGridHeaderProps,
  StatGridIconProps,
  StatGridItemProps,
  StatGridLabelProps,
  StatGridRootProps,
  StatGridValueProps,
} from "@/design-system/components/data-display/types/stat-grid.type";

const StatGridRoot = (props: StatGridRootProps) => {
  // Props
  const { columns = 4, children, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  return (
    <SimpleGrid
      flex={1}
      columns={columns}
      overflow={"clip"}
      roundedBottom={theme.radii.container}
      {...restProps}
    >
      {children}
    </SimpleGrid>
  );
};

const StatGridItem = (props: StatGridItemProps) => {
  // Props
  const { index, columns = 4, children, ...restProps } = props;

  // Derived Values
  const isLastInRow = index !== undefined ? (index + 1) % columns === 0 : false;
  const isNotFirstRow = index !== undefined ? index >= columns : false;

  return (
    <VStack
      align={"start"}
      overflow={"clip"}
      position={"relative"}
      gap={2}
      h={"full"}
      p={PADDING_MD}
      borderRight={isLastInRow ? undefined : "2px solid"}
      borderTop={isNotFirstRow ? "2px solid" : undefined}
      borderColor={"bg.canvas"}
      {...restProps}
    >
      {children}
    </VStack>
  );
};

const StatGridHeader = (props: StatGridHeaderProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <HStack
      fontSize={"lg"}
      fontWeight={"semibold"}
      align={"center"}
      justify={"space-between"}
      gap={4}
      w={"full"}
      {...restProps}
    >
      {children}
    </HStack>
  );
};

const StatGridLabel = (props: StatGridLabelProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <P color={"fg.muted"} {...restProps}>
      {children}
    </P>
  );
};

const StatGridIcon = (props: StatGridIconProps) => {
  // Props
  const { icon, color = "fg.subtle", fontSize } = props;

  return <AppIcon icon={icon} color={color} fontSize={fontSize} />;
};

const StatGridValue = (props: StatGridValueProps) => {
  // Props
  const {
    value,
    suffix,
    isCurrency,
    currency = "IDR",
    color,
    children,
    ...restProps
  } = props;

  return (
    <P
      fontSize={"2xl"}
      fontWeight={"medium"}
      color={color}
      mt={"auto"}
      {...restProps}
    >
      {children ? (
        children
      ) : typeof value === "number" ? (
        isCurrency ? (
          <FormatNumber
            value={value}
            style={"currency"}
            currency={currency}
            maximumFractionDigits={0}
          />
        ) : (
          <FormatNumber value={value} />
        )
      ) : (
        value
      )}

      {suffix && (
        <Span
          fontSize={"sm"}
          color={"fg.subtle"}
          fontWeight={"normal"}
          ml={1.5}
        >
          {suffix}
        </Span>
      )}
    </P>
  );
};

const StatGridDescription = (props: StatGridDescriptionProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <P fontSize={"sm"} color={"fg.subtle"} {...restProps}>
      {children}
    </P>
  );
};

export const StatGrid = {
  Root: StatGridRoot,
  Item: StatGridItem,
  Header: StatGridHeader,
  Label: StatGridLabel,
  Icon: StatGridIcon,
  Value: StatGridValue,
  Description: StatGridDescription,
};
