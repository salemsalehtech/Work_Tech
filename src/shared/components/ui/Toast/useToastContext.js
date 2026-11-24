import { createContext, useContext } from 'react';
export const ToastContext = createContext(null);
export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToastContext must be used inside <ToastProvider>');
  return ctx;
}
