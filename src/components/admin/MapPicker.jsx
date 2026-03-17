/**
 * Map pin picker - click on map to set GPS coordinates
 * Used in FarmerForm and ProviderForm for location capture
 */
import React, { useEffect, useRef, useState } from 'react';
import './MapPicker.css';

const DEFAULT_LAT = 6.3703;
const DEFAULT_LNG = 2.3912;

function MapPicker({ lat, lng, onSelect, onClose }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [ready, setReady] = useState(false);

  useEffect(() => {
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
      script.onload = () => setReady(true);
      document.head.appendChild(script);
    } else {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current || typeof window.L === 'undefined') return;
    const L = window.L;
    const initLat = (lat != null && lat !== '') ? parseFloat(lat) : DEFAULT_LAT;
    const initLng = (lng != null && lng !== '') ? parseFloat(lng) : DEFAULT_LNG;
    const map = L.map(mapRef.current).setView([initLat, initLng], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
    mapInstanceRef.current = map;

    const marker = L.marker([initLat, initLng], { draggable: true }).addTo(map);
    markerRef.current = marker;

    const updateCoords = (e) => {
      const pos = e.target?.getLatLng?.() || e.latlng;
      if (pos) onSelectRef.current?.(pos.lat, pos.lng);
    };
    map.on('click', updateCoords);
    marker.on('dragend', updateCoords);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [ready]);

  return (
    <div className="map-picker-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="map-picker-modal">
        <div className="map-picker-header">
          <h3>Pick location on map</h3>
          <button type="button" className="map-picker-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <p className="map-picker-hint">Click on the map or drag the pin to set the location.</p>
        <div ref={mapRef} className="map-picker-container" />
        <div className="map-picker-actions">
          <button type="button" className="map-picker-btn map-picker-btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="map-picker-btn map-picker-btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

export default MapPicker;
