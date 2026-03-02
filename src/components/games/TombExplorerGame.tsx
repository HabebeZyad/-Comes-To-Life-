import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Map as MapIcon, Key, Gem, Skull, Flame, Timer, Ghost, Star, Compass, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';
import { GameOverlay } from './GameOverlay';

interface TombExplorerGameProps {
  onBack: () => void;
}

// ── CONSTANTS ───────────────────────────────────────────────────────────────
const W = 640, H = 360, HUD_H = 40;
const TS = 32, COLS = 20, ROWS = 10;
const PW = 20, PH = 28;
const GRAVITY = 820, JUMP_VEL = -450, SPEED = 165;

// Tile IDs
const T = {
  AIR: 0, WALL: 1, TREASURE: 2, KEY: 3, DOOR: 4, EXIT: 5,
  PLATE: 6, GATE: 7, FIRE: 8, SPIKE: 9, ANKH: 11,
  WATER: 12, PUSH: 13,
};

const isSolid = (t: number) => t === T.WALL || t === T.DOOR || t === T.GATE || t === T.PUSH;
const isHazard = (t: number) => t === T.FIRE || t === T.SPIKE || t === T.WATER;

function parseMap(rows: string[]) {
  return rows.map(r => [...r].map(ch => {
    if (ch === 'A') return T.ANKH;
    if (ch === 'W') return T.WATER;
    const n = parseInt(ch, 16);
    return isNaN(n) ? 0 : n;
  }));
}

