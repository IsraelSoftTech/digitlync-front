import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaCogs, FaTractor, FaClock, FaChartLine, FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiOutlineChevronDown, HiMenu, HiX } from 'react-icons/hi';
import { IoMapOutline } from 'react-icons/io5';
import logo from '../assets/logo.png';
import home1 from '../assets/home1.jpg';
import home2 from '../assets/home2.jpg';
import home3 from '../assets/home3.jpg';
import Problem from './pages/Problem';
import Platform from './pages/Platform';
import Services from './pages/Services';
import Geospatial from './pages/Geospatial';
import AICoordination from './pages/AICoordination';
import HowItWorks from './pages/HowItWorks';
import Vision from './pages/Vision';
import Contact from './pages/Contact';
import Credibility from './pages/Credibility';
import Impact from './pages/Impact';
import Partner from './pages/Partner';
import Metrics from './pages/Metrics';
import SharedFooter from './SharedFooter';
import AnimateOnScroll from './AnimateOnScroll';
import LiveMetrics from './LiveMetrics';
import ContactFormInline from './ContactFormInline';
import './Home.css';

const BANNER_IMAGES = [home1, home2, home3];

/* Top-level nav: single items + dropdown groups (for large screens) */
const NAV_TOP = [
  { id: 'home', label: 'Home' },
  {
    id: 'about',
    label: 'About',
    dropdown: [
      { id: 'credibility', label: 'About Us' },
      { id: 'impact', label: 'Impact & Goals' },
      { id: 'vision', label: 'Vision' },
      { id: 'partner', label: 'Partner' },
    ],
  },
  {
    id: 'platform',
    label: 'Platform',
    dropdown: [
      { id: 'platform', label: 'Platform Overview' },
      { id: 'services', label: 'Services' },
      { id: 'geospatial', label: 'Geospatial' },
      { id: 'ai-coordination', label: 'AI & Coordination' },
    ],
  },
  { id: 'problem', label: 'The Problem' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'live-metrics', label: 'Metrics' },
  { id: 'footer', label: 'Contact' },
];

/* Flat list for mobile (all items expanded) */
const NAV_MOBILE = [
  { id: 'home', label: 'Home' },
  { id: 'credibility', label: 'About' },
  { id: 'impact', label: 'Impact' },
  { id: 'vision', label: 'Vision' },
  { id: 'partner', label: 'Partner' },
  { id: 'platform', label: 'Platform' },
  { id: 'services', label: 'Services' },
  { id: 'geospatial', label: 'Geospatial' },
  { id: 'ai-coordination', label: 'AI & Coordination' },
  { id: 'problem', label: 'The Problem' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'live-metrics', label: 'Metrics' },
  { id: 'footer', label: 'Contact' },
];

