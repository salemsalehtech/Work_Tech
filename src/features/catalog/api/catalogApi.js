import { baseApi } from '@services/api';

/**
 * Catalog requests. params go straight to json-server, for example
 * { q: 'rog', brand: ['ASUS', 'Lenovo'], price_gte: 20000, _sort: 'price', _order: 'asc', _page: 1, _limit: 9 }.
 * getProducts returns { items, total } so lists can show "SHOWING 9 OF 12".
 */
export const catalogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query({
      query: (params = {}) => ({ url: '/products', params }),
      transformResponse: (items, meta) => ({
        items,
        total: Number(meta?.headers?.['x-total-count'] ?? items.length),
      }),
      providesTags: (result) => [
        ...(result?.items ?? []).map(({ id }) => ({ type: 'Product', id })),
        { type: 'Product', id: 'LIST' },
      ],
    }),
    getProduct: build.query({
      query: (id) => ({ url: `/products/${id}` }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    // Compare and wishlist. With an empty list json-server returns every product:
    // call it as useGetProductsByIdsQuery(ids, { skip: ids.length === 0 }).
    getProductsByIds: build.query({
      query: (ids) => ({ url: '/products', params: { id: ids } }),
      providesTags: (result = []) => result.map(({ id }) => ({ type: 'Product', id })),
    }),
    getReviews: build.query({
      query: (productId) => ({
        url: '/reviews',
        params: { productId, _sort: 'date', _order: 'desc' },
      }),
      providesTags: (result, error, productId) => [{ type: 'Review', id: productId }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductsByIdsQuery,
  useGetReviewsQuery,
} = catalogApi;
