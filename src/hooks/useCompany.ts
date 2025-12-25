import { useAuth } from '@/contexts/AuthContext';

export const useCompany = () => {
  const { companyId, employee } = useAuth();
  
  return {
    companyId: companyId || null,
    company: employee?.company || null,
    isLoading: !companyId,
  };
};

export const useCompanyId = (): string => {
  const { companyId } = useAuth();
  
  if (!companyId) {
    throw new Error('Company ID not available. User might not be logged in.');
  }
  
  return companyId;
};