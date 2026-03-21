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
        <div className="fixed inset-0 min-h-screen bg-red-600 text-white flex flex-col items-center justify-center p-6 z-[9999]">
          <h1 className="text-5xl font-bold text-white mb-4">CRASH DETECTED</h1>
          <p className="text-white/90 mb-8 max-w-md text-center text-lg">
            We're sorry, but an unexpected error occurred. Please try refreshing the page.
          </p>
          <div className="bg-black/50 p-6 rounded border border-white/30 text-white text-base max-w-2xl overflow-auto w-full font-mono">
            {this.state.error?.message}
            <br/><br/>
            {this.state.error?.stack}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 bg-white text-red-600 px-8 py-3 rounded font-bold text-lg hover:bg-gray-100"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
