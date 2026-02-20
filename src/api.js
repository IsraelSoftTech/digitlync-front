/**
 * DigiLync API Client
 * Handles communication between frontend, backend API, and file storage URLs.
 * Automatically uses correct base URL based on NODE_ENV (development vs production).
 */

// In dev: use proxy (empty base) or explicit localhost. In prod: api.digilync.net
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://api.digilync.net'
    : ''); // '' = use CRA proxy to localhost:5000

/**
 * Base fetch wrapper with error handling and JSON parsing
 * @param {string} endpoint - API endpoint (e.g. '/api/health')
 * @param {RequestInit} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<{ data?: any, error?: string }>}
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        error: data?.message || data?.error || `Request failed (${response.status})`,
        status: response.status,
      };
    }

    return { data, status: response.status };
  } catch (err) {
    return {
      error: err.message || 'Network error - could not reach API',
      status: null,
    };
  }
}

/**
 * API methods for common operations
 */
export const api = {
  /** Health check */
  health: () => apiRequest('/api/health'),

  /** Farmers */
  getFarmers: () => apiRequest('/api/farmers'),
  getFarmer: (id) => apiRequest(`/api/farmers/${id}`),

  /** Providers */
  getProviders: () => apiRequest('/api/providers'),
  getProvider: (id) => apiRequest(`/api/providers/${id}`),

  /** Bookings */
  getBookings: () => apiRequest('/api/bookings'),
  getBooking: (id) => apiRequest(`/api/bookings/${id}`),
};

/**
 * File storage base URL (for public file links)
 * Use this when constructing URLs to files stored on FTP
 */
export const FILE_STORAGE_BASE_URL =
  process.env.REACT_APP_FILE_STORAGE_URL ||
  'https://st60307.ispot.cc/digilyncstorage';

/**
 * Build a public URL for a stored file
 * @param {string} path - Relative path from FTP base (e.g. 'uploads/image.jpg')
 * @returns {string} Full public URL
 */
export function getFileUrl(path) {
  const base = FILE_STORAGE_BASE_URL.replace(/\/$/, '');
  const cleanPath = path ? path.replace(/^\//, '') : '';
  return cleanPath ? `${base}/${cleanPath}` : base;
}

export default api;
