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
  category?: 'map' | 'game';
  data: LocationMatchData | TimelineOrderData | FigureMatchData | RouteTraceData | TerritoryClaimData;
}

export interface LocationMatchData {
  type: 'location-match';
  locations: { id: string; name: string; hint: string; discoveryLog?: string }[];
  correctPositions: { locationId: string; x: number; y: number }[];
}

export interface TimelineOrderData {
  type: 'timeline-order';
  events: { id: string; title: string; hint: string }[];
  correctOrder: string[];
}

export interface FigureMatchData {
  type: 'figure-match';
  figures: { id: string; name: string; title: string; image?: string; period?: string }[];
  achievements: { id: string; text: string; figureId: string; type?: 'monument' | 'deed' | 'wisdom' }[];
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
    id: 'pyramid-locations-giza',
    type: 'location-match',
    title: 'Giza Plateau',
    description: 'Place the great pyramids on the map of the Giza Plateau.',
    periodId: 'old-kingdom',
    difficulty: 'easy',
    points: 100,
    timeLimit: 120,
    category: 'game',
    data: {
      type: 'location-match',
      locations: [
        {
          id: 'khufu',
          name: 'Great Pyramid of Khufu',
          hint: 'The largest and oldest of the Giza pyramids',
          discoveryLog: 'Constructed around 2560 BCE, this monument was the tallest man-made structure in the world for over 3,800 years. It consists of an estimated 2.3 million stone blocks.'
        },
        {
          id: 'khafre',
          name: 'Pyramid of Khafre',
          hint: 'The pyramid that still retains casing stones at its peak',
          discoveryLog: 'Built by Khufu\'s son, it appears taller than the Great Pyramid because it sits on higher ground. It is the only one that still shows the original polished limestone casing at its summit.'
        },
        {
          id: 'menkaure',
          name: 'Pyramid of Menkaure',
          hint: 'The smallest of the three main Giza pyramids',
          discoveryLog: 'Though smaller, this pyramid was uniquely encased in expensive red granite for its lower 16 courses. It represents the final great pyramid of the Giza dynasty.'
        },
        {
          id: 'sphinx',
          name: 'Great Sphinx',
          hint: 'The guardian of the plateau',
          discoveryLog: 'Carved directly from the limestone bedrock, this colossal figure with a lion\'s body and human head likely represents Pharaoh Khafre guarding the sacred site.'
        }
      ],
      correctPositions: [
        { locationId: 'khufu', x: 47, y: 28 },
        { locationId: 'khafre', x: 45, y: 30 },
        { locationId: 'menkaure', x: 43, y: 32 },
        { locationId: 'sphinx', x: 50, y: 30 }
      ]
    }
  },
  {
    id: 'pyramid-locations-saqqara',
    type: 'location-match',
    title: 'Saqqara Necropolis',
    description: 'Map the evolution of the pyramid at Saqqara.',
    periodId: 'old-kingdom',
    difficulty: 'medium',
    points: 150,
    timeLimit: 120,
    category: 'game',
    data: {
      type: 'location-match',
      locations: [
        {
          id: 'djoser',
          name: 'Step Pyramid of Djoser',
          hint: 'The first pyramid ever built',
          discoveryLog: 'Designed by the legendary architect Imhotep, this revolutionized burial by stacking six stone mastabas. It is the earliest large-scale cut-stone structure in the world.'
        },
        {
          id: 'unas',
          name: 'Pyramid of Unas',
          hint: 'Smallest Old Kingdom pyramid, first with Pyramid Texts',
          discoveryLog: 'Though ruined on the outside, the interior walls are covered with the earliest known religious texts in history, intended to guide the King through the afterlife.'
        },
        {
          id: 'teti',
          name: 'Pyramid of Teti',
          hint: 'Founder of the 6th Dynasty',
          discoveryLog: 'Its substructure is remarkably well-preserved, featuring a vaulted ceiling decorated with stars, continuing the tradition of the sacred Pyramid Texts.'
        },
        {
          id: 'userkaf',
          name: 'Pyramid of Userkaf',
          hint: 'Founder of the 5th Dynasty',
          discoveryLog: 'This pyramid marked a shift in design, focusing more on the surrounding mortuary temple complex than the scale of the pyramid itself.'
        }
      ],
      correctPositions: [
        { locationId: 'djoser', x: 48, y: 32 },
        { locationId: 'unas', x: 47, y: 33 },
        { locationId: 'teti', x: 49, y: 31 },
        { locationId: 'userkaf', x: 49, y: 32 }
      ]
    }
  },
  {
    id: 'pyramid-locations-dahshur',
    type: 'location-match',
    title: 'The Royal Road',
    description: 'Identify the great pyramids along the southern road.',
    periodId: 'old-kingdom',
    difficulty: 'hard',
    points: 200,
    timeLimit: 120,
    category: 'game',
    data: {
      type: 'location-match',
      locations: [
        {
          id: 'bent',
          name: 'Bent Pyramid',
          hint: 'Sneferu\'s experimental angled pyramid',
          discoveryLog: 'Halfway through construction, the angle was changed from 54 to 43 degrees to prevent collapse, giving it its unique "bent" shape.'
        },
        {
          id: 'red',
          name: 'Red Pyramid',
          hint: 'The first successful smooth-sided pyramid',
          discoveryLog: 'The first successful smooth-sided pyramid in history. It gets its name from the rusty reddish hue of its exposed limestone core.'
        },
        {
          id: 'meidum',
          name: 'Meidum Pyramid',
          hint: 'The collapsed "onion" pyramid to the south',
          discoveryLog: 'Originally built as a step pyramid and then filled in to be smooth, it eventually partially collapsed, leaving only the core visible today.'
        },
        {
          id: 'amenemhat-iii',
          name: 'Black Pyramid',
          hint: 'A Middle Kingdom pyramid built of mudbrick',
          discoveryLog: 'A later experiment from the Middle Kingdom. Made of mudbrick instead of stone, it has suffered significantly from erosion over the millennia.'
        }
      ],
      correctPositions: [
        { locationId: 'bent', x: 46, y: 35 },
        { locationId: 'red', x: 46, y: 34 },
        { locationId: 'meidum', x: 46, y: 42 },
        { locationId: 'amenemhat-iii', x: 46, y: 36 }
      ]
    }
  },
  {
    id: 'old-kingdom-timeline',
    type: 'timeline-order',
    title: 'The Dawn of Kings',
    description: 'Arrange these Old Kingdom events in chronological order.',
    periodId: 'old-kingdom',
    difficulty: 'medium',
    points: 150,
    timeLimit: 90,
    category: 'game',
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
    id: 'middle-kingdom-timeline',
    type: 'timeline-order',
    title: 'The Pyramid Age',
    description: 'Order the great monumental achievements of the Middle Kingdom.',
    periodId: 'middle-kingdom',
    difficulty: 'medium',
    points: 150,
    timeLimit: 90,
    category: 'game',
    data: {
      type: 'timeline-order',
      events: [
        { id: 'm1', title: 'Mentuhotep II reunifies Egypt', hint: 'The 11th Dynasty begins the new era' },
        { id: 'm2', title: 'Amenemhat I founds Itjtawy', hint: 'A new capital for a new age' },
        { id: 'm3', title: 'Senusret III conquers Nubia', hint: 'The warrior king expands the borders' },
        { id: 'm4', title: 'Amenemhat III develops Faiyum', hint: 'Agricultural mastery and the Labyrinth' },
        { id: 'm5', title: '12th Dynasty ends', hint: 'The golden age fades into fragmentation' }
      ],
      correctOrder: ['m1', 'm2', 'm3', 'm4', 'm5']
    }
  },
  {
    id: 'liberation-timeline-game',
    type: 'timeline-order',
    title: 'The Golden Dynasty',
    description: 'Arrange the events of the war for liberation.',
    periodId: 'second-intermediate',
    difficulty: 'hard',
    points: 200,
    timeLimit: 120,
    category: 'game',
    data: {
      type: 'timeline-order',
      events: [
        { id: 'l1', title: 'Thebes rises against Hyksos', hint: 'The 17th Dynasty challenges the foreign kings' },
        { id: 'l2', title: 'Seqenenre Tao dies in battle', hint: 'A martyr for Egyptian freedom' },
        { id: 'l3', title: 'Kamose intercepting secret letters', hint: 'Revealing the alliance between enemies' },
        { id: 'l4', title: 'Ahmose I captures Avaris', hint: 'The final victory in the Delta' },
        { id: 'l5', title: 'The New Kingdom begins', hint: 'The era of the great empires starts' }
      ],
      correctOrder: ['l1', 'l2', 'l3', 'l4', 'l5']
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
        { id: 'imhotep', name: 'Imhotep', title: 'High Priest & Architect', period: 'Old Kingdom' },
        { id: 'hemiunu', name: 'Hemiunu', title: 'Royal Vizier', period: 'Old Kingdom' },
        { id: 'ptahhotep', name: 'Ptahhotep', title: 'City Administrator', period: 'Old Kingdom' },
        { id: 'harkhuf', name: 'Harkhuf', title: 'Governor of Upper Egypt', period: 'Old Kingdom' }
      ],
      achievements: [
        { id: 'a1', text: 'Pioneered the use of stone masonry to create the Step Pyramid.', figureId: 'imhotep', type: 'monument' },
        { id: 'a2', text: 'Coordinated the complex logistics for the Great Pyramid of Giza.', figureId: 'hemiunu', type: 'monument' },
        { id: 'a3', text: 'Authored the "Maxims," teaching social order and morality.', figureId: 'ptahhotep', type: 'wisdom' },
        { id: 'a4', text: 'Led four major trade expeditions into the heart of Africa.', figureId: 'harkhuf', type: 'deed' },
        { id: 'a5', text: 'Deified centuries after death as the patron of healers.', figureId: 'imhotep', type: 'wisdom' }
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
        { id: 'mentuhotep', name: 'Mentuhotep II', title: 'The Reunifier', period: 'Middle Kingdom' },
        { id: 'amenemhat-i', name: 'Amenemhat I', title: 'Dynasty Founder', period: 'Middle Kingdom' },
        { id: 'senusret-iii', name: 'Senusret III', title: 'The Divine Warrior', period: 'Middle Kingdom' },
        { id: 'amenemhat-iii', name: 'Amenemhat III', title: 'The Great Builder', period: 'Middle Kingdom' }
      ],
      achievements: [
        { id: 'mka1', text: 'Ended the civil war and founded the Middle Kingdom state.', figureId: 'mentuhotep', type: 'deed' },
        { id: 'mka2', text: 'Constructed the strategic capital of Itjtawy.', figureId: 'amenemhat-i', type: 'monument' },
        { id: 'mka3', text: 'Established the massive chain of Nubian mudbrick fortresses.', figureId: 'senusret-iii', type: 'monument' },
        { id: 'mka4', text: 'Oversaw the irrigation of the Faiyum and the "Labyrinth".', figureId: 'amenemhat-iii', type: 'deed' },
        { id: 'mka5', text: 'Subject of the "Instructions of Amenemhat" warning against betrayal.', figureId: 'amenemhat-i', type: 'wisdom' },
        { id: 'mka6', text: 'Created the unique terraced mortuary temple at Deir el-Bahri.', figureId: 'mentuhotep', type: 'monument' }
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
  type: 'sequence' | 'riddle' | 'decode' | 'choice' | 'logic-fragments';
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  data: SequencePuzzleData | RiddlePuzzleData | DecodePuzzleData | ChoicePuzzleData | LogicFragmentsData;
}

export interface SequencePuzzleData {
  type: 'sequence';
  panels: { id: string; image?: string; caption: string }[];
  correctOrder: string[];
}

export interface LogicFragmentsData {
  type: 'logic-fragments';
  clues: string[];
  fragments: { id: string; text: string }[];
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
    id: 'scribes-journal-1',
    storyId: 'great-expedition',
    type: 'logic-fragments',
    title: 'The Scribe\'s Lost Journal',
    description: 'Restore the logical flow of the scribe\'s account using the discovered clues.',
    difficulty: 'medium',
    points: 175,
    data: {
      type: 'logic-fragments',
      clues: [
        'The morning ritual at the Temple of Ptah always preceded the departure.',
        'The fleet encountered the first sandbank exactly three hours after sailing.',
        'The sun was directly overhead when the governor of the south greeted the fleet.'
      ],
      fragments: [
        { id: 'f1', text: 'The Pharaoh offered incense and libations to the Creator God.' },
        { id: 'f2', text: 'Thirty cedar-wood vessels pushed off into the heavy currents.' },
        { id: 'f3', text: 'A sudden grounding required the oarsmen to leap into the shallow waters.' },
        { id: 'f4', text: 'Shadows were at their shortest as the fleet docked at Elephantine.' }
      ],
      correctOrder: ['f1', 'f2', 'f3', 'f4']
    }
  },
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
