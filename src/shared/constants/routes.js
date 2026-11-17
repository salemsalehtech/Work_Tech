// Every route of the store. Build links with these, never with hand-written strings.
export const PATHS = {
  HOME: '/',
  PRODUCTS: '/products',
  SEARCH: '/search',
  PRODUCT_DETAILS: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order-success',
  AUTH: '/auth',
  ACCOUNT: '/account',
  ORDERS: '/orders',
  ORDER_DETAILS: '/orders/:id',
  WISHLIST: '/wishlist',
  FINDER: '/finder',
  COMPARE: '/compare',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  POLICIES: '/policies',
};

export const productPath = (id) => `/products/${encodeURIComponent(id)}`;
export const orderPath = (id) => `/orders/${encodeURIComponent(id)}`;
export const searchPath = (query) => `/search?q=${encodeURIComponent(query)}`;
