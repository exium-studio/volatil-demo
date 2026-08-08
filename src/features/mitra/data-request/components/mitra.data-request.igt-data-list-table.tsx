import type { DataListItemActionsGenerator } from "@/design-system/components/data-display/types/data-list.type";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { useFlyToIgtGeometry } from "@/features/mitra/data-request/hooks/use-mitra-data-request";
import type { IgtDataItem } from "@/features/mitra/data-request/types/mitra.data-request.igt-by-aoi.type";
import { IconMapPin } from "@tabler/icons-react";
import { useMemo } from "react";

const MAX_VISIBLE_THEMES = 2;
const BASIS_BIDANG_COLOR = "blue" as const;
const BASIS_KAWASAN_COLOR = "orange" as const;

import type { MitraIgtDataListTableProps } from "@/features/mitra/data-request/types/mitra.data-request.type";

export const MitraIgtDataListTable = (props: MitraIgtDataListTableProps) => {
  // Props
  const { igtItems, children, ...restProps } = props;

  // Hooks (Mutations)
  const flyToMutation = useFlyToIgtGeometry();

  // Derived Values
  const itemActions: DataListItemActionsGenerator<IgtDataItem>[] = useMemo(
    () => [
      (item) => (
        <Menu.Item
          key={"fly-to"}
          value={"fly-to"}
          onClick={() => void flyToMutation.mutateAsync(item.id)}
        >
          <AppIcon icon={IconMapPin} />
          Lihat di Peta
        </Menu.Item>
      ),
    ],
    [flyToMutation],
  );

  const { headers, items } = useMemo(() => {
    return {
      headers: [
        { th: "ID Bidang", sortable: true },
        { th: "Tema IGT-PR" },
        { th: "Basis IGT-PR", sortable: true },
        { th: "Deskripsi", headerCellProps: { minW: "200px" } },
      ],
      items: igtItems.map((item: IgtDataItem) => {
        const visibleThemes = item.themes.slice(0, MAX_VISIBLE_THEMES);
        const remainingCount = item.themes.length - MAX_VISIBLE_THEMES;

        return {
          id: String(item.id),
          data: item,
          columns: [
            {
              value: item.id,
              td: <P fontSize={"sm"}>{item.id}</P>,
              align: "start" as const,
            },
            {
              value: item.themes.map((th) => th.name).join(", "),
              td: (
                <HStack wrap={"wrap"} gap={1}>
                  {visibleThemes.map((themeItem) => (
                    <Badge
                      key={themeItem.name}
                      colorPalette={"neutral"}
                      variant={"subtle"}
                    >
                      {themeItem.name}
                    </Badge>
                  ))}
                  {remainingCount > 0 && (
                    <Badge colorPalette={"neutral"} variant={"outline"}>
                      +{remainingCount} lainnya
                    </Badge>
                  )}
                </HStack>
              ),
              align: "start" as const,
            },
            {
              value: item.basis,
              td: (
                <Badge
                  colorPalette={
                    item.basis === "bidang"
                      ? BASIS_BIDANG_COLOR
                      : BASIS_KAWASAN_COLOR
                  }
                  variant={"subtle"}
                >
                  {item.basis}
                </Badge>
              ),
              align: "center" as const,
            },
            {
              value: item.description ?? "",
              td: (
                <P
                  fontSize={"sm"}
                  color={"fg.subtle"}
                  maxW={"280px"}
                  whiteSpace={"wrap"}
                >
                  {item.description ?? "-"}
                </P>
              ),
              align: "start" as const,
            },
          ],
        };
      }),
    };
  }, [igtItems]);

  return (
    <DataListTable.Root
      headers={headers}
      items={items}
      itemActions={itemActions as DataListItemActionsGenerator[]}
      {...restProps}
    >
      {children || (
        <>
          <DataListTable.Header />
          <DataListTable.Body />
        </>
      )}
    </DataListTable.Root>
  );
};
