import { useState } from 'react';

import { CURRENCY, INSTALLMENT_PLANS, DEFAULT_INSTALLMENT_MONTHS } from '@/shared/constants';
import { monthlyInstallment } from '@/shared/utils';

export default function InstallmentPicker({
  price,
  plans = INSTALLMENT_PLANS,
  currency = CURRENCY,
  defaultMonths = DEFAULT_INSTALLMENT_MONTHS,
  onChange,
}) {
  const [months, setMonths] = useState(defaultMonths);
  const handleSelect = (m) => {
    setMonths(m);
    onChange?.({ months: m, monthly: monthlyInstallment(price, m) });
  };
  return (
    <div className="installment-picker" role="radiogroup" aria-label="Imstallment Plans">
      {plans.map((m) => {
        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={months === m}
            className={`installment-card ${months === m ? 'active' : ''}`}
            onClick={() => handleSelect(m)}
          >
            {' '}
            <span>{m} Month</span>
            <strong>
              {monthlyInstallment(price, m).toLocaleString()} {currency} / month
            </strong>
          </button>
        );
      })}
    </div>
  );
}
