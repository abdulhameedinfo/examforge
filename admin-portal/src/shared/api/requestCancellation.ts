type RequestKey = string;

class RequestCancellationManager {
  private abortControllers = new Map<RequestKey, AbortController>();

  generateKey(config: { method?: string; url?: string; params?: unknown }): RequestKey {
    const { method = 'GET', url = '', params } = config;
    return `${method}:${url}:${JSON.stringify(params)}`;
  }

  createAbortSignal(key: RequestKey): AbortSignal {
    // Cancel any existing request with the same key
    this.cancelRequest(key);

    const controller = new AbortController();
    this.abortControllers.set(key, controller);
    return controller.signal;
  }

  cancelRequest(key: RequestKey): void {
    const controller = this.abortControllers.get(key);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(key);
    }
  }

  cancelAllRequests(): void {
    this.abortControllers.forEach((controller) => controller.abort());
    this.abortControllers.clear();
  }

  removeRequest(key: RequestKey): void {
    this.abortControllers.delete(key);
  }
}

export const requestCancellationManager = new RequestCancellationManager();

// Hook for automatic cleanup on unmount
export function useRequestCancellation() {
  const cancelRequest = (key: RequestKey) => {
    requestCancellationManager.cancelRequest(key);
  };

  const cancelAllRequests = () => {
    requestCancellationManager.cancelAllRequests();
  };

  return { cancelRequest, cancelAllRequests };
}
