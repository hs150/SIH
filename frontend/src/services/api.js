// API Client Service for SIH Hazard-Based Red Zone & Relocation Assessment

const API_BASE = '/api';

export const authStorage = {
  getToken: () => localStorage.getItem('sih_jwt_token'),
  getUser: () => {
    const userStr = localStorage.getItem('sih_user');
    return userStr ? JSON.parse(userStr) : null;
  },
  setAuth: (token, user) => {
    localStorage.setItem('sih_jwt_token', token);
    localStorage.setItem('sih_user', JSON.stringify(user));
  },
  clearAuth: () => {
    localStorage.removeItem('sih_jwt_token');
    localStorage.removeItem('sih_user');
  },
  isAuthenticated: () => !!localStorage.getItem('sih_jwt_token')
};

async function request(endpoint, options = {}) {
  const token = authStorage.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Unauthorized
    authStorage.clearAuth();
    window.dispatchEvent(new Event('auth:unauthorized'));
    throw new Error('Session expired or invalid credentials');
  }

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errData = await response.json();
      errorMsg = errData.message || errData.error || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  // Authentication
  login: async (email, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    authStorage.setAuth(data.token, {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
    });
    return data;
  },
  logout: () => {
    authStorage.clearAuth();
  },

  // Habitations
  getHabitations: () => request('/habitations'),
  getHabitationById: (id) => request(`/habitations/${id}`),
  createHabitation: (habitation) =>
    request('/habitations', {
      method: 'POST',
      body: JSON.stringify(habitation),
    }),
  updateHabitation: (id, habitation) =>
    request(`/habitations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(habitation),
    }),
  deleteHabitation: (id) =>
    request(`/habitations/${id}`, {
      method: 'DELETE',
    }),
  getHighlyVulnerableHabitations: (minScore = 70) =>
    request(`/habitations/vulnerable?minimumScore=${minScore}`),

  // Hazard Events
  getHazards: () => request('/hazards'),
  getHazardById: (id) => request(`/hazards/${id}`),
  createHazard: (hazard) =>
    request('/hazards', {
      method: 'POST',
      body: JSON.stringify(hazard),
    }),

  // Red Zones
  getRedZones: () => request('/red-zones'),
  getActiveRedZones: () => request('/red-zones/active'),
  getRedZoneById: (id) => request(`/red-zones/${id}`),
  createRedZone: (redZone) =>
    request('/red-zones', {
      method: 'POST',
      body: JSON.stringify(redZone),
    }),
  deleteRedZone: (id) =>
    request(`/red-zones/${id}`, {
      method: 'DELETE',
    }),

  // Relocation Sites & Carrying Capacity
  getRelocationSites: () => request('/relocation-sites'),
  getRelocationSiteById: (id) => request(`/relocation-sites/${id}`),
  createRelocationSite: (site) =>
    request('/relocation-sites', {
      method: 'POST',
      body: JSON.stringify(site),
    }),
  getSiteCapacity: (siteId) => request(`/relocation-sites/${siteId}/capacity`),

  // Hazard Risk Assessment
  calculateHazardRisk: (habitationId) =>
    request(`/assessments/hazard/${habitationId}`, {
      method: 'POST',
    }),
  getLatestAssessment: (habitationId) =>
    request(`/assessments/hazard/${habitationId}`),
  getAssessmentHistory: (habitationId) =>
    request(`/assessments/hazard/${habitationId}/history`),

  // Relocation Priority Engine
  getAllPriorities: () => request('/priorities'),
  getLatestPriority: (habitationId) => request(`/priorities/${habitationId}`),
  calculatePriority: (habitationId) =>
    request(`/priorities/${habitationId}`, {
      method: 'POST',
    }),

  // Real-Data Ingestion & Telemetry Health
  getIngestionStatus: () => request('/ingestion/status'),
  syncLiveData: () =>
    request('/ingestion/sync', {
      method: 'POST',
    }),

  // Predictive AI Risk Engine
  getPredictiveAssessments: () => request('/predictive/assessments'),
  getHabitationPredictiveRisk: (id) => request(`/predictive/assessment/${id}`),

  // Optimal Resource Allocation (OR-Tools / Hungarian)
  optimizeAllocation: (communitySplitWeight = 0.6, distanceWeight = 0.4) =>
    request(
      `/allocation/optimize?communitySplitWeight=${communitySplitWeight}&distanceWeight=${distanceWeight}`,
      {
        method: 'POST',
      }
    ),

  // GIS & DDMA Action Plan Export
  getActionPlanSummary: () => request('/export/action-plan/summary'),
  getGeoJsonDownloadUrl: () => '/api/export/gis/geojson',

  // Field Officer SOS Reporting
  submitFieldReport: (report) =>
    request('/field-reports', {
      method: 'POST',
      body: JSON.stringify(report),
    }),
};
