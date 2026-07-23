// src/features/map/hooks/use-geolocation.ts

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";

interface UseGeolocationResult {
  isActive: boolean;
  isLocating: boolean;
  locationError: string | null;
  toggle: () => void;
}

const GEOLOCATION_FLY_TO_ZOOM = 14;

/**
 * Toggleable "my location" feature. Turning it on requests the browser's geolocation,
 * shows a loading state while waiting, then on success flies the map there and drops
 * a pin marker. Turning it off removes the pin and resets state back to inactive.
 */
export const useGeolocation = (
  map: maplibregl.Map | null,
): UseGeolocationResult => {
  const [isActive, setIsActive] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const removeMarker = () => {
    markerRef.current?.remove();
    markerRef.current = null;
  };

  const turnOff = () => {
    removeMarker();
    setIsActive(false);
  };

  const turnOn = () => {
    if (!map) return;

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      // TODO: call toast.error("Geolocation is not supported by this browser")
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;

        removeMarker();
        markerRef.current = new maplibregl.Marker({ color: "#3b82f6" })
          .setLngLat([longitude, latitude])
          .addTo(map);

        map.flyTo({
          center: [longitude, latitude],
          zoom: GEOLOCATION_FLY_TO_ZOOM,
        });

        setIsLocating(false);
        setIsActive(true);
      },
      (error) => {
        setIsLocating(false);
        setLocationError(error.message);
        // TODO: call toast.error(error.message)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const toggle = () => {
    if (isLocating) return; // ignore toggle spam while a request is already in flight

    if (isActive) {
      turnOff();
    } else {
      turnOn();
    }
  };

  // Make sure the marker doesn't leak on unmount if it's still active.
  useEffect(() => {
    return () => {
      markerRef.current?.remove();
    };
  }, []);

  return { isActive, isLocating, locationError, toggle };
};
