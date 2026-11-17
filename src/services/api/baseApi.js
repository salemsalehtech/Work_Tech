import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from './axiosBaseQuery';

/**
 * The one RTK Query API of the store. It has no endpoints of its own:
 * each feature adds its endpoints in its own file with baseApi.injectEndpoints(),
 * so nobody edits this file to add a request.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Product', 'Review', 'Order', 'Accessory'],
  keepUnusedDataFor: 300,
  endpoints: () => ({}),
});