function Home({ onAdminLoginSuccess }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null); // 'platform' | 'about' | null
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [bannerIndex, setBannerIndex] = useState(0);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const closeLoginModal = () => {
    setLoginModalOpen(false);
    setLoginForm({ username: '', password: '' });
    setPasswordVisible(false);
    setLoginError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const { api } = await import('../api');
      const { data, error } = await api.login(loginForm.username, loginForm.password);
      if (error) {
        setLoginError(error);
        return;
      }
      if (data?.success) {
        closeLoginModal();
        onAdminLoginSuccess?.();
      } else {
        setLoginError(data?.error || 'Login failed');
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  useEffect(() => {
    if (loginModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [loginModalOpen]);

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 2000);
    return () => clearInterval(bannerTimer);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const close = (e) => {
      if (!e.target.closest('.hero-nav-dropdown-wrap')) setDropdownOpen(null);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [dropdownOpen]);

  const handleNavClick = (id) => {
    setCurrentPage(id);
    setMobileMenuOpen(false);
    setDropdownOpen(null);
  };

  const handleDropdownToggle = (key) => {
    setDropdownOpen((prev) => (prev === key ? null : key));
  };

  const isPageActive = (id) => {
    if (id === 'about') return ['credibility', 'impact', 'vision', 'partner'].includes(currentPage);
    if (id === 'platform') return ['platform', 'services', 'geospatial', 'ai-coordination'].includes(currentPage);
    return currentPage === id;
  };

  const handleExploreClick = () => {
    setCurrentPage('platform');
  };

  return (
    <div className="home">
      {/* Admin Login Modal */}
      {loginModalOpen && (
        <div className="login-modal-overlay" onClick={closeLoginModal}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="login-modal-close" onClick={closeLoginModal} aria-label="Close">
              <HiX />
            </button>
            <div className="login-modal-header">
              <img src={logo} alt="" className="login-modal-logo" />
              <h2>Admin Login</h2>
              <p>Sign in to access the DigiLync dashboard</p>
            </div>
            <form className="login-form" onSubmit={handleLoginSubmit}>
              {loginError && (
                <p className="login-error" role="alert">{loginError}</p>
              )}
              <div className="login-field">
                <label htmlFor="login-username">Username</label>
                <input
                  id="login-username"
                  type="text"
                  placeholder="Enter your username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm((f) => ({ ...f, username: e.target.value }))}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="login-field">
                <label htmlFor="login-password">Password</label>
                <div className="login-password-wrap">
                  <input
                    id="login-password"
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setPasswordVisible((v) => !v)}
                    aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <button type="submit" className="login-submit" disabled={loginLoading}>
                {loginLoading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Header with logo, nav, Admin Login */}
      <header className="hero-header">
        <div className="hero-header-inner">
          <button type="button" className="hero-logo hero-logo-btn" onClick={() => handleNavClick('home')}>
            <img src={logo} alt="DigiLync" className="hero-logo-img" />
            <span className="hero-logo-text">DigiLync</span>
          </button>

          <nav className="hero-nav">
            {NAV_TOP.map((item) =>
              item.dropdown ? (
                <div key={item.id} className="hero-nav-dropdown-wrap">
                  <button
                    type="button"
                    className={`hero-nav-link hero-nav-dropdown-trigger ${isPageActive(item.id) ? 'active' : ''}`}
                    onClick={() => handleDropdownToggle(item.id)}
                    aria-expanded={dropdownOpen === item.id}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <HiOutlineChevronDown className={`hero-nav-chevron ${dropdownOpen === item.id ? 'open' : ''}`} />
                  </button>
                  {dropdownOpen === item.id && (
                    <div className="hero-nav-dropdown">
                      {item.dropdown.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          className={`hero-nav-dropdown-item ${currentPage === sub.id ? 'active' : ''}`}
                          onClick={() => handleNavClick(sub.id)}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  className={`hero-nav-link ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  {item.label}
                </button>
              )
            )}
          </nav>

          <div className="hero-header-right">
            <button type="button" className="hero-admin-link hero-admin-btn" onClick={() => setLoginModalOpen(true)}>Admin Login</button>
            <button
              type="button"
              className="hero-mobile-toggle"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="hero-mobile-menu">
            {NAV_MOBILE.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`hero-mobile-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            ))}
            <button type="button" className="hero-mobile-link hero-mobile-admin" onClick={() => { setLoginModalOpen(true); setMobileMenuOpen(false); }}>Admin Login</button>
          </div>
        )}
      </header>

      {/* Content: full home page or single page component */}
      {currentPage === 'home' && (
        <>
      {/* Hero Section with Banner */}
      <section id="hero" className="hero">
        <div className="hero-banner">
          <div className="hero-geo-bg" aria-hidden="true" />
          {BANNER_IMAGES.map((img, i) => (
            <div
              key={i}
              className={`hero-banner-slide ${i === bannerIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
              aria-hidden={i !== bannerIndex}
            />
          ))}
          <div className="hero-banner-overlay" />
          <div className="hero-banner-dots">
            {BANNER_IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`hero-banner-dot ${i === bannerIndex ? 'active' : ''}`}
                onClick={() => setBannerIndex(i)}
                aria-label={`View slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-brand">DigiLync</span>
            <span className="hero-tagline">Africa's AI-Enabled Geospatial Agricultural Coordination Infrastructure</span>
          </h1>
          <p className="hero-subheadline">
            Linking farmers, mechanized service providers, and industrial buyers through structured scheduling, geospatial mapping, and AI-Powered intelligent coordination.
          </p>
          <div className="hero-cta">
            <a
              href="https://wa.me/237697799186"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn hero-btn-primary"
            >
              <FaWhatsapp className="hero-btn-icon" />
              Start on WhatsApp
            </a>
            <button
              type="button"
              onClick={handleExploreClick}
              className="hero-btn hero-btn-secondary"
            >
              <HiOutlineChevronDown className="hero-btn-icon" />
              Explore Platform
            </button>
          </div>
        </div>
      </section>

      {/* Institutional Credibility */}
      <section id="credibility" className="section section-credibility">
        <AnimateOnScroll className="section-inner" direction="left">
          <h2 className="section-title">Institutional Credibility</h2>
          <div className="credibility-content">
            <p className="credibility-lead">
              DigiLync is developed by a women-founded and women-led agritech company headquartered in Buea, Cameroon.
            </p>
            <p>
              We have deployed three field pilots in Meme Division (Kumba, Mabonji, and Malende), testing structured agricultural service coordination in real rural environments.
            </p>
            <p>
              Our team combines expertise in agricultural engineering, geospatial systems, AI-enabled platform development, and development-sector financial management — with a combined 3 decades of experience working directly with smallholder farmers and public agricultural institutions.
            </p>
            <p className="credibility-tagline">
              We build digital coordination infrastructure grounded in field realities — not theory.
            </p>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Live Platform Metrics */}
      <LiveMetrics />

      {/* Impact & Pilot Goals */}
      <section id="impact" className="section section-impact">
        <AnimateOnScroll className="section-inner" direction="right">
          <h2 className="section-title">Impact & Pilot Goals</h2>
          <p className="section-subtitle">
            DigiLync is designed to scale structured agricultural service delivery across fragile and underserved rural regions.
          </p>
          <div className="impact-grid">
            <div className="impact-card">
              <h3>3-Year Target</h3>
              <ul>
                <li><strong>20,000</strong> farmers</li>
                <li><strong>3,000</strong> service providers</li>
              </ul>
            </div>
            <div className="impact-card">
              <h3>Current & Upcoming Pilot Regions</h3>
              <ul>
                <li>Meme Division – Kumba, Mabonji, Malende</li>
                <li>Fako Division – Muyuka, Ombe, Tiko</li>
                <li>Ndian Division</li>
              </ul>
            </div>
            <div className="impact-card">
              <h3>Expected Outcomes</h3>
              <ul>
                <li>Faster and more reliable service scheduling</li>
                <li>Reduced seasonal delays in land preparation and harvesting</li>
                <li>Improved service quality accountability</li>
                <li>Increased visibility of regional production capacity</li>
              </ul>
            </div>
            <div className="impact-card">
              <h3>Key Performance Indicators</h3>
              <ul>
                <li>% reduction in service delays</li>
                <li>% increase in successful service completion</li>
                <li>Farmer satisfaction ratings</li>
                <li>Geographic coverage growth</li>
                <li>Service response time</li>
              </ul>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Section 2: The Problem */}
      <section id="problem" className="section section-problem">
        <AnimateOnScroll className="section-inner" direction="left">
          <h2 className="section-title">Agriculture in Africa Is Fragmented</h2>
          <div className="problem-grid">
            <div className="problem-card">
              <FaCogs className="problem-icon" />
              <h3>Under-Coordinated Mechanization</h3>
              <p>Mechanization exists but is under-coordinated across regions and seasons.</p>
            </div>
            <div className="problem-card">
              <FaTractor className="problem-icon" />
              <h3>Disconnected Providers</h3>
              <p>Service providers operate in isolation with no structured marketplace.</p>
            </div>
            <div className="problem-card">
              <FaClock className="problem-icon" />
              <h3>Timing & Availability Gaps</h3>
              <p>Farmers struggle with timing and availability of critical services.</p>
            </div>
            <div className="problem-card">
              <FaChartLine className="problem-icon" />
              <h3>Lack of Supply Visibility</h3>
              <p>Industrial buyers lack structured supply visibility and traceability.</p>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Section 3: The DigiLync Platform */}
      <section id="platform" className="section section-platform">
        <AnimateOnScroll className="section-inner" direction="right">
          <h2 className="section-title">The DigiLync Platform</h2>
          <p className="section-subtitle">Layered infrastructure for agricultural coordination</p>
          <div className="platform-layers">
            <div className="platform-layer live">
              <span className="platform-badge">Live</span>
              <h3>Layer 1 – Coordination Engine</h3>
              <ul>
                <li>WhatsApp onboarding</li>
                <li>Service booking</li>
                <li>Provider confirmation</li>
                <li>Admin oversight</li>
              </ul>
            </div>
            <div className="platform-layer dev">
              <span className="platform-badge">In Development</span>
              <h3>Layer 2 – Geospatial Mapping</h3>
              <ul>
                <li>Geo-tagged farms</li>
                <li>Regional service mapping</li>
                <li>Mechanization density visualization</li>
              </ul>
            </div>
            <div className="platform-layer dev">
              <span className="platform-badge">In Development</span>
              <h3>Layer 3 – AI Matching & Capacity Intelligence</h3>
              <ul>
                <li>Intelligent service matching</li>
                <li>Availability optimization</li>
                <li>Demand forecasting</li>
                <li>Production clustering</li>
              </ul>
            </div>
            <div className="platform-layer planned">
              <span className="platform-badge">Planned</span>
              <h3>Layer 4 – Supply Aggregation & Industrial Integration</h3>
              <ul>
                <li>Aggregated crop supply</li>
                <li>Structured sourcing</li>
                <li>Industrial buyer linkage</li>
                <li>Institutional dashboards</li>
              </ul>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Section 4: Services Offered */}
      <section id="services" className="section section-services">
        <AnimateOnScroll className="section-inner" direction="left">
          <h2 className="section-title">Services Offered</h2>
          <div className="services-grid">
            <div className="services-category">
              <h3>Pre-Production</h3>
              <ul><li>Land clearing</li><li>Plowing</li><li>Harrowing</li><li>Ridging</li></ul>
            </div>
            <div className="services-category">
              <h3>Planting & Inputs</h3>
              <ul><li>Mechanical planting</li><li>Fertilizer spreading</li><li>Seed drilling</li></ul>
            </div>
            <div className="services-category">
              <h3>Crop Management</h3>
              <ul><li>Spraying</li><li>Drone application</li><li>Irrigation installation</li></ul>
            </div>
            <div className="services-category">
              <h3>Harvesting</h3>
              <ul><li>Combine harvesting</li><li>Shelling</li><li>Threshing</li></ul>
            </div>
            <div className="services-category">
              <h3>Post-Harvest</h3>
              <ul><li>Drying</li><li>Storage</li><li>Processing</li><li>Cold room access</li></ul>
            </div>
            <div className="services-category">
              <h3>Logistics</h3>
              <ul><li>Farm-to-market transport</li><li>Produce aggregation</li></ul>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Section 5: Geospatial Intelligence */}
      <section id="geospatial" className="section section-geospatial">
        <AnimateOnScroll className="section-inner" direction="right">
          <h2 className="section-title">Geospatial Agricultural Intelligence</h2>
          <p className="section-desc">
            DigiLync geo-tags farms and mechanized service providers to build structured regional production maps.
          </p>
          <div className="geospatial-visual">
            <div className="geospatial-map-preview" aria-hidden="true">
              <span className="geo-dot" />
              <span className="geo-dot" />
              <span className="geo-dot" />
            </div>
            <IoMapOutline className="geospatial-icon" />
            <p>Map-style visualization • Regional production mapping • Clean, minimal preview</p>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Section 6: AI & Intelligent Coordination */}
      <section id="ai-coordination" className="section section-ai">
        <AnimateOnScroll className="section-inner" direction="left">
          <h2 className="section-title">AI-Driven Agricultural Coordination</h2>
          <p className="section-badge-inline">AI modules under progressive development</p>
          <div className="ai-features">
            <div className="ai-feature">Matching optimization</div>
            <div className="ai-feature">Capacity analysis</div>
            <div className="ai-feature">Production clustering</div>
            <div className="ai-feature">Supply forecasting</div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Section 7: How It Works */}
      <section id="how-it-works" className="section section-how">
        <AnimateOnScroll className="section-inner" direction="right">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Current version – grounded and real</p>
          <div className="how-steps">
            <div className="how-step"><span className="how-num">1</span><p>Register via WhatsApp</p></div>
            <div className="how-step"><span className="how-num">2</span><p>Request service</p></div>
            <div className="how-step"><span className="how-num">3</span><p>Provider confirms</p></div>
            <div className="how-step"><span className="how-num">4</span><p>Service completed</p></div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Section 8: Vision Statement */}
      <section id="vision" className="section section-vision">
        <AnimateOnScroll className="section-inner" direction="left">
          <h2 className="section-title">Building Africa's Agricultural Infrastructure Layer</h2>
          <div className="vision-content">
            <p>Structured capacity coordination across farmers, providers, and buyers.</p>
            <p>Mechanization optimization for efficient resource use.</p>
            <p>Supply intelligence for traceability and market linkage.</p>
            <p>Continental scalability – infrastructure that grows with Africa.</p>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Partner With DigiLync */}
      <section id="partner" className="section section-partner">
        <AnimateOnScroll className="section-inner" direction="right">
          <h2 className="section-title">Partner With DigiLync</h2>
          <div className="partner-content">
            <p>
              We collaborate with governments, development partners, agricultural institutions, cooperatives, and private sector actors to pilot and scale resilient agricultural coordination systems.
            </p>
            <p>
              If you are working to strengthen food systems, improve rural service delivery, or build digital public infrastructure for agriculture, DigiLync is ready to partner.
            </p>
            <p className="partner-cta-text">Let's build accountable and scalable agricultural systems together.</p>
            <button
              type="button"
              className="partner-explore-btn"
              onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              Explore Partnership
            </button>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="section section-contact-inline">
        <AnimateOnScroll className="section-inner" direction="left">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Whether you are a farmer, service provider, industrial buyer, or partner — we would like to hear from you.
          </p>
          <div className="contact-inline-grid">
            <div className="contact-inline-info">
              <h3>Reach Us</h3>
              <p><strong>Email:</strong> contact@digilync.com</p>
              <p><strong>WhatsApp:</strong> +237 697 799 186</p>
              <p className="contact-inline-note">
                For fastest response, start a conversation on WhatsApp. Farmers and providers can register directly via our WhatsApp bot.
              </p>
            </div>
            <ContactFormInline />
          </div>
        </AnimateOnScroll>
      </section>

      <SharedFooter onAdminLogin={() => setLoginModalOpen(true)} />
        </>
      )}

      {currentPage === 'problem' && (
        <div className="page-transition-wrap" key="problem">
          <Problem onAdminLogin={() => setLoginModalOpen(true)} />
        </div>
      )}
      {currentPage === 'platform' && (
        <div className="page-transition-wrap" key="platform">
          <Platform onAdminLogin={() => setLoginModalOpen(true)} />
        </div>
      )}
      {currentPage === 'services' && (
        <div className="page-transition-wrap" key="services">
          <Services onAdminLogin={() => setLoginModalOpen(true)} />
        </div>
      )}
      {currentPage === 'geospatial' && (
        <div className="page-transition-wrap" key="geospatial">
          <Geospatial onAdminLogin={() => setLoginModalOpen(true)} />
        </div>
      )}
      {currentPage === 'ai-coordination' && (
        <div className="page-transition-wrap" key="ai-coordination">
          <AICoordination onAdminLogin={() => setLoginModalOpen(true)} />
        </div>
      )}
      {currentPage === 'how-it-works' && (
        <div className="page-transition-wrap" key="how-it-works">
          <HowItWorks onAdminLogin={() => setLoginModalOpen(true)} />
        </div>
      )}
      {currentPage === 'credibility' && (
        <div className="page-transition-wrap" key="credibility">
          <Credibility onAdminLogin={() => setLoginModalOpen(true)} />
        </div>
      )}
      {currentPage === 'impact' && (
        <div className="page-transition-wrap" key="impact">
          <Impact onAdminLogin={() => setLoginModalOpen(true)} />
        </div>
      )}
      {currentPage === 'vision' && (
        <div className="page-transition-wrap" key="vision">
          <Vision onAdminLogin={() => setLoginModalOpen(true)} />
        </div>
      )}
      {currentPage === 'partner' && (
        <div className="page-transition-wrap" key="partner">
          <Partner onAdminLogin={() => setLoginModalOpen(true)} />
        </div>
      )}
      {currentPage === 'live-metrics' && (
        <div className="page-transition-wrap" key="live-metrics">
          <Metrics onAdminLogin={() => setLoginModalOpen(true)} />
        </div>
      )}
      {currentPage === 'footer' && (
        <div className="page-transition-wrap" key="footer">
          <Contact onAdminLogin={() => setLoginModalOpen(true)} />
        </div>
      )}
    </div>
  );
}

export default Home;
