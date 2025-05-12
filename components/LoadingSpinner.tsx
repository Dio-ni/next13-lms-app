// components/LoadingSpinner.tsx

import React from 'react';

const LoadingSpinner = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-black">
    <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin border-t-blue-500"></div>
  </div>
);

export default LoadingSpinner;
