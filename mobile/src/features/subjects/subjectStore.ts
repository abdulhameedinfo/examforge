import { createStore } from '../../common/store';
import type { Subject } from './subjectTypes';

export const subjectStore = createStore<{
  items: Subject[];
  loading: boolean;
}>({
  items: [],
  loading: false,
});

