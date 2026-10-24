import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  MapPin,
  Navigation,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Crosshair,
  Flame,
  Sliders,
  Radio,
  Layers,
  Sparkles,
  Info,
  Lock,
  Unlock,
} from "lucide-react";
import { loadGoogleMapsLibraries, GMP_ATTRIBUTION_ID } from "../lib/googleMaps";
import { useGrievance } from "../store/GrievanceContext";
import { GrievanceRecord } from "../types";

interface IncidentLocationMapProps {
  initialLat?: number;
  initialLng?: number;
  initialLocationName?: string;
  initialWard?: string;
  onLocationChange?: (lat: number, lng: number, address: string, ward: string) => void;
  readOnly?: boolean;
  grievancesList?: GrievanceRecord[];
}

const PRESET_LOCATIONS = [
  {
    name: "Sector 18 Market, Main Transformer Junction",
    ward: "Ward 07",
    lat: 28.5708,
    lng: 77.3271,
    tag: "Power Grid",
  },
  {
    name: "Connaught Place Radial Road 4, New Delhi",
    ward: "Ward 01",
    lat: 28.6315,
    lng: 77.2167,
    tag: "Civic Center",
  },
  {
    name: "Hazratganj Main Crossway, Lucknow",
    ward: "Ward 12",
    lat: 26.852,
    lng: 80.946,
    tag: "Urban PWD",
  },
  {
    name: "Indiranagar 100ft Road Canal Sump, Bengaluru",
    ward: "Ward 24",
    lat: 12.9784,
    lng: 77.6408,
    tag: "Water Supply",
  },
];

interface HeatmapPoint {
  lat: number;
  lng: number;
  weight: number;
  urgency: number;
  title: string;
  docket: string;
  dept: string;
  sla: string;
  ward: string;
}

