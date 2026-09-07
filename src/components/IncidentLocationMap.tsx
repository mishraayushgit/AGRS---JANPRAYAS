import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import {
  MapPin,
  Navigation,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

// Fix standard Leaflet default icon paths in bundler environments
const defaultMarkerIcon = L.divIcon({
  className: "custom-incident-pin",
  html: `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
    ">
      <div style="
        position: absolute;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: rgba(220, 38, 38, 0.25);
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #dc2626;
        border: 2.5px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
        font-weight: bold;
      ">
        📍
      </div>
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -18],
});

interface IncidentLocationMapProps {
  initialLat?: number;
  initialLng?: number;
  initialLocationName?: string;
  initialWard?: string;
  onLocationChange?: (lat: number, lng: number, address: string, ward: string) => void;
  readOnly?: boolean;
}

export const IncidentLocationMap: React.FC<IncidentLocationMapProps> = ({
  initialLat = 28.6139,
  initialLng = 77.209,
  initialLocationName = "Sector 18 Market, Main Transformer Junction",
  initialWard = "Ward 07",
  onLocationChange,
  readOnly = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [lat, setLat] = useState<number>(initialLat);
  const [lng, setLng] = useState<number>(initialLng);
  const [address, setAddress] = useState<string>(initialLocationName);
  const [ward, setWard] = useState<string>(initialWard);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "requesting" | "success" | "denied" | "error">("idle");
  const [gpsMessage, setGpsMessage] = useState<string>("");

  // Sync props if changed from parent
  useEffect(() => {
    setLat(initialLat);
    setLng(initialLng);
    setAddress(initialLocationName);
    setWard(initialWard);
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([initialLat, initialLng], mapInstanceRef.current.getZoom() || 15);
      markerRef.current.setLatLng([initialLat, initialLng]);
    }
  }, [initialLat, initialLng, initialLocationName, initialWard]);

  // Initialize and update Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: true,
      });

      // CartoDB / OSM tiles
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([lat, lng], {
        icon: defaultMarkerIcon,
        draggable: !readOnly,
      }).addTo(map);

      marker.bindPopup(
        `<div style="font-family: sans-serif; font-size: 12px; padding: 2px;">
          <strong>Incident Location</strong><br/>
          <span>${address}</span><br/>
          <small style="color: #64748b;">${lat.toFixed(5)}, ${lng.toFixed(5)}</small>
        </div>`
      );

      if (!readOnly) {
        marker.on("dragend", (e) => {
          const newPos = e.target.getLatLng();
          updateCoordinates(newPos.lat, newPos.lng, true);
        });

        map.on("click", (e: L.LeafletMouseEvent) => {
          marker.setLatLng(e.latlng);
          updateCoordinates(e.latlng.lat, e.latlng.lng, true);
        });
      }

      mapInstanceRef.current = map;
      markerRef.current = marker;
    } else {
      mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom() || 15);
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
    }

    // Invalidate size after container render
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [lat, lng, readOnly]);

  // Clean up map on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Reverse geocoding helper (simulated + OpenStreetMap Nominatim with safe fallback)
  const updateCoordinates = async (newLat: number, newLng: number, reverseGeocode = true) => {
    setLat(newLat);
    setLng(newLng);

    if (reverseGeocode) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLng}&zoom=18&addressdetails=1`,
          { headers: { "Accept-Language": "en" } }
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.display_name) {
            const shortName = data.display_name.split(",").slice(0, 3).join(", ").trim();
            const detectedWard = data.address?.suburb || data.address?.neighbourhood || ward;
            setAddress(shortName);
            setWard(detectedWard);
            onLocationChange?.(newLat, newLng, shortName, detectedWard);
            return;
          }
        }
      } catch {
        // Silent fallback
      }

      // Fallback address string
      const defaultName = `Site Coord [${newLat.toFixed(4)}, ${newLng.toFixed(4)}]`;
      setAddress(defaultName);
      onLocationChange?.(newLat, newLng, defaultName, ward);
    } else {
      onLocationChange?.(newLat, newLng, address, ward);
    }
  };

  // Browser Geolocation Permission & Detection with resilient fallbacks
  const handleDetectGPS = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGpsStatus("error");
      setGpsMessage("Geolocation not supported. Click on map or choose landmark below.");
      return;
    }

    setGpsStatus("requesting");
    setGpsMessage("Requesting GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setGpsStatus("success");
        setGpsMessage(`Location locked (Accuracy: ±${Math.round(position.coords.accuracy || 15)}m)`);
        
        setLat(userLat);
        setLng(userLng);
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([userLat, userLng], 16);
          markerRef.current.setLatLng([userLat, userLng]);
        }
        updateCoordinates(userLat, userLng, true);
      },
      () => {
        setGpsStatus("denied");
        setGpsMessage("GPS permission not granted. You can click on the map to pin location.");
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 30000,
      }
    );
  };

  // Preset quick location selector
  const setPresetLocation = (pLat: number, pLng: number, pAddr: string, pWard: string) => {
    setLat(pLat);
    setLng(pLng);
    setAddress(pAddr);
    setWard(pWard);
    setGpsStatus("success");
    setGpsMessage(`Set to ${pAddr}`);
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([pLat, pLng], 16);
      markerRef.current.setLatLng([pLat, pLng]);
    }
    onLocationChange?.(pLat, pLng, pAddr, pWard);
  };

  return (
    <div className="space-y-3 w-full">
      {/* Top Header: Geolocation & Map Title */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800 uppercase">
          <MapPin className="w-4 h-4 text-red-600" />
          <span>INCIDENT GEO-TAGGING &amp; MAP LOCATION</span>
        </div>

        {!readOnly && (
          <button
            type="button"
            onClick={handleDetectGPS}
            disabled={gpsStatus === "requesting"}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              gpsStatus === "requesting"
                ? "bg-amber-100 text-amber-800 border border-amber-300"
                : gpsStatus === "success"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-teal-700 hover:bg-teal-800 text-white"
            }`}
          >
            {gpsStatus === "requesting" ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>LOCATING...</span>
              </>
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5" />
                <span>DETECT CURRENT GPS</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* GPS Feedback Notice */}
      {gpsMessage && (
        <div
          className={`p-2 rounded-lg text-xs font-mono flex items-center gap-2 ${
            gpsStatus === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : gpsStatus === "denied"
              ? "bg-rose-50 text-rose-800 border border-rose-200"
              : "bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          {gpsStatus === "success" ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          )}
          <span className="truncate">{gpsMessage}</span>
        </div>
      )}

      {/* Map Container - Full Width */}
      <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-inner bg-slate-100 w-full">
        <div
          ref={mapContainerRef}
          className="w-full h-64 sm:h-72 z-0"
          style={{ minHeight: "260px" }}
        />

        {/* Floating Info Overlay on Map */}
        <div className="absolute bottom-2 left-2 right-2 z-[400] bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-200 shadow-md flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0"></div>
            <div className="truncate">
              <span className="font-bold text-slate-900">{address}</span>
              <span className="text-slate-500 font-mono ml-2">({ward})</span>
            </div>
          </div>
          <div className="text-[11px] font-mono text-slate-500 shrink-0 ml-2 hidden sm:block">
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </div>
        </div>

        {/* Instruction tooltip */}
        {!readOnly && (
          <div className="absolute top-2 left-2 z-[400] bg-slate-900/80 text-white text-[10px] font-mono px-2 py-1 rounded shadow-xs">
            Click or drag pin to adjust incident location
          </div>
        )}
      </div>

      {/* Editable Coordinates & Address Bar */}
      {!readOnly && (
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1">
                Location / Landmark Name
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  onLocationChange?.(lat, lng, e.target.value, ward);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-teal-600 bg-white"
                placeholder="e.g. Near Community Well, Sector 18"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase block mb-1">
                Municipal Ward / Zone
              </label>
              <input
                type="text"
                value={ward}
                onChange={(e) => {
                  setWard(e.target.value);
                  onLocationChange?.(lat, lng, address, e.target.value);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-teal-600 bg-white"
                placeholder="e.g. Ward 07 / Block 04"
              />
            </div>
          </div>

          {/* Quick Preset Location Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-mono">
            <span className="text-slate-400 shrink-0 font-bold">Presets:</span>
            <button
              type="button"
              onClick={() => setPresetLocation(28.6139, 77.2090, "Connaught Place Hub, Central Zone", "Ward 01")}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 border border-slate-200 shrink-0 cursor-pointer"
            >
              📍 Central Zone
            </button>
            <button
              type="button"
              onClick={() => setPresetLocation(28.5672, 77.3211, "Sector 18 Market, Main Junction", "Ward 07")}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 border border-slate-200 shrink-0 cursor-pointer"
            >
              📍 Sector 18 (Ward 07)
            </button>
            <button
              type="button"
              onClick={() => setPresetLocation(26.8467, 80.9462, "Village Sujanpur Well Perimeter", "Block 04")}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 border border-slate-200 shrink-0 cursor-pointer"
            >
              📍 Sujanpur (Block 04)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
