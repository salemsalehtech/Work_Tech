import { Link } from 'react-router-dom';

import styles from './Breadcrumbs.module.css';
function Breadcrumbs({ items }) {
  return (
    <nav className={`breadcrumbs-app ${styles['breadcrumbs-app']}`}>
      <ol className="flex items-center gap-3">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li className="flex justify-between" key={item.label}>
              {isLast ? (
                <span className="text-(--color-ink)" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <div className="flex gap-3">
                  <Link to={item.to}>{item.label}</Link>
                  <span className="text-(--color-text-muted)">/</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
