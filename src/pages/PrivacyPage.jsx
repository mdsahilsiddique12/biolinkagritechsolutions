import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useScrollReveal } from '../hooks/useAnimations';

export default function PrivacyPage() {
  const revealRef = useScrollReveal();

  return (
    <main ref={revealRef} className="privacy-page" style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-xl))' }}>
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--space-xl)' }}>
            <span className="section-label" style={{ justifyContent: 'flex-start' }}>
              <ShieldAlert size={12} /> Compliance Safeguards
            </span>
            <h1 className="section-title">Privacy Policy</h1>
            <p className="section-subtitle" style={{ margin: 'var(--space-sm) 0 0 0', maxWidth: 'none' }}>
              Last Updated: August 24, 2026
            </p>
          </div>

          <div className="glass-card reveal" style={{ padding: 'var(--space-2xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <p style={{ color: 'var(--text-primary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              At BioLink Agri (biolinkagri.in), we respect the privacy of our ecosystem users. This 
              Privacy Policy outlines how we gather, protect, process, and store data when you interact 
              with our digital B2B brokerage matching network, contact pipelines, or login modules.
            </p>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)', color: 'var(--neon-green)', marginTop: 'var(--space-md)' }}>
              1. Data We Collect Completely Voluntarily
            </h3>
            <p style={{ color: 'var(--text-primary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              To arrange bulk 15-tonne freight logistics and verify NPK batch records, we process 
              critical professional and business parameters:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-primary)', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0, fontSize: '0.95rem' }}>
              <li><strong>Identity Profiles:</strong> Contact Name, Corporate Estate Title, Sourcing Sector, or GOBARdhan Facility ID logs.</li>
              <li><strong>Communication Anchors:</strong> Business Email Addresses (<code>info@</code>), mobile numbers used for WhatsApp dispatch notifications, and target shipping PIN codes.</li>
              <li><strong>Transaction Ledgers:</strong> Order tonnage volumes, computed distance metrics, weight slip images, and transaction status timelines.</li>
              <li><strong>System Identifiers:</strong> Network IP addresses used during login processing to prevent NoSQL injection exploits or brute-force data scraping.</li>
            </ul>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)', color: 'var(--neon-green)', marginTop: 'var(--space-md)' }}>
              2. How We Securely Utilize Your Data
            </h3>
            <p style={{ color: 'var(--text-primary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              We process your corporate data exclusively to execute transactional and logistics flows:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-primary)', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0, fontSize: '0.95rem' }}>
              <li>To match your estate automatically with the closest registered GOBARdhan supply node.</li>
              <li>To transmit automated HTML receipts and lab certifications via custom Nodemailer SMTP arrays.</li>
              <li>To generate weight-bridge data configurations for third-party logistics dispatch groups.</li>
              <li>To protect our transaction databases from digital security vulnerabilities and data manipulation.</li>
            </ul>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)', color: 'var(--neon-green)', marginTop: 'var(--space-md)' }}>
              3. Data Sharing Protocols for System Operations
            </h3>
            <p style={{ color: 'var(--text-primary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              We do not sell, rent, or lease your private data blocks to retail advertising networks. 
              To complete an order, your data is shared with exactly two essential operational nodes:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-primary)', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0, fontSize: '0.95rem' }}>
              <li><strong>The Supplying GOBARdhan/CBG Plant:</strong> Receives the buyer's name, phone number, and delivery PIN code to process the physical dumper loading checklist.</li>
              <li><strong>The Freight Carrier / Logistics Agency:</strong> Receives the delivery address coordinate matrix (such as via platforms like Wheelseye or truck unions) to map the physical driving route.</li>
            </ul>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)', color: 'var(--neon-green)', marginTop: 'var(--space-md)' }}>
              4. System Security and Data Architecture
            </h3>
            <p style={{ color: 'var(--text-primary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              Your login data is fully protected using standard industry security protocols. All profile passwords 
              are mathematically masked using bcrypt hashing algorithms before hitting our Prisma/MongoDB storage 
              layers. Our platform endpoints run securely under active SSL (HTTPS) encryption layers to prevent 
              external interception of your business logs.
            </p>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)', color: 'var(--neon-green)', marginTop: 'var(--space-md)' }}>
              5. Contact and Compliance Corridor
            </h3>
            <div style={{ color: 'var(--text-primary)', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem' }}>
              <p>
                If you wish to review, update, or permanently delete your user profile records from the 
                BioLink Agri database, please contact our privacy desk directly at:
              </p>
              <p style={{ paddingLeft: 'var(--space-md)', borderLeft: '3px solid var(--neon-cyan)', margin: 'var(--space-xs) 0' }}>
                ✉️ Email: <strong><a href="mailto:info@biolinkagri.in" style={{ color: 'var(--neon-cyan)' }}>info@biolinkagri.in</a></strong><br />
                📌 Corporate Hub: Patna, Bihar, India
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
