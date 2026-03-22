import { Loader2 } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
};
