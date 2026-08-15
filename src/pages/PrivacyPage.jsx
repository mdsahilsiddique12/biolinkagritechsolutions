import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useScrollReveal } from '../hooks/useAnimations';

export default function PrivacyPage() {
  useScrollReveal();

  return (
    <main className="privacy-page" style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-xl))' }}>
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--space-xl)' }}>
            <span className="section-label" style={{ justifyContent: 'flex-start' }}>
              <ShieldAlert size={12} /> Compliance Safeguards
            </span>
            <h1 className="section-title">Privacy Policy</h1>
            <p className="section-subtitle" style={{ margin: 'var(--space-sm) 0 0 0', maxWidth: 'none' }}>
              Last updated: August 15, 2026. Your business data protection details.
            </p>
          </div>

          <div className="glass-card reveal" style={{ padding: 'var(--space-2xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)' }}>
              1. Information Collection
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              We collect relevant corporate and procurement information required to generate delivered manure price quotes and coordinate ex-factory gate dispatches. This includes business representative name, company/estate name, email address, WhatsApp contact number, delivery address, and target Indian pincodes.
            </p>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)' }}>
              2. Data Utilization &amp; Matching
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Your pricing requests and business contact details are shared exclusively with the verified supplying biogas manufacturing plants and our integrated logistics networks. We do not sell or lease corporate data to third-party commercial marketing networks.
            </p>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)' }}>
              3. Cryptographic Verification &amp; Security
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              All transactional endpoints, including QA tokens and order statuses, utilize SHA-256 hashing. Customer account passwords and security parameters are hashed using industry-standard cryptography. Direct API access is guarded by rate limiters to prevent brute-force database scraping.
            </p>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)' }}>
              4. Cookies and Analytical Tools
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              We utilize technical cookies to manage portal login states and verify active sessions. Analytical tracking data is kept strictly inside localized small-business metrics to optimize matching query execution times.
            </p>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)' }}>
              5. Regulatory Disclosures
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              In compliance with local tax-exempt rules, GOBARdhan framework directives, or official Indian judicial directives, BioLink Agritech may disclose transaction records to relevant compliance auditors when legally required.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
