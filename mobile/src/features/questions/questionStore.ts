import { createStore } from '../../common/store';
import type { Question } from './questionTypes';

export const questionStore = createStore<{
  items: Question[];
  selectedId: string | null;
  loading: boolean;
}>({
  items: [],
  selectedId: null,
  loading: false,
});

