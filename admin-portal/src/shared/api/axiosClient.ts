import axios from 'axios';
import { appEnv } from '../../app/config/env';

export const apiClient = axios.create({
  baseURL: appEnv.apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

