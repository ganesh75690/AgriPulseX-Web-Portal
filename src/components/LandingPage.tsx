import React, { useState, useEffect } from 'react';
import { ArrowRight, Shield, Menu, X, Database, Lock, Leaf, Mail } from 'lucide-react';
import AboutModal from './AboutModal';
import './LandingPage.css';

interface LandingPageProps {
  onProceedToLogin: () => void;
}

export default function LandingPage({ onProceedToLogin }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);




  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="background-animation">
        <div className="floating-elements">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="floating-element"
              style={{
                left: `${20 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${15 + i * 2}s`
              }}
            />
          ))}
        </div>
        <div 
          className="gradient-orb"
        />
      </div>

      {/* Standalone Farm Image */}
      <div className="farm-image-fixed" />

      {/* Navigation Header */}
      <header className={`nav-header ${scrollY > 50 ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-brand">
            <div className="brand-text">
              <h1 className="brand-name">🌾 AgriPulseX</h1>
              <span className="brand-tagline">Digital Agriculture Intelligence Platform</span>
            </div>
          </div>

          <nav className="nav-menu">
          </nav>

          <div className="nav-actions">
            <button className="btn-secondary" onClick={() => setAboutModalOpen(true)}>About</button>
            <button 
              className="btn-primary"
              onClick={onProceedToLogin}
            >
              Secure Login
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <button className="mobile-btn-primary" onClick={onProceedToLogin}>
              Secure Login
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Shield className="w-4 h-4" />
              <span>Intelligence Platform</span>
            </div>
            
            <h1 className="hero-title">
              🌾 Empowering Farmers with AI-Driven Crop Intelligence
            </h1>
            
            <p className="hero-description">
              Harnessing the power of advanced AI models to revolutionize agriculture. 
              Our intelligent system delivers precision farming insights, predictive analytics, 
              and smart crop management solutions. Experience the future of farming with 
              cutting-edge machine learning technology designed for maximum yield and sustainability.
            </p>


            <div className="hero-actions">
              <button 
                className="btn-primary btn-large"
                onClick={onProceedToLogin}
              >
                <Lock className="w-5 h-5 mr-2" />
                Secure Login Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button 
                className="btn-contact btn-large"
                onClick={() => window.open('mailto:contact@agripulsex.com', '_blank')}
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact
              </button>
            </div>

            <div className="hero-trust">
              <div className="trust-badges">
                <div className="trust-badge">
                  <Database className="w-4 h-4" />
                  <span>Data Protected</span>
                </div>
                <div className="trust-badge government-badge">
                  <Shield className="w-4 h-4" />
                  <span>For Government Purpose Only</span>
                </div>
              </div>
            </div>
          </div>

            
            <div className="hero-visual">
            </div>
          </div>
      
      </section>



      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div>
              <h3 className="footer-brand-name">AgriPulseX</h3>
              <p className="footer-brand-tagline">Digital Agriculture Mission</p>
            </div>
          </div>

          <div className="footer-content">
            <div className="footer-section">
              <h4>Quick Links</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Security Guidelines</a>
            </div>
            
            <div className="footer-section">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Security Guidelines</a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 Government of India. Official Digital Agriculture Platform.</p>
          </div>
        </div>
      </footer>

      {/* About Modal */}
      <AboutModal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
    </div>
  );
}
