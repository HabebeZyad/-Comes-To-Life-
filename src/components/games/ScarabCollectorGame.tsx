import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Timer, Zap, Shield, Sparkles, Clock } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { GameBoardScaler } from '@/components/ui/GameBoardScaler';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';
import { GameOverlay } from './GameOverlay';

// Game Engine Core
import { GameLoop } from '@/core/GameLoop';
import { GameState } from '@/core/GameState';
import { InputManager } from '@/core/InputManager';

// Systems & Entities
import { RenderSystem } from '@/systems/RenderSystem';
import { JuiceSystem } from '@/systems/JuiceSystem';
import { ScarabEntity, ScarabType } from '@/entities/ScarabEntity';

const FIELD_WIDTH = 600;
const FIELD_HEIGHT = 450;

const WAVES = [
  { id: 1, name: 'Desert Dawn', target: 500, spawnRate: 1200, duration: 30, description: 'Collect sacred scarabs in the morning light.' },
  { id: 2, name: 'Sands of Time', target: 1200, spawnRate: 1000, duration: 30, description: 'The winds pick up. Watch for time-extending hourglasses!' },
  { id: 3, name: 'Cursed Tombs', target: 2000, spawnRate: 850, duration: 35, description: 'Ancient curses awaken. Avoid the scorpions at all costs!' },
  { id: 4, name: 'Pharaoh\'s Frenzy', target: 3000, spawnRate: 700, duration: 40, description: 'A swarm approaches! Keep your combo high for maximum points.' },
  { id: 5, name: 'Divine Trial', target: 4500, spawnRate: 600, duration: 45, description: 'The final test of the gods. Only the swiftest will survive.' }
];

class CollectorGameState extends GameState {
  public collected: number = 0;
  public cursedHits: number = 0;
  public combo: number = 0;
  public lastHitTime: number = 0;
}

