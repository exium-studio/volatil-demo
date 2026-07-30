// src/design-system/components/map/utils/basemap-plain-dark-style-override.ts

import type maplibregl from "maplibre-gl";

const ROAD_COLORS = {
  motorway: { fill: "#2c2d30", casing: "#18191b" },
  trunkPrimary: { fill: "#28292c", casing: "#18191b" },
  secondaryTertiary: { fill: "#242528", casing: "#18191b" },
  link: { fill: "#242528", casing: "#18191b" },
  minor: { fill: "#202123", casing: "#18191b" },
  serviceTrack: { fill: "#1c1d1e", casing: "#18191b" },
  pathPedestrian: { fill: "#18191a", casing: "#141415" },
} as const;

const BUILDING_FILL = "#252629";
const BUILDING_OUTLINE = "#1f2022";

// Layers that use fill-pattern sprites — fill-color and fill-opacity are both
// disabled when fill-pattern is active. Hiding them via layout visibility is
// the only reliable way to suppress the pattern rendering entirely.
const HIDDEN_PATTERN_LAYERS = [
  "landcover_wood",
  "landuse_track",
  "landuse_pitch",
];

export function applyBasemapPlainDarkStyleOverride(map: maplibregl.Map) {
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

  setIfExists("boundary_2", "line-color", "#4e4e4eff");
  setIfExists("boundary_3", "line-color", "#4e4e4eff");
  setIfExists("boundary_disputed", "line-color", "#4e4e4eff");

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
    intensity: 0.25,
    position: [1.5, 90, 80],
  });

  // Land / background
  setIfExists("background", "background-color", [
    "interpolate",
    ["linear"],
    ["zoom"],
    9,
    "#141414",
    11,
    "#161616",
    13,
    "#191a1a",
  ]);

  // Landcover & Landuse
  setIfExists("landcover_grass", "fill-color", "#1e2320");
  setIfExists("landcover_grass", "fill-outline-color", "#1e2320");
  setIfExists("landcover_sand", "fill-color", "#242218");
  setIfExists("landcover_sand", "fill-outline-color", "#242218");

  setIfExists("park", "fill-color", "#1c2420");
  setIfExists("park", "fill-outline-color", "#1c2420");
  setIfExists("park_outline", "line-color", "#1c2420");
  setIfExists("landuse_residential", "fill-color", "#1e1f21");
  setIfExists("landuse_cemetery", "fill-color", "#1c2420");
  setIfExists("landuse_school", "fill-color", "#1c2122");
  setIfExists("landuse_hospital", "fill-color", "#241e1e");

  // Ice / glacier (causes the white circle at poles)
  setIfExists("landcover_ice", "fill-color", "#1e2124");
  setIfExists("landcover_ice", "fill-outline-color", "#1e2124");

  // Wetland — has fill-pattern, must unset pattern before fill-color takes effect
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (map.setPaintProperty as any)("landcover_wetland", "fill-pattern", null);
  setIfExists("landcover_wetland", "fill-color", "#1e2320");
  setIfExists("landcover_wetland", "fill-outline-color", "#1e2320");

  // Aeroway (airport apron/runway fill)
  setIfExists("aeroway_fill", "fill-color", "#242528");
  setIfExists("aeroway_runway", "line-color", "#2c2d30");
  setIfExists("aeroway_taxiway", "line-color", "#242528");

  // Pattern-sprite layers (forest/track/pitch) — fill-color and fill-opacity
  // are both disabled when fill-pattern is active. Hide via layout visibility
  // instead; the dark background shows through cleanly.
  HIDDEN_PATTERN_LAYERS.forEach((id) => {
    if (!map.getLayer(id)) return;
    map.setLayoutProperty(id, "visibility", "none");
  });

  // Water
  setIfExists("water", "fill-color", "#262626");
  setIfExists("waterway_river", "line-color", "#262626");
  setIfExists("waterway_other", "line-color", "#262626");
  setIfExists("waterway_tunnel", "line-color", "#262626");

  if (map.getLayer("natural_earth")) {
    map.setLayoutProperty("natural_earth", "visibility", "visible");
    map.setPaintProperty("natural_earth", "raster-hue-rotate", 70);
    map.setPaintProperty("natural_earth", "raster-saturation", -0.5);
    map.setPaintProperty("natural_earth", "raster-brightness-min", 0.05);
    map.setPaintProperty("natural_earth", "raster-brightness-max", 0.25);
    map.setPaintProperty("natural_earth", "raster-contrast", 0.0);
    map.setPaintProperty("natural_earth", "raster-opacity", 0);
  }

  // Label overrides to match Carto Dark Matter theme
  map.getStyle().layers.forEach((layer) => {
    if (layer.type === "symbol") {
      try {
        map.setPaintProperty(layer.id, "text-color", "#8e8e93");
        map.setPaintProperty(layer.id, "text-halo-color", "#191a1a");
        map.setPaintProperty(layer.id, "text-halo-width", 1.5);
      } catch {
        // Skip layers without text property
      }
    }
  });
}
