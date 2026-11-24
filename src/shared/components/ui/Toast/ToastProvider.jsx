import { useCallback, useEffect, useRef, useState } from 'react';

import Toast from './Toast';
import { ToastContext } from './useToastContext';

export default function ToastProvider({ children, duration = 4000 }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const show = useCallback(
    ({ title, tone = 'info' }) => {
      clearTimeout(timerRef.current);
      setToast({ title, tone });
      timerRef.current = setTimeout(() => setToast(null), duration);
    },
    [duration],
  );
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && <Toast title={toast.title} tone={toast.tone} />}
    </ToastContext.Provider>
  );
}
