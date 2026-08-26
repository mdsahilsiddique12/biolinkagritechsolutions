import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useScrollReveal } from '../hooks/useAnimations';

/* ── reusable inline styles ── */
const sH3 = { borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', color: '#10b981', marginTop: '20px' };
const sP  = { color: '#0f172a', lineHeight: '1.7', fontSize: '0.95rem' };
const sUl = { paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', margin: 0, color: '#0f172a', lineHeight: '1.7', fontSize: '0.95rem' };
const sDiv = { color: '#0f172a', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem' };

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
            <h1 className="section-title">Terms of Service</h1>
            <p className="section-subtitle" style={{ margin: 'var(--space-sm) 0 0 0', maxWidth: 'none' }}>
              Effective Date: August 26, 2026 · Last Updated: August 26, 2026
            </p>
          </div>

          <div className="glass-card reveal" style={{ padding: 'var(--space-2xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

            {/* Preamble */}
            <p style={sP}>
              Welcome to BioLink Agritech Solutions ("BioLink", "we", "us", or "our"), accessible through <strong>biolinkagri.in</strong>.
              BioLink operates as an independent B2B agricultural-input sourcing, supply and logistics-coordination business.
              By submitting an enquiry, requesting a quotation or sample, issuing a purchase order, making a payment, or otherwise
              entering into a transaction with BioLink, the relevant customer ("Buyer", "you" or "your") acknowledges and agrees
              to these Terms together with the applicable quotation, purchase order, invoice and/or written commercial agreement.
            </p>
            <p style={sP}>
              For institutional and corporate transactions, the specific quotation, purchase order and mutually executed commercial
              agreement shall prevail over these general Terms to the extent of any inconsistency.
            </p>

            {/* 1 */}
            <h3 style={sH3}>1. Nature of BioLink's Business</h3>
            <div style={sDiv}>
              <p>BioLink is an independent B2B sourcing and supply intermediary. Unless expressly stated otherwise in writing, BioLink:</p>
              <ul style={sUl}>
                <li>Does not manufacture Fermented Organic Manure ("FOM") or other agricultural inputs;</li>
                <li>Does not own or operate production facilities from which third-party products are sourced;</li>
                <li>Does not represent itself as the manufacturer of third-party products;</li>
                <li>Does not ordinarily own or operate its own transportation fleet;</li>
                <li>May coordinate sourcing, commercial negotiations, documentation, sampling, transportation and delivery between Buyers and third-party producers/suppliers.</li>
              </ul>
              <p>The originating producer or supplier remains responsible for its own manufacturing processes and regulatory obligations. BioLink's responsibilities are limited to services expressly undertaken in the applicable commercial documentation.</p>
            </div>

            {/* 2 */}
            <h3 style={sH3}>2. Third-Party Source &amp; Confidentiality</h3>
            <p style={sP}>
              BioLink may source products from suitable third-party production facilities, including eligible commercial CBG/biogas plants.
              The identity and commercial terms of upstream suppliers may constitute confidential commercial information and may not be
              disclosed except where required by applicable law or a mutually agreed procurement arrangement. BioLink may provide appropriate
              product, batch, laboratory or regulatory documentation reasonably required for a Buyer's due-diligence process.
            </p>

            {/* 3 */}
            <h3 style={sH3}>3. Product Description &amp; Specifications</h3>
            <div style={sDiv}>
              <p>Product descriptions published by BioLink are provided for commercial and evaluation purposes. Applicable specifications are determined by the product category, applicable law, producer documentation, and available batch analysis.</p>
              <p>For FOM and other organic inputs, natural batch-to-batch variation may occur. No website statement shall be interpreted as a guarantee of crop yield, disease prevention, pest elimination, or any other agricultural outcome unless expressly supported by the applicable written specification or commercial agreement.</p>
            </div>

            {/* 4 */}
            <h3 style={sH3}>4. Manufacturer Responsibility</h3>
            <div style={sDiv}>
              <p>The originating manufacturer/producer is responsible for its manufacturing process, applicable registrations and approvals, product composition, regulatory compliance, manufacturing-stage quality control, and batch-specific specifications.</p>
              <p>BioLink does not independently manufacture or reformulate third-party FOM. BioLink shall not knowingly alter, falsify or misrepresent third-party laboratory reports, certificates, or other regulatory documentation.</p>
            </div>

            {/* 5 */}
            <h3 style={sH3}>5. Buyer Due Diligence &amp; Sample Evaluation</h3>
            <p style={sP}>
              Buyers purchasing in commercial quantities are encouraged to conduct appropriate due diligence. Where commercially agreed,
              BioLink may facilitate a representative sample for visual inspection, laboratory testing, or other pre-purchase assessment.
              Unless otherwise agreed, the Buyer bears the cost of independent testing. A sample supplied for evaluation does not
              constitute a warranty of crop performance.
            </p>

            {/* 6 */}
            <h3 style={sH3}>6. No Agricultural Performance Guarantee</h3>
            <p style={sP}>
              BioLink does not guarantee that any product will increase crop yield, fruit size, Brix, or shelf life, or eliminate pests,
              diseases, pathogens, or weeds, or produce any particular agricultural result. Agricultural outcomes depend on soil,
              crop variety, climate, irrigation, application, and other factors. The Buyer is responsible for determining suitability
              and obtaining qualified agronomic advice.
            </p>

            {/* 7 */}
            <h3 style={sH3}>7. Quotations &amp; Pricing</h3>
            <div style={sDiv}>
              <p>All prices are subject to the terms stated in the applicable quotation. Unless expressly stated as "delivered", quotations are ex-source/ex-plant and transportation, taxes and other charges may be additional. Prices may vary based on source availability, quantity, batch, destination, vehicle type, tolls, taxes, and market conditions.</p>
              <p>A quotation does not constitute a binding supply commitment until accepted in accordance with the quotation's stated validity period.</p>
            </div>

            {/* 8 */}
            <h3 style={sH3}>8. Orders &amp; Acceptance</h3>
            <div style={sDiv}>
              <p>An order becomes binding only when BioLink has accepted the Buyer's order and/or issued written confirmation, and received any required advance payment.</p>
              <p>BioLink reserves the right to decline or cancel an order where the product is unavailable, specifications cannot be met, logistics cannot be arranged, required documentation is unavailable, the transaction would violate applicable law, or circumstances beyond BioLink's control prevent fulfilment.</p>
            </div>

            {/* 9 */}
            <h3 style={sH3}>9. Payment Terms</h3>
            <p style={sP}>
              Payment terms shall be stated in the applicable quotation, purchase order, or commercial agreement. BioLink's standard
              B2B structure may be 50% advance upon confirmed booking and 50% against the agreed delivery milestone; exact terms may
              vary for institutional transactions. BioLink does not represent ordinary customer payments as being held in a regulated
              escrow arrangement unless a separate written escrow arrangement has actually been established.
            </p>

            {/* 10 */}
            <h3 style={sH3}>10. Delivery &amp; Logistics</h3>
            <div style={sDiv}>
              <p>BioLink may arrange transportation through independent third-party transporters or logistics partners. Unless otherwise agreed, transportation is performed by an independent carrier; estimated delivery dates are indicative; and delays caused by traffic, weather, vehicle breakdown, road restrictions, force majeure or other external circumstances shall not constitute a material breach where BioLink has exercised reasonable efforts.</p>
              <p>The Buyer shall ensure the delivery location is reasonably accessible to the agreed vehicle.</p>
            </div>

            {/* 11 */}
            <h3 style={sH3}>11. Inspection Upon Delivery</h3>
            <p style={sP}>
              The Buyer should inspect the consignment within a reasonable period after delivery and promptly notify BioLink
              with appropriate evidence if any apparent issue is identified regarding quantity, visible contamination, significant
              physical damage, or an apparent product mismatch. Reasonable batch-to-batch variation in physical appearance and
              moisture may occur where consistent with the applicable specification.
            </p>

            {/* 12 */}
            <h3 style={sH3}>12. Quality Claims &amp; Rejection</h3>
            <div style={sDiv}>
              <p>A claim concerning product quality must identify the order/invoice number, batch/consignment identification, nature of the non-conformity, quantity affected, photographic/video evidence, and laboratory analysis where the dispute concerns a technical specification.</p>
              <p>If a confirmed non-conformity is established against an expressly agreed product specification, the remedy may include replacement, credit, refund or another mutually agreed remedy. BioLink shall not be responsible for non-conformity caused by improper storage, contamination, alteration, incorrect application, or misuse after delivery.</p>
            </div>

            {/* 13 */}
            <h3 style={sH3}>13. Limitation of Liability</h3>
            <div style={sDiv}>
              <p>BioLink does not assume the manufacturer's obligations merely because BioLink arranged sourcing, sale or delivery of a third-party product. To the maximum extent permitted by law, BioLink shall not be liable for indirect, consequential, special or remote losses, including loss of anticipated profits, crop yield, business opportunity or goodwill.</p>
              <p>Nothing in these Terms excludes or restricts liability that cannot lawfully be excluded, including liability arising from fraud or wilful misconduct.</p>
            </div>

            {/* 14 */}
            <h3 style={sH3}>14. Manufacturer / Producer Liability</h3>
            <p style={sP}>
              Where a claim arises specifically from the manufacturing, formulation, composition or production of a third-party product,
              BioLink may assist the Buyer in communicating the claim to the originating producer. Nothing in these Terms prevents a
              Buyer from exercising rights available against a manufacturer under applicable law. BioLink shall cooperate reasonably
              in identifying the responsible party where legally required or contractually agreed.
            </p>

            {/* 15 */}
            <h3 style={sH3}>15. Buyer Responsibilities</h3>
            <ul style={sUl}>
              <li>Providing accurate delivery information and ensuring appropriate site access;</li>
              <li>Inspecting material where reasonably practicable;</li>
              <li>Using the product only for appropriate agricultural purposes;</li>
              <li>Following applicable product instructions and storing appropriately after delivery;</li>
              <li>Conducting independent testing where required by its own procurement policy;</li>
              <li>Obtaining professional agronomic advice where necessary;</li>
              <li>Complying with applicable laws governing the Buyer's agricultural operations.</li>
            </ul>

            {/* 16 */}
            <h3 style={sH3}>16. Force Majeure</h3>
            <p style={sP}>
              BioLink shall not be liable for failure or delay caused by circumstances beyond its reasonable control, including natural
              disasters, severe weather, epidemic/pandemic restrictions, governmental restrictions, transportation disruptions, strikes,
              plant shutdowns, source unavailability, or other events that could not reasonably have been prevented. The affected party
              shall make reasonable efforts to mitigate consequences and resume performance.
            </p>

            {/* 17 */}
            <h3 style={sH3}>17. Confidentiality</h3>
            <p style={sP}>
              Commercial information exchanged between BioLink and a Buyer — including supplier information, pricing, sourcing
              arrangements, and technical documentation — shall be treated with reasonable care. Neither party shall disclose
              confidential information except with permission, to professional advisers, to employees/contractors who need it,
              where required for fulfilment, or where required by law or a competent authority.
            </p>

            {/* 18 */}
            <h3 style={sH3}>18. Intellectual Property</h3>
            <p style={sP}>
              All BioLink trademarks, logos, website content, graphics, documents, designs, text and other proprietary materials
              remain the property of BioLink or the relevant rights holder. No Buyer may reproduce, modify, distribute or
              commercially exploit BioLink materials without prior written permission, except where use is necessary for an agreed transaction.
            </p>

            {/* 19 */}
            <h3 style={sH3}>19. Privacy</h3>
            <p style={sP}>
              Personal information submitted through the BioLink website or during commercial communications shall be handled
              in accordance with BioLink's Privacy Policy, which forms part of these Terms to the extent applicable.
            </p>

            {/* 20 */}
            <h3 style={sH3}>20. Third-Party Services</h3>
            <p style={sP}>
              BioLink may use third-party service providers for transportation, payment processing, communication, website hosting,
              analytics, laboratory services and other business-support functions. The use of a third-party service does not make
              that provider an employee or agent of BioLink unless expressly agreed.
            </p>

            {/* 21 */}
            <h3 style={sH3}>21. Institutional Procurement</h3>
            <p style={sP}>
              For institutional, corporate, cooperative or large-volume transactions, the Buyer's purchase order, vendor onboarding terms,
              or master supply agreement may contain additional requirements. Where the parties expressly execute such an agreement, it
              shall govern the transaction in case of conflict with these general Terms. Upstream supplier information that is commercially
              confidential may be subject to disclosure restrictions unless required by law or expressly agreed.
            </p>

            {/* 22 */}
            <h3 style={sH3}>22. No Agency or Partnership</h3>
            <p style={sP}>
              Unless expressly agreed in writing, nothing in these Terms creates a partnership, joint venture, employment relationship,
              franchise, fiduciary relationship, or general agency between BioLink and the Buyer. Where BioLink acts as an intermediary
              for a specific transaction, the scope of authority shall be limited to the written authorization applicable to that transaction.
            </p>

            {/* 23 */}
            <h3 style={sH3}>23. Governing Law</h3>
            <p style={sP}>
              These Terms shall be governed by the laws of India. Subject to any mandatory jurisdiction and any dispute-resolution clause
              in a specific commercial agreement, the courts having competent jurisdiction in <strong>Patna, Bihar</strong> shall have
              jurisdiction over disputes arising between BioLink and the Buyer.
            </p>

            {/* 24 */}
            <h3 style={sH3}>24. Dispute Resolution</h3>
            <p style={sP}>
              The parties shall first attempt to resolve any commercial dispute through good-faith discussions between their authorized
              representatives. If unresolved, the parties may use the dispute-resolution mechanism specified in the applicable commercial
              contract. Nothing in this clause prevents either party from seeking urgent interim relief under applicable law.
            </p>

            {/* 25 */}
            <h3 style={sH3}>25. Modification of Terms</h3>
            <p style={sP}>
              BioLink may update these Terms from time to time. The version applicable to a particular transaction shall generally be the
              version in effect when the relevant order is accepted, unless otherwise agreed. Material changes shall not automatically alter
              existing contractual commitments.
            </p>

            {/* 26 */}
            <h3 style={sH3}>26. Severability</h3>
            <p style={sP}>
              If any provision of these Terms is determined to be invalid, unlawful or unenforceable by a competent authority, that
              provision shall be interpreted or limited to the minimum extent necessary, and the remaining provisions shall continue in effect.
            </p>

            {/* 27 */}
            <h3 style={sH3}>27. Entire Agreement &amp; Precedence</h3>
            <div style={sDiv}>
              <p>For a particular transaction, these Terms shall be read together with the quotation, purchase order, invoice, product specification, delivery terms, and any separately executed commercial agreement. In case of conflict, the following order of precedence applies unless otherwise agreed:</p>
              <ol style={{ ...sUl, listStyleType: 'decimal' }}>
                <li>Signed commercial agreement / master supply agreement</li>
                <li>Accepted purchase order and written amendments</li>
                <li>Accepted quotation</li>
                <li>Product-specific written specifications</li>
                <li>These general Terms of Service</li>
              </ol>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
