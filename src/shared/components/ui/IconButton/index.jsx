import Icon from '../Icon';

import styles from './IconButton.module.css';

/** Square icon-only button. `label` is required: it is the only name screen readers get. */
function IconButton({ icon, label, pressed, size = 'md', className, ...rest }) {
  const classes = [
    styles.iconButton,
    size === 'sm' && styles.sm,
    icon === 'heart' && styles.heart,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      aria-label={label}
      aria-pressed={pressed === undefined ? undefined : pressed}
      {...rest}
    >
      <Icon name={icon} size={18} filled={icon === 'heart' && pressed} />
    </button>
  );
}

export default IconButton;
