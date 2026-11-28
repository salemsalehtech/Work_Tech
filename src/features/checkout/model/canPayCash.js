import { COD_MAX_TOTAL } from '@shared/constants';

const canPayCash = (total) => {
  return Number.isFinite(Number(total)) && Number(total) < COD_MAX_TOTAL;
};

export default canPayCash;
export { canPayCash };
