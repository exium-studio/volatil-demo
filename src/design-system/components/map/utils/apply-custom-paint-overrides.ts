// src/design-system/components/map/utils/apply-custom-paint-overrides.ts

/**
 * Grey road palette — applied consistently across road_*, bridge_*, and
 * tunnel_* layer variants, since OpenMapTiles/Liberty duplicates the same
 * road classes per rendering context (surface, bridge, tunnel).
 */
const ROAD_COLORS = {
  motorway: { fill: "#e2e2e5", casing: "#9aa0a6" },
  trunkPrimary: { fill: "#eeeeee", casing: "#a8adb3" },
  secondaryTertiary: { fill: "#ffffff", casing: "#c7cbd1" },
  link: { fill: "#f0f0f0", casing: "#a8adb3" },
  minor: { fill: "#ffffff", casing: "#d5d8dc" },
  serviceTrack: { fill: "#ffffff", casing: "#c7cbd1" },
  pathPedestrian: { fill: "#ffffff", casing: "#d5d8dc" },
} as const;

// Building fill
const BUILDING_FILL = "#f4f4f6";
const BUILDING_OUTLINE = "#e0e0e3";

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

  // Roads (surface)
  setIfExists("road_motorway", "line-color", ROAD_COLORS.motorway.fill);
  setIfExists(
    "road_motorway_casing",
    "line-color",
    ROAD_COLORS.motorway.casing,
  );
  setIfExists("road_motorway_link", "line-color", ROAD_COLORS.link.fill);
  setIfExists(
    "road_motorway_link_casing",
    "line-color",
    ROAD_COLORS.link.casing,
  );

  setIfExists(
    "road_trunk_primary",
    "line-color",
    ROAD_COLORS.trunkPrimary.fill,
  );
  setIfExists(
    "road_trunk_primary_casing",
    "line-color",
    ROAD_COLORS.trunkPrimary.casing,
  );

  setIfExists(
    "road_secondary_tertiary",
    "line-color",
    ROAD_COLORS.secondaryTertiary.fill,
  );
  setIfExists(
    "road_secondary_tertiary_casing",
    "line-color",
    ROAD_COLORS.secondaryTertiary.casing,
  );

  setIfExists("road_link", "line-color", ROAD_COLORS.link.fill);
  setIfExists("road_link_casing", "line-color", ROAD_COLORS.link.casing);

  setIfExists("road_minor", "line-color", ROAD_COLORS.minor.fill);
  setIfExists("road_minor_casing", "line-color", ROAD_COLORS.minor.casing);

  setIfExists(
    "road_service_track",
    "line-color",
    ROAD_COLORS.serviceTrack.fill,
  );
  setIfExists(
    "road_service_track_casing",
    "line-color",
    ROAD_COLORS.serviceTrack.casing,
  );

  setIfExists(
    "road_path_pedestrian",
    "line-color",
    ROAD_COLORS.pathPedestrian.fill,
  );

  // Bridges (flyover, elevated roads)
  setIfExists("bridge_motorway", "line-color", ROAD_COLORS.motorway.fill);
  setIfExists(
    "bridge_motorway_casing",
    "line-color",
    ROAD_COLORS.motorway.casing,
  );
  setIfExists("bridge_motorway_link", "line-color", ROAD_COLORS.link.fill);
  setIfExists(
    "bridge_motorway_link_casing",
    "line-color",
    ROAD_COLORS.link.casing,
  );

  setIfExists(
    "bridge_trunk_primary",
    "line-color",
    ROAD_COLORS.trunkPrimary.fill,
  );
  setIfExists(
    "bridge_trunk_primary_casing",
    "line-color",
    ROAD_COLORS.trunkPrimary.casing,
  );

  setIfExists(
    "bridge_secondary_tertiary",
    "line-color",
    ROAD_COLORS.secondaryTertiary.fill,
  );
  setIfExists(
    "bridge_secondary_tertiary_casing",
    "line-color",
    ROAD_COLORS.secondaryTertiary.casing,
  );

  setIfExists("bridge_link", "line-color", ROAD_COLORS.link.fill);
  setIfExists("bridge_link_casing", "line-color", ROAD_COLORS.link.casing);

  setIfExists("bridge_street", "line-color", ROAD_COLORS.minor.fill);
  setIfExists("bridge_street_casing", "line-color", ROAD_COLORS.minor.casing);

  setIfExists(
    "bridge_service_track",
    "line-color",
    ROAD_COLORS.serviceTrack.fill,
  );
  setIfExists(
    "bridge_service_track_casing",
    "line-color",
    ROAD_COLORS.serviceTrack.casing,
  );

  setIfExists(
    "bridge_path_pedestrian",
    "line-color",
    ROAD_COLORS.pathPedestrian.fill,
  );
  setIfExists(
    "bridge_path_pedestrian_casing",
    "line-color",
    ROAD_COLORS.pathPedestrian.casing,
  );

  // Tunnels
  setIfExists("tunnel_motorway", "line-color", ROAD_COLORS.motorway.fill);
  setIfExists(
    "tunnel_motorway_casing",
    "line-color",
    ROAD_COLORS.motorway.casing,
  );
  setIfExists("tunnel_motorway_link", "line-color", ROAD_COLORS.link.fill);
  setIfExists(
    "tunnel_motorway_link_casing",
    "line-color",
    ROAD_COLORS.link.casing,
  );

  setIfExists(
    "tunnel_trunk_primary",
    "line-color",
    ROAD_COLORS.trunkPrimary.fill,
  );
  setIfExists(
    "tunnel_trunk_primary_casing",
    "line-color",
    ROAD_COLORS.trunkPrimary.casing,
  );

  setIfExists(
    "tunnel_secondary_tertiary",
    "line-color",
    ROAD_COLORS.secondaryTertiary.fill,
  );
  setIfExists(
    "tunnel_secondary_tertiary_casing",
    "line-color",
    ROAD_COLORS.secondaryTertiary.casing,
  );

  setIfExists("tunnel_link", "line-color", ROAD_COLORS.link.fill);
  setIfExists("tunnel_link_casing", "line-color", ROAD_COLORS.link.casing);

  setIfExists("tunnel_minor", "line-color", ROAD_COLORS.minor.fill);

  setIfExists(
    "tunnel_service_track",
    "line-color",
    ROAD_COLORS.serviceTrack.fill,
  );
  setIfExists(
    "tunnel_service_track_casing",
    "line-color",
    ROAD_COLORS.serviceTrack.casing,
  );

  setIfExists("tunnel_street_casing", "line-color", ROAD_COLORS.minor.casing);

  setIfExists(
    "tunnel_path_pedestrian",
    "line-color",
    ROAD_COLORS.pathPedestrian.fill,
  );

  // Buildings
  setIfExists("building", "fill-color", BUILDING_FILL);
  setIfExists("building", "fill-outline-color", BUILDING_OUTLINE);
  setIfExists("building-3d", "fill-extrusion-color", BUILDING_FILL);

  // Land / background
  setIfExists("background", "background-color", [
    "interpolate",
    ["linear"],
    ["zoom"],
    9,
    "hsl(20, 20%, 95%)",
    11,
    "hsl(20, 18%, 91%)",
  ]);

  // Landcover
  setIfExists("landcover_wood", "fill-color", "hsla(115, 55%, 74%, 0.8)");
  setIfExists("landcover_grass", "fill-color", "hsla(110, 55%, 88%, 0.6)");
  setIfExists("landcover_sand", "fill-color", "hsl(52, 65%, 86%)");

  setIfExists("park", "fill-color", "hsl(110, 60%, 80%)");
  setIfExists("landuse_residential", "fill-color", "hsl(20, 7%, 97%)");
  setIfExists("landuse_cemetery", "fill-color", "hsl(110, 48%, 85%)");
  setIfExists("landuse_school", "fill-color", "hsl(40, 50%, 88%)");
  setIfExists("landuse_hospital", "fill-color", "hsl(0, 50%, 92%)");
  setIfExists("landuse_pitch", "fill-color", "hsl(100, 70%, 85%)");
  setIfExists("landuse_track", "fill-color", "hsl(100, 70%, 85%)");

  // Water
  setIfExists("water", "fill-color", "hsl(200, 100%, 80%)");
  setIfExists("waterway_river", "line-color", "hsl(200, 100%, 80%)");
  setIfExists("waterway_other", "line-color", "hsl(200, 100%, 80%)");
  setIfExists("waterway_tunnel", "line-color", "hsl(200, 100%, 80%)");

  if (map.getLayer("natural_earth")) {
    map.setLayoutProperty("natural_earth", "visibility", "visible");
    map.setPaintProperty("natural_earth", "raster-hue-rotate", 70);
    map.setPaintProperty("natural_earth", "raster-saturation", 0.6);
    map.setPaintProperty("natural_earth", "raster-brightness-min", 0.32);
    map.setPaintProperty("natural_earth", "raster-brightness-max", 1);
    map.setPaintProperty("natural_earth", "raster-contrast", 0.12);
  }
}
