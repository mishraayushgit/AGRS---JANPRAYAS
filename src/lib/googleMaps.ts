import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

// Provisioned Google Maps API Key
export const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyD2_vWdHoeHeBlunmveZiJVIcWEfROI-sw";

// Mandatory Solution Attribution ID per Google Maps Platform Skill guidelines
export const GMP_ATTRIBUTION_ID = "gmp_git_agentskills_v1";

let mapsInitialized = false;

export interface GoogleMapsLibraries {
  maps: google.maps.MapsLibrary;
  marker: google.maps.MarkerLibrary;
  geocoding: google.maps.GeocodingLibrary;
  places: google.maps.PlacesLibrary;
  google: typeof google;
}

let cachedLibraries: GoogleMapsLibraries | null = null;

/**
 * Functional Google Maps API Loader that safely retrieves modular libraries
 */
export async function loadGoogleMapsLibraries(): Promise<GoogleMapsLibraries> {
  if (typeof window === "undefined") {
    throw new Error("Google Maps can only be loaded in a browser environment");
  }

  if (cachedLibraries) {
    return cachedLibraries;
  }

  if (!mapsInitialized) {
    setOptions({
      key: GOOGLE_MAPS_API_KEY,
      v: "weekly",
    });
    mapsInitialized = true;
  }

  const [maps, marker, geocoding, places] = await Promise.all([
    importLibrary("maps") as Promise<google.maps.MapsLibrary>,
    importLibrary("marker") as Promise<google.maps.MarkerLibrary>,
    importLibrary("geocoding") as Promise<google.maps.GeocodingLibrary>,
    importLibrary("places") as Promise<google.maps.PlacesLibrary>,
  ]);

  cachedLibraries = {
    maps,
    marker,
    geocoding,
    places,
    google: window.google,
  };

  return cachedLibraries;
}

/**
 * Legacy loader compatibility
 */
export async function loadGoogleMaps(): Promise<typeof google> {
  const { google } = await loadGoogleMapsLibraries();
  return google;
}
