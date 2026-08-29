// src/features/internal/data-management/components/geoserver-cascade-select.tsx

import { Field } from "@/design-system/components/input/ui/field";
import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";
import { Input } from "@/design-system/components/input/ui/input";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import {
  useGeoServerWorkspaceLayersQuery,
  useGeoServerWorkspacesQuery,
} from "@/features/internal/data-management/hooks/use-data-management";
import type { GeoServerWorkspaceLayerOption } from "@/features/internal/data-management/types/data-management.type";
import { useMasterGeoserverQuery } from "@/features/internal/master-geoserver/hooks/use-master-geoserver";
import { useMemo } from "react";

export type GeoserverCascadeSelectProps = {
  parentModalKey: string;
  selectedGeoserverId: string;
  onGeoserverChange: (geoserverId: string) => void;
  selectedWorkspace: string;
  onWorkspaceChange: (workspace: string) => void;
  selectedTypeName: string;
  onLayerChange: (
    typeName: string,
    layerDetail?: GeoServerWorkspaceLayerOption,
  ) => void;
  previewWfsUrl?: string;
  previewWmsUrl?: string;
};

export const GeoserverCascadeSelect = (props: GeoserverCascadeSelectProps) => {
  // Props
  const {
    parentModalKey,
    selectedGeoserverId,
    onGeoserverChange,
    selectedWorkspace,
    onWorkspaceChange,
    selectedTypeName,
    onLayerChange,
    previewWfsUrl,
    previewWmsUrl,
  } = props;

  // Hooks (Queries)
  const { items: geoserverList, isLoading: isLoadingGeoserver } =
    useMasterGeoserverQuery();
  const { workspaces, isLoading: isLoadingWorkspaces } =
    useGeoServerWorkspacesQuery(selectedGeoserverId);
  const { layers: workspaceLayers, isLoading: isLoadingLayers } =
    useGeoServerWorkspaceLayersQuery(selectedGeoserverId, selectedWorkspace);

  // Derived Values
  const geoserverOptions: FocusSelectOption[] = useMemo(
    () =>
      geoserverList.map((g) => ({
        label: g.name,
        value: g.id,
        description: g.baseUrl,
      })),
    [geoserverList],
  );

  const workspaceOptions: FocusSelectOption[] = useMemo(
    () =>
      workspaces.map((ws) => ({
        label: ws,
        value: ws,
      })),
    [workspaces],
  );

  const layerOptions: FocusSelectOption[] = useMemo(
    () =>
      workspaceLayers.map((lyr) => ({
        label: lyr.title || lyr.name,
        value: lyr.typeName,
      })),
    [workspaceLayers],
  );

  const handleLayerSelect = (typeName: string) => {
    const foundLayer = workspaceLayers.find((l) => l.typeName === typeName);
    onLayerChange(typeName, foundLayer);
  };

  return (
    <VStack align={"stretch"} gap={"md"} w={"full"}>
      {/* 1. Select Master GeoServer */}
      <FocusSelectInput
        modalKey={`${parentModalKey}.geoserver`}
        label={"Master GeoServer"}
        placeholder={"Pilih GeoServer..."}
        options={geoserverOptions}
        value={selectedGeoserverId}
        onValueChange={(val) => {
          onGeoserverChange(val);
          onWorkspaceChange("");
          onLayerChange("", undefined);
        }}
        isFetching={isLoadingGeoserver}
      />

      {/* 2. Select Workspace */}
      <FocusSelectInput
        modalKey={`${parentModalKey}.workspace`}
        label={"Workspace GeoServer"}
        placeholder={
          selectedGeoserverId
            ? "Pilih workspace..."
            : "Pilih GeoServer terlebih dahulu"
        }
        options={workspaceOptions}
        value={selectedWorkspace}
        onValueChange={(val) => {
          onWorkspaceChange(val);
          onLayerChange("", undefined);
        }}
        disabled={!selectedGeoserverId}
        isFetching={isLoadingWorkspaces}
      />

      {/* 3. Select Layer */}
      <FocusSelectInput
        modalKey={`${parentModalKey}.layer`}
        label={"Layer"}
        placeholder={
          selectedWorkspace
            ? "Pilih layer..."
            : "Pilih workspace terlebih dahulu"
        }
        options={layerOptions}
        value={selectedTypeName}
        onValueChange={handleLayerSelect}
        disabled={!selectedWorkspace}
        isFetching={isLoadingLayers}
      />

      {/* WFS & WMS Generated URLs */}
      {selectedTypeName && (
        <VStack align={"stretch"} gap={"sm"} pt={"2xs"}>
          <Field label={"WFS Service URL (Otomatis)"}>
            <Input
              value={previewWfsUrl ?? "-"}
              readOnly
              fontFamily={"mono"}
              fontSize={"xs"}
            />
          </Field>

          <Field label={"WMS Service URL (Otomatis)"}>
            <Input
              value={previewWmsUrl ?? "-"}
              readOnly
              fontFamily={"mono"}
              fontSize={"xs"}
            />
          </Field>
        </VStack>
      )}
    </VStack>
  );
};
