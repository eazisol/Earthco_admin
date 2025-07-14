// Export all custom hooks
export { default as useApi } from './useApi';
export { default as useAuthApi } from './useAuthApi';

// Export utility hooks
export { 
  useCrud, 
  usePaginatedApi, 
  useSearchApi, 
  useFileUpload 
} from './useApiUtils';

// Re-export individual auth hooks for convenience
export const useLogin = () => {
  const { useLogin: loginHook } = useAuthApi();
  return loginHook();
};

export const useRegister = () => {
  const { useRegister: registerHook } = useAuthApi();
  return registerHook();
};

export const useLogout = () => {
  const { useLogout: logoutHook } = useAuthApi();
  return logoutHook();
};

export const useCurrentUser = () => {
  const { useCurrentUser: currentUserHook } = useAuthApi();
  return currentUserHook();
};

export const useRefreshToken = () => {
  const { useRefreshToken: refreshTokenHook } = useAuthApi();
  return refreshTokenHook();
};

export const useAuthenticatedApi = (url, options) => {
  const { useAuthenticatedApi: authenticatedApiHook } = useAuthApi();
  return authenticatedApiHook(url, options);
}; 