// src/features/internal/data-management/components/geoserver-cascade-select.tsx

// src\features\internal\data-management\components\geoserver-cascade-select.tsx

// src\features\internal\data-management\components\geoserver-cascade-select.tsx

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import { Field } from "@/design-system/components/input/ui/field";
import { FocusSelectInput } from "@/design-system/components/input/ui/focus-select";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import {
  useGeoServerWorkspaceLayersQuery,
  useGeoServerWorkspacesQuery,
} from "@/features/internal/data-management/hooks/use-data-management";
import type { GeoserverCascadeSelectProps } from "@/features/internal/data-management/types/data-management.type";
import { useMasterGeoserverQuery } from "@/features/internal/master-geoserver/hooks/use-master-geoserver";
import { useMemo } from "react";

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
    initialLayerOption,
  } = props;

  // Hooks (Queries)
  const {
    items: geoserverList,
    isLoading: isLoadingGeoserver,
    isError: isErrorGeoserver,
    refetch: refetchGeoserver,
  } =
    useMasterGeoserverQuery();
  const {
    workspaces,
    isLoading: isLoadingWorkspaces,
    isError: isErrorWorkspaces,
    refetch: refetchWorkspaces,
  } =
    useGeoServerWorkspacesQuery(selectedGeoserverId);
  const {
    layers: workspaceLayers,
    isLoading: isLoadingLayers,
    isError: isErrorLayers,
    refetch: refetchLayers,
  } =
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

  const layerOptions: FocusSelectOption[] = useMemo(() => {
    const list: FocusSelectOption[] = workspaceLayers.map((lyr) => ({
      label: lyr.title || lyr.name,
      value: lyr.typeName,
    }));

    if (
      initialLayerOption &&
      !list.some((opt) => opt.value === initialLayerOption.value)
    ) {
      return [initialLayerOption, ...list];
    }

    return list;
  }, [workspaceLayers, initialLayerOption]);

  const handleLayerSelect = (typeName: string) => {
    const foundLayer = workspaceLayers.find((l) => l.typeName === typeName);
    onLayerChange(typeName, foundLayer);
  };

  return (
    <VStack align={"stretch"} gap={"md"} w={"full"}>
      {/* 1. Select Master GeoServer */}
      <Field label={"Master GeoServer"}>
        <FocusSelectInput
          modalKey={`${parentModalKey}.geoserver`}
          title={"Master GeoServer"}
          placeholder={"Pilih GeoServer..."}
          options={geoserverOptions}
          value={selectedGeoserverId}
          onValueChange={(val) => {
            onGeoserverChange(val);
            onWorkspaceChange("");
            onLayerChange("", undefined);
          }}
          isFetching={isLoadingGeoserver}
          isError={isErrorGeoserver}
          onRetry={() => void refetchGeoserver()}
        />
      </Field>

      {/* 2. Select Workspace */}
      <Field label={"Workspace GeoServer"}>
        <FocusSelectInput
          modalKey={`${parentModalKey}.workspace`}
          title={"Workspace GeoServer"}
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
          isError={isErrorWorkspaces}
          onRetry={() => void refetchWorkspaces()}
        />
      </Field>

      {/* 3. Select Layer */}
      <Field label={"Layer"}>
        <FocusSelectInput
          modalKey={`${parentModalKey}.layer`}
          title={"Layer"}
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
          isError={isErrorLayers}
          onRetry={() => void refetchLayers()}
        />
      </Field>
    </VStack>
  );
};
