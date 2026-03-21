import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#1A1208] text-white flex flex-col items-center justify-center p-6">
          <h1 className="text-3xl font-display text-honey mb-4">Something went wrong</h1>
          <p className="text-white/70 mb-8 max-w-md text-center">
            We're sorry, but an unexpected error occurred. Please try refreshing the page.
          </p>
          <div className="bg-[#110C05] p-4 rounded border border-red-500/30 text-red-400 text-sm max-w-2xl overflow-auto">
            {this.state.error?.message}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 bg-honey text-[#110C05] px-6 py-2 rounded font-medium"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
