import { useState, useRef, useEffect } from 'react';
import { Globe, BookOpen, Sparkles } from 'lucide-react';
import './NurseryGuidePage.css';

const HINDI_STATES = [
  'Delhi',
  'Uttar Pradesh',
  'Bihar',
  'Madhya Pradesh',
  'Rajasthan',
  'Haryana',
  'Himachal Pradesh',
  'Chhattisgarh',
  'Jharkhand',
  'Uttarakhand'
];

export default function NurseryGuidePage() {
  const [selectedLang, setSelectedLang] = useState(() => {
    return localStorage.getItem('nursery_lang_picked') || 'en';
  });
  const [showHindiPrompt, setShowHindiPrompt] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    const hasPicked = localStorage.getItem('nursery_lang_picked');
    const hasDismissed = localStorage.getItem('nursery_hindi_dismissed');

    // Only auto-detect if the user hasn't manually selected a language before
    if (!hasPicked) {
      fetch('https://ipapi.co/json/')
        .then((res) => res.json())
        .then((data) => {
          const region = data.region;
          if (!region) return;

          // Auto-redirect rules (excluding West Bengal and others with different languages)
          if (region === 'Maharashtra') {
            updateLang('mr');
            localStorage.setItem('nursery_lang_picked', 'mr');
          } else if (region === 'Tamil Nadu') {
            updateLang('ta');
            localStorage.setItem('nursery_lang_picked', 'ta');
          } else if (region === 'Gujarat') {
            updateLang('gu');
            localStorage.setItem('nursery_lang_picked', 'gu');
          } else if (HINDI_STATES.includes(region) && !hasDismissed) {
            // Hindi suggestion overlay prompt (non-locking)
            setShowHindiPrompt(true);
          }
        })
        .catch((err) => {
          console.warn('IP location detection failed:', err);
        });
    }
  }, []);

  const updateLang = (lang) => {
    setSelectedLang(lang);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.setLang(lang);
      } catch (err) {
        console.error('Error setting language inside iframe:', err);
      }
    }
  };

  const handleLangChange = (e) => {
    const lang = e.target.value;
    updateLang(lang);
    localStorage.setItem('nursery_lang_picked', lang);
    setShowHindiPrompt(false);
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

  const switchToHindi = () => {
    updateLang('hi');
    localStorage.setItem('nursery_lang_picked', 'hi');
    setShowHindiPrompt(false);
  };

  const dismissPrompt = () => {
    localStorage.setItem('nursery_hindi_dismissed', 'true');
    setShowHindiPrompt(false);
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
                <option value="en">English</option>
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
          {showHindiPrompt && (
            <div className="hindi-prompt-banner">
              <div className="hindi-prompt-banner__content">
                <Sparkles size={18} className="hindi-prompt-banner__icon" />
                <p className="hindi-prompt-banner__text">
                  Read this manual in Hindi? / क्या आप इस मार्गदर्शिका को हिंदी में पढ़ना चाहते हैं?
                </p>
              </div>
              <div className="hindi-prompt-banner__actions">
                <button className="btn btn-primary btn-sm" onClick={switchToHindi}>
                  Switch to हिन्दी
                </button>
                <button className="btn btn-outline btn-sm" onClick={dismissPrompt}>
                  Keep English
                </button>
              </div>
            </div>
          )}

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