// ── LEVELS ──────────────────────────────────────────────────────────────────
const LEVELS = [
  {
    name: 'I. The Antechamber',
    desc: "Khufu's first seal — learn the passage...",
    start: { c: 1, r: 8 },
    pg: [{ pr: 8, pc: 13, gr: 8, gc: 16 }],
    kd: [],
    map: parseMap([
      '11111111111111111111',
      '10000000000000000001',
      '10000000000000000001',
      '10000000000000000001',
      '10000000000000000001',
      '10000200000020000001',
      '10001111001111000001',
      '10000000000000000001',
      '12000000000001670051',
      '11111111111111111111',
    ]),
  },
  {
    name: 'II. Hall of Anubis',
    desc: "The jackal god watches — fire bars your path...",
    start: { c: 1, r: 8 },
    pg: [{ pr: 8, pc: 10, gr: 7, gc: 15 }, { pr: 8, pc: 10, gr: 8, gc: 15 }],
    kd: [],
    map: parseMap([
      '11111111111111111111',
      '10000000000000000001',
      '10000020000000020001',
      '10001111100111110001',
      '10000000000000000001',
      '10020000000000000021',
      '10000000000000000001',
      '10000000000000001001',
      '10000080000000067051',
      '11111111111111111111',
    ]),
  },
  {
    name: 'III. The Passage of Ra',
    desc: "A key lies beyond the flames — unlock the way...",
    start: { c: 1, r: 8 },
    pg: [{ pr: 7, pc: 4, gr: 8, gc: 12 }],
    kd: [{ kr: 8, kc: 5, dr: 8, dc: 14 }],
    map: parseMap([
      '11111111111111111111',
      '10000000000000000001',
      '10000020000020000001',
      '10001111001111000001',
      '10000000000000000001',
      '10000000000000000001',
      '10000002000000000001',
      '10000111100001111001',
      '10008830000010040051',
      '11111111111111111111',
    ]),
  },
  {
    name: 'IV. Chamber of Osiris',
    desc: "Two seals must be broken — spikes guard the treasure...",
    start: { c: 1, r: 8 },
    pg: [
      { pr: 8, pc: 6, gr: 6, gc: 6 }, { pr: 8, pc: 6, gr: 7, gc: 6 },
      { pr: 3, pc: 15, gr: 8, gc: 15 },
    ],
    kd: [],
    map: parseMap([
      '11111111111111111111',
      '10000000000000000001',
      '10200000000000000021',
      '10001111000002111101',
      '10000000000000000001',
      '10000000000020000001',
      '10000070000011110001',
      '10000070000000000001',
      '10000060009900160051',
      '11111111111111111111',
    ]),
  },
  {
    name: 'V. Throne of Ra',
    desc: "All seals of Ra must fall — claim the golden throne!",
    start: { c: 1, r: 8 },
    pg: [
      { pr: 8, pc: 4, gr: 5, gc: 9 }, { pr: 8, pc: 4, gr: 6, gc: 9 },
      { pr: 8, pc: 4, gr: 7, gc: 9 }, { pr: 8, pc: 4, gr: 8, gc: 9 },
      { pr: 3, pc: 12, gr: 5, gc: 16 }, { pr: 3, pc: 12, gr: 6, gc: 16 },
      { pr: 3, pc: 12, gr: 7, gc: 16 }, { pr: 3, pc: 12, gr: 8, gc: 16 },
    ],
    kd: [{ kr: 5, kc: 13, dr: 5, dc: 17 }, { kr: 5, kc: 13, dr: 6, dc: 17 },
    { kr: 5, kc: 13, dr: 7, dc: 17 }, { kr: 5, kc: 13, dr: 8, dc: 17 }],
    map: parseMap([
      '11111111111111111111',
      '10000000000000000001',
      '10020000000000000021',
      '10011100002111100001',
      '10000000000000000001',
      '10000000600030001001',
      '10001111000000001001',
      '10000000000000001001',
      '10060089900000001051',
      '11111111111111111111',
    ]),
  },
  {
    name: 'VI. The Flooded Crypt',
    desc: "Sacred waters flood the tomb — never touch the deep...",
    start: { c: 1, r: 5 },
    pg: [{ pr: 5, pc: 9, gr: 5, gc: 14 }, { pr: 5, pc: 9, gr: 6, gc: 14 }],
    kd: [],
    map: parseMap([
      '11111111111111111111',
      '10000000000000000001',
      '12011100020001110021',
      '10000000000000000001',
      '10000002020020000001',
      '10011106011110670051',
      '10000000000000000001',
      '10WWWW00000000WWWW01',
      '10WWWWWWWWWWWWWWWW01',
      '11111111111111111111',
    ]),
  },
  {
    name: 'VII. Vault of Thoth',
    desc: "The god of wisdom set three trials — find every seal...",
    start: { c: 1, r: 8 },
    pg: [
      { pr: 4, pc: 5, gr: 8, gc: 7 },
      { pr: 4, pc: 14, gr: 8, gc: 12 },
      { pr: 2, pc: 10, gr: 8, gc: 17 },
    ],
    kd: [{ kr: 7, kc: 3, dr: 7, dc: 9 }],
    map: parseMap([
      '11111111111111111111',
      '10000000000000000001',
      '10000011110A11110001',
      '10000000000000000001',
      '10011160001011160001',
      '10000000000000000001',
      '10001111011111100001',
      '10300000000000000001',
      '10000070004070070051',
      '11111111111111111111',
    ]),
  },
  {
    name: 'VIII. Labyrinth of Set',
    desc: "Set built walls of chaos — fire and spikes everywhere...",
    start: { c: 1, r: 8 },
    pg: [
      { pr: 8, pc: 4, gr: 4, gc: 9 },
      { pr: 2, pc: 9, gr: 4, gc: 9 },
      { pr: 2, pc: 9, gr: 5, gc: 9 },
      { pr: 5, pc: 16, gr: 6, gc: 13 },
    ],
    kd: [{ kr: 8, kc: 8, dr: 8, dc: 15 }],
    map: parseMap([
      '11111111111111111111',
      '10000011000110000001',
      '10020090090000000001',
      '10000011000111100001',
      '10001100007000011101',
      '10000000000011160001',
      '10001100001110700001',
      '10200000000000000021',
      '10060088830004070051',
      '11111111111111111111',
    ]),
  },
  {
    name: 'IX. Hall of Judgment',
    desc: "Anubis weighs your heart — four sacred seals must align...",
    start: { c: 1, r: 8 },
    pg: [
      { pr: 8, pc: 3, gr: 3, gc: 6 }, { pr: 8, pc: 3, gr: 4, gc: 6 },
      { pr: 8, pc: 3, gr: 5, gc: 6 }, { pr: 8, pc: 3, gr: 6, gc: 6 },
      { pr: 3, pc: 9, gr: 3, gc: 13 }, { pr: 3, pc: 9, gr: 4, gc: 13 },
      { pr: 3, pc: 9, gr: 5, gc: 13 }, { pr: 3, pc: 9, gr: 6, gc: 13 },
      { pr: 8, pc: 16, gr: 3, gc: 16 }, { pr: 8, pc: 16, gr: 4, gc: 16 },
      { pr: 8, pc: 16, gr: 5, gc: 16 }, { pr: 8, pc: 16, gr: 6, gc: 16 },
    ],
    kd: [{ kr: 5, kc: 8, dr: 5, dc: 14 }],
    map: parseMap([
      '11111111111111111111',
      '10000000000000000001',
      '10200011110011110021',
      '10000000000000000001',
      '10001170007000710001',
      '10000370030007300001',
      '10001170007000710001',
      '10000000000000000001',
      '12006088039800016051',
      '11111111111111111111',
    ]),
  },
  {
    name: 'X. Inner Sanctum of Amun-Ra',
    desc: "The final chamber — only the worthy shall claim immortality!",
    start: { c: 1, r: 8 },
    pg: [
      { pr: 8, pc: 3, gr: 7, gc: 7 }, { pr: 8, pc: 3, gr: 8, gc: 7 },
      { pr: 2, pc: 7, gr: 7, gc: 7 }, { pr: 2, pc: 7, gr: 8, gc: 7 },
      { pr: 2, pc: 13, gr: 7, gc: 12 }, { pr: 2, pc: 13, gr: 8, gc: 12 },
      { pr: 8, pc: 17, gr: 7, gc: 12 }, { pr: 8, pc: 17, gr: 8, gc: 12 },
    ],
    kd: [
      { kr: 4, kc: 10, dr: 4, dc: 14 }, { kr: 4, kc: 10, dr: 5, dc: 14 },
    ],
    map: parseMap([
      '11111111111111111111',
      '10000000000000000001',
      '1020061111111160A021',
      '10000000000000000001',
      '10001111003011110001',
      '10000000000040000001',
      '10111000088000011101',
      '10000070007007000001',
      '10060099300007006051',
      '11111111111111111111',
    ]),
  },
];

