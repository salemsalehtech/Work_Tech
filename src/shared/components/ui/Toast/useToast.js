import { createContext, useContext } from 'react';

export const ToastContext = createContext(null);

/** const toast = useToast(); toast.show({ title: t('added') }); */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast needs a ToastProvider above it.');
  return context;
}
