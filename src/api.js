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

  /** Admin auth */
  login: (username, password) =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  /** Dashboard */
  getDashboardStats: () => apiRequest('/api/dashboard/stats'),

  /** Farmers */
  getFarmers: (params) => {
    const q = new URLSearchParams(params || {}).toString();
    return apiRequest(`/api/farmers${q ? `?${q}` : ''}`);
  },
  getFarmer: (id) => apiRequest(`/api/farmers/${id}`),
  createFarmer: (data) =>
    apiRequest('/api/farmers', { method: 'POST', body: JSON.stringify(data) }),
  updateFarmer: (id, data) =>
    apiRequest(`/api/farmers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFarmer: (id) =>
    apiRequest(`/api/farmers/${id}`, { method: 'DELETE' }),

  /** Providers */
  getProviders: (params) => {
    const q = new URLSearchParams(params || {}).toString();
    return apiRequest(`/api/providers${q ? `?${q}` : ''}`);
  },
  getProvider: (id) => apiRequest(`/api/providers/${id}`),
  createProvider: (data) =>
    apiRequest('/api/providers', { method: 'POST', body: JSON.stringify(data) }),
  updateProvider: (id, data) =>
    apiRequest(`/api/providers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProvider: (id) =>
    apiRequest(`/api/providers/${id}`, { method: 'DELETE' }),

  /** Bookings */
  getBookings: (params) => {
    const q = new URLSearchParams(params || {}).toString();
    return apiRequest(`/api/bookings${q ? `?${q}` : ''}`);
  },
  getBooking: (id) => apiRequest(`/api/bookings/${id}`),
  createBooking: (data) =>
    apiRequest('/api/bookings', { method: 'POST', body: JSON.stringify(data) }),
  updateBooking: (id, data) =>
    apiRequest(`/api/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBooking: (id) =>
    apiRequest(`/api/bookings/${id}`, { method: 'DELETE' }),

  /** Admin ratings (rate farmers and providers) */
  getAdminRatings: (rateeType, rateeId) =>
    apiRequest(`/api/admin-ratings?ratee_type=${rateeType}&ratee_id=${rateeId}`),
  submitAdminRating: (data) =>
    apiRequest('/api/admin-ratings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
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