// ── TYPES & INTERFACES ──────────────────────────────────────────────────────
interface Particle {
  x: number; y: number; vx: number; vy: number;
  color: string; size: number; life: number; maxLife: number;
}

interface FloatingText {
  x: number; y: number; text: string; color: string;
  life: number; vy: number; scale: number;
}

interface Torch {
  r: number; c: number; flicker: number;
}

interface Plate {
  pr: number;
  pc: number;
  gr: number;
  gc: number;
}

interface KeyDoor {
  kr: number;
  kc: number;
  dr: number;
  dc: number;
}

interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  onGround: boolean;
  hasKey: boolean;
  dead: boolean;
  deadTimer: number;
  facingRight: boolean;
  frame: number;
  frameTimer: number;
}

const COLORS = {
  wall: '#5a3a1a', wallEdge: '#7a5030', walldark: '#3a2008',
  air: '#1a0c04', treasure: '#f4c03f', key: '#4ef4b0',
  door: '#c96020', exit: '#9b7ef4', plate: '#d4a020',
  gate: '#c0860a', fire1: '#ff6600', fire2: '#ff9900',
  spike: '#8090a0', ankh: '#ff80cc', water: '#1060c0',
};

export function TombExplorerGame({ onBack }: TombExplorerGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelUp' | 'victory' | 'defeat'>('intro');
  const bgImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = 'https://vtelpopqybfytrgzkomj.supabase.co/storage/v1/object/public/game-assets/public/e7077ca4-9e14-4ae9-af64-5141810d3ec4/4724090e-ec80-4b61-a7f1-5ae30d7765e2/5dd96c5e-5536-456b-918f-84871a7fe9e0.png';
    img.onload = () => { bgImageRef.current = img; };
  }, []);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [deaths, setDeaths] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  // Mutable game state for the logic loop
  const g = useRef({
    map: [] as number[][],
    pg: [] as Plate[],
    kd: [] as KeyDoor[],
    plateActivated: [] as boolean[],
    player: {
      x: 0, y: 0, vx: 0, vy: 0,
      onGround: false, hasKey: false,
      dead: false, deadTimer: 0,
      facingRight: true,
      frame: 0, frameTimer: 0,
    } as PlayerState,
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    torches: [] as Torch[],
    shakeIntensity: 0,
    flashAlpha: 0,
    flashColor: '#ff0000',
    keys: {} as Record<string, boolean>,
    footstepTimer: 0,
    frameCount: 0,
    levelIdx: 0,
    score: 0,
    deaths: 0,
    levelTime: 0,
  }).current;

  const tileAt = useCallback((r: number, c: number) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return T.WALL;
    return g.map[r][c];
  }, [g]);

  const triggerShake = useCallback((mag: number) => { g.shakeIntensity = Math.max(g.shakeIntensity, mag); }, [g]);
  const triggerFlash = useCallback((color: string, alpha: number) => {
    g.flashColor = color;
    g.flashAlpha = Math.max(g.flashAlpha, alpha);
  }, [g]);

  const spawnParticles = useCallback((x: number, y: number, color: string, n: number) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 60 + Math.random() * 200;
      const size = 1.5 + Math.random() * 3;
      g.particles.push({
        x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 80,
        color, size, life: 1, maxLife: 0.5 + Math.random() * 0.6
      });
    }
  }, [g]);

  const spawnFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
    g.floatingTexts.push({ x, y, text, color, life: 1, vy: -55, scale: 1.4 });
  }, [g]);

  const killPlayer = useCallback(() => {
    if (g.player.dead) return;
    g.player.dead = true;
    g.player.deadTimer = 1.5;
    g.player.vx = 0; g.player.vy = -300;
    setDeaths(d => d + 1);
    g.deaths++;
    playSound('wrong');
    spawnParticles(g.player.x + PW / 2, g.player.y + PH / 2, '#ff4422', 45);
    spawnParticles(g.player.x + PW / 2, g.player.y + PH / 2, '#ff9900', 20);
    triggerShake(14);
    triggerFlash('#cc0000', 0.6);
    spawnFloatingText(g.player.x + PW / 2, g.player.y - 10, 'SLAIN!', '#ff4422');
  }, [g, playSound, spawnParticles, triggerShake, triggerFlash, spawnFloatingText]);

  const initLevel = useCallback((idx: number) => {
    const L = LEVELS[idx];
    g.map = L.map.map(r => [...r]);
    g.pg = L.pg.map(p => ({ ...p }));
    g.kd = L.kd.map(k => ({ ...k }));
    g.plateActivated = new Array(g.pg.length).fill(false);
    g.levelIdx = idx;

    const { c, r } = L.start;
    g.player = {
      x: c * TS + (TS - PW) / 2,
      y: HUD_H + r * TS - PH,
      vx: 0, vy: 0,
      onGround: false,
      hasKey: false,
      dead: false, deadTimer: 0,
      facingRight: true,
      frame: 0, frameTimer: 0,
    };
    g.particles = [];
    g.floatingTexts = [];
    g.torches = [];
    g.shakeIntensity = 0;
    g.flashAlpha = 0;
    g.footstepTimer = 0;
    g.levelTime = 0;

    for (let r2 = 0; r2 < ROWS; r2++) {
      for (let c2 = 0; c2 < COLS; c2++) {
        if (g.map[r2][c2] === T.FIRE) {
          g.torches.push({ r: r2, c: c2, flicker: Math.random() * Math.PI * 2 });
        }
      }
    }
  }, [g]);

  const resolveCollisions = useCallback((p: PlayerState) => {
    p.onGround = false;
    const r0 = Math.floor((p.y - HUD_H) / TS);
    const r1 = Math.floor((p.y - HUD_H + PH - 1) / TS);
    const c0 = Math.floor(p.x / TS);
    const c1 = Math.floor((p.x + PW - 1) / TS);

    for (let row = Math.max(0, r0); row <= Math.min(ROWS - 1, r1); row++) {
      for (let col = Math.max(0, c0); col <= Math.min(COLS - 1, c1); col++) {
        if (!isSolid(tileAt(row, col))) continue;
        const tx = col * TS, ty = HUD_H + row * TS;
        const oL = (p.x + PW) - tx, oR = (tx + TS) - p.x;
        const oT = (p.y + PH) - ty, oB = (ty + TS) - p.y;
        if (oL <= 0 || oR <= 0 || oT <= 0 || oB <= 0) continue;
        const mn = Math.min(oL, oR, oT, oB);
        if (mn === oT && p.vy >= 0) { p.y -= oT; p.vy = 0; p.onGround = true; }
        else if (mn === oB && p.vy <= 0) { p.y += oB; p.vy = 0; }
        else if (mn === oL) { p.x -= oL; p.vx = 0; }
        else if (mn === oR) { p.x += oR; p.vx = 0; }
      }
    }
  }, [tileAt]);

  const levelComplete = useCallback(() => {
    setGameState('levelUp');
    const timeBonus = Math.max(0, 2000 - Math.floor(g.levelTime) * 50);
    const deathPenalty = g.deaths * 100;
    const bonus = Math.max(0, timeBonus - deathPenalty) + 500;
    setScore(s => s + bonus);
    g.score += bonus;
    playSound('victory');
    spawnParticles(g.player.x + PW / 2, g.player.y + PH / 2, '#f4c03f', 50);
    spawnParticles(g.player.x + PW / 2, g.player.y + PH / 2, '#fffacc', 25);
    spawnParticles(g.player.x + PW / 2, g.player.y + PH / 2, '#ff80cc', 15);
    spawnFloatingText(W / 2, H / 2, '+' + bonus + ' pts!', '#f4c03f');
    triggerShake(8);
    triggerFlash('#f4c03f', 0.55);

    if (g.levelIdx === LEVELS.length - 1) {
      setGameState('victory');
      addScore({
        playerName: 'Master Explorer',
        score: g.score,
        game: 'tomb-explorer',
        details: `Conquered all ${LEVELS.length} chambers`
      });
    }
  }, [g, playSound, spawnParticles, spawnFloatingText, triggerShake, triggerFlash, addScore]);

  const checkInteractions = useCallback((p: PlayerState) => {
    if (p.dead) return;
    const cr = Math.floor((p.y - HUD_H + PH * 0.5) / TS);
    const cc = Math.floor((p.x + PW * 0.5) / TS);
    const br = Math.floor((p.y - HUD_H + PH - 1) / TS);
    const bc = cc;

    for (const [row, col] of [[cr, cc], [cr - 1, cc], [br, bc]]) {
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS) continue;
      const t = tileAt(row, col);

      if (t === T.TREASURE || t === T.ANKH) {
        g.map[row][col] = T.AIR;
        const pts = t === T.ANKH ? 300 : 100;
        setScore(s => s + pts);
        g.score += pts;
        spawnParticles(col * TS + TS / 2, HUD_H + row * TS + TS / 2, t === T.ANKH ? '#ff80cc' : '#f4c03f', 18);
        spawnFloatingText(col * TS + TS / 2, HUD_H + row * TS, '+' + pts, t === T.ANKH ? '#ff80cc' : '#f4c03f');
        triggerShake(3);
        triggerFlash(t === T.ANKH ? '#ff80cc' : '#f4c03f', 0.12);
        playSound('coin');
      }
      if (t === T.KEY && !p.hasKey) {
        g.map[row][col] = T.AIR;
        p.hasKey = true;
        spawnParticles(col * TS + TS / 2, HUD_H + row * TS + TS / 2, '#4ef4b0', 18);
        spawnFloatingText(col * TS + TS / 2, HUD_H + row * TS, 'KEY!', '#4ef4b0');
        triggerShake(3);
        triggerFlash('#4ef4b0', 0.15);
        playSound('pickup');
      }
      if (t === T.DOOR && p.hasKey) {
        g.map[row][col] = T.AIR;
        g.kd.forEach(k => { if (g.map[k.dr]?.[k.dc] === T.DOOR) g.map[k.dr][k.dc] = T.AIR; });
        p.hasKey = false;
        triggerFlash('#c96020', 0.2);
        playSound('unlock');
      }
      if (t === T.EXIT) { levelComplete(); return; }
      if (isHazard(t)) { killPlayer(); return; }
    }

    // Pressure plates
    for (let i = 0; i < g.pg.length; i++) {
      const plate = g.pg[i];
      if (!g.plateActivated[i] && br === plate.pr && bc === plate.pc && tileAt(plate.pr, plate.pc) === T.PLATE) {
        g.plateActivated[i] = true;
        g.pg.forEach(q => {
          if (q.pc === plate.pc && q.pr === plate.pr && tileAt(q.gr, q.gc) === T.GATE) {
            g.map[q.gr][q.gc] = T.AIR;
          }
        });
        spawnParticles(plate.pc * TS + TS / 2, HUD_H + plate.pr * TS + TS / 2, '#f4c03f', 28);
        spawnFloatingText(plate.pc * TS + TS / 2, HUD_H + plate.pr * TS, 'SEAL BROKEN!', '#f4c03f');
        triggerShake(6);
        triggerFlash('#c9952a', 0.28);
        playSound('unlock');
      }
    }
  }, [g, tileAt, spawnParticles, spawnFloatingText, triggerShake, triggerFlash, playSound, levelComplete, killPlayer]);

  const drawTile = useCallback((ctx: CanvasRenderingContext2D, row: number, col: number, frame: number) => {
    const t = g.map[row][col];
    if (t === T.AIR) return;
    const x = col * TS, y = HUD_H + row * TS;

    switch (t) {
      case T.WALL: {
        ctx.fillStyle = COLORS.wall;
        ctx.fillRect(x, y, TS, TS);
        ctx.fillStyle = COLORS.wallEdge;
        ctx.fillRect(x, y, TS, 3); ctx.fillRect(x, y, 3, TS);
        ctx.fillStyle = COLORS.walldark;
        ctx.fillRect(x + TS - 3, y, 3, TS); ctx.fillRect(x, y + TS - 3, TS, 3);
        break;
      }
      case T.TREASURE: {
        const bob = Math.sin(frame * 0.06 + col) * 3;
        ctx.fillStyle = COLORS.treasure;
        ctx.beginPath(); ctx.arc(x + TS / 2, y + TS / 2 + bob, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff8';
        ctx.beginPath(); ctx.arc(x + TS / 2 - 2, y + TS / 2 + bob - 2, 2, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case T.KEY: {
        const keyBob = Math.sin(frame * 0.07 + col * 1.3) * 2;
        ctx.strokeStyle = COLORS.key; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x + TS / 2, y + TS / 2 - 4 + keyBob, 5, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + TS / 2, y + TS / 2 + 1 + keyBob); ctx.lineTo(x + TS / 2, y + TS / 2 + 8 + keyBob); ctx.stroke();
        break;
      }
      case T.DOOR: {
        ctx.fillStyle = COLORS.door; ctx.fillRect(x + 3, y, TS - 6, TS);
        ctx.strokeStyle = '#ffaa00'; ctx.lineWidth = 1.5; ctx.strokeRect(x + 3, y, TS - 6, TS);
        break;
      }
      case T.EXIT: {
        const pulse = 0.7 + Math.sin(frame * 0.08) * 0.3;
        ctx.fillStyle = `rgba(80,40,180,${pulse * 0.45})`;
        ctx.fillRect(x, y, TS, TS);
        ctx.strokeStyle = `rgba(180,140,255,${pulse})`; ctx.lineWidth = 2;
        ctx.strokeRect(x + 2, y + 2, TS - 4, TS - 4);
        break;
      }
      case T.PLATE: {
        ctx.fillStyle = '#5a3a00'; ctx.fillRect(x + 2, y + TS - 8, TS - 4, 6);
        ctx.fillStyle = COLORS.plate; ctx.fillRect(x + 4, y + TS - 10, TS - 8, 6);
        break;
      }
      case T.GATE: {
        ctx.fillStyle = '#8a6010'; for (let bx = x + 4; bx < x + TS - 4; bx += 5) ctx.fillRect(bx, y, 3, TS);
        ctx.fillStyle = COLORS.gate; ctx.fillRect(x + 2, y + 4, TS - 4, 3);
        break;
      }
      case T.FIRE: {
        const h = 10 + Math.sin(frame * 0.12 + col * 1.3) * 7;
        ctx.fillStyle = COLORS.fire1; ctx.fillRect(x + 6, y + TS - h, 20, h);
        break;
      }
      case T.SPIKE: {
        ctx.fillStyle = COLORS.spike;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath(); ctx.moveTo(x + 4 + i * 8, y + TS); ctx.lineTo(x + 7 + i * 8, y + TS - 12); ctx.lineTo(x + 10 + i * 8, y + TS); ctx.fill();
        }
        break;
      }
      case T.ANKH: {
        const bob2 = Math.sin(frame * 0.07 + col) * 3;
        ctx.strokeStyle = COLORS.ankh; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(x + TS / 2, y + TS / 2 - 4 + bob2, 5, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + TS / 2, y + TS / 2 + 1 + bob2); ctx.lineTo(x + TS / 2, y + TS / 2 + 10 + bob2); ctx.stroke();
        break;
      }
      case T.WATER: {
        const wave = Math.sin(frame * 0.05 + col * 0.5) * 2;
        ctx.fillStyle = 'rgba(30,120,240,0.8)'; ctx.fillRect(x, y + wave, TS, TS - wave);
        break;
      }
    }
  }, [g]);

  const drawPlayer = useCallback((ctx: CanvasRenderingContext2D, frame: number) => {
    const p = g.player;
    const alpha = p.dead ? Math.max(0, p.deadTimer / 1.5) : 1;
    ctx.globalAlpha = alpha;
    const dir = p.facingRight ? 1 : -1;
    ctx.save();
    ctx.translate(p.x + PW / 2, p.y + PH / 2);
    ctx.scale(dir, 1);
    ctx.fillStyle = '#c8a070'; // skin
    ctx.fillRect(-5, -12, 10, 14); // torso
    ctx.fillStyle = '#f0e8c8'; // kilt
    ctx.fillRect(-7, 0, 14, 12);
    ctx.fillStyle = '#c8a070';
    ctx.beginPath(); ctx.ellipse(0, -16, 6, 7, 0, 0, Math.PI * 2); ctx.fill(); // head
    ctx.fillStyle = '#f4c03f'; // nemes
    ctx.beginPath(); ctx.moveTo(-6, -22); ctx.lineTo(6, -22); ctx.lineTo(8, -10); ctx.lineTo(-8, -10); ctx.closePath(); ctx.fill();
    if (p.hasKey) { ctx.fillStyle = '#4ef4b0'; ctx.font = '12px sans-serif'; ctx.fillText('🗝', -6, -26); }
    ctx.restore();
    ctx.globalAlpha = 1;
  }, [g]);

  // Game Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (ts: number) => {
      const dt = Math.min((ts - lastTime) / 1000, 0.05);
      lastTime = ts;
      g.frameCount++;

      if (gameState === 'playing') {
        g.shakeIntensity = Math.max(0, g.shakeIntensity - g.shakeIntensity * 12 * dt);
        g.flashAlpha = Math.max(0, g.flashAlpha - dt * 3.5);

        // Update particles
        for (let i = g.particles.length - 1; i >= 0; i--) {
          const p = g.particles[i];
          p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 500 * dt;
          p.life -= dt / p.maxLife;
          if (p.life <= 0) g.particles.splice(i, 1);
        }
        for (let i = g.floatingTexts.length - 1; i >= 0; i--) {
          const ft = g.floatingTexts[i];
          ft.y += ft.vy * dt; ft.vy += 30 * dt;
          ft.life -= dt;
          if (ft.life <= 0) g.floatingTexts.splice(i, 1);
        }

        const p = g.player;
        if (p.dead) {
          p.deadTimer -= dt;
          if (p.deadTimer <= 0) { p.dead = false; initLevel(g.levelIdx); }
          p.x += p.vx * dt; p.y += p.vy * dt; p.vy += GRAVITY * dt;
        } else {
          const left = g.keys['ArrowLeft'] || g.keys['KeyA'];
          const right = g.keys['ArrowRight'] || g.keys['KeyD'];
          const jump = g.keys['ArrowUp'] || g.keys['KeyW'] || g.keys['Space'];

          p.vx = (left ? -SPEED : 0) + (right ? SPEED : 0);
          if (right && !left) p.facingRight = true;
          if (left && !right) p.facingRight = false;
          if (jump && p.onGround) {
            p.vy = JUMP_VEL; p.onGround = false;
            playSound('jump');
            spawnParticles(p.x + PW / 2, p.y + PH, '#8a6030', 6);
          }
          p.vy += GRAVITY * dt;
          p.x += p.vx * dt; resolveCollisions(p);
          p.y += p.vy * dt; resolveCollisions(p);
          p.x = Math.max(0, Math.min(W - PW, p.x));
          if (p.y > H) killPlayer();
          g.levelTime += dt;

          if (Math.abs(p.vx) > 10 && p.onGround) {
            g.footstepTimer += dt;
            if (g.footstepTimer > 0.13) {
              g.footstepTimer = 0;
              spawnParticles(p.x + PW / 2, p.y + PH - 1, '#7a5020', 3);
            }
          } else {
            g.footstepTimer = 0;
          }

          checkInteractions(p);
        }

        // Render
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, W, H);
          ctx.save();
          if (g.shakeIntensity > 0.5) {
            ctx.translate((Math.random() * 2 - 1) * g.shakeIntensity, (Math.random() * 2 - 1) * g.shakeIntensity);
          }

          if (bgImageRef.current) {
            ctx.drawImage(bgImageRef.current, 0, HUD_H, W, H - HUD_H);
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillRect(0, HUD_H, W, H - HUD_H);
          } else {
            ctx.fillStyle = COLORS.air;
            ctx.fillRect(0, HUD_H, W, H - HUD_H);
          }

          for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) drawTile(ctx, r, c, g.frameCount);
          for (const part of g.particles) {
            ctx.globalAlpha = part.life * 0.9; ctx.fillStyle = part.color;
            ctx.beginPath(); ctx.arc(part.x, part.y, part.size * part.life, 0, Math.PI * 2); ctx.fill();
          }
          ctx.globalAlpha = 1;
          for (const ft of g.floatingTexts) {
            ctx.fillStyle = ft.color; ctx.font = 'bold 15px "Cinzel",serif'; ctx.textAlign = 'center';
            ctx.fillText(ft.text, ft.x, ft.y);
          }
          drawPlayer(ctx, g.frameCount);
          if (g.flashAlpha > 0.01) { ctx.globalAlpha = g.flashAlpha; ctx.fillStyle = g.flashColor; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
          ctx.restore();
        }
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, initLevel, playSound, g, checkInteractions, drawPlayer, drawTile, killPlayer, resolveCollisions, spawnParticles]);

  // Input listeners
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      g.keys[e.code] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => { g.keys[e.code] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [g]);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-background overflow-hidden flex flex-col items-center">
      <div className="max-w-5xl w-full">
        <div className="flex justify-between items-center mb-6">
          <EgyptianButton variant="nav" onClick={() => { stopAmbientMusic(); onBack(); }} className="-ml-4">
            <ArrowLeft size={20} className="mr-2" /> Back to Games
          </EgyptianButton>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-obsidian/60 border border-gold/30 rounded-full flex items-center gap-2">
              <Compass className="text-primary w-4 h-4" />
              <span className="text-sm font-display text-gold">CHAMBER {currentLevelIdx + 1}/10</span>
            </div>
            <div className="px-4 py-2 bg-obsidian/60 border border-gold/30 rounded-full flex items-center gap-2">
              <Trophy className="text-primary w-4 h-4" />
              <span className="text-sm font-display text-gold">SCORE: {score}</span>
            </div>
          </div>
        </div>

        <EgyptianCard variant="tomb" padding="none" className="relative overflow-hidden shadow-2xl border-2 border-gold/20 flex flex-col items-center">
          <div className="w-full p-4 border-b border-gold/10 bg-gold/5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <MapIcon className="text-primary" size={20} />
              <span className="font-display text-gold uppercase text-xs tracking-widest">{LEVELS[currentLevelIdx].name}</span>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2 px-3 py-1 rounded-lg border bg-terracotta/10 border-terracotta/20">
                <Skull size={16} className="text-terracotta" />
                <span className="text-[10px] font-bold text-terracotta uppercase">Deaths: {deaths}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg border bg-primary/10 border-primary/20">
                <Timer size={16} className="text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase">{Math.floor(g.levelTime)}s</span>
              </div>
            </div>
          </div>

          <div className="relative p-2 bg-black flex items-center justify-center">
            <canvas ref={canvasRef} width={W} height={H} className="rounded-lg shadow-2xl" />
            <AnimatePresence>
              {gameState === 'intro' && (
                <GameOverlay
                  type="intro"
                  title="Tomb Explorer"
                  description="Navigate the treacherous chambers of the Pharaohs. Avoid hazards, solve mechanical puzzles, and find the golden path to the exit."
                  onAction={() => { setGameState('playing'); initLevel(0); startAmbientMusic(); }}
                  onSecondaryAction={onBack}
                />
              )}
              {gameState === 'levelUp' && (
                <GameOverlay
                  type="levelup"
                  title="Chamber Cleared!"
                  description={`Moving to ${LEVELS[currentLevelIdx + 1]?.name || 'the next trial'}`}
                  stats={[
                    { label: 'Time Bonus', value: Math.max(0, 2000 - Math.floor(g.levelTime) * 50) },
                    { label: 'Level Score', value: score }
                  ]}
                  actionLabel="Next Chamber"
                  onAction={() => {
                    const next = currentLevelIdx + 1;
                    setCurrentLevelIdx(next);
                    initLevel(next);
                    setGameState('playing');
                  }}
                  onSecondaryAction={onBack}
                />
              )}
              {gameState === 'victory' && (
                <GameOverlay
                  type="victory"
                  title="Master Explorer"
                  description="You have conquered every chamber of the Great Necropolis. Your name is etched in gold."
                  score={score}
                  stars={5}
                  stats={[
                    { label: 'Total Score', value: score },
                    { label: 'Chambers', value: '10/10' },
                    { label: 'Rank', value: 'Royal Archeologist' }
                  ]}
                  actionLabel="Explore Again"
                  onAction={() => { setCurrentLevelIdx(0); setScore(0); setDeaths(0); initLevel(0); setGameState('playing'); }}
                  onSecondaryAction={onBack}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Controls */}
          <div className="w-full p-6 bg-black/80 border-t border-gold/20 flex justify-between items-center md:hidden select-none">
            <div className="flex gap-4">
              <button
                className="w-16 h-16 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center active:bg-gold/30 active:scale-95 transition-all"
                onTouchStart={() => { g.keys['ArrowLeft'] = true; }}
                onTouchEnd={() => { g.keys['ArrowLeft'] = false; }}
              >
                <ArrowLeft size={32} className="text-gold" />
              </button>
              <button
                className="w-16 h-16 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center active:bg-gold/30 active:scale-95 transition-all"
                onTouchStart={() => { g.keys['ArrowRight'] = true; }}
                onTouchEnd={() => { g.keys['ArrowRight'] = false; }}
              >
                <ArrowRight size={32} className="text-gold" />
              </button>
            </div>

            <button
              className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 flex flex-col items-center justify-center active:bg-primary/40 active:scale-95 transition-all"
              onTouchStart={() => { g.keys['ArrowUp'] = true; }}
              onTouchEnd={() => { g.keys['ArrowUp'] = false; }}
            >
              <ArrowUp size={32} className="text-primary" />
              <span className="text-[10px] font-bold text-primary">JUMP</span>
            </button>
          </div>

          <div className="p-4 bg-black/60 border-t border-gold/20 flex justify-center gap-8 w-full">
            <div className="flex items-center gap-2">
              <Key size={16} className="text-primary" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Find Keys</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-terracotta" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Avoid Fire</span>
            </div>
            <div className="flex items-center gap-2">
              <Ghost size={16} className="text-turquoise" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Unseal Gates</span>
            </div>
          </div>
        </EgyptianCard>
      </div>
    </div>
  );
}
