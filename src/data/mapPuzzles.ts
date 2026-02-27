// Map & Story Based Puzzles - "Bring it Back to Life"

export interface MapPuzzle {
    id: string;
    type: 'location-match' | 'timeline-order' | 'figure-match' | 'route-trace' | 'territory-claim';
    title: string;
    description: string;
    periodId: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    timeLimit?: number; // seconds
    data: LocationMatchData | TimelineOrderData | FigureMatchData | RouteTraceData | TerritoryClaimData;
  }
  
  export interface LocationMatchData {
    type: 'location-match';
    locations: { id: string; name: string; hint: string }[];
    correctPositions: { locationId: string; x: number; y: number }[];
  }
  
  export interface TimelineOrderData {
    type: 'timeline-order';
    events: { id: string; title: string; hint: string }[];
    correctOrder: string[];
  }
  
  export interface FigureMatchData {
    type: 'figure-match';
    figures: { id: string; name: string; title: string }[];
    achievements: { id: string; text: string; figureId: string }[];
  }
  
  export interface RouteTraceData {
    type: 'route-trace';
    description: string;
    waypoints: { id: string; name: string; x: number; y: number }[];
    correctRoute: string[];
  }
  
  export interface TerritoryClaimData {
    type: 'territory-claim';
    scenario: string;
    territories: { id: string; name: string; x: number; y: number; correctRuler: string }[];
    rulers: { id: string; name: string; color: string }[];
  }
  
  export const mapPuzzles: MapPuzzle[] = [
    // OLD KINGDOM PUZZLES
    {
      id: 'pyramid-locations',
      type: 'location-match',
      title: 'The Pyramid Trail',
      description: 'Place the great pyramids on the map of Old Kingdom Egypt.',
      periodId: 'old-kingdom',
      difficulty: 'easy',
      points: 100,
      timeLimit: 120,
      data: {
        type: 'location-match',
        locations: [
          { id: 'step-pyramid', name: 'Step Pyramid of Djoser', hint: 'The first pyramid, at the ancient necropolis' },
          { id: 'great-pyramid', name: 'Great Pyramid of Khufu', hint: 'The wonder of the world, on the Giza plateau' },
          { id: 'bent-pyramid', name: 'Bent Pyramid', hint: 'Sneferu\'s pyramid that changed angle midway' },
          { id: 'red-pyramid', name: 'Red Pyramid', hint: 'Sneferu\'s true pyramid at Dahshur' }
        ],
        correctPositions: [
          { locationId: 'step-pyramid', x: 48, y: 32 },
          { locationId: 'great-pyramid', x: 47, y: 28 },
          { locationId: 'bent-pyramid', x: 46, y: 35 },
          { locationId: 'red-pyramid', x: 46, y: 34 }
        ]
      }
    },
    {
      id: 'old-kingdom-timeline',
      type: 'timeline-order',
      title: 'Order of the Builders',
      description: 'Arrange these Old Kingdom events in chronological order.',
      periodId: 'old-kingdom',
      difficulty: 'medium',
      points: 150,
      timeLimit: 90,
      data: {
        type: 'timeline-order',
        events: [
          { id: 'e1', title: 'Step Pyramid built', hint: 'Imhotep\'s revolutionary design' },
          { id: 'e2', title: 'Great Pyramid completed', hint: 'Khufu\'s eternal monument' },
          { id: 'e3', title: 'Pyramid Texts inscribed', hint: 'First funerary texts in Unas\'s tomb' },
          { id: 'e4', title: 'Pepi II dies after 94 years', hint: 'The longest reign ends in chaos' },
          { id: 'e5', title: 'Old Kingdom collapses', hint: 'Famine and fragmentation begin' }
        ],
        correctOrder: ['e1', 'e2', 'e3', 'e4', 'e5']
      }
    },
    {
      id: 'architect-achievements',
      type: 'figure-match',
      title: 'The Great Minds',
      description: 'Match these Old Kingdom figures to their achievements.',
      periodId: 'old-kingdom',
      difficulty: 'medium',
      points: 150,
      data: {
        type: 'figure-match',
        figures: [
          { id: 'imhotep', name: 'Imhotep', title: 'Architect of Djoser' },
          { id: 'hemiunu', name: 'Hemiunu', title: 'Architect of Khufu' },
          { id: 'ptahhotep', name: 'Ptahhotep', title: 'Vizier and Sage' },
          { id: 'harkhuf', name: 'Harkhuf', title: 'Explorer of Nubia' }
        ],
        achievements: [
          { id: 'a1', text: 'Designed the first pyramid in history', figureId: 'imhotep' },
          { id: 'a2', text: 'Oversaw construction of the Great Pyramid', figureId: 'hemiunu' },
          { id: 'a3', text: 'Wrote famous wisdom instructions', figureId: 'ptahhotep' },
          { id: 'a4', text: 'Brought a dancing pygmy from the south', figureId: 'harkhuf' },
          { id: 'a5', text: 'Later worshipped as a god of medicine', figureId: 'imhotep' }
        ]
      }
    },
    // FIRST INTERMEDIATE PERIOD PUZZLES
    {
      id: 'divided-egypt',
      type: 'territory-claim',
      title: 'The Divided Land',
      description: 'Mark which dynasty controlled each region during the civil war.',
      periodId: 'first-intermediate',
      difficulty: 'hard',
      points: 200,
      timeLimit: 180,
      data: {
        type: 'territory-claim',
        scenario: 'Egypt c. 2100 BCE - The land is split between rival kingdoms.',
        territories: [
          { id: 'delta', name: 'The Delta', x: 56, y: 15, correctRuler: 'heracleopolis' },
          { id: 'memphis-region', name: 'Memphis Region', x: 50, y: 30, correctRuler: 'heracleopolis' },
          { id: 'middle-egypt', name: 'Middle Egypt', x: 48, y: 45, correctRuler: 'disputed' },
          { id: 'theban-region', name: 'Theban Region', x: 45, y: 62, correctRuler: 'thebes' },
          { id: 'upper-south', name: 'Far South', x: 47, y: 75, correctRuler: 'thebes' }
        ],
        rulers: [
          { id: 'heracleopolis', name: '9th/10th Dynasty (Heracleopolis)', color: '#4A5568' },
          { id: 'thebes', name: '11th Dynasty (Thebes)', color: '#2D3748' },
          { id: 'disputed', name: 'Disputed/Warzone', color: '#E53E3E' }
        ]
      }
    },
    {
      id: 'famine-timeline',
      type: 'timeline-order',
      title: 'The Collapse',
      description: 'Order the events that led to Egypt\'s first dark age.',
      periodId: 'first-intermediate',
      difficulty: 'medium',
      points: 150,
      data: {
        type: 'timeline-order',
        events: [
          { id: 'e1', title: 'Pepi II\'s death ends the 6th Dynasty', hint: 'After the longest reign in history' },
          { id: 'e2', title: 'Low Nile floods cause famine', hint: 'The river fails for years' },
          { id: 'e3', title: 'Nomarchs seize regional power', hint: 'Local lords become independent' },
          { id: 'e4', title: 'Heracleopolis claims the throne', hint: 'A new dynasty in the north' },
          { id: 'e5', title: 'Thebes rises in the south', hint: 'Intef I declares kingship' }
        ],
        correctOrder: ['e1', 'e2', 'e3', 'e4', 'e5']
      }
    },
    // MIDDLE KINGDOM PUZZLES
    {
      id: 'sinuhe-journey',
      type: 'route-trace',
      title: 'The Flight of Sinuhe',
      description: 'Trace Sinuhe\'s route from Egypt through the lands of the East.',
      periodId: 'middle-kingdom',
      difficulty: 'hard',
      points: 200,
      timeLimit: 150,
      data: {
        type: 'route-trace',
        description: 'Mark Sinuhe\'s path from the army camp to his exile in Retjenu (Syria-Palestine) and back.',
        waypoints: [
          { id: 'start', name: 'Army Camp (Libya border)', x: 25, y: 30 },
          { id: 'itjtawy', name: 'Itjtawy (avoiding)', x: 49, y: 35 },
          { id: 'walls', name: 'Walls of the Ruler', x: 60, y: 25 },
          { id: 'byblos', name: 'Byblos', x: 75, y: 20 },
          { id: 'retjenu', name: 'Upper Retjenu', x: 85, y: 25 },
          { id: 'return', name: 'Return to Egypt', x: 49, y: 35 }
        ],
        correctRoute: ['start', 'walls', 'byblos', 'retjenu', 'return']
      }
    },
    {
      id: 'nubian-fortresses',
      type: 'location-match',
      title: 'The Nubian Frontier',
      description: 'Place Senusret III\'s fortresses along the Nile.',
      periodId: 'middle-kingdom',
      difficulty: 'medium',
      points: 150,
      timeLimit: 120,
      data: {
        type: 'location-match',
        locations: [
          { id: 'buhen', name: 'Buhen', hint: 'The greatest fortress, at the Second Cataract' },
          { id: 'semna', name: 'Semna', hint: 'Twin fortress controlling the narrowest point' },
          { id: 'kumma', name: 'Kumma', hint: 'Opposite Semna, completing the barrier' },
          { id: 'mirgissa', name: 'Mirgissa', hint: 'Major supply depot fortress' }
        ],
        correctPositions: [
          { locationId: 'buhen', x: 48, y: 88 },
          { locationId: 'semna', x: 47, y: 90 },
          { locationId: 'kumma', x: 49, y: 90 },
          { locationId: 'mirgissa', x: 48, y: 89 }
        ]
      }
    },
    {
      id: 'middle-kingdom-figures',
      type: 'figure-match',
      title: 'Architects of the Golden Age',
      description: 'Match the figures of the Middle Kingdom to their deeds.',
      periodId: 'middle-kingdom',
      difficulty: 'hard',
      points: 200,
      data: {
        type: 'figure-match',
        figures: [
          { id: 'mentuhotep', name: 'Mentuhotep II', title: 'Reunifier' },
          { id: 'amenemhat-i', name: 'Amenemhat I', title: '12th Dynasty Founder' },
          { id: 'senusret-iii', name: 'Senusret III', title: 'Warrior King' },
          { id: 'amenemhat-iii', name: 'Amenemhat III', title: 'Builder' }
        ],
        achievements: [
          { id: 'a1', text: 'Reunified Egypt after the First Intermediate Period', figureId: 'mentuhotep' },
          { id: 'a2', text: 'Founded Itjtawy as the new capital', figureId: 'amenemhat-i' },
          { id: 'a3', text: 'Conquered Nubia and built the fortress chain', figureId: 'senusret-iii' },
          { id: 'a4', text: 'Developed the Faiyum oasis', figureId: 'amenemhat-iii' },
          { id: 'a5', text: 'Was possibly assassinated by his guards', figureId: 'amenemhat-i' },
          { id: 'a6', text: 'Built the temple at Deir el-Bahri', figureId: 'mentuhotep' }
        ]
      }
    },
    // SECOND INTERMEDIATE PERIOD PUZZLES
    {
      id: 'hyksos-vs-thebes',
      type: 'territory-claim',
      title: 'The Two Kingdoms',
      description: 'Mark the territories controlled by Hyksos, Thebes, and Kush.',
      periodId: 'second-intermediate',
      difficulty: 'medium',
      points: 150,
      timeLimit: 120,
      data: {
        type: 'territory-claim',
        scenario: 'Egypt c. 1560 BCE - Three powers vie for control.',
        territories: [
          { id: 'delta', name: 'The Delta', x: 56, y: 15, correctRuler: 'hyksos' },
          { id: 'avaris-region', name: 'Avaris Region', x: 58, y: 18, correctRuler: 'hyksos' },
          { id: 'memphis-sip', name: 'Memphis Area', x: 50, y: 30, correctRuler: 'hyksos' },
          { id: 'middle-sip', name: 'Middle Egypt', x: 48, y: 45, correctRuler: 'disputed' },
          { id: 'thebes-sip', name: 'Theban Territory', x: 45, y: 62, correctRuler: 'thebes' },
          { id: 'nubia-sip', name: 'Nubia', x: 48, y: 88, correctRuler: 'kush' }
        ],
        rulers: [
          { id: 'hyksos', name: 'Hyksos (15th Dynasty)', color: '#9B2C2C' },
          { id: 'thebes', name: 'Thebes (17th Dynasty)', color: '#2B6CB0' },
          { id: 'kush', name: 'Kingdom of Kush', color: '#2F855A' },
          { id: 'disputed', name: 'Contested Zone', color: '#D69E2E' }
        ]
      }
    },
    {
      id: 'liberation-timeline',
      type: 'timeline-order',
      title: 'The Road to Liberation',
      description: 'Order the events of Egypt\'s war against the Hyksos.',
      periodId: 'second-intermediate',
      difficulty: 'hard',
      points: 200,
      data: {
        type: 'timeline-order',
        events: [
          { id: 'e1', title: 'Hyksos establish rule at Avaris', hint: 'Foreign rulers take the Delta' },
          { id: 'e2', title: 'Seqenenre Tao dies in battle', hint: 'His skull shows war wounds' },
          { id: 'e3', title: 'Kamose intercepts the Hyksos-Kush letter', hint: 'The secret alliance exposed' },
          { id: 'e4', title: 'Kamose raids Avaris', hint: 'The Theban fleet reaches the enemy capital' },
          { id: 'e5', title: 'Ahmose I captures Avaris', hint: 'The Hyksos are expelled' },
          { id: 'e6', title: 'Ahmose pursues enemies into Canaan', hint: 'Egypt\'s first empire begins' }
        ],
        correctOrder: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6']
      }
    },
    {
      id: 'kamose-campaign',
      type: 'route-trace',
      title: 'Kamose\'s War Path',
      description: 'Trace the route of Kamose\'s campaign against the Hyksos.',
      periodId: 'second-intermediate',
      difficulty: 'hard',
      points: 200,
      timeLimit: 120,
      data: {
        type: 'route-trace',
        description: 'Follow Kamose\'s fleet from Thebes to the walls of Avaris.',
        waypoints: [
          { id: 'thebes', name: 'Thebes', x: 45, y: 62 },
          { id: 'deir-el-ballas', name: 'Deir el-Ballas (base)', x: 44, y: 58 },
          { id: 'neferusi', name: 'Neferusi (battle)', x: 48, y: 45 },
          { id: 'cynopolis', name: 'Cynopolis', x: 49, y: 40 },
          { id: 'avaris', name: 'Avaris (raid)', x: 58, y: 18 }
        ],
        correctRoute: ['thebes', 'deir-el-ballas', 'neferusi', 'cynopolis', 'avaris']
      }
    }
  ];
  
  // Story-based puzzles
  export interface StoryPuzzle {
    id: string;
    storyId: string;
    type: 'sequence' | 'riddle' | 'decode' | 'choice';
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    data: SequencePuzzleData | RiddlePuzzleData | DecodePuzzleData | ChoicePuzzleData;
  }
  
  export interface SequencePuzzleData {
    type: 'sequence';
    panels: { id: string; image: string; caption: string }[];
    correctOrder: string[];
  }
  
  export interface RiddlePuzzleData {
    type: 'riddle';
    riddle: string;
    hints: string[];
    answer: string;
    acceptableAnswers: string[];
  }
  
  export interface DecodePuzzleData {
    type: 'decode';
    encodedMessage: string;
    hieroglyphs: { symbol: string; meaning: string }[];
    solution: string;
  }
  
  export interface ChoicePuzzleData {
    type: 'choice';
    scenario: string;
    choices: { id: string; text: string; consequence: string; points: number }[];
    historicalChoice?: string;
  }
  
  export const storyPuzzles: StoryPuzzle[] = [
    {
      id: 'imhotep-riddle',
      storyId: 'imhotep-vision',
      type: 'riddle',
      title: 'The Architect\'s Riddle',
      description: 'Solve the riddle that Ptah posed to Imhotep in his vision.',
      difficulty: 'medium',
      points: 150,
      data: {
        type: 'riddle',
        riddle: 'I am not alive, yet I grow. I have no lungs, yet I need air. I have no mouth, yet fire is my food. What am I that Imhotep used to shape eternity?',
        hints: [
          'Think of what transforms raw materials',
          'Without me, limestone remains in the quarry',
          'I turn sand into something useful'
        ],
        answer: 'kiln',
        acceptableAnswers: ['kiln', 'fire', 'furnace', 'forge', 'flame']
      }
    },
    {
      id: 'sinuhe-choice',
      storyId: 'sinuhe-tale',
      type: 'choice',
      title: 'Sinuhe\'s Dilemma',
      description: 'You are Sinuhe, and you have just heard of the king\'s death. What do you do?',
      difficulty: 'easy',
      points: 100,
      data: {
        type: 'choice',
        scenario: 'The messenger has just announced that Amenemhat I is dead. The camp is in chaos. Prince Senusret is rushing back from Libya. What will you do?',
        choices: [
          { 
            id: 'stay', 
            text: 'Stay and serve the new king', 
            consequence: 'The safest choice. You prove your loyalty and receive honors.', 
            points: 50 
          },
          { 
            id: 'flee', 
            text: 'Flee east into the desert', 
            consequence: 'Like the real Sinuhe, fear drives you away. Years of exile await, but also adventure.', 
            points: 100 
          },
          { 
            id: 'investigate', 
            text: 'Investigate who killed the king', 
            consequence: 'Dangerous! You might uncover conspirators - or become their next target.', 
            points: 75 
          }
        ],
        historicalChoice: 'flee'
      }
    },
    {
      id: 'ankhtifi-distribution',
      storyId: 'ankhtifi-famine',
      type: 'sequence',
      title: 'Feeding the Hungry',
      description: 'Put Ankhtifi\'s actions during the famine in the correct order.',
      difficulty: 'medium',
      points: 125,
      data: {
        type: 'sequence',
        panels: [
          { id: 'p1', image: '/puzzles/granary.jpg', caption: 'Inspected the dwindling grain stores' },
          { id: 'p2', image: '/puzzles/distribution.jpg', caption: 'Distributed food to starving villages' },
          { id: 'p3', image: '/puzzles/conquest.jpg', caption: 'Conquered neighboring nomes for supplies' },
          { id: 'p4', image: '/puzzles/tomb.jpg', caption: 'Recorded his deeds in his tomb' }
        ],
        correctOrder: ['p1', 'p2', 'p3', 'p4']
      }
    },
    {
      id: 'kamose-decode',
      storyId: 'kamose-intercepted',
      type: 'decode',
      title: 'The Intercepted Message',
      description: 'Decode the message Kamose intercepted between Apepi and the King of Kush.',
      difficulty: 'hard',
      points: 200,
      data: {
        type: 'decode',
        encodedMessage: '𓅃 𓋹 𓊃 𓏏 𓇋 𓈖 𓏏 𓇋 𓂋 𓅱 𓊪 𓇋',
        hieroglyphs: [
          { symbol: '𓅃', meaning: 'attack' },
          { symbol: '𓋹', meaning: 'from' },
          { symbol: '𓊃', meaning: 'south' },
          { symbol: '𓏏', meaning: 'and' },
          { symbol: '𓇋', meaning: 'we' },
          { symbol: '𓈖', meaning: 'shall' },
          { symbol: '𓂋', meaning: 'divide' },
          { symbol: '𓅱', meaning: 'Egypt' },
          { symbol: '𓊪', meaning: 'between' }
        ],
        solution: 'Attack from south and we shall divide Egypt between [us]'
      }
    }
  ];
  
  // Helper functions
  export function getMapPuzzlesByPeriod(periodId: string): MapPuzzle[] {
    return mapPuzzles.filter(p => p.periodId === periodId);
  }
  
  export function getStoryPuzzlesByStory(storyId: string): StoryPuzzle[] {
    return storyPuzzles.filter(p => p.storyId === storyId);
  }
  
  export function getPuzzleById(id: string): MapPuzzle | StoryPuzzle | undefined {
    return mapPuzzles.find(p => p.id === id) || storyPuzzles.find(p => p.id === id);
  }
  
  export function getAllPuzzlesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): (MapPuzzle | StoryPuzzle)[] {
    return [
      ...mapPuzzles.filter(p => p.difficulty === difficulty),
      ...storyPuzzles.filter(p => p.difficulty === difficulty)
    ];
  }
  