import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Standard loading fallback component.
 * Features a centered spinning icon with the repository's gold accent.
 */
export function Loader() {
  return (
    <div className="flex items-center justify-center w-full h-[500px] min-h-[50vh]">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  );
}

export default Loader;
