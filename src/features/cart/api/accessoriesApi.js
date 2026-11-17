import { baseApi } from '@services/api';

/** Accessories for the Cart "Complete the setup" row. params: { category, fitsScreen_gte, ... }. */
export const accessoriesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAccessories: build.query({
      query: (params = {}) => ({ url: '/accessories', params }),
      providesTags: (result = []) => [
        ...result.map(({ id }) => ({ type: 'Accessory', id })),
        { type: 'Accessory', id: 'LIST' },
      ],
    }),
  }),
});

export const { useGetAccessoriesQuery } = accessoriesApi;
