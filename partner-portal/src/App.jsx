import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PartnerLoginPage from './pages/PartnerLoginPage';
import PartnerDashboardPage from './pages/PartnerDashboardPage';
import { PartnerAuthProvider } from './context/PartnerAuthContext';

export default function App() {
  return (
    <BrowserRouter>
      <PartnerAuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<PartnerLoginPage />} />
          <Route path="/dashboard" element={<PartnerDashboardPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </PartnerAuthProvider>
    </BrowserRouter>
  );
}
