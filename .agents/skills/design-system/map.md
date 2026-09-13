---
name: exium-map
description: "Guidelines and architecture for MapLibre, GeoServer WFS/WMS, MapShell, layer order, and draw hooks in Exium."
---

# Exium Map Components & Architecture

Located in `@/design-system/components/map/`.

---

## 🔴 Absolute Map Rules

1. **Layer Order (bottom → top)**:
   `basemap` → `wms-raster` → `wfs-*` → `draw` (mutlak).
2. **Custom layers must survive style changes**:
   Custom layers must survive `style.load` via listening to `map-style-ready` event.
3. **`map-layers-ready` event**:
   Fired after all layers are added — drawing hooks listen to this event.
4. **WFS conventions**:
   - Selalu sertakan `srsName=EPSG:4326`.
   - CQL Spatial filter: `INTERSECTS(geom, POLYGON((lon lat, ...)))` (lon/lat order).
5. **Architecture**:
   - `map.basemap.tsx`: Hanya menangani map init, style switching, `applyGlobe`, dan firing events — dilarang meletakkan hooks/overlay bisnis di sini.
   - `MapShell` compose: `BaseMap` + `MapOverlay` + `useMapLayers` + `useMapDraw` + `useMapResizeObserver`.
   - Semua layer management wajib lewat `useMapLayers` via config array — no dedicated per-layer hooks.

---

## Components:
- `BaseMap` (`ui/map.basemap.tsx`): MapLibre GL core canvas.
- `MapShell` (`ui/map.tsx`): Composite map layout container.
- `MapOverlay` (`ui/map.overlay.tsx`): Floating controls container (zoom, style picker, search, coordinates, draw controls).
- `MapCoordinates` (`ui/map.coordinates.tsx`): Bottom-bar mouse coordinates and projection pill.
