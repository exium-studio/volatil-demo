// src/design-system/components/map/utils/apply-custom-paint-overrides.ts

export function applyCustomPaintOverrides(map: maplibregl.Map) {
  const setIfExists = (
    layerId: string,
    prop: string,
    value: string | number | unknown[],
  ) => {
    if (!map.getLayer(layerId)) return;
    try {
      map.setPaintProperty(layerId, prop, value);
    } catch {
      // layer exists but property type doesn't match — skip silently
    }
  };

  // Roads → abu-abu netral, bukan kuning
  setIfExists("road_motorway", "line-color", "#e8e8e8");
  setIfExists("road_motorway_casing", "line-color", "#9ca3af");
  setIfExists("road_trunk_primary", "line-color", "#f2f2f2");
  setIfExists("road_trunk_primary_casing", "line-color", "#a1a1aa");
  setIfExists("road_secondary_tertiary", "line-color", "#ffffff");
  setIfExists("road_secondary_tertiary_casing", "line-color", "#c4c4c8");

  // Laut → variasi tone by zoom
  setIfExists("water", "fill-color", [
    "interpolate",
    ["linear"],
    ["zoom"],
    4,
    "#9addff",
    10,
    "#b8def1",
    16,
    "#b8def1",
  ]);

  // Pulau/daratan → hijau (#bbe6b3) saat zoom out (globe view),
  // fade ke warna tanah natural saat zoom in.
  const landColorByZoom = [
    "interpolate",
    ["linear"],
    ["zoom"],
    0,
    "#bbe6b3",
    4,
    "#cbedc5",
    8,
    "#f2ede8",
  ];
  // OpenFreeMap Liberty / OpenMapTiles kemungkinan layer IDs untuk land
  setIfExists("land", "fill-color", landColorByZoom);
  // background layer pakai background-color, bukan fill-color
  setIfExists("background", "background-color", landColorByZoom);
  setIfExists("landcover-land", "fill-color", landColorByZoom);

  // Park/wood lebih seger
  setIfExists("landcover_wood", "fill-color", "#bbe6b3");
  setIfExists("park", "fill-color", "#bbe6b3");
}
