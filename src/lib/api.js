const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        (Array.isArray(data.issues) && data.issues[0]?.message) ||
        'Request failed.'
    );
  }

  return data;
}

export const api = {
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
  subscribeRetailLaunch(payload) {
    return request('/retail/notify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getTracking(trackingId) {
    return request(`/tracking/${encodeURIComponent(trackingId)}`);
  },
};
