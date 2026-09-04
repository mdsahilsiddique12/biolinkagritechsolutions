const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

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
  partnerLogin(payload) {
    return partnerRequest('/partners/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  partnerRegister(payload) {
    return partnerRequest('/partners/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
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