export function ScarabCollectorGame({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [level, setLevel] = useState(0); // 0 = not started
  const [score, setScore] = useState(0);
  const [collected, setCollected] = useState(0);
  const [cursedHits, setCursedHits] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setUIState] = useState<'intro' | 'playing' | 'levelup' | 'victory' | 'defeat'>('intro');

  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  const currentWave = WAVES[level - 1] || WAVES[0];

  // Engine refs to prevent state-stale closures
  const engineRef = useRef({
    loop: null as GameLoop | null,
    input: null as InputManager | null,
    juice: new JuiceSystem(),
    render: null as RenderSystem | null,
    state: new CollectorGameState(),
    entities: [] as ScarabEntity[],
    wave: currentWave,
    level: 0,
    uiState: 'intro',
    timeElapsed: 0,
    spawnTimer: 0
  });

  const startNextLevel = useCallback(() => {
    const nextLevel = level + 1;
    if (nextLevel > WAVES.length) {
      setUIState('victory');
      engineRef.current.uiState = 'victory';
      stopAmbientMusic();
      playSound('victory');
      addScore({
        playerName: 'Explorer',
        score: engineRef.current.state.score,
        game: 'scarab-collector',
        difficulty: 'hard',
        details: `Completed all 5 waves! ${engineRef.current.state.collected} caught.`
      });
      return;
    }

    setLevel(nextLevel);
    const wave = WAVES[nextLevel - 1];

    // Sync into engine
    const e = engineRef.current;
    e.wave = wave;
    e.level = nextLevel;
    e.uiState = 'playing';
    e.entities = []; // clear field

    setTimeLeft(wave.duration);
    setUIState('playing');

    if (nextLevel === 1) {
      e.state.reset();
      e.state.collected = 0;
      e.state.cursedHits = 0;
      e.state.combo = 0;
      setScore(0);
      setCollected(0);
      setCursedHits(0);
      setCombo(0);
      startAmbientMusic();
      playSound('gameStart');
    } else {
      playSound('levelUp');
    }
  }, [level, startAmbientMusic, playSound, addScore]);

  // Engine Initialization & Loop
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false }); // optimizes compositing
    if (!ctx) return;

    const input = new InputManager(canvas);
    const renderSys = new RenderSystem(ctx);

    engineRef.current.input = input;
    engineRef.current.render = renderSys;

    const update = (delta: number) => {
      const e = engineRef.current;
      if (e.uiState !== 'playing') {
        input.update(delta); // flush inputs
        return;
      }

      e.timeElapsed += delta;

      // Update Timer visually
      const newTimeLeft = Math.ceil(e.wave.duration - e.timeElapsed);
      if (newTimeLeft !== timeLeft && newTimeLeft >= 0) {
        setTimeLeft(newTimeLeft);
        if (newTimeLeft <= 6 && newTimeLeft > 0) playSound('tick');
      }

      // Timer completion logic
      if (e.timeElapsed >= e.wave.duration) {
        if (e.state.score >= e.wave.target) {
          e.uiState = 'levelup';
          setUIState('levelup');
          playSound('victory');
        } else {
          e.uiState = 'defeat';
          setUIState('defeat');
          stopAmbientMusic();
          playSound('defeat');
        }
      }

      // Spawning Logic
      e.spawnTimer += delta * 1000;
      if (e.spawnTimer >= e.wave.spawnRate) {
        e.spawnTimer = 0;
        spawnEntity(e);
      }

      // Input Checking (Clicking entities)
      const clicks = input.clicks;
      let clickedSomething = false;

      if (clicks.length > 0) {
        for (const click of clicks) {
          // check backwards for Z-index
          for (let i = e.entities.length - 1; i >= 0; i--) {
            const scarab = e.entities[i];
            if (!scarab.isActive) continue;

            const dx = click.x - scarab.x;
            const dy = click.y - scarab.y;
            if (Math.sqrt(dx * dx + dy * dy) < scarab.width) {
              // Hit!
              handleHit(scarab, e);
              scarab.isActive = false;
              clickedSomething = true;
              break; // only hit one per click
            }
          }
        }
      }

      // Update Systems
      for (const ent of e.entities) {
        if (ent.isActive) ent.update(delta);
      }
      e.juice.update(delta);

      // Flush inputs
      input.update(delta);
    };

    const drawBackground = () => {
      ctx.fillStyle = '#1a1612'; // deep obsidian/sand combo
      ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);

      // Draw subtle grid patterns
      ctx.strokeStyle = 'rgba(218, 165, 32, 0.05)';
      ctx.beginPath();
      for (let x = 0; x < FIELD_WIDTH; x += 100) { ctx.moveTo(x, 0); ctx.lineTo(x, FIELD_HEIGHT); }
      for (let y = 0; y < FIELD_HEIGHT; y += 112.5) { ctx.moveTo(0, y); ctx.lineTo(FIELD_WIDTH, y); }
      ctx.stroke();
    };

    const render = () => {
      const e = engineRef.current;

      ctx.save();

      // Apply screen shake to entire game viewport
      e.juice.applyScreenShake(ctx);

      drawBackground();

      // Draw Entities
      renderSys.render(e.entities);

      // Draw Juice/Particles over top
      renderSys.render(e.juice.particles);

      ctx.restore();
    };

    const loop = new GameLoop(update, render);
    engineRef.current.loop = loop;
    loop.start();

    return () => {
      loop.stop();
      input.cleanup();
    };
  }, [playSound, stopAmbientMusic]);

  // SPAWNER & HIT HANDLERS
  const spawnEntity = (e: any) => {
    const rand = Math.random();
    let type: ScarabType, emoji: string, points: number, color: string;

    if (rand < 0.05 && e.level >= 2) {
      type = 'time'; emoji = '⌛'; points = 0; color = '#50ff50';
    } else if (rand < 0.1 && e.level >= 3) {
      type = 'bonus'; emoji = '💎'; points = 500; color = '#00ffff';
    } else if (rand < 0.15) {
      type = 'sacred'; emoji = '🪲'; points = 250; color = '#ffd700';
    } else if (rand < 0.35) {
      type = 'cursed'; emoji = '🦂'; points = -150; color = '#ff3030';
    } else if (rand < 0.6) {
      type = 'gold'; emoji = '𓆣'; points = 100; color = '#d4af37';
    } else {
      type = 'silver'; emoji = '🪲'; points = 50; color = '#c0c0c0';
    }

    const lifespan = type === 'sacred' || type === 'bonus' ? 1.2 : 2.5 - (e.level * 0.15);

    e.entities.push(new ScarabEntity(
      Math.random() * (FIELD_WIDTH - 60) + 30,
      Math.random() * (FIELD_HEIGHT - 60) + 30,
      type, emoji, points, color, lifespan
    ));
  };

  const handleHit = (scarab: ScarabEntity, e: any) => {
    const explosionColor = scarab.color;

    if (scarab.type === 'cursed') {
      playSound('wrong');
      e.state.cursedHits++;
      e.state.score = Math.max(0, e.state.score - 150);
      e.state.combo = 0;

      e.juice.spawnExplosion(scarab.x, scarab.y, explosionColor, 20);
      e.juice.triggerScreenShake(0.3); // violent shake

    } else if (scarab.type === 'time') {
      playSound('collect');
      e.timeElapsed = Math.max(0, e.timeElapsed - 5); // rewinds time
      e.state.collected++;

      e.juice.spawnExplosion(scarab.x, scarab.y, explosionColor, 15);
      e.juice.triggerScreenShake(0.1);

    } else {
      playSound('collect');

      const now = performance.now();
      const timeSinceLast = now - e.state.lastHitTime;
      e.state.lastHitTime = now;

      const newCombo = timeSinceLast < 1200 ? e.state.combo + 1 : 1;
      e.state.combo = newCombo;
      e.state.collected++;

      const comboBonus = Math.floor(newCombo / 3) * 50;
      e.state.score += (scarab.points + comboBonus);

      if (newCombo >= 3 && newCombo % 3 === 0) {
        playSound('streak');
      }

      e.juice.spawnExplosion(scarab.x, scarab.y, explosionColor, 10 + (newCombo * 2));
    }

    // Sync React purely for UI Overlays/Headers
    // Throttled UI syncing is best, but basic setter is fine
    setScore(e.state.score);
    setCollected(e.state.collected);
    setCursedHits(e.state.cursedHits);
    setCombo(e.state.combo);
  };

  return (
    <div className="min-h-screen pt-20 pb-28 md:pb-12 px-4 bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full hieroglyph-pattern" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <EgyptianButton variant="nav" onClick={() => { stopAmbientMusic(); onBack(); }} className="-ml-4 mb-2">
              <ArrowLeft className="mr-2" size={18} /> Back to Games
            </EgyptianButton>
            <h1 className="text-4xl font-display text-gold-gradient">Scarab Collector</h1>
          </div>

          <div className="hidden md:flex gap-4">
            <div className="bg-black/40 backdrop-blur-md border border-gold/20 px-4 py-2 rounded-lg text-center">
              <div className="text-xs uppercase text-muted-foreground flex items-center justify-center gap-1">
                <Trophy size={12} className="text-primary" /> Wave
              </div>
              <div className="text-xl font-bold text-primary">{level || 1}/5</div>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-gold/20 px-4 py-2 rounded-lg text-center min-w-[100px]">
              <div className="text-xs uppercase text-muted-foreground flex items-center justify-center gap-1">
                <Zap size={12} className="text-turquoise" /> Score
              </div>
              <div className="text-xl font-bold text-turquoise">{score}</div>
            </div>
          </div>
        </div>

        <EgyptianCard variant="tomb" padding="none" className="relative overflow-hidden border-2 border-gold/30">
          {/* Game Stats Bar */}
          <div className="bg-black/60 border-b border-gold/20 p-4 flex justify-between items-center">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Timer className={timeLeft < 10 ? "text-terracotta animate-pulse" : "text-primary"} />
                <span className={`text-2xl font-mono ${timeLeft < 10 ? "text-terracotta" : "text-foreground"}`}>
                  {timeLeft}s
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Shield className="text-scarab" />
                <span className="text-muted-foreground">Target:</span>
                <span className="text-xl font-bold text-scarab">{currentWave.target}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {combo > 1 && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={combo}
                  className="bg-primary/20 text-primary px-3 py-1 rounded-full font-bold border border-primary/30 flex items-center gap-1"
                >
                  <Sparkles size={16} /> {combo}x COMBO
                </motion.div>
              )}
              <div className="text-right">
                <div className="text-xs text-muted-foreground uppercase">Current Wave</div>
                <div className="text-lg font-display text-gold-light">{currentWave.name}</div>
              </div>
            </div>
          </div>

          {/* Game Engine Field Canvas */}
          <GameBoardScaler originalWidth={FIELD_WIDTH} originalHeight={FIELD_HEIGHT} className="overflow-hidden">
            <div className="relative w-full h-full cursor-crosshair">
              <canvas
                ref={canvasRef}
                width={FIELD_WIDTH}
                height={FIELD_HEIGHT}
                style={{ touchAction: 'none' }}
                className="w-full h-full block"
              />

              {/* Overlays */}
              <AnimatePresence>
                {gameState === 'intro' && (
                  <GameOverlay
                    type="intro"
                    title="Scarab Collector"
                    description="Ancient scarabs are emerging from the sands! Catch the golden and sacred ones while avoiding the cursed scorpions. Maintain speed to build your score combo."
                    actionLabel="Enter Trial"
                    onAction={() => startNextLevel()}
                    onSecondaryAction={onBack}
                  />
                )}

                {gameState === 'levelup' && (
                  <GameOverlay
                    type="levelup"
                    title="Wave Complete!"
                    description={`Excellent work. You have mastered the ${currentWave.name}.`}
                    stats={[
                      { label: 'Wave Score', value: score },
                      { label: 'Collected', value: collected },
                      { label: 'Cursed Hits', value: cursedHits }
                    ]}
                    actionLabel={`Start Wave ${level + 1}`}
                    onAction={() => startNextLevel()}
                    onSecondaryAction={onBack}
                  />
                )}

                {gameState === 'victory' && (
                  <GameOverlay
                    type="victory"
                    title="Divine Master"
                    description="You have cleared all trials and collected the sacred swarm of the Pharaohs!"
                    score={score}
                    stars={5}
                    stats={[
                      { label: 'Total Caught', value: collected },
                      { label: 'Accuracy', value: `${Math.round((collected / (collected + cursedHits)) * 100)}%` }
                    ]}
                    actionLabel="Play Again"
                    onAction={() => {
                      setLevel(0);
                      setUIState('intro');
                    }}
                    onSecondaryAction={onBack}
                  />
                )}

                {gameState === 'defeat' && (
                  <GameOverlay
                    type="defeat"
                    title="Trial Failed"
                    description={`The sands were too swift. You needed ${currentWave.target} points to pass this wave.`}
                    score={score}
                    stats={[
                      { label: 'Required', value: currentWave.target },
                      { label: 'Current', value: score }
                    ]}
                    actionLabel="Retry Wave"
                    onAction={() => {
                      setLevel(level - 1);
                      startNextLevel();
                    }}
                    onSecondaryAction={onBack}
                  />
                )}
              </AnimatePresence>
            </div>
          </GameBoardScaler>

          <div className="bg-obsidian/40 p-4 grid grid-cols-3 gap-4 border-t border-gold/20">
            <div className="text-center">
              <div className="text-[10px] uppercase text-muted-foreground mb-1">Items Caught</div>
              <div className="flex items-center justify-center gap-1">
                <span className="font-bold text-gold">{collected}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase text-muted-foreground mb-1">Cursed Touches</div>
              <div className="flex items-center justify-center gap-1">
                <span className="font-bold text-terracotta">{cursedHits}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase text-muted-foreground mb-1">Time Extended</div>
              <div className="flex items-center justify-center gap-1">
                <Clock size={14} className="text-turquoise" />
                <span className="font-bold">+{Math.floor(collected / 10)}s</span>
              </div>
            </div>
          </div>
        </EgyptianCard>

        {/* Legend */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { emoji: '𓆣', name: 'Gold Scarab', pts: '100' },
            { emoji: '🪲', name: 'Sacred Scarab', pts: '250', special: 'Rare' },
            { emoji: '🦂', name: 'Cursed Scorpion', pts: '-150', color: 'text-terracotta' },
            { emoji: '⌛', name: 'Time Glass', pts: '+5s', color: 'text-turquoise' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-black/30 p-3 rounded-lg border border-white/5">
              <span className="text-2xl">{item.emoji}</span>
              <div>
                <div className="text-xs font-bold text-foreground">{item.name}</div>
                <div className={`text-[10px] ${item.color || 'text-primary'}`}>{item.pts} Points {item.special && `• ${item.special}`}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


