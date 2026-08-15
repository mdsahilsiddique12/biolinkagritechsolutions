import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useScrollReveal } from '../hooks/useAnimations';

export default function TermsPage() {
  useScrollReveal();

  return (
    <main className="terms-page" style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-xl))' }}>
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--space-xl)' }}>
            <span className="section-label" style={{ justifyContent: 'flex-start' }}>
              <ShieldCheck size={12} /> Legal Framework
            </span>
            <h1 className="section-title">Terms &amp; Conditions</h1>
            <p className="section-subtitle" style={{ margin: 'var(--space-sm) 0 0 0', maxWidth: 'none' }}>
              Last updated: August 15, 2026. Please read these terms carefully before utilizing our bulk trading platform.
            </p>
          </div>

          <div className="glass-card reveal" style={{ padding: 'var(--space-2xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)' }}>
              1. Acceptance of Terms
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              By accessing and using the BioLink Agritech Solutions portal, you agree to be bound by these Terms &amp; Conditions, all applicable Indian laws, and GOBARdhan regulatory directives. If you disagree, access to our quoting engine and dispatch logistics network is prohibited.
            </p>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)' }}>
              2. Domestic Bulk Trading &amp; MOQ
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              All transactions conducted via BioLink Agritech are strictly domestic within the Republic of India. The platform enforces a hard **Minimum Order Quantity (MOQ) of 15 Metric Tons (MT)** per individual transaction. Orders below this threshold will be automatically rejected by our validation gateways.
            </p>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)' }}>
              3. Secure Escrow Mechanism
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              All payments are processed ex-factory gate and held securely in escrow. Funds are not authorized for release to the manufacturing CBG plant until:
            </p>
            <ul style={{ paddingLeft: 'var(--space-lg)', color: 'var(--text-secondary)', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>The consignment is delivered to your designated Indian pincode destination.</li>
              <li>A cryptographically secure QA clearance token is submitted and validated.</li>
              <li>Verification is completed showing moisture is below 30% and batch specs are met.</li>
            </ul>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)' }}>
              4. Quality Disputes &amp; Lab Certificates
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Every batch is accompanied by a government-approved lab analysis certificate. In the event that delivered Fermented Organic Manure (FOM) fails onsite verification, buyers may raise a dispute using their secure QA token. Disputes freeze the escrow release pending manual administrative review.
            </p>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)' }}>
              5. Limitation of Liability
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              BioLink Agritech Solutions acts as a technology coordinator. While we verify all supplying partner plants, the platform is not directly liable for physical crop damages or logistics delays caused by third-party national freight networks.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
