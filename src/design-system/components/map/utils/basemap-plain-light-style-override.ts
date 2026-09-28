// src/design-system/components/map/utils/basemap-plain-light-style-override.ts

import type maplibregl from "maplibre-gl";

const ROAD_COLORS = {
  motorway: { fill: "#ffffff", casing: "#dcdcdc" },
  trunkPrimary: { fill: "#ffffff", casing: "#e0e0e0" },
  secondaryTertiary: { fill: "#ffffff", casing: "#e5e5e5" },
  link: { fill: "#ffffff", casing: "#e5e5e5" },
  minor: { fill: "#ffffff", casing: "#ebebeb" },
  serviceTrack: { fill: "#ffffff", casing: "#ededed" },
  pathPedestrian: { fill: "#ededed", casing: "#dcdcdc" },
} as const;

const BUILDING_FILL = "#e6e6e9";
const BUILDING_OUTLINE = "#dcdce0";

export function applyBasemapPlainLightStyleOverride(map: maplibregl.Map) {
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
  setIfExists("building-3d", "fill-extrusion-floor-color", BUILDING_FILL);

  map.setLight({
    anchor: "viewport",
    color: "#ffffff",
    intensity: 0.2,
  });

  // Land / background
  setIfExists("background", "background-color", [
    "interpolate",
    ["linear"],
    ["zoom"],
    9,
    "#ededed",
    11,
    "#f0f0f0",
    13,
    "#f2f2f2",
  ]);

  // Landcover
  setIfExists("landcover_wood", "fill-color", "#e2ede1");
  setIfExists("landcover_wood", "fill-outline-color", "#e2ede1");
  setIfExists("landcover_grass", "fill-color", "#e4ebe4");
  setIfExists("landcover_grass", "fill-outline-color", "#e4ebe4");
  setIfExists("landcover_sand", "fill-color", "hsla(51, 100%, 96%, 1.00)");

  setIfExists("park", "fill-color", "#d8e8d8");
  setIfExists("park", "fill-outline-color", "#d8e8d8");
  setIfExists("park_outline", "line-color", "#d8e8d8");
  setIfExists("landuse_residential", "fill-color", "#eceeed");
  setIfExists("landuse_cemetery", "fill-color", "#e0e8da");
  setIfExists("landuse_school", "fill-color", "#eef0e4");
  setIfExists("landuse_hospital", "fill-color", "#f0eaea");
  setIfExists("landuse_pitch", "fill-color", "#d8e8d4");
  setIfExists("landuse_track", "fill-color", "#dde8d8");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (map.setPaintProperty as any)("landcover_wetland", "fill-pattern", null);
  setIfExists("landcover_wetland", "fill-color", "#e4ebe4");
  setIfExists("landcover_wetland", "fill-outline-color", "#e4ebe4");

  // Water
  setIfExists("water", "fill-color", "#d4dadc");
  setIfExists("waterway_river", "line-color", "#d4dadc");
  setIfExists("waterway_other", "line-color", "#d4dadc");
  setIfExists("waterway_tunnel", "line-color", "#d4dadc");

  if (map.getLayer("natural_earth")) {
    map.setLayoutProperty("natural_earth", "visibility", "none");
  }

  // Label overrides to match Carto Positron theme
  map.getStyle().layers.forEach((layer) => {
    if (layer.type === "symbol") {
      try {
        map.setPaintProperty(layer.id, "text-color", "#5e5e62");
        map.setPaintProperty(layer.id, "text-halo-color", "#f2f2f2");
        map.setPaintProperty(layer.id, "text-halo-width", 1.5);
      } catch {
        // Skip layers without text property
      }
    }
  });
}
