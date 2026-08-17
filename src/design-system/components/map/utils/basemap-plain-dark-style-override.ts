// src/design-system/components/map/utils/basemap-plain-dark-style-override.ts

import type maplibregl from "maplibre-gl";

const ROAD_COLORS = {
  motorway: { fill: "#141516", casing: "#111213" },
  trunkPrimary: { fill: "#131415", casing: "#111213" },
  secondaryTertiary: { fill: "#121314", casing: "#111213" },
  link: { fill: "#121314", casing: "#111213" },
  minor: { fill: "#111212", casing: "#111213" },
  serviceTrack: { fill: "#101111", casing: "#111213" },
  pathPedestrian: { fill: "#0f1010", casing: "#0e0f0f" },
} as const;

const BUILDING_FILL = "#252629";
const BUILDING_OUTLINE = "#1f2022";
const GREENERY_FILL = "#161a17";
const LANDUSE_SOLID_FILL = "#1b1c1e";

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

  const setSolidFill = (
    layerId: string,
    color: string,
    outlineColor?: string,
  ) => {
    if (!map.getLayer(layerId)) return;
    try {
      // Clear fill-pattern so solid fill-color takes effect instead of pattern sprite
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (map.setPaintProperty as any)(layerId, "fill-pattern", null);
      map.setLayoutProperty(layerId, "visibility", "visible");
      map.setPaintProperty(layerId, "fill-color", color);
      // Remove outline contrast by matching fill color or setting outlineColor
      map.setPaintProperty(
        layerId,
        "fill-outline-color",
        outlineColor ?? color,
      );
    } catch {
      // layer exists but property type doesn't match — skip silently
    }
  };

  // 1. Remove fill-pattern from ALL fill layers globally so no white striped patterns render anywhere
  map.getStyle().layers.forEach((layer) => {
    if (layer.type === "fill") {
      try {
        const pattern = map.getPaintProperty(layer.id, "fill-pattern");
        if (pattern) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (map.setPaintProperty as any)(layer.id, "fill-pattern", null);
        }
      } catch {
        // Skip layers without fill-pattern property
      }
    }
  });

  // Boundaries
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
  setSolidFill("building", BUILDING_FILL, BUILDING_OUTLINE);
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
    "#141414",
    11,
    "#161616",
    13,
    "#191a1a",
  ]);

  // Landcover & Landuse (Solid Dark Fills without Pattern Sprites)
  setSolidFill("landcover_grass", GREENERY_FILL);
  setSolidFill("landcover_wood", GREENERY_FILL);
  setSolidFill("landcover_scrub", GREENERY_FILL);
  setSolidFill("landcover_crop", GREENERY_FILL);
  setSolidFill("landcover_sand", "#222018");
  setSolidFill("landcover_ice", "#1e2124");
  setSolidFill("landcover_wetland", GREENERY_FILL);

  setSolidFill("park", GREENERY_FILL);
  if (map.getLayer("park_outline")) {
    map.setLayoutProperty("park_outline", "visibility", "none");
  }
  setSolidFill("landuse_park", GREENERY_FILL);
  setSolidFill("landuse_track", "#1e2022");
  setSolidFill("landuse_pitch", "#1d201e");
  setSolidFill("landuse_pedestrian", LANDUSE_SOLID_FILL);
  setSolidFill("pedestrian", LANDUSE_SOLID_FILL);

  setSolidFill("landuse_residential", LANDUSE_SOLID_FILL);
  setSolidFill("landuse_commercial", "#202124");
  setSolidFill("landuse_industrial", "#1f2022");
  setSolidFill("landuse_cemetery", GREENERY_FILL);
  setSolidFill("landuse_school", "#1c2122");
  setSolidFill("landuse_hospital", "#241e1e");

  // Aeroway (airport apron/runway fill)
  setIfExists("aeroway_fill", "fill-color", "#242528");
  setIfExists("aeroway_runway", "line-color", "#2c2d30");
  setIfExists("aeroway_taxiway", "line-color", "#242528");

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
