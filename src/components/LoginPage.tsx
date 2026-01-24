import React, { useState, useEffect } from 'react';
import { Lock, Mail, User, Smartphone, Key, AlertCircle, Shield, MapPin, Check, HelpCircle, MessageCircle, Eye, EyeOff } from 'lucide-react';
import ForgotPasswordModalSimple from './ForgotPasswordModalSimple';
import authService from '../api/auth';
import CaptchaVerification from './CaptchaVerification';
import './LoginPage.css';

interface LoginPageProps {
  onLogin: (role: 'officer' | 'field-employee') => void;
}

type OtpRecord = {
  code: string;
  expiresAt: number;
  sentAt: number;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<'officer' | 'field-employee'>('officer');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState({
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    rainfall: 0.5,
    location: 'Ludhiana, Punjab',
    lastUpdated: new Date()
  });

  // Registration state (unchanged)
  const [regEmployeeId, setRegEmployeeId] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regConfirm, setRegConfirm] = useState('');
  const [showRegConfirm, setShowRegConfirm] = useState(false);
  const [regOtpInput, setRegOtpInput] = useState('');
  const [regOtp, setRegOtp] = useState<OtpRecord | null>(null);
  const [regDistrict, setRegDistrict] = useState('');
  const [regDesignation, setRegDesignation] = useState('');

  // Two-step login state
  const [loginPhase, setLoginPhase] = useState<'identify' | 'auth' | 'otp'>('identify');
  const [identifier, setIdentifier] = useState(''); // Employee ID or email/phone
  const [displayIdentifier, setDisplayIdentifier] = useState(''); // shown on auth step
  const [password, setPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [loginOtp, setLoginOtp] = useState<OtpRecord | null>(null);

  // Resend timers (ms timestamp until allowed)
  const [loginResendUntil, setLoginResendUntil] = useState<number | null>(null);
  const [regResendUntil, setRegResendUntil] = useState<number | null>(null);
  const [forgotResendUntil, setForgotResendUntil] = useState<number | null>(null);

  const [loginResendLeft, setLoginResendLeft] = useState(0);
  const [regResendLeft, setRegResendLeft] = useState(0);
  const [forgotResendLeft, setForgotResendLeft] = useState(0);

  // Forgot-password state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotOtp, setForgotOtp] = useState<OtpRecord | null>(null);
  const [forgotVerified, setForgotVerified] = useState(false);

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  // CAPTCHA state
  const [loginCaptchaVerified, setLoginCaptchaVerified] = useState(false);
  const [registerCaptchaVerified, setRegisterCaptchaVerified] = useState(false);
  
  // Background images array
  const backgroundImages = [
    '/agri.jpg',
    '/AGRIFIELD.jpg'
  ];

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update weather data every 30 seconds (demo mode)
  useEffect(() => {
    const weatherTimer = setInterval(() => {
      // Demo weather variations
      const weatherConditions = [
        { temperature: 28, condition: 'Partly Cloudy', humidity: 65, windSpeed: 12, rainfall: 0.5 },
        { temperature: 32, condition: 'Sunny', humidity: 45, windSpeed: 8, rainfall: 0 },
        { temperature: 26, condition: 'Overcast', humidity: 75, windSpeed: 15, rainfall: 2.1 },
        { temperature: 24, condition: 'Light Rain', humidity: 85, windSpeed: 18, rainfall: 3.5 },
        { temperature: 30, condition: 'Clear', humidity: 55, windSpeed: 10, rainfall: 0 }
      ];
      
      const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      setWeatherData({
        ...randomWeather,
        location: 'Ludhiana, Punjab',
        lastUpdated: new Date()
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(weatherTimer);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(t);
  }, [notice]);

  // Rotate background image on component mount and logout
  useEffect(() => {
    // Get stored image index or use 0 (don't increment on mount)
    const storedIndex = localStorage.getItem('loginImageIndex');
    const imageIndex = storedIndex ? parseInt(storedIndex) : 0;
    setCurrentImageIndex(imageIndex);
  }, []);

  const handleRoleSelection = (role: 'officer' | 'field-employee') => {
    setSelectedRole(role);
    // Reset CAPTCHA verification when role changes
    setLoginCaptchaVerified(false);
    setRegisterCaptchaVerified(false);
    // Change background image when role is selected
    rotateImage();
  };

  const rotateImage = () => {
    const nextIndex = (currentImageIndex + 1) % backgroundImages.length;
    setCurrentImageIndex(nextIndex);
    localStorage.setItem('loginImageIndex', nextIndex.toString());
  };

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    if (!password) return null;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  };

  // Generic send OTP that also sets per-flow resend timers
  const sendOtp = (forType: 'login' | 'register' | 'forgot', channel: 'email' | 'phone', target: string) => {
    if (!target) {
      setNotice('Please enter a phone number or email first.');
      return;
    }
    const code = generateOtp();
    const now = Date.now();
    const record: OtpRecord = { code, expiresAt: now + 5 * 60 * 1000, sentAt: now };

    if (forType === 'login') {
      setLoginOtp(record);
      setLoginResendUntil(now + 60 * 1000);
      setLoginResendLeft(60);
    } else if (forType === 'register') {
      setRegOtp(record);
      setRegResendUntil(now + 60 * 1000);
      setRegResendLeft(60);
    } else {
      setForgotOtp(record);
      setForgotResendUntil(now + 60 * 1000);
      setForgotResendLeft(60);
    }

    // Demo-send: console log (replace with real API)
    console.info(`[OTP SEND] ${channel.toUpperCase()} -> ${target}: ${code}`);
    setNotice(`OTP sent to ${channel} (${target}). Check console output in dev mode.`);
  };

  // Countdown effects for resend timers
  useEffect(() => {
    let t: any = null;
    if (loginResendUntil) {
      t = setInterval(() => {
        const left = Math.ceil((loginResendUntil - Date.now()) / 1000);
        if (left <= 0) {
          setLoginResendLeft(0);
          setLoginResendUntil(null);
          clearInterval(t);
        } else {
          setLoginResendLeft(left);
        }
      }, 1000);
    }
    return () => clearInterval(t);
  }, [loginResendUntil]);

  useEffect(() => {
    let t: any = null;
    if (regResendUntil) {
      t = setInterval(() => {
        const left = Math.ceil((regResendUntil - Date.now()) / 1000);
        if (left <= 0) {
          setRegResendLeft(0);
          setRegResendUntil(null);
          clearInterval(t);
        } else {
          setRegResendLeft(left);
        }
      }, 1000);
    }
    return () => clearInterval(t);
  }, [regResendUntil]);

  useEffect(() => {
    let t: any = null;
    if (forgotResendUntil) {
      t = setInterval(() => {
        const left = Math.ceil((forgotResendUntil - Date.now()) / 1000);
        if (left <= 0) {
          setForgotResendLeft(0);
          setForgotResendUntil(null);
          clearInterval(t);
        } else {
          setForgotResendLeft(left);
        }
      }, 1000);
    }
    return () => clearInterval(t);
  }, [forgotResendUntil]);

  const verifyOtp = (forType: 'login' | 'register' | 'forgot', input: string) => {
    const record = forType === 'login' ? loginOtp : forType === 'register' ? regOtp : forgotOtp;
    if (!record) {
      setNotice('No OTP was sent.');
      return false;
    }
    if (Date.now() > record.expiresAt) {
      setNotice('OTP expired. Request a new one.');
      return false;
    }
    if (input === record.code) {
      setNotice('OTP verified.');
      if (forType === 'forgot') setForgotVerified(true);
      return true;
    }
    setNotice('Invalid OTP.');
    return false;
  };

  // Identify -> proceed to auth phase
  const handleIdentify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Allow empty identifier - proceed with any value
    setDisplayIdentifier(identifier || "Anonymous User");
    setLoginPhase('auth');
    setPassword('');
    setOtpInput('');
    setLoginOtp(null);
  };

  // Password sign-in
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check CAPTCHA verification
    if (!loginCaptchaVerified) {
      setNotice('Please complete the security verification first.');
      return;
    }
    
    // Allow any password - even empty
    try {
      setNotice('Signing in...');
      
      // Mock success mode: always succeed without backend call
      console.log('Mock login success for:', {
        username: displayIdentifier || identifier,
        role: selectedRole
      });

      // Simulate a tiny delay to feel realistic
      await new Promise(res => setTimeout(res, 600));

      console.log('Login successful!');
      setNotice('✅ Successfully logged in!');
      rotateImage(); // Rotate image on successful login
      
      // Store mock token in localStorage
      localStorage.setItem('agripulse_token', 'mock-jwt-token-' + Date.now());
      localStorage.setItem('agripulse_user', JSON.stringify({
        username: displayIdentifier || identifier,
        role: selectedRole,
        name: 'Demo User',
        designation: selectedRole === 'field-employee' ? 'Field Officer' : 'Government Officer',
        region: 'Demo Region'
      }));
      
      // Delay navigation to show success message
      setTimeout(() => {
        onLogin(selectedRole);
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      setNotice('Network error. Please check your connection.');
    }
  };

  // Send OTP during sign-in (and switch to otp phase)
  const handleSendLoginOtp = () => {
    const target = displayIdentifier || identifier;
    if (!target) {
      setNotice('Enter identifier first.');
      return;
    }
    const channel = target.includes('@') ? 'email' : /^(\+|\d)/.test(target) ? 'phone' : 'email';
    sendOtp('login', channel as 'email' | 'phone', target);
    setLoginPhase('otp');
  };

  // Auto-send when entering OTP phase (if no OTP yet)
  useEffect(() => {
    if (loginPhase === 'otp' && !loginOtp) {
      // Try to send to displayIdentifier (fall back to identifier)
      const target = displayIdentifier || identifier;
      if (target) {
        const channel = target.includes('@') ? 'email' : /^(\+|\d)/.test(target) ? 'phone' : 'email';
        sendOtp('login', channel as 'email' | 'phone', target);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginPhase]);

  const handleVerifyLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // First verify the OTP
    if (!verifyOtp('login', otpInput)) {
      return;
    }
    
    try {
      setNotice('Verifying OTP and signing in...');
      // For OTP login, we'll use a default password or handle it differently
      // For now, let's use the OTP as password (this is a demo approach)
      const response = await authService.login({
        username: displayIdentifier || identifier,
        password: otpInput, // Using OTP as password for demo
        role: selectedRole
      });
      
      console.log('OTP Login response:', response);
      setNotice('✅ Successfully logged in via OTP!');
      rotateImage(); // Rotate image on successful OTP login
      setTimeout(() => {
        onLogin(selectedRole);
      }, 1500);
    } catch (error: any) {
      console.error('OTP Login error:', error);
      setNotice(error.message || 'OTP login failed. Please try again.');
    }
  };

  // Forgot flow - simplified with new modal
  const handleForgotPassword = () => {
    setForgotOpen(true);
  };

  const handleForgotPasswordSuccess = () => {
    setNotice('Password reset successful! You can now login with your new password.');
    setForgotOpen(false);
  };

  // Register submit (unchanged demo)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check CAPTCHA verification
    if (!registerCaptchaVerified) {
      setNotice('Please complete the security verification first.');
      return;
    }
    
    if (!regEmployeeId || !regUsername || !regEmail || !regPhone || !regPassword || !regConfirm) {
      setNotice('Please fill all registration fields.');
      return;
    }
    if (regPassword !== regConfirm) {
      setNotice('Passwords do not match.');
      return;
    }
    if (!regOtp) {
      setNotice('Please request and verify OTP for phone or email.');
      return;
    }
    if (!verifyOtp('register', regOtpInput)) return;

    setNotice('✅ Registration successful! Logging you in...');
    rotateImage(); // Rotate image on successful registration
    setTimeout(() => onLogin(selectedRole), 1500);
  };

  return (
    <div 
    className={`min-h-screen flex items-center justify-center p-4 relative animate-fadeIn login-background ${
      currentImageIndex === 0 ? 'agri-bg' : 'agrifield-bg'
    } ${
      highContrast ? 'bg-black high-contrast' : ''
    }`}>
      {/* Overlay for better text readability */}
      <div className={`absolute inset-0 animate-fadeIn ${
        highContrast ? 'bg-black/80' : 'bg-black/30'
      }`}></div>
      
      {/* Help/Support Button - Top Left Corner */}
      <div className="fixed top-4 left-4 z-50 space-y-2">
        <button
          onClick={() => {
            console.log('Help button clicked, showHelpModal:', showHelpModal);
            setShowHelpModal(true);
          }}
          className="bg-white rounded-lg shadow-lg p-2 border border-gray-200 flex items-center gap-2 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          title="Help & Support"
        >
          <HelpCircle className="w-4 h-4 text-blue-600 group-hover:text-blue-700 transition-colors" />
          <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Help</span>
        </button>
        
        {/* Real-time Clock */}
        <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <div className="text-xs font-medium text-gray-600">Current Time</div>
          <div className="text-sm font-bold text-gray-900">
            {currentTime.toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit',
              hour12: true 
            })}
          </div>
          <div className="text-xs text-gray-600">
            {currentTime.toLocaleDateString('en-IN', { 
              weekday: 'short',
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            })}
          </div>
        </div>
        
        {/* Weather Update */}
        <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg shadow-lg p-3 border border-blue-200">
          <div className="text-xs font-medium text-blue-600 mb-2 flex items-center gap-1">
            <span>🌤️</span>
            <span>Weather Update</span>
          </div>
          <div className="text-xs text-blue-800 mb-1 font-semibold">{weatherData.location}</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-blue-900">{weatherData.temperature}°C</span>
            <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full">{weatherData.condition}</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs text-blue-700">
            <div className="flex items-center gap-1">
              <span>💧</span>
              <span>{weatherData.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span>💨</span>
              <span>{weatherData.windSpeed} km/h</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🌧️</span>
              <span>{weatherData.rainfall} mm</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🕐</span>
              <span>{weatherData.lastUpdated.toLocaleTimeString('en-IN', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility Options - Top Right Corner */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-lg p-2 border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 font-medium whitespace-nowrap">A11y</span>
            
            <div className="w-px h-3 bg-gray-300"></div>
            
            {/* Font Size Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'font' ? null : 'font')}
                className={`flex items-center gap-1 px-1.5 py-0.5 text-xs rounded transition-colors ${
                  openDropdown === 'font' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title="Font size options"
              >
                <span>A</span>
                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
                </svg>
              </button>
              
              {openDropdown === 'font' && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => {setFontSize('normal'); setOpenDropdown(null);}}
                      className={`px-2 py-1 text-xs rounded w-full text-left ${
                        fontSize === 'normal' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      A - Normal
                    </button>
                    <button
                      onClick={() => {setFontSize('large'); setOpenDropdown(null);}}
                      className={`px-2 py-1 text-xs rounded w-full text-left ${
                        fontSize === 'large' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      A+ - Large
                    </button>
                    <button
                      onClick={() => {setFontSize('extra-large'); setOpenDropdown(null);}}
                      className={`px-2 py-1 text-xs rounded w-full text-left ${
                        fontSize === 'extra-large' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      A++ - Extra Large
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="w-px h-3 bg-gray-300"></div>
            
            {/* High Contrast Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'contrast' ? null : 'contrast')}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                  openDropdown === 'contrast' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title="High contrast options"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m6.364 0l-.707.707M6.343 0l-.707.707" />
                </svg>
                <span className="ml-1">C</span>
              </button>
              
              {openDropdown === 'contrast' && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => {setHighContrast(false); setOpenDropdown(null);}}
                      className={`px-2 py-1 text-xs rounded w-full text-left ${
                        !highContrast ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Normal Contrast
                    </button>
                    <button
                      onClick={() => {setHighContrast(true); setOpenDropdown(null);}}
                      className={`px-2 py-1 text-xs rounded w-full text-left ${
                        highContrast ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      High Contrast
                    </button>
                    <button
                      onClick={() => {setHighContrast(true); setOpenDropdown(null);}}
                      className={`px-2 py-1 text-xs rounded w-full text-left ${
                        highContrast ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Ultra High Contrast
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="w-px h-3 bg-gray-300"></div>
            
            {/* Screen Reader Mode */}
            <button
              onClick={() => setScreenReaderMode(!screenReaderMode)}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                screenReaderMode ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              title="Toggle screen reader mode"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 0 1 0-7.072m2.828 9.9a5 5 0 1 1-7.072 0m-.536-8.464a5 5 0 0 1 0 7.072m2.828-9.9a5 5 0 1 1 7.072 0M9 12a1 1 0 1 0 2 0 1 1 0 0 0-2zm3 0a1 1 0 1 0 2 0 1 1 0 0 0-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Content positioned above overlay */}
      <div className={`relative z-10 w-96 animate-slideUp ${
        fontSize === 'extra-large' ? 'text-xl' : fontSize === 'large' ? 'text-lg' : 'text-base'
      }`}>
        <div className="text-center mb-6 animate-slideDown">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2f9d58] rounded-lg mb-3 transform hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl overflow-hidden">
            <img src="/agriculture.png" alt="AgriPulseX Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className={`text-white mb-1 login-title ${screenReaderMode ? 'sr-only' : ''}`}>AgriPulseX</h1>
          {screenReaderMode && (
            <div className="text-white text-2xl font-bold">AgriPulseX - Crop Risk & Supply-Chain Decision Intelligence</div>
          )}
          {!screenReaderMode && (
            <p className="text-lg text-white"> Crop Risk & Supply-Chain Decision Intelligence</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-6 border-2 border-[#2f9d58] relative overflow-hidden transform hover:scale-102 transition-all duration-300 animate-scaleIn before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-[#2f9d58] before:via-green-400 before:to-[#2f9d58] before:opacity-30 before:animate-pulse after:absolute after:inset-[2px] after:rounded-lg after:bg-white after:content-[''] hover:shadow-[0_0_40px_rgba(47,157,88,0.6),0_0_60px_rgba(47,157,88,0.3)] hover:border-[#237a3f] hover:before:opacity-50">
          {/* Role Selection */}
          <div className="mb-6">
            <h3 className="text-sm text-gray-700 mb-3 text-center font-semibold">Select Your Role</h3>
            <div className="grid grid-cols-2 gap-3" role="group" aria-label="User role selection">
              <button
                onClick={() => handleRoleSelection('officer')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  selectedRole === 'officer'
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
                role="radio"
                aria-checked={selectedRole === 'officer' ? 'true' : 'false'}
                aria-label="Government Officer role"
              >
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm font-semibold">Government Officer</div>
                  <div className="text-xs text-gray-500 mt-1">Decision & Policy Control</div>
                </div>
              </button>
              <button
                onClick={() => handleRoleSelection('field-employee')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  selectedRole === 'field-employee'
                    ? 'border-green-500 bg-green-50 text-green-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
                role="radio"
                aria-checked={selectedRole === 'field-employee' ? 'true' : 'false'}
                aria-label="Field Employee role"
              >
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm font-semibold">Field Employee</div>
                  <div className="text-xs text-gray-500 mt-1">Data Collection & Reporting</div>
                </div>
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => { setMode('login'); setLoginPhase('identify'); setLoginCaptchaVerified(false); }}
              className={`flex-1 py-2 rounded transition-all duration-300 transform hover:scale-105 ${mode === 'login' ? 'bg-[#2f9d58] text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode('register'); setRegisterCaptchaVerified(false); }}
              className={`flex-1 py-2 rounded transition-all duration-300 transform hover:scale-105 ${mode === 'register' ? 'bg-[#2f9d58] text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
            >
              Register
            </button>
          </div>

          {mode === 'login' ? (
            <>
              {loginPhase === 'identify' && (
                <>
                  <h2 className="text-lg text-gray-900 mb-2">Sign in</h2>
                  <form onSubmit={handleIdentify} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Employee ID / Email / Phone</label>
                      <div className={`relative transition-all duration-300 ${focusedField === 'identifier' ? 'ring-2 ring-[#2f9d58] ring-opacity-30 rounded' : ''}`}>
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          title="Enter your identifier"
                          placeholder="Enter your ID, email or phone"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          onFocus={() => setFocusedField('identifier')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded text-sm transition-all duration-300 hover:border-[#2f9d58] focus:border-[#2f9d58]"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="submit" className="flex-1 bg-[#2f9d58] text-white py-2.5 rounded transition-all duration-300 transform hover:scale-105 hover:bg-[#237a3f] hover:shadow-lg">Continue</button>
                      <button type="button" onClick={() => { setMode('register'); }} className="text-sm text-[#2f9d58] underline transition-all duration-300 hover:text-[#237a3f]">
                        New? Create account
                      </button>
                    </div>
                  </form>
                </>
              )}

              {loginPhase === 'auth' && (
                <>
                  <h2 className="text-lg text-gray-900 mb-2">Welcome</h2>
                  <div className="mb-3 text-sm text-gray-700">
                    Signing in as <strong>{displayIdentifier || "Anonymous User"}</strong>
                    <button onClick={() => { setLoginPhase('identify'); setIdentifier(displayIdentifier); }} className="ml-2 text-xs underline text-[#2f9d58]">Not you?</button>
                  </div>

                  <form onSubmit={handlePasswordSignIn} className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Password</label>
                      <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'ring-2 ring-[#2f9d58] ring-opacity-30 rounded' : ''}`}>
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Enter your password"
                          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded text-sm transition-all duration-300 hover:border-[#2f9d58] focus:border-[#2f9d58]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword((v) => !v)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                          aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                          title={showLoginPassword ? 'Hide password' : 'Show password'}
                        >
                          {showLoginPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* CAPTCHA Verification */}
                    <div>
                      <CaptchaVerification 
                        onVerify={(success) => setLoginCaptchaVerified(success)}
                        className="mb-3"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button 
                        type="submit" 
                        className="flex-1 bg-[#2f9d58] text-white py-2.5 rounded transition-all duration-300 transform hover:scale-105 hover:bg-[#237a3f] hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={!loginCaptchaVerified}
                      >
                        Sign in
                      </button>
                      <div className="flex flex-col items-end">
                        <button type="button" onClick={handleSendLoginOtp} className="ml-2 text-sm text-[#2f9d58] underline transition-all duration-300 hover:text-[#237a3f]">Use OTP</button>
                        <button type="button" onClick={() => setForgotOpen(true)} className="ml-2 text-xs text-[#2f9d58] underline mt-1 transition-all duration-300 hover:text-[#237a3f]">Forgot password?</button>
                      </div>
                    </div>
                  </form>
                </>
              )}

              {loginPhase === 'otp' && (
                <>
                  <h2 className="text-lg text-gray-900 mb-2">Verify with OTP</h2>
                  <div className="mb-2 text-sm text-gray-700">Sending OTP to <strong>{displayIdentifier || identifier}</strong></div>
                  <form onSubmit={handleVerifyLoginOtp} className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Contact (edit if needed)</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          title="Enter your contact information"
                          placeholder="Enter your email or phone number"
                          value={displayIdentifier}
                          onChange={(e) => setDisplayIdentifier(e.target.value)}
                          className="w-full pl-10 pr-24 py-2.5 border border-gray-300 rounded text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (loginResendLeft > 0) {
                              setNotice(`Please wait ${loginResendLeft}s before resending.`);
                              return;
                            }
                            const target = displayIdentifier || identifier;
                            const channel = target.includes('@') ? 'email' : /^(\+|\d)/.test(target) ? 'phone' : 'email';
                            sendOtp('login', channel as 'email' | 'phone', target);
                          }}
                          className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#2f9d58] text-white px-3 py-1.5 rounded text-sm"
                        >
                          {loginResendLeft > 0 ? `Resend (${loginResendLeft}s)` : 'Send OTP'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Enter OTP</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          placeholder="6-digit code"
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <button type="submit" className="w-full bg-[#2f9d58] text-white py-2.5 rounded">Verify & Sign in</button>
                    </div>
                  </form>
                </>
              )}
            </>
          ) : (
            <>
              <h2 className="text-lg text-gray-900 mb-2">
                {selectedRole === 'field-employee' ? 'Register Field Employee' : 'Register Government Officer'}
              </h2>
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                {selectedRole === 'field-employee' ? (
                  // Field Employee Registration Fields
                  <>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Field Employee ID</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          value={regEmployeeId}
                          onChange={(e) => setRegEmployeeId(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded text-sm transition-all duration-300 hover:border-[#2f9d58] focus:border-[#2f9d58]"
                          placeholder="FE-XX-YYYY-NNNN"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded text-sm transition-all duration-300 hover:border-[#2f9d58] focus:border-[#2f9d58]"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Assigned District</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          value={regDistrict || ''}
                          onChange={(e) => setRegDistrict(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded text-sm transition-all duration-300 hover:border-[#2f9d58] focus:border-[#2f9d58] appearance-none"
                          aria-label="Select your district"
                        >
                          <option value="">Select your district</option>
                          <option value="Ludhiana">Ludhiana</option>
                          <option value="Amritsar">Amritsar</option>
                          <option value="Patiala">Patiala</option>
                          <option value="Jalandhar">Jalandhar</option>
                          <option value="Ferozepur">Ferozepur</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Mobile Number</label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded text-sm transition-all duration-300 hover:border-[#2f9d58] focus:border-[#2f9d58]"
                          placeholder="+91xxxxxxxxxx"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (regResendLeft > 0) {
                            setNotice(`Please wait ${regResendLeft}s before resending.`);
                            return;
                          }
                          sendOtp('register', 'phone', regPhone);
                        }}
                        className="mt-2 bg-[#2f9d58] text-white px-3 py-1.5 rounded text-sm transition-all duration-300 hover:bg-[#237a3f] hover:scale-105 whitespace-nowrap"
                      >
                        {regResendLeft > 0 ? `Resend (${regResendLeft}s)` : 'Send OTP'}
                      </button>
                    </div>
                  </>
                ) : (
                  // Government Officer Registration Fields
                  <>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Officer ID</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          value={regEmployeeId}
                          onChange={(e) => setRegEmployeeId(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded text-sm transition-all duration-300 hover:border-[#2f9d58] focus:border-[#2f9d58]"
                          placeholder="DAO-XX-YYYY-NNNN"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded text-sm transition-all duration-300 hover:border-[#2f9d58] focus:border-[#2f9d58]"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Official Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded text-sm transition-all duration-300 hover:border-[#2f9d58] focus:border-[#2f9d58]"
                          placeholder="officer@agri.gov.in"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (regResendLeft > 0) {
                            setNotice(`Please wait ${regResendLeft}s before resending.`);
                            return;
                          }
                          sendOtp('register', 'email', regEmail);
                        }}
                        className="mt-2 bg-[#2f9d58] text-white px-3 py-1.5 rounded text-sm transition-all duration-300 hover:bg-[#237a3f] hover:scale-105 whitespace-nowrap"
                      >
                        {regResendLeft > 0 ? `Resend (${regResendLeft}s)` : 'Send OTP'}
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Designation</label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          value={regDesignation || ''}
                          onChange={(e) => setRegDesignation(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded text-sm transition-all duration-300 hover:border-[#2f9d58] focus:border-[#2f9d58] appearance-none"
                          aria-label="Select your designation"
                        >
                          <option value="">Select your designation</option>
                          <option value="District Agriculture Officer">District Agriculture Officer</option>
                          <option value="Senior Agriculture Officer">Senior Agriculture Officer</option>
                          <option value="Agriculture Development Officer">Agriculture Development Officer</option>
                          <option value="Plant Protection Officer">Plant Protection Officer</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Common Fields */}
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Enter OTP (from {selectedRole === 'field-employee' ? 'phone' : 'email'})</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={regOtpInput}
                      onChange={(e) => setRegOtpInput(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded text-sm transition-all duration-300 hover:border-[#2f9d58] focus:border-[#2f9d58]"
                      placeholder="6-digit code"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded text-sm transition-all duration-300 hover:border-[#2f9d58] focus:border-[#2f9d58]"
                      placeholder="Create password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                      title={showRegPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showRegConfirm ? 'text' : 'password'}
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded text-sm transition-all duration-300 hover:border-[#2f9d58] focus:border-[#2f9d58]"
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirm((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      aria-label={showRegConfirm ? 'Hide password' : 'Show password'}
                      title={showRegConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showRegConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* CAPTCHA Verification */}
                <div>
                  <CaptchaVerification 
                    onVerify={(success) => setRegisterCaptchaVerified(success)}
                    className="mb-3"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-[#2f9d58] text-white py-2.5 rounded transition-all duration-300 transform hover:scale-105 hover:bg-[#237a3f] hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={!registerCaptchaVerified}
                  >
                    {selectedRole === 'field-employee' ? 'Register as Field Employee' : 'Register as Government Officer'}
                  </button>
                </div>
              </form>
            </>
          )}

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900">
              <strong>Official Notice:</strong> Authorized government personnel only. All activities are logged for audit purposes.
            </p>
          </div>

          {notice && (
            <div className="mt-3 text-sm text-center text-[#2f9d58] flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>{notice}</span>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <p className="text-xl text-white">
            Ministry of Agriculture & Farmers Welfare<br />
            Government of India
          </p>
        </div>
      </div>

      {/* Help/Support Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto relative">
            {/* Debug indicator */}
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-30">
              DEBUG: Modal is open
            </div>
            
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Help & Support</h2>
              </div>
              <button 
                onClick={(e) => {
                  console.log('Close button clicked, e:', e);
                  e.stopPropagation();
                  console.log('Before setShowHelpModal(false)');
                  setShowHelpModal(false);
                  console.log('After setShowHelpModal(false)');
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100 z-20"
                aria-label="Close help modal"
                title="Close help modal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Quick Help */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                  Quick Help
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• <strong>Forgot Password?</strong> Click "Forgot password?" on login form</p>
                  <p>• <strong>Login Issues?</strong> Check your Employee ID and password</p>
                  <p>• <strong>OTP Not Received?</strong> Check your email/phone number</p>
                  <p>• <strong>CAPTCHA Problems?</strong> Refresh the page or contact support</p>
                </div>
              </div>

              {/* Contact Support */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-green-500" />
                  Contact Support
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">📞</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Helpline Number</p>
                      <p className="text-sm text-gray-600">1800-123-4567 (Toll-Free)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">📧</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email Support</p>
                      <p className="text-sm text-gray-600">support@agripulsex.gov.in</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">💬</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Live Chat</p>
                      <p className="text-sm text-gray-600">Available 9 AM - 6 PM (Mon-Fri)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Links */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-orange-500" />
                  Important Links
                </h3>
                <div className="space-y-2">
                  <a href="#" className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                    <span>📖</span>
                    <span className="text-sm text-gray-700">User Manual</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                    <span>🔒</span>
                    <span className="text-sm text-gray-700">Security Guidelines</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                    <span>📋</span>
                    <span className="text-sm text-gray-700">Terms & Conditions</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal - Simple Version */}
      <ForgotPasswordModalSimple 
        isOpen={forgotOpen}
        onClose={() => setForgotOpen(false)}
        onSuccess={handleForgotPasswordSuccess}
      />
    </div>
  );
}
