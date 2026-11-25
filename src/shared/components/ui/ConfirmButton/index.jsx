import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../Button';

import styles from './ConfirmButton.module.css';

/** A danger action that asks first. `name` is what screen readers hear when `label` is not enough. */
function ConfirmButton({
  label,
  name,
  question,
  confirmLabel = label,
  onConfirm,
  loading = false,
}) {
  const { t } = useTranslation();
  const [asking, setAsking] = useState(false);

  if (!asking) {
    return (
      <Button variant="danger" aria-label={name} onClick={() => setAsking(true)}>
        {label}
      </Button>
    );
  }

  return (
    <span className={styles.confirm} role="group" aria-label={question}>
      <span>{question}</span>
      <Button variant="danger" loading={loading} disabled={loading} onClick={onConfirm}>
        {confirmLabel}
      </Button>
      <Button variant="link" disabled={loading} onClick={() => setAsking(false)}>
        {t('actions.keep')}
      </Button>
    </span>
  );
}

export default ConfirmButton;
