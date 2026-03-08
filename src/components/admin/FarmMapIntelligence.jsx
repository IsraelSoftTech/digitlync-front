import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FiDownload } from 'react-icons/fi';
import { api } from '../../api';
import './FarmMapIntelligence.css';

const DEFAULT_LAT = 6.3703;
const DEFAULT_LNG = 2.3912;

function FarmMapIntelligence({ onFarmerClick }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [farmers, setFarmers] = useState([]);
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [layers, setLayers] = useState({ farms: true, providers: true, coverage: false, heatmap: false });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await api.getFarmersMapData();
      setFarmers(data?.farmers ?? []);
      setPlots(data?.plots ?? []);
      setLoading(false);
    })();
  }, []);

  const refreshData = useCallback(async () => {
    const { data } = await api.getFarmersMapData();
    setFarmers(data?.farmers ?? []);
    setPlots(data?.plots ?? []);
  }, []);

  const handleMarkerDragEnd = useCallback(async (item, lat, lng) => {
    if (item.type === 'farmer') {
      const { error } = await api.updateFarmer(item.id, { gps_lat: lat, gps_lng: lng });
      if (!error) refreshData();
    } else if (item.type === 'plot') {
      const { error } = await api.updateFarmPlot(item.id, { gps_lat: lat, gps_lng: lng });
      if (!error) refreshData();
    }
  }, [refreshData]);

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
      markersRef.current = [];

      const farmerMap = new Map(farmers.map((f) => [f.id, f]));
      const showFarms = layers.farms;

      // Farmer main locations
      (showFarms ? farmers.filter((f) => f.gps_lat != null && f.gps_lng != null) : []).forEach((f) => {
        const loc = [parseFloat(f.gps_lat), parseFloat(f.gps_lng)];
        const m = L.marker(loc, { draggable: editMode })
          .addTo(map)
          .bindTooltip(f.full_name || 'Farmer (main)', { permanent: false, direction: 'top' })
          .bindPopup(
            `<div class="farm-map-popup">
              <strong>${(f.full_name || 'Farmer').replace(/</g, '&lt;')}</strong> (main)<br/>
              ${(f.district || f.region || f.village || '').replace(/</g, '&lt;')}<br/>
              ${(f.crop_type ? `Crop: ${f.crop_type}` : '').replace(/</g, '&lt;')}
              ${onFarmerClick ? `<br/><button type="button" class="farm-map-view-profile" data-farmer-id="${f.id}">View profile</button>` : ''}
            </div>`
          );
        if (editMode) {
          m.on('dragend', () => {
            const pos = m.getLatLng();
            handleMarkerDragEnd({ type: 'farmer', id: f.id }, pos.lat, pos.lng);
          });
        }
        if (onFarmerClick) {
          m.on('popupopen', () => {
            const btn = document.querySelector('.farm-map-view-profile');
            if (btn) btn.onclick = () => onFarmerClick(f);
          });
        }
        markersRef.current.push(m);
      });

      // Farm plots (multiple plots per farmer)
      (showFarms ? plots : []).forEach((p) => {
        const f = farmerMap.get(p.farmer_id);
        const loc = [parseFloat(p.gps_lat), parseFloat(p.gps_lng)];
        const label = p.plot_name || (f ? `${f.full_name} (plot)` : 'Plot');
        const m = L.marker(loc, { draggable: editMode })
          .addTo(map)
          .bindTooltip(label, { permanent: false, direction: 'top' })
          .bindPopup(
            `<div class="farm-map-popup">
              <strong>${(p.plot_name || 'Plot').replace(/</g, '&lt;')}</strong><br/>
              ${(f ? f.full_name : '').replace(/</g, '&lt;')}<br/>
              ${(p.crop_type ? `Crop: ${p.crop_type}` : '').replace(/</g, '&lt;')}
              ${onFarmerClick && f ? `<br/><button type="button" class="farm-map-view-profile" data-farmer-id="${f.id}">View farmer</button>` : ''}
            </div>`
          );
        if (editMode) {
          m.on('dragend', () => {
            const pos = m.getLatLng();
            handleMarkerDragEnd({ type: 'plot', id: p.id }, pos.lat, pos.lng);
          });
        }
        if (onFarmerClick && f) {
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
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading, farmers, plots, onFarmerClick, editMode, handleMarkerDragEnd]);

  const farmersWithGps = farmers.filter((f) => f.gps_lat != null && f.gps_lng != null);
  const totalLocations = farmersWithGps.length + plots.length;

  const handleExport = () => {
    const rows = [
      ['type', 'name', 'farmer_id', 'lat', 'lng', 'village', 'crop_type'].join(','),
      ...farmersWithGps.map((f) => ['farmer', (f.full_name || '').replace(/"/g, '""'), f.id, f.gps_lat, f.gps_lng, (f.village || '').replace(/"/g, '""'), (f.crop_type || '').replace(/"/g, '""')].join(',')),
      ...plots.map((p) => {
        const f = farmers.find((x) => x.id === p.farmer_id);
        return ['plot', (p.plot_name || 'Plot').replace(/"/g, '""'), p.farmer_id, p.gps_lat, p.gps_lng, (f?.village || '').replace(/"/g, '""'), (p.crop_type || '').replace(/"/g, '""')].join(',');
      }),
    ];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'digilync-farm-locations.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="farm-map-intel">
      <header className="farm-map-intel-header">
        <div>
          <h1 className="farm-map-intel-title">Farm Map</h1>
          <p className="farm-map-intel-subtitle">Geo-tagged farms from WhatsApp location sharing and admin entry</p>
        </div>
        <div className="farm-map-intel-actions">
          <label className="farm-map-intel-edit-toggle">
            <input type="checkbox" checked={editMode} onChange={(e) => setEditMode(e.target.checked)} />
            <span>Edit mode (drag to move)</span>
          </label>
          <button type="button" className="farm-map-intel-btn" onClick={handleExport} title="Export locations as CSV">
            <FiDownload /> Export CSV
          </button>
        </div>
      </header>

      <div className="farm-map-intel-layers">
        <h3>Layers</h3>
        <label className="farm-map-intel-layer-toggle">
          <input type="checkbox" checked={layers.farms} onChange={(e) => setLayers((s) => ({ ...s, farms: e.target.checked }))} />
          <span>Farms</span>
        </label>
        <span className="farm-map-intel-layer-note">Provider & coverage layers coming in future phases</span>
      </div>

      {loading ? (
        <div className="farm-map-intel-loading">Loading map...</div>
      ) : (
        <>
          <div ref={mapRef} className="farm-map-intel-container" />
          <div className="farm-map-intel-legend">
            <h3>Locations ({totalLocations})</h3>
            <p className="farm-map-legend-note">Main farms + multiple plots per farmer</p>
            <ul>
              {farmersWithGps.slice(0, 8).map((f) => (
                <li key={`f-${f.id}`} onClick={() => onFarmerClick?.(f)} className={onFarmerClick ? 'farm-map-legend-clickable' : ''}>
                  {f.full_name} — {f.district || f.region || f.village || '—'}
                </li>
              ))}
              {plots.slice(0, 4).map((p) => {
                const f = farmers.find((x) => x.id === p.farmer_id);
                return (
                  <li key={`p-${p.id}`} onClick={() => f && onFarmerClick?.(f)} className={onFarmerClick ? 'farm-map-legend-clickable' : ''}>
                    {p.plot_name || 'Plot'} — {f?.full_name || '—'}
                  </li>
                );
              })}
              {(farmersWithGps.length > 8 || plots.length > 4) && (
                <li>+{Math.max(0, farmersWithGps.length - 8) + Math.max(0, plots.length - 4)} more</li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default FarmMapIntelligence;
