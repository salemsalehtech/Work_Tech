import { createBrowserRouter } from 'react-router-dom';

import { Layout } from '@shared/components/layout';

import {
  About,
  Account,
  Auth,
  Cart,
  Checkout,
  Compare,
  Contact,
  Faq,
  Finder,
  Home,
  NotFound,
  Orders,
  OrderSuccess,
  Policies,
  ProductDetails,
  Products,
  Wishlist,
} from './lazyPages';
import { PATHS } from './paths';
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: PATHS.HOME, element: <Home /> },
      { path: PATHS.PRODUCTS, element: <Products /> },
      { path: PATHS.PRODUCT_DETAILS, element: <ProductDetails /> },
      { path: PATHS.CART, element: <Cart /> },
      { path: PATHS.CHECKOUT, element: <Checkout /> },
      { path: PATHS.ORDER_SUCCESS, element: <OrderSuccess /> },
      { path: PATHS.AUTH, element: <Auth /> },
      { path: PATHS.ACCOUNT, element: <Account /> },
      { path: PATHS.ORDERS, element: <Orders /> },
      { path: PATHS.WISHLIST, element: <Wishlist /> },
      { path: PATHS.FINDER, element: <Finder /> },
      { path: PATHS.COMPARE, element: <Compare /> },
      { path: PATHS.ABOUT, element: <About /> },
      { path: PATHS.CONTACT, element: <Contact /> },
      { path: PATHS.FAQ, element: <Faq /> },
      { path: PATHS.POLICIES, element: <Policies /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
