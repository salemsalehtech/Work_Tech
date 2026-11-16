import { AxiosHeaders } from 'axios';

import { apiClient } from './apiClient';
import { axiosBaseQuery } from './axiosBaseQuery';

vi.mock('./apiClient', () => ({ apiClient: vi.fn() }));

const query = axiosBaseQuery();

it('returns the data and plain lower-case headers', async () => {
  apiClient.mockResolvedValue({
    data: [{ id: 'a' }],
    headers: AxiosHeaders.from({ 'X-Total-Count': '40' }),
  });

  const result = await query({ url: '/products', params: { _page: 1 } });

  expect(apiClient).toHaveBeenCalledWith({
    url: '/products',
    method: 'GET',
    data: undefined,
    params: { _page: 1 },
  });
  expect(result).toEqual({ data: [{ id: 'a' }], meta: { headers: { 'x-total-count': '40' } } });
});

it('turns a failed request into { status, data }', async () => {
  apiClient.mockRejectedValue({ response: { status: 404, data: {} }, message: 'Not found' });
  expect(await query({ url: '/orders/WT-0' })).toEqual({ error: { status: 404, data: {} } });
});

it('reports a network failure as FETCH_ERROR', async () => {
  apiClient.mockRejectedValue({ message: 'Network Error' });
  expect(await query({ url: '/products' })).toEqual({
    error: { status: 'FETCH_ERROR', data: 'Network Error' },
  });
});
