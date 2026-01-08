import React, { useState, useEffect } from 'react';
import { Mail, Smartphone, Key, Lock, X } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type OtpRecord = {
  code: string;
  expiresAt: number;
  sentAt: number;
};

export default function ForgotPasswordModal({ isOpen, onClose, onSuccess }: ForgotPasswordModalProps) {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState<OtpRecord | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendLeft, setResendLeft] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

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

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(newPassword));
  }, [newPassword]);

  useEffect(() => {
    if (!isOpen) {
      // Reset all state when modal closes
      setMethod('email');
      setEmail('');
      setPhone('');
      setOtp(null);
      setOtpInput('');
      setVerified(false);
      setNewPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      setPasswordStrength(null);
      setResendLeft(0);
    }
  }, [isOpen]);

  const sendOtp = () => {
    const target = method === 'email' ? email : phone;
    if (!target) {
      alert(`Enter your registered ${method}.`);
      return;
    }
    if (resendLeft > 0) {
      alert(`Please wait ${resendLeft}s before resending.`);
      return;
    }
    
    const code = generateOtp();
    const now = Date.now();
    const record: OtpRecord = { code, expiresAt: now + 5 * 60 * 1000, sentAt: now };
    setOtp(record);
    setResendLeft(60);
    
    // Countdown
    const interval = setInterval(() => {
      const left = Math.ceil((record.expiresAt - Date.now()) / 1000);
      if (left <= 0) {
        setResendLeft(0);
        clearInterval(interval);
      } else {
        setResendLeft(left);
      }
    }, 1000);

    console.log(`OTP sent to ${method}: ${code}`);
    alert(`OTP sent to ${method}: ${code}`);
  };

  const verifyOtp = () => {
    if (!otp) {
      alert('No OTP was sent.');
      return;
    }
    if (Date.now() > otp.expiresAt) {
      alert('OTP expired. Request a new one.');
      return;
    }
    if (otpInput === otp.code) {
      setVerified(true);
      alert('OTP verified successfully!');
    } else {
      alert('Invalid OTP.');
    }
  };

  const resetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verified) {
      alert('Please verify OTP first.');
      return;
    }
    if (!newPassword || !confirmPassword) {
      alert('Enter and confirm new password.');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }
    if (passwordStrength === 'weak') {
      alert('Please choose a stronger password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    
    alert('Password reset successful!');
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[99999]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Reset Password</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {!verified ? (
            <div className="space-y-5">
              {/* Method Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Choose verification method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMethod('email')}
                    className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-all ${
                      method === 'email'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-green-600'
                    }`}
                  >
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </button>
                  <button
                    onClick={() => setMethod('phone')}
                    className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-all ${
                      method === 'phone'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-green-600'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 inline mr-2" />
                    Phone
                  </button>
                </div>
              </div>

              {/* Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Registered {method === 'email' ? 'Email' : 'Phone'}
                </label>
                <div className="relative">
                  {method === 'email' ? (
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  ) : (
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  )}
                  <input
                    type={method === 'email' ? 'email' : 'tel'}
                    value={method === 'email' ? email : phone}
                    onChange={(e) => method === 'email' ? setEmail(e.target.value) : setPhone(e.target.value)}
                    className="w-full pl-10 pr-24 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    placeholder={method === 'email' ? 'you@domain.com' : '+91xxxxxxxxxx'}
                  />
                  <button
                    type="button"
                    onClick={sendOtp}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    {resendLeft > 0 ? `Resend (${resendLeft}s)` : 'Send OTP'}
                  </button>
                </div>
              </div>

              {/* OTP Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Enter OTP</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    placeholder="6-digit code"
                    maxLength={6}
                  />
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={verifyOtp}
                className="w-full bg-green-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-green-700"
              >
                Verify OTP
              </button>
            </div>
          ) : (
            <form onSubmit={resetPassword} className="space-y-5">
              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                
                {/* Password Strength */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Password Strength:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength === 'weak' ? 'text-red-600' :
                        passwordStrength === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {passwordStrength?.toUpperCase()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength === 'weak' ? 'bg-red-500 w-1/3' :
                            passwordStrength === 'medium' ? 'bg-yellow-500 w-2/3' :
                            'bg-green-500 w-full'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-green-700"
              >
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
