import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FiDownload } from 'react-icons/fi';
import { api } from '../../api';
import './FarmMapIntelligence.css';

const DEFAULT_LAT = 6.3703;
const DEFAULT_LNG = 2.3912;

function FarmMapIntelligence({ onFarmerClick, onProviderClick }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [farmers, setFarmers] = useState([]);
  const [plots, setPlots] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [layers, setLayers] = useState({ farms: true, providers: true, coverage: false, heatmap: false });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    (async () => {
      const [farmRes, provRes] = await Promise.all([
        api.getFarmersMapData(),
        api.getProvidersMapData(),
      ]);
      setFarmers(farmRes.data?.farmers ?? []);
      setPlots(farmRes.data?.plots ?? []);
      setProviders(provRes.data?.providers ?? []);
      setLoading(false);
    })();
  }, []);

  const refreshData = useCallback(async () => {
    const [farmRes, provRes] = await Promise.all([
      api.getFarmersMapData(),
      api.getProvidersMapData(),
    ]);
    setFarmers(farmRes.data?.farmers ?? []);
    setPlots(farmRes.data?.plots ?? []);
    setProviders(provRes.data?.providers ?? []);
  }, []);

  const handleMarkerDragEnd = useCallback(async (item, lat, lng) => {
    if (item.type === 'farmer') {
      const { error } = await api.updateFarmer(item.id, { gps_lat: lat, gps_lng: lng });
      if (!error) refreshData();
    } else if (item.type === 'plot') {
      const { error } = await api.updateFarmPlot(item.id, { gps_lat: lat, gps_lng: lng });
      if (!error) refreshData();
    } else if (item.type === 'provider') {
      const { error } = await api.patchProvider(item.id, { gps_lat: lat, gps_lng: lng });
      if (!error) refreshData();
    }
  }, [refreshData]);

  const handleMarkerDragEndRef = useRef(handleMarkerDragEnd);
  handleMarkerDragEndRef.current = handleMarkerDragEnd;

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

      const greenIcon = L.divIcon({
        className: 'farm-map-marker farm-map-marker-farmer',
        html: '<div class="farm-map-marker-dot" style="background:#22c55e;border:2px solid #15803d;"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      const redIcon = L.divIcon({
        className: 'farm-map-marker farm-map-marker-provider',
        html: '<div class="farm-map-marker-dot" style="background:#ef4444;border:2px solid #b91c1c;"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      // Farmer main locations (green pins)
      (showFarms ? farmers.filter((f) => f.gps_lat != null && f.gps_lng != null) : []).forEach((f) => {
        const loc = [parseFloat(f.gps_lat), parseFloat(f.gps_lng)];
        const m = L.marker(loc, { draggable: editMode, icon: greenIcon })
          .addTo(map)
          .bindTooltip(f.full_name || 'Farmer (main)', { permanent: false, direction: 'top' })
          .bindPopup(
            `<div class="farm-map-popup">
              <strong>${(f.full_name || 'Farmer').replace(/</g, '&lt;')}</strong> (farmer)<br/>
              ${(f.district || f.region || f.village || '').replace(/</g, '&lt;')}<br/>
              ${(f.crop_type ? `Crop: ${f.crop_type}` : '').replace(/</g, '&lt;')}
              ${f.farm_size_ha != null ? `Farm: ${f.farm_size_ha} ha` : ''}
              ${onFarmerClick ? `<br/><button type="button" class="farm-map-view-profile" data-farmer-id="${f.id}">View profile</button>` : ''}
            </div>`
          );
        if (editMode) {
          m.on('dragend', () => {
            const pos = m.getLatLng();
            handleMarkerDragEndRef.current({ type: 'farmer', id: f.id }, pos.lat, pos.lng);
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

      // Farm plots (green pins)
      (showFarms ? plots : []).forEach((p) => {
        const f = farmerMap.get(p.farmer_id);
        const loc = [parseFloat(p.gps_lat), parseFloat(p.gps_lng)];
        const label = p.plot_name || (f ? `${f.full_name} (plot)` : 'Plot');
        const m = L.marker(loc, { draggable: editMode, icon: greenIcon })
          .addTo(map)
          .bindTooltip(label, { permanent: false, direction: 'top' })
          .bindPopup(
            `<div class="farm-map-popup">
              <strong>${(p.plot_name || 'Plot').replace(/</g, '&lt;')}</strong><br/>
              ${(f ? f.full_name : '').replace(/</g, '&lt;')}<br/>
              ${(p.crop_type ? `Crop: ${p.crop_type}` : '').replace(/</g, '&lt;')}
              ${p.plot_size_ha != null ? `Size: ${p.plot_size_ha} ha` : ''}
              ${onFarmerClick && f ? `<br/><button type="button" class="farm-map-view-profile" data-farmer-id="${f.id}">View farmer</button>` : ''}
            </div>`
          );
        if (editMode) {
          m.on('dragend', () => {
            const pos = m.getLatLng();
            handleMarkerDragEndRef.current({ type: 'plot', id: p.id }, pos.lat, pos.lng);
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

      // Provider locations (blue pins)
      const showProviders = layers.providers;
      (showProviders ? providers : []).forEach((pr) => {
        const loc = [parseFloat(pr.gps_lat), parseFloat(pr.gps_lng)];
        const m = L.marker(loc, { draggable: editMode, icon: redIcon })
          .addTo(map)
          .bindTooltip(pr.full_name || 'Provider', { permanent: false, direction: 'top' })
          .bindPopup(
            `<div class="farm-map-popup">
              <strong>${(pr.full_name || 'Provider').replace(/</g, '&lt;')}</strong> (provider)<br/>
              ${pr._has_gps === false ? '<em>Location not set — drag pin in Edit mode to set</em><br/>' : ''}
              ${(pr.services_offered || '').replace(/</g, '&lt;')}<br/>
              ${pr.service_radius_km ? `Radius: ${pr.service_radius_km} km` : ''}
              ${pr.base_price_per_ha != null ? `Price: ${Number(pr.base_price_per_ha).toLocaleString()} FCFA/ha` : ''}
              ${pr.work_capacity_ha_per_hour != null ? `Capacity: ${pr.work_capacity_ha_per_hour} ha/hr` : ''}
              ${pr.avg_rating != null ? `Rating: ${pr.avg_rating}/5` : ''}
              ${onProviderClick ? `<br/><button type="button" class="farm-map-view-profile" data-provider-id="${pr.id}">View profile</button>` : ''}
            </div>`
          );
        if (editMode) {
          m.on('dragend', () => {
            const pos = m.getLatLng();
            handleMarkerDragEndRef.current({ type: 'provider', id: pr.id }, pos.lat, pos.lng);
          });
        }
        if (onProviderClick) {
          m.on('popupopen', (ev) => {
            const container = ev.target?.getPopup?.()?.getElement?.();
            const btn = container?.querySelector?.('.farm-map-view-profile');
            if (btn) btn.onclick = () => onProviderClick(pr);
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
  }, [loading, farmers, plots, providers, layers, onFarmerClick, onProviderClick, editMode]);

  const farmersWithGps = farmers.filter((f) => f.gps_lat != null && f.gps_lng != null);
  const totalLocations = farmersWithGps.length + plots.length + providers.length;

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
    link.download = 'farmfleet-farm-locations.csv';
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
        <label className="farm-map-intel-layer-toggle">
          <input type="checkbox" checked={layers.providers} onChange={(e) => setLayers((s) => ({ ...s, providers: e.target.checked }))} />
          <span>Providers</span>
        </label>
        <span className="farm-map-intel-layer-note">Coverage & heatmap layers coming in future phases</span>
      </div>

      {loading ? (
        <div className="farm-map-intel-loading">Loading map...</div>
      ) : (
        <>
          <div ref={mapRef} className="farm-map-intel-container" />
          <div className="farm-map-intel-legend">
            <h3>Locations ({totalLocations})</h3>
            <p className="farm-map-legend-note">
              <span className="farm-map-legend-dot farm-map-legend-farmer" /> Farmers — <span className="farm-map-legend-dot farm-map-legend-provider" /> Providers
            </p>
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
