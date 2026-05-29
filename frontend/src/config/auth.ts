export const SHOW_LOGIN = true;

export const AUTH_FALLBACK_PATH = SHOW_LOGIN ? '/login' : '/signup';
export const AUTH_ROUTES = ['/login', '/signup'];

const AUTH_STORAGE_KEYS = ['token', 'user', 'livefitMembership', 'workfitMembership'];

export const clearStoredSession = () => {
  if (typeof window === 'undefined') {
    return;
  }

  AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
};

export const getSafeRedirectPath = (value?: string | null) => {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return null;
  }

  return value;
};

export const buildAuthRedirectPath = (nextPath?: string | null) => {
  const safeNextPath = getSafeRedirectPath(nextPath);

  if (!safeNextPath) {
    return AUTH_FALLBACK_PATH;
  }

  const separator = AUTH_FALLBACK_PATH.includes('?') ? '&' : '?';
  return `${AUTH_FALLBACK_PATH}${separator}next=${encodeURIComponent(safeNextPath)}`;
};

export const redirectToAuthPage = (nextPath?: string | null) => {
  if (typeof window === 'undefined') {
    return;
  }

  const currentPath = window.location.pathname;
  if (AUTH_ROUTES.includes(currentPath)) {
    return;
  }

  const fallbackNextPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.location.assign(buildAuthRedirectPath(nextPath || fallbackNextPath));
};
