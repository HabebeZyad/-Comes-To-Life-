export interface PyramidLevel {
  level: number;
  title: string;
  blocks: number[]; // widths of the blocks
  timeLimit: number; // in seconds
  speed: number;
  tolerance: number;
}

export const pyramidLevels: PyramidLevel[] = [
  {
    level: 1,
    title: 'Apprentice Architect',
    blocks: [200, 180, 160, 140],
    timeLimit: 60,
    speed: 2,
    tolerance: 30,
  },
  {
    level: 2,
    title: 'Skilled Mason',
    blocks: [200, 180, 160, 140, 120, 100],
    timeLimit: 75,
    speed: 3,
    tolerance: 20,
  },
  {
    level: 3,
    title: 'Master Builder',
    blocks: [200, 180, 160, 140, 120, 100, 80, 60],
    timeLimit: 90,
    speed: 4,
    tolerance: 10,
  },
  {
    level: 4,
    title: 'Pharaoh\'s Engineer',
    blocks: [220, 200, 180, 160, 140, 120, 100, 80, 60, 40],
    timeLimit: 100,
    speed: 5,
    tolerance: 5,
  },
];
