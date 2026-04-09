import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api';
import './GpsCapture.css';

/**
 * WhatsApp deep link: complete farmer registration by capturing browser geolocation.
 * Query: ?t=<token from bot>
 */
function GpsCapture() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t') || '';

  const [status, setStatus] = useState('idle'); // idle | locating | ready | saving | done | error
  const [error, setError] = useState('');
  const [coords, setCoords] = useState(null);
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('Missing link token. Open the link from your WhatsApp message.');
    }
  }, [token]);

  const requestLocation = useCallback(() => {
    if (!token) return;
    setError('');
    setStatus('locating');

    if (!navigator.geolocation) {
      setStatus('error');
      setError('Location is not supported on this device. Try another browser or update your app.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setStatus('ready');
      },
      (err) => {
        setStatus('error');
        if (err.code === err.PERMISSION_DENIED) {
          setError('Location permission was denied. Turn on location in your device settings and allow access for this site, then try again.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError('Could not read your position. Move outdoors or turn on GPS, then try again.');
        } else {
          setError(err.message || 'Could not get your location.');
        }
      },
      { enableHighAccuracy: true, timeout: 25000, maximumAge: 0 }
    );
  }, [token]);

  const submit = async () => {
    if (!token || !coords || !consent) return;
    setStatus('saving');
    setError('');
    const { data, error: apiErr } = await api.submitFarmerRegisterGps({
      token,
      gps_lat: coords.lat,
      gps_lng: coords.lng,
      consent: true,
    });
    if (apiErr) {
      setStatus('ready');
      setError(apiErr);
      return;
    }
    if (data?.success) {
      setStatus('done');
    } else {
      setStatus('ready');
      setError('Unexpected response from server.');
    }
  };

  return (
    <div className="gps-capture">
      <div className="gps-capture__bg" aria-hidden />
      <div className="gps-capture__card">
        <div className="gps-capture__brand">Digilync 🌱</div>
        <h1 className="gps-capture__title">Farm location</h1>
        <p className="gps-capture__lead">
          We use your GPS once to place your farm on the map. Turn on location when your phone asks, then capture below.
        </p>

        {status === 'done' && (
          <div className="gps-capture__success" role="status">
            <span className="gps-capture__success-icon">✓</span>
            <p>
              <strong>Location saved.</strong> Return to WhatsApp — you should see <em>Registration Successful</em> and the main menu.
            </p>
          </div>
        )}

        {status !== 'done' && (
          <>
            {status === 'idle' && token && (
              <button type="button" className="gps-capture__btn gps-capture__btn--primary" onClick={requestLocation}>
                Turn on location &amp; capture GPS
              </button>
            )}

            {status === 'locating' && (
              <div className="gps-capture__pulse-wrap">
                <div className="gps-capture__pulse" />
                <p className="gps-capture__hint">Getting your position…</p>
              </div>
            )}

            {coords && status !== 'saving' && status !== 'done' && (
              <div className="gps-capture__coords">
                <span className="gps-capture__coords-label">Pin</span>
                <code>
                  {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                </code>
                {coords.accuracy != null && (
                  <span className="gps-capture__accuracy">±{Math.round(coords.accuracy)} m</span>
                )}
              </div>
            )}

            {status === 'ready' && coords && (
              <>
                <label className="gps-capture__consent">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <span>
                    I consent to Digilync storing this GPS point for my farm registration and service matching, as described in the{' '}
                    <a href="/privacy" target="_blank" rel="noreferrer">
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
                <button
                  type="button"
                  className="gps-capture__btn gps-capture__btn--primary"
                  disabled={!consent}
                  onClick={submit}
                >
                  Save farm location
                </button>
                <button type="button" className="gps-capture__btn gps-capture__btn--ghost" onClick={requestLocation}>
                  Capture again
                </button>
              </>
            )}

            {status === 'saving' && <p className="gps-capture__hint">Saving…</p>}

            {error && (
              <div className="gps-capture__err" role="alert">
                {error}
              </div>
            )}

            {(status === 'error' || status === 'idle') && token && status !== 'locating' && (
              <button type="button" className="gps-capture__btn gps-capture__btn--secondary" onClick={requestLocation}>
                Try again
              </button>
            )}
          </>
        )}

        <p className="gps-capture__footer">
          <Link to="/">Digilync home</Link>
        </p>
      </div>
    </div>
  );
}

export default GpsCapture;
