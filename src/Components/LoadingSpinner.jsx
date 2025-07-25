import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-pink-500`}></div>
      {message && (
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      )}
    </div>
  );
};

export const FullScreenLoader = ({ message = 'Loading DevTinder...' }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🔥</div>
        <div className="w-12 h-12 mx-auto animate-spin rounded-full border-4 border-gray-200 border-t-pink-500 mb-4"></div>
        <p className="text-xl text-gray-700 font-semibold">{message}</p>
        <p className="text-gray-500 mt-2">Connecting developers worldwide...</p>
      </div>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="w-96 h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-pulse">
      <div className="h-[70%] bg-gray-300"></div>
      <div className="h-[30%] p-6">
        <div className="h-6 bg-gray-300 rounded mb-3"></div>
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="flex justify-center gap-4">
          <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
          <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
