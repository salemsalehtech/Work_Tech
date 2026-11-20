import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import { addItem } from '@features/cart';
import { useGetProductQuery } from '@features/catalog';
import { priceWithOptions } from '@shared/utils';
import { formatPrice } from '@shared/utils/formatPrice';
function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { data: product, isLoading, isError } = useGetProductQuery(id);

  const [selectedOptions, setSelectedOptions] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const defaultSelection = {
    memory: product?.options?.memory?.[0]?.label ?? '',
    storage: product?.options?.storage?.[0]?.label ?? '',
    warranty: product?.options?.warranty?.[0]?.label ?? '',
  };

  const selection = {
    ...defaultSelection,
    ...selectedOptions,
  };

  const handleOptionChange = (key, value) => {
    setSelectedOptions((previous) => ({
      ...defaultSelection,
      ...previous,
      [key]: value,
    }));
  };

  if (isLoading) {
    return <main style={{ padding: 40 }}>Loading product...</main>;
  }

  if (isError || !product) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Product not found</h1>
        <Link to="/products">Back to products</Link>
      </main>
    );
  }

  const finalPrice = priceWithOptions(product.price, product.options, selection);

  const warrantyDelta =
    product.options?.warranty?.find((option) => option.label === selection.warranty)?.delta ?? 0;

  const specsLine = [
    product.specs?.cpu,
    product.specs?.ram ? `${product.specs.ram} GB RAM` : null,
    product.specs?.storage ? `${product.specs.storage} GB Storage` : null,
    product.specs?.gpu,
  ]
    .filter(Boolean)
    .join(' · ');

  const handleAddToCart = () => {
    dispatch(
      addItem({
        productId: product.id,
        kind: 'laptop',
        name: product.name,
        brand: product.brand,
        image: product.images?.[0] ?? '',
        specsLine,
        price: finalPrice,
        warrantyDelta,
        options: selection,
        quantity,
        stock: product.stock,
      }),
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const renderOption = (key, label) => {
    const options = product.options?.[key];

    if (!options?.length) return null;

    return (
      <div style={{ marginBottom: 20 }}>
        <label htmlFor={key} style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
          {label}
        </label>

        <select
          id={key}
          value={selection[key]}
          onChange={(event) => handleOptionChange(key, event.target.value)}
          style={{
            width: '100%',
            maxWidth: 350,
            padding: 12,
            border: '1px solid #ccc',
            borderRadius: 8,
          }}
        >
          {options.map((option) => (
            <option key={option.label} value={option.label}>
              {option.label}
              {option.delta > 0 ? ` (+${formatPrice(option.delta)})` : ''}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <main style={{ padding: '30px 0' }}>
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        <div style={{ marginBottom: 25 }}>
          <Link to="/">Home</Link>
          {' / '}
          <Link to="/products">Products</Link>
          {' / '}
          {product.name}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 40,
            alignItems: 'start',
          }}
        >
          <div>
            <img
              src={product.images?.[0]}
              alt={product.name}
              style={{
                width: '100%',
                maxHeight: 450,
                objectFit: 'contain',
                borderRadius: 12,
              }}
            />
          </div>

          <div>
            <p style={{ color: '#777', marginBottom: 8 }}>{product.brand}</p>

            <h1 style={{ marginBottom: 15 }}>{product.name}</h1>

            {product.rating && (
              <p style={{ marginBottom: 15 }}>
                ⭐ {product.rating} ({product.reviewsCount ?? 0} reviews)
              </p>
            )}

            <h2 style={{ marginBottom: 25 }}>{formatPrice(finalPrice)}</h2>

            {product.stock > 0 ? (
              <p style={{ color: 'green', marginBottom: 20 }}>
                In Stock ({product.stock} available)
              </p>
            ) : (
              <p style={{ color: 'red', marginBottom: 20 }}>Out of Stock</p>
            )}

            {renderOption('memory', 'Memory')}
            {renderOption('storage', 'Storage')}
            {renderOption('warranty', 'Warranty')}

            <div style={{ marginBottom: 20 }}>
              <label
                htmlFor="quantity"
                style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}
              >
                Quantity
              </label>

              <input
                id="quantity"
                type="number"
                min="1"
                max={Math.min(product.stock, 5)}
                value={quantity}
                onChange={(event) => {
                  const value = Number(event.target.value);

                  setQuantity(Math.max(1, Math.min(value || 1, product.stock, 5)));
                }}
                style={{
                  width: 90,
                  padding: 10,
                  border: '1px solid #ccc',
                  borderRadius: 8,
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              style={{
                padding: '14px 28px',
                border: 0,
                borderRadius: 8,
                background: product.stock > 0 ? '#2563eb' : '#999',
                color: '#fff',
                cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {added ? 'Added to Cart ✓' : 'Add to Cart'}
            </button>

            {product.inTheBox?.length > 0 && (
              <div style={{ marginTop: 30 }}>
                <h3>What&apos;s in the box?</h3>

                <ul>
                  {product.inTheBox.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
