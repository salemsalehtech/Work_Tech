import { useTranslation } from 'react-i18next';

import Button from '../Button';
import EmptyState from '../EmptyState';

/** A data view that failed to load, with a retry (RTK Query `refetch`). */
function ErrorState({ title, text, onRetry }) {
  const { t } = useTranslation();

  return (
    <EmptyState
      tone="error"
      role="alert"
      eyebrow={t('status.errorEyebrow')}
      title={title ?? t('status.errorTitle')}
      text={text ?? t('status.errorText')}
      action={
        onRetry && (
          <Button variant="outline" onClick={onRetry}>
            {t('status.retry')}
          </Button>
        )
      }
    />
  );
}

export default ErrorState;
