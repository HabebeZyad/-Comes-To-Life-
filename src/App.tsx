import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { GameProvider } from "@/contexts/GameContext";
import { Navigation } from "@/components/layout/Navigation";
import ScrollToTop from "@/components/layout/ScrollToTop";

// Lazy load page components to improve initial bundle size and TTI
const Index = lazy(() => import("./pages/Index"));
const StorytellingHomePage = lazy(() => import("./pages/StorytellingHomePage"));
const StorytellingEpisode3 = lazy(() => import("./pages/StorytellingEpisode3"));
const StorytellingEpisode4 = lazy(() => import("./pages/StorytellingEpisode4"));
const StorytellingEpisode5 = lazy(() => import("./pages/StorytellingEpisode5"));
const HieroglyphsPage = lazy(() => import("./pages/HieroglyphicsPage"));
const Profile = lazy(() => import("./pages/Profile"));
const Stories = lazy(() => import("./pages/Stories"));
const StoryReader = lazy(() => import("./pages/StoryReader"));
const Games = lazy(() => import("./pages/Games"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Standard loading fallback for code-split components
const PageLoader = () => (
  <div className="flex h-[60vh] w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GameProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <ScrollToTop />
          <Navigation />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/storytelling" element={<StorytellingHomePage />} />
              <Route path="/storytelling/episode-3" element={<StorytellingEpisode3 />} />
              <Route path="/storytelling/episode-4" element={<StorytellingEpisode4 />} />
              <Route path="/storytelling/episode-5" element={<StorytellingEpisode5 />} />
              <Route path="/hieroglyphs" element={<HieroglyphsPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/stories/:storyId" element={<StoryReader />} />
              <Route path="/games" element={<Games />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </GameProvider>
  </QueryClientProvider>
);

export default App;
