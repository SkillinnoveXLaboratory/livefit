import { apiClient } from './api';

const CONTACT_SETTINGS_STORAGE_KEY = 'siteContactSettings';

export type SiteContactSettings = {
  livefitPhone: string;
  workfitPhone: string;
};

const DEFAULT_SITE_CONTACT_SETTINGS: SiteContactSettings = {
  livefitPhone: '+91 9890008742',
  workfitPhone: '+1 9256602776',
};

export type StoredUser = {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'livefit' | 'workfit' | 'admin';
  focusAreas: string[];
  emailVerified?: boolean;
  authProvider?: 'password' | 'firebase' | 'google';
  createdAt?: string;
};

export type AuthResponse = {
  token: string;
  user: StoredUser;
};

type StoredMembership = {
  product?: 'livefit' | 'workfit';
  planId?: string;
  planName?: string;
  email?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  paidAt?: string;
};

export type MembershipStatus = {
  product: string;
  hasAccess: boolean;
  statusLabel: 'Paid' | 'Free';
  planName: string;
  paidAt: string | null;
  amount: number | null;
  currency: string;
  receipt?: string;
  razorpayPaymentId?: string;
};

export type PaymentHistoryItem = {
  id: string;
  product: 'livefit' | 'workfit';
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  receipt: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  status: 'created' | 'paid' | 'failed';
  paidAt: string;
  createdAt: string;
};

export type AccountOverviewResponse = {
  user: StoredUser;
  hasPaidAccess: boolean;
  totalActivePlans: number;
  activePlanNames: string[];
  membershipStatus: {
    livefit: MembershipStatus;
    workfit: MembershipStatus;
  };
  latestMembership: {
    product: 'livefit' | 'workfit';
    planName: string;
    amount: number;
    currency: string;
    paidAt: string;
    receipt: string;
  } | null;
  paymentHistory: PaymentHistoryItem[];
};

const normalizeEmail = (value?: string | null) => String(value || '').trim().toLowerCase();

const readStoredJson = <T,>(key: string): T | null => {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : null;
  } catch {
    return null;
  }
};

const normalizePhoneForWhatsApp = (value: string) => String(value || '').replace(/\D/g, '');

export const getStoredUser = () => readStoredJson<StoredUser>('user');

export const getAuthToken = () => localStorage.getItem('token');

export const storeAuthSession = (auth: AuthResponse) => {
  localStorage.setItem('token', auth.token);
  localStorage.setItem('user', JSON.stringify(auth.user));
};

export const getStoredMemberships = () =>
  ['livefitMembership', 'workfitMembership']
    .map((key) => readStoredJson<StoredMembership>(key))
    .filter((membership): membership is StoredMembership => Boolean(membership));

export const hasStoredPaidAccess = (userEmail?: string | null) => {
  const normalizedUserEmail = normalizeEmail(userEmail);
  if (!normalizedUserEmail) {
    return false;
  }

  return getStoredMemberships().some((membership) => {
    const membershipEmail = normalizeEmail(membership.email || membership.customer?.email);
    return membershipEmail === normalizedUserEmail;
  });
};

export const hasStoredPaidAccessForProduct = (product: 'livefit' | 'workfit', userEmail?: string | null) => {
  const normalizedUserEmail = normalizeEmail(userEmail);

  return getStoredMemberships().some((membership) => {
    const membershipProduct = membership.product || 'livefit';
    if (membershipProduct !== product) {
      return false;
    }

    if (!normalizedUserEmail) {
      return true;
    }

    const membershipEmail = normalizeEmail(membership.email || membership.customer?.email);
    return membershipEmail === normalizedUserEmail;
  });
};

export const hasStoredAnyPaidAccess = () => getStoredMemberships().length > 0;

export const fetchAccountOverview = async (token: string) => {
  const response = await apiClient.get<AccountOverviewResponse>('/api/account/overview', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getSiteContactSettings = () =>
  readStoredJson<SiteContactSettings>(CONTACT_SETTINGS_STORAGE_KEY) || DEFAULT_SITE_CONTACT_SETTINGS;

export const storeSiteContactSettings = (settings: SiteContactSettings) => {
  if (typeof window === 'undefined') {
    return;
  }

  const nextSettings: SiteContactSettings = {
    livefitPhone: String(settings.livefitPhone || DEFAULT_SITE_CONTACT_SETTINGS.livefitPhone).trim(),
    workfitPhone: String(settings.workfitPhone || DEFAULT_SITE_CONTACT_SETTINGS.workfitPhone).trim(),
  };

  localStorage.setItem(CONTACT_SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings));
};

export const getWhatsAppPhone = (product: 'livefit' | 'workfit' = 'livefit') => {
  const settings = getSiteContactSettings();
  return product === 'workfit' ? settings.workfitPhone : settings.livefitPhone;
};

export const buildWhatsAppUrl = (message: string, phone?: string) => {
  const targetPhone = normalizePhoneForWhatsApp(phone || getWhatsAppPhone('livefit'));
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
};

export const redirectToWhatsApp = (message: string, phone?: string) => {
  window.location.assign(buildWhatsAppUrl(message, phone));
};
