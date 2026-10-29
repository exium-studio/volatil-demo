// src/features/internal/master-igt-layer/components/internal.master-igt-layer.attribute-list.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { StateNoResult } from "@/design-system/components/feedback/ui/state.no-result";
import { StateRetry } from "@/design-system/components/feedback/ui/state.retry";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Switch } from "@/design-system/components/input/ui/switch";
import { ActionHeaderScrollContainer } from "@/design-system/components/layout/ui/action-header-scroll-container";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P } from "@/design-system/components/typography/ui/p";
import { useUpdateMasterIgtLayerAttributes } from "@/features/internal/master-igt-layer/hooks/use-master-igt-layer";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import type {
  InternalMasterIgtLayerAttributeListProps,
  MasterIgtLayerAttributeConfig,
} from "@/features/internal/master-igt-layer/types/master-igt-layer.type";
import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { normalizeApiUrl } from "@/shared/utils/url/url.utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCheckIcon, SaveIcon, XIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Box } from "@/design-system/components/layout/ui/box";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";

export const InternalMasterIgtLayerAttributeList = (
  props: InternalMasterIgtLayerAttributeListProps,
) => {
  // Props
  const { item, onSuccess } = props;

  // Stores
  const { theme } = useThemeStore();

  // States
  const [search, setSearch] = useState<string>("");
  const [overrideState, setOverrideState] = useState<{
    itemId: string;
    overrides: Record<string, boolean>;
  }>({ itemId: item.id, overrides: {} });

  // Mutations
  const updateAttributesMutation = useUpdateMasterIgtLayerAttributes();

  // Queries — Discover and merge attributes from layer schema & layer.attributes
  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () => [
      "internal",
      "master-igt-layer",
      "layer-attributes",
      item.id,
      item.typeName,
    ],
    [item.id, item.typeName],
  );

  const {
    data: discoveredAttributes = [],
    isLoading: isDiscovering,
    isError: isDiscoveryError,
    error: discoveryError,
    refetch: refetchAttributes,
  } = useQuery<MasterIgtLayerAttributeConfig[]>({
    queryKey,
    queryFn: async () => {
      const savedAttributesMap = new Map<
        string,
        MasterIgtLayerAttributeConfig
      >();
      if (Array.isArray(item.attributes)) {
        item.attributes.forEach((attr) => {
          savedAttributesMap.set(attr.attribute.toLowerCase(), attr);
        });
      }

      const typeName = item.typeName || "";
      const rawWfsUrl = item.wfs.url || item.wfs.baseUrl;
      const normalizedWfsUrl = normalizeApiUrl(rawWfsUrl);

      let discoveredProps: Array<{ name: string; type?: string }> = [];

      if (normalizedWfsUrl && typeName) {
        try {
          const origin =
            typeof window !== "undefined"
              ? window.location.origin
              : "http://localhost:5174";
          const url = new URL(normalizedWfsUrl, origin);

          if (!url.searchParams.has("layerId") && typeName) {
            url.searchParams.set("layerId", typeName);
          }
          url.searchParams.set("service", "WFS");
          url.searchParams.set("version", "1.0.0");
          url.searchParams.set("request", "DescribeFeatureType");
          url.searchParams.set("typeName", typeName);
          url.searchParams.set("outputFormat", "application/json");

          const res = await fetch(url.toString());
          if (res.ok) {
            const data = await res.json();
            const rawProperties = data?.featureTypes?.[0]?.properties ?? [];
            discoveredProps = rawProperties
              .filter((p: { type?: string; localType?: string }) => {
                const typeStr = (p.type || p.localType || "").toLowerCase();
                const isGeom =
                  typeStr.startsWith("gml:") ||
                  typeStr.includes("geometry") ||
                  typeStr.includes("polygon") ||
                  typeStr.includes("point") ||
                  typeStr.includes("linestring") ||
                  typeStr.includes("multisurface");
                return !isGeom;
              })
              .map(
                (p: { name: string; type?: string; localType?: string }) => ({
                  name: p.name,
                  type: p.type || p.localType,
                }),
              );
          }
        } catch {
          // DescribeFeatureType fallback
        }
      }

      if (discoveredProps.length === 0 && normalizedWfsUrl && typeName) {
        try {
          const sample = await fetchWfs({
            typeName,
            wfsUrl: normalizedWfsUrl,
            maxFeatures: 1,
          });
          const firstFeature = sample?.features?.[0];
          const properties = firstFeature?.properties;
          if (properties) {
            discoveredProps = Object.keys(properties).map((propName) => ({
              name: propName,
              type: typeof properties[propName],
            }));
          }
        } catch {
          // Sample feature fallback failed
        }
      }

      const combined: MasterIgtLayerAttributeConfig[] = [];
      const seenNames = new Set<string>();

      discoveredProps.forEach((prop) => {
        const lower = prop.name.toLowerCase();
        seenNames.add(lower);
        const existing = savedAttributesMap.get(lower);
        combined.push({
          attribute: prop.name,
          visible: existing ? existing.visible : true,
          dataType: prop.type,
        });
      });

      if (Array.isArray(item.attributes)) {
        item.attributes.forEach((saved) => {
          const lower = saved.attribute.toLowerCase();
          if (!seenNames.has(lower)) {
            seenNames.add(lower);
            combined.push(saved);
          }
        });
      }

      if (combined.length === 0) {
        combined.push(
          { attribute: "namobj", visible: true, dataType: "xsd:string" },
          { attribute: "wadmkk", visible: true, dataType: "xsd:string" },
          { attribute: "wadmkc", visible: true, dataType: "xsd:string" },
          { attribute: "wadmpr", visible: true, dataType: "xsd:string" },
          { attribute: "luas_ha", visible: true, dataType: "xsd:double" },
          { attribute: "pola_ruang", visible: true, dataType: "xsd:string" },
        );
      }

      return combined;
    },
    staleTime: 60 * 1000,
  });

  // Effective local overrides (cleared automatically if item.id changes)
  const currentOverrides = useMemo(() => {
    return overrideState.itemId === item.id ? overrideState.overrides : {};
  }, [overrideState, item.id]);

  // Derived effective attribute list
  const effectiveAttributes = useMemo<MasterIgtLayerAttributeConfig[]>(() => {
    return discoveredAttributes.map((attr) => {
      const isOverridden = currentOverrides[attr.attribute] !== undefined;
      return {
        ...attr,
        visible: isOverridden ? currentOverrides[attr.attribute] : attr.visible,
      };
    });
  }, [discoveredAttributes, currentOverrides]);

  // Handlers
  const handleToggleAttribute = useCallback(
    (attributeName: string, checked: boolean) => {
      setOverrideState((prev) => {
        const base = prev.itemId === item.id ? prev.overrides : {};
        return {
          itemId: item.id,
          overrides: {
            ...base,
            [attributeName]: checked,
          },
        };
      });
    },
    [item.id],
  );

  const handleSetAllVisibility = (visible: boolean) => {
    const nextOverrides: Record<string, boolean> = {};
    discoveredAttributes.forEach((attr) => {
      nextOverrides[attr.attribute] = visible;
    });
    setOverrideState({
      itemId: item.id,
      overrides: nextOverrides,
    });
  };

  const handleSaveAttributes = () => {
    updateAttributesMutation.mutate(
      {
        id: item.id,
        attributes: effectiveAttributes,
      },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({
            queryKey: queryKeys.internal.masterIgtLayer.all,
          });
          onSuccess?.();
        },
      },
    );
  };

  // Filtered attributes based on search
  const filteredAttributes = useMemo(() => {
    if (!search.trim()) return effectiveAttributes;
    const q = search.toLowerCase();
    return effectiveAttributes.filter((a) =>
      a.attribute.toLowerCase().includes(q),
    );
  }, [effectiveAttributes, search]);

  // Derived Values — Table definition
  const dataList = useMemo(() => {
    const headers: FormattedTableHeader[] = [
      { th: "Nama Atribut", sortable: true },
      { th: "Tipe Data", sortable: true },
      { th: "Status Tampilan", align: "start", sortable: true },
    ];

    const items: FormattedListItem<MasterIgtLayerAttributeConfig>[] =
      filteredAttributes.map((attr) => {
        return {
          id: attr.attribute,
          data: attr,
          columns: [
            {
              value: attr.attribute,
              td: (
                <P fontWeight={"medium"} fontFamily={"mono"} fontSize={"sm"}>
                  {attr.attribute}
                </P>
              ),
              align: "start" as const,
            },
            {
              value: attr.dataType ?? "-",
              td: (
                <Badge colorPalette={"gray"}>{attr.dataType ?? "string"}</Badge>
              ),
              align: "start" as const,
            },
            {
              value: attr.visible ? "Aktif" : "Nonaktif",
              td: (
                <HStack align={"center"} gap={"md"}>
                  <Badge
                    colorPalette={attr.visible ? "green" : "gray"}
                    w={"120px"}
                    justifyContent={"center"}
                  >
                    {attr.visible ? "Ditampilkan" : "Disembunyikan"}
                  </Badge>

                  <Switch
                    checked={attr.visible}
                    onCheckedChange={({ checked }) =>
                      handleToggleAttribute(attr.attribute, checked)
                    }
                    tooltip={
                      attr.visible
                        ? "Sembunyikan atribut dari respons layanan"
                        : "Tampilkan atribut pada respons layanan"
                    }
                    size={"sm"}
                  />
                </HStack>
              ),
              align: "start" as const,
            },
          ],
        };
      });

    return {
      headers,
      items,
      batchActions: [],
      itemActions: [],
    };
  }, [filteredAttributes, handleToggleAttribute]);

  // Loading state
  if (isDiscovering) {
    return (
      <VStack gap={"md"} p={"md"} w={"full"}>
        <Skeleton h={"40px"} w={"full"} />
        <Skeleton h={"240px"} w={"full"} />
      </VStack>
    );
  }

  // Error state
  if (isDiscoveryError && effectiveAttributes.length === 0) {
    return (
      <Center w={"full"} py={"xl"} bg={"bg.body"}>
        <StateRetry
          title={"Gagal Memuat Atribut Layer"}
          description={
            discoveryError?.message ??
            "Terjadi kesalahan saat memeriksa skema atribut dari WFS GeoServer."
          }
          onRetry={() => void refetchAttributes()}
        />
      </Center>
    );
  }

  return (
    <VStack align={"stretch"} w={"full"}>
      {/* Top Filter and Action Bar using ActionHeaderScrollContainer */}
      <ActionHeaderScrollContainer justify={"space-between"}>
        <SearchInput
          placeholder={"Cari nama atribut..."}
          value={search}
          onValueChange={setSearch}
          maxW={"280px"}
        />

        <HStack align={"center"} gap={"xs"} minW={"fit"}>
          <Tooltip content={"Nonaktifkan semua"}>
            <IconButton onClick={() => handleSetAllVisibility(false)}>
              <AppIcon icon={XIcon} />
            </IconButton>
          </Tooltip>

          <Tooltip content={"Aktifkan semua"}>
            <IconButton onClick={() => handleSetAllVisibility(true)}>
              <AppIcon icon={CheckCheckIcon} />
            </IconButton>
          </Tooltip>
        </HStack>
      </ActionHeaderScrollContainer>

      {/* Info Notice */}
      <Box px={"md"} mb={"md"}>
        <HStack
          wrap={"wrap"}
          gap={"sm"}
          p={"sm"}
          bg={"bg.subtle"}
          rounded={theme.radii.component}
          justify={"space-between"}
        >
          <P fontSize={"xs"} color={"fg.subtle"}>
            {
              "Hanya atribut dengan status 'Ditampilkan' yang akan diteruskan ke respons layanan data spasial Mitra."
            }
          </P>
          <P fontSize={"xs"} fontWeight={"medium"}>
            {`${effectiveAttributes.filter((a) => a.visible).length} dari ${effectiveAttributes.length} atribut aktif`}
          </P>
        </HStack>
      </Box>

      {/* Attributes Data Table */}
      {filteredAttributes.length === 0 ? (
        <Center w={"full"} py={"xl"} bg={"bg.body"}>
          <StateNoResult
            title={"Atribut Tidak Ditemukan"}
            description={`Tidak ada atribut yang cocok dengan kata kunci "${search}".`}
            onReset={() => setSearch("")}
          />
        </Center>
      ) : (
        <DataViewTable.Root<MasterIgtLayerAttributeConfig>
          headers={dataList.headers}
          items={dataList.items}
          batchActions={dataList.batchActions}
          itemActions={dataList.itemActions}
          withNumbering
        >
          <DataViewTable.Header />
          <DataViewTable.Body />
        </DataViewTable.Root>
      )}

      {/* Bottom Save Action Bar */}
      <HStack justify={"end"} gap={"sm"} p={"md"}>
        <Button
          type={"button"}
          disabled={
            updateAttributesMutation.isPending ||
            Object.keys(currentOverrides).length === 0
          }
          onClick={() => {
            setOverrideState({ itemId: item.id, overrides: {} });
          }}
        >
          {"Atur Ulang"}
        </Button>

        <Button
          primary
          loading={updateAttributesMutation.isPending}
          disabled={updateAttributesMutation.isPending}
          onClick={handleSaveAttributes}
        >
          <AppIcon icon={SaveIcon} />
          {"Simpan Pengaturan Atribut"}
        </Button>
      </HStack>
    </VStack>
  );
};

export const InternalDataManagementAttributeList = InternalMasterIgtLayerAttributeList;
