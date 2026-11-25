import { useId, useState } from 'react';

import Icon from '../Icon';

import styles from './FilterGroup.module.css';

/** One titled, collapsible group of the catalog filters. */
function FilterGroup({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const panelId = `${baseId}-panel`;

  return (
    <div className={styles.group} role="group" aria-labelledby={titleId}>
      <button
        id={titleId}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        {title}
        <span className={styles.chevron}>
          <Icon name="chevron" size={14} />
        </span>
      </button>
      <div id={panelId} className={styles.panel} hidden={!open}>
        {children}
      </div>
    </div>
  );
}

export default FilterGroup;
