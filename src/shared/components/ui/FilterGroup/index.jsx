import { useId, useState } from 'react';

import styles from './FilterGroup.module.css';

export default function FilterGroup({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <section className={styles.group}>
      <h3 className={styles.heading}>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span>{title}</span>
          <span className={`${styles.chevron} ${open ? styles.open : ''}`} aria-hidden="true">
            ▾
          </span>
        </button>
      </h3>

      <div id={panelId} className={styles.panel} hidden={!open}>
        {children}
      </div>
    </section>
  );
}
