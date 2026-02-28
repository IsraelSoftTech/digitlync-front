import React, { useEffect, useState, useRef } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { api } from '../api';
import './LandingMap.css';

const DEFAULT_LAT = 4.15; // Cameroon center
const DEFAULT_LNG = 9.24;

function LandingMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await api.getPublicLocations();
      if (!cancelled) {
        const list = data?.locations ?? [];
        setLocations(list.filter((l) => l.gps_lat != null && l.gps_lng != null));
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (loading || !mapRef.current) return;

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
        script.onload = renderMap;
        document.head.appendChild(script);
      } else {
        renderMap();
      }
    };

    const renderMap = () => {
      const L = window.L;
      if (!L || mapInstanceRef.current) return;

      const map = L.map(mapRef.current).setView([DEFAULT_LAT, DEFAULT_LNG], 7);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);
      mapInstanceRef.current = map;

      locations.forEach((loc) => {
        const lat = parseFloat(loc.gps_lat);
        const lng = parseFloat(loc.gps_lng);
        if (isNaN(lat) || isNaN(lng)) return;
        const marker = L.marker([lat, lng])
          .addTo(map)
          .bindPopup(`<strong>${loc.full_name || 'Farm'}</strong><br/>${loc.village || ''}`);
        markersRef.current.push(marker);
      });

      if (locations.length > 0) {
        const bounds = L.latLngBounds(locations.map((l) => [parseFloat(l.gps_lat), parseFloat(l.gps_lng)]));
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
      }
    };

    initMap();
    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading, locations]);

  const handleFocusLocation = (loc) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const lat = parseFloat(loc.gps_lat);
    const lng = parseFloat(loc.gps_lng);
    if (isNaN(lat) || isNaN(lng)) return;
    map.panTo([lat, lng], { animate: true, duration: 0.5 });
    map.setZoom(Math.max(map.getZoom(), 14));
    const idx = locations.findIndex((l) => l.id === loc.id);
    if (idx >= 0 && markersRef.current[idx]) {
      markersRef.current[idx].openPopup();
    }
  };

  if (loading) {
    return (
      <div className="landing-map landing-map-loading">
        <div className="landing-map-placeholder">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="landing-map">
      <div ref={mapRef} className="landing-map-container" />
      {locations.length === 0 && (
        <p className="landing-map-empty">
          No farm locations with GPS yet. Add farmers with coordinates in the admin dashboard to see them here.
        </p>
      )}
      {locations.length > 0 && (
        <div className="landing-map-legend-wrap">
          <p className="landing-map-legend">{locations.length} farm{locations.length !== 1 ? 's' : ''} on map</p>
          <ul className="landing-map-farm-list">
            {locations.map((loc) => (
              <li key={loc.id} onClick={() => handleFocusLocation(loc)}>
                <button
                  type="button"
                  className="landing-map-loc-btn"
                  onClick={(e) => { e.stopPropagation(); handleFocusLocation(loc); }}
                  aria-label={`View ${loc.full_name || 'Farm'} on map`}
                  title="View on map"
                >
                  <FaMapMarkerAlt />
                </button>
                <span>{loc.full_name || 'Farm'} — {loc.village || ''}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LandingMap;
