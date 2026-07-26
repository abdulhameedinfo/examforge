import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorState } from './ui/ErrorState';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          title="Oops! Something went wrong."
          message="An unexpected error occurred. Please try refreshing the page or contact support."
          onRetry={() => window.location.reload()}
        />
      );
    }

    return this.props.children;
  }
}
