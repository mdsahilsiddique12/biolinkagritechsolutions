import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const PartnerAuthContext = createContext(null);

export function PartnerAuthProvider({ children }) {
  const [partner, setPartner] = useState(null);
  const [partnerToken, setPartnerToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('partner_token');
    const savedPartner = localStorage.getItem('partner_user');
    if (savedToken && savedPartner) {
      setPartnerToken(savedToken);
      setPartner(JSON.parse(savedPartner));
    }
    setLoading(false);
  }, []);

  const partnerLogin = async (email, password) => {
    const response = await api.partnerLogin({ email, password });
    if (response.token) {
      localStorage.setItem('partner_token', response.token);
      localStorage.setItem('partner_user', JSON.stringify(response.partner));
      setPartnerToken(response.token);
      setPartner(response.partner);
      return response;
    }
    throw new Error(response.error || 'Partner authentication failed');
  };

  const partnerLogout = () => {
    localStorage.removeItem('partner_token');
    localStorage.removeItem('partner_user');
    setPartnerToken(null);
    setPartner(null);
  };

  return (
    <PartnerAuthContext.Provider value={{ partner, partnerToken, loading, partnerLogin, partnerLogout }}>
      {children}
    </PartnerAuthContext.Provider>
  );
}

export function usePartnerAuth() {
  const context = useContext(PartnerAuthContext);
  if (!context) {
    throw new Error('usePartnerAuth must be used within a PartnerAuthProvider');
  }
  return context;
}
