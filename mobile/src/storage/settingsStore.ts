import { createStore } from '../common/store';

export const settingsStore = createStore<{
  apiBaseUrl: string;
  deviceId: string;
}>({
  apiBaseUrl: 'http://localhost:5000',
  deviceId: 'device-id-placeholder',
});

