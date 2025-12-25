import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useTokenValidation = () => {
  const { validateTokenOnVisit, isLoading } = useAuth();

  useEffect(() => {
    // Only validate after auth context has finished loading
    if (!isLoading) {
      validateTokenOnVisit();
    }
  }, [isLoading, validateTokenOnVisit]);
};