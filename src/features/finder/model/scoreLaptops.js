const MAX_BUDGET_OVERFLOW = 1.1;
const LIGHTWEIGHT_LIMIT = 1.5;

const normalize = (value) => String(value ?? '').toLowerCase();

const getWeight = (product) => Number.parseFloat(product.specs?.weight);

const getPrice = (product) => Number(product.price);

const getGpu = (product) => normalize(product.specs?.gpu);

const isGamingGpu = (product) => /rtx|gtx|radeon rx/i.test(getGpu(product));

const scoreLaptops = (products, answers) => {
  if (!Array.isArray(products)) return [];

  const budget = Number(answers?.budget);
  const usage = normalize(answers?.usage);
  const portability = normalize(answers?.portability);
  const screen = normalize(answers?.screen);

  let candidates = products.filter((product) => {
    if (Number.isFinite(budget) && budget > 0 && getPrice(product) > budget * MAX_BUDGET_OVERFLOW) {
      return false;
    }

    if (
      portability === 'lightweight' &&
      (!Number.isFinite(getWeight(product)) || getWeight(product) >= LIGHTWEIGHT_LIMIT)
    ) {
      return false;
    }

    if (usage === 'gaming' && !isGamingGpu(product)) {
      return false;
    }

    return true;
  });

  candidates = candidates.map((product) => {
    let score = 0;
    const reasons = [];

    const weight = getWeight(product);

    if (usage === 'gaming' && isGamingGpu(product)) {
      score += 3;
      reasons.push('reason.gaming');
    }

    if (portability === 'lightweight' && Number.isFinite(weight) && weight < LIGHTWEIGHT_LIMIT) {
      score += 3;
      reasons.push('reason.lightweight');
    }

    if (screen && normalize(product.specs?.screen).includes(screen)) {
      score += 2;
      reasons.push('reason.screen');
    }

    if (Number.isFinite(budget) && budget > 0 && getPrice(product) <= budget) {
      score += 2;
      reasons.push('reason.budget');
    }

    return { product, score, reasons };
  });

  return candidates.sort((a, b) => b.score - a.score).slice(0, 3);
};

export default scoreLaptops;
export { scoreLaptops };
