export type Listener<T> = (state: T) => void;

export function createStore<T extends object>(initialState: T) {
  let state = { ...initialState };
  const listeners = new Set<Listener<T>>();

  return {
    getState(): T {
      return state;
    },
    setState(patch: Partial<T> | ((current: T) => Partial<T>)) {
      const nextPatch = typeof patch === 'function' ? patch(state) : patch;
      state = { ...state, ...nextPatch };
      listeners.forEach((listener) => listener(state));
    },
    subscribe(listener: Listener<T>) {
      listeners.add(listener);
      listener(state);
      return () => listeners.delete(listener);
    },
  };
}

