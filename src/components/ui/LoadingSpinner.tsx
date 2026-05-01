import React from 'react';

/**
 * LoadingSpinner Component
 * A compact spinner for smaller sections of the page.
 */
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-8 h-8 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
  </div>
);
