import React, { useEffect, useState, useRef } from 'react';
import { FiDownload, FiUpload } from 'react-icons/fi';
import { api } from '../../api';
import './FarmMapIntelligence.css';

const DEFAULT_LAT = 6.3703;
const DEFAULT_LNG = 2.3912;

function FarmMapIntelligence({ onFarmerClick }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [layers, setLayers] = useState({ farms: true, providers: true, coverage: false, heatmap: false });

  useEffect(() => {
    (async () => {
      const { data } = await api.getFarmers();
      setFarmers(data?.farmers ?? []);
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
      } else renderMap();
    };
    const renderMap = () => {
      const L = window.L;
      if (!L || mapInstanceRef.current) return;
      const map = L.map(mapRef.current).setView([DEFAULT_LAT, DEFAULT_LNG], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
      mapInstanceRef.current = map;
      const withGps = farmers.filter((f) => f.gps_lat != null && f.gps_lng != null);
      withGps.forEach((f) => {
        const loc = [parseFloat(f.gps_lat), parseFloat(f.gps_lng)];
        const m = L.marker(loc)
          .addTo(map)
          .bindTooltip(f.full_name || 'Farmer', { permanent: false, direction: 'top' })
          .bindPopup(
            `<div class="farm-map-popup">
              <strong>${(f.full_name || 'Farmer').replace(/</g, '&lt;')}</strong><br/>
              ${(f.district || f.region || f.village || '').replace(/</g, '&lt;')}<br/>
              ${(f.phone || '').replace(/</g, '&lt;')}<br/>
              ${(f.crop_type ? `Crop: ${f.crop_type}` : '').replace(/</g, '&lt;')}
              ${onFarmerClick ? `<br/><button type="button" class="farm-map-view-profile" data-farmer-id="${f.id}">View full profile</button>` : ''}
            </div>`
          );
        if (onFarmerClick) {
          m.on('popupopen', () => {
            const btn = document.querySelector('.farm-map-view-profile');
            if (btn) btn.onclick = () => onFarmerClick(f);
          });
        }
        markersRef.current.push(m);
      });
    };
    initMap();
    return () => {
      markersRef.current.forEach((m) => m.remove?.());
      markersRef.current = [];
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
    };
  }, [loading, farmers, onFarmerClick]);

  const farmersWithGps = farmers.filter((f) => f.gps_lat != null && f.gps_lng != null);

  return (
    <div className="farm-map-intel">
      <header className="farm-map-intel-header">
        <h1 className="farm-map-intel-title">Farm Map</h1>
        <div className="farm-map-intel-actions">
          <button type="button" className="farm-map-intel-btn" title="Bulk farm import">
            <FiUpload /> Import
          </button>
          <button type="button" className="farm-map-intel-btn" title="Export coordinates CSV">
            <FiDownload /> Export
          </button>
        </div>
      </header>

      <div className="farm-map-intel-layers">
        <h3>Map Layers</h3>
        {['farms', 'providers', 'coverage', 'heatmap'].map((key) => (
          <label key={key} className="farm-map-intel-layer-toggle">
            <input type="checkbox" checked={layers[key]} onChange={(e) => setLayers((s) => ({ ...s, [key]: e.target.checked }))} />
            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          </label>
        ))}
      </div>

      <div className="farm-map-intel-tools">
        <span className="farm-map-intel-tool">Detect farm clusters</span>
        <span className="farm-map-intel-tool">Identify underserved zones</span>
        <span className="farm-map-intel-tool">Density analysis</span>
        <span className="farm-map-intel-tool">Manual coordinate correction</span>
      </div>

      {loading ? (
        <div className="farm-map-intel-loading">Loading map...</div>
      ) : (
        <>
          <div ref={mapRef} className="farm-map-intel-container" />
          <div className="farm-map-intel-legend">
            <h3>Farms ({farmersWithGps.length})</h3>
            <ul>
              {farmersWithGps.slice(0, 10).map((f) => (
                <li key={f.id} onClick={() => onFarmerClick?.(f)} className={onFarmerClick ? 'farm-map-legend-clickable' : ''}>
                  {f.full_name} — {f.district || f.region || f.village || '—'}
                </li>
              ))}
              {farmersWithGps.length > 10 && <li>+{farmersWithGps.length - 10} more</li>}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default FarmMapIntelligence;
