import { createBrowserRouter } from 'react-router-dom';

import { PATHS } from '@shared/constants';

import { AppLayout, RouteError } from '../layout';

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
  OrderDetails,
  Orders,
  OrderSuccess,
  Policies,
  ProductDetails,
  Products,
  SearchResults,
  Wishlist,
} from './lazyPages';
export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      { path: PATHS.HOME, element: <Home /> },
      { path: PATHS.PRODUCTS, element: <Products /> },
      { path: PATHS.SEARCH, element: <SearchResults /> },
      { path: PATHS.PRODUCT_DETAILS, element: <ProductDetails /> },
      { path: PATHS.CART, element: <Cart /> },
      { path: PATHS.CHECKOUT, element: <Checkout /> },
      { path: PATHS.ORDER_SUCCESS, element: <OrderSuccess /> },
      { path: PATHS.AUTH, element: <Auth /> },
      { path: PATHS.ACCOUNT, element: <Account /> },
      { path: PATHS.ORDERS, element: <Orders /> },
      { path: PATHS.ORDER_DETAILS, element: <OrderDetails /> },
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
