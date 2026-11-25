import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { Button } from '@shared/components/ui';

import styles from './OrderDetails.module.css';

export default function CancelOrderModal({
  open,
  orderId,
  isCancelling,
  error,
  onClose,
  onConfirm,
}) {
  const { t } = useTranslation('orders');
  const modalRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const previousActiveElement = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isCancelling) {
        onCloseRef.current?.();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    modalRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflow;
      previousActiveElement?.focus?.();
    };
  }, [open, isCancelling]);

  if (!open) return null;

  return createPortal(
    <div className={styles.modalOverlay}>
      <div
        className={styles.scrim}
        onClick={!isCancelling ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-modal-title"
        aria-describedby="cancel-modal-desc"
        tabIndex={-1}
        className={styles.modalContent}
      >
        <div className={styles.modalHeader}>
          <h2 id="cancel-modal-title" className={styles.modalTitle}>
            {t('orderDetails.cancelModal.title')}
          </h2>
        </div>

        <p id="cancel-modal-desc" className={styles.modalDescription}>
          {t('orderDetails.cancelModal.description', { id: orderId })}
        </p>

        {error && (
          <div className={styles.alertError} role="alert">
            <span>{error}</span>
          </div>
        )}

        <div className={styles.modalActions}>
          <Button variant="outline" onClick={onClose} disabled={isCancelling}>
            {t('orderDetails.cancelModal.keep')}
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            loading={isCancelling}
            disabled={isCancelling}
          >
            {isCancelling
              ? t('orderDetails.cancelModal.cancelling')
              : t('orderDetails.cancelModal.confirm')}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
