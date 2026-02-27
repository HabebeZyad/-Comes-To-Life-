import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { egyptianPeriods, EgyptianPeriod, HistoricalLocation, HistoricalEvent, HistoricalFigure, getLocationById } from '../data/egyptianPeriods';
import { mapPuzzles, MapPuzzle } from '../data/mapPuzzles';
import { MapPuzzleModal } from '../components/puzzles/PuzzleModals';
import InteractiveMap from '../components/InteractiveMap';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import {
  Map,
  Users,
  Landmark,
  Puzzle,
  Clock,
  BrainCircuit,
  Calendar,
  User,
  Trophy,
  X,
  Info
} from 'lucide-react';

// LocationDetails Card Component
function LocationDetails({ location, onClose }: { location: HistoricalLocation; onClose: () => void; }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
      <Card className="bg-sand-dark border border-gold-dark/40 shadow-lg flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="font-display text-xl text-gold-light">{location.name}</CardTitle>
              {location.egyptianName && <p className="text-sm text-gold-light/70 font-display">{location.egyptianName}</p>}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="-mt-2 -mr-2 text-sand-light/70 hover:text-sand-light"><X className="w-4 h-4" /></Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 flex-grow">
          <p className="font-body text-sm text-sand-light/80">{location.description}</p>
          <div>
            <h5 className="font-display text-sm font-semibold mb-1 flex items-center gap-1 text-gold-light/80"><Info className="w-3 h-3" /> Significance</h5>
            <p className="text-sm text-sand-light/70">{location.significance}</p>
          </div>
          {location.keyFigures && location.keyFigures.length > 0 && (
            <div>
              <h5 className="font-display text-sm font-semibold mb-1 text-gold-light/80">Key Figures</h5>
              <div className="flex flex-wrap gap-1">{location.keyFigures.map((f, i) => (<span key={i} className="text-xs bg-sand-dark/50 border border-sand-light/10 text-sand-light/70 px-2 py-1 rounded-full">{f}</span>))}</div>
            </div>
          )}
          {location.artifacts && location.artifacts.length > 0 && (
            <div>
              <h5 className="font-display text-sm font-semibold mb-1 text-gold-light/80">Notable Artifacts</h5>
              <div className="flex flex-wrap gap-1">{location.artifacts.map((a, i) => (<span key={i} className="text-xs bg-gold-dark/20 text-gold-light px-2 py-1 rounded-full">{a}</span>))}</div>
            </div>
          )}
        </CardContent>
        {location.explorable && <CardFooter className="pt-4"><Button className="w-full bg-gold-dark/20 text-gold-light hover:bg-gold-dark/40 border border-gold-dark/30"><Map className="w-4 h-4 mr-2"/> Explore Location</Button></CardFooter>}
      </Card>
    </motion.div>
  );
}

