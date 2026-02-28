import React, { useEffect, useState, useRef } from 'react';
import { api } from '../api';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { FaTractor, FaUsers, FaClipboardList, FaCheckCircle, FaMapMarkerAlt, FaStar, FaClock } from 'react-icons/fa';
import './LiveMetrics.css';

const METRICS_CONFIG = [
  { key: 'farmsOnboarded', label: 'Farmers', icon: FaTractor },
  { key: 'serviceProvidersRegistered', label: 'Providers', icon: FaUsers },
  { key: 'serviceRequestsSubmitted', label: 'Service Requests', icon: FaClipboardList },
  { key: 'completedServices', label: 'Completed Services', icon: FaCheckCircle },
  { key: 'activeRegions', label: 'Active Regions', icon: FaMapMarkerAlt },
  { key: 'averageServiceRating', label: 'Avg. Service Rating', icon: FaStar, suffix: '/5', decimals: 1 },
  { key: 'onTimeCompletionRatePercent', label: 'On-Time Completion', icon: FaClock, suffix: '%' },
];

function AnimatedNumber({ value, decimals = 0, suffix = '', isInView }) {
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView) return;
    const target = value ?? 0;
    if (!hasAnimated.current) {
      hasAnimated.current = true;
    }
    const duration = 1500;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
      else setDisplay(target);
    };

    requestAnimationFrame(tick);
  }, [isInView, value]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString();
  return (
    <span className="live-metrics-value">
      {formatted}
      {suffix}
    </span>
  );
}

function LiveMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [ref, isInView] = useAnimateOnScroll({ threshold: 0.15 });

  const fetchMetrics = React.useCallback(async () => {
    setError('');
    // Use same endpoint as admin dashboard (known to work)
    const { data: dashData, error: err } = await api.getDashboardStats();
    if (!err && dashData) {
      // Try public metrics for extra fields (completed, regions, rating)
      const { data: pubData } = await api.getPublicMetrics();
      setMetrics({
        farmsOnboarded: dashData.farmers ?? 0,
        serviceProvidersRegistered: dashData.providers ?? 0,
        serviceRequestsSubmitted: dashData.bookings ?? 0,
        completedServices: pubData?.completedServices ?? 0,
        activeRegions: pubData?.activeRegions ?? 0,
        averageServiceRating: pubData?.averageServiceRating ?? null,
        onTimeCompletionRatePercent: pubData?.onTimeCompletionRatePercent ?? null,
      });
      setLoading(false);
      return;
    }
    setError(err || 'Could not reach API');
    setMetrics({});
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000);
    return () => clearInterval(interval);
  }, [fetchMetrics]);

  if (loading && !metrics) {
    return (
      <section className="section section-live-metrics">
        <div className="section-inner">
          <h2 className="section-title">Live Platform Metrics</h2>
          <div className="live-metrics-grid">
            {METRICS_CONFIG.map((_, i) => (
              <div key={i} className="live-metrics-card live-metrics-loading">
                <span className="live-metrics-value">—</span>
                <span className="live-metrics-label">Loading…</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="live-metrics" className="section section-live-metrics" ref={ref}>
      <div className="section-inner">
        <h2 className="section-title">Live Platform Metrics</h2>
        <p className="section-subtitle">
          Real-time coordination data from the DigiLync platform.{' '}
          <a href="#geospatial" className="live-metrics-map-link">View farm locations on map →</a>
        </p>
        {error && (
          <div className="live-metrics-error">
            <p>{error}. In development, ensure the backend is running (e.g. <code>npm start</code> in backend folder).</p>
            <button type="button" className="live-metrics-retry" onClick={fetchMetrics}>Retry</button>
          </div>
        )}
        <div className="live-metrics-grid">
          {METRICS_CONFIG.map(({ key, label, icon: Icon, suffix = '', decimals = 0 }) => {
            const val = metrics?.[key];
            const isNull = val == null && (key === 'averageServiceRating' || key === 'onTimeCompletionRatePercent');
            return (
              <div key={key} className="live-metrics-card">
                <Icon className="live-metrics-icon" aria-hidden />
                {isNull ? (
                  <span className="live-metrics-value">—</span>
                ) : (
                  <AnimatedNumber
                    value={val ?? 0}
                    decimals={decimals}
                    suffix={suffix}
                    isInView={isInView}
                  />
                )}
                <span className="live-metrics-label">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LiveMetrics;
