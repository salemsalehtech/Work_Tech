import { useTranslation } from 'react-i18next';

import { Button, Container, ErrorState } from '@shared/components/ui';
import { PATHS } from '@shared/constants';

/** Shown by the router when a page throws, instead of a blank screen. */
function RouteError() {
  const { t } = useTranslation();

  return (
    <Container>
      <ErrorState onRetry={() => window.location.reload()} />
      <Button variant="link" to={PATHS.HOME}>
        {t('actions.backHome')}
      </Button>
    </Container>
  );
}

export default RouteError;
