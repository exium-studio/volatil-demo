// src\features\design-system-docs\components\overview-docs.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { Link } from "@tanstack/react-router";
import {
  ExternalLink,
  LayersIcon,
  LayoutGridIcon,
  SparklesIcon,
} from "lucide-react";

export const OverviewDocs = ({
  onSelectComponent,
}: {
  onSelectComponent: (key: string) => void;
}) => {
  return (
    <VStack align={"stretch"} gap={6} w={"full"}>
      <VStack align={"start"} gap={2}>
        <HStack gap={2}>
          <P fontSize={"3xl"} fontWeight={"bold"}>
            Exium Design System Documentation
          </P>
          <Badge>v1.0.0</Badge>
        </HStack>
        <P color={"fg.muted"} fontSize={"md"}>
          Koleksi komponen UI modular, berskala tinggi, dan seragam berlandaskan
          Chakra UI v3 & Lucide/Tabler Icons.
        </P>
      </VStack>

      {/* Quick Link to /demo Banner */}
      <HStack
        p={5}
        rounded={"xl"}
        bg={"bg.subtle"}
        border={"1px solid"}
        borderColor={"border.subtle"}
        justify={"space-between"}
        align={"center"}
      >
        <VStack align={"start"} gap={"sm"}>
          <HStack gap={2}>
            <AppIcon icon={SparklesIcon} />
            <P fontWeight={"bold"}>Demo Gallery (/demo)</P>
          </HStack>

          <P fontSize={"sm"} color={"fg.muted"}>
            Lihat paparan komprehensif seluruh komponen design system yang
            disusun dalam 1 halaman showcase interaktif.
          </P>
        </VStack>

        <Button asChild variant={"outline"}>
          <Link to={"/demo"}>
            View /demo Gallery <AppIcon icon={ExternalLink} size={"sm"} />
          </Link>
        </Button>
      </HStack>

      <P fontSize={"lg"} fontWeight={"bold"} mt={2}>
        Featured Categories
      </P>

      <SimpleGrid columns={[1, 2, 3]} gap={4}>
        <Box
          p={4}
          rounded={"lg"}
          border={"1px solid"}
          borderColor={"border.subtle"}
          bg={"bg.canvas"}
          cursor={"pointer"}
          _hover={{ borderColor: "colorPalette.solid" }}
          onClick={() => onSelectComponent("button")}
        >
          <HStack gap={3} mb={2}>
            <AppIcon icon={LayersIcon} color={"colorPalette.fg"} />
            <P fontWeight={"bold"}>Buttons & Actions</P>
          </HStack>
          <P fontSize={"xs"} color={"fg.muted"}>
            Button, IconButton, dan ButtonGroup dengan pelbagai variasi status
            dan saiz.
          </P>
        </Box>

        <Box
          p={4}
          rounded={"lg"}
          border={"1px solid"}
          borderColor={"border.subtle"}
          bg={"bg.canvas"}
          cursor={"pointer"}
          _hover={{ borderColor: "colorPalette.solid" }}
          onClick={() => onSelectComponent("input")}
        >
          <HStack gap={3} mb={2}>
            <AppIcon icon={LayoutGridIcon} color={"colorPalette.fg"} />
            <P fontWeight={"bold"}>Form Inputs</P>
          </HStack>
          <P fontSize={"xs"} color={"fg.muted"}>
            Input, Textarea, Checkbox, Switch, dan NumberInput bersedia untuk
            React Hook Form.
          </P>
        </Box>

        <Box
          p={4}
          rounded={"lg"}
          border={"1px solid"}
          borderColor={"border.subtle"}
          bg={"bg.canvas"}
          cursor={"pointer"}
          _hover={{ borderColor: "colorPalette.solid" }}
          onClick={() => onSelectComponent("progress")}
        >
          <HStack gap={3} mb={2}>
            <AppIcon icon={SparklesIcon} color={"colorPalette.fg"} />
            <P fontWeight={"bold"}>Feedback & Status</P>
          </HStack>
          <P fontSize={"xs"} color={"fg.muted"}>
            Progress bar, Skeleton loaders, Toast notifications, dan Empty state
            components.
          </P>
        </Box>
      </SimpleGrid>
    </VStack>
  );
};
