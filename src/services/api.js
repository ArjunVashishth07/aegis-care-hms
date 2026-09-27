const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Enhanced fetch wrapper with rate-limit interception and error normalization.
 */
async function request(endpoint, options = {}) {
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

    // 1. Intercept 429 Too Many Requests
    if (response.status === 429) {
      const errorData = await response.json().catch(() => ({}));
      const retryAfter = response.headers.get('Retry-After') || errorData.retryAfter || 5;

      // Broadcast rate limit event for UI banners/toasts
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('hms:rate-limited', {
            detail: {
              message:
                errorData.message ||
                'Rate limit exceeded (60 requests/minute). Requests are throttled.',
              retryAfter,
            },
          })
        );
      }

      const rateLimitError = new Error(
        errorData.message || 'Rate limit exceeded. Please wait a moment.'
      );
      rateLimitError.status = 429;
      rateLimitError.retryAfter = retryAfter;
      throw rateLimitError;
    }

    // 2. Parse response
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const err = new Error(data?.error || data?.message || `HTTP ${response.status}`);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    if (error.status !== 429) {
      console.warn(`[HMS API Error] ${endpoint}:`, error.message);
    }
    throw error;
  }
}

export const api = {
  // Appointments & OPD Queue
  appointments: {
    getQueue: (params = {}) => {
      const query = new URLSearchParams();
      if (params.department && params.department !== 'All') query.append('department', params.department);
      if (params.status && params.status !== 'All') query.append('status', params.status);
      if (params.search) query.append('search', params.search);
      const qs = query.toString();
      return request(`/appointments/queue${qs ? `?${qs}` : ''}`);
    },
    book: (patientData) =>
      request('/appointments/book', {
        method: 'POST',
        body: JSON.stringify(patientData),
      }),
    updateStatus: (id, status) =>
      request(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    callNext: (department) =>
      request('/appointments/call-next', {
        method: 'POST',
        body: JSON.stringify({ department: department === 'All' ? null : department }),
      }),
  },

  // Patients
  patients: {
    search: (query = '') => {
      const qs = query ? `?query=${encodeURIComponent(query)}` : '';
      return request(`/patients${qs}`);
    },
    getById: (id) => request(`/patients/${id}`),
    register: (data) =>
      request('/patients', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Beds Matrix
  beds: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.ward && params.ward !== 'All') query.append('ward', params.ward);
      if (params.status && params.status !== 'All') query.append('status', params.status);
      const qs = query.toString();
      return request(`/beds${qs ? `?${qs}` : ''}`);
    },
    allocate: (id, data) =>
      request(`/beds/${id}/allocate`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    discharge: (id, data = {}) =>
      request(`/beds/${id}/discharge`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateStatus: (id, status) =>
      request(`/beds/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },

  // Billing
  bills: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.status && params.status !== 'All') query.append('status', params.status);
      const qs = query.toString();
      return request(`/bills${qs ? `?${qs}` : ''}`);
    },
    create: (data) =>
      request('/bills', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    settle: (id, data = {}) =>
      request(`/bills/${id}/settle`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  // Doctors
  doctors: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.department && params.department !== 'All') query.append('department', params.department);
      const qs = query.toString();
      return request(`/doctors${qs ? `?${qs}` : ''}`);
    },
  },

  // Health
  health: () => request('/health'),
};

export default api;
