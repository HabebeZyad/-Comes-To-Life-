import { Loader2 } from 'lucide-react';

export const Loader = () => (
  <div className="min-h-[400px] w-full flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-primary animate-spin" />
  </div>
);

export default Loader;
