import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import {
  fetchAccountOverview,
  getAuthToken,
  getStoredUser,
  hasStoredPaidAccessForProduct,
} from '../lib/account';

export const usePaidAccess = (product: 'livefit' | 'workfit' = 'livefit') => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const checkAccess = async () => {
      const token = getAuthToken();
      const storedUser = getStoredUser();

      if (!token) {
        if (active) {
          setHasAccess(hasStoredPaidAccessForProduct(product, storedUser?.email));
          setLoading(false);
        }
        return;
      }

      try {
        const overview = await fetchAccountOverview(token);
        if (active) {
          setHasAccess(Boolean(
            product === 'livefit'
              ? overview.membershipStatus.livefit?.hasAccess
              : overview.membershipStatus.workfit?.hasAccess
          ));
        }
      } catch (error: unknown) {
        if (active) {
          if (error instanceof AxiosError && error.response?.status === 401) {
            setHasAccess(hasStoredPaidAccessForProduct(product, storedUser?.email));
          } else {
            setHasAccess(hasStoredPaidAccessForProduct(product, storedUser?.email));
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    checkAccess();

    return () => {
      active = false;
    };
  }, [product]);

  return { hasAccess, loading };
};
