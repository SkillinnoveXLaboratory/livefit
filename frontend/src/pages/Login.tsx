import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Lock, Mail, UserPlus } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { getSafeRedirectPath } from '../config/auth';
import { signInFirebaseUser, signInWithGoogle } from '../lib/firebase';
import { clearPendingSignupProfile, getPendingSignupProfile, syncFirebaseSession } from '../lib/firebaseSession';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectParams = new URLSearchParams(location.search);
  const nextPath = getSafeRedirectPath(redirectParams.get('next'));
  const signupRole = nextPath?.startsWith('/workfit') ? 'workfit' : 'livefit';
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const getFirebaseMessage = (err: unknown) => {
    if (err instanceof FirebaseError) {
      if (err.code === 'auth/invalid-credential') return 'Invalid email or password';
      if (err.code === 'auth/popup-closed-by-user') return 'Google sign-in was closed before completion.';
      return err.message;
    }

    if (typeof err === 'object' && err && 'response' in err) {
      const response = (err as { response?: { data?: { message?: string } } }).response;
      if (response?.data?.message) return response.data.message;
    }

    return err instanceof Error ? err.message : 'Invalid email or password';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');

    try {
      const firebaseUser = await signInFirebaseUser(formData.email.trim(), formData.password);
      const pendingProfile = getPendingSignupProfile(formData.email);
      const auth = await syncFirebaseSession(firebaseUser, {
        role: pendingProfile?.role || signupRole,
        phone: pendingProfile?.phone || '',
        name: pendingProfile?.name || firebaseUser.displayName || '',
      });
      clearPendingSignupProfile(formData.email);

      navigate(nextPath || (auth.user.role === 'workfit' ? '/workfit' : '/'));
    } catch (error: unknown) {
      setError(getFirebaseMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    setNotice('');

    try {
      const firebaseUser = await signInWithGoogle();
      const auth = await syncFirebaseSession(firebaseUser, {
        role: signupRole,
        name: firebaseUser.displayName || '',
      });
      navigate(nextPath || (auth.user.role === 'workfit' ? '/workfit' : '/'));
    } catch (error: unknown) {
      setError(getFirebaseMessage(error));
    } finally {
      setGoogleLoading(false);
    }
  };

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
            <h1 className="text-4xl sm:text-5xl font-black uppercase mb-2 leading-tight">Welcome</h1>
            <h2 className="text-lg sm:text-xl font-bold mb-5">LiveFit Wellness</h2>
            <p className="text-sm sm:text-base leading-7 opacity-95 max-w-md">
              Sign in to continue your wellness journey, manage your membership, and access LiveFit or WorkFit experiences.
            </p>
          </div>
        </aside>

        <section className="relative bg-white overflow-hidden">
          <form onSubmit={handleSubmit} className="min-h-[650px] px-7 py-10 sm:px-12 lg:px-[50px] flex flex-col justify-center">
            <h3 className="text-4xl font-black text-[#1a1a1a] mb-2">Sign in</h3>
            <p className="text-sm text-[#666666] mb-8">Use your email and password to enter your account.</p>

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
                type={showPassword ? 'text' : 'password'}
                required
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

            <div className="mb-6 flex items-center justify-between gap-4 px-1 text-sm text-[#555555]">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" className="h-4 w-4 accent-[#ff6a00]" />
                Remember me
              </label>
              <button type="button" className="font-semibold text-[#ff6a00] hover:text-[#cc5500]">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff4500] to-[#ff8c00] px-5 py-4 text-base font-bold text-white shadow-[0_8px_20px_rgba(255,106,0,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(255,106,0,0.35)] disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign in'}
              <ArrowRight className="h-5 w-5" />
            </button>

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

            <Link
              to={nextPath ? `/signup?role=${signupRole}&next=${encodeURIComponent(nextPath)}` : `/signup?role=${signupRole}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#e1e5e8] px-5 py-4 text-base font-semibold text-[#333333] transition-all hover:border-[#ff6a00] hover:bg-[#fffaf7] hover:text-[#ff6a00]"
            >
              <UserPlus className="h-5 w-5" />
              Create account
            </Link>
          </form>
        </section>
      </motion.section>
    </main>
  );
};

export default Login;
