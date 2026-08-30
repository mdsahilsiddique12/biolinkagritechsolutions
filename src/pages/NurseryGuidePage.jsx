import { useState, useRef, useEffect } from 'react';
import { Globe, BookOpen, Sparkles, FolderLock, Leaf } from 'lucide-react';
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

const TABS = [
  { id: 'nursery', label: 'Nursery Plants', icon: BookOpen, active: true },
  { id: 'orchards', label: 'Orchards & Fruits', icon: Leaf, active: false, desc: 'Dosage recommendations, soil preparation guide, and organic feeding cycles for Mango, Pomegranate, Citrus, and Banana crops.' },
  { id: 'plantations', label: 'Tea & Coffee Plantations', icon: Leaf, active: false, desc: 'Specialized application guidelines for high-altitude plantation estates, soil conditioning, and organic yield optimization.' },
  { id: 'field', label: 'Field & Vegetable Crops', icon: Leaf, active: false, desc: 'High-volume application charts for Sugarcane, Cotton, Paddy, and commercial vegetable cultivation.' }
];

export default function NurseryGuidePage() {
  const [activeTab, setActiveTab] = useState('nursery');
  const [selectedLang, setSelectedLang] = useState(() => {
    return localStorage.getItem('nursery_lang_picked') || 'en';
  });
  const [showHindiPrompt, setShowHindiPrompt] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    const hasPicked = localStorage.getItem('nursery_lang_picked');
    const hasDismissed = localStorage.getItem('nursery_hindi_dismissed');

    // Only auto-detect if the user hasn't manually selected a language before
    if (!hasPicked && activeTab === 'nursery') {
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
  }, [activeTab]);

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
      {/* Help Center Header/Banner */}
      <section className="nursery-guide-banner">
        <div className="container nursery-guide-banner__inner">
          <div className="nursery-guide-banner__text">
            <div className="nursery-guide-banner__tag">
              <BookOpen size={14} className="icon-pulse" />
              <span>BioLink Help Desk</span>
            </div>
            <h1 className="nursery-guide-banner__title">Application Manuals</h1>
            <p className="nursery-guide-banner__desc">
              Access official guidelines, dosage charts, and soil management manuals tailored to your agricultural crop category.
            </p>
          </div>
          {activeTab === 'nursery' && (
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
          )}
        </div>
      </section>

      {/* Tabs Selector Section */}
      <section className="help-tabs-section">
        <div className="container">
          <div className="help-tabs-list">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`help-tab-btn ${activeTab === tab.id ? 'help-tab-btn--active' : ''}`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="nursery-guide-frame-sec">
        <div className="container">
          {activeTab === 'nursery' ? (
            <>
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
            </>
          ) : (
            <div className="locked-manual-placeholder">
              <FolderLock size={48} className="locked-icon" />
              <h3>Agronomy Guide Coming Soon</h3>
              <p>
                {TABS.find((t) => t.id === activeTab)?.desc}
              </p>
              <div className="locked-status-badge">
                <Sparkles size={14} />
                <span>Undergoing Agronomic Certification</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
