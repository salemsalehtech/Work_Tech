import styles from './Skeleton.module.css';

/** Loading placeholder: draw the shape of the real content, never a page spinner. */
function Skeleton({ width = '100%', height = 16, radius, className }) {
  return (
    <span
      className={[styles.skeleton, className].filter(Boolean).join(' ')}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

export default Skeleton;
