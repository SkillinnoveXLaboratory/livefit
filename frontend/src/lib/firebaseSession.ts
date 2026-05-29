import type { User } from 'firebase/auth';
import { apiClient } from './api';
import { type AuthResponse, storeAuthSession } from './account';

export const syncFirebaseSession = async (
  user: User,
  options: { role: 'livefit' | 'workfit'; phone?: string; name?: string }
) => {
  const idToken = await user.getIdToken(true);
  const response = await apiClient.post<AuthResponse>('/api/auth/firebase', {
    idToken,
    role: options.role,
    phone: options.phone || '',
    name: options.name || user.displayName || '',
  });

  storeAuthSession(response.data);
  return response.data;
};

export const getPendingSignupProfile = (email: string) => {
  try {
    const value = localStorage.getItem(`pendingSignup:${email.trim().toLowerCase()}`);
    return value ? JSON.parse(value) as { name?: string; phone?: string; role?: 'livefit' | 'workfit' } : null;
  } catch {
    return null;
  }
};

export const setPendingSignupProfile = (
  email: string,
  profile: { name: string; phone: string; role: 'livefit' | 'workfit' }
) => {
  localStorage.setItem(`pendingSignup:${email.trim().toLowerCase()}`, JSON.stringify(profile));
};

export const clearPendingSignupProfile = (email: string) => {
  localStorage.removeItem(`pendingSignup:${email.trim().toLowerCase()}`);
};
