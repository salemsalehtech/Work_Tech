import { quantityLimit, toCartItem } from './cartItem';

const laptop = {
  id: 'asus-zenbook-14',
  name: 'Zenbook 14 OLED',
  brand: 'ASUS',
  price: 76999,
  stock: 20,
  images: ['/images/products/asus-zenbook-14-1.jpg'],
  options: {
    memory: [
      { label: '16 GB', delta: 0 },
      { label: '32 GB', delta: 5500 },
    ],
    storage: [{ label: '512 GB', delta: 0 }],
    warranty: [
      { label: '1 year', delta: 0 },
      { label: '2 years', delta: 3100 },
    ],
  },
};
const mouse = {
  id: 'acc-logitech-g305',
  kind: 'accessory',
  name: 'G305',
  brand: 'Logitech',
  price: 1290,
  stock: 30,
  specsLine: 'HERO 12K sensor',
};

it('gives a laptop its default options', () => {
  expect(toCartItem(laptop)).toMatchObject({
    kind: 'laptop',
    price: 76999,
    warrantyDelta: 0,
    options: { memory: '16 GB', storage: '512 GB', warranty: '1 year' },
    quantity: 1,
  });
});

it('adds the chosen options to the price and keeps the warranty part', () => {
  const item = toCartItem(laptop, { selection: { memory: '32 GB', warranty: '2 years' } });

  expect(item.price).toBe(76999 + 5500 + 3100);
  expect(item.warrantyDelta).toBe(3100);
});

it('gives an accessory no options', () => {
  expect(toCartItem(mouse)).toMatchObject({
    kind: 'accessory',
    options: null,
    price: 1290,
    warrantyDelta: 0,
    specsLine: 'HERO 12K sensor',
  });
});

it('limits the quantity to the stock and to five', () => {
  expect(quantityLimit(3)).toBe(3);
  expect(quantityLimit(20)).toBe(5);
});
