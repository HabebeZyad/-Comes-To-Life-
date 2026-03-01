import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import { Navigation } from "@/components/layout/Navigation";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Index from "./pages/Index";
import StorytellingHomePage from "./pages/StorytellingHomePage";
import StorytellingEpisode3 from "./pages/StorytellingEpisode3";
import StorytellingEpisode4 from "./pages/StorytellingEpisode4";
import StorytellingEpisode5 from "./pages/StorytellingEpisode5";
import HieroglyphsPage from "./pages/HieroglyphicsPage";
import Profile from "./pages/Profile";
import Stories from "./pages/Stories";
import StoryReader from "./pages/StoryReader";
import NotFound from "./pages/NotFound";
import Games from "./pages/Games";

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
        </BrowserRouter>
      </TooltipProvider>
    </GameProvider>
  </QueryClientProvider>
);

export default App;
