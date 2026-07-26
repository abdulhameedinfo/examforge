import { useState, useCallback, useRef } from 'react';

export interface UseApiLoadingOptions {
  initialLoading?: boolean;
}

export interface UseApiLoadingReturn {
  loading: boolean;
  error: unknown;
  setLoading: (loading: boolean) => void;
  setError: (error: unknown) => void;
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>;
  reset: () => void;
}

export function useApiLoading(options: UseApiLoadingOptions = {}): UseApiLoadingReturn {
  const { initialLoading = false } = options;
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<unknown>(null);
  const isMounted = useRef(true);

  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    if (!isMounted.current) {
      throw new Error('Component is unmounted');
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fn();
      
      if (isMounted.current) {
        setLoading(false);
      }
      
      return result;
    } catch (err) {
      if (isMounted.current) {
        setError(err);
        setLoading(false);
      }
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    if (isMounted.current) {
      setLoading(false);
      setError(null);
    }
  }, []);

  return {
    loading,
    error,
    setLoading,
    setError,
    withLoading,
    reset,
  };
}

// Hook for managing multiple loading states
export function useApiLoadingMap<T extends string>(keys: T[]) {
  const [loadingStates, setLoadingStates] = useState<Record<T, boolean>>(
    {} as Record<T, boolean>
  );
  const [errorStates, setErrorStates] = useState<Record<T, unknown>>(
    {} as Record<T, unknown>
  );

  const setKeyLoading = useCallback((key: T, loading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: loading }));
  }, []);

  const setKeyError = useCallback((key: T, error: unknown) => {
    setErrorStates((prev) => ({ ...prev, [key]: error }));
  }, []);

  const withKeyLoading = useCallback(
    async <K extends T, R>(key: K, fn: () => Promise<R>): Promise<R> => {
      setKeyLoading(key, true);
      setKeyError(key, null);

      try {
        const result = await fn();
        setKeyLoading(key, false);
        return result;
      } catch (err) {
        setKeyError(key, err);
        setKeyLoading(key, false);
        throw err;
      }
    },
    [setKeyLoading, setKeyError]
  );

  const resetKey = useCallback(
    (key: T) => {
      setKeyLoading(key, false);
      setKeyError(key, null);
    },
    [setKeyLoading, setKeyError]
  );

  const resetAll = useCallback(() => {
    setLoadingStates({} as Record<T, boolean>);
    setErrorStates({} as Record<T, unknown>);
  }, []);

  return {
    loadingStates,
    errorStates,
    setKeyLoading,
    setKeyError,
    withKeyLoading,
    resetKey,
    resetAll,
  };
}
