import axios from 'axios';
import { API_BASE_URL } from './env';
import { getSafeRedirectPath } from '../config/auth';

export const ADMIN_LOGIN_PATH = '/admin/login';
export const ADMIN_DASHBOARD_PATH = '/admin';

const ADMIN_STORAGE_KEYS = ['adminToken', 'adminUser'];

export type AdminUser = {
  adminId: string;
  displayName: string;
  role: 'admin';
};

export type AdminOverviewResponse = {
  admin: {
    adminId: string;
    displayName: string;
    joinedLabel: string;
    location: string;
  };
  stats: {
    totalPrograms: number;
    activePrograms: number;
    totalUsers: number;
    uniqueVisitors: number;
    totalPayments: number;
    totalEarned: number;
    usersByRole: {
      livefit: number;
      workfit: number;
    };
  };
  recentPrograms: AdminYogaProgram[];
};

export type AdminYogaProgram = {
  id: string;
  title: string;
  tagline: string;
  desc: string;
  image: string;
  iconKey: string;
  overview: string;
  details: string;
  benefits: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminYogaChallenge = {
  id: string;
  title: string;
  desc: string;
  image: string;
  iconKey: string;
  days: string;
  level: string;
  category: string;
  color: string;
  overview: string;
  follow: string[];
  bestFor: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminSectionContent = {
  title: string;
  description: string;
};

export type AdminYogaChallengesSectionContent = {
  eyebrow: string;
  title: string;
  description: string;
  quote: string;
};

export type AdminManagedUser = {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'livefit' | 'workfit' | 'admin';
  focusAreas: string[];
  createdAt: string;
};

export type AdminUsersResponse = {
  users: AdminManagedUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AdminPaidUser = AdminManagedUser & {
  paid: boolean;
  planId: string;
  planName: string;
  product: 'livefit' | 'workfit';
  source: 'admin' | 'payment' | 'none';
  expiresAt: string | null;
  manualMembership: {
    isManualOverride: boolean;
    status: 'free' | 'paid';
    product: 'livefit' | 'workfit';
    planId: string;
    planName: string;
    expiresAt: string | null;
    updatedAt: string | null;
  };
  totalPayments: number;
  latestPayment: unknown | null;
};

export type AdminPaidUsersResponse = {
  users: AdminPaidUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AdminWorkfitChallenge = {
  id: string;
  slug: string;
  title: string;
  desc: string;
  image: string;
  stat: string;
  statDesc: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminGalleryImage = {
  id: string;
  title: string;
  image: string;
  alt: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminPlaylist = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  category: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminPackage = {
  id: string;
  slug: string;
  name: string;
  priceLabel: string;
  amount: number;
  currency: string;
  period: string;
  features: string[];
  ctaLabel: string;
  checkoutType: 'razorpay' | 'whatsapp';
  isPopular: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ChatMessage = {
  id: string;
  sender: 'user' | 'admin' | 'system';
  text: string;
  createdAt: string;
};

export type AdminChatThread = {
  id: string;
  userId: string | null;
  userName: string;
  email: string;
  phone: string;
  status: 'open' | 'closed';
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
};

export type AdminChatSettings = {
  autoReplyEnabled: boolean;
  autoReplyMessage: string;
};

export const clearAdminSession = () => {
  if (typeof window === 'undefined') {
    return;
  }

  ADMIN_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
};

export const getAdminToken = () => localStorage.getItem('adminToken');

export const getAdminUser = () => {
  try {
    const rawValue = localStorage.getItem('adminUser');
    return rawValue ? (JSON.parse(rawValue) as AdminUser) : null;
  } catch {
    return null;
  }
};

export const buildAdminRedirectPath = (nextPath?: string | null) => {
  const safeNextPath = getSafeRedirectPath(nextPath);
  if (!safeNextPath) {
    return ADMIN_LOGIN_PATH;
  }

  return `${ADMIN_LOGIN_PATH}?next=${encodeURIComponent(safeNextPath)}`;
};

export const redirectToAdminLogin = (nextPath?: string | null) => {
  if (typeof window === 'undefined') {
    return;
  }

  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (window.location.pathname === ADMIN_LOGIN_PATH) {
    return;
  }

  window.location.assign(buildAdminRedirectPath(nextPath || currentPath));
};

export const adminApiClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isHandlingAdminRedirect = false;

adminApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = String(error.response?.data?.message || '');
    const shouldRedirect =
      status === 401 ||
      (status === 403 && message.includes('Admin permissions required')) ||
      message.includes('Invalid or expired token') ||
      message.includes('No authorization token provided');

    if (shouldRedirect && !isHandlingAdminRedirect) {
      isHandlingAdminRedirect = true;
      clearAdminSession();
      redirectToAdminLogin();
      window.setTimeout(() => {
        isHandlingAdminRedirect = false;
      }, 300);
    }

    return Promise.reject(error);
  }
);