// Main PeriodMaps Component
export function PeriodMaps() {
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('old-kingdom');
  const [selectedLocation, setSelectedLocation] = useState<HistoricalLocation | null>(null);
  const [activePuzzle, setActivePuzzle] = useState<MapPuzzle | null>(null);

  const selectedPeriod = useMemo(() => egyptianPeriods.find(p => p.id === selectedPeriodId) as EgyptianPeriod, [selectedPeriodId]);
  const periodPuzzles = useMemo(() => mapPuzzles.filter(p => p.periodId === selectedPeriodId), [selectedPeriodId]);

  const handleLocationSelect = (location: HistoricalLocation | null) => setSelectedLocation(location);
  const handlePuzzleSolve = (points: number) => { console.log(`Puzzle solved for ${points} points!`); setActivePuzzle(null); };
  const handlePeriodSelect = (id: string) => { setSelectedPeriodId(id); setSelectedLocation(null); };

  return (
    <div className="bg-sand-dark text-sand-light font-body mt-16">
      <header className="px-6 py-8 border-b border-gold-dark/20 bg-sand-dark">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-4xl filter drop-shadow-lg">{selectedPeriod.icon}</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gold-light tracking-wider [text-shadow:_2px_2px_8px_rgba(0,0,0,0.7)]">Period Maps</h1>
          </div>
          <p className="font-body text-lg text-sand-light/80 max-w-3xl">Explore interactive maps of Egypt through four transformative periods.</p>
        </div>
      </header>

      <div className="sticky top-16 z-30 bg-sand-dark/80 backdrop-blur-lg border-b border-gold-dark/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-4 overflow-x-auto">
            {egyptianPeriods.map((period) => (
              <Button key={period.id} variant="ghost" onClick={() => handlePeriodSelect(period.id)} className={cn('font-body font-semibold transition-all duration-300 rounded-full px-4 py-2 text-sm tracking-wide', selectedPeriodId === period.id ? 'bg-gold-light/10 text-gold-light ring-2 ring-gold-light/80 shadow-md shadow-gold-light/10' : 'text-sand-light/60 hover:bg-sand-light/10 hover:text-sand-light')}>
                <span className="mr-2 opacity-80">{period.icon}</span>{period.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <main className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <motion.div className="lg:col-span-4 space-y-20" key={selectedPeriodId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeInOut' }}>
              <section id="interactive-map">
                <h2 className="font-display text-3xl font-bold text-gold-light mb-6 flex items-center gap-3 [text-shadow:_1px_1px_4px_rgba(0,0,0,0.5)]"><Map className="w-8 h-8 filter drop-shadow-md" /> Interactive Map: {selectedPeriod.name}</h2>
                <div className="mt-4"><InteractiveMap period={selectedPeriod} onLocationSelect={handleLocationSelect} selectedLocation={selectedLocation} /></div>
              </section>

              <section id="timeline">
                <h2 className="font-display text-3xl font-bold text-gold-light mb-6 flex items-center gap-3 [text-shadow:_1px_1px_4px_rgba(0,0,0,0.5)]"><Calendar className="w-8 h-8 filter drop-shadow-md" /> Timeline of Events</h2>
                <div className="relative border-l-2 border-gold-dark/30 pl-8 space-y-12">
                  <span className="absolute top-0 left-[-2px] w-1.5 h-full bg-gradient-to-b from-gold via-gold-dark to-sand-dark"></span>
                  {selectedPeriod.events.map((event, index) => (
                    <motion.div key={event.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                      <div className="absolute -left-[42px] top-1.5 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-sand-dark border-2 border-gold-dark/50 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-gold-light/70" />
                        </div>
                      </div>
                      <p className="text-sm text-gold-light font-semibold font-display tracking-wider">{event.yearDisplay}</p>
                      <h3 className="font-display text-xl text-sand-light font-bold mt-1">{event.title}</h3>
                      <p className="text-sand-light/80 mt-2 text-sm">{event.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {event.keyFigures && event.keyFigures.map(fig => <span key={fig} className="text-xs bg-sand-dark/50 border border-sand-light/10 text-sand-light/70 px-2 py-1 rounded-full">{fig}</span>)}
                        {event.locationId && getLocationById(selectedPeriod.id, event.locationId) && <span className="text-xs bg-gold-dark/20 text-gold-light px-2 py-1 rounded-full">{getLocationById(selectedPeriod.id, event.locationId)?.name}</span>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section id="key-figures">
                <h2 className="font-display text-3xl font-bold text-gold-light mb-6 flex items-center gap-3 [text-shadow:_1px_1px_4px_rgba(0,0,0,0.5)]"><Users className="w-8 h-8 filter drop-shadow-md" /> Key Figures</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
                  {selectedPeriod.figures.map((figure) => (
                    <Card key={figure.id} className="bg-sand-dark border border-gold-dark/40 shadow-lg flex flex-col h-full break-words">
                      <CardHeader className="p-6 pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="font-display text-2xl text-gold-light">{figure.name}</CardTitle>
                            <CardDescription className="text-sand-light/60 text-base">{figure.title}</CardDescription>
                          </div>
                          <User className="w-8 h-8 text-gold-light/50 flex-shrink-0" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 text-base flex-grow p-6 pt-0">
                        <p className="text-sand-light/80 italic">Legacy: {figure.legacy}</p>
                        <div>
                          <h5 className="font-semibold text-gold-light/90 mb-2 text-lg">Key Achievements:</h5>
                          <ul className="list-disc list-inside text-sand-light/70 space-y-2">
                            {figure.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter className="p-6 pt-4">
                        <Button variant="outline" className="w-full border-gold-dark/30 text-gold-light/80 hover:bg-gold-dark/20 hover:text-gold-light text-base py-6 h-auto whitespace-normal">
                          Learn More <span className="ml-2 font-display text-sm">({figure.egyptianName})</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </section>

              {periodPuzzles.length > 0 && (
                <section id="puzzles">
                  <h2 className="font-display text-3xl font-bold text-gold-light mb-6 flex items-center gap-3 [text-shadow:_1px_1px_4px_rgba(0,0,0,0.5)]"><Puzzle className="w-8 h-8 filter drop-shadow-md" /> Challenges & Puzzles</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {periodPuzzles.map((puzzle) => (
                      <Card key={puzzle.id} className="bg-sand-dark border border-gold-dark/40 shadow-lg flex flex-col text-center h-full">
                        <CardHeader>
                          <CardTitle className="font-display text-xl text-gold-light flex items-center justify-center gap-2">
                            {puzzle.type === 'route-trace' && <Landmark className="w-5 h-5"/>}
                            {puzzle.type === 'territory-claim' && <Trophy className="w-5 h-5"/>}
                            {puzzle.type === 'timeline-order' && <BrainCircuit className="w-5 h-5"/>}
                            {puzzle.type === 'location-match' && <Map className="w-5 h-5" />}
                            {puzzle.type === 'figure-match' && <Users className="w-5 h-5" />}
                            {puzzle.title}
                          </CardTitle>
                          <CardDescription className="text-sand-light/60 h-12">{puzzle.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-center">
                          <div className="flex justify-center items-center gap-4 text-sm">
                            <span className="flex items-center gap-1.5"><Puzzle className="w-4 h-4 text-gold-light/70" /> {puzzle.type}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gold-light/70" /> {puzzle.difficulty}</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full bg-gold-dark/20 text-gold-light hover:bg-gold-dark/40 border border-gold-dark/30" onClick={() => setActivePuzzle(puzzle)}>
                            Project Challenge
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>

            <div className="lg:col-span-1 lg:sticky lg:top-36 z-20 space-y-6">
              <AnimatePresence>{selectedLocation && <LocationDetails location={selectedLocation} onClose={() => setSelectedLocation(null)} />}</AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>{activePuzzle && <MapPuzzleModal puzzle={activePuzzle} onClose={() => setActivePuzzle(null)} onSolve={handlePuzzleSolve}/>}</AnimatePresence>
    </div>
  );
}
