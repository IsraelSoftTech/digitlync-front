import React, { useEffect, useState, useRef } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { api } from '../../api';
import './FarmMap.css';

// Default center: Cameroon (Buea region)
const DEFAULT_LAT = 4.15;
const DEFAULT_LNG = 9.24;

function FarmMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.getFarmers();
      const list = data?.farmers ?? [];
      setFarmers(list.filter((f) => f.gps_lat != null && f.gps_lng != null));
      setError('');
      setLoading(false);
    })();
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

      const map = L.map(mapRef.current).setView([DEFAULT_LAT, DEFAULT_LNG], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);
      mapInstanceRef.current = map;

      farmers.forEach((f) => {
        const lat = parseFloat(f.gps_lat);
        const lng = parseFloat(f.gps_lng);
        if (isNaN(lat) || isNaN(lng)) return;
        const marker = L.marker([lat, lng])
          .addTo(map)
          .bindPopup(`<strong>${f.full_name}</strong><br/>${f.village || ''}<br/>${f.phone || ''}`);
        markersRef.current.push(marker);
      });

      const validCoords = farmers
        .map((f) => [parseFloat(f.gps_lat), parseFloat(f.gps_lng)])
        .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));
      if (validCoords.length > 0) {
        map.fitBounds(L.latLngBounds(validCoords), { padding: [30, 30], maxZoom: 14 });
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
  }, [loading, farmers]);

  const handleFocusFarmer = (farmer) => {
    setSelectedFarmer(farmer);
    const map = mapInstanceRef.current;
    if (!map) return;
    const lat = parseFloat(farmer.gps_lat);
    const lng = parseFloat(farmer.gps_lng);
    if (isNaN(lat) || isNaN(lng)) return;
    map.panTo([lat, lng], { animate: true, duration: 0.5 });
    map.setZoom(Math.max(map.getZoom(), 14));
    const idx = farmers.findIndex((f) => f.id === farmer.id);
    if (idx >= 0 && markersRef.current[idx]) {
      markersRef.current[idx].openPopup();
    }
  };

  if (loading) return <div className="farm-map-loading">Loading map...</div>;
  if (error) return <div className="farm-map-error">{error}</div>;

  const farmersWithGps = farmers.filter((f) => f.gps_lat != null && f.gps_lng != null);

  return (
    <div className="farm-map">
      <div className="farm-map-header">
        <h2 className="farm-map-title">Farm Map</h2>
        <p className="farm-map-subtitle">
          {farmersWithGps.length} farm{farmersWithGps.length !== 1 ? 's' : ''} with GPS coordinates
        </p>
      </div>
      <div ref={mapRef} className="farm-map-container" />
      {farmersWithGps.length === 0 && (
        <p className="farm-map-empty">No farms with GPS coordinates. Add farmers with lat/lng to see them on the map.</p>
      )}
      {farmersWithGps.length > 0 && (
        <div className="farm-map-legend">
          <h3>Farms</h3>
          <ul>
            {farmersWithGps.map((f) => (
              <li
                key={f.id}
                onClick={() => handleFocusFarmer(f)}
                className={selectedFarmer?.id === f.id ? 'selected' : ''}
              >
                <button
                  type="button"
                  className="farm-map-loc-btn"
                  onClick={(e) => { e.stopPropagation(); handleFocusFarmer(f); }}
                  aria-label={`View ${f.full_name} on map`}
                  title="View on map"
                >
                  <FaMapMarkerAlt />
                </button>
                <span>{f.full_name} — {f.village || 'No village'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FarmMap;
