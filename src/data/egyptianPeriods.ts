// Egyptian Historical Periods Data - "Bring it Back to Life"
// Covering: Old Kingdom → First Intermediate → Middle Kingdom → Second Intermediate

export interface HistoricalLocation {
  id: string;
  name: string;
  egyptianName?: string;
  coordinates: { x: number; y: number }; // Percentage positions on map
  type: 'capital' | 'temple' | 'pyramid' | 'tomb' | 'city' | 'fortress' | 'quarry' | 'oasis';
  description: string;
  significance: string;
  keyFigures?: string[];
  artifacts?: string[];
  modernName?: string;
  explorable: boolean;
}

export interface HistoricalEvent {
  id: string;
  year: number; // BCE (negative for ancient dates, stored as positive)
  yearDisplay: string;
  title: string;
  description: string;
  type: 'political' | 'construction' | 'religious' | 'military' | 'cultural' | 'decline';
  locationId?: string;
  keyFigures?: string[];
  consequences: string[];
}

export interface HistoricalFigure {
  id: string;
  name: string;
  egyptianName?: string;
  title: string;
  reignStart?: number;
  reignEnd?: number;
  role: 'pharaoh' | 'queen' | 'vizier' | 'priest' | 'architect' | 'scribe' | 'general' | 'nomarch';
  achievements: string[];
  legacy: string;
  relatedLocations: string[];
}

export interface EgyptianPeriod {
  id: string;
  name: string;
  dynasties: string;
  startYear: number; // BCE
  endYear: number; // BCE
  yearRange: string;
  description: string;
  characteristics: string[];
  mapImage: string;
  locations: HistoricalLocation[];
  events: HistoricalEvent[];
  figures: HistoricalFigure[];
  stories: string[]; // References to story IDs
  color: string;
  icon: string; // Hieroglyph
}

