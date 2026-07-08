import React, { useState } from 'react';
import { 
  Boxes, 
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
  Sparkles,
  MessageSquare,
  BarChart3,
  ShoppingCart
} from 'lucide-react';

export default function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState('LOGIN'); // 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD'
  const [loginMethod, setLoginMethod] = useState('EMAIL'); // 'EMAIL' | 'MOBILE_OTP'

  // User input login state
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [generatedMobileOtp, setGeneratedMobileOtp] = useState('123456');

  // Register form state ("khud ka detail daalne ka option")
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
  const [expectedCode, setExpectedCode] = useState('849102');
  const [newPassword, setNewPassword] = useState('');

  // Toast feedback
  const [feedback, setFeedback] = useState(null);

  const showToast = (text, type = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleEmailLoginSubmit = (e) => {
    e.preventDefault();
    if (!emailLogin || !passwordLogin) {
      showToast('Please enter your email and password', 'error');
      return;
    }

    const namePart = emailLogin.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const userData = {
      name: formattedName || 'Business User',
      email: emailLogin,
      phone: '+91 98765 43210',
      businessName: `${formattedName}'s Enterprise`,
      role: 'Store Owner'
    };

    onLogin(userData);
  };

  const handleSendMobileOtp = () => {
    if (!mobilePhone || mobilePhone.length < 8) {
      showToast('Please enter a valid mobile phone number', 'error');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedMobileOtp(code);
    setMobileOtpSent(true);
    setMobileOtp(code);
    showToast(`Verification OTP Code Sent: ${code}`, 'success');
  };

  const handleMobileOtpSubmit = (e) => {
    e.preventDefault();
    if (!mobileOtp || mobileOtp !== generatedMobileOtp) {
      showToast('Invalid OTP verification code', 'error');
      return;
    }

    const userData = {
      name: `Merchant-${mobilePhone.slice(-4)}`,
      email: `${mobilePhone}@store.chatstock.ai`,
      phone: `+91 ${mobilePhone}`,
      businessName: 'My Retail Business',
      role: 'Store Owner'
    };

    onLogin(userData);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }

    const userData = {
      name: registerForm.fullName || 'New Merchant',
      email: registerForm.email,
      phone: registerForm.phone,
      businessName: registerForm.businessName || 'My Business Enterprise',
      role: 'Store Owner'
    };

    onLogin(userData);
  };

  const handleSendForgotCode = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast('Please enter your registered email address', 'error');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedCode(code);
    setForgotCode(code);
    setForgotStep('CODE_VERIFY');
    showToast(`Verification code sent to your email: ${code}`, 'success');
  };

  const handleVerifyForgotCode = (e) => {
    e.preventDefault();
    if (forgotCode !== expectedCode) {
      showToast('Incorrect verification code', 'error');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      showToast('Please enter a new password (min 4 characters)', 'error');
      return;
    }
    setForgotStep('SUCCESS');
    showToast('Password reset successful! You can now log in.', 'success');
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 selection:bg-cyan-500 selection:text-white">
      
      {/* Top Logo Header */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-500 shadow-xl shadow-cyan-500/20">
          <Boxes className="h-7 w-7 text-white" />
        </div>
        <div className="text-left">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            ChatStock AI ERP
          </h1>
          <p className="text-xs text-cyan-300 font-medium">
            Conversational Inventory & Business Billing Suite
          </p>
        </div>
      </div>

      {/* Main Glassmorphic Login/Register Container */}
      <div className="w-full max-w-md rounded-3xl bg-white text-slate-900 shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Header Bar inside Card */}
        <div className="px-6 py-5 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black tracking-wide">Welcome to ChatStock</h2>
            <p className="text-xs text-cyan-100 mt-0.5">Please sign in or register your business to access the chat ERP</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/15 backdrop-blur-xs">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {feedback && (
          <div className={`mx-6 mt-4 p-3 rounded-2xl text-xs font-bold text-center border ${
            feedback.type === 'error'
              ? 'bg-red-50 text-red-800 border-red-300'
              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
          }`}>
            {feedback.text}
          </div>
        )}

        {/* Navigation Tabs (Sign In vs Register) */}
        <div className="px-6 pt-5">
          <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => { setMode('LOGIN'); setForgotStep('EMAIL_INPUT'); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                mode === 'LOGIN'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('REGISTER'); setForgotStep('EMAIL_INPUT'); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                mode === 'REGISTER'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register Business
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">

          {/* ======================= MODE 1: LOGIN ======================= */}
          {mode === 'LOGIN' && (
            <div className="space-y-4">
              
              {/* Method Switcher */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLoginMethod('EMAIL')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    loginMethod === 'EMAIL'
                      ? 'bg-cyan-50 border-cyan-400 text-cyan-900 font-extrabold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email & Password</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLoginMethod('MOBILE_OTP')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                    loginMethod === 'MOBILE_OTP'
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-extrabold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Mobile OTP Code</span>
                </button>
              </div>

              {/* Email Login Form */}
              {loginMethod === 'EMAIL' ? (
                <form onSubmit={handleEmailLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="yourname@business.com"
                        value={emailLogin}
                        onChange={(e) => setEmailLogin(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
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
                        placeholder="Enter password"
                        value={passwordLogin}
                        onChange={(e) => setPasswordLogin(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Sign In to Chat ERP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* Mobile OTP Login Form */
                <form onSubmit={handleMobileOtpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Phone Number</label>
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
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  </div>

                  {!mobileOtpSent ? (
                    <button
                      type="button"
                      onClick={handleSendMobileOtp}
                      className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Send 6-Digit OTP Code</span>
                    </button>
                  ) : (
                    <div className="space-y-3.5 pt-2 border-t border-slate-200">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-700">Enter OTP sent to mobile</label>
                          <span className="text-[10px] text-emerald-700 font-bold">Verification Code: {generatedMobileOtp}</span>
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
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify & Open Chat System</span>
                      </button>
                    </div>
                  )}
                </form>
              )}

            </div>
          )}

          {/* ======================= MODE 2: REGISTER ACCOUNT ("khud ka detail daalne ka option") ======================= */}
          {mode === 'REGISTER' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Business / Shop Name *</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sharma Enterprise & Traders"
                    value={registerForm.businessName}
                    onChange={(e) => setRegisterForm({ ...registerForm, businessName: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone *</label>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
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
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg transition-all flex items-center justify-center gap-1.5 mt-2"
              >
                <span>Register & Open Chat ERP</span>
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
                  Password Reset & Verification Code
                </strong>
                <p className="text-[11px] text-cyan-800">
                  Enter your registered email address to receive a 6-digit verification code.
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
                        placeholder="yourname@business.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm transition-all"
                  >
                    Send Verification Reset Code
                  </button>
                </form>
              )}

              {forgotStep === 'CODE_VERIFY' && (
                <form onSubmit={handleVerifyForgotCode} className="space-y-3.5">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">6-Digit Verification Code</label>
                      <span className="text-[10px] font-bold text-emerald-700">Code Sent: {expectedCode}</span>
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
                      placeholder="Enter new password (min 4 chars)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white text-xs font-extrabold shadow-md transition-all"
                  >
                    Verify Code & Reset Password
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

      {/* Footer Features Highlights */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl text-center text-xs text-slate-400">
        <div className="flex items-center justify-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span>Conversational Billing & Stock</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <ShoppingCart className="w-4 h-4 text-emerald-400" />
          <span>GST Printable A4 Invoices</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <span>Enterprise P&L Analytics</span>
        </div>
      </div>

    </div>
  );
}
