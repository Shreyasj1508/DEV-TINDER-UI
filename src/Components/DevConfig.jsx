// Development Configuration Display
import React from 'react';
import { USE_MOCK_BACKEND } from '../utils/apiService';
import { USING_MOCK_BACKEND } from '../utils/constants';

const DevConfig = () => {
  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-blue-100 border border-blue-400 text-blue-700 px-3 py-2 rounded-lg text-sm shadow-lg">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="font-semibold">LIVE MODE</span>
        <span>|</span>
        <span>{USE_MOCK_BACKEND ? 'Mock Backend' : 'Real Backend'}</span>
      </div>
    </div>
  );
};

export default DevConfig;
