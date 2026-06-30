import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useLocation } from 'react-router-dom';
import { FiTool, FiX, FiMessageCircle } from 'react-icons/fi';
import { api } from '../api';
import './MaintenanceBanner.css';

const RESHOW_DELAY_MS = 5000;
const TOP_BAR_SELECTOR = '.hero-header, .admin-dash-header';

function getTopBarOffset() {
  let offset = 0;
  document.querySelectorAll(TOP_BAR_SELECTOR).forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.bottom > 0) {
      offset = Math.max(offset, rect.bottom);
    }
  });
  return Math.round(offset);
}

export default function MaintenanceBanner() {
  const location = useLocation();
  const [signalEnabled, setSignalEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [topOffset, setTopOffset] = useState(0);
  const timerRef = useRef(null);

  const updateTopOffset = useCallback(() => {
    setTopOffset(getTopBarOffset());
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await api.getPublicMaintenance();
      if (cancelled) return;
      const enabled = Boolean(data?.maintenanceSignalEnabled);
      setSignalEnabled(enabled);
      setVisible(enabled);
    })();
    return () => { cancelled = true; };
  }, [location.pathname]);

  useEffect(() => {
    if (!mounted || !visible || !signalEnabled) return undefined;

    updateTopOffset();

    const handleUpdate = () => updateTopOffset();
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, { passive: true });

    const observer = new ResizeObserver(handleUpdate);
    document.querySelectorAll(TOP_BAR_SELECTOR).forEach((el) => observer.observe(el));

    const retryId = window.setTimeout(updateTopOffset, 100);

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate);
      observer.disconnect();
      window.clearTimeout(retryId);
    };
  }, [mounted, visible, signalEnabled, location.pathname, updateTopOffset]);

  const handleClose = useCallback(() => {
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(true);
      timerRef.current = null;
    }, RESHOW_DELAY_MS);
  }, []);

  if (!mounted || !signalEnabled || !visible) return null;

  return ReactDOM.createPortal(
    <div
      className="maintenance-banner"
      role="alert"
      aria-live="polite"
      style={{ top: `${topOffset}px` }}
    >
      <div className="maintenance-banner-accent" aria-hidden="true" />
      <div className="maintenance-banner-inner">
        <div className="maintenance-banner-icon-wrap" aria-hidden="true">
          <FiTool className="maintenance-banner-icon" />
        </div>
        <div className="maintenance-banner-content">
          <p className="maintenance-banner-title">Scheduled Maintenance in Progress</p>
          <p className="maintenance-banner-text">
            Our services are temporarily down for maintenance, and some features may not be
            accessible. We will send you <strong>WhatsApp</strong> and <strong>SMS</strong>{' '}
            notifications when services are back online. We apologize for the inconvenience.
          </p>
          <p className="maintenance-banner-note">
            <FiMessageCircle className="maintenance-banner-note-icon" aria-hidden="true" />
            <span>You will be notified automatically when we are back up.</span>
          </p>
        </div>
        <button
          type="button"
          className="maintenance-banner-close"
          onClick={handleClose}
          aria-label="Dismiss maintenance notice"
        >
          <FiX aria-hidden="true" />
        </button>
      </div>
    </div>,
    document.body
  );
}
