import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { ProductListing } from '@features/catalog';
import { Button, Container } from '@shared/components/ui';
import { searchPath } from '@shared/constants';

import styles from './SearchResults.module.css';

const SEARCH_SUGGESTIONS = ['ROG', 'Zenbook', 'ThinkPad', 'OLED', 'RTX 4060'];

function SearchResults() {
  const { t } = useTranslation('catalog');
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() ?? '';

  return (
    <Container className={styles.page}>
      <ProductListing
        title={query ? t('search.titleWithQuery', { query }) : t('search.titleEmpty')}
        emptyTitle={query ? t('search.emptyTitleWithQuery', { query }) : t('search.emptyTitle')}
        emptyText={t('search.emptyText')}
        emptyAction={
          <nav className={styles.suggestions} aria-label={t('search.suggestionsLabel')}>
            {SEARCH_SUGGESTIONS.map((term) => (
              <Button key={term} to={searchPath(term)} variant="quiet" size="sm">
                {term}
              </Button>
            ))}
          </nav>
        }
      />
    </Container>
  );
}

export default SearchResults;
