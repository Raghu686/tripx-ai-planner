y
import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("TripX App Crash Caught by Boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-darkBg text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-black/50 border border-red-500/30 p-10 rounded-[2rem] shadow-[0_0_50px_rgba(239,68,68,0.2)] max-w-lg w-full">
            <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-6 animate-pulse" />
            <h1 className="text-3xl font-black uppercase text-white mb-4 tracking-tight">System Desync</h1>
            <p className="text-gray-400 mb-8 font-bold tracking-widest text-sm uppercase">
              The matrix encountered anomalous data routing.
            </p>
            <div className="bg-red-900/20 text-red-200 text-xs text-left p-4 rounded overflow-auto mb-8 font-mono border border-red-900/50 max-h-32">
               {this.state.error?.toString()}
            </div>
            <button 
              onClick={this.handleReset}
              className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center w-full transition-all"
            >
              <RefreshCcw className="w-5 h-5 mr-3" /> Reboot Matrix
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
