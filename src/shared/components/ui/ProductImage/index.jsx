import { useState } from 'react';

/**
 * A product photo that falls back to the flat laptop drawing of the Figma frames
 * when there is no photo yet or it fails to load.
 */
function ProductImage({ src, alt = '', className }) {
  const [failedSrc, setFailedSrc] = useState(null);

  if (src && failedSrc !== src) {
    return (
      <img
        className={className}
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailedSrc(src)}
      />
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 240 160"
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      <rect x="34" y="10" width="172" height="112" rx="6" fill="var(--color-ink)" />
      <rect x="40" y="16" width="160" height="100" rx="2" fill="var(--color-navy)" />
      <path
        d="M40 88 L118 44 L200 74 L200 116 L40 116 Z"
        fill="var(--color-surface)"
        opacity="0.16"
      />
      <path
        d="M14 124 H226 L218 140 H22 Z"
        fill="var(--color-line)"
        stroke="var(--color-ink)"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export default ProductImage;
