import React, { useEffect, useState, useRef, useMemo } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { api } from '../api';
import './LandingMap.css';

const DEFAULT_LAT = 4.15;
const DEFAULT_LNG = 9.24;

function parseCoord(val) {
  if (val == null || val === '') return NaN;
  const n = typeof val === 'number' ? val : parseFloat(String(val).trim());
  return Number.isFinite(n) ? n : NaN;
}

function isMappable(loc) {
  const lat = parseCoord(loc?.gps_lat);
  const lng = parseCoord(loc?.gps_lng);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return false;
  if (lat === 0 && lng === 0) return false;
  return true;
}

/** Nudge overlapping pins so provider (blue) is not hidden under farmer (green). */
function offsetOverlappingCoords(lat, lng, registry) {
  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  const count = registry.get(key) || 0;
  registry.set(key, count + 1);
  if (count === 0) return [lat, lng];
  const d = 0.012 * count;
  const angle = count * 1.25;
  return [lat + d * Math.cos(angle), lng + d * Math.sin(angle)];
}

function LandingMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersByIdRef = useRef({});
  const locationsRef = useRef([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  locationsRef.current = locations;

  const farmerLocations = useMemo(
    () => locations.filter((l) => l.type === 'farmer' || l.type === 'plot'),
    [locations]
  );
  const providerLocations = useMemo(
    () => locations.filter((l) => l.type === 'provider'),
    [locations]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await api.getPublicLocations();
      if (!cancelled) {
        const list = (data?.locations ?? []).filter(isMappable);
        setLocations(list);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (loading || !mapRef.current) return;

    const renderMarkers = (map, L) => {
      const points = locationsRef.current.filter(isMappable);
      Object.values(markersByIdRef.current).forEach((m) => m.remove());
      markersByIdRef.current = {};

      const overlapRegistry = new Map();
      const bounds = [];
      const sorted = [...points].sort((a, b) => {
        const rank = (t) => (t === 'provider' ? 1 : 0);
        return rank(a.type) - rank(b.type);
      });

      sorted.forEach((loc) => {
        const lat = parseCoord(loc.gps_lat);
        const lng = parseCoord(loc.gps_lng);
        if (Number.isNaN(lat) || Number.isNaN(lng)) return;

        const isProvider = loc.type === 'provider';
        const [plotLat, plotLng] = offsetOverlappingCoords(lat, lng, overlapRegistry);
        const roleLabel = isProvider ? 'Service provider' : loc.type === 'plot' ? 'Farm plot' : 'Farmer';
        const subtitle = isProvider
          ? (loc.services_offered || '').replace(/</g, '&lt;')
          : (loc.village || '').replace(/</g, '&lt;');
        const extra = loc.crop_type && !isProvider
          ? `<br/>Crop: ${String(loc.crop_type).replace(/</g, '&lt;')}`
          : '';

        const marker = L.circleMarker([plotLat, plotLng], {
          radius: isProvider ? 10 : 9,
          fillColor: isProvider ? '#3b82f6' : '#22c55e',
          color: isProvider ? '#1d4ed8' : '#15803d',
          weight: 2.5,
          fillOpacity: 0.95,
        })
          .addTo(map)
          .bindPopup(
            `<strong>${(loc.full_name || roleLabel).replace(/</g, '&lt;')}</strong><br/>` +
              `<span style="color:#666;font-size:12px">${roleLabel}</span><br/>` +
              `${subtitle}${extra}`
          );

        markersByIdRef.current[loc.id] = marker;
        bounds.push([plotLat, plotLng]);
      });

      points.filter((l) => l.type === 'provider').forEach((loc) => {
        const m = markersByIdRef.current[loc.id];
        if (m && typeof m.bringToFront === 'function') m.bringToFront();
      });

      if (bounds.length > 0) {
        const bb = L.latLngBounds(bounds);
        const ne = bb.getNorthEast();
        const sw = bb.getSouthWest();
        const spreadM = ne.distanceTo(sw);
        const fitOpts = { padding: [48, 48] };
        if (spreadM > 350000) fitOpts.maxZoom = 5;
        else if (spreadM > 120000) fitOpts.maxZoom = 7;
        else fitOpts.maxZoom = 12;
        map.fitBounds(bb, fitOpts);
        requestAnimationFrame(() => map.invalidateSize());
      }
    };

    const initMap = () => {
      if (typeof window.L === 'undefined') {
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.crossOrigin = '';
        script.onload = () => {
          if (!mapInstanceRef.current && mapRef.current) {
            const L = window.L;
            const map = L.map(mapRef.current).setView([DEFAULT_LAT, DEFAULT_LNG], 7);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors',
            }).addTo(map);
            mapInstanceRef.current = map;
          }
          if (mapInstanceRef.current) renderMarkers(mapInstanceRef.current, window.L);
        };
        document.head.appendChild(script);
      } else {
        if (!mapInstanceRef.current && mapRef.current) {
          const L = window.L;
          const map = L.map(mapRef.current).setView([DEFAULT_LAT, DEFAULT_LNG], 7);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
          }).addTo(map);
          mapInstanceRef.current = map;
        }
        if (mapInstanceRef.current) renderMarkers(mapInstanceRef.current, window.L);
      }
    };

    initMap();

    return () => {
      Object.values(markersByIdRef.current).forEach((m) => m.remove());
      markersByIdRef.current = {};
    };
  }, [loading, locations]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleFocusLocation = (loc) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const lat = parseCoord(loc.gps_lat);
    const lng = parseCoord(loc.gps_lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;
    const marker = markersByIdRef.current[loc.id];
    const center = marker
      ? marker.getLatLng()
      : (window.L ? window.L.latLng(lat, lng) : [lat, lng]);
    map.panTo(center, { animate: true, duration: 0.5 });
    map.setZoom(Math.max(map.getZoom(), 14));
    if (marker) marker.openPopup();
  };

  if (loading) {
    return (
      <div className="landing-map landing-map-loading">
        <div className="landing-map-placeholder">Loading map...</div>
      </div>
    );
  }

  const totalPins = locations.length;

  return (
    <div className="landing-map">
      <div ref={mapRef} className="landing-map-container" />
      <div className="landing-map-legend-wrap">
        <div className="landing-map-legend-keys">
          <span className="landing-map-key landing-map-key-farmer">
            <span className="landing-map-key-dot" aria-hidden /> Farmers &amp; farms ({farmerLocations.length})
          </span>
          <span className="landing-map-key landing-map-key-provider">
            <span className="landing-map-key-dot landing-map-key-dot-provider" aria-hidden /> Providers ({providerLocations.length})
          </span>
        </div>
        {totalPins === 0 ? (
          <p className="landing-map-legend landing-map-empty-msg">
            No GPS locations yet. Registered farmers and providers with map pins will appear here.
          </p>
        ) : (
          <>
            <p className="landing-map-legend">{totalPins} location{totalPins !== 1 ? 's' : ''} on map</p>
            <ul className="landing-map-farm-list">
              {locations.map((loc) => (
                <li
                  key={loc.id}
                  className={loc.type === 'provider' ? 'landing-map-list-item-provider' : 'landing-map-list-item-farmer'}
                  onClick={() => handleFocusLocation(loc)}
                >
                  <button
                    type="button"
                    className={`landing-map-loc-btn ${loc.type === 'provider' ? 'landing-map-loc-btn-provider' : ''}`}
                    onClick={(e) => { e.stopPropagation(); handleFocusLocation(loc); }}
                    aria-label={`View ${loc.full_name || 'location'} on map`}
                    title="View on map"
                  >
                    <FaMapMarkerAlt />
                  </button>
                  <span>
                    {loc.full_name || (loc.type === 'provider' ? 'Provider' : 'Farm')}
                    {loc.type === 'provider' && loc.services_offered
                      ? ` — ${loc.services_offered}`
                      : loc.village
                        ? ` — ${loc.village}`
                        : ''}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default LandingMap;
