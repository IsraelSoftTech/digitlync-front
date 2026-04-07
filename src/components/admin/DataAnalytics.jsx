import React, { useState, useEffect } from 'react';
import { FiDownload, FiBarChart2, FiTrendingUp } from 'react-icons/fi';
import { api } from '../../api';
import './DataAnalytics.css';

function downloadCsv(data, filename) {
  if (!data?.length) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map((r) => Object.values(r).map((v) => (v == null ? '' : `"${String(v).replace(/"/g, '""')}"`)).join(','));
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function DataAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [services, setServices] = useState([]);
  const [crops, setCrops] = useState([]);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [oRes, sRes, cRes, tRes] = await Promise.all([
        api.getAnalyticsOverview(),
        api.getAnalyticsServices(),
        api.getAnalyticsCrops(),
        api.getAnalyticsBookingsTrend(),
      ]);
      setOverview(oRes.data ?? null);
      setServices(sRes.data?.services ?? []);
      setCrops(cRes.data?.crops ?? []);
      setTrend(tRes.data?.trend ?? []);
      setLoading(false);
    })();
  }, []);

  const handleExportFarmers = async () => {
    const { data } = await api.getFarmers();
    const farmers = data?.farmers ?? [];
    downloadCsv(farmers.map((f) => ({ id: f.id, full_name: f.full_name, phone: f.phone, village: f.village, crop_type: f.crop_type, farm_size_ha: f.farm_size_ha })), 'farmfleet-farmers.csv');
  };

  const handleExportProviders = async () => {
    const { data } = await api.getProviders();
    const providers = data?.providers ?? [];
    downloadCsv(providers.map((p) => ({ id: p.id, full_name: p.full_name, phone: p.phone, services_offered: p.services_offered, base_price_per_ha: p.base_price_per_ha })), 'farmfleet-providers.csv');
  };

  const handleExportBookings = async () => {
    const { data } = await api.getBookings();
    const bookings = data?.bookings ?? [];
    downloadCsv(bookings.map((b) => ({ id: b.id, service_type: b.service_type, status: b.status, scheduled_date: b.scheduled_date, farmer_name: b.farmer_name, provider_name: b.provider_name })), 'farmfleet-bookings.csv');
  };

  return (
    <div className="data-analytics">
      <header className="data-analytics-header">
        <div>
          <h1 className="data-analytics-title">Analytics</h1>
          <p className="data-analytics-subtitle">Key metrics and exports</p>
        </div>
        <div className="data-analytics-actions">
          <button type="button" className="data-analytics-btn" onClick={handleExportFarmers}>
            <FiDownload /> Farmers
          </button>
          <button type="button" className="data-analytics-btn" onClick={handleExportProviders}>
            <FiDownload /> Providers
          </button>
          <button type="button" className="data-analytics-btn" onClick={handleExportBookings}>
            <FiDownload /> Bookings
          </button>
        </div>
      </header>

      <div className="data-analytics-tabs">
        <button type="button" className={`data-analytics-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button type="button" className={`data-analytics-tab ${activeTab === 'agricultural' ? 'active' : ''}`} onClick={() => setActiveTab('agricultural')}>
          Agricultural
        </button>
        <button type="button" className={`data-analytics-tab ${activeTab === 'marketplace' ? 'active' : ''}`} onClick={() => setActiveTab('marketplace')}>
          Marketplace
        </button>
      </div>

      {activeTab === 'overview' && (
        <section className="da-section">
          <h2>Key metrics</h2>
          {loading ? (
            <p className="da-placeholder-text">Loading...</p>
          ) : (
            <div className="da-metrics-grid">
              <div className="da-metric-card">
                <FiBarChart2 className="da-metric-icon" />
                <span className="da-metric-value">{overview?.farmers ?? 0}</span>
                <span className="da-metric-label">Farmers</span>
              </div>
              <div className="da-metric-card">
                <FiBarChart2 className="da-metric-icon" />
                <span className="da-metric-value">{overview?.providers ?? 0}</span>
                <span className="da-metric-label">Providers</span>
              </div>
              <div className="da-metric-card">
                <FiBarChart2 className="da-metric-icon" />
                <span className="da-metric-value">{overview?.bookings ?? 0}</span>
                <span className="da-metric-label">Bookings</span>
              </div>
              <div className="da-metric-card">
                <FiTrendingUp className="da-metric-icon" />
                <span className="da-metric-value">{overview?.ratings?.avg ? overview.ratings.avg.toFixed(1) : '—'}</span>
                <span className="da-metric-label">Avg rating ({overview?.ratings?.count ?? 0} total)</span>
              </div>
            </div>
          )}
        </section>
      )}

      {activeTab === 'agricultural' && (
        <section className="da-section">
          <h2>Crop distribution</h2>
          {loading ? (
            <p className="da-placeholder-text">Loading...</p>
          ) : !crops.length ? (
            <p className="da-placeholder-text">No crop data yet. Farmers register via WhatsApp.</p>
          ) : (
            <div className="da-bar-list">
              {crops.map((c) => (
                <div key={c.name} className="da-bar-row">
                  <span className="da-bar-label">{c.name}</span>
                  <div className="da-bar-track">
                    <div className="da-bar-fill" style={{ width: `${Math.min(100, (c.count / Math.max(...crops.map((x) => x.count))) * 100)}%` }} />
                  </div>
                  <span className="da-bar-value">{c.count}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'marketplace' && (
        <section className="da-section">
          <h2>Most requested services</h2>
          {loading ? (
            <p className="da-placeholder-text">Loading...</p>
          ) : !services.length ? (
            <p className="da-placeholder-text">No service data yet.</p>
          ) : (
            <div className="da-bar-list">
              {services.map((s) => (
                <div key={s.name} className="da-bar-row">
                  <span className="da-bar-label">{s.name}</span>
                  <div className="da-bar-track">
                    <div className="da-bar-fill" style={{ width: `${Math.min(100, (s.count / Math.max(...services.map((x) => x.count))) * 100)}%` }} />
                  </div>
                  <span className="da-bar-value">{s.count}</span>
                </div>
              ))}
            </div>
          )}
          {trend.length > 0 && (
            <>
              <h2 style={{ marginTop: 24 }}>Bookings by month</h2>
              <div className="da-trend-list">
                {trend.map((t) => (
                  <div key={t.month} className="da-trend-row">
                    <span>{t.month}</span>
                    <span className="da-trend-value">{t.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

export default DataAnalytics;
