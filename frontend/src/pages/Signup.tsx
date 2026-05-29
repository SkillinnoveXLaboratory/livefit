import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, IdCard, Lock, Mail, Phone } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { getSafeRedirectPath } from '../config/auth';
import { createFirebaseUser, signInWithGoogle, signOutFirebaseUser } from '../lib/firebase';
import { setPendingSignupProfile, syncFirebaseSession } from '../lib/firebaseSession';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role') === 'workfit' ? 'workfit' : 'livefit';
  const nextPath = getSafeRedirectPath(queryParams.get('next'));

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const getFirebaseMessage = (err: unknown) => {
    if (err instanceof FirebaseError) {
      if (err.code === 'auth/email-already-in-use') return 'This email is already registered. Please sign in instead.';
      if (err.code === 'auth/weak-password') return 'Password should be at least 6 characters.';
      if (err.code === 'auth/popup-closed-by-user') return 'Google sign-in was closed before completion.';
      return err.message;
    }

    return err instanceof Error ? err.message : 'Something went wrong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');

    try {
      await createFirebaseUser(formData.name.trim(), formData.email.trim(), formData.password);
      setPendingSignupProfile(formData.email, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        role,
      });
      await signOutFirebaseUser();
      setNotice('Verification email sent. Please verify your email, then sign in.');
      setFormData((previous) => ({ ...previous, password: '' }));
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
      const firebaseUser = await signInWithGoogle();
      const auth = await syncFirebaseSession(firebaseUser, {
        role,
        phone: formData.phone.trim(),
        name: firebaseUser.displayName || formData.name.trim(),
      });
      navigate(nextPath || (auth.user.role === 'workfit' ? '/workfit' : '/'));
    } catch (err: unknown) {
      setError(getFirebaseMessage(err));
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
          <form onSubmit={handleSubmit} className="min-h-[650px] px-7 py-10 sm:px-12 lg:px-[50px] flex flex-col justify-center">
            <h3 className="text-4xl font-black text-[#1a1a1a] mb-2">Sign up</h3>
            <p className="text-sm text-[#666666] mb-8">Name, phone, email, password, and you are in.</p>

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

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff4500] to-[#ff8c00] px-5 py-4 text-base font-bold text-white shadow-[0_8px_20px_rgba(255,106,0,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(255,106,0,0.35)] disabled:opacity-70"
            >
              {loading ? 'Creating account...' : 'Create Account'}
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
