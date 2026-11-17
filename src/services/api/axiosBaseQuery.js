import { apiClient } from './apiClient';

/**
 * Lets RTK Query send its requests through the shared axios client,
 * so base URL, timeout and future interceptors live in one place.
 * Errors come back as { status, data } like fetchBaseQuery.
 */
export const axiosBaseQuery =
  () =>
  async ({ url, method = 'GET', data, params }) => {
    try {
      const response = await apiClient({ url, method, data, params });
      // Plain object with lower-case names: Redux actions must stay serializable,
      // and endpoints read headers like meta.headers['x-total-count'].
      const headers = Object.fromEntries(
        Object.entries(response.headers ?? {}).map(([name, value]) => [name.toLowerCase(), value]),
      );
      return { data: response.data, meta: { headers } };
    } catch (error) {
      return {
        error: {
          status: error.response?.status ?? 'FETCH_ERROR',
          data: error.response?.data ?? error.message,
        },
      };
    }
  };
