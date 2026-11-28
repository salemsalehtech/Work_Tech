import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { calcCartTotals, selectCartItems } from '@features/cart';
import { EXPRESS_CITIES } from '@shared/constants';

const initialShipping = {
  fullName: '',
  phone: '',
  city: '',
  address: '',
};

const useCheckout = () => {
  const items = useSelector(selectCartItems);
  const promoCode = useSelector((state) => state.cart.promoCode);

  const [shipping, setShipping] = useState(initialShipping);
  const [express, setExpress] = useState(false);

  const expressAvailable = EXPRESS_CITIES.includes(shipping.city);

  const totals = useMemo(
    () => calcCartTotals(items, { promoCode, express: express && expressAvailable }),
    [items, promoCode, express, expressAvailable],
  );

  const updateShipping = (field, value) => {
    setShipping((current) => ({
      ...current,
      [field]: value,
    }));

    if (field === 'city' && !EXPRESS_CITIES.includes(value)) {
      setExpress(false);
    }
  };

  return {
    items,
    shipping,
    express,
    expressAvailable,
    totals,
    setExpress,
    updateShipping,
  };
};

export default useCheckout;
export { useCheckout };
