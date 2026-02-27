import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";
import { Navigation } from "@/components/layout/Navigation";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Index from "./pages/Index";
import MangaHomePage from "./pages/MangaHomePage";
import MangaEpisode3 from "./pages/MangaEpisode3";
import MangaEpisode4 from "./pages/MangaEpisode4";
import MangaEpisode5 from "./pages/MangaEpisode5";
import HieroglyphsPage from "./pages/HieroglyphicsPage";
import Profile from "./pages/Profile";
import { PeriodMaps } from "./pages/PeriodMaps";
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
        <BrowserRouter>
          <ScrollToTop />
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/manga" element={<MangaHomePage />} />
            <Route path="/manga/episode-3" element={<MangaEpisode3 />} />
            <Route path="/manga/episode-4" element={<MangaEpisode4 />} />
            <Route path="/manga/episode-5" element={<MangaEpisode5 />} />
            <Route path="/hieroglyphs" element={<HieroglyphsPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/maps" element={<PeriodMaps />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/story/:storyId" element={<StoryReader />} />
            <Route path="/games" element={<Games />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </GameProvider>
  </QueryClientProvider>
);

export default App;
