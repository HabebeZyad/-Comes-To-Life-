import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lightweight Loading Spinner component for component-level lazy loading fallbacks.
 */
export const LoadingSpinner = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center p-4", className)}>
    <Loader2 className="w-8 h-8 text-gold animate-spin" />
  </div>
);
