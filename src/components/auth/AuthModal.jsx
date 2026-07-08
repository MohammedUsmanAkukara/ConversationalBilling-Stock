import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  Phone, 
  User, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  KeyRound, 
  Smartphone, 
  ShieldCheck,
  RefreshCw,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, currentUser, onLogin, onLogout }) {
  const [mode, setMode] = useState('LOGIN'); // 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD'
  const [loginMethod, setLoginMethod] = useState('EMAIL'); // 'EMAIL' | 'MOBILE_OTP'

  // Login form state
  const [emailLogin, setEmailLogin] = useState('admin@chatstock.ai');
  const [passwordLogin, setPasswordLogin] = useState('secret123');
  const [mobilePhone, setMobilePhone] = useState('9876543210');
  const [mobileOtp, setMobileOtp] = useState('');
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [generatedMobileOtp, setGeneratedMobileOtp] = useState('482910');

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Forgot password flow state
  const [forgotStep, setForgotStep] = useState('EMAIL_INPUT'); // 'EMAIL_INPUT' | 'CODE_VERIFY' | 'SUCCESS'
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [expectedCode, setExpectedCode] = useState('739104');
  const [newPassword, setNewPassword] = useState('');

  // Status message
  const [statusMessage, setStatusMessage] = useState(null);

  if (!isOpen) return null;

  const showFeedback = (text, type = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleEmailLoginSubmit = (e) => {
    e.preventDefault();
    if (!emailLogin || !passwordLogin) {
      showFeedback('Please enter both email and password', 'error');
      return;
    }

    const userData = {
      name: emailLogin.split('@')[0].toUpperCase(),
      email: emailLogin,
      phone: '+91 98765 43210',
      businessName: 'ChatStock AI Enterprise',
      role: 'Administrator'
    };

    onLogin(userData);
    showFeedback('Successfully logged in!', 'success');
    onClose();
  };

  const handleSendMobileOtp = () => {
    if (!mobilePhone || mobilePhone.length < 8) {
      showFeedback('Please enter a valid mobile number', 'error');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedMobileOtp(code);
    setMobileOtpSent(true);
    setMobileOtp(code); // auto-fill for instant seamless test
    showFeedback(`OTP verification code sent: ${code}`, 'success');
  };

  const handleMobileOtpSubmit = (e) => {
    e.preventDefault();
    if (!mobileOtp || mobileOtp !== generatedMobileOtp) {
      showFeedback('Invalid OTP verification code', 'error');
      return;
    }

    const userData = {
      name: `User-${mobilePhone.slice(-4)}`,
      email: `${mobilePhone}@mobile.chatstock.ai`,
      phone: `+91 ${mobilePhone}`,
      businessName: 'Mobile Retail Store',
      role: 'Verified Vendor'
    };

    onLogin(userData);
    onClose();
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      showFeedback('Passwords do not match!', 'error');
      return;
    }

    const userData = {
      name: registerForm.fullName || 'New Merchant',
      email: registerForm.email,
      phone: registerForm.phone,
      businessName: registerForm.businessName || 'My Business Store',
      role: 'Store Owner'
    };

    onLogin(userData);
    showFeedback('Account registered successfully!', 'success');
    onClose();
  };

  const handleSendForgotCode = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      showFeedback('Please enter your registered email address', 'error');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedCode(code);
    setForgotCode(code); // auto-fill for effortless testing
    setForgotStep('CODE_VERIFY');
    showFeedback(`Password reset security code sent: ${code}`, 'success');
  };

  const handleVerifyForgotCode = (e) => {
    e.preventDefault();
    if (forgotCode !== expectedCode) {
      showFeedback('Incorrect verification code', 'error');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      showFeedback('Please enter a new password of at least 4 characters', 'error');
      return;
    }
    setForgotStep('SUCCESS');
    showFeedback('Password reset successfully! You can now log in.', 'success');
  };

  // If user is already logged in, show User Profile & Logout screen
  if (currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                {currentUser.name ? currentUser.name[0] : 'U'}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{currentUser.name}</h3>
                <span className="text-xs font-semibold text-cyan-700 block">{currentUser.role || 'Verified User'}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Business Name:</span>
              <strong className="text-slate-900">{currentUser.businessName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Email Account:</span>
              <span className="font-mono text-slate-800">{currentUser.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-semibold">Mobile Phone:</span>
              <span className="font-mono text-slate-800">{currentUser.phone}</span>
            </div>
          </div>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-extrabold transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        
        {/* Header Banner */}
        <div className="px-6 pt-5 pb-4 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-wide">ChatStock Account Portal</h3>
              <p className="text-xs text-cyan-100">Safe & Secure Business ERP Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification Toast */}
        {statusMessage && (
          <div className={`mx-5 mt-4 p-3 rounded-2xl text-xs font-bold text-center border ${
            statusMessage.type === 'error' 
              ? 'bg-red-50 text-red-800 border-red-300' 
              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
          }`}>
            {statusMessage.text}
          </div>
        )}

        {/* Top Mode Selector Tabs */}
        <div className="px-5 pt-4">
          <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => { setMode('LOGIN'); setForgotStep('EMAIL_INPUT'); }}
              className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
                mode === 'LOGIN' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('REGISTER'); setForgotStep('EMAIL_INPUT'); }}
              className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
                mode === 'REGISTER' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register Account
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">

          {/* ======================= MODE 1: LOGIN ======================= */}
          {mode === 'LOGIN' && (
            <div className="space-y-4">
              
              {/* Switch between Email/Password & Mobile OTP */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLoginMethod('EMAIL')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    loginMethod === 'EMAIL'
                      ? 'bg-cyan-50 border-cyan-400 text-cyan-900 font-extrabold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email & Password</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLoginMethod('MOBILE_OTP')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    loginMethod === 'MOBILE_OTP'
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-extrabold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile OTP Code</span>
                </button>
              </div>

              {/* Email & Password Login Form */}
              {loginMethod === 'EMAIL' ? (
                <form onSubmit={handleEmailLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="admin@chatstock.ai"
                        value={emailLogin}
                        onChange={(e) => setEmailLogin(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">Password</label>
                      <button
                        type="button"
                        onClick={() => setMode('FORGOT_PASSWORD')}
                        className="text-[11px] font-bold text-cyan-700 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={passwordLogin}
                        onChange={(e) => setPasswordLogin(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Sign In with Email</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* Mobile OTP Code Login Form */
                <form onSubmit={handleMobileOtpSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone Number</label>
                    <div className="flex gap-2">
                      <div className="w-16 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 text-center flex items-center justify-center">
                        +91
                      </div>
                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          required
                          placeholder="9876543210"
                          value={mobilePhone}
                          onChange={(e) => setMobilePhone(e.target.value)}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {!mobileOtpSent ? (
                    <button
                      type="button"
                      onClick={handleSendMobileOtp}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Send 6-Digit Verification Code</span>
                    </button>
                  ) : (
                    <div className="space-y-3 pt-2 border-t border-slate-200">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-700">Enter OTP Code sent to mobile</label>
                          <span className="text-[10px] text-emerald-700 font-bold">Auto-filled: {generatedMobileOtp}</span>
                        </div>
                        <input
                          type="text"
                          required
                          maxLength="6"
                          placeholder="123456"
                          value={mobileOtp}
                          onChange={(e) => setMobileOtp(e.target.value)}
                          className="w-full py-2.5 rounded-xl bg-white border-2 border-indigo-500 text-center text-sm font-mono font-extrabold tracking-widest text-slate-900"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify Mobile Code & Login</span>
                      </button>
                    </div>
                  )}
                </form>
              )}

            </div>
          )}

          {/* ======================= MODE 2: REGISTER ======================= */}
          {mode === 'REGISTER' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={registerForm.fullName}
                    onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Business / Shop Name *</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sharma Traders Enterprise"
                    value={registerForm.businessName}
                    onChange={(e) => setRegisterForm({ ...registerForm, businessName: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="email@store.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5 mt-2"
              >
                <span>Create Business Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ======================= MODE 3: FORGOT PASSWORD ======================= */}
          {mode === 'FORGOT_PASSWORD' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-200 text-xs text-cyan-900 space-y-1">
                <strong className="font-extrabold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-700" />
                  Password Reset & Verification
                </strong>
                <p className="text-[11px] text-cyan-800">
                  Enter your email address to receive a 6-digit verification code.
                </p>
              </div>

              {forgotStep === 'EMAIL_INPUT' && (
                <form onSubmit={handleSendForgotCode} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Registered Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="admin@chatstock.ai"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm transition-all"
                  >
                    Send Verification Reset Code
                  </button>
                </form>
              )}

              {forgotStep === 'CODE_VERIFY' && (
                <form onSubmit={handleVerifyForgotCode} className="space-y-3.5">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">Verification Code (sent to email)</label>
                      <span className="text-[10px] font-bold text-emerald-700">Demo Code: {expectedCode}</span>
                    </div>
                    <input
                      type="text"
                      required
                      maxLength="6"
                      value={forgotCode}
                      onChange={(e) => setForgotCode(e.target.value)}
                      className="w-full py-2.5 rounded-xl bg-white border-2 border-indigo-500 text-center text-sm font-mono font-extrabold tracking-widest"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Set New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs font-extrabold shadow-md transition-all"
                  >
                    Reset Password & Continue
                  </button>
                </form>
              )}

              {forgotStep === 'SUCCESS' && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-extrabold text-slate-900">Password Reset Complete!</h4>
                  <p className="text-xs text-slate-600">Your password has been securely updated.</p>
                  <button
                    type="button"
                    onClick={() => setMode('LOGIN')}
                    className="mt-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs"
                  >
                    Return to Sign In
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setMode('LOGIN')}
                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                ← Back to Login
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
