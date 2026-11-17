import { baseApi } from '@services/api';

/**
 * Orders of the signed-in demo user. Orders always refetch when a page opens.
 * The store never sends DELETE: cancelling is a PATCH of the status.
 */
export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query({
      query: (userId) => ({
        url: '/orders',
        params: { userId, _sort: 'createdAt', _order: 'desc' },
      }),
      keepUnusedDataFor: 0,
      providesTags: (result = []) => [
        ...result.map(({ id }) => ({ type: 'Order', id })),
        { type: 'Order', id: 'LIST' },
      ],
    }),
    getOrder: build.query({
      query: (id) => ({ url: `/orders/${id}` }),
      keepUnusedDataFor: 0,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    createOrder: build.mutation({
      query: (order) => ({ url: '/orders', method: 'POST', data: order }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),
    updateOrderStatus: build.mutation({
      query: ({ id, status }) => ({ url: `/orders/${id}`, method: 'PATCH', data: { status } }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
} = ordersApi;
