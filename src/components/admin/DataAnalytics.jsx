import React, { useState } from 'react';
import { FiDownload, FiBarChart2 } from 'react-icons/fi';
import './DataAnalytics.css';

function DataAnalytics() {
  const [activeTab, setActiveTab] = useState('agricultural');

  return (
    <div className="data-analytics">
      <header className="data-analytics-header">
        <h1 className="data-analytics-title">Analytics</h1>
        <div className="data-analytics-actions">
          <button type="button" className="data-analytics-btn">
            <FiDownload /> Farmers
          </button>
          <button type="button" className="data-analytics-btn">
            <FiDownload /> Providers
          </button>
          <button type="button" className="data-analytics-btn">
            <FiDownload /> Bookings
          </button>
          <button type="button" className="data-analytics-btn data-analytics-btn-primary">
            Custom Report
          </button>
        </div>
      </header>

      <div className="data-analytics-tabs">
        <button type="button" className={`data-analytics-tab ${activeTab === 'agricultural' ? 'active' : ''}`} onClick={() => setActiveTab('agricultural')}>
          Agricultural Intelligence
        </button>
        <button type="button" className={`data-analytics-tab ${activeTab === 'marketplace' ? 'active' : ''}`} onClick={() => setActiveTab('marketplace')}>
          Marketplace Intelligence
        </button>
      </div>

      {activeTab === 'agricultural' && (
        <section className="da-section">
          <h2>Agricultural Intelligence</h2>
          <div className="da-placeholder-grid">
            <div className="da-placeholder-card">
              <FiBarChart2 className="da-placeholder-icon" />
              <span>Crop distribution by region</span>
            </div>
            <div className="da-placeholder-card">
              <FiBarChart2 className="da-placeholder-icon" />
              <span>Seasonal planting trends</span>
            </div>
            <div className="da-placeholder-card">
              <FiBarChart2 className="da-placeholder-icon" />
              <span>Mechanization penetration</span>
            </div>
            <div className="da-placeholder-card">
              <FiBarChart2 className="da-placeholder-icon" />
              <span>Yield averages</span>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'marketplace' && (
        <section className="da-section">
          <h2>Marketplace Intelligence</h2>
          <div className="da-placeholder-grid">
            <div className="da-placeholder-card">
              <FiBarChart2 className="da-placeholder-icon" />
              <span>Most requested services</span>
            </div>
            <div className="da-placeholder-card">
              <FiBarChart2 className="da-placeholder-icon" />
              <span>Peak booking months</span>
            </div>
            <div className="da-placeholder-card">
              <FiBarChart2 className="da-placeholder-icon" />
              <span>Average booking size</span>
            </div>
            <div className="da-placeholder-card">
              <FiBarChart2 className="da-placeholder-icon" />
              <span>Provider utilization rate</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default DataAnalytics;
