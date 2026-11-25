import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { CATEGORIES } from '@/features/data/Categories';

function Navbar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation('catalog');
  const activeCategory = searchParams.get('category') ?? 'All Laptops';
  const handleCategory = (Key) => {
    const nextParams = new URLSearchParams(searchParams);
    if (Key === 'All Laptops') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', Key);
    }

    nextParams.delete('page');

    setSearchParams(nextParams);
  };

  return (
    <nav className="w-full h-12.5 border border-(--color-line) flex justify-between items-center">
      <ul className="flex items-center gap-10 font-medium ml-20">
        {CATEGORIES.map(({ key, highlight }) => {
          const isActive = activeCategory === key;

          return (
            <li key={key}>
              <button
                type="button"
                className={`${isActive ? 'border-b-3 py-2.5' : ''} ${highlight ? 'text-(--color-red)!' : ''} cursor-pointer`}
                aria-pressed={isActive}
                onClick={() => handleCategory(key)}
              >
                {t(`${key}`)}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center justify-center gap-1.5 mr-20 ">
        <div className="h-2 w-2 bg-(--color-gold)"></div>
        <span className="font-medium cursor-pointer">Laptop Finder</span>
      </div>
    </nav>
  );
}

export default Navbar;
