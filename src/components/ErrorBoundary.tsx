import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null 
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true, 
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background-primary text-text-primary">
          <div className="max-w-md p-6 rounded-lg bg-background-secondary border border-border-medium">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="mb-4 text-text-secondary">
              We're sorry, but there was an error loading this page.
            </p>
            <pre className="p-3 bg-background-tertiary rounded text-sm overflow-auto mb-4">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="px-4 py-2 bg-primaryToken-500 text-white rounded-md hover:bg-primaryToken-600 transition-colors"
            >
              Go to Home Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;