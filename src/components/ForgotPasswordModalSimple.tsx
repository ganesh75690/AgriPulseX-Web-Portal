import React, { useState } from 'react';
import { Mail, Smartphone, Key, Lock, X } from 'lucide-react';

interface ForgotPasswordModalSimpleProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ForgotPasswordModalSimple({ isOpen, onClose, onSuccess }: ForgotPasswordModalSimpleProps) {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const sendOtp = () => {
    const target = method === 'email' ? email : phone;
    if (!target) {
      alert(`Enter your registered ${method}.`);
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`OTP sent to ${method}: ${code}`);
    alert(`OTP sent to ${method}: ${code}`);
    setOtp(code);
  };

  const verifyOtp = () => {
    if (otp === '123456') {
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
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }
    
    alert('Password reset successful!');
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
        maxWidth: '28rem',
        width: '90%',
        padding: '2rem',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Reset Password</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
            title="Close modal"
          >
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.25rem' }}>
          {!verified ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Method Selection */}
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>Choose verification method</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    onClick={() => setMethod('email')}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      border: method === 'email' ? '2px solid #10b981' : '2px solid #d1d5db',
                      backgroundColor: method === 'email' ? '#10b981' : 'white',
                      color: method === 'email' ? 'white' : '#374151',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <Mail style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                    Email
                  </button>
                  <button
                    onClick={() => setMethod('phone')}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      border: method === 'phone' ? '2px solid #10b981' : '2px solid #d1d5db',
                      backgroundColor: method === 'phone' ? '#10b981' : 'white',
                      color: method === 'phone' ? 'white' : '#374151',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <Smartphone style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                    Phone
                  </button>
                </div>
              </div>

              {/* Input */}
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Registered {method === 'email' ? 'Email' : 'Phone'}
                </label>
                <div style={{ position: 'relative' }}>
                  {method === 'email' ? (
                    <Mail style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9ca3af' }} />
                  ) : (
                    <Smartphone style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9ca3af' }} />
                  )}
                  <input
                    type={method === 'email' ? 'email' : 'tel'}
                    value={method === 'email' ? email : phone}
                    onChange={(e) => method === 'email' ? setEmail(e.target.value) : setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '2.5rem',
                      paddingRight: '6rem',
                      paddingTop: '0.625rem',
                      paddingBottom: '0.625rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #d1d5db',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxShadow: '0 0 0 0px rgba(16, 185, 129, 0.1)'
                    }}
                    placeholder={method === 'email' ? 'you@domain.com' : '+91xxxxxxxxxx'}
                  />
                  <button
                    type="button"
                    onClick={sendOtp}
                    style={{
                      position: 'absolute',
                      right: '0.5rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Send OTP
                  </button>
                </div>
              </div>

              {/* OTP Input */}
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Enter OTP</label>
                <div style={{ position: 'relative' }}>
                  <Key style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9ca3af' }} />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '2.5rem',
                      paddingRight: '1rem',
                      paddingTop: '0.625rem',
                      paddingBottom: '0.625rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #d1d5db',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                    placeholder="6-digit code"
                    maxLength={6}
                  />
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={verifyOtp}
                style={{
                  width: '100%',
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                Verify OTP
              </button>
            </div>
          ) : (
            <form onSubmit={resetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* New Password */}
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9ca3af' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '2.5rem',
                      paddingRight: '2.5rem',
                      paddingTop: '0.625rem',
                      paddingBottom: '0.625rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #d1d5db',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9ca3af' }} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '2.5rem',
                      paddingRight: '2.5rem',
                      paddingTop: '0.625rem',
                      paddingBottom: '0.625rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #d1d5db',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer'
                    }}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>Passwords do not match</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: 'none'
                }}
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
