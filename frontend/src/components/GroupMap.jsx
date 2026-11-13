import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [39.148, -120.236];
const GEOFENCE_RADIUS = 2414;

const PIN_HTML =
  '<div class="w-8 h-8 rounded-full bg-tertiary text-white flex items-center justify-center shadow-lg ring-4 ring-white animate-bounce"><span class="material-symbols-outlined text-[18px]">location_on</span></div>';

export default function GroupMap({ query, onGeocode }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const firstRunRef = useRef(true);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: DEFAULT_CENTER,
      zoom: 16,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const pinIcon = L.divIcon({
      className: "",
      html: PIN_HTML,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    markerRef.current = L.marker(DEFAULT_CENTER, { icon: pinIcon }).addTo(map);

    circleRef.current = L.circle(DEFAULT_CENTER, {
      radius: GEOFENCE_RADIUS,
      color: "#006c49",
      fillColor: "#10b981",
      fillOpacity: 0.12,
      weight: 2,
      dashArray: "6 6",
    }).addTo(map);

    mapRef.current = map;

    const invalidateTimer = setTimeout(() => map.invalidateSize(), 120);

    return () => {
      clearTimeout(invalidateTimer);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      circleRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (firstRunRef.current) {
      firstRunRef.current = false;
      return;
    }
    if (!query || !mapRef.current) return;
    const q = query.trim();
    if (q.length < 4) return;

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
          { signal: controller.signal, headers: { Accept: "application/json" } }
        );
        const data = await res.json();
        if (!data || data.length === 0) return;
        const lat = Number(data[0].lat);
        const lon = Number(data[0].lon);
        if (Number.isNaN(lat) || Number.isNaN(lon)) return;
        const map = mapRef.current;
        if (!map) return;
        map.flyTo([lat, lon], 16, { duration: 0.8 });
        markerRef.current?.setLatLng([lat, lon]);
        circleRef.current?.setLatLng([lat, lon]);
        if (onGeocode) onGeocode({ lat, lon });
      } catch {
        /* geocode failed — keep current view */
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, onGeocode]);

  return <div ref={containerRef} className="w-full h-44" />;
}