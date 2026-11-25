import { useId, useRef } from 'react';

import styles from './Tabs.module.css';

/**
 * Underline tabs. Controlled, so the caller can keep the open tab in the URL.
 * items: [{ id, label }]; children is the panel of the selected tab.
 */
function Tabs({ label, items, value, onChange, children }) {
  const baseId = useId();
  const tabRefs = useRef({});
  const tabId = (id) => `${baseId}-tab-${id}`;
  const panelId = `${baseId}-panel`;

  const handleKeyDown = (event) => {
    const last = items.length - 1;
    const current = items.findIndex((item) => item.id === value);
    const isRtl = document.documentElement.dir === 'rtl';
    const target = {
      [isRtl ? 'ArrowLeft' : 'ArrowRight']: current === last ? 0 : current + 1,
      [isRtl ? 'ArrowRight' : 'ArrowLeft']: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (target === undefined) return;

    event.preventDefault();
    const { id } = items[target];
    onChange?.(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <>
      <div className={styles.tabs} role="tablist" aria-label={label}>
        {items.map((item) => {
          const selected = item.id === value;
          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[item.id] = element;
              }}
              id={tabId(item.id)}
              type="button"
              role="tab"
              className={styles.tab}
              aria-selected={selected}
              aria-controls={selected ? panelId : undefined}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange?.(item.id)}
              onKeyDown={handleKeyDown}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div id={panelId} role="tabpanel" aria-labelledby={tabId(value)}>
        {children}
      </div>
    </>
  );
}

export default Tabs;
