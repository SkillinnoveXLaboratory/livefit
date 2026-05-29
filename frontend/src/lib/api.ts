import axios from 'axios';
import { API_BASE_URL } from './env';
import { clearStoredSession, redirectToAuthPage } from '../config/auth';

export const apiClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isHandlingAuthRedirect = false;

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = String(error.response?.data?.message || '');
    const isExpiredOrInvalidToken =
      status === 401 && (
        message.includes('Invalid or expired token') ||
        message.includes('No authorization token provided')
      );
    const isMissingUserForToken = status === 404 && message.includes('User not found');

    if ((isExpiredOrInvalidToken || isMissingUserForToken) && !isHandlingAuthRedirect) {
      isHandlingAuthRedirect = true;
      clearStoredSession();
      redirectToAuthPage();
      window.setTimeout(() => {
        isHandlingAuthRedirect = false;
      }, 300);
    }

    return Promise.reject(error);
  }
);
