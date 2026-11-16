import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import IconButton from '../IconButton';

import styles from './Drawer.module.css';

/**
 * Side panel over a scrim: the mobile menu (side="start") and the filters (side="end").
 * Esc and the scrim close it, the page behind does not scroll, and focus returns to the opener.
 */
function Drawer({ open, onClose, title, head, side = 'end', footer, children }) {
  const { t } = useTranslation();
  const titleId = useId();
  const panelRef = useRef(null);
  // Latest onClose without re-running the effect: callers may pass a new function every render.
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const onKey = (event) => {
      if (event.key === 'Escape') onCloseRef.current?.();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      opener?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className={styles.root}>
      <div className={styles.scrim} onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className={`${styles.panel} ${styles[side]}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className={styles.head}>
          <span id={titleId}>{head ?? title}</span>
          <IconButton icon="close" label={t('actions.close')} onClick={onClose} />
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.foot}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

export default Drawer;
