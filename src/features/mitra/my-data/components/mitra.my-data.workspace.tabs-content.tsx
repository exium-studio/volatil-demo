// src/features/mitra/my-data/components/mitra.my-data.workspace.tabs-content.tsx

import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { RetryState } from "@/design-system/components/feedback/ui/state.retry";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { useContainerContext } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { MaskedSecretField } from "@/features/mitra/my-data/components/mitra.my-data.masked-secret-field";
import { useMitraMyDataQuery } from "@/features/mitra/my-data/hooks/use-mitra-my-data";
import type { MitraMyDataWorkspaceTabsContentProps } from "@/features/mitra/my-data/types/my-data.type";

export const MitraMyDataWorkspaceTabsContent = (
  props: MitraMyDataWorkspaceTabsContentProps,
) => {
  // Props
  const { isActive = true } = props;

  // Stores
  const { theme } = useThemeStore();

  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries
  const { myData, isLoading, isError, error, refetch } = useMitraMyDataQuery({
    page: 1,
    pageSize: 1,
  });

  if (!isActive) return null;

  if (isLoading) {
    return (
      <VStack flex={1} w={"full"} p={isSmContainer ? "md" : "lg"} gap={"md"}>
        <Skeleton h={"80px"} w={"full"} />
        <Skeleton h={"140px"} w={"full"} />
        <Skeleton h={"140px"} w={"full"} />
      </VStack>
    );
  }

  if (isError) {
    return (
      <Center flex={1} w={"full"} py={"xl"} bg={"bg.body"}>
        <RetryState
          title={"Gagal Memuat Workspace"}
          description={
            error?.message ||
            "Terjadi kesalahan saat memuat konfigurasi workspace GeoServer Anda. Silakan coba lagi."
          }
          onRetry={() => {
            void refetch();
          }}
        />
      </Center>
    );
  }

  const { workspaceUrl, apiKey } = myData;

  if (!workspaceUrl) {
    return (
      <Center flex={1} w={"full"} py={"xl"} bg={"bg.body"}>
        <NoDataState
          title={"Workspace Belum Aktif"}
          description={
            "Workspace GeoServer otomatis dibuat setelah Anda memiliki layer data spasial IGT yang aktif."
          }
        />
      </Center>
    );
  }

  return (
    <VStack
      flex={1}
      overflowY={"auto"}
      w={"full"}
      align={"stretch"}
      gapX={"md"}
      gapY={"xl"}
      p={"md"}
    >
      {/* 1. Kredensial Workspace */}
      <VStack align={"stretch"} gap={3}>
        <Heading>{"Kredensial Workspace"}</Heading>

        <SimpleGrid columns={isSmContainer ? 1 : 2} gap={3}>
          <Box
            p={4}
            borderWidth={"1px"}
            borderColor={"border.subtle"}
            rounded={theme.radii.component}
          >
            <VStack align={"start"} gap={2}>
              <P color={"fg.muted"}>{"Nama Workspace"}</P>

              <HStack align={"center"} justify={"space-between"} w={"full"}>
                <P fontWeight={"medium"} color={"blue.fg"} fontFamily={"mono"}>
                  {workspaceUrl.workspaceName}
                </P>

                <ClipboardButton value={workspaceUrl.workspaceName} />
              </HStack>
            </VStack>
          </Box>

          {apiKey && (
            <Box
              p={4}
              borderWidth={"1px"}
              borderColor={"border.subtle"}
              rounded={theme.radii.component}
            >
              <VStack align={"start"} gap={2}>
                <P color={"fg.muted"}>{"API Key"}</P>

                <MaskedSecretField value={apiKey} p={0} border={"none"} />
              </VStack>
            </Box>
          )}
        </SimpleGrid>
      </VStack>

      {/* <Separator borderColor={"border.subtle"} /> */}

      {/* 2. Endpoint Layanan GIS */}
      <VStack align={"stretch"} gap={"md"}>
        <HStack align={"center"} gap={"xs"}>
          <Heading>{"WMS - Endpoint Layanan GIS"}</Heading>

          <InfoTip appIconProps={{ size: "sm" }}>
            {
              "Satu URL untuk mengakses seluruh layer IGT aktif Anda di software GIS atau web mapping."
            }
          </InfoTip>
        </HStack>

        <MaskedSecretField value={workspaceUrl.wmsUrl} />
      </VStack>

      {/* <Separator borderColor={"border.subtle"} /> */}

      {/* 3. Panduan Koneksi QGIS */}
      <VStack align={"stretch"} gap={4}>
        <Heading>{"Panduan Koneksi QGIS"}</Heading>

        <Box p={4} bg={"bg.subtle"} rounded={theme.radii.component}>
          <VStack align={"stretch"} gap={2}>
            <HStack align={"start"} gap={2}>
              <P fontWeight={"semibold"} color={"fg.muted"}>
                {"1."}
              </P>
              <P>
                {"Pilih menu "}
                <P as={"span"} fontWeight={"medium"}>
                  {"Layer → Add Layer → Add WMS/WMTS Layer..."}
                </P>
              </P>
            </HStack>

            <HStack align={"start"} gap={2}>
              <P fontWeight={"semibold"} color={"fg.muted"}>
                {"2."}
              </P>
              <P>
                {"Klik "}
                <P as={"span"} fontWeight={"medium"}>
                  {"New"}
                </P>
                {", masukkan nama koneksi dan tempelkan WMS URL."}
              </P>
            </HStack>

            <HStack align={"start"} gap={2}>
              <P fontWeight={"semibold"} color={"fg.muted"}>
                {"3."}
              </P>
              <P>
                {"Klik "}
                <P as={"span"} fontWeight={"medium"}>
                  {"OK"}
                </P>
                {" lalu klik "}
                <P as={"span"} fontWeight={"medium"}>
                  {"Connect"}
                </P>
                {" untuk memuat daftar seluruh layer."}
              </P>
            </HStack>
          </VStack>
        </Box>
      </VStack>

      {/* <Separator borderColor={"border.subtle"} /> */}

      {/* 4. Catatan Teknis */}
      <P color={"fg.muted"}>
        {
          "Layer IGT yang baru Anda beli akan otomatis tersedia di endpoint workspace di atas tanpa perlu konfigurasi ulang."
        }
      </P>
    </VStack>
  );
};
