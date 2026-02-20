import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaCogs, FaTractor, FaClock, FaChartLine, FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiOutlineChevronDown, HiMenu, HiX } from 'react-icons/hi';
import { IoMapOutline } from 'react-icons/io5';
import logo from '../assets/logo.png';
import home1 from '../assets/home1.jpg';
import home2 from '../assets/home2.jpg';
import home3 from '../assets/home3.jpg';
import './Home.css';

const BANNER_IMAGES = [home1, home2, home3];

const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'problem', label: 'The Problem' },
  { id: 'platform', label: 'Platform' },
  { id: 'services', label: 'Services' },
  { id: 'geospatial', label: 'Geospatial' },
  { id: 'ai-coordination', label: 'AI & Coordination' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'vision', label: 'Vision' },
  { id: 'footer', label: 'Contact' },
];

function Home({ onAdminLoginSuccess }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    const sections = ['hero', 'problem', 'platform', 'services', 'geospatial', 'ai-coordination', 'how-it-works', 'vision', 'footer'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleExploreClick = () => {
    scrollToSection('platform');
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
          <a href="#hero" className="hero-logo" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
            <img src={logo} alt="DigiLync" className="hero-logo-img" />
            <span className="hero-logo-text">DigiLync</span>
          </a>

          <nav className="hero-nav">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`hero-nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
              >
                {item.label}
              </a>
            ))}
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
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`hero-mobile-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
              >
                {item.label}
              </a>
            ))}
            <button type="button" className="hero-mobile-link hero-mobile-admin" onClick={() => { setLoginModalOpen(true); setMobileMenuOpen(false); }}>Admin Login</button>
          </div>
        )}
      </header>

      {/* Hero Section with Banner */}
      <section id="hero" className="hero">
        <div className="hero-banner">
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
            <span className="hero-tagline">Africa's Agricultural Coordination & Intelligence Infrastructure</span>
          </h1>
          <p className="hero-subheadline">
            Linking farmers, mechanized service providers, and industrial buyers through structured scheduling, geospatial mapping, and intelligent coordination.
          </p>
          <div className="hero-cta">
            <a
              href="https://wa.me/"
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

      {/* Section 2: The Problem */}
      <section id="problem" className="section section-problem">
        <div className="section-inner">
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
        </div>
      </section>

      {/* Section 3: The DigiLync Platform */}
      <section id="platform" className="section section-platform">
        <div className="section-inner">
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
            <div className="platform-layer roadmap">
              <span className="platform-badge">Roadmap</span>
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
        </div>
      </section>

      {/* Section 4: Services Offered */}
      <section id="services" className="section section-services">
        <div className="section-inner">
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
        </div>
      </section>

      {/* Section 5: Geospatial Intelligence */}
      <section id="geospatial" className="section section-geospatial">
        <div className="section-inner">
          <h2 className="section-title">Geospatial Agricultural Intelligence</h2>
          <p className="section-desc">
            DigiLync geo-tags farms and mechanized service providers to build structured regional production maps.
          </p>
          <div className="geospatial-visual">
            <IoMapOutline className="geospatial-icon" />
            <p>Map-style visualization • Regional production mapping • Clean, minimal preview</p>
          </div>
        </div>
      </section>

      {/* Section 6: AI & Intelligent Coordination */}
      <section id="ai-coordination" className="section section-ai">
        <div className="section-inner">
          <h2 className="section-title">AI-Driven Agricultural Coordination</h2>
          <p className="section-badge-inline">AI modules under progressive development</p>
          <div className="ai-features">
            <div className="ai-feature">Matching optimization</div>
            <div className="ai-feature">Capacity analysis</div>
            <div className="ai-feature">Production clustering</div>
            <div className="ai-feature">Supply forecasting</div>
          </div>
        </div>
      </section>

      {/* Section 7: How It Works */}
      <section id="how-it-works" className="section section-how">
        <div className="section-inner">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Current version – grounded and real</p>
          <div className="how-steps">
            <div className="how-step"><span className="how-num">1</span><p>Register via WhatsApp</p></div>
            <div className="how-step"><span className="how-num">2</span><p>Request service</p></div>
            <div className="how-step"><span className="how-num">3</span><p>Provider confirms</p></div>
            <div className="how-step"><span className="how-num">4</span><p>Service completed</p></div>
          </div>
        </div>
      </section>

      {/* Section 8: Vision Statement */}
      <section id="vision" className="section section-vision">
        <div className="section-inner">
          <h2 className="section-title">Building Africa's Agricultural Infrastructure Layer</h2>
          <div className="vision-content">
            <p>Structured capacity coordination across farmers, providers, and buyers.</p>
            <p>Mechanization optimization for efficient resource use.</p>
            <p>Supply intelligence for traceability and market linkage.</p>
            <p>Continental scalability – infrastructure that grows with Africa.</p>
          </div>
        </div>
      </section>

      {/* Section 9: Footer */}
      <footer id="footer" className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img src={logo} alt="DigiLync" className="footer-logo" />
            <span>DigiLync</span>
          </div>
          <div className="footer-links">
            <a href="mailto:contact@digilync.com">Email</a>
            <a href="https://wa.me/237651412772" target="_blank" rel="noopener noreferrer">WhatsApp Number: +237 651 412 772</a>
            <a href="/terms">Terms & Conditions</a>
            <a href="/privacy">Privacy Policy</a>
            <button type="button" className="footer-admin-btn" onClick={() => setLoginModalOpen(true)}>Admin Login</button>
          </div>
          <p className="footer-copy">© DigiLync. Powered by Izzy Tech Team.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
