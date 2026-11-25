import { useId, useState } from 'react';

import styles from './Accordion.module.css';

/** Questions that open their answers. items: [{ id, title, content, category? }] */
function Accordion({ items = [], allowMultiple = false, defaultOpenIds = [] }) {
  const [openIds, setOpenIds] = useState(
    allowMultiple ? defaultOpenIds : defaultOpenIds.slice(0, 1),
  );
  const baseId = useId();

  const toggle = (id) =>
    setOpenIds((current) => {
      if (current.includes(id)) return current.filter((openId) => openId !== id);
      return allowMultiple ? [...current, id] : [id];
    });

  return (
    <div>
      {items.map(({ id, title, content, category }) => {
        const isOpen = openIds.includes(id);
        const buttonId = `${baseId}-button-${id}`;
        const panelId = `${baseId}-panel-${id}`;

        return (
          <div key={id} className={styles.item}>
            <button
              id={buttonId}
              type="button"
              className={styles.button}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(id)}
            >
              <span className={styles.question}>
                {category && <span className={styles.category}>{category}</span>}
                <span className={styles.title}>{title}</span>
              </span>
              <span className={styles.sign} aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={[styles.answer, category && styles.indented].filter(Boolean).join(' ')}
              hidden={!isOpen}
            >
              {content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
