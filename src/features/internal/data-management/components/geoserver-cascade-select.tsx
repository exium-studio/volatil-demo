// src/features/internal/data-management/components/geoserver-cascade-select.tsx

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
    selectedLayerName,
    selectedTypeName,
    onLayerChange,
    errors,
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

  const layerOptions: FocusSelectOption[] = useMemo(
    () =>
      workspaceLayers.map((lyr) => ({
        label: lyr.title || lyr.name,
        value: lyr.name,
        description:
          lyr.abstract ||
          (lyr.spatialBasis ? `Basis: ${lyr.spatialBasis}` : undefined),
      })),
    [workspaceLayers],
  );

  const handleLayerSelect = (layerName: string) => {
    if (!layerName) {
      // Level Workspace (all layers in workspace)
      onLayerChange(null, selectedWorkspace, undefined);
      return;
    }
    const foundLayer = workspaceLayers.find(
      (l) => l.name === layerName || l.typeName === layerName,
    );
    const constructedTypeName = selectedWorkspace
      ? `${selectedWorkspace}:${layerName}`
      : layerName;
    onLayerChange(layerName, constructedTypeName, foundLayer);
  };

  // Determine active layer selection for FocusSelectInput
  const effectiveLayerSelectValue = useMemo(() => {
    if (selectedLayerName) return selectedLayerName;
    if (
      selectedTypeName &&
      selectedWorkspace &&
      selectedTypeName.startsWith(`${selectedWorkspace}:`)
    ) {
      return selectedTypeName.replace(`${selectedWorkspace}:`, "");
    }
    return "";
  }, [selectedLayerName, selectedTypeName, selectedWorkspace]);

  return (
    <VStack align={"stretch"} gap={"md"} w={"full"}>
      {/* 1. Select Master GeoServer */}
      <Field
        label={"Master GeoServer"}
        invalid={Boolean(errors?.geoserverId)}
        errorText={errors?.geoserverId?.message}
      >
        <FocusSelectInput
          modalKey={`${parentModalKey}.geoserver`}
          title={"Master GeoServer"}
          placeholder={"Pilih GeoServer..."}
          options={geoserverOptions}
          value={selectedGeoserverId}
          onValueChange={(val) => {
            onGeoserverChange(val);
            onWorkspaceChange("");
            onLayerChange(null, "", undefined);
          }}
          isFetching={isLoadingGeoserver}
          isError={isErrorGeoserver}
          onRetry={() => void refetchGeoserver()}
        />
      </Field>

      {/* 2. Select Workspace */}
      <Field
        label={"Workspace GeoServer"}
        invalid={Boolean(errors?.workspaceName || errors?.workspace)}
        errorText={errors?.workspaceName?.message || errors?.workspace?.message}
      >
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
            onLayerChange(null, val, undefined);
          }}
          disabled={!selectedGeoserverId}
          isFetching={isLoadingWorkspaces}
          isError={isErrorWorkspaces}
          onRetry={() => void refetchWorkspaces()}
        />
      </Field>

      {/* 3. Select Layer */}
      <Field
        label={"Layer"}
        optional
        invalid={Boolean(errors?.layerName || errors?.typeName)}
        errorText={errors?.layerName?.message || errors?.typeName?.message}
      >
        <FocusSelectInput
          modalKey={`${parentModalKey}.layer`}
          title={"Layer"}
          placeholder={
            selectedWorkspace
              ? "Pilih layer (opsional — kosongkan jika level workspace)..."
              : "Pilih workspace terlebih dahulu"
          }
          options={layerOptions}
          value={effectiveLayerSelectValue}
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
