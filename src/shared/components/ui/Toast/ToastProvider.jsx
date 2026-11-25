import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import styles from './Toast.module.css';
import { ToastContext } from './useToast';

import Toast from '.';

/** Holds the live region of the toasts. A new toast replaces the one on screen. */
function ToastProvider({ children, duration = 4000 }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const show = useCallback(
    ({ title, tone }) => {
      clearTimeout(timerRef.current);
      setToast({ title, tone });
      timerRef.current = setTimeout(() => setToast(null), duration);
    },
    [duration],
  );
  const context = useMemo(() => ({ show }), [show]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <ToastContext.Provider value={context}>
      {children}
      <div className={styles.region} role="status">
        {toast && <Toast title={toast.title} tone={toast.tone} />}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