export const IncidentLocationMap: React.FC<IncidentLocationMapProps> = ({
  initialLat = 28.6139,
  initialLng = 77.209,
  initialLocationName = "Sector 18 Market, Main Transformer Junction",
  initialWard = "Ward 07",
  onLocationChange,
  readOnly = false,
  grievancesList,
}) => {
  const { grievances: contextGrievances } = useGrievance();
  const grievances = grievancesList || contextGrievances || [];

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerInstanceRef = useRef<google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const overlayRef = useRef<any | null>(null);
  const circlesRef = useRef<google.maps.Circle[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const watchPositionIdRef = useRef<number | null>(null);

  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const [lat, setLat] = useState<number>(initialLat);
  const [lng, setLng] = useState<number>(initialLng);
  const [address, setAddress] = useState<string>(initialLocationName);
  const [ward, setWard] = useState<string>(initialWard);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isRealtimeTracking, setIsRealtimeTracking] = useState<boolean>(false);

  // Heatmap Controls State
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [heatmapRadius, setHeatmapRadius] = useState<number>(36);
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.85);
  const [weightMode, setWeightMode] = useState<"urgency" | "density">("urgency");
  const [showHeatmapControls, setShowHeatmapControls] = useState<boolean>(false);

  const [gpsStatus, setGpsStatus] = useState<"idle" | "requesting" | "success" | "denied" | "error">("idle");
  const [gpsMessage, setGpsMessage] = useState<string>("");
  const [isLocationLocked, setIsLocationLocked] = useState<boolean>(false);
  const isLockedRef = useRef<boolean>(false);
  isLockedRef.current = isLocationLocked;

  const isInternalUpdateRef = useRef<boolean>(false);
  const onLocationChangeRef = useRef(onLocationChange);
  onLocationChangeRef.current = onLocationChange;

  const prevPropsRef = useRef({
    lat: initialLat,
    lng: initialLng,
    locationName: initialLocationName,
    ward: initialWard,
  });

  // Only sync props if the parent EXTERNALLY changed them (e.g. user selected another case from queue)
  // This completely prevents the 1-second clock timer in OperationsPage from resetting newly detected addresses!
  useEffect(() => {
    const prev = prevPropsRef.current;
    const propChanged =
      prev.lat !== initialLat ||
      prev.lng !== initialLng ||
      prev.locationName !== initialLocationName ||
      prev.ward !== initialWard;

    prevPropsRef.current = {
      lat: initialLat,
      lng: initialLng,
      locationName: initialLocationName,
      ward: initialWard,
    };

    if (propChanged && !isInternalUpdateRef.current) {
      setLat(initialLat);
      setLng(initialLng);
      setAddress(initialLocationName);
      setWard(initialWard);

      if (mapInstanceRef.current && markerInstanceRef.current) {
        const pos = { lat: initialLat, lng: initialLng };
        mapInstanceRef.current.panTo(pos);
        markerInstanceRef.current.setPosition(pos);
      }
    }
    isInternalUpdateRef.current = false;
  }, [initialLat, initialLng, initialLocationName, initialWard]);

  // Robust Reverse Geocode: queries backend same-origin endpoint first (no CORS, uses Google API key & Nominatim fallback)
  const reverseGeocode = useCallback(
    async (targetLat: number, targetLng: number) => {
      setGpsStatus("requesting");
      setGpsMessage("Resolving location address & telemetry...");

      // 1. Same-Origin Backend Reverse Geocoding (Google Maps API + Nominatim fallback)
      try {
        const res = await fetch(`/api/v1/reverse-geocode?lat=${targetLat}&lng=${targetLng}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.address) {
            const cleanAddr = data.address;
            const detectedWard = data.ward || "Ward 07";

            setAddress(cleanAddr);
            setWard(detectedWard);
            setGpsStatus("success");
            setGpsMessage(`Location: ${cleanAddr.slice(0, 45)}...`);
            isInternalUpdateRef.current = true;
            onLocationChangeRef.current?.(targetLat, targetLng, cleanAddr, detectedWard);
            return;
          }
        }
      } catch (e) {
        console.warn("Backend reverse geocode error:", e);
      }

      // 2. Client Google Geocoder fallback (clean, without unsupported properties)
      if (geocoderRef.current) {
        try {
          geocoderRef.current.geocode(
            { location: { lat: targetLat, lng: targetLng } },
            (results, status) => {
              if (status === "OK" && results && results[0]) {
                const formatted = results[0].formatted_address;
                let detectedWard = "Ward 07";

                for (const c of results[0].address_components || []) {
                  if (c.types.includes("sublocality") || c.types.includes("neighborhood")) {
                    detectedWard = `Ward ${c.short_name || c.long_name}`;
                    break;
                  }
                }

                setAddress(formatted);
                setWard(detectedWard);
                setGpsStatus("success");
                setGpsMessage(`Location: ${formatted.slice(0, 45)}...`);
                isInternalUpdateRef.current = true;
                onLocationChangeRef.current?.(targetLat, targetLng, formatted, detectedWard);
              } else {
                const fallbackAddr = `Location Pin [${targetLat.toFixed(5)}, ${targetLng.toFixed(5)}]`;
                setAddress(fallbackAddr);
                setGpsStatus("success");
                setGpsMessage(`Coordinates: ${targetLat.toFixed(5)}, ${targetLng.toFixed(5)}`);
                isInternalUpdateRef.current = true;
                onLocationChangeRef.current?.(targetLat, targetLng, fallbackAddr, "Ward 07");
              }
            }
          );
          return;
        } catch (clientErr) {
          console.warn("Client geocode error:", clientErr);
        }
      }

      // 3. Fallback coordinates display
      const fallbackAddr = `Location Pin [${targetLat.toFixed(5)}, ${targetLng.toFixed(5)}]`;
      setAddress(fallbackAddr);
      setGpsStatus("success");
      setGpsMessage(`Coordinates: ${targetLat.toFixed(5)}, ${targetLng.toFixed(5)}`);
      isInternalUpdateRef.current = true;
      onLocationChangeRef.current?.(targetLat, targetLng, fallbackAddr, "Ward 07");
    },
    []
  );

  const reverseGeocodeRef = useRef(reverseGeocode);
  reverseGeocodeRef.current = reverseGeocode;

  // Compute Grievance Heatmap Points
  const heatmapPoints = useMemo<HeatmapPoint[]>(() => {
    const list: HeatmapPoint[] = [];

    grievances.forEach((g) => {
      const itemLat = g.latitude || 28.5708;
      const itemLng = g.longitude || 77.3271;
      const urgency = g.urgency_score || 50;

      let calculatedWeight = 3;
      if (weightMode === "urgency") {
        calculatedWeight = Math.max(1, Math.min(10, urgency / 10));
      } else {
        calculatedWeight = 5;
      }

      list.push({
        lat: itemLat,
        lng: itemLng,
        weight: calculatedWeight,
        urgency,
        title: g.title || g.extracted_text || "Civic Incident",
        docket: g.reference_id || g.id,
        dept: g.assigned_department || "Municipal Administration",
        sla: g.sla_window || "< 24 HR",
        ward: g.ward || "Ward 07",
      });

      // Localized dispersal for high severity
      if (urgency >= 80) {
        list.push(
          {
            lat: itemLat + 0.0006,
            lng: itemLng + 0.0005,
            weight: calculatedWeight * 0.75,
            urgency,
            title: g.title || g.extracted_text || "Civic Incident",
            docket: g.reference_id || g.id,
            dept: g.assigned_department,
            sla: g.sla_window,
            ward: g.ward || "Ward 07",
          },
          {
            lat: itemLat - 0.0005,
            lng: itemLng - 0.0006,
            weight: calculatedWeight * 0.65,
            urgency,
            title: g.title || g.extracted_text || "Civic Incident",
            docket: g.reference_id || g.id,
            dept: g.assigned_department,
            sla: g.sla_window,
            ward: g.ward || "Ward 07",
          }
        );
      }
    });

    return list;
  }, [grievances, weightMode]);

  // Initialize Google Maps instance with safe modular libraries
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      try {
        const { maps, marker: markerLib, geocoding: geocodingLib } = await loadGoogleMapsLibraries();
        if (!isMounted || !mapContainerRef.current) return;

        geocoderRef.current = new geocodingLib.Geocoder();

        const initialPos = { lat, lng };

        const map = new maps.Map(mapContainerRef.current, {
          center: initialPos,
          zoom: 15,
          mapTypeId: maps.MapTypeId.ROADMAP,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: maps.MapTypeControlStyle.DROPDOWN_MENU,
            position: google.maps.ControlPosition.TOP_RIGHT,
          },
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: "greedy",
          ...({ internalUsageAttributionIds: [GMP_ATTRIBUTION_ID] } as any),
        });

        // Incident Location Pin Marker
        const marker = new markerLib.Marker({
          position: initialPos,
          map: map,
          draggable: !readOnly,
          title: "Incident Location Pin",
          animation: google.maps.Animation.DROP,
          icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: "#DC2626",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFFFFF",
          },
          ...({ internalUsageAttributionIds: [GMP_ATTRIBUTION_ID] } as any),
        });

        const infoWindow = new maps.InfoWindow({
          content: `
            <div style="font-family: sans-serif; font-size: 12px; padding: 4px; max-width: 220px;">
              <strong style="color: #dc2626; font-size: 13px;">📍 Active Incident Pin</strong>
              <div style="margin-top: 3px; color: #1e293b; font-weight: 500;">${address}</div>
              <div style="margin-top: 2px; font-family: monospace; font-size: 10px; color: #64748b;">${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E</div>
              <div style="margin-top: 4px; padding: 2px 6px; background-color: #f1f5f9; border-radius: 4px; font-size: 10px; color: #475569; display: inline-block;">${ward}</div>
            </div>
          `,
        });
        infoWindowRef.current = infoWindow;

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        if (!readOnly) {
          marker.addListener("dragend", () => {
            if (isLockedRef.current) return;
            const newPos = marker.getPosition();
            if (newPos) {
              const newLat = newPos.lat();
              const newLng = newPos.lng();
              isInternalUpdateRef.current = true;
              setLat(newLat);
              setLng(newLng);
              setAddress("Resolving address...");
              reverseGeocodeRef.current(newLat, newLng);
            }
          });

          map.addListener("click", (e: google.maps.MapMouseEvent) => {
            if (isLockedRef.current) return;
            // Intercept POI bubble so default bubble is silenced
            if ((e as any).placeId) {
              (e as any).stop?.();
            }
            if (e.latLng) {
              const newLat = e.latLng.lat();
              const newLng = e.latLng.lng();
              marker.setPosition(e.latLng);
              isInternalUpdateRef.current = true;
              setLat(newLat);
              setLng(newLng);
              setAddress("Resolving address...");
              reverseGeocodeRef.current(newLat, newLng);
            }
          });
        }

        // Custom High-Performance HTML5 Canvas Heatmap Overlay using OverlayView
        // (Bypasses deprecated visualization.HeatmapLayer while delivering silky thermal blending)
        class ThermalHeatmapOverlay extends maps.OverlayView {
          private canvas: HTMLCanvasElement;
          private ctx: CanvasRenderingContext2D | null = null;
          public points: HeatmapPoint[];
          public radius: number;
          public opacity: number;
          public isVisible: boolean;

          constructor(
            pts: HeatmapPoint[],
            rad: number,
            op: number,
            visible: boolean
          ) {
            super();
            this.points = pts;
            this.radius = rad;
            this.opacity = op;
            this.isVisible = visible;
            this.canvas = document.createElement("canvas");
            this.canvas.style.position = "absolute";
            this.canvas.style.pointerEvents = "none";
            this.canvas.style.top = "0";
            this.canvas.style.left = "0";
          }

          onAdd() {
            const panes = this.getPanes();
            if (panes?.overlayLayer) {
              panes.overlayLayer.appendChild(this.canvas);
            }
            this.ctx = this.canvas.getContext("2d");
          }

          draw() {
            const projection = this.getProjection();
            if (!projection || !this.ctx || !this.isVisible) {
              if (this.ctx) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
              }
              return;
            }

            const currentMap = this.getMap() as google.maps.Map;
            const bounds = currentMap?.getBounds();
            if (!bounds) return;

            const ne = projection.fromLatLngToDivPixel(bounds.getNorthEast());
            const sw = projection.fromLatLngToDivPixel(bounds.getSouthWest());
            if (!ne || !sw) return;

            const width = Math.max(10, Math.round(Math.abs(ne.x - sw.x)));
            const height = Math.max(10, Math.round(Math.abs(sw.y - ne.y)));
            const left = Math.round(Math.min(sw.x, ne.x));
            const top = Math.round(Math.min(ne.y, sw.y));

            this.canvas.width = width;
            this.canvas.height = height;
            this.canvas.style.left = `${left}px`;
            this.canvas.style.top = `${top}px`;
            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;

            const ctx = this.ctx;
            ctx.clearRect(0, 0, width, height);

            // Thermal Radial Gradients
            this.points.forEach((pt) => {
              const pos = projection.fromLatLngToDivPixel(new google.maps.LatLng(pt.lat, pt.lng));
              if (!pos) return;

              const px = pos.x - left;
              const py = pos.y - top;

              const r = Math.max(15, this.radius * (0.8 + (pt.weight / 10) * 0.7));
              const grad = ctx.createRadialGradient(px, py, 0, px, py, r);

              if (pt.urgency >= 85) {
                // Tier 1 Critical: Deep Crimson / Violet Core
                grad.addColorStop(0, `rgba(220, 38, 38, ${0.92 * this.opacity})`);
                grad.addColorStop(0.35, `rgba(239, 68, 68, ${0.75 * this.opacity})`);
                grad.addColorStop(0.65, `rgba(249, 115, 22, ${0.45 * this.opacity})`);
                grad.addColorStop(1, "rgba(239, 68, 68, 0)");
              } else if (pt.urgency >= 70) {
                // Tier 2 High: Vibrant Amber-Orange
                grad.addColorStop(0, `rgba(249, 115, 22, ${0.85 * this.opacity})`);
                grad.addColorStop(0.4, `rgba(234, 179, 8, ${0.65 * this.opacity})`);
                grad.addColorStop(0.7, `rgba(132, 204, 22, ${0.35 * this.opacity})`);
                grad.addColorStop(1, "rgba(249, 115, 22, 0)");
              } else if (pt.urgency >= 50) {
                // Moderate: Yellow to Emerald
                grad.addColorStop(0, `rgba(234, 179, 8, ${0.8 * this.opacity})`);
                grad.addColorStop(0.5, `rgba(34, 197, 94, ${0.5 * this.opacity})`);
                grad.addColorStop(1, "rgba(34, 197, 94, 0)");
              } else {
                // Routine: Cyan to Soft Blue
                grad.addColorStop(0, `rgba(6, 182, 212, ${0.75 * this.opacity})`);
                grad.addColorStop(0.5, `rgba(59, 130, 246, ${0.4 * this.opacity})`);
                grad.addColorStop(1, "rgba(6, 182, 212, 0)");
              }

              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(px, py, r, 0, Math.PI * 2);
              ctx.fill();
            });
          }

          onRemove() {
            if (this.canvas.parentNode) {
              this.canvas.parentNode.removeChild(this.canvas);
            }
          }
        }

        const overlay = new ThermalHeatmapOverlay(
          heatmapPoints,
          heatmapRadius,
          heatmapOpacity,
          showHeatmap
        );
        overlay.setMap(map);
        overlayRef.current = overlay;

        // Interactive Urgency Hotspot Circles with InfoWindow inspection
        const createdCircles: google.maps.Circle[] = [];
        heatmapPoints.forEach((pt) => {
          const isCritical = pt.urgency >= 85;
          const isHigh = pt.urgency >= 70 && pt.urgency < 85;

          const circleColor = isCritical
            ? "#DC2626"
            : isHigh
            ? "#EA580C"
            : pt.urgency >= 50
            ? "#EAB308"
            : "#06B6D4";

          const circle = new maps.Circle({
            strokeColor: circleColor,
            strokeOpacity: 0.8,
            strokeWeight: 1.5,
            fillColor: circleColor,
            fillOpacity: isCritical ? 0.35 : 0.2,
            map: showHeatmap ? map : null,
            center: { lat: pt.lat, lng: pt.lng },
            radius: isCritical ? 250 : 180,
            clickable: true,
            zIndex: isCritical ? 10 : 5,
            ...({ internalUsageAttributionIds: [GMP_ATTRIBUTION_ID] } as any),
          });

          circle.addListener("click", () => {
            const popup = new maps.InfoWindow({
              position: { lat: pt.lat, lng: pt.lng },
              content: `
                <div style="font-family: sans-serif; font-size: 12px; padding: 6px; max-width: 240px;">
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                    <span style="font-family: monospace; font-weight: bold; color: #007A99;">${pt.docket}</span>
                    <span style="background-color: ${isCritical ? "#fef2f2" : "#fffbeb"}; color: ${isCritical ? "#dc2626" : "#b45309"}; border: 1px solid ${isCritical ? "#fecaca" : "#fde68a"}; padding: 1px 6px; border-radius: 9999px; font-weight: bold; font-size: 10px;">
                      ${pt.urgency}/100 ${isCritical ? "CRITICAL" : "HIGH"}
                    </span>
                  </div>
                  <div style="font-weight: 600; color: #1e293b; margin-top: 4px;">${pt.dept}</div>
                  <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${pt.title}</div>
                  <div style="margin-top: 6px; padding-top: 4px; border-top: 1px solid #f1f5f9; font-size: 10px; color: #475569; display: flex; justify-content: space-between;">
                    <span>📍 ${pt.ward}</span>
                    <span style="color: #dc2626; font-weight: bold;">SLA: ${pt.sla}</span>
                  </div>
                </div>
              `,
            });
            popup.open(map);
          });

          createdCircles.push(circle);
        });
        circlesRef.current = createdCircles;

        mapInstanceRef.current = map;
        markerInstanceRef.current = marker;
        setMapLoaded(true);
      } catch (err: any) {
        console.error("Google Maps initialization failed:", err);
        setMapError("Failed to load Google Maps. Please verify connection.");
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (watchPositionIdRef.current !== null && typeof navigator !== "undefined") {
        navigator.geolocation.clearWatch(watchPositionIdRef.current);
        watchPositionIdRef.current = null;
      }
      if (overlayRef.current) {
        overlayRef.current.setMap(null);
      }
      circlesRef.current.forEach((c) => c.setMap(null));
      circlesRef.current = [];
    };
  }, []);

  // Synchronize Heatmap Overlay & Circles when parameters change
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.points = heatmapPoints;
      overlayRef.current.radius = heatmapRadius;
      overlayRef.current.opacity = heatmapOpacity;
      overlayRef.current.isVisible = showHeatmap;
      overlayRef.current.draw();
    }

    if (circlesRef.current && mapInstanceRef.current) {
      circlesRef.current.forEach((circle) => {
        circle.setMap(showHeatmap ? mapInstanceRef.current : null);
      });
    }
  }, [heatmapPoints, heatmapRadius, heatmapOpacity, showHeatmap]);

  // Dynamic update of Pin InfoWindow
  useEffect(() => {
    if (infoWindowRef.current) {
      infoWindowRef.current.setContent(`
        <div style="font-family: sans-serif; font-size: 12px; padding: 4px; max-width: 220px;">
          <strong style="color: #dc2626; font-size: 13px;">📍 Active Incident Pin</strong>
          <div style="margin-top: 3px; color: #1e293b; font-weight: 500;">${address}</div>
          <div style="margin-top: 2px; font-family: monospace; font-size: 10px; color: #64748b;">${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E</div>
          <div style="margin-top: 4px; padding: 2px 6px; background-color: #f1f5f9; border-radius: 4px; font-size: 10px; color: #475569; display: inline-block;">${ward}</div>
        </div>
      `);
    }
  }, [address, lat, lng, ward]);

  // Update marker position on manual state changes
  const updateMapPosition = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);

    if (mapInstanceRef.current && markerInstanceRef.current) {
      const pos = { lat: newLat, lng: newLng };
      mapInstanceRef.current.panTo(pos);
      markerInstanceRef.current.setPosition(pos);
    }
  };

  // Google Maps Search by Keyword / Address
  const handleSearchAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setGpsStatus("requesting");
    setGpsMessage(`Searching "${searchQuery}"...`);

    const applyLocationResult = (foundLat: number, foundLng: number, foundAddr: string, foundWard: string) => {
      isInternalUpdateRef.current = true;
      updateMapPosition(foundLat, foundLng);
      setAddress(foundAddr);
      setWard(foundWard);
      onLocationChange?.(foundLat, foundLng, foundAddr, foundWard);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setZoom(16);
      }
      setGpsStatus("success");
      setGpsMessage(`Found location: ${foundAddr.slice(0, 45)}...`);
    };

    if (geocoderRef.current) {
      geocoderRef.current.geocode(
        { address: searchQuery },
        async (results, status) => {
          if (status === "OK" && results && results[0]) {
            setIsSearching(false);
            const loc = results[0].geometry.location;
            const foundLat = loc.lat();
            const foundLng = loc.lng();
            const foundAddr = results[0].formatted_address;

            let detectedWard = ward;
            const components = results[0].address_components;
            for (const c of components) {
              if (c.types.includes("sublocality") || c.types.includes("neighborhood")) {
                detectedWard = `Ward ${c.short_name || c.long_name}`;
                break;
              }
            }
            applyLocationResult(foundLat, foundLng, foundAddr, detectedWard);
          } else {
            // Fallback to OpenStreetMap Search
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
              if (res.ok) {
                const data = await res.json();
                if (data && data[0]) {
                  setIsSearching(false);
                  const latVal = parseFloat(data[0].lat);
                  const lonVal = parseFloat(data[0].lon);
                  applyLocationResult(latVal, lonVal, data[0].display_name, ward);
                  return;
                }
              }
            } catch (err) {}
            setIsSearching(false);
            setGpsStatus("error");
            setGpsMessage("Address not found on Google Maps. Try adding city name.");
          }
        }
      );
    } else {
      setIsSearching(false);
    }
  };

  // One-time GPS Lock
  const handleDetectGPS = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGpsStatus("error");
      setGpsMessage("Geolocation not supported by device.");
      return;
    }

    setGpsStatus("requesting");
    setGpsMessage("Acquiring high-precision Google Maps GPS lock...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setGpsStatus("success");
        setGpsMessage(`GPS Locked (Precision: ±${Math.round(position.coords.accuracy || 10)}m)`);

        isInternalUpdateRef.current = true;
        updateMapPosition(userLat, userLng);
        reverseGeocodeRef.current(userLat, userLng);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setZoom(17);
        }
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setGpsStatus("denied");
        setGpsMessage("GPS permission denied or unavailable. Click on Google Maps to pinpoint.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 15000,
      }
    );
  };

  // Continuous Real-Time Tracking Toggle
  const toggleRealtimeTracking = () => {
    if (isRealtimeTracking) {
      if (watchPositionIdRef.current !== null && typeof navigator !== "undefined") {
        navigator.geolocation.clearWatch(watchPositionIdRef.current);
        watchPositionIdRef.current = null;
      }
      setIsRealtimeTracking(false);
      setGpsStatus("idle");
      setGpsMessage("Real-time GPS tracking stopped.");
      return;
    }

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGpsStatus("error");
      setGpsMessage("Real-time tracking not supported.");
      return;
    }

    setIsRealtimeTracking(true);
    setGpsStatus("requesting");
    setGpsMessage("Real-time tracking active. Streaming coordinates...");

    watchPositionIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const liveLat = position.coords.latitude;
        const liveLng = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy || 5);

        setGpsStatus("success");
        setGpsMessage(`Streaming Live GPS • ±${accuracy}m accuracy`);
        isInternalUpdateRef.current = true;
        updateMapPosition(liveLat, liveLng);
        reverseGeocodeRef.current(liveLat, liveLng);
      },
      (err) => {
        console.warn("Watch position error:", err);
        setIsRealtimeTracking(false);
        setGpsStatus("denied");
        setGpsMessage("Real-time tracking lost. Please enable location permissions.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      }
    );
  };

  // Jump to the highest urgency hotspot
  const jumpToCriticalHotspot = () => {
    const critical = grievances
      .filter((g) => g.latitude && g.longitude)
      .sort((a, b) => (b.urgency_score || 0) - (a.urgency_score || 0))[0];

    if (critical && critical.latitude && critical.longitude) {
      isInternalUpdateRef.current = true;
      updateMapPosition(critical.latitude, critical.longitude);
      setAddress(critical.location);
      setWard(critical.ward || "Ward 07");
      onLocationChangeRef.current?.(critical.latitude, critical.longitude, critical.location, critical.ward || "Ward 07");
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setZoom(16);
      }
      setGpsStatus("success");
      setGpsMessage(`Centered on Highest Urgency Hotspot: Score ${critical.urgency_score}/100`);
    }
  };

  // Grievance Stats
  const heatmapStats = useMemo(() => {
    const valid = grievances.filter((g) => g.latitude && g.longitude);
    const criticalCount = valid.filter((g) => (g.urgency_score || 0) >= 85).length;
    const avgScore = valid.length
      ? Math.round(valid.reduce((acc, g) => acc + (g.urgency_score || 50), 0) / valid.length)
      : 0;

    return {
      totalMapped: valid.length,
      criticalCount,
      avgScore,
    };
  }, [grievances]);

  return (
    <div className="space-y-3 font-sans">
      
      {/* Top Search, Real-Time GPS & Heatmap Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Google Maps Search Bar */}
        {!readOnly && (
          <form onSubmit={handleSearchAddress} className="flex-1 relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Indian landmark, colony, or sector on Google Maps..."
              className="w-full pl-9 pr-20 py-2 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10 shadow-2xs"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              {isSearching ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Search"}
            </button>
          </form>
        )}

        {/* Heatmap Layer Toggle & Tools */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Heatmap ON/OFF Switch */}
          <button
            type="button"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              showHeatmap
                ? "bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-rose-500/20 shadow-md ring-2 ring-rose-400/40"
                : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
            }`}
            title="Toggle Urgency Heatmap Layer"
          >
            <Flame className={`w-3.5 h-3.5 ${showHeatmap ? "text-amber-200 animate-pulse" : "text-slate-400"}`} />
            <span>Heatmap {showHeatmap ? "ON" : "OFF"}</span>
          </button>

          {/* Heatmap Calibration Settings Button */}
          <button
            type="button"
            onClick={() => setShowHeatmapControls(!showHeatmapControls)}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center transition-all border cursor-pointer ${
              showHeatmapControls
                ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-2xs"
                : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
            }`}
            title="Customize Heatmap Radius & Opacity"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Jump to Critical Hotspot */}
          <button
            type="button"
            onClick={jumpToCriticalHotspot}
            className="hidden sm:flex px-2.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold items-center gap-1.5 transition-all cursor-pointer"
            title="Pan to Highest Urgency Grievance Hotspot"
          >
            <Crosshair className="w-3.5 h-3.5 text-rose-600" />
            <span>Hotspot</span>
          </button>
        </div>
      </div>

      {/* Prominent Live Location Detection & Form Autofill Controller */}
      {!readOnly && (
        <div className="p-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-sm border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <Navigation className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Live Incident Site Telemetry</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  AUTOFILL READY
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate max-w-sm sm:max-w-md mt-0.5" title={address}>
                {address || "Coordinates pinpointed"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* 1. Detect Live GPS Button */}
            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={gpsStatus === "requesting"}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
              title="Detect device GPS & autofill form"
            >
              <Navigation className={`w-3.5 h-3.5 ${gpsStatus === "requesting" ? "animate-spin text-white" : "text-emerald-200"}`} />
              <span>{gpsStatus === "requesting" ? "Detecting Live GPS..." : "Detect My Live Location"}</span>
            </button>

            {/* 2. Lock / Unlock Location Button */}
            <button
              type="button"
              onClick={() => {
                const nextLocked = !isLocationLocked;
                setIsLocationLocked(nextLocked);
                isLockedRef.current = nextLocked;
                if (markerInstanceRef.current) {
                  markerInstanceRef.current.setDraggable(!nextLocked);
                }
                setGpsStatus("success");
                setGpsMessage(
                  nextLocked
                    ? `🔒 Location LOCKED: ${address.slice(0, 45)}...`
                    : "🔓 Location UNLOCKED: Drag pin or click map to reposition."
                );
                isInternalUpdateRef.current = true;
                onLocationChangeRef.current?.(lat, lng, address, ward);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                isLocationLocked
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black"
                  : "bg-white/10 hover:bg-white/15 text-white border-white/20"
              }`}
              title={isLocationLocked ? "Unlock pin repositioning" : "Lock coordinates in form"}
            >
              {isLocationLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-950" />
                  <span>Location Locked</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 text-slate-300" />
                  <span>Lock Location</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Heatmap Advanced Settings Drawer */}
      {showHeatmapControls && (
        <div className="p-3.5 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md space-y-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-slate-100">Grievance Heatmap Calibration</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {heatmapStats.totalMapped} Geo-Tagged Cases · {heatmapStats.criticalCount} Critical
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Kernel Radius:</span>
                <span className="font-mono text-amber-400 font-bold">{heatmapRadius}px</span>
              </div>
              <input
                type="range"
                min="16"
                max="64"
                value={heatmapRadius}
                onChange={(e) => setHeatmapRadius(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Thermal Opacity:</span>
                <span className="font-mono text-amber-400 font-bold">{Math.round(heatmapOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={heatmapOpacity}
                onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <span className="block text-[11px] text-slate-300">Weighting Logic:</span>
              <div className="flex items-center gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setWeightMode("urgency")}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    weightMode === "urgency"
                      ? "bg-rose-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  Urgency-Weighted
                </button>
                <button
                  type="button"
                  onClick={() => setWeightMode("density")}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    weightMode === "density"
                      ? "bg-rose-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  Raw Density
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GPS Status Message Toast */}
      {gpsMessage && (
        <div
          className={`px-3 py-1.5 rounded-xl text-xs flex items-center justify-between gap-2 border transition-all ${
            gpsStatus === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : gpsStatus === "requesting"
              ? "bg-blue-50 text-blue-800 border-blue-200"
              : gpsStatus === "denied" || gpsStatus === "error"
              ? "bg-amber-50 text-amber-800 border-amber-200"
              : "bg-slate-50 text-slate-700 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {gpsStatus === "success" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : gpsStatus === "requesting" ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            )}
            <span className="font-medium text-[11px] sm:text-xs">{gpsMessage}</span>
          </div>

          {isRealtimeTracking && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-600 text-white animate-pulse">
              LIVE GPS ON
            </span>
          )}
        </div>
      )}

      {/* Interactive Google Map Canvas Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
        
        {/* Loading Overlay */}
        {!mapLoaded && !mapError && (
          <div className="absolute inset-0 z-20 bg-slate-100/90 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
            <p className="text-xs font-semibold text-slate-600">
              Initializing Google Maps Engine &amp; Heatmap telemetry...
            </p>
          </div>
        )}

        {/* Error Fallback */}
        {mapError && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{mapError}</span>
          </div>
        )}

        {/* Google Map DOM Element */}
        <div
          ref={mapContainerRef}
          className="w-full h-72 sm:h-80 md:h-96 z-0"
          style={{ minHeight: "280px" }}
        />

        {/* Floating Top-Left Incident Pin Card */}
        <div className="absolute top-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200 max-w-[280px] pointer-events-none">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="truncate">{ward}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-mono font-semibold">
              GOOGLE MAPS
            </span>
          </div>
          <p className="text-[11px] text-slate-600 truncate mt-0.5" title={address}>
            {address}
          </p>
          <p className="text-[10px] font-mono text-slate-400 mt-0.5">
            {lat.toFixed(5)}° N, {lng.toFixed(5)}° E
          </p>
        </div>

        {/* Floating Bottom Heatmap Urgency & Density Color Legend */}
        {showHeatmap && (
          <div className="absolute bottom-2.5 left-2.5 z-10 bg-slate-900/90 backdrop-blur-md text-white px-3 py-2 rounded-xl shadow-lg border border-slate-700 max-w-[340px]">
            <div className="flex items-center justify-between gap-3 text-[11px] font-bold mb-1">
              <span className="flex items-center gap-1 text-amber-400">
                <Flame className="w-3.5 h-3.5" />
                <span>Urgency &amp; Density Heatmap</span>
              </span>
              <span className="font-mono text-[10px] text-slate-300">
                Avg: {heatmapStats.avgScore}/100
              </span>
            </div>

            {/* Color Gradient Spectrum Bar */}
            <div className="w-full h-2 rounded-full overflow-hidden bg-gradient-to-r from-cyan-400 via-green-400 via-yellow-400 via-orange-500 to-rose-600 shadow-inner" />

            {/* Spectrum Labels */}
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-300 mt-1">
              <span className="text-cyan-300">Low (Routine)</span>
              <span className="text-yellow-300">Moderate</span>
              <span className="text-orange-300">High Risk</span>
              <span className="text-rose-400 font-bold">Critical (&ge;85)</span>
            </div>
          </div>
        )}

        {/* Real-time Draggable Pin Hint */}
        {!readOnly && (
          <div className="absolute top-2.5 right-14 z-10 hidden sm:flex bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-medium items-center gap-1.5 pointer-events-none">
            <Crosshair className="w-3 h-3 text-emerald-400" />
            <span>Drag pin or click map to reposition</span>
          </div>
        )}
      </div>

      {/* Quick Indian Landmark Presets */}
      {!readOnly && (
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
            <span>Quick Landmark Pinpoints:</span>
            <span className="text-[10px] font-mono text-slate-400">Instant Telemetry &amp; Ward Routing</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {PRESET_LOCATIONS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  isInternalUpdateRef.current = true;
                  updateMapPosition(preset.lat, preset.lng);
                  setAddress(preset.name);
                  setWard(preset.ward);
                  onLocationChangeRef.current?.(preset.lat, preset.lng, preset.name, preset.ward);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.setZoom(16);
                  }
                  setGpsStatus("success");
                  setGpsMessage(`Loaded ${preset.name}`);
                }}
                className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all hover:border-indigo-300 hover:shadow-2xs cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-600 font-mono">
                    {preset.ward}
                  </span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-500 font-medium">
                    {preset.tag}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-800 line-clamp-1 group-hover:text-indigo-600 mt-0.5">
                  {preset.name.split(",")[0]}
                </p>
                <p className="text-[10px] font-mono text-slate-400">
                  {preset.lat.toFixed(3)}, {preset.lng.toFixed(3)}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mandatory attribution note */}
      <div className="text-[10px] text-slate-400 font-sans flex items-center justify-between pt-0.5">
        <span>Google Maps Platform Telemetry &amp; Geospatial Density</span>
        <span className="font-mono text-[9px] text-slate-500">Google Maps Platform</span>
      </div>

    </div>
  );
};
