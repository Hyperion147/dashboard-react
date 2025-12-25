

export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  
  try {
    // Decode JWT token to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Add 5 minute buffer to prevent edge cases
    return payload.exp < (currentTime + 300);
  } catch (error) {
    // If we can't decode the token, don't consider it expired immediately
    // Let the server handle validation
    return false;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminRefreshToken');
  localStorage.removeItem('adminData');
  localStorage.removeItem('adminEmployee');
  localStorage.removeItem('adminCompanyId');
  localStorage.removeItem('adminTokenExpiry');
};

export const validateTokenWithServer = async (_token: string): Promise<boolean> => {
  return true;
};

export const getStoredAuthData = () => {
  const token = localStorage.getItem('adminToken');
  const userData = localStorage.getItem('adminData');
  const employeeData = localStorage.getItem('adminEmployee');
  const companyId = localStorage.getItem('adminCompanyId');
  const refreshToken = localStorage.getItem('adminRefreshToken');
  
  // Check for invalid stored data
  if (token === 'undefined' || token === 'null' || 
      userData === 'undefined' || userData === 'null' ||
      employeeData === 'undefined' || employeeData === 'null' ||
      companyId === 'undefined' || companyId === 'null') {
    clearAuthData();
    return null;
  }
  
  if (!token || !userData || !employeeData || !companyId) {
    return null;
  }
  
  try {
    const parsedUser = JSON.parse(userData);
    const parsedEmployee = JSON.parse(employeeData);
    return {
      token,
      user: parsedUser,
      employee: parsedEmployee,
      companyId,
      refreshToken,
    };
  } catch (error) {
    clearAuthData();
    return null;
  }
};