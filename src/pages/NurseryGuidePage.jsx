import { useState, useRef } from 'react';
import { Globe, BookOpen } from 'lucide-react';
import './NurseryGuidePage.css';

export default function NurseryGuidePage() {
  const [selectedLang, setSelectedLang] = useState('en');
  const iframeRef = useRef(null);

  const handleLangChange = (e) => {
    const lang = e.target.value;
    setSelectedLang(lang);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.setLang(lang);
      } catch (err) {
        console.error('Error setting language inside iframe:', err);
      }
    }
  };

  const handleIframeLoad = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.setLang(selectedLang);
      } catch (err) {
        console.error('Error initializing language on iframe load:', err);
      }
    }
  };

  return (
    <main className="nursery-guide-page">
      {/* Premium Header/Banner with Selector */}
      <section className="nursery-guide-banner">
        <div className="container nursery-guide-banner__inner">
          <div className="nursery-guide-banner__text">
            <div className="nursery-guide-banner__tag">
              <BookOpen size={14} className="icon-pulse" />
              <span>Educational Resources</span>
            </div>
            <h1 className="nursery-guide-banner__title">Nursery Application Manual</h1>
            <p className="nursery-guide-banner__desc">
              Fermented Organic Manure (FOM) correct dosage, step-by-step application method, and diagnostic troubleshooting for healthy nursery stock.
            </p>
          </div>
          <div className="nursery-guide-banner__control">
            <label htmlFor="react-lang-select" className="lang-label">
              <Globe size={16} />
              <span>Choose Manual Language:</span>
            </label>
            <div className="lang-select-wrapper">
              <select
                id="react-lang-select"
                value={selectedLang}
                onChange={handleLangChange}
                className="lang-select-dropdown"
              >
                <option value="en">English (default)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Document Frame */}
      <section className="nursery-guide-frame-sec">
        <div className="container">
          <div className="nursery-guide-frame-wrapper">
            <iframe
              ref={iframeRef}
              src="/nursery-guide.html"
              title="BioLink FOM Nursery Application Guide"
              className="nursery-guide-iframe"
              onLoad={handleIframeLoad}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
