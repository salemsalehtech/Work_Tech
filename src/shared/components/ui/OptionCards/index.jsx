import { useEffect, useMemo, useRef, useState } from 'react';

import { useGetProductQuery } from '../../../../features/catalog/api/catalogApi.js';

function calculateTotals(product, selectedIndexes) {
  const basePrice = Number(product.price) || 0;
  const selectedOptions = {};
  let extrasTotal = 0;

  for (const [groupKey, items] of Object.entries(product.options ?? {})) {
    const list = Array.isArray(items) ? items : [];
    const chosen = list[selectedIndexes[groupKey] ?? 0] ?? list[0];
    if (!chosen) continue;

    extrasTotal += Number(chosen.delta) || 0;
    selectedOptions[groupKey] = chosen;
  }

  return { extrasTotal, finalPrice: basePrice + extrasTotal, selectedOptions };
}

const formatPrice = (value, currency) => `${value.toLocaleString()} ${currency}`;

export default function OptionCards({ productId, onChange }) {
  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductQuery(productId, {
    skip: !productId,
  });
  const [selectedIndexes, setSelectedIndexes] = useState({});

  const { extrasTotal, finalPrice, selectedOptions } = useMemo(
    () =>
      product
        ? calculateTotals(product, selectedIndexes)
        : { extrasTotal: 0, finalPrice: 0, selectedOptions: {} },
    [product, selectedIndexes],
  );

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    if (product) {
      onChangeRef.current?.({ finalPrice, extrasTotal, selectedOptions });
    }
  }, [product, finalPrice, extrasTotal, selectedOptions]);

  if (!productId) return null;
  if (isLoading) return <p>Loading...</p>;
  if (isError || !product) return <p>Product is not found</p>;

  const currency = product.currency ?? 'EGP';

  const handleSelect = (groupKey, optionIndex) => {
    if ((selectedIndexes[groupKey] ?? 0) === optionIndex) return;
    setSelectedIndexes((prev) => ({ ...prev, [groupKey]: optionIndex }));
  };

  return (
    <div>
      {Object.entries(product.options ?? {}).map(([groupKey, items]) => (
        <div key={groupKey} style={{ marginBottom: 16 }}>
          <h4 style={{ marginBottom: 8, textTransform: 'capitalize' }}>{groupKey}</h4>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {items.map((item, idx) => {
              const active = (selectedIndexes[groupKey] ?? 0) === idx;
              const delta = Number(item.delta) || 0;

              return (
                <button
                  key={`${groupKey}-${item.label}`}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleSelect(groupKey, idx)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    border: active ? '2px solid #111' : '1px solid #ccc',
                    background: active ? '#f5f5f5' : '#fff',
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{item.label}</div>
                  <div style={{ fontSize: 13 }}>
                    {delta !== 0
                      ? `${delta > 0 ? '+' : ''}${formatPrice(delta, currency)}`
                      : 'Included'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ marginTop: 12 }}>
        <div>
          Total Price <strong>{formatPrice(finalPrice, currency)}</strong>
        </div>
      </div>
    </div>
  );
}
