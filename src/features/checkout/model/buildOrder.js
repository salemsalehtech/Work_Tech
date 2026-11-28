const buildOrder = ({ user, items, shipping, payment, totals }) => {
  return {
    id: `WT-${Date.now()}`,
    userId: user.id,
    createdAt: new Date().toISOString(),
    status: 'placed',
    items: items.map((item) => ({
      productId: item.productId,
      kind: item.kind,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      options: item.options,
    })),
    shipping: {
      fullName: shipping.fullName,
      phone: shipping.phone,
      city: shipping.city,
      address: shipping.address,
    },
    payment: {
      ...payment,
    },
    totals: {
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      discount: totals.discount,
      total: totals.total,
    },
  };
};

export default buildOrder;
export { buildOrder };