export const egyptianPeriods: EgyptianPeriod[] = [
  {
    id: 'old-kingdom',
    name: 'Old Kingdom',
    dynasties: '3rd - 6th Dynasty',
    startYear: 2686,
    endYear: 2181,
    yearRange: '2686 - 2181 BCE',
    description: 'The Age of the Pyramids - a time of unprecedented royal power, monumental construction, and the establishment of Egypt as a unified civilization. The pharaohs were living gods, and their tombs would touch the heavens.',
    characteristics: [
      'Centralized divine kingship',
      'Pyramid construction at its peak',
      'Elaborate mortuary cults',
      'Development of hieratic script',
      'Strong central administration',
      'Expedition to Nubia and Sinai'
    ],
    mapImage: '/maps/egypt-background.png',
    color: 'from-gold to-gold-dark',
    icon: '𓇳',
    locations: [
      {
        id: 'memphis',
        name: 'Memphis',
        egyptianName: 'Ineb-Hedj (White Walls)',
        coordinates: { x: 52.5, y: 32.2 },
        type: 'capital',
        description: 'The eternal capital of the Old Kingdom, founded by Menes. A city of gleaming white walls where the god Ptah was worshipped as creator of all things.',
        significance: 'Administrative and religious center of unified Egypt. Home to the High Priests of Ptah.',
        keyFigures: ['Imhotep', 'Ptahhotep'],
        artifacts: ['Statue of Ramesses II', 'Alabaster Sphinx'],
        modernName: 'Mit Rahina',
        explorable: true
      },
      {
        id: 'giza',
        name: 'Giza Necropolis',
        egyptianName: 'Rostau',
        coordinates: { x: 48.2, y: 29.5 },
        type: 'pyramid',
        description: 'The plateau where the greatest monuments of human civilization rose - the pyramids of Khufu, Khafre, and Menkaure, guarded eternally by the Great Sphinx.',
        significance: 'Royal necropolis containing the only surviving Wonder of the Ancient World.',
        keyFigures: ['Khufu', 'Khafre', 'Menkaure', 'Hemiunu'],
        artifacts: ['Solar Barque', 'Khufu Ship', 'The Great Sphinx'],
        modernName: 'Giza',
        explorable: true
      },
      {
        id: 'saqqara',
        name: 'Saqqara',
        coordinates: { x: 50.5, y: 34.1 },
        type: 'pyramid',
        description: 'The vast necropolis where Imhotep built the first pyramid for King Djoser - the Step Pyramid that revolutionized Egyptian architecture forever.',
        significance: 'Contains the oldest stone structure and earliest pyramid. Burial ground for nobles across millennia.',
        keyFigures: ['Djoser', 'Imhotep', 'Unas', 'Userkaf'],
        artifacts: ['Pyramid Texts', 'Serapeum'],
        modernName: 'Saqqara',
        explorable: true
      },
      {
        id: 'heliopolis',
        name: 'Heliopolis',
        egyptianName: 'Iunu',
        coordinates: { x: 56.5, y: 26.8 },
        type: 'temple',
        description: 'The City of the Sun, where Ra was worshipped as supreme deity. Its obelisks caught the first rays of dawn, connecting heaven and earth.',
        significance: 'Most important religious center. Origin of the creation myth and solar theology.',
        keyFigures: ['High Priests of Ra', 'Userkaf'],
        artifacts: ['Benben Stone (prototype)', 'Obelisks of Senusret I (later)'],
        modernName: 'Cairo (Ain Shams)',
        explorable: true
      },
      {
        id: 'abydos-ok',
        name: 'Abydos',
        egyptianName: 'Abdju',
        coordinates: { x: 46, y: 65.5 },
        type: 'tomb',
        description: 'Sacred burial ground of the earliest kings and cult center of Osiris. Egyptians believed the entrance to the underworld lay here.',
        significance: 'Pilgrimage destination and burial site of first dynasty pharaohs.',
        keyFigures: ['Early Dynasty Kings', 'Khenty-Amentiu (deity)', 'Osiris (later)'],
        artifacts: ['Abydos King List (later)'],
        explorable: true
      },
      {
        id: 'elephantine',
        name: 'Elephantine',
        egyptianName: 'Abu',
        coordinates: { x: 49.5, y: 95.2 },
        type: 'fortress',
        description: "Island fortress at Egypt's southern frontier, gateway to Nubia and the source of the Nile flood. Temple of Khnum who shaped humans on his potter's wheel.",
        significance: 'Trading post and military garrison. Nilometer to measure flood levels.',
        modernName: 'Aswan',
        keyFigures: ['Harkhuf'],
        explorable: true
      },
      {
          id: 'dashur',
          name: 'Dahshur',
          coordinates: { x: 51.2, y: 36.5 },
          type: 'pyramid',
          description: 'Royal necropolis south of Saqqara, featuring the Bent and Red Pyramids of Sneferu, representing crucial steps in pyramid evolution.',
          significance: 'Key site for understanding the transition from step to true pyramid design.',
          keyFigures: ['Sneferu'],
          artifacts: ['Bent Pyramid', 'Red Pyramid'],
          modernName: 'Dahshur',
          explorable: true
        },
        {
          id: 'abusir',
          name: 'Abusir',
          coordinates: { x: 49.1, y: 31.3 },
          type: 'pyramid',
          description: 'Necropolis of the 5th Dynasty, known for its smaller, less costly pyramids and beautifully decorated sun temples dedicated to Ra.',
          significance: 'Marks the shift from massive pyramids to a greater focus on solar worship.',
          keyFigures: ['Userkaf', 'Sahure', 'Nyuserre Ini'],
          artifacts: ['Abusir Papyri'],
          modernName: 'Abusir',
          explorable: true
        },
        {
          id: 'wadi-al-jarf',
          name: 'Wadi al-Jarf',
          coordinates: { x: 80.5, y: 45.3 },
          type: 'city',
          description: "The world's oldest known artificial harbor, used during Khufu's reign for expeditions across the Red Sea to quarry copper and turquoise in Sinai.",
          significance: 'Provides evidence of Old Kingdom seafaring and state organization.',
          keyFigures: ['Khufu', 'Inspector Merer'],
          artifacts: ['Diary of Merer (papyrus logs)'],
          modernName: 'Wadi al-Jarf',
          explorable: true
        }
    ],
    events: [
      {
        id: 'unification-legacy',
        year: 2686,
        yearDisplay: 'c. 2686 BCE',
        title: 'Dawn of the Old Kingdom',
        description: 'The Third Dynasty begins under King Djoser, ushering in an era of monumental stone construction and divine kingship.',
        type: 'political',
        locationId: 'memphis',
        keyFigures: ['Djoser'],
        consequences: ['Centralization of power', 'Beginning of pyramid age', 'Rise of the vizier office']
      },
      {
        id: 'step-pyramid',
        year: 2670,
        yearDisplay: 'c. 2670 BCE',
        title: 'The Step Pyramid Rises',
        description: 'Architect Imhotep designs and constructs the Step Pyramid at Saqqara - the first monumental stone building in history.',
        type: 'construction',
        locationId: 'saqqara',
        keyFigures: ['Djoser', 'Imhotep'],
        consequences: ['Revolution in architecture', 'Stone masonry techniques developed', 'Imhotep later deified']
      },
      {
          id: 'bent-pyramid-phase',
          year: 2600,
          yearDisplay: 'c. 2600 BCE',
          title: 'The Bent Pyramid Experiment',
          description: "At Dahshur, Sneferu's architects change the pyramid's angle mid-construction, creating a unique bent shape. This represents a critical learning phase.",
          type: 'construction',
          locationId: 'dashur',
          keyFigures: ['Sneferu'],
          consequences: ['Advances in structural engineering', 'First attempt at a smooth-sided pyramid', 'Leads directly to the Red Pyramid design']
      },
      {
        id: 'great-pyramid',
        year: 2560,
        yearDisplay: 'c. 2560 BCE',
        title: 'The Great Pyramid Completed',
        description: 'After 20 years of construction, the Great Pyramid of Khufu is completed at Giza, containing 2.3 million stone blocks.',
        type: 'construction',
        locationId: 'giza',
        keyFigures: ['Khufu', 'Hemiunu'],
        consequences: ['Pinnacle of pyramid construction', 'Massive state resources devoted to afterlife', 'Wonder of the Ancient World']
      },
      {
          id: 'sun-temples',
          year: 2480,
          yearDisplay: 'c. 2480 BCE',
          title: 'Rise of the Sun Temples',
          description: 'Fifth Dynasty pharaohs, starting with Userkaf, build dedicated sun temples at Abusir, reflecting the growing power of the cult of Ra.',
          type: 'religious',
          locationId: 'abusir',
          keyFigures: ['Userkaf'],
          consequences: ['Shift in religious focus from pharaoh to sun god', 'New temple architecture developed', 'Increased political power of Heliopolis priests']
        },
      {
        id: 'pyramid-texts',
        year: 2375,
        yearDisplay: 'c. 2375 BCE',
        title: 'The Pyramid Texts Inscribed',
        description: 'King Unas orders the first Pyramid Texts carved into his burial chamber - the oldest religious texts in the world.',
        type: 'religious',
        locationId: 'saqqara',
        keyFigures: ['Unas'],
        consequences: ['Preservation of religious beliefs', 'Foundation for later funerary literature', 'Insight into Old Kingdom theology']
      },
      {
        id: 'old-kingdom-collapse',
        year: 2181,
        yearDisplay: 'c. 2181 BCE',
        title: 'Collapse of Central Authority',
        description: 'The death of Pepi II after 94 years of rule leads to the fragmentation of Egypt. Regional governors seize power as famine strikes.',
        type: 'decline',
        keyFigures: ['Pepi II'],
        consequences: ['End of Old Kingdom', 'Rise of regional nomarchs', 'Beginning of First Intermediate Period']
      }
    ],
    figures: [
      {
        id: 'djoser',
        name: 'Djoser',
        egyptianName: 'Netjerikhet',
        title: 'Pharaoh of the Third Dynasty',
        reignStart: 2686,
        reignEnd: 2649,
        role: 'pharaoh',
        achievements: ['Commissioned the Step Pyramid', 'Expanded Egyptian territory to Sinai', 'Established Memphis as administrative center'],
        legacy: 'Remembered as founder of the pyramid age and patron of the great architect Imhotep.',
        relatedLocations: ['memphis', 'saqqara']
      },
      {
          id: 'sneferu',
          name: 'Sneferu',
          egyptianName: 'Sneferu (He of Beauty)',
          title: 'Founder of the 4th Dynasty',
          reignStart: 2613,
          reignEnd: 2589,
          role: 'pharaoh',
          achievements: ['Built three pyramids (Meidum, Bent, Red)', 'Perfected the true pyramid design', 'Launched campaigns into Nubia and Libya', 'Promoted trade'],
          legacy: 'The greatest pyramid builder in Egyptian history, remembered as a benevolent king.',
          relatedLocations: ['dashur', 'meidum']
      },
      {
        id: 'imhotep',
        name: 'Imhotep',
        egyptianName: 'Ii-m-ḥtp (He who comes in peace)',
        title: 'Vizier, Architect, Physician',
        role: 'architect',
        achievements: ['Designed the Step Pyramid', 'Pioneered stone masonry', 'Founded Egyptian medicine', 'Authored wisdom literature'],
        legacy: 'Deified two thousand years after death. Identified with Greek Asclepius.',
        relatedLocations: ['memphis', 'saqqara']
      },
      {
        id: 'khufu',
        name: 'Khufu',
        egyptianName: 'Khnum-Khufu',
        title: 'Pharaoh of the Fourth Dynasty',
        reignStart: 2589,
        reignEnd: 2566,
        role: 'pharaoh',
        achievements: ['Built the Great Pyramid of Giza', 'Organized massive labor force', 'Established efficient state bureaucracy'],
        legacy: 'Builder of the only surviving Wonder of the Ancient World.',
        relatedLocations: ['giza', 'memphis', 'wadi-al-jarf']
      },
      {
          id: 'hemiunu',
          name: 'Hemiunu',
          title: 'Vizier to Khufu',
          role: 'vizier',
          achievements: ['Presumed architect of the Great Pyramid', 'Managed the largest construction project of the ancient world', 'His statue is a masterpiece of Old Kingdom realism'],
          legacy: 'The brilliant mind behind the most perfect pyramid ever built.',
          relatedLocations: ['giza']
        },
      {
        id: 'ptahhotep',
        name: 'Ptahhotep',
        title: 'Vizier under Djedkare Isesi',
        role: 'vizier',
        achievements: ['Authored The Instructions of Ptahhotep', 'Served as chief judge', 'Administered the treasury'],
        legacy: 'His wisdom literature remains one of the oldest complete works of philosophy.',
        relatedLocations: ['memphis', 'saqqara']
      },
      {
          id: 'unas',
          name: 'Unas',
          title: 'Last Pharaoh of the 5th Dynasty',
          reignStart: 2375,
          reignEnd: 2345,
          role: 'pharaoh',
          achievements: ['First to inscribe Pyramid Texts in his tomb', 'His causeway at Saqqara depicts scenes of famine, possibly foreshadowing decline'],
          legacy: 'Initiated the tradition of funerary texts that would define Egyptian religion for millennia.',
          relatedLocations: ['saqqara']
        }
    ],
    stories: ['pyramid-builders', 'imhotep-vision', 'khufus-secret']
  },
  {
    id: 'first-intermediate',
    name: 'First Intermediate Period',
    dynasties: '7th - 11th Dynasty (early)',
    startYear: 2181,
    endYear: 2055,
    yearRange: '2181 - 2055 BCE',
    description: 'The Dark Age of Chaos - central authority collapsed as rival dynasties fought for supremacy. Nomarchs became warlords, famine swept the land, and Egyptians questioned whether the gods had abandoned them.',
    characteristics: [
      'Political fragmentation',
      'Rise of regional powers',
      'Heracleopolitan-Theban rivalry',
      'Development of coffin texts',
      'Democratization of afterlife beliefs',
      'Social upheaval and famine'
    ],
    mapImage: '/maps/egypt-background.png',
    color: 'from-terracotta to-destructive',
    icon: '𓆣',
    locations: [
      {
          id: 'heracleopolis',
          name: 'Heracleopolis',
          egyptianName: 'Henen-nesut',
          coordinates: { x: 50.2, y: 42.5 },
          type: 'capital',
          description: 'Capital of the northern kingdom during the civil war. The Heracleopolitan kings claimed legitimacy as successors to Memphis.',
          significance: 'Seat of the 9th and 10th Dynasties who controlled Lower Egypt.',
          keyFigures: ['Kheti I', 'Merikare'],
          modernName: 'Ihnasya el-Medina',
          explorable: true
        },
        {
          id: 'thebes-fip',
          name: 'Thebes',
          egyptianName: 'Waset',
          coordinates: { x: 44.2, y: 76.3 },
          type: 'capital',
          description: 'The rising southern power that would eventually reunify Egypt. Home to the warrior kings who worshipped Amun.',
          significance: 'Seat of the 11th Dynasty. Future religious capital of Egypt.',
          keyFigures: ['Intef I', 'Intef II', 'Mentuhotep II'],
          modernName: 'Luxor',
          explorable: true
        },
        {
          id: 'asyut',
          name: 'Asyut',
          egyptianName: 'Sauty',
          coordinates: { x: 48.1, y: 58.4 },
          type: 'city',
          description: 'Frontier town caught between the warring kingdoms. Its nomarchs played both sides, leaving behind tombs that reveal the chaos of the age.',
          significance: 'Strategic buffer zone. Tomb autobiographies describe the famine and warfare.',
          keyFigures: ['Kheti II of Asyut', 'Tefibi'],
          modernName: 'Asyut',
          explorable: true
        },
        {
          id: 'moalla',
          name: 'Moalla',
          coordinates: { x: 45.3, y: 79.1 },
          type: 'tomb',
          description: 'Site of the tomb of Ankhtifi, a nomarch whose inscriptions describe the desperate famine: "All of Upper Egypt was dying of hunger."',
          significance: 'Primary source for understanding the First Intermediate Period crisis.',
          keyFigures: ['Ankhtifi'],
          explorable: true
        },
        {
          id: 'dendera-fip',
          name: 'Dendera',
          egyptianName: 'Iunet',
          coordinates: { x: 47.1, y: 72.8 },
          type: 'temple',
          description: 'While the great temple was yet to be built, Dendera remained a key religious site, with local rulers asserting their piety and power during this fragmented time.',
          significance: 'Continuity of religious practice. Nomarchs began to take on roles once reserved for the king.',
          artifacts: ['False doors of local officials'],
          modernName: 'Dendera',
          explorable: true
        }
    ],
    events: [
      {
        id: 'famine-crisis',
        year: 2180,
        yearDisplay: 'c. 2180 BCE',
        title: 'The Great Famine',
        description: 'Low Nile floods cause widespread famine. The inscription of Ankhtifi records: "The entire south was dying of hunger, people eating their own children."',
        type: 'decline',
        locationId: 'moalla',
        keyFigures: ['Ankhtifi'],
        consequences: ['Mass starvation', 'Collapse of social order', 'Nomarchs seize grain stores', 'Migration to provincial centers']
      },
      {
        id: 'heracleopolis-rise',
        year: 2160,
        yearDisplay: 'c. 2160 BCE',
        title: 'Heracleopolitan Kingdom Established',
        description: 'The 9th Dynasty establishes control over Lower and Middle Egypt from Heracleopolis, claiming the legacy of Memphis.',
        type: 'political',
        locationId: 'heracleopolis',
        keyFigures: ['Kheti I'],
        consequences: ['Partial restoration of order in the north', 'Conflict with Theban south inevitable']
      },
      {
        id: 'thebes-rises',
        year: 2134,
        yearDisplay: 'c. 2134 BCE',
        title: 'Rise of the Theban 11th Dynasty',
        description: 'Intef I declares himself king at Thebes, founding a dynasty that will eventually reunify Egypt.',
        type: 'political',
        locationId: 'thebes-fip',
        keyFigures: ['Intef I'],
        consequences: ['Two-kingdom Egypt', 'Cult of Amun begins to rise', 'Military buildup in the south']
      },
      {
        id: 'teachings-merikare',
        year: 2100,
        yearDisplay: 'c. 2100 BCE',
        title: 'The Teachings for Merikare',
        description: "A Heracleopolitan king composes advice for his son, reflecting on the failures of his reign and the importance of Ma'at.",
        type: 'cultural',
        locationId: 'heracleopolis',
        keyFigures: ['Merikares Father', 'Merikare'],
        consequences: ['Important wisdom literature preserved', 'Insight into royal ideology during chaos']
      },
      {
          id: 'coffin-texts-dev',
          year: 2150,
          yearDisplay: 'c. 2150 BCE',
          title: 'Development of Coffin Texts',
          description: 'As wealth and status become more distributed, the afterlife is democratized. Magical spells once exclusive to pyramids are now written on coffins for those who can afford them.',
          type: 'religious',
          consequences: ['Democratization of the afterlife', 'Personalization of religious beliefs', 'Foundation for the Book of the Dead']
        }
    ],
    figures: [
      {
        id: 'ankhtifi',
        name: 'Ankhtifi',
        title: 'Nomarch of Hierakonpolis and Edfu',
        role: 'nomarch',
        achievements: ['Saved his nomes from famine', 'Expanded territory through warfare', 'Left detailed autobiographical tomb inscriptions'],
        legacy: 'His tomb provides the most vivid account of the First Intermediate Period chaos.',
        relatedLocations: ['moalla']
      },
      {
        id: 'intef-i',
        name: 'Intef I',
        egyptianName: 'Sehertawy Intef',
        title: 'Founder of the Theban 11th Dynasty',
        reignStart: 2134,
        reignEnd: 2118,
        role: 'pharaoh',
        achievements: ['Declared independence from Heracleopolis', 'United Upper Egypt under Theban rule', 'Established Thebes as a royal seat'],
        legacy: 'Founder of the line that would reunify Egypt.',
        relatedLocations: ['thebes-fip']
      },
      {
          id: 'intef-ii',
          name: 'Intef II',
          egyptianName: 'Wahankh Intef',
          title: 'Theban King',
          reignStart: 2118,
          reignEnd: 2069,
          role: 'pharaoh',
          achievements: ['Ruled for nearly 50 years', 'Fought wars against Heracleopolis and their allies in Asyut', 'Extended Theban control north to Abydos'],
          legacy: 'Solidified Theban power, paving the way for eventual reunification.',
          relatedLocations: ['thebes-fip', 'abydos-ok']
        },
      {
        id: 'merikare',
        name: 'Merikare',
        title: 'Pharaoh of the 10th Dynasty',
        role: 'pharaoh',
        achievements: ['Maintained northern kingdom against Thebes', 'Recipient of famous wisdom text', 'Defended the northern border near Asyut'],
        legacy: 'The teachings written for him became a classic of Egyptian literature, studied for centuries.',
        relatedLocations: ['heracleopolis', 'asyut']
      }
    ],
    stories: ['ankhtifi-famine', 'two-kingdoms-war', 'merikare-wisdom']
  },
  {
    id: 'middle-kingdom',
    name: 'Middle Kingdom',
    dynasties: '11th (late) - 13th Dynasty',
    startYear: 2055,
    endYear: 1650,
    yearRange: '2055 - 1650 BCE',
    description: 'The Classical Age of Egyptian literature and art. Reunified by Mentuhotep II, Egypt entered a golden age of prosperity, expanding trade networks, and refined culture. The common person could now aspire to eternal life.',
    characteristics: [
      'Reunification under Thebes',
      'Classical literature flourishes',
      'Democratization of afterlife',
      'Expansion into Nubia',
      'Faiyum development',
      'Fortification of borders'
    ],
    mapImage: '/maps/egypt-background.png',
    color: 'from-lapis to-turquoise',
    icon: '𓋹',
    locations: [
      {
          id: 'thebes-mk',
          name: 'Thebes',
          egyptianName: 'Waset',
          coordinates: { x: 44.2, y: 76.3 },
          type: 'capital',
          description: 'Now the religious heart of reunified Egypt. The great temple of Amun at Karnak began its transformation into the largest religious complex ever built.',
          significance: 'Religious capital. Cult center of Amun who would become king of the gods.',
          keyFigures: ['Mentuhotep II', 'Senusret I', 'Amun priesthood'],
          modernName: 'Luxor',
          explorable: true
        },
        {
          id: 'itjtawy',
          name: 'Itjtawy',
          egyptianName: 'Itj-tawy (Seizer of the Two Lands)',
          coordinates: { x: 51.5, y: 38.2 },
          type: 'capital',
          description: 'The new administrative capital founded by Amenemhat I, strategically located between Upper and Lower Egypt to control the unified kingdom.',
          significance: 'Political capital of the 12th Dynasty. Symbol of renewed unity.',
          keyFigures: ['Amenemhat I', 'Senusret I'],
          modernName: 'Near Lisht',
          explorable: true
        },
        {
          id: 'deir-el-bahri',
          name: 'Deir el-Bahri',
          egyptianName: 'Djeser-djeseru',
          coordinates: { x: 42.5, y: 76.1 },
          type: 'temple',
          description: "Site of Mentuhotep II's revolutionary mortuary temple, carved into the cliffs opposite Thebes - a design that would inspire Hatshepsut centuries later.",
          significance: 'First great temple of the Middle Kingdom. New architectural vision.',
          keyFigures: ['Mentuhotep II'],
          explorable: true
        },
        {
          id: 'faiyum-oasis',
          name: 'The Faiyum',
          egyptianName: 'She-resy (Southern Lake)',
          coordinates: { x: 44.5, y: 40.8 },
          type: 'oasis',
          description: "A vast oasis transformed by the 12th Dynasty into Egypt's breadbasket through massive irrigation projects and land reclamation.",
          significance: 'Agricultural development. Cult center of the crocodile god Sobek.',
          keyFigures: ['Amenemhat III'],
          modernName: 'Faiyum',
          explorable: true
        },
        {
          id: 'buhen',
          name: 'Buhen Fortress',
          coordinates: { x: 40.3, y: 92.5 },
          type: 'fortress',
          description: 'Massive mud-brick fortress in Nubia with walls 5 meters thick and elaborate defensive systems. Part of a chain of fortresses controlling access to gold and trade.',
          significance: 'Military control of Nubia. Protection of gold mining operations.',
          keyFigures: ['Senusret III'],
          explorable: true
        },
        {
          id: 'serabit-el-khadim',
          name: 'Serabit el-Khadim',
          coordinates: { x: 88.2, y: 40.5 },
          type: 'quarry',
          description: "A remote mining site in the Sinai Peninsula, where Egyptians quarried turquoise. It features a unique temple to Hathor, Lady of Turquoise.",
          significance: 'Source of precious turquoise. Site of early proto-Sinaitic script, an ancestor of the alphabet.',
          keyFigures: ['Senusret I'],
          artifacts: ['Proto-Sinaitic inscriptions'],
          explorable: true
        },
        {
          id: 'beni-hasan',
          name: 'Beni Hasan',
          coordinates: { x: 50.1, y: 50.2 },
          type: 'tomb',
          description: 'Rock-cut tombs of powerful nomarchs from the Middle Kingdom, famous for their vibrant paintings depicting daily life, wrestling, and military training.',
          significance: 'Provides detailed insight into the lives of provincial elites.',
          keyFigures: ['Khnumhotep II'],
          artifacts: ['Famous wrestling scene painting'],
          modernName: 'Beni Hasan',
          explorable: true
        }
    ],
    events: [
      {
        id: 'reunification',
        year: 2055,
        yearDisplay: 'c. 2055 BCE',
        title: 'Egypt Reunified',
        description: 'Mentuhotep II defeats the last Heracleopolitan king and reunifies Egypt after over a century of division, beginning the Middle Kingdom.',
        type: 'political',
        locationId: 'thebes-mk',
        keyFigures: ['Mentuhotep II'],
        consequences: ['End of civil war', 'Thebes becomes supreme', 'Cultural renaissance begins']
      },
      {
        id: 'twelfth-dynasty',
        year: 1985,
        yearDisplay: 'c. 1985 BCE',
        title: '12th Dynasty Established',
        description: 'Vizier Amenemhat seizes power (possibly through assassination) and founds the 12th Dynasty, moving the capital north to Itjtawy.',
        type: 'political',
        locationId: 'itjtawy',
        keyFigures: ['Amenemhat I'],
        consequences: ['New royal line', 'Administrative reforms', 'Co-regency system introduced']
      },
      {
        id: 'sinuhe-story',
        year: 1950,
        yearDisplay: 'c. 1950 BCE',
        title: 'The Story of Sinuhe Composed',
        description: "The greatest work of Egyptian literature is composed, telling of a courtier who flees Egypt after Amenemhat I's assassination.",
        type: 'cultural',
        keyFigures: ['Senusret I'],
        consequences: ['Masterpiece of world literature', 'Copied for centuries', 'Insight into Egyptian values']
      },
      {
        id: 'nubian-campaigns',
        year: 1864,
        yearDisplay: 'c. 1864 BCE',
        title: 'Senusret III Conquers Nubia',
        description: 'The warrior pharaoh Senusret III launches devastating campaigns into Nubia, establishing the border at the Second Cataract and building massive fortresses like Buhen.',
        type: 'military',
        locationId: 'buhen',
        keyFigures: ['Senusret III'],
        consequences: ['Control of Nubian gold routes', 'Chain of 17 fortresses built', 'Senusret III deified in Nubia']
      },
      {
        id: 'faiyum-development',
        year: 1850,
        yearDisplay: 'c. 1850 BCE',
        title: 'The Faiyum Transformed',
        description: 'Amenemhat III undertakes massive irrigation works in the Faiyum, creating a vast agricultural region and building his pyramid complex, the Labyrinth, at Hawara.',
        type: 'construction',
        locationId: 'faiyum-oasis',
        keyFigures: ['Amenemhat III'],
        consequences: ['Agricultural surplus', 'Population growth', 'Labyrinth temple becomes legendary']
      },
      {
          id: 'thirteenth-dynasty-decline',
          year: 1803,
          yearDisplay: 'c. 1803 BCE',
          title: 'Slow Decline of the 13th Dynasty',
          description: 'Following the powerful 12th Dynasty, the 13th Dynasty is marked by a rapid succession of short-reigning kings, signaling a weakening of central power.',
          type: 'decline',
          locationId: 'itjtawy',
          consequences: ['Loss of control over southern territories', 'Rise of independent rulers in the Delta', 'Vulnerability to foreign influence']
        }
    ],
    figures: [
      {
        id: 'mentuhotep-ii',
        name: 'Mentuhotep II',
        egyptianName: 'Nebhepetre Mentuhotep',
        title: 'Reunifier of Egypt',
        reignStart: 2055,
        reignEnd: 2004,
        role: 'pharaoh',
        achievements: ['Reunified Egypt after the FIP', 'Built innovative mortuary temple at Deir el-Bahri', 'Campaigned in Nubia and Libya', 'Restored royal authority'],
        legacy: 'Honored as the second founder of Egypt, alongside Menes.',
        relatedLocations: ['thebes-mk', 'deir-el-bahri']
      },
      {
        id: 'amenemhat-i',
        name: 'Amenemhat I',
        title: 'Founder of the 12th Dynasty',
        reignStart: 1991,
        reignEnd: 1962,
        role: 'pharaoh',
        achievements: ['Founded new capital Itjtawy', 'Introduced co-regency', 'Stabilized borders', 'Composed propaganda text "Instructions of Amenemhat"'],
        legacy: 'Established the most powerful and stable dynasty of the Middle Kingdom.',
        relatedLocations: ['itjtawy']
      },
      {
          id: 'senusret-i',
          name: 'Senusret I',
          egyptianName: 'Kheperkare Senusret',
          title: 'Patron of the Arts',
          reignStart: 1971,
          reignEnd: 1926,
          role: 'pharaoh',
          achievements: ['Oversaw a golden age of art and literature', 'Built the White Chapel at Karnak', 'Conducted expeditions to Sinai and Wadi Hammamat'],
          legacy: 'His reign is considered the peak of Middle Kingdom classical culture.',
          relatedLocations: ['itjtawy', 'thebes-mk', 'serabit-el-khadim']
        },
      {
        id: 'senusret-iii',
        name: 'Senusret III',
        egyptianName: 'Khakaure Senusret',
        title: 'Warrior Pharaoh',
        reignStart: 1878,
        reignEnd: 1839,
        role: 'pharaoh',
        achievements: ['Conquered Nubia and built massive fortresses', 'Reformed administration, curtailing nomarch power', 'Led first Egyptian campaign into the Levant'],
        legacy: 'Deified in Nubia. His striking, world-weary statues are famous. Became the basis for the Greek legend of Sesostris.',
        relatedLocations: ['buhen', 'itjtawy', 'abydos-ok']
      },
      {
        id: 'amenemhat-iii',
        name: 'Amenemhat III',
        egyptianName: 'Nimaatre Amenemhat',
        title: 'Master of the Faiyum',
        reignStart: 1860,
        reignEnd: 1814,
        role: 'pharaoh',
        achievements: ["Developed the Faiyum oasis into Egypt's breadbasket", 'Built two pyramids (at Dahshur and Hawara)', 'Constructed the legendary Labyrinth temple'],
        legacy: 'His reign marked the economic peak of the Middle Kingdom.',
        relatedLocations: ['faiyum-oasis', 'dashur']
      }
    ],
    stories: ['sinuhe-tale', 'shipwrecked-sailor', 'eloquent-peasant', 'senusret-conquest']
  },
  {
    id: 'second-intermediate',
    name: 'Second Intermediate Period',
    dynasties: '14th - 17th Dynasty',
    startYear: 1782,
    endYear: 1550,
    yearRange: '1782 - 1550 BCE',
    description: 'The Age of the Hyksos - foreign rulers from the East who introduced the horse, chariot, and new weapons to Egypt. While Lower Egypt fell under their control, Theban kings plotted liberation in the south.',
    characteristics: [
      'Hyksos rule in the Delta',
      'Theban resistance in Upper Egypt',
      'Introduction of horse and chariot',
      'New military technology',
      'Nubian Kingdom of Kush rises',
      'Wars of liberation'
    ],
    mapImage: '/maps/egypt-background.png',
    color: 'from-scarab to-lapis-deep',
    icon: '𓃭',
    locations: [
      {
          id: 'avaris',
          name: 'Avaris',
          egyptianName: 'Hatwaret',
          coordinates: { x: 68.5, y: 24.3 },
          type: 'capital',
          description: 'Capital of the Hyksos rulers in the eastern Delta. A cosmopolitan city blending Egyptian and Near Eastern cultures, with a great temple to Seth-Baal.',
          significance: 'Hyksos royal seat. Trading hub connecting Egypt to the Levant.',
          keyFigures: ['Apepi', 'Khyan', 'Sakir-Har'],
          modernName: 'Tell el-Daba',
          explorable: true
        },
        {
          id: 'thebes-sip',
          name: 'Thebes',
          egyptianName: 'Waset',
          coordinates: { x: 44.2, y: 76.3 },
          type: 'capital',
          description: "The defiant southern capital where the 17th Dynasty kings planned their war of liberation against the Hyksos. Tomb of Ahmose I marks the city's triumph.",
          significance: 'Base of Egyptian resistance. Future imperial capital.',
          keyFigures: ['Seqenenre Tao', 'Kamose', 'Ahmose I', 'Ahhotep I'],
          modernName: 'Luxor',
          explorable: true
        },
        {
          id: 'kerma',
          name: 'Kerma',
          coordinates: { x: 35.5, y: 98.2 },
          type: 'capital',
          description: 'Capital of the powerful Nubian Kingdom of Kush, which allied with the Hyksos against Thebes, threatening Egypt from the south.',
          significance: 'Major African kingdom. Rival to Egyptian power.',
          keyFigures: ['Nedjeh', 'Awawet'],
          artifacts: ['Kerma Ware (pottery)', 'Deffufa (mudbrick temples)'],
          explorable: true
        },
        {
          id: 'deir-el-ballas',
          name: 'Deir el-Ballas',
          coordinates: { x: 43.1, y: 73.5 },
          type: 'city',
          description: 'Forward military base of the Theban kings, positioned to launch the war against the Hyksos. Palaces and barracks prepared the liberation army.',
          significance: 'Staging ground for the expulsion of the Hyksos.',
          keyFigures: ['Kamose', 'Ahmose I'],
          explorable: true
        },
        {
          id: 'sharuhen',
          name: 'Sharuhen',
          coordinates: { x: 88.8, y: 10.5 },
          type: 'fortress',
          description: "A Hyksos stronghold in southern Canaan that was besieged by Ahmose I for three years after the fall of Avaris.",
          significance: "Represents the final phase of the war of liberation, extending into Asia.",
          keyFigures: ['Ahmose I'],
          modernName: "Tell el-Ajjul or Tell el-Far'ah (South)",
          explorable: true
        }
    ],
    events: [
      {
        id: 'hyksos-takeover',
        year: 1650,
        yearDisplay: 'c. 1650 BCE',
        title: 'The Hyksos Seize Power',
        description: 'The 15th Dynasty Hyksos kings establish control over the Delta and Memphis, ruling from Avaris and introducing new military technology.',
        type: 'political',
        locationId: 'avaris',
        consequences: ['Egypt divided', 'New weapons introduced', 'Horse and chariot arrive', 'Cultural exchange with Near East']
      },
      {
        id: 'kush-alliance',
        year: 1600,
        yearDisplay: 'c. 1600 BCE',
        title: 'Hyksos-Kush Alliance',
        description: 'The Hyksos in the north and the Kingdom of Kush in the south form a strategic alliance, effectively encircling the native Egyptian kingdom based at Thebes.',
        type: 'military',
        locationId: 'kerma',
        consequences: ['Thebes caught between two powerful enemies', 'Trade routes for Thebes are cut off', 'Increased military pressure on the 17th Dynasty']
      },
      {
        id: 'seqenenre-death',
        year: 1558,
        yearDisplay: 'c. 1558 BCE',
        title: 'Death of Seqenenre Tao',
        description: 'The Theban king Seqenenre Tao dies violently, his skull showing multiple battle wounds. A quarrel over hippos may have sparked open war with the Hyksos.',
        type: 'military',
        locationId: 'thebes-sip',
        keyFigures: ['Seqenenre Tao', 'Apepi'],
        consequences: ['Open warfare begins', 'Theban resolve strengthened', 'His son Kamose continues the fight']
      },
      {
        id: 'kamose-campaigns',
        year: 1555,
        yearDisplay: 'c. 1555 BCE',
        title: "Kamose's War",
        description: "King Kamose launches his famous campaigns against the Hyksos, intercepting a messenger between Avaris and Kush, revealing their alliance against Thebes.",
        type: 'military',
        locationId: 'deir-el-ballas',
        keyFigures: ['Kamose'],
        consequences: ['Hyksos-Kushite alliance exposed', 'Theban military success', 'Stage set for final victory']
      },
      {
        id: 'ahmose-liberation',
        year: 1550,
        yearDisplay: 'c. 1550 BCE',
        title: 'Ahmose Expels the Hyksos',
        description: 'Young Pharaoh Ahmose I captures Avaris and pursues the Hyksos into Canaan, besieging Sharuhen and reunifying Egypt.',
        type: 'military',
        locationId: 'avaris',
        keyFigures: ['Ahmose I', 'Ahmose-Nefertari', 'Ahhotep I'],
        consequences: ['Egypt reunified', 'New Kingdom begins', 'Egyptian empire in the Levant established', 'Thebes becomes the supreme capital']
      }
    ],
    figures: [
      {
        id: 'apepi',
        name: 'Apepi',
        title: 'Greatest of the Hyksos Kings',
        reignStart: 1575,
        reignEnd: 1540,
        role: 'pharaoh',
        achievements: ['Longest Hyksos reign', 'Ruled from Avaris over Lower Egypt', 'Presided over a synthesis of Egyptian and Canaanite culture', 'Patron of the Rhind Mathematical Papyrus'],
        legacy: 'Remembered as the great adversary of the Theban kings in the war of liberation.',
        relatedLocations: ['avaris']
      },
      {
        id: 'seqenenre-tao',
        name: 'Seqenenre Tao',
        egyptianName: 'Seqenenre Tao (The Brave)',
        title: 'Theban King',
        reignStart: 1560,
        reignEnd: 1558,
        role: 'pharaoh',
        achievements: ['Initiated the war of liberation against the Hyksos', "Died violently in battle, as evidenced by his mummy's wounds"],
        legacy: 'His sacrifice made him a legendary figure, inspiring his sons to complete the mission.',
        relatedLocations: ['thebes-sip']
      },
      {
        id: 'kamose',
        name: 'Kamose',
        title: 'Last King of the 17th Dynasty',
        reignStart: 1555,
        reignEnd: 1550,
        role: 'pharaoh',
        achievements: ['Intercepted the Hyksos-Kush alliance messenger', 'Captured Hyksos ships on the Nile', 'Advanced to the very walls of Avaris'],
        legacy: 'His victory stelae are crucial historical sources that vividly record his campaigns and motivations.',
        relatedLocations: ['thebes-sip', 'deir-el-ballas']
      },
      {
        id: 'ahmose-i',
        name: 'Ahmose I',
        egyptianName: 'Nebpehtyre Ahmose',
        title: 'Founder of the New Kingdom',
        reignStart: 1550,
        reignEnd: 1525,
        role: 'pharaoh',
        achievements: ['Expelled the Hyksos from Egypt', 'Conquered Avaris', 'Besieged Sharuhen in Canaan', 'Reunified Egypt and subjugated Nubia'],
        legacy: 'Liberator of Egypt. Founder of the glorious 18th Dynasty and the Egyptian Empire.',
        relatedLocations: ['thebes-sip', 'avaris', 'sharuhen']
      },
      {
        id: 'ahhotep-i',
        name: 'Ahhotep I',
        title: 'Queen and Regent',
        role: 'queen',
        achievements: ['Maintained stability in Thebes while her sons were at war', 'Rallied troops and suppressed rebellions', 'Awarded the Order of the Golden Fly for military valor'],
        legacy: 'A pivotal figure who held the Theban homefront together, enabling the final victory.',
        relatedLocations: ['thebes-sip']
      }
    ],
    stories: ['hyksos-invasion', 'quarrel-hippo', 'kamose-intercepted', 'ahmose-liberation']
  }
];

// Helper functions
export function getPeriodById(id: string): EgyptianPeriod | undefined {
  return egyptianPeriods.find(p => p.id === id);
}

export function getLocationById(periodId: string, locationId: string): HistoricalLocation | undefined {
  const period = getPeriodById(periodId);
  return period?.locations.find(l => l.id === locationId);
}

export function getEventsByPeriod(periodId: string): HistoricalEvent[] {
  const period = getPeriodById(periodId);
  return period?.events || [];
}

export function getFiguresByPeriod(periodId: string): HistoricalFigure[] {
  const period = getPeriodById(periodId);
  return period?.figures || [];
}

export function getAllLocations(): HistoricalLocation[] {
  return egyptianPeriods.flatMap(p => p.locations);
}

export function getTimelineEvents(): (HistoricalEvent & { periodId: string })[] {
  return egyptianPeriods.flatMap(p => 
    p.events.map(e => ({ ...e, periodId: p.id }))
  ).sort((a, b) => b.year - a.year);
}
