import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, IdCard, Lock, Mail, Phone } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import type { User as FirebaseUser } from 'firebase/auth';
import { getSafeRedirectPath } from '../config/auth';
import { createFirebaseUser, linkGoogleUserWithPassword, signInWithGoogle, signOutFirebaseUser } from '../lib/firebase';
import { syncFirebaseSession } from '../lib/firebaseSession';
import { apiClient } from '../lib/api';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role') === 'workfit' ? 'workfit' : 'livefit';
  const nextPath = getSafeRedirectPath(queryParams.get('next'));

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState<FirebaseUser | null>(null);
  const [googleDetails, setGoogleDetails] = useState({ phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [otpExpiresAt, setOtpExpiresAt] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('');

  const getFirebaseMessage = (err: unknown) => {
    if (err instanceof FirebaseError) {
      if (err.code === 'auth/email-already-in-use') return 'This email is already registered. Please sign in instead.';
      if (err.code === 'auth/weak-password') return 'Password should be at least 6 characters.';
      if (err.code === 'auth/popup-closed-by-user') return 'Google sign-in was closed before completion.';
      return err.message;
    }

    if (typeof err === 'object' && err && 'response' in err) {
      const response = (err as { response?: { data?: { message?: string } } }).response;
      if (response?.data?.message) return response.data.message;
    }

    return err instanceof Error ? err.message : 'Something went wrong';
  };

  const formatTimeRemaining = (ms: number) => {
    if (ms <= 0) return '00:00';
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const requestOtp = async () => {
    const response = await apiClient.post('/api/auth/signup/send-otp', {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role,
    });

    const expiresInMs = Number(response.data?.expiresInMs || 10 * 60 * 1000);
    setOtpExpiresAt(Date.now() + expiresInMs);
    setOtp('');
    setOtpStep(true);
    setNotice('OTP sent to your email. Enter the code to finish creating your account.');
  };

  useEffect(() => {
    if (!otpStep || !otpExpiresAt) {
      setTimeRemaining('');
      return undefined;
    }

    const updateCountdown = () => {
      const remaining = otpExpiresAt - Date.now();
      setTimeRemaining(formatTimeRemaining(remaining));
      if (remaining <= 0) {
        setError('OTP expired. Please request a new code.');
      }
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timer);
  }, [otpStep, otpExpiresAt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');

    try {
      await requestOtp();
    } catch (err: unknown) {
      setError(getFirebaseMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');

    try {
      const verifyResponse = await apiClient.post<{ signupOtpToken: string }>('/api/auth/signup/verify-otp', {
        email: formData.email.trim(),
        otp: otp.trim(),
      });

      const firebaseUser = await createFirebaseUser(formData.name.trim(), formData.email.trim(), formData.password);
      const auth = await syncFirebaseSession(firebaseUser, {
        intent: 'signup',
        role,
        phone: formData.phone.trim(),
        name: formData.name.trim(),
        signupOtpToken: verifyResponse.data.signupOtpToken,
      });

      navigate(nextPath || (auth.user.role === 'workfit' ? '/workfit' : '/'));
    } catch (err: unknown) {
      await signOutFirebaseUser().catch(() => undefined);
      setError(getFirebaseMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    setNotice('');

    try {
      await requestOtp();
    } catch (err: unknown) {
      setError(getFirebaseMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    setNotice('');

    try {
      const googleResult = await signInWithGoogle();
      setPendingGoogleUser(googleResult.user);
      setGoogleDetails({ phone: formData.phone.trim(), password: '' });
      setNotice('Add your phone number and password to complete Google signup.');
    } catch (err: unknown) {
      setError(getFirebaseMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingGoogleUser) return;

    setGoogleLoading(true);
    setError('');
    setNotice('');

    try {
      const linkedUser = await linkGoogleUserWithPassword(
        pendingGoogleUser.email || '',
        googleDetails.password
      );

      const auth = await syncFirebaseSession(linkedUser, {
        intent: 'signup',
        role,
        phone: googleDetails.phone.trim(),
        password: googleDetails.password,
        name: linkedUser.displayName || pendingGoogleUser.displayName || formData.name.trim(),
      });
      navigate(nextPath || (auth.user.role === 'workfit' ? '/workfit' : '/'));
    } catch (err: unknown) {
      await signOutFirebaseUser().catch(() => undefined);
      setError(getFirebaseMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  if (pendingGoogleUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f0f4f8] px-4 py-8 text-[#333333]">
        <motion.form
          onSubmit={handleGoogleDetailsSubmit}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md rounded-[28px] bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.1)] sm:p-10"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-xl font-black text-[#4285f4]">G</div>
            <h1 className="text-3xl font-black text-[#1a1a1a]">Complete Google Signup</h1>
            <p className="mt-3 text-sm leading-6 text-[#666666]">Add your phone number and password, then continue to your account.</p>
          </div>

          {error && <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div>}
          {notice && <div className="mb-5 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{notice}</div>}

          <label className="relative mb-5 block">
            <input
              type="tel"
              required
              value={googleDetails.phone}
              onChange={(e) => setGoogleDetails({ ...googleDetails, phone: e.target.value })}
              placeholder="Phone Number"
              className="w-full rounded-xl border-2 border-[#e1e5e8] bg-[#f7f9fa] py-4 pl-12 pr-4 text-[0.95rem] text-[#333333] outline-none transition-all placeholder:text-[#a0a5aa] focus:border-[#ff6a00] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,106,0,0.1)]"
            />
            <Phone className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a0a5aa]" />
          </label>

          <label className="relative mb-6 block">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={googleDetails.password}
              onChange={(e) => setGoogleDetails({ ...googleDetails, password: e.target.value })}
              placeholder="Create Password"
              className="w-full rounded-xl border-2 border-[#e1e5e8] bg-[#f7f9fa] py-4 pl-12 pr-14 text-[0.95rem] text-[#333333] outline-none transition-all placeholder:text-[#a0a5aa] focus:border-[#ff6a00] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,106,0,0.1)]"
            />
            <Lock className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a0a5aa]" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ff6a00]" aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </label>

          <button
            type="submit"
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff4500] to-[#ff8c00] px-5 py-4 text-base font-bold text-white shadow-[0_8px_20px_rgba(255,106,0,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(255,106,0,0.35)] disabled:opacity-70"
          >
            {googleLoading ? 'Saving...' : 'Next'}
            <ArrowRight className="h-5 w-5" />
          </button>
        </motion.form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f4f8] px-4 py-8 flex items-center justify-center text-[#333333]">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-[950px] min-h-[650px] bg-white rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.08),0_0_20px_rgba(0,0,0,0.03)] overflow-hidden grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]"
      >
        <aside className="relative overflow-hidden bg-gradient-to-br from-[#ff5100] to-[#ff8c00] px-8 py-12 sm:px-12 lg:px-[50px] lg:py-[60px] flex flex-col justify-center text-white min-h-[250px]">
          <div className="absolute w-[350px] h-[350px] rounded-full -bottom-[120px] -left-[80px] bg-gradient-to-br from-[rgba(255,123,0,0.8)] to-[rgba(230,32,88,0.8)] shadow-[0_0_40px_rgba(255,106,0,0.3)]" />
          <div className="absolute w-[250px] h-[250px] rounded-full -top-[80px] -right-[60px] bg-gradient-to-br from-[rgba(255,170,0,0.8)] to-[rgba(255,69,0,0.8)] shadow-[0_0_40px_rgba(255,106,0,0.3)]" />
          <div className="absolute w-[180px] h-[180px] rounded-full bottom-[80px] -right-[40px] bg-gradient-to-br from-[rgba(255,123,0,0.8)] to-[rgba(230,32,88,0.8)] opacity-85 shadow-[0_0_40px_rgba(255,106,0,0.3)]" />

          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl font-black uppercase mb-2 leading-tight">Join Us</h1>
            <h2 className="text-lg sm:text-xl font-bold mb-5">
              {role === 'workfit' ? 'WorkFit Corporate Wellness' : 'LiveFit Personal Wellness'}
            </h2>
            <p className="text-sm sm:text-base leading-7 opacity-95 max-w-md">
              Create your account in one step and start exploring guided classes, membership access, and wellness programs.
            </p>
          </div>
        </aside>

        <section className="relative bg-white overflow-hidden">
          <form onSubmit={otpStep ? handleVerifyOtp : handleSubmit} className="min-h-[650px] px-7 py-10 sm:px-12 lg:px-[50px] flex flex-col justify-center">
            <h3 className="text-4xl font-black text-[#1a1a1a] mb-2">Sign up</h3>
            <p className="text-sm text-[#666666] mb-8">
              {otpStep ? 'Enter the OTP sent to your email to complete signup.' : 'Name, phone, email, password, and you are in.'}
            </p>

            {otpStep && (
              <div className="mb-5 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
                OTP expires in {timeRemaining || '00:00'}.
              </div>
            )}

            {error && (
              <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            {notice && (
              <div className="mb-5 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                {notice}
              </div>
            )}

            <label className="relative mb-5 block">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                className="w-full rounded-xl border-2 border-[#e1e5e8] bg-[#f7f9fa] py-4 pl-12 pr-4 text-[0.95rem] text-[#333333] outline-none transition-all placeholder:text-[#a0a5aa] focus:border-[#ff6a00] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,106,0,0.1)]"
              />
              <IdCard className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a0a5aa]" />
            </label>

            <label className="relative mb-5 block">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email Address"
                className="w-full rounded-xl border-2 border-[#e1e5e8] bg-[#f7f9fa] py-4 pl-12 pr-4 text-[0.95rem] text-[#333333] outline-none transition-all placeholder:text-[#a0a5aa] focus:border-[#ff6a00] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,106,0,0.1)]"
              />
              <Mail className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a0a5aa]" />
            </label>

            <label className="relative mb-5 block">
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone Number"
                className="w-full rounded-xl border-2 border-[#e1e5e8] bg-[#f7f9fa] py-4 pl-12 pr-4 text-[0.95rem] text-[#333333] outline-none transition-all placeholder:text-[#a0a5aa] focus:border-[#ff6a00] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,106,0,0.1)]"
              />
              <Phone className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a0a5aa]" />
            </label>

            <label className="relative mb-6 block">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                className="w-full rounded-xl border-2 border-[#e1e5e8] bg-[#f7f9fa] py-4 pl-12 pr-14 text-[0.95rem] text-[#333333] outline-none transition-all placeholder:text-[#a0a5aa] focus:border-[#ff6a00] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,106,0,0.1)]"
              />
              <Lock className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a0a5aa]" />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ff6a00]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </label>

            {otpStep && (
              <>
                <label className="relative mb-4 block">
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    minLength={6}
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full rounded-xl border-2 border-[#e1e5e8] bg-[#f7f9fa] py-4 pl-12 pr-4 text-[0.95rem] text-[#333333] outline-none transition-all placeholder:text-[#a0a5aa] focus:border-[#ff6a00] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,106,0,0.1)]"
                  />
                  <Mail className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a0a5aa]" />
                </label>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="mb-6 flex w-full items-center justify-center rounded-xl border-2 border-[#ffd2bd] bg-[#fff8f3] px-5 py-3 text-sm font-bold text-[#ff6a00] transition-all hover:border-[#ffb37f] hover:bg-[#fff3ea] disabled:opacity-70"
                >
                  Resend OTP
                </button>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff4500] to-[#ff8c00] px-5 py-4 text-base font-bold text-white shadow-[0_8px_20px_rgba(255,106,0,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(255,106,0,0.35)] disabled:opacity-70"
            >
              {loading ? (otpStep ? 'Verifying OTP...' : 'Sending OTP...') : otpStep ? 'Verify OTP & Create Account' : 'Create Account'}
              <ArrowRight className="h-5 w-5" />
            </button>

            {!otpStep && (
              <>
                <div className="my-6 flex items-center text-xs uppercase tracking-widest text-[#999999] before:mr-4 before:flex-1 before:border-b before:border-[#e1e5e8] after:ml-4 after:flex-1 after:border-b after:border-[#e1e5e8]">
                  Or
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border-2 border-[#e1e5e8] px-5 py-4 text-base font-semibold text-[#333333] transition-all hover:border-[#ff6a00] hover:bg-[#fffaf7] hover:text-[#ff6a00] disabled:opacity-70"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-black text-[#4285f4] shadow-sm">G</span>
                  {googleLoading ? 'Connecting Google...' : 'Continue with Google'}
                </button>
              </>
            )}

            <Link
              to={nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : '/login'}
              className="flex w-full items-center justify-center rounded-xl border-2 border-[#e1e5e8] px-5 py-4 text-base font-semibold text-[#333333] transition-all hover:border-[#ff6a00] hover:bg-[#fffaf7] hover:text-[#ff6a00]"
            >
              Already have an account? Sign in
            </Link>
          </form>
        </section>
      </motion.section>
    </main>
  );
};

export default Signup;
