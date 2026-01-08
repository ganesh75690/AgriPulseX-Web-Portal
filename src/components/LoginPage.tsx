import React, { useState, useEffect } from 'react';
import { Shield, Lock, User, AlertCircle, Mail, Smartphone, Key, Check } from 'lucide-react';
import ForgotPasswordModalSimple from './ForgotPasswordModalSimple';

interface LoginPageProps {
  onLogin: () => void;
}

type OtpRecord = {
  code: string;
  expiresAt: number;
  sentAt: number;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Registration state (unchanged)
  const [regEmployeeId, setRegEmployeeId] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regOtpInput, setRegOtpInput] = useState('');
  const [regOtp, setRegOtp] = useState<OtpRecord | null>(null);

  // Two-step login state
  const [loginPhase, setLoginPhase] = useState<'identify' | 'auth' | 'otp'>('identify');
  const [identifier, setIdentifier] = useState(''); // Employee ID or email/phone
  const [displayIdentifier, setDisplayIdentifier] = useState(''); // shown on auth step
  const [password, setPassword] = useState('');
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

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(t);
  }, [notice]);

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
    if (!identifier) {
      setNotice('Enter Employee ID, email or phone to continue.');
      return;
    }
    setDisplayIdentifier(identifier);
    setLoginPhase('auth');
    setPassword('');
    setOtpInput('');
    setLoginOtp(null);
  };

  // Password sign-in
  const handlePasswordSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setNotice('Enter your password.');
      return;
    }
    // Demo: accept any password
    setNotice('Signed in.');
    onLogin();
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

  const handleVerifyLoginOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyOtp('login', otpInput)) {
      setNotice('Signed in (OTP).');
      onLogin();
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

    setNotice('Registration successful. Logging you in...');
    setTimeout(() => onLogin(), 700);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative animate-fadeIn" 
         style={{
           backgroundImage: 'url("/src/assests/agri.jpg")',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
         }}>
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 animate-fadeIn"></div>
      
      {/* Content positioned above overlay */}
      <div className="relative z-10 w-full max-w-md animate-slideUp">
        <div className="text-center mb-6 animate-slideDown">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2f9d58] rounded-lg mb-3 transform hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl overflow-hidden">
            <img src="/src/assests/agriculture.png" alt="AgriPulseX Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-white mb-1" style={{fontSize: '4rem', fontWeight: 'bold'}}>AgriPulseX</h1>
          <p className="text-lg text-white"> Crop Risk & Supply-Chain Decision Intelligence</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 transform hover:scale-102 transition-all duration-300 animate-scaleIn">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => { setMode('login'); setLoginPhase('identify'); }}
              className={`flex-1 py-2 rounded transition-all duration-300 transform hover:scale-105 ${mode === 'login' ? 'bg-[#2f9d58] text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode('register'); }}
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
                          title="Enter your OTP"
                          placeholder="DAO-XX-YYYY-NNNN or you@domain.com or +91xxxxxxxxxx"
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
                    Signing in as <strong>{displayIdentifier}</strong>
                    <button onClick={() => { setLoginPhase('identify'); setIdentifier(displayIdentifier); }} className="ml-2 text-xs underline text-[#2f9d58]">Not you?</button>
                  </div>

                  <form onSubmit={handlePasswordSignIn} className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Password</label>
                      <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'ring-2 ring-[#2f9d58] ring-opacity-30 rounded' : ''}`}>
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Enter your password"
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded text-sm transition-all duration-300 hover:border-[#2f9d58] focus:border-[#2f9d58]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button type="submit" className="flex-1 bg-[#2f9d58] text-white py-2.5 rounded transition-all duration-300 transform hover:scale-105 hover:bg-[#237a3f] hover:shadow-lg">Sign in</button>
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
              <h2 className="text-lg text-gray-900 mb-2">Register Admin Officer</h2>
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Employee ID</label>
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
                  <label className="block text-sm text-gray-700 mb-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded text-sm transition-all duration-300 hover:border-[#2f9d58] focus:border-[#2f9d58]"
                      placeholder="display name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded text-sm transition-all duration-300 hover:border-[#2f9d58] focus:border-[#2f9d58]"
                      placeholder="you@domain.com"
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
                  <label className="block text-sm text-gray-700 mb-1">Phone</label>
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

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Enter OTP (from email/phone)</label>
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
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded text-sm transition-all duration-300 hover:border-[#2f9d58] focus:border-[#2f9d58]"
                      placeholder="Create password"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded text-sm transition-all duration-300 hover:border-[#2f9d58] focus:border-[#2f9d58]"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full bg-[#2f9d58] text-white py-2.5 rounded transition-all duration-300 transform hover:scale-105 hover:bg-[#237a3f] hover:shadow-lg"
                  >
                    Create Account
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

      {/* Forgot Password Modal - Simple Version */}
      <ForgotPasswordModalSimple 
        isOpen={forgotOpen}
        onClose={() => setForgotOpen(false)}
        onSuccess={handleForgotPasswordSuccess}
      />
    </div>
  );
}
