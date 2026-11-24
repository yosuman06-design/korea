import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: Error) {
    console.error('Korean Journey ErrorBoundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FCF9F6] dark:bg-[#121118] text-[#1E1B24] dark:text-[#F4F1F8] p-6">
          <div className="max-w-lg w-full rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-white dark:bg-[#1B1924] p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-2">Korean Journey — Error Recovery</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Something interrupted the session. You can reload safely below.
            </p>
            <pre className="text-xs font-mono-num bg-slate-50 dark:bg-[#121118] p-3 rounded-lg overflow-auto max-h-40 border border-slate-200 dark:border-slate-800 mb-4">
              {this.state.errorMessage}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-rose-500 text-white hover:bg-rose-600 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
