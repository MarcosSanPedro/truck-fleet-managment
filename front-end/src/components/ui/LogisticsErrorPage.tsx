import React from 'react';
import { Truck, AlertTriangle, Wifi, Shield, RefreshCw, Home, ArrowLeft, Search, MapPin } from 'lucide-react';

interface LogisticsErrorPageProps {
  error: {
    status?: number
    message?: string
    name?: string
  };
}

const LogisticsErrorPage: React.FC<LogisticsErrorPageProps> = ({ error = {status: 404, message: "not foud"} }) => {
  // Error type detection and configuration
  const getErrorConfig = (error: LogisticsErrorPageProps['error']) => {
    const errorMessage = error.message?.toLowerCase() || '';
    const errorName = error.name?.toLowerCase() || '';
    const errorStatus = error.status;
    
    // 404 Not Found errors
    if (errorStatus === 404 || errorMessage.includes('not found') || errorMessage.includes('404')) {
      return {
        type: 'notfound',
        icon: Search,
        title: 'Route Not Found',
        subtitle: 'The requested page or resource could not be located',
        description: 'The truck route, shipment, or page you\'re looking for doesn\'t exist or may have been moved. Please check the URL or navigate back to the dashboard.',
        color: 'bg-indigo-500',
        bgGradient: 'from-indigo-50 to-blue-50',
        iconColor: 'text-indigo-500'
      };
    }
    
    // Network errors
    if (errorMessage.includes('network') || errorMessage.includes('fetch') || 
        errorMessage.includes('connection') || errorName === 'networkerror') {
      return {
        type: 'network',
        icon: Wifi,
        title: 'Connection Lost',
        subtitle: 'Unable to connect to truck management servers',
        description: 'Please check your internet connection and try again. Our fleet tracking systems require a stable connection.',
        color: 'bg-blue-500',
        bgGradient: 'from-blue-50 to-cyan-50',
        iconColor: 'text-blue-500'
      };
    }
    
    // Authentication/Authorization errors
    if (errorMessage.includes('auth') || errorMessage.includes('unauthorized') || 
        errorMessage.includes('forbidden') || errorStatus === 401 || errorStatus === 403) {
      return {
        type: 'auth',
        icon: Shield,
        title: 'Access Denied',
        subtitle: 'Your session has expired or insufficient permissions',
        description: 'Please log in again to access the truck management dashboard. Contact your fleet administrator if you need additional permissions.',
        color: 'bg-orange-500',
        bgGradient: 'from-orange-50 to-amber-50',
        iconColor: 'text-orange-500'
      };
    }
    
    // Server errors (5xx)
    if (errorStatus >= 500 || errorMessage.includes('server') || errorMessage.includes('internal')) {
      return {
        type: 'server',
        icon: AlertTriangle,
        title: 'System Maintenance',
        subtitle: 'Our fleet management servers are temporarily unavailable',
        description: 'We\'re working to restore full functionality. Your truck data is safe and will be available shortly.',
        color: 'bg-red-500',
        bgGradient: 'from-red-50 to-pink-50',
        iconColor: 'text-red-500'
      };
    }
    
    // Rate limiting (429)
    if (errorStatus === 429 || errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
      return {
        type: 'ratelimit',
        icon: RefreshCw,
        title: 'Too Many Requests',
        subtitle: 'Please slow down your requests',
        description: 'Our systems are processing high volumes of fleet data. Please wait a moment before trying again.',
        color: 'bg-purple-500',
        bgGradient: 'from-purple-50 to-indigo-50',
        iconColor: 'text-purple-500'
      };
    }
    
    // Bad Request (400)
    if (errorStatus === 400 || errorMessage.includes('bad request')) {
      return {
        type: 'badrequest',
        icon: AlertTriangle,
        title: 'Invalid Request',
        subtitle: 'The request contains invalid data',
        description: 'There was an issue with the request format or parameters. Please check your input and try again.',
        color: 'bg-yellow-500',
        bgGradient: 'from-yellow-50 to-amber-50',
        iconColor: 'text-yellow-500'
      };
    }
    
    // Default/Unknown error
    return {
      type: 'unknown',
      icon: AlertTriangle,
      title: 'Unexpected Error',
      subtitle: 'Something went wrong with the fleet management system',
      description: 'We encountered an unexpected issue. Please try refreshing the page or contact support if the problem persists.',
      color: 'bg-gray-500',
      bgGradient: 'from-gray-50 to-slate-50',
      iconColor: 'text-gray-500'
    };
  };

  const config = getErrorConfig(error);
  const IconComponent = config.icon;

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  // Special handling for 404 - different button layout
  const is404 = config.type === 'notfound';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} flex items-center justify-center p-4`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Main error card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header with animated truck */}
          <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Truck className="h-16 w-16 text-white animate-bounce" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">FleetTracker Pro</h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto rounded-full"></div>
            </div>
          </div>

          {/* Error content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${config.color}/10 mb-6`}>
                <IconComponent className={`h-10 w-10 ${config.iconColor}`} />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{config.title}</h2>
              <p className="text-xl text-gray-600 mb-4">{config.subtitle}</p>
              <p className="text-gray-500 leading-relaxed max-w-md mx-auto">{config.description}</p>
            </div>

            {/* Error details (for development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-8 p-4 bg-gray-100 rounded-lg">
                <details className="cursor-pointer">
                  <summary className="font-semibold text-gray-700 mb-2">Technical Details</summary>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Status:</strong> {error.status || 'Unknown'}</p>
                    <p><strong>Message:</strong> {error.message || 'No message'}</p>
                    <p><strong>Name:</strong> {error.name || 'Unknown'}</p>
                    <p><strong>Detected Type:</strong> {config.type}</p>
                    {error.code && <p><strong>Code:</strong> {error.code}</p>}
                    {error.stack && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-4">
              {is404 ? (
                // For 404 errors, don't show "Try Again" - show navigation options instead
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleGoHome}
                    className={`inline-flex items-center justify-center px-6 py-3 ${config.color} text-white rounded-xl font-semibold hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
                  >
                    <Home className="h-5 w-5 mr-2" />
                    Go to Dashboard
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/fleet'}
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Fleet Overview
                  </button>
                </div>
              ) : (
                // For other errors, show the retry option
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleRetry}
                    className={`inline-flex items-center justify-center px-6 py-3 ${config.color} text-white rounded-xl font-semibold hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Try Again
                  </button>
                  
                  <button
                    onClick={handleGoHome}
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
                  >
                    <Home className="h-5 w-5 mr-2" />
                    Dashboard
                  </button>
                </div>
              )}
              
              <div className="text-center">
                <button
                  onClick={handleGoBack}
                  className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Support contact */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">Need immediate assistance?</p>
          <div className="space-x-6">
            <a href="tel:+1-800-FLEET-1" className="text-blue-600 hover:text-blue-800 font-semibold">
              📞 1-800-FLEET-1
            </a>
            <a href="mailto:support@fleettracker.com" className="text-blue-600 hover:text-blue-800 font-semibold">
              ✉️ support@fleettracker.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsErrorPage;