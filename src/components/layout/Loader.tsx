import { Loader2 } from "lucide-react";

/**
 * Standard Loader component used for Suspense fallback.
 * Uses lucide-react's Loader2 icon with a spin animation.
 */
export const Loader = () => {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
};

export default Loader;
