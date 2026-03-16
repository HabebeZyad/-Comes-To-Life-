import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import { Navigation } from "@/components/layout/Navigation";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Lazy load page components for better initial load performance
const Index = lazy(() => import("./pages/Index"));
const StorytellingHomePage = lazy(() => import("./pages/StorytellingHomePage"));
const StorytellingEpisode3 = lazy(() => import("./pages/StorytellingEpisode3"));
const StorytellingEpisode4 = lazy(() => import("./pages/StorytellingEpisode4"));
const StorytellingEpisode5 = lazy(() => import("./pages/StorytellingEpisode5"));
const HieroglyphsPage = lazy(() => import("./pages/HieroglyphicsPage"));
const Profile = lazy(() => import("./pages/Profile"));
const Stories = lazy(() => import("./pages/Stories"));
const StoryReader = lazy(() => import("./pages/StoryReader"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Games = lazy(() => import("./pages/Games"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
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
          <Suspense fallback={<LoadingFallback />}>
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
