const stripTrailingSlashes = (value: string) => value.replace(/\/+$/, '');

export const API_BASE_URL = stripTrailingSlashes(import.meta.env.VITE_API_BASE_URL ?? '');

export const buildMediaUrl = (value?: string | null) => {
  if (!value) {
    return '';
  }

  if (/^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }

  if ((value.startsWith('/uploads/') || value.startsWith('/images/')) && API_BASE_URL) {
    return `${API_BASE_URL}${value}`;
  }

  return value;
};
