import axios from 'axios';

import { API_URL } from '@shared/config/env';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  // json-server reads repeated keys (?id=a&id=b), not axios' default id[]=a&id[]=b.
  paramsSerializer: { indexes: null },
});
