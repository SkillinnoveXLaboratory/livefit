import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  KeyRound,
  Lock,
  Receipt,
  ShieldCheck,
  Sparkles,
  UserCircle2,
} from 'lucide-react';
import { apiClient } from '../lib/api';
import {
  type AccountOverviewResponse,
  fetchAccountOverview,
  getAuthToken,
  getStoredUser,
} from '../lib/account';

const formatCurrency = (amount: number | null, currency = 'INR') => {
  if (amount === null) return 'Free';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
};

const formatDate = (value?: string | null) => {
  if (!value) return 'Not active yet';

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const Settings = () => {
  const storedUser = getStoredUser();
  const token = getAuthToken();
  const [overview, setOverview] = useState<AccountOverviewResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const loadOverview = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetchAccountOverview(token);
        setOverview(response);
      } catch (err: unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.message || 'Unable to load your settings right now.');
        } else {
          setError('Unable to load your settings right now.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, [token]);

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      setPasswordError('Please login first.');
      return;
    }

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      setPasswordSuccess('');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      setPasswordSuccess('');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      setPasswordSuccess('');
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordError('');
      setPasswordSuccess('');

      const response = await apiClient.post<{ message: string }>(
        '/api/auth/change-password',
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPasswordSuccess(response.data.message);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setPasswordError(err.response?.data?.message || 'Unable to update password.');
      } else {
        setPasswordError('Unable to update password.');
      }
      setPasswordSuccess('');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!storedUser || !token) {
    return (
      <div className="min-h-screen bg-white px-4 py-32 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[2.5rem] border border-orange-100 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-orange-500">Account Settings</p>
            <h1 className="mb-4 font-serif text-4xl font-bold italic text-sky-950">Sign in to view billing & settings</h1>
            <p className="mx-auto mb-8 max-w-xl text-sm leading-7 text-sky-900/60">
              Your payment history, current plan status, and password controls are available once you log in to your account.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-950 px-7 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-white"
              >
                Login
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-orange-200 bg-white px-7 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-orange-600"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const livefitMembership = overview?.membershipStatus.livefit || null;
  const activePlansCount = livefitMembership?.hasAccess ? 1 : 0;
  const activePlansSummary = activePlansCount === 1
    ? 'This means 1 active paid membership is currently running on your account.'
    : 'This means no active paid LiveFit membership is running right now.';
  const livefitLatestMembership = overview?.latestMembership?.product === 'livefit' ? overview.latestMembership : null;

  return (
    <div className="min-h-screen overflow-hidden bg-white px-4 pb-20 pt-32 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-24 h-72 w-72 rounded-full bg-slate-50 blur-3xl" />
        <div className="absolute bottom-16 right-[-10%] h-96 w-96 rounded-full bg-sky-100/80 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 overflow-hidden rounded-[2.75rem] border border-orange-100 bg-gradient-to-br from-sky-950 via-sky-900 to-orange-600 px-8 py-10 text-white shadow-[0_32px_90px_rgba(15,23,42,0.2)] sm:px-10 sm:py-12"
        >
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.38em] text-orange-200">Settings</p>
              <h1 className="mb-4 font-serif text-4xl font-bold italic sm:text-5xl">Account, Billing & Access</h1>
              <p className="max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                Track your payment history, see your current plan access, and update your password from one clean place.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-orange-200">Current Paid Status</p>
                <p className="text-2xl font-black">{livefitLatestMembership ? livefitLatestMembership.planName : 'Free Access'}</p>
                <p className="mt-2 text-sm text-white/70">
                  {livefitLatestMembership
                    ? 'LiveFit membership is active'
                    : 'No paid plan found for this account yet'}
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-orange-200">Active Plans</p>
                <p className="text-2xl font-black">{activePlansCount}</p>
                <p className="mt-2 text-sm text-white/70">
                  {activePlansCount > 0
                    ? activePlansSummary
                    : 'You are currently on free access only.'}
                </p>
                {livefitMembership?.hasAccess && livefitLatestMembership && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                      {livefitLatestMembership.planName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-48 animate-pulse rounded-[2rem] bg-white/80 shadow-sm" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-red-100 bg-white p-8 text-red-600 shadow-sm">
            {error}
          </div>
        ) : overview ? (
          <>
            <section className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_1.9fr]">
              <div className="rounded-[2.25rem] border border-orange-100 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-orange-500">Account Snapshot</p>
                    <h2 className="text-2xl font-black text-sky-950">{overview.user.name}</h2>
                    <p className="mt-1 text-sm text-sky-900/55">{overview.user.email}</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                    <UserCircle2 className="h-7 w-7" />
                  </div>
                </div>

                <div className="space-y-4 text-sm text-sky-900/70">
                  <div className="rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-sky-400">Role</p>
                    <p className="font-bold uppercase tracking-widest text-sky-950">{overview.user.role}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-sky-400">Phone</p>
                    <p className="font-bold text-sky-950">{overview.user.phone || 'Not added yet'}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-sky-400">Joined</p>
                    <p className="font-bold text-sky-950">{formatDate(overview.user.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {livefitMembership ? (
                  <div
                    className={`rounded-[2.25rem] border p-7 shadow-[0_20px_60px_rgba(15,23,42,0.06)] ${
                      livefitMembership.hasAccess
                        ? 'border-orange-200 bg-gradient-to-br from-white to-orange-50/70'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-orange-500">livefit</p>
                        <h3 className="text-2xl font-black text-sky-950">{livefitMembership.statusLabel}</h3>
                      </div>
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                          livefitMembership.hasAccess ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {livefitMembership.hasAccess ? <BadgeCheck className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
                      </div>
                    </div>

                    <div className="mb-5 rounded-[1.5rem] bg-white/70 px-4 py-4">
                      <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-sky-400">Current Plan</p>
                      <p className="text-lg font-black text-sky-950">{livefitMembership.planName}</p>
                    </div>

                    <div className="space-y-3 text-sm text-sky-900/65">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-semibold uppercase tracking-widest text-[10px] text-sky-400">Amount</span>
                        <span className="font-bold text-sky-950">{formatCurrency(livefitMembership.amount, livefitMembership.currency)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-semibold uppercase tracking-widest text-[10px] text-sky-400">Updated</span>
                        <span className="font-bold text-right text-sky-950">{formatDate(livefitMembership.paidAt)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[2.25rem] border border-slate-200 bg-white p-7 text-sm text-sky-900/60">
                    No LiveFit plan is currently active on this account.
                  </div>
                )}
              </div>
            </section>

            <section className="grid gap-8 xl:grid-cols-[1.55fr_0.95fr]">
              <div className="rounded-[2.25rem] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-orange-500">Payment History</p>
                    <h2 className="text-2xl font-black text-sky-950">All Transactions</h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-950">
                    <Receipt className="h-6 w-6" />
                  </div>
                </div>

                {overview.paymentHistory.length === 0 ? (
                  <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                    <p className="text-lg font-black text-sky-950">No payments yet</p>
                    <p className="mt-2 text-sm text-sky-900/55">This account is currently on the free tier.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {overview.paymentHistory.map((payment) => (
                      <div key={payment.id} className="rounded-[1.75rem] border border-slate-100 bg-slate-50/60 p-5">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-sky-950 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-white">
                                {payment.product}
                              </span>
                              <span
                                className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] ${
                                  payment.status === 'paid'
                                    ? 'bg-green-50 text-green-600'
                                    : payment.status === 'failed'
                                      ? 'bg-red-50 text-red-600'
                                      : 'bg-orange-50 text-orange-600'
                                }`}
                              >
                                {payment.status}
                              </span>
                            </div>
                            <h3 className="text-xl font-black text-sky-950">{payment.planName}</h3>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-lg font-black text-orange-600">
                              {formatCurrency(payment.amount, payment.currency)}
                            </p>
                            <p className="text-xs font-semibold text-sky-900/45">{formatDate(payment.paidAt || payment.createdAt)}</p>
                          </div>
                        </div>

                        <div className="grid gap-3 text-sm text-sky-900/65 sm:grid-cols-2">
                          <div className="rounded-2xl bg-white px-4 py-3">
                            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-sky-400">Payment ID</p>
                            <p className="font-bold text-sky-950 break-all">{payment.razorpayPaymentId}</p>
                          </div>
                          <div className="rounded-2xl bg-white px-4 py-3">
                            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-sky-400">Order ID</p>
                            <p className="font-bold text-sky-950 break-all">{payment.razorpayOrderId}</p>
                          </div>
                          <div className="rounded-2xl bg-white px-4 py-3 sm:col-span-2">
                            <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-sky-400">Receipt</p>
                            <p className="font-bold text-sky-950 break-all">{payment.receipt}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-[2.25rem] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-orange-500">Security</p>
                    <h2 className="text-2xl font-black text-sky-950">Change Password</h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                    <KeyRound className="h-6 w-6" />
                  </div>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-sky-400">Current Password</span>
                    <div className="relative">
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(event) =>
                          setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-11 text-sm font-medium text-sky-950 outline-none transition-all focus:border-orange-500"
                        placeholder="Enter current password"
                      />
                      <Lock className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-sky-400">New Password</span>
                    <div className="relative">
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(event) =>
                          setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-11 text-sm font-medium text-sky-950 outline-none transition-all focus:border-orange-500"
                        placeholder="Minimum 8 characters"
                      />
                      <ShieldCheck className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-sky-400">Confirm Password</span>
                    <div className="relative">
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(event) =>
                          setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-11 text-sm font-medium text-sky-950 outline-none transition-all focus:border-orange-500"
                        placeholder="Repeat your new password"
                      />
                      <CreditCard className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                  </label>

                  {passwordError && (
                    <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-600">
                      {passwordSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 text-[11px] font-black uppercase tracking-[0.24em] text-white shadow-xl shadow-orange-100 transition-all hover:bg-orange-600 disabled:opacity-70"
                  >
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Settings;
