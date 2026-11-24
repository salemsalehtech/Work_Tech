import { useRef } from 'react';

import styles from './SegmentedControl.module.css';

export default function SegmentedControl({ options, value, onChange, ariaLabel }) {
  const buttonsRef = useRef([]);

  const handleKeyDown = (e, index) => {
    const dir = document.dir === 'rtl' ? -1 : 1;
    let next = null;

    if (e.key === 'ArrowRight') next = index + dir;
    if (e.key === 'ArrowLeft') next = index - dir;
    if (next === null) return;

    e.preventDefault();
    const target = (next + options.length) % options.length;
    onChange(options[target].value);
    buttonsRef.current[target]?.focus();
  };

  return (
    <div role="radiogroup" aria-label={ariaLabel} className={styles.group}>
      {options.map((opt, idx) => {
        const active = opt.value === value;

        return (
          <button
            key={opt.value}
            ref={(el) => (buttonsRef.current[idx] = el)}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            className={`${styles.segment} ${active ? styles.active : ''}`}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
