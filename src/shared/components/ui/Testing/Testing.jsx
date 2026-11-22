import { useState } from 'react';

import { AccountNav, FilterGroup, OrderTracker, CheckoutStepper } from '../index.js';

const CHECKOUT_STEPS = ['العربة', 'الشحن', 'الدفع'];
const ORDER_STEPS = ['تم الطلب', 'قيد التجهيز', 'في الطريق', 'تم التسليم'];
const ACCOUNT_LINKS = [
  { to: '/account', label: 'نظرة عامة', end: true },
  { to: '/account/orders', label: 'طلباتي' },
  { to: '/account/settings', label: 'الإعدادات' },
];
const BRANDS = ['Dell', 'HP', 'Lenovo', 'Asus'];

const box = { marginBottom: 40, padding: 16, border: '1px dashed #ccc' };

export default function ComponentsPlayground() {
  const [checkout, setCheckout] = useState(0);
  const [order, setOrder] = useState(1);
  const [brands, setBrands] = useState([]);

  const toggleBrand = (b) =>
    setBrands((p) => (p.includes(b) ? p.filter((x) => x !== b) : [...p, b]));

  return (
    // MemoryRouter عشان NavLink يشتغل حتى لو الصفحة برّه الـ router بتاعك
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <section style={box}>
        <h2>CheckoutStepper</h2>
        <CheckoutStepper steps={CHECKOUT_STEPS} current={checkout} />
        <button onClick={() => setCheckout((c) => Math.max(0, c - 1))}>السابق</button>{' '}
        <button onClick={() => setCheckout((c) => Math.min(CHECKOUT_STEPS.length, c + 1))}>
          التالي
        </button>
      </section>

      <section style={box}>
        <h2>OrderTracker</h2>
        <OrderTracker steps={ORDER_STEPS} current={order} />
        {[-1, 0, 1, 2, 3, 4].map((n) => (
          <button key={n} onClick={() => setOrder(n)}>
            {n === -1 ? 'ملغي' : n}
          </button>
        ))}
      </section>

      <section style={box}>
        <h2>AccountNav</h2>
        <AccountNav links={ACCOUNT_LINKS} />
      </section>

      <section style={box}>
        <h2>FilterGroup</h2>
        <FilterGroup title="الماركة">
          {BRANDS.map((b) => (
            <label key={b}>
              <input type="checkbox" checked={brands.includes(b)} onChange={() => toggleBrand(b)} />{' '}
              {b}
            </label>
          ))}
        </FilterGroup>
        <FilterGroup title="السعر" defaultOpen={false}>
          <p>اختيارات تانية</p>
        </FilterGroup>
        <p>المختار: {brands.join(', ') || 'لا شيء'}</p>
      </section>
    </div>
  );
}
