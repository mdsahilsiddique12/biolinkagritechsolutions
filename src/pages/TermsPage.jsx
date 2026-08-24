import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useScrollReveal } from '../hooks/useAnimations';

export default function TermsPage() {
  const revealRef = useScrollReveal();

  return (
    <main ref={revealRef} className="terms-page" style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-xl))' }}>
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-header" style={{ textAlign: 'left', marginBottom: 'var(--space-xl)' }}>
            <span className="section-label" style={{ justifyContent: 'flex-start' }}>
              <ShieldCheck size={12} /> Legal Framework
            </span>
            <h1 className="section-title">Terms &amp; Conditions</h1>
            <p className="section-subtitle" style={{ margin: 'var(--space-sm) 0 0 0', maxWidth: 'none' }}>
              Last Updated: August 24, 2026
            </p>
          </div>

          <div className="glass-card reveal" style={{ padding: 'var(--space-2xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <p style={{ color: 'var(--text-primary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              Welcome to BioLink Agri (accessible via biolinkagri.in). By accessing our website, 
              initiating transactions, registering profiles, or issuing bulk booking payloads, 
              you (the "User", "Buyer", or "Seller") agree to be legally bound by these Terms and 
              Conditions. Please read them with extreme care before utilizing our platform services.
            </p>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)', color: 'var(--neon-green)', marginTop: 'var(--space-md)' }}>
              1. Nature of Service and Limitation of Role
            </h3>
            <p style={{ color: 'var(--text-primary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              BioLink Agri is an independent digital marketplace architecture and escrow facilitator. 
              BioLink Agri <strong>DOES NOT</strong> own, manufacture, store, bag, cure, or physically possess any 
              organic fertilizer, Fermented Organic Manure (FOM), or bio-agro byproducts. Furthermore, 
              BioLink Agri <strong>DOES NOT</strong> own or operate logistics vehicles, commercial dumpers, or transport fleets.
              Our platform acts strictly as an automated digital bridge connecting institutional 
              wholesale buyers with government-registered GOBARdhan or Compressed Biogas (CBG) facilities 
              and arranging third-party logistics connectivity.
            </p>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)', color: 'var(--neon-green)', marginTop: 'var(--space-md)' }}>
              2. Absolute Indemnification and Product Liability Disclaimer
            </h3>
            <div style={{ color: 'var(--text-primary)', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
              <p>
                <strong>A. Seller/Plant Liability:</strong> The registered GOBARdhan or CBG production facility executing 
                the order is the sole "Seller" and manufacturer of the goods. The producing plant is 
                100% legally and financially liable for ensuring that the delivered commodity complies 
                with the Fertiliser Control Order (FCO) 1985 guidelines, maintaining specified 
                Organic Carbon thresholds (&gt;12-14%), keeping moisture content strictly below 30%, and 
                looking after loose batch mechanical screening free of trash, plastics, or stone gravel.
              </p>
              <p>
                <strong>B. Exclusion of BioLink Agri:</strong> BioLink Agri, its founder (Sahil Siddique), and its 
                operators accept <strong>ZERO</strong> liability for product degradation, crop failures, soil acidification, 
                pond basin contamination, yield losses, or factory gate rejections. Any legal disputes, 
                claims, or financial damages arising from product quality must be filed directly and 
                exclusively against the originating GOBARdhan/CBG production facility.
              </p>
            </div>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)', color: 'var(--neon-green)', marginTop: 'var(--space-md)' }}>
              3. Base Sourcing Price &amp; Market Dynamics
            </h3>
            <div style={{ color: 'var(--text-primary)', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
              <p>
                The introductory base rate of ₹3.00 to ₹3.50 per kg applies specifically to bulk, loose 
                Fermented Organic Manure (FOM) sourced directly from our primary regional bio-gas hubs. This 
                ex-factory gate price is dynamically structured and remains subject to variance based on 
                three critical ecosystem variables:
              </p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
                <li>
                  <strong>Plant-Specific Tariffs:</strong> Rates fluctuate depending on which precise government-certified 
                  bio-CNG facility holds ready, fully-cured, and lab-compliant batches at the exact time of order placement.
                </li>
                <li>
                  <strong>Seasonal Feedstock Availability:</strong> Biogas production inputs (such as agricultural crop residue, 
                  dairy manure, and biomass) change seasonally, directly impacting factory-gate processing costs during peak 
                  harvest or heavy monsoon periods.
                </li>
                <li>
                  <strong>Geographical Sourcing Coordinates:</strong> Final pricing is linked to the physical location of the 
                  dispatch plant relative to your farm gate, optimizing for the lowest cumulative commodity cost.
                </li>
              </ul>
            </div>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)', color: 'var(--neon-green)', marginTop: 'var(--space-md)' }}>
              4. Client-Paid Logistics Policy (Ex-Factory Sourcing)
            </h3>
            <p style={{ color: 'var(--text-primary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              All shipments are booked strictly on an Ex-Factory/Ex-Plant basis, meaning freight, transit toll-taxes, 
              and unloading fees are paid directly by the buyer. Sourcing bulk loose organic matter at industrial wholesale 
              rates is made possible only by stripping away retail distribution and fulfillment margins. Keeping logistics 
              separate ensures that you pay the literal factory cost of the manure, without built-in corporate shipping markups.
            </p>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)', color: 'var(--neon-green)', marginTop: 'var(--space-md)' }}>
              5. Comparative Regional Freight Benchmarks
            </h3>
            <div style={{ color: 'var(--text-primary)', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
              <p>
                To maintain complete corporate transparency, we benchmark transportation costs across neighboring 
                agricultural corridors. Because we route shipments dynamically, freight costs scale directly with 
                point-to-point highway distances:
              </p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
                <li>
                  <strong>Local Sourcing Zone (Within 50–80 km):</strong> Nearby farms utilizing closest regional hubs 
                  typically incur a baseline transport overhead of ₹0.40 to ₹0.75 per kg, offering the most aggressive landed cost.
                </li>
                <li>
                  <strong>Mid-Distance Sourcing Zone (e.g., Morbi to Rajkot / Gondal Belt ~90–130 km):</strong> Progressive 
                  farmers in these neighboring districts standardly budget an additional ₹0.60 to ₹1.10 per kg for a 15-tonne 
                  dumper configuration due to extended highway transit times and toll intersections.
                </li>
                <li>
                  <strong>Extended Sourcing Zone (Inter-District &gt;150 km):</strong> Large-scale fruit estates operating in 
                  distant districts easily absorb ₹1.50 to ₹2.20 per kg purely in commercial freight to secure identical 
                  certified sterile inputs, as the soil preservation and pest-elimination benefits far outweigh the highway mileage cost.
                </li>
              </ul>
            </div>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)', color: 'var(--neon-green)', marginTop: 'var(--space-md)' }}>
              6. Logistics and Transportation Liability Clearance
            </h3>
            <div style={{ color: 'var(--text-primary)', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
              <p>
                <strong>A. Third-Party Carrier Responsibility:</strong> All shipping, hauling, and vehicle positioning services 
                are executed by independent third-party logistics providers, transport brokers, open-market 
                truck unions, or freight networks (including but not limited to platforms like Wheelseye). 
              </p>
              <p>
                <strong>B. Transit Damage &amp; Delays:</strong> Once a vehicle completes its tare-and-gross weight certification 
                at the local weighbridge (Dharma Kanta), the third-party transit agency and vehicle operator 
                assume 100% liability for cargo safety, weight deviations in transit, route delays, highway 
                accidents, spillages, cross-border state permit fines, or weather-induced wetness. 
              </p>
              <p>
                <strong>C. Indemnification:</strong> BioLink Agri stands fully indemnified against transport complications. Any logistics claims 
                must be settled directly with the respective transportation entity or vehicle owner.
              </p>
            </div>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)', color: 'var(--neon-green)', marginTop: 'var(--space-md)' }}>
              7. 72-Hour Quality Escrow Rules &amp; Accountability Limits
            </h3>
            <div style={{ color: 'var(--text-primary)', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
              <p>
                <strong>A. Escrow Logic:</strong> Buyers submit a 10% token advance to book a batch and pay the 90% balance 
                into our platform's secure escrow module. BioLink Agri holds these funds as an independent 
                intermediary block.
              </p>
              <p>
                <strong>B. Gate Clearance Protocol:</strong> The buyer’s on-site plantation or processing plant Quality 
                Assurance (QA) team has a strict window of 72 hours from truck arrival to sample, inspect, 
                and test the payload. 
              </p>
              <p>
                <strong>C. Finality of Release:</strong> Clicking the verification link, issuing text authorization, or 
                allowing the 72-hour window to lapse without filing a formal dispute on our portal will 
                trigger an automated release of funds to the source GOBARdhan plant. Once funds are released 
                from escrow, the transaction is considered legally closed, and BioLink Agri cannot issue 
                refunds, reversals, or clawbacks under any circumstances.
              </p>
              <p>
                <strong>D. Rejection Management:</strong> If the buyer's QA team formally rejects a truck at the gate due to 
                verifiable FCO non-compliance, excess moisture (&gt;30%), or heavy trash, the buyer must 
                provide a signed rejection slip and lab metrics photo via our platform contact tools. 
                Upon verification, the escrow funds will be fully refunded to the buyer, and the 
                originating plant will bear 100% of the return freight costs.
              </p>
            </div>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)', color: 'var(--neon-green)', marginTop: 'var(--space-md)' }}>
              8. Tax Exemption and Invoicing Metrics
            </h3>
            <p style={{ color: 'var(--text-primary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              BioLink Agri operates as an independent digital brokerage firm under small-business MSME tax-exempt 
              thresholds (pursuant to Section 22 of the Central Goods and Services Tax Act). We issue standard, non-GST 
              Commercial Bills of Supply. Buyers are solely responsible for managing internal corporate tax disclosures 
              and corporate compliance inside their respective operational jurisdictions.
            </p>

            <h3 style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-xs)', color: 'var(--neon-green)', marginTop: 'var(--space-md)' }}>
              9. Governing Law and Jurisdiction
            </h3>
            <p style={{ color: 'var(--text-primary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              Any legal friction, arbitration, or system interpretation queries arising directly between 
              the User and BioLink Agri shall be governed exclusively by the laws of India, and are subject 
              to the absolute and exclusive jurisdiction of the competent courts located in Patna, Bihar, India.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
