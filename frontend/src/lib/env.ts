const stripTrailingSlashes = (value: string) => value.replace(/\/+$/, '');

export const API_BASE_URL = stripTrailingSlashes(import.meta.env.VITE_API_BASE_URL ?? '');

export const buildMediaUrl = (value?: string | null) => {
  if (!value) {
    return '';
  }

  if (/^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }

  const normalizedValue = value.startsWith('/') ? value : `/${value}`;

  if ((normalizedValue.startsWith('/uploads/') || normalizedValue.startsWith('/images/') || normalizedValue.startsWith('/api/uploads/') || normalizedValue.startsWith('/api/images/')) && API_BASE_URL) {
    if (normalizedValue.startsWith('/api/uploads/')) {
      return `${API_BASE_URL}${normalizedValue.replace('/api', '')}`;
    }

    if (normalizedValue.startsWith('/api/images/')) {
      return `${API_BASE_URL}${normalizedValue.replace('/api', '')}`;
    }

    return `${API_BASE_URL}${normalizedValue}`;
  }

  return value;
};
