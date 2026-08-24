import { useState } from 'react';
import { MapPin, FlaskConical, ArrowRight } from 'lucide-react';
import ParticleField from '../components/ParticleField';
import './LabReportsPage.css';

/* ═══════════════════════════════════════════ shared pieces ═══ */
const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 20C4 20 3 11 9 6C15 1 21 3 21 3C21 3 22 10 17 15C12 20 4 20 4 20Z" fill="#1E3B2A"/>
    <path d="M4 20C8 16 12 12 20 4" stroke="#DCE6CC" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

function ReportHeader() {
  return (
    <div className="rp-header">
      <div className="rp-brand">
        <div className="rp-brand-mark"><LeafIcon /></div>
        <div>
          <div className="rp-brand-name">BioLink Agritech Solutions</div>
          <div className="rp-brand-sub">Farm Input Quality &amp; Traceability</div>
        </div>
      </div>
      <div className="rp-header-right">
        <div className="rp-site">biolinkagri.in</div>
        <div className="rp-tag">Factory-direct organic inputs, lab verified</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ dial component ═══ */
function Dial({ bandLeft, bandWidth, markLeft, min, max }) {
  return (
    <>
      <div className="rp-dial-track">
        <div className="rp-dial-band" style={{ left: `${bandLeft}%`, width: `${bandWidth}%` }} />
        <div className="rp-dial-mark" style={{ left: `${markLeft}%` }} />
      </div>
      <div className="rp-dial-legend"><span>{min}</span><span>{max}</span></div>
    </>
  );
}

/* ═══════════════════════════════════════════ FOM Report ═══ */
function FOMReport() {
  const bars = [
    { name: 'pH', method: 'FCO 1985', val: '7.32', width: 52.3 },
    { name: 'Moisture', method: 'FCO 1985', val: '34.66 %', width: 34.66 },
    { name: 'Organic Carbon', method: 'FCO 1985', val: '32.6 %', width: 32.6 },
    { name: 'C:N Ratio', method: 'FCO 1985', val: '26.08', width: 65.2 },
    { name: 'Total Nitrogen', method: 'FCO 1985', val: '1.25 %', width: 25.0 },
    { name: 'Total Phosphates (P₂O₅)', method: 'FCO 1985', val: '0.57 %', width: 19.0 },
    { name: 'Total Potassium (K₂O)', method: 'FCO 1985', val: '0.54 %', width: 18.0 },
  ];

  const rows = [
    { si: 1, param: 'pH', method: 'FCO 1985', result: '7.32', unit: '—', range: '6.5 – 8.4', dial: { bandLeft: 46.43, bandWidth: 13.57, markLeft: 52.29, min: 0, max: 14 }, remark: 'within', remarkText: 'Within range' },
    { si: 2, param: 'Moisture', method: 'FCO 1985', result: '34.66', unit: '%', range: '30.0 – 70.0 (max.)', dial: { bandLeft: 30.0, bandWidth: 40.0, markLeft: 34.66, min: 0, max: 100 }, remark: 'within', remarkText: 'Within range' },
    { si: 3, param: 'Organic Carbon (TOC)', method: 'FCO 1985', result: '32.6', unit: '%', range: '≥ 14.0 (min.)', dial: { bandLeft: 35.0, bandWidth: 65.0, markLeft: 81.5, min: 0, max: 40 }, remark: 'within', remarkText: 'Within range' },
    { si: 4, param: 'C:N Ratio', method: 'FCO 1985', result: '26.08', unit: '—', range: '≤ 30.0 (max.)', dial: { bandLeft: 0, bandWidth: 75, markLeft: 65.2, min: 0, max: 40 }, remark: 'within', remarkText: 'Within range' },
    { si: 5, param: 'Total Nitrogen (N)', method: 'FCO 1985', result: '1.25', unit: '%', range: 'See combined NPK²', dial: { bandLeft: 0, bandWidth: 100, markLeft: 41.67, min: 0, max: 3 }, remark: 'combined', remarkText: 'Counts to combined' },
    { si: 6, param: 'Total Phosphates (P₂O₅)', method: 'FCO 1985', result: '0.57', unit: '%', range: 'See combined NPK²', dial: { bandLeft: 0, bandWidth: 100, markLeft: 19.0, min: 0, max: 3 }, remark: 'combined', remarkText: 'Counts to combined' },
    { si: 7, param: 'Total Potassium (K₂O)', method: 'FCO 1985', result: '0.54', unit: '%', range: 'See combined NPK²', dial: { bandLeft: 0, bandWidth: 100, markLeft: 18.0, min: 0, max: 3 }, remark: 'combined', remarkText: 'Counts to combined' },
  ];

  return (
    <div className="report-sheet">
      <ReportHeader />

      {/* title */}
      <div className="rp-title-block">
        <div className="rp-eyebrow">Input Quality Summary</div>
        <div className="rp-title">FOM — Fermented Organic Manure &nbsp;<span>— Test Result Overview</span></div>
        <div className="rp-meta-row">
          <div className="rp-meta-item"><div className="rp-k">Summary Ref.</div><div className="rp-v">BLK/EQ-02/2025</div></div>
          <div className="rp-meta-item"><div className="rp-k">Original Lab Ref.</div><div className="rp-v">EL/RJK/2511058</div></div>
          <div className="rp-meta-item"><div className="rp-k">Date Issued</div><div className="rp-v">24 Nov 2025</div></div>
          <div className="rp-meta-item"><div className="rp-k">Sample Condition</div><div className="rp-v">Satisfactory</div></div>
        </div>
      </div>

      {/* panels */}
      <div className="rp-panels">
        <div className="rp-panel">
          <div className="rp-panel-head"><div className="rp-dot" /><h3>Sample Details</h3></div>
          <div className="rp-info-row"><div className="rp-k">Sample Name</div><div className="rp-v">FOM — Fermented Organic Manure</div></div>
          <div className="rp-info-row"><div className="rp-k">Sample Provided By</div><div className="rp-v">Customer</div></div>
          <div className="rp-info-row"><div className="rp-k">Sample Quantity</div><div className="rp-v">200 g (approx.)</div></div>
          <div className="rp-info-row"><div className="rp-k">Testing Period</div><div className="rp-v">15 Nov – 22 Nov 2025</div></div>
          <div className="rp-info-row"><div className="rp-k">Issued For</div><div className="rp-v">BioLink Farmer Network</div></div>
        </div>
        <div className="rp-panel">
          <div className="rp-panel-head"><div className="rp-dot" /><h3>Testing Laboratory</h3></div>
          <div className="rp-info-row"><div className="rp-k">Testing Agency</div><div className="rp-v">Equity Food Testing Laboratories Pvt. Ltd.</div></div>
          <div className="rp-info-row"><div className="rp-k">Test Discipline</div><div className="rp-v">Chemical</div></div>
          <div className="rp-info-row"><div className="rp-k">Method Reference</div><div className="rp-v">FCO 1985 methods</div></div>
          <div className="rp-info-row"><div className="rp-k">Tested By</div><div className="rp-v">Ayush (Lab Analyst)</div></div>
          <div className="rp-info-row"><div className="rp-k">Lab Location</div><div className="rp-v">Rajkot, Gujarat</div></div>
        </div>
      </div>

      {/* bars */}
      <div className="rp-profile">
        <div className="rp-profile-head">
          <h3>Nutrient &amp; Quality Profile</h3>
          <div className="rp-note">Bars scaled to each parameter's own measurement range, for at-a-glance reading only</div>
        </div>
        {bars.map((b) => (
          <div className="rp-bar-row" key={b.name}>
            <div className="rp-bar-label-row">
              <span className="rp-name">{b.name}</span>
              <span className="rp-method">{b.method}</span>
              <span className="rp-val">{b.val}</span>
            </div>
            <div className="rp-bar-track"><div className="rp-bar-fill" style={{ width: `${b.width}%` }} /></div>
          </div>
        ))}
      </div>

      {/* table */}
      <div className="rp-table-section">
        <div className="rp-table-head">
          <h3>Certified Analysis Table</h3>
          <div className="rp-table-badge">FCO 1985 Referenced</div>
        </div>
        <div className="rp-coa-wrap">
          <table className="rp-coa">
            <thead>
              <tr>
                <th className="rp-num">SI</th><th>Parameter</th><th>Result</th><th>Unit</th>
                <th>FCO 1985 Reference Range</th><th>Position in Range</th><th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.si}>
                  <td className="rp-num">{r.si}</td>
                  <td className="rp-param">{r.param}<span className="rp-method-label">{r.method}</span></td>
                  <td className="rp-result">{r.result}</td>
                  <td>{r.unit}</td>
                  <td className="rp-range">{r.range}</td>
                  <td className="rp-dial-cell"><Dial {...r.dial} /></td>
                  <td><span className={`rp-remark rp-remark--${r.remark}`}>{r.remarkText}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="rp-table-foot">
            <b>Reference basis:</b> Ranges shown follow the FCO 1985 (as amended) specification for Fermented
            Organic Manure (FOM). ² FCO sets a single <b>combined</b> minimum of N + P₂O₅ + K₂O ≥ 1.2% by weight;
            this sample's combined total is <b>2.36%</b>, which is within the combined requirement. Full FCO conformity
            also requires parameters not covered in this sample's test scope (e.g. particle size, conductivity, pathogens, heavy metals).
          </div>
        </div>
      </div>

      {/* seal + signature */}
      <div className="rp-certify">
        <div className="rp-seal">
          <div className="rp-s1">LAB<br />VERIFIED</div>
          <div className="rp-s2">BIOLINK</div>
        </div>
        <div className="rp-sign-block">
          <div className="rp-sign-line" />
          <div className="rp-who">Authorised Signatory</div>
          <div className="rp-role">BioLink Agritech Solutions</div>
        </div>
      </div>

      {/* disclaimer */}
      <div className="rp-disclaimer">
        <b>Disclaimer:</b> This certificate is a <b>visual, branded representation</b> of results obtained from an independent
        third-party laboratory test on the sample described above. It has been prepared by BioLink Agritech Solutions
        for the customer's easy reference. In line with our sourcing agreements and company policy, the
        <b> original laboratory test report and manufacturer/source details are retained on file and are not issued directly
        to the farmer/customer.</b> This summary does not replace, and is not a copy of, the original certified report.
        FCO reference ranges are shown for general context only and do not constitute an official conformity certification.
        For any verification or quality query, please contact BioLink Agritech Solutions directly using the details below.
      </div>

      {/* footer */}
      <div className="rp-footer">
        <div><span className="rp-brandfoot">BioLink Agritech Solutions</span> · biolinkagri.in</div>
        <div>Summary generated 24 Aug 2026 · Valid as a reference document only</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ Solid Fertilizer Report ═══ */
function SolidFertilizerReport() {
  const bars = [
    { name: 'pH', method: 'FCO', val: '8.36', width: 59.7 },
    { name: 'Moisture', method: 'FCO', val: '82.67 %', width: 82.67 },
    { name: 'Organic Carbon', method: 'FCO', val: '55.82 %', width: 55.82 },
    { name: 'Nitrogen (N)', method: 'FCO', val: '3.11 %', width: 31.1 },
    { name: 'Phosphorus (P)', method: 'FCO', val: '0.19 %', width: 3.8 },
    { name: 'Potash (K)', method: 'FCO', val: '0.15 %', width: 3.0 },
  ];

  const rows = [
    { si: 1, param: 'pH', method: 'FCO', result: '8.36', unit: '—', range: '6.5 – 7.5', dial: { bandLeft: 46.43, bandWidth: 7.14, markLeft: 59.71, min: 0, max: 14 }, remark: 'above', remarkText: 'Above range' },
    { si: 2, param: 'Moisture', method: 'FCO', result: '82.67', unit: '%', range: '≤ 25.0 (max.)', dial: { bandLeft: 0, bandWidth: 25, markLeft: 82.67, min: 0, max: 100 }, remark: 'above', remarkText: 'Above range' },
    { si: 3, param: 'Organic Carbon', method: 'FCO', result: '55.82', unit: '%', range: '≥ 12.0 (min.)', dial: { bandLeft: 20, bandWidth: 80, markLeft: 93.03, min: 0, max: 60 }, remark: 'within', remarkText: 'Within range' },
    { si: 4, param: 'Nitrogen (N)', method: 'FCO', result: '3.11', unit: '%', range: '≥ 0.8 (min.)', dial: { bandLeft: 16, bandWidth: 84, markLeft: 62.2, min: 0, max: 5 }, remark: 'within', remarkText: 'Within range' },
    { si: 5, param: 'Phosphorus', method: 'FCO', result: '0.19', unit: '%', range: '≥ 0.4 (min.)¹', dial: { bandLeft: 20, bandWidth: 80, markLeft: 9.5, min: 0, max: 2 }, remark: 'below', remarkText: 'Below range' },
    { si: 6, param: 'Potash', method: 'FCO', result: '0.15', unit: '%', range: '≥ 0.4 (min.)¹', dial: { bandLeft: 20, bandWidth: 80, markLeft: 7.5, min: 0, max: 2 }, remark: 'below', remarkText: 'Below range' },
  ];

  return (
    <div className="report-sheet">
      <ReportHeader />

      <div className="rp-title-block">
        <div className="rp-eyebrow">Input Quality Summary</div>
        <div className="rp-title">Solid Fertilizer &nbsp;<span>— Test Result Overview</span></div>
        <div className="rp-meta-row">
          <div className="rp-meta-item"><div className="rp-k">Summary Ref.</div><div className="rp-v">BLK/QS-01/2026</div></div>
          <div className="rp-meta-item"><div className="rp-k">Original Lab Ref.</div><div className="rp-v">QFL/230526/01</div></div>
          <div className="rp-meta-item"><div className="rp-k">Date Issued</div><div className="rp-v">25 May 2026</div></div>
          <div className="rp-meta-item"><div className="rp-k">Sample Condition</div><div className="rp-v">Satisfactory</div></div>
        </div>
      </div>

      <div className="rp-panels">
        <div className="rp-panel">
          <div className="rp-panel-head"><div className="rp-dot" /><h3>Sample Details</h3></div>
          <div className="rp-info-row"><div className="rp-k">Sample Name</div><div className="rp-v">Solid Fertilizer</div></div>
          <div className="rp-info-row"><div className="rp-k">Sample Provided By</div><div className="rp-v">Customer</div></div>
          <div className="rp-info-row"><div className="rp-k">Sample Quantity</div><div className="rp-v">500 g (approx.)</div></div>
          <div className="rp-info-row"><div className="rp-k">Testing Period</div><div className="rp-v">23 May – 25 May 2026</div></div>
          <div className="rp-info-row"><div className="rp-k">Issued For</div><div className="rp-v">BioLink Farmer Network</div></div>
        </div>
        <div className="rp-panel">
          <div className="rp-panel-head"><div className="rp-dot" /><h3>Testing Laboratory</h3></div>
          <div className="rp-info-row"><div className="rp-k">Testing Agency</div><div className="rp-v">Qualiset Food Laboratories LLP</div></div>
          <div className="rp-info-row"><div className="rp-k">Test Discipline</div><div className="rp-v">Chemical</div></div>
          <div className="rp-info-row"><div className="rp-k">Method Reference</div><div className="rp-v">FCO (1985) methods</div></div>
          <div className="rp-info-row"><div className="rp-k">Tested By</div><div className="rp-v">Authorised Lab Signatory</div></div>
          <div className="rp-info-row"><div className="rp-k">Lab Location</div><div className="rp-v">Rajkot, Gujarat</div></div>
        </div>
      </div>

      <div className="rp-profile">
        <div className="rp-profile-head">
          <h3>Nutrient &amp; Quality Profile</h3>
          <div className="rp-note">Bars scaled to each parameter's own measurement range, for at-a-glance reading only</div>
        </div>
        {bars.map((b) => (
          <div className="rp-bar-row" key={b.name}>
            <div className="rp-bar-label-row">
              <span className="rp-name">{b.name}</span>
              <span className="rp-method">{b.method}</span>
              <span className="rp-val">{b.val}</span>
            </div>
            <div className="rp-bar-track"><div className="rp-bar-fill" style={{ width: `${b.width}%` }} /></div>
          </div>
        ))}
      </div>

      <div className="rp-table-section">
        <div className="rp-table-head">
          <h3>Certified Analysis Table</h3>
          <div className="rp-table-badge">FCO 1985 Referenced</div>
        </div>
        <div className="rp-coa-wrap">
          <table className="rp-coa">
            <thead>
              <tr>
                <th className="rp-num">SI</th><th>Parameter</th><th>Result</th><th>Unit</th>
                <th>FCO 1985 Reference Range</th><th>Position in Range</th><th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.si}>
                  <td className="rp-num">{r.si}</td>
                  <td className="rp-param">{r.param}<span className="rp-method-label">{r.method}</span></td>
                  <td className="rp-result">{r.result}</td>
                  <td>{r.unit}</td>
                  <td className="rp-range">{r.range}</td>
                  <td className="rp-dial-cell"><Dial {...r.dial} /></td>
                  <td><span className={`rp-remark rp-remark--${r.remark}`}>{r.remarkText}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="rp-table-foot">
            <b>Reference basis:</b> Ranges shown are the general FCO 1985 (as amended) standard for Organic
            Manure / Compost (Schedule IV), provided for indicative context only — the original certificate does not
            name a specific FCO product sub-category for this sample. ¹ The original lab report lists "Phosphorus"
            and "Potash" without specifying elemental (P, K) or oxide (P₂O₅, K₂O) basis; the FCO range is expressed as
            oxide equivalents — confirm basis with the testing laboratory before drawing conclusions. Full FCO conformity
            also requires parameters not covered in this sample's test scope (e.g. C:N ratio, heavy metals, pathogens).
          </div>
        </div>
      </div>

      <div className="rp-certify">
        <div className="rp-seal">
          <div className="rp-s1">LAB<br />VERIFIED</div>
          <div className="rp-s2">BIOLINK</div>
        </div>
        <div className="rp-sign-block">
          <div className="rp-sign-line" />
          <div className="rp-who">Authorised Signatory</div>
          <div className="rp-role">BioLink Agritech Solutions</div>
        </div>
      </div>

      <div className="rp-disclaimer">
        <b>Disclaimer:</b> This certificate is a <b>visual, branded representation</b> of results obtained from an independent
        third-party laboratory test on the sample described above. It has been prepared by BioLink Agritech Solutions
        for the customer's easy reference. In line with our sourcing agreements and company policy, the
        <b> original laboratory test report and manufacturer/source details are retained on file and are not issued directly
        to the farmer/customer.</b> This summary does not replace, and is not a copy of, the original certified report.
        FCO reference ranges are shown for general context only and do not constitute an official conformity certification.
        For any verification or quality query, please contact BioLink Agritech Solutions directly using the details below.
      </div>

      <div className="rp-footer">
        <div><span className="rp-brandfoot">BioLink Agritech Solutions</span> · biolinkagri.in</div>
        <div>Summary generated 24 Aug 2026 · Valid as a reference document only</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ Page ═══ */
export default function LabReportsPage() {
  const [active, setActive] = useState('fom');

  return (
    <main>
      <section className="lab-reports-hero" style={{ position: 'relative' }}>
        <ParticleField />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="badge badge-cyan">Quality Assurance</span>
          <h1 className="lab-reports-hero__title">
            Lab-Verified <span className="text-glow-hero">Test Reports</span>
          </h1>
          <p className="lab-reports-hero__subtitle">
            Every batch dispatched through our platform undergoes rigorous testing at NABL-accredited and
            government-recognized laboratories. Below are visual summaries of our latest certified results.
          </p>

          <div className="lab-reports-location">
            <MapPin size={16} />
            <span>Reporting Plant: Jamnagar · Wankaner, Gujarat</span>
          </div>

          <div className="lab-reports-tabs">
            <button
              className={`lab-reports-tab ${active === 'fom' ? 'lab-reports-tab--active' : ''}`}
              onClick={() => setActive('fom')}
            >
              <FlaskConical size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              FOM — Fermented Organic Manure
            </button>
            <button
              className={`lab-reports-tab ${active === 'solid' ? 'lab-reports-tab--active' : ''}`}
              onClick={() => setActive('solid')}
            >
              <FlaskConical size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Solid Fertilizer
            </button>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {active === 'fom' ? <FOMReport /> : <SolidFertilizerReport />}
        </div>
      </section>
    </main>
  );
}
