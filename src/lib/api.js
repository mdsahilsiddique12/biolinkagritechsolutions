const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
        data.message ||
        (Array.isArray(data.issues) && data.issues[0]?.message) ||
        'Request failed.'
    );
  }

  return data;
}

/**
 * Partner-authenticated request — uses partner_token instead of buyer token.
 */
async function partnerRequest(path, options = {}) {
  const token = localStorage.getItem('partner_token');
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
        data.message ||
        (Array.isArray(data.issues) && data.issues[0]?.message) ||
        'Request failed.'
    );
  }

  return data;
}

export const api = {
  // ── Buyer Auth ──
  login(payload) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  register(payload) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // ── Contact ──
  submitContact(payload) {
    return request('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  submitContactForm(payload) {
    return request('/contact/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // ── Quotes ──
  calculateQuote(payload) {
    return request('/quotes/calculate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  claimQuote(quoteId, payload) {
    return request(`/quotes/${quoteId}/claim`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // ── Retail ──
  subscribeRetailLaunch(payload) {
    return request('/retail/notify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // ── Tracking ──
  getTracking(trackingId) {
    return request(`/tracking/${encodeURIComponent(trackingId)}`);
  },

  // ── Referral Codes (Public) ──
  getPublicPartnerCodes() {
    return request('/partners/public/codes');
  },
  validateReferralCode(code) {
    return request(`/partners/public/validate/${encodeURIComponent(code)}`);
  },

  // ── Partner Auth ──
  partnerLogin(payload) {
    return request('/partners/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // ── Partner Dashboard (Partner-authenticated) ──
  getPartnerProfile() {
    return partnerRequest('/partners/me');
  },
  getPartnerDashboard() {
    return partnerRequest('/partners/me/dashboard');
  },
  getPartnerReferrals() {
    return partnerRequest('/partners/me/referrals');
  },
  getPartnerCommissions() {
    return partnerRequest('/partners/me/commissions');
  },
  changePartnerPassword(payload) {
    return partnerRequest('/partners/me/password', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};

