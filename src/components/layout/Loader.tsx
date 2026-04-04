import { Loader2 } from "lucide-react";

/**
 * Standard Loader component for Suspense fallbacks.
 * Uses a centered Loader2 icon with the animate-spin class.
 */
export const Loader = () => {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
};

export default Loader;
