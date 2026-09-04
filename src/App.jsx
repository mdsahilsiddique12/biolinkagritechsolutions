import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import InstitutionalPage from './pages/InstitutionalPage';
import RetailShopPage from './pages/RetailShopPage';
import LogisticsPage from './pages/LogisticsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import PartnerLoginPage from './pages/PartnerLoginPage';
import PartnerDashboardPage from './pages/PartnerDashboardPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import LabReportsPage from './pages/LabReportsPage';
import NurseryGuidePage from './pages/NurseryGuidePage';
import { AuthProvider } from './context/AuthContext';
import { PartnerAuthProvider } from './context/PartnerAuthContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/institutional" element={<InstitutionalPage />} />
        <Route path="/shop" element={<RetailShopPage />} />
        <Route path="/logistics" element={<LogisticsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/partner" element={<PartnerLoginPage />} />
        <Route path="/partner/login" element={<PartnerLoginPage />} />
        <Route path="/partner-login" element={<PartnerLoginPage />} />
        <Route path="/partner/dashboard" element={<PartnerDashboardPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/lab-reports" element={<LabReportsPage />} />
        <Route path="/help" element={<NurseryGuidePage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PartnerAuthProvider>
          <AppContent />
        </PartnerAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}


