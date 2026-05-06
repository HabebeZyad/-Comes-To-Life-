import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import { Navigation } from "@/components/layout/Navigation";
import ScrollToTop from "@/components/layout/ScrollToTop";

// Lazy-loaded pages for performance
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

// Thematic Loader Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background p-4">
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-2 border-gold/20 animate-[spin_3s_linear_infinite]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl animate-glow-pulse">𓂀</span>
        </div>
      </div>
      <div className="font-display text-gold tracking-[0.3em] text-sm animate-pulse">
        RESTORING HISTORY...
      </div>
    </div>
  </div>
);

const queryClient = new QueryClient();

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
