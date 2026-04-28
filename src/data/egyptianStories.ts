// Egyptian Stories & Literature - "Bring it Back to Life"
// Realistic historical visualizations of Old and Middle Kingdom tales

export interface StoryPanel {
  id: string;
  image?: string; // Specific image for cinematic view
  imagePrompt: string; // For AI generation or artist reference
  narration: string;
  dialogue?: { speaker: string; text: string }[];
  historicalNote?: string;
  subtext?: string; // Political or philosophical subtext
}

export interface StoryCharacter {
  id: string;
  name: string;
  egyptianName?: string;
  role: string;
  description: string;
  traits: string[];
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  periodId: string;
  type: 'historical' | 'literary' | 'mythological';
  source?: string; // Historical source text
  description: string;
  themes: string[];
  characters: StoryCharacter[];
  panels: StoryPanel[];
  relatedLocations: string[];
  puzzleIds: string[];
  estimatedReadTime: number; // minutes
  coverImage?: string;
  videoUrl?: string;
  subtitlesUrl?: string;
}

export const egyptianStories: Story[] = [
  // STORYTELLING FEATURE (Hidden from Stories Page)
  {
    id: 'shipwrecked-sailor',
    title: 'The Shipwrecked Sailor',
    subtitle: 'A Tale of Survival and the Serpent King',
    period: 'Middle Kingdom',
    periodId: 'middle-kingdom',
    type: 'mythological',
    source: 'Papyrus Hermitage 1115',
    description: 'A miraculous tale of a sailor whose ship is destroyed by a colossal wave. Washed ashore on a mystical island, he encounters a giant, golden serpent—the Lord of Punt—who teaches him courage, resilience, and the true meaning of home.',
    themes: ['Survival', 'Magic', 'Return', 'Courage'],
    relatedLocations: ['punt', 'red-sea'],
    puzzleIds: [],
    estimatedReadTime: 15,
    coverImage: '/shipwrecked-sailor.jpeg',
    videoUrl: '/videos/shipwrecked-sailor.mp4',
    subtitlesUrl: '/videos/shipwrecked-sailor.vtt',
    characters: [
      {
        id: 'sailor',
        name: 'The Sailor',
        role: 'Protagonist',
        description: 'A resilient Egyptian explorer who survives a cataclysmic shipwreck, only to be cast upon the enchanted Island of the Ka.',
        traits: ['Resilient', 'Faithful', 'Pious']
      },
      {
        id: 'serpent-king',
        name: 'The Serpent King',
        role: 'Divine Guardian',
        description: 'A colossal serpent of gold and lapis lazuli, the sovereign of the mystical island who guards the secrets of the divine.',
        traits: ['Majestic', 'Ancient', 'Omniscient']
      }
    ],
    panels: [] // transitions directly to video playback
  },
  {
    id: 'tomb-golden-scarab',
    title: 'The Tomb of the Golden Scarab',
    subtitle: 'Secrets of the Priest-King',
    period: 'Late Period',
    periodId: 'late-period',
    type: 'mythological',
    description: 'An immersive cinematic journey into a long-forgotten burial chamber. Deep beneath the shifting sands, a sacred secret waits for those brave enough to enter the tomb of the last Priest-King.',
    themes: ['Mystery', 'Ancestry', 'Ritual'],
    relatedLocations: ['thebes', 'valley-of-the-kings'],
    puzzleIds: [],
    estimatedReadTime: 12,
    coverImage: '/images/stories/golden-scarab.png',
    characters: [],
    panels: []
  },
  {
    id: 'heretic-pharaoh',
    title: 'The Heretic Pharaoh',
    subtitle: 'The Revolution of Akhenaten',
    period: 'New Kingdom',
    periodId: 'new-kingdom',
    type: 'historical',
    description: 'Experience the dramatic transformation of a kingdom. Witness the rise of Akhenaten, the pharaoh who challenged thousands of years of tradition to follow the light of a single god.',
    themes: ['Revolution', 'Sun Worship', 'Change'],
    relatedLocations: ['amarna', 'akhetaten'],
    puzzleIds: [],
    estimatedReadTime: 18,
    coverImage: '/images/stories/heretic-pharaoh.png',
    characters: [],
    panels: []
  },
  // OLD KINGDOM STORIES
  {
    id: 'westcar-papyrus',
    title: "The Westcar Papyrus",
    subtitle: 'Tales of Magic in the Court of Khufu',
    period: 'Old Kingdom',
    periodId: 'old-kingdom',
    type: 'literary',
    description: 'A legendary collection of ancient magical tales told to King Khufu. Witness the incredible feats of Old Kingdom magicians, from parting the waters of a lake to resurrecting the dead, all recorded on this famous surviving papyrus.',
    themes: ['Magic', 'Wonder', 'Divine Power', 'Royal Entertainment'],
    relatedLocations: ['memphis', 'giza'],
    puzzleIds: ['magician-riddle', 'water-parting-puzzle'],
    estimatedReadTime: 15,
    coverImage: '/westcar.jpg',
    characters: [
      {
        id: 'khufu',
        name: 'King Khufu',
        role: 'Pharaoh',
        description: 'The builder of the Great Pyramid, who seeks entertainment and stories of true magic from his sons.',
        traits: ['Curious', 'Powerful', 'Demanding']
      },
      {
        id: 'djedi',
        name: 'Djedi the Magician',
        role: 'Master Magician',
        description: 'A 110-year-old sage of colossal appetite and incredible magical power, capable of reattaching severed heads.',
        traits: ['Ancient', 'Wise', 'Powerful', 'Brave']
      },
      {
        id: 'bauefre',
        name: 'Prince Bauefre',
        role: 'Royal Son',
        description: 'A son of Khufu who recounts the tale of the magician Djadjaemankh parting the waters.',
        traits: ['Dutiful', 'Storyteller']
      }
    ],
    panels: [
      {
        id: 'wp-1',
        image: '/westcar.jpg',
        imagePrompt: 'A glowing ancient Egyptian papyrus unrolling to reveal magical glowing hieroglyphs. Cinematic lighting, mysterious ancient atmosphere.',
        narration: 'Long ago, in the glorious court of King Khufu, the pharaoh grew weary. He called his sons to entertain him with tales of the great magicians of old.',
        historicalNote: 'The Westcar Papyrus, now in Berlin, is one of the most important surviving texts of ancient Egyptian literature, containing five tales of magic.'
      },
      {
        id: 'wp-2',
        image: '/westcar.jpg',
        imagePrompt: 'Prince Bauefre speaking to King Khufu in a lavish throne room. The king listens intently. Golden lighting, realistic historical Egyptian court.',
        narration: 'Prince Bauefre stepped forward to tell of a wonder from the reign of his grandfather, King Sneferu. It was a tale of a lost jewel, and a magician who could command the very waters.',
        dialogue: [
          { speaker: 'Prince Bauefre', text: 'Let me tell you, O Majesty, of a wonder that happened in the days of your father... A tale of the chief lector priest, Djadjaemankh.' }
        ]
      },
      {
        id: 'wp-3',
        image: '/westcar.jpg',
        imagePrompt: 'A beautiful lake with a royal boat full of rowers. A magician holding a staff points at the water, and the water folds back onto itself like a wall. Cinematic, magical realism.',
        narration: 'A maiden on the king\'s boat had dropped her turquoise pendant into the lake. The magician Djadjaemankh spoke a spell of power, and he laid one half of the lake\'s water upon the other.',
        dialogue: [
          { speaker: 'Narration', text: 'He placed the water, which was twelve cubits deep, upon the other, so that it became twenty-four cubits high! He retrieved the jewel from the dry lakebed.' }
        ]
      },
      {
        id: 'wp-4',
        image: '/westcar.jpg',
        imagePrompt: 'Prince Hardedef bringing the ancient magician Djedi to the court of Khufu. Djedi is very old but strong, eating a massive feast. Realistic historical painting.',
        narration: 'King Khufu was delighted, but asked if any such magic existed today. Prince Hardedef replied that he knew a man named Djedi—a 110-year-old marvel who ate five hundred loaves of bread a day and could reattach severed heads.',
        dialogue: [
          { speaker: 'Khufu', text: 'Bring him to me! I must see this wonder with my own eyes.' }
        ]
      },
      {
        id: 'wp-5',
        image: '/westcar.jpg',
        imagePrompt: 'The ancient magician Djedi performing magic in Khufu\'s court. He is touching a decapitated goose, and magical light connects its head to its body. Astounded courtiers watch.',
        narration: 'When Djedi arrived, Khufu tested him. First a goose, then a waterfowl, and finally a majestic bull. The magician severed their heads, spoke magical words, and they rose up, whole and alive.',
        dialogue: [
          { speaker: 'Djedi', text: 'It is done, my sovereign. Life returns to that which was claimed by the knife.' },
          { speaker: 'Khufu', text: '(Astonished) The gods speak through you, Djedi! Truly, magic never died in Egypt.' }
        ],
        historicalNote: 'The tale of Djedi contains the earliest known recorded instance of the "decoding" magic trick still performed by modern illusionists.'
      },
      {
        id: 'wp-6',
        image: '/westcar.jpg',
        imagePrompt: 'The Westcar papyrus glowing in the dark, preserving the secrets of ancient magic. A sense of timeless mystery.',
        narration: 'To this day, the Westcar Papyrus guards the secrets of these ancient wonders. And though the magic of the Old Kingdom faded into myth, its legend was written in stone and ink forever.',
        dialogue: [
          { speaker: 'Scribe', text: 'As it was spoken, so it is written.' }
        ]
      }
    ]
  },
  {
    id: 'eloquent-peasant',
    title: 'The Eloquent Peasant',
    subtitle: 'When Justice Demands Poetry',
    period: 'Middle Kingdom',
    periodId: 'middle-kingdom',
    type: 'literary',
    source: 'The Eloquent Peasant (Papyrus Berlin 3023)',
    description: 'A farmer is robbed by a corrupt official and must appeal for justice through nine brilliant speeches. A satire on bureaucracy and a meditation on the nature of Ma\'at (truth/justice).',
    themes: ['Justice', 'Eloquence', 'Corruption', 'Persistence'],
    relatedLocations: ['faiyum', 'itjtawy'],
    puzzleIds: ['speech-order', 'maat-balance'],
    estimatedReadTime: 16,
    coverImage: '/peasant.jpg',
    characters: [
      {
        id: 'khunanup',
        name: 'Khunanup',
        role: 'Salt Merchant',
        description: 'A peasant from the Wadi Natrun salt fields who discovers he can speak with the eloquence of a poet when his family\'s livelihood is stolen.',
        traits: ['Eloquent', 'Stubborn', 'Righteous', 'Desperate']
      },
      {
        id: 'nemtynakht',
        name: 'Nemtynakht',
        role: 'Estate Manager',
        description: 'The corrupt official who steals Khunanup\'s donkeys and goods through legal trickery.',
        traits: ['Corrupt', 'Clever', 'Arrogant']
      },
      {
        id: 'rensi',
        name: 'Rensi',
        role: 'High Steward',
        description: 'The judge who is so moved by the peasant\'s speeches that he secretly prolongs the case to hear more.',
        traits: ['Wise', 'Appreciative', 'Secretly amused']
      }
    ],
    panels: [
      {
        id: 'ep-1',
        imagePrompt: 'Egyptian peasant with laden donkeys traveling through agricultural land, realistic historical. The man walks confidently, his donkeys carry salt and natron. Fertile Middle Kingdom landscape along the Nile.',
        narration: 'Khunanup was no great man. He gathered salt from the desert and sold it in the market towns. But his tongue held treasures greater than gold.',
        historicalNote: 'Salt and natron (used for mummification) were valuable trade goods from the Wadi Natrun oasis.'
      },
      {
        id: 'ep-2',
        imagePrompt: 'Dramatic scene of a corrupt official blocking a path with spread linen, peasant with donkeys unable to pass without trampling crops or the cloth. Egyptian field setting, confrontation, realistic historical.',
        narration: 'The estate manager Nemtynakht set a trap. He spread his linen across the path - step on it and pay, or trample the crops and pay. Either way, the peasant was robbed.',
        dialogue: [
          { speaker: 'Nemtynakht', text: 'Your donkey has eaten my barley! I confiscate everything you own. Dispute it if you dare - who will listen to a peasant?' }
        ]
      },
      {
        id: 'ep-3',
        imagePrompt: 'Khunanup speaking passionately before a seated official in an Egyptian courthouse, realistic historical. The peasant gestures dramatically, other officials look impressed. Simple court setting, natural lighting.',
        narration: 'But Khunanup did dispute it. He went to the High Steward Rensi and spoke with such fire that the court fell silent.',
        dialogue: [
          { speaker: 'Khunanup', text: 'O High Steward! You are the rudder that keeps Egypt afloat, the balance beam of Ma\'at! Do not let the scale tilt against the poor while the rich heap their side with lies!' }
        ]
      },
      {
        id: 'ep-4',
        imagePrompt: 'Egyptian scribe rapidly writing on papyrus as Khunanup speaks, the High Steward Rensi listening intently. Behind a screen, a royal messenger takes notes. Realistic historical court scene.',
        narration: 'Rensi was so astounded that he reported to the king himself. And the king ordered: "Let him keep speaking. Record every word. This is more precious than any treasure."',
        dialogue: [
          { speaker: 'King', text: 'Keep the case alive! Give his family food so he does not starve, but tell him nothing. I want to hear what he will say next.' }
        ],
        historicalNote: 'The king\'s unusual order to prolong the case adds dark humor - the peasant suffers while his eloquence is harvested.'
      },
      {
        id: 'ep-5',
        imagePrompt: 'Khunanup returning for yet another appeal, now ragged and exhausted, still speaking with fierce dignity. The officials have changed, seasons have passed. Realistic historical, showing passage of time.',
        narration: 'Nine times Khunanup returned. Nine speeches, each more brilliant than the last. He raged, wept, philosophized. He compared Rensi to a leaky granary, a doctor who kills his patients, a rudder that steers into rocks.',
        dialogue: [
          { speaker: 'Khunanup', text: 'There is no yesterday for the lazy, no friend for the deaf to right, no festival for the greedy! Listen! Justice is for eternity! It goes down to the grave with the doer!' }
        ]
      },
      {
        id: 'ep-6',
        imagePrompt: 'Triumphant ending scene - Khunanup reunited with his donkeys and goods, Nemtynakht being led away in disgrace. Egyptian justice served. Realistic historical, satisfying conclusion.',
        narration: 'And at last, justice came. Nemtynakht lost everything to Khunanup. The peasant went home wealthy. But his true treasure was already recorded on papyrus - the proof that even the lowest voice can speak truth to power.',
        dialogue: [
          { speaker: 'Rensi', text: 'The king himself has judged: all that Nemtynakht owns now belongs to you. Go home, Khunanup. Your words will outlast temples.' }
        ],
        historicalNote: 'This tale was used to train scribes for centuries - it shows that eloquence could triumph over power.'
      }
    ]
  },
  {
    id: 'pyramid-builders',
    title: 'The Pyramid Builders',
    subtitle: 'A Day in the Shadow of Eternity',
    period: 'Old Kingdom',
    periodId: 'old-kingdom',
    type: 'historical',
    description: 'Experience daily life in the workers\' village at Giza during the construction of the Great Pyramid. Not slaves, but proud craftsmen building the greatest wonder of the ancient world.',
    themes: ['Labor', 'Community', 'Pride', 'Sacrifice'],
    relatedLocations: ['giza', 'memphis'],
    puzzleIds: ['block-puzzle', 'ration-calculation'],
    estimatedReadTime: 12,
    characters: [
      {
        id: 'neferhotep',
        name: 'Neferhotep',
        role: 'Gang Leader',
        description: 'Veteran foreman who leads the "Friends of Khufu" work gang. Twenty years on the plateau have taught him every trick.',
        traits: ['Experienced', 'Fair', 'Proud']
      },
      {
        id: 'ipy',
        name: 'Ipy',
        role: 'Young Worker',
        description: 'Teenage recruit from the Delta, experiencing his first rotating labor season at the great project.',
        traits: ['Eager', 'Nervous', 'Strong']
      },
      {
        id: 'meritites',
        name: 'Meritites',
        role: 'Baker',
        description: 'The woman who runs the bakery feeding Gang 14. Her bread is famous across the site.',
        traits: ['Hardworking', 'Warm', 'Practical']
      }
    ],
    panels: [
      {
        id: 'pb-1',
        imagePrompt: 'Pre-dawn scene at the Giza workers\' village, realistic historical. Rows of small mud brick houses, workers stirring awake, smoke rising from bakeries. The unfinished Great Pyramid looms in the background, torch lights visible on its surface. Moody blue hour lighting.',
        narration: 'Before Ra touched the horizon, the village of the pyramid builders stirred to life. Ten thousand souls lived in the shadow of the king\'s eternal house.',
        historicalNote: 'Archaeological excavations have revealed a well-organized workers\' town with bakeries, breweries, and medical facilities.'
      },
      {
        id: 'pb-2',
        imagePrompt: 'Ancient Egyptian communal breakfast scene, workers receiving bread and beer rations from large vessels. Realistic historical painting showing camaraderie, morning light, simple but abundant food. Details of linen clothing, clay vessels.',
        narration: 'The morning ration: ten loaves of bread, a jar of beer. The king provided well for those who built his eternity.',
        dialogue: [
          { speaker: 'Neferhotep', text: 'Eat well, brothers! The king\'s stone arrives from Tura today. We have three hundred blocks to move before sunset.' }
        ]
      },
      {
        id: 'pb-3',
        imagePrompt: 'Epic scene of workers dragging a massive limestone block on a wooden sledge up a ramp at Giza. Realistic historical, showing the coordination, rope teams, water pourers, dust and sweat. The partially built pyramid rises behind them. Dramatic afternoon lighting.',
        narration: 'Young Ipy had never seen anything so massive. The stone must have weighed as much as a temple. Yet together, two hundred men moved it as one.',
        dialogue: [
          { speaker: 'Workers (chanting)', text: 'Pull for Khufu! Pull for the king! The gods watch! The gods count! Pull!' }
        ],
        historicalNote: 'Graffiti found in the pyramid includes gang names like "Friends of Khufu" and "Drunkards of Menkaure."'
      },
      {
        id: 'pb-4',
        imagePrompt: 'Interior of an Old Kingdom workers\' house, evening scene. A family eating together, oil lamp light, simple furnishings, hieratic writing exercises on a potsherd. Realistic historical, warm intimate atmosphere.',
        narration: 'By night, the village transformed. Children practiced writing, priests recited prayers, and in the House of Life, scribes calculated tomorrow\'s rations.',
        dialogue: [
          { speaker: 'Ipy', text: 'Father says our name will live forever - carved into the stones we placed.' },
          { speaker: 'Neferhotep', text: 'Your father speaks truth. When the world forgets all else, this pyramid will stand. And we built it.' }
        ]
      },
      {
        id: 'pb-5',
        imagePrompt: 'Dramatic sunset scene at Giza, the Great Pyramid nearly complete, silhouetted workers on the peak placing the golden capstone (pyramidion). Rays of sunlight streaming, religious ceremony atmosphere. Realistic historical epic painting.',
        narration: 'And on the day the capstone was placed, sheathed in electrum that caught the first ray of each dawn, Neferhotep allowed himself to weep. They had touched the sky.',
        historicalNote: 'The pyramidion (capstone) may have been gilded with electrum (gold-silver alloy) to catch the sun\'s first light.'
      }
    ]
  },
  // FIRST INTERMEDIATE PERIOD STORIES
  {
    id: 'ankhtifi-famine',
    title: 'The Hunger of Ankhtifi',
    subtitle: 'A Nomarch Against the Darkness',
    period: 'First Intermediate Period',
    periodId: 'first-intermediate',
    type: 'historical',
    source: 'Tomb Autobiography of Ankhtifi at Mo\'alla',
    description: 'Based on one of history\'s most vivid autobiographies, follow Nomarch Ankhtifi as he struggles to save his people during the great famine that ended the Old Kingdom.',
    themes: ['Leadership', 'Survival', 'Hubris', 'Chaos'],
    relatedLocations: ['moalla'],
    puzzleIds: ['grain-distribution', 'famine-survival'],
    estimatedReadTime: 14,
    characters: [
      {
        id: 'ankhtifi',
        name: 'Ankhtifi',
        role: 'Nomarch of Hierakonpolis',
        description: 'A boastful but effective provincial lord who held his region together when Egypt fell apart.',
        traits: ['Arrogant', 'Capable', 'Ruthless', 'Determined']
      },
      {
        id: 'khenu',
        name: 'Khenu',
        role: 'Grain Keeper',
        description: 'The official responsible for the dwindling grain stores, caught between honesty and despair.',
        traits: ['Honest', 'Terrified', 'Loyal']
      }
    ],
    panels: [
      {
        id: 'af-1',
        imagePrompt: 'Desolate Nile scene during famine, realistic historical. Low river, cracked mud flats, wilted crops, worried farmers looking at empty irrigation channels. Muted colors, sense of drought and despair. Egyptian Middle Egypt landscape.',
        narration: 'In the Year of the Low Nile, when Hapi the river god withheld his blessing for the third season, Ankhtifi inherited a dying land.',
        dialogue: [
          { speaker: 'Ankhtifi (inscription)', text: 'All of Upper Egypt was dying of hunger, to such a degree that everyone had come to eating their children.' }
        ],
        historicalNote: 'This quote comes directly from Ankhtifi\'s tomb autobiography, one of the most dramatic descriptions of famine in ancient literature.'
      },
      {
        id: 'af-2',
        imagePrompt: 'Egyptian provincial granary, nearly empty, desperate nomarch Ankhtifi inspecting the last stores with torch light. Worried officials behind him. Realistic historical, dramatic shadows, sense of crisis.',
        narration: 'The granaries echoed empty. Other nomarchs had hoarded what remained, leaving their people to starve. But Ankhtifi made a different choice.',
        dialogue: [
          { speaker: 'Khenu', text: 'My lord, if we distribute what remains, we will have nothing for planting season.' },
          { speaker: 'Ankhtifi', text: 'If we do not distribute, there will be no one left to plant.' }
        ]
      },
      {
        id: 'af-3',
        imagePrompt: 'Ankhtifi personally distributing grain to starving villagers from carts, realistic historical painting. Crowds of thin, desperate people reaching for bread, children, elderly. The nomarch stands among them, not above. Dusty Egyptian village setting.',
        narration: 'He opened his stores and traveled his nomes, feeding every mouth he could reach. And when the neighboring provinces collapsed into chaos, he marched his men to save them too.',
        dialogue: [
          { speaker: 'Ankhtifi (inscription)', text: 'I gave bread to the hungry and clothing to the naked. I was a father to the orphan and a husband to the widow.' }
        ]
      },
      {
        id: 'af-4',
        imagePrompt: 'Ancient Egyptian battle scene, Ankhtifi leading soldiers against rival nomarchs, realistic historical. Soldiers with spears and shields, dust and chaos, provincial Egyptian warfare. Not grand, but desperate and brutal.',
        narration: 'But Ankhtifi was no saint. When diplomacy failed, he took what his people needed by force. The old kingdom was dead - survival belonged to the strong.',
        dialogue: [
          { speaker: 'Ankhtifi', text: 'I am a champion without peer! When I advance, no enemy stands. The coward who faces me flees like prey before the falcon!' }
        ],
        historicalNote: 'Ankhtifi\'s boastful military claims are typical of First Intermediate Period autobiographies.'
      },
      {
        id: 'af-5',
        imagePrompt: 'Ankhtifi inspecting his own tomb being carved at Mo\'alla, realistic historical. Workers carving hieroglyphs into limestone walls, depicting his deeds. The nomarch watches with satisfaction. Egyptian tomb interior.',
        narration: 'He built his tomb at Mo\'alla, its walls covered with his boasts. Vainglorious perhaps - but his people survived. And sometimes, in the darkness between kingdoms, that is enough.',
        dialogue: [
          { speaker: 'Ankhtifi (inscription)', text: 'There was never anyone who did what I did - no ancestor, no predecessor. But I shall have no equal among those who come after.' }
        ]
      }
    ]
  },
  // MIDDLE KINGDOM STORIES
  {
    id: 'sinuhe-tale',
    title: 'The Tale of Sinuhe',
    subtitle: 'Exile, Honor, and the Long Road Home',
    period: 'Middle Kingdom',
    periodId: 'middle-kingdom',
    type: 'literary',
    source: 'The Story of Sinuhe (multiple papyrus copies)',
    description: 'The masterpiece of Egyptian literature. A court official flees Egypt after a royal assassination, lives among the Asiatic tribes, and yearns his whole life to return home to be buried properly.',
    themes: ['Exile', 'Identity', 'Homecoming', 'Egyptian-ness', 'Fate'],
    relatedLocations: ['itjtawy', 'thebes-mk'],
    puzzleIds: ['sinuhe-journey', 'hieroglyph-letter'],
    estimatedReadTime: 20,
    characters: [
      {
        id: 'sinuhe',
        name: 'Sinuhe',
        role: 'Royal Attendant',
        description: 'A loyal servant of Queen Neferu who panics and flees after overhearing news of Amenemhat I\'s assassination.',
        traits: ['Anxious', 'Loyal', 'Capable', 'Homesick']
      },
      {
        id: 'amunenshi',
        name: 'Amunenshi',
        role: 'Asiatic Chief',
        description: 'The tribal leader who takes Sinuhe in and gives him a home in exile.',
        traits: ['Generous', 'Powerful', 'Calculating']
      },
      {
        id: 'senusret-i-story',
        name: 'Senusret I',
        egyptianName: 'Kheperkare Senusret',
        role: 'New Pharaoh',
        description: 'The son of the assassinated king, who eventually forgives Sinuhe and invites him home.',
        traits: ['Merciful', 'Wise', 'Political']
      }
    ],
    panels: [
      {
        id: 'st-1',
        imagePrompt: 'Night scene in an Egyptian military camp in the desert, urgent messenger arriving on foot, torches flickering. Sinuhe overhears terrifying news from hiding behind a tent. Realistic historical, tense atmosphere.',
        narration: 'I was with the army when the messenger came. The words he spoke stopped my heart: the king was dead. Murdered in his own palace.',
        dialogue: [
          { speaker: 'Messenger', text: 'Amenemhat has been struck down by his own guards! Prince Senusret races back from Libya! The Two Lands hold their breath!' }
        ],
        historicalNote: 'The assassination of Amenemhat I is historical fact, referenced in both Sinuhe and the king\'s own "Instructions."'
      },
      {
        id: 'st-2',
        imagePrompt: 'Sinuhe fleeing at dawn across the eastern desert, realistic historical. A lone figure running toward the horizon, looking back in terror. Egyptian-Levantine borderlands, rocky terrain, harsh sunlight.',
        narration: 'Fear took me. I do not know why - I had done nothing wrong. But my legs carried me east, away from Egypt, away from everything I knew.',
        dialogue: [
          { speaker: 'Sinuhe', text: 'A god must have led me astray. I never planned to flee. But once I started running, I could not stop.' }
        ]
      },
      {
        id: 'st-3',
        imagePrompt: 'Sinuhe near death from thirst in the desert, realistic historical. Collapsed Egyptian in tattered linen, vultures circling, cracked lips. Distant Bedouin caravan approaching. Harsh, unforgiving landscape.',
        narration: 'I would have died in the desert. Thirst closed my throat, the sun beat upon my skull like copper hammers. But the Asiatics found me.',
        dialogue: [
          { speaker: 'Amunenshi', text: 'This man wears the cloth of Egypt! He must be someone important. Give him water - carefully, or he dies.' }
        ]
      },
      {
        id: 'st-4',
        imagePrompt: 'Sinuhe as a prosperous chief among Asiatic tribes, realistic historical. He has a tent, herds, a foreign wife and children. But he gazes westward toward Egypt with deep longing. Levantine tribal camp setting.',
        narration: 'Years passed. I became a chief among them. Amunenshi gave me land, cattle, a wife. I defeated their enemies in single combat. But every night, I dreamed of Egypt.',
        dialogue: [
          { speaker: 'Sinuhe', text: 'Whatever god destined this flight, be merciful and bring me home! Let me see the place where my heart dwells!' }
        ],
        historicalNote: 'The longing for Egyptian burial was profound - to die abroad meant your soul wandered forever.'
      },
      {
        id: 'st-5',
        imagePrompt: 'Sinuhe receiving a royal pardon letter from a messenger, realistic historical. He holds the papyrus with shaking hands, tears on his weathered face. Asiatic tent interior, emotional scene.',
        narration: 'And then, a miracle. After decades in exile, a royal letter arrived. King Senusret, son of the man whose death I fled, called me home.',
        dialogue: [
          { speaker: 'Royal Letter', text: 'Why should you die in a foreign land? Come home, Sinuhe. You shall be wrapped in white linen and laid in a golden coffin. You shall not die abroad!' }
        ]
      },
      {
        id: 'st-6',
        imagePrompt: 'Elderly Sinuhe prostrating before Pharaoh Senusret I in the throne room, realistic historical. Magnificent Egyptian court, courtiers watching, emotional reunion. The old exile touches his forehead to the ground.',
        narration: 'When I saw him on the throne, I fell upon my belly. All those years, all that fear, dissolved. I was home.',
        dialogue: [
          { speaker: 'Senusret I', text: 'Rise, Sinuhe. You shall dwell in the royal house, eat at my table, and when your time comes, you shall be buried as an Egyptian, not wrapped in sheepskin like a foreigner.' }
        ]
      },
      {
        id: 'st-7',
        imagePrompt: 'Sinuhe in old age, sitting peacefully in a garden near his completed tomb at the Egyptian necropolis. Sunset, peaceful, realistic historical. He is at peace, finally home.',
        narration: 'I was given a garden house, servants, a tomb prepared with all the rites. And at last, I knew peace. For the greatest gift is not power or wealth - it is to return to the Black Land, to be buried in the soil that gave you birth.',
        historicalNote: 'The Tale of Sinuhe was so popular it was copied for over a thousand years. It teaches that Egyptian-ness transcends physical location.'
      }
    ]
  },
  // SECOND INTERMEDIATE PERIOD STORIES
  {
    id: 'kamose-intercepted',
    title: 'The Intercepted Letter',
    subtitle: 'Kamose and the Hyksos-Kush Alliance',
    period: 'Second Intermediate Period',
    periodId: 'second-intermediate',
    type: 'historical',
    source: 'Carnarvon Tablet and Second Kamose Stela',
    description: 'The true story of how Theban King Kamose intercepted a message between the Hyksos and Kush, revealing a deadly alliance meant to crush Egypt between two enemies.',
    themes: ['War', 'Espionage', 'Liberation', 'Patriotism'],
    relatedLocations: ['thebes-sip', 'avaris', 'deir-el-ballas', 'kerma'],
    puzzleIds: ['intercept-message', 'chariot-tactics'],
    estimatedReadTime: 18,
    characters: [
      {
        id: 'kamose',
        name: 'Kamose',
        role: 'Pharaoh',
        description: 'The fierce young king who refused to accept a divided Egypt, even when his own council advised peace.',
        traits: ['Bold', 'Angry', 'Patriotic', 'Ruthless']
      },
      {
        id: 'apepi-story',
        name: 'Apepi',
        role: 'Hyksos King',
        description: 'The foreign ruler of Avaris who underestimates Theban determination.',
        traits: ['Confident', 'Calculating', 'Arrogant']
      },
      {
        id: 'ahmose-soldier',
        name: 'Ahmose son of Ibana',
        role: 'Young Soldier',
        description: 'A teenager who will witness the liberation of Egypt and record it in his own tomb.',
        traits: ['Brave', 'Young', 'Observant']
      }
    ],
    panels: [
      {
        id: 'ki-1',
        imagePrompt: 'Egyptian war council at Thebes, King Kamose standing angrily while seated advisors urge caution. Realistic historical, lamplight, tension, maps and weapons visible. The king looks ready to overturn the table.',
        narration: 'The advisors said: "Make peace with the Hyksos. We hold Upper Egypt, they hold the Delta. Is that not enough?" Kamose could not believe his ears.',
        dialogue: [
          { speaker: 'Kamose', text: 'I sit between an Asiatic and a Nubian, each one with his slice of Egypt! To what purpose is my power? One prince squats in Avaris, another in Kush!' }
        ],
        historicalNote: 'This speech comes from the Carnarvon Tablet, recording Kamose\'s frustration with the divided kingdom.'
      },
      {
        id: 'ki-2',
        imagePrompt: 'Egyptian fleet of war boats sailing north on the Nile, Kamose at the prow of the lead ship, soldiers ready with weapons. Realistic historical, dynamic, sense of movement and purpose.',
        narration: 'He launched his fleet north. The river that nurtured Egypt would become the highway of liberation.',
        dialogue: [
          { speaker: 'Kamose', text: 'Forward! Let the Hyksos women wail from their rooftops! Let them see what a true son of Egypt can do!' }
        ]
      },
      {
        id: 'ki-3',
        imagePrompt: 'Egyptian soldiers capturing a lone messenger in the desert, Kamose reading the intercepted papyrus with growing fury. Realistic historical, dramatic moment of discovery, desert oasis setting.',
        narration: 'In the oasis road, his scouts caught a messenger. The letter he carried changed everything.',
        dialogue: [
          { speaker: 'Kamose', text: 'Read this! Apepi writes to the King of Kush: "Attack Thebes from the south while I attack from the north. We shall divide Egypt between us!"' }
        ],
        historicalNote: 'The intercepted letter is historical fact - Kamose records it verbatim on his stela.'
      },
      {
        id: 'ki-4',
        imagePrompt: 'Night raid on Hyksos ships, Egyptian soldiers with torches attacking anchored vessels near Avaris. Fire, chaos, Hyksos women screaming from the walls of the city. Realistic historical, dramatic lighting.',
        narration: 'Kamose struck first. His fleet reached Avaris itself. He did not take the city - but he sent a message: Egypt had awakened.',
        dialogue: [
          { speaker: 'Kamose', text: 'I captured his ships loaded with gold, silver, bronze - and all the fine products of Syria! Apepi watched from his walls and could do nothing!' }
        ]
      },
      {
        id: 'ki-5',
        imagePrompt: 'Kamose\'s triumphal return to Thebes, crowds cheering, captured Hyksos standards being paraded. Realistic historical, joyful but militaristic, the king has aged but stands proud.',
        narration: 'He returned to Thebes a hero. The war was not over - that glory would fall to his brother Ahmose. But Kamose had proven that the Hyksos were not invincible.',
        dialogue: [
          { speaker: 'Young Ahmose', text: 'Brother, will you go back? Will you finish what you started?' },
          { speaker: 'Kamose', text: 'I will - or you will. The Two Lands will be one again. This I swear by Amun.' }
        ]
      },
      {
        id: 'ki-6',
        imagePrompt: 'Stela being carved at Karnak temple, showing Kamose\'s deeds. Workers inscribe hieroglyphs while priests oversee. Realistic historical, sense of history being recorded.',
        narration: 'Kamose died before victory came. But his words lived on, carved in stone at Karnak. And his brother Ahmose would fulfill the oath - driving the Hyksos out forever.',
      }
    ]
  }
];

// AI Story Generation Ideas
export interface AIStoryPrompt {
  id: string;
  title: string;
  description: string;
  period: string;
  inputRequired: string[];
  exampleOutput: string;
  aiModel: string;
  technicalNotes: string;
}

export const aiStoryFeatures: AIStoryPrompt[] = [
  {
    id: 'personalized-tale',
    title: 'Generate Your Own Egyptian Tale',
    description: 'Using LLM technology, create personalized stories set in ancient Egypt based on your chosen period, character type, and moral dilemma.',
    period: 'Any',
    inputRequired: ['Period selection', 'Character role (scribe, soldier, priest, farmer)', 'Moral theme', 'Preferred length'],
    exampleOutput: 'A unique 5-panel story about a Middle Kingdom scribe who discovers falsified records...',
    aiModel: 'Lovable AI (google/gemini-2.5-flash)',
    technicalNotes: 'Use structured prompts with historical context. Include period-accurate vocabulary and references.'
  },
  {
    id: 'what-if-scenarios',
    title: 'Historical What-If Generator',
    description: 'ML-powered alternative history scenarios. What if the Hyksos won? What if Imhotep\'s pyramid collapsed?',
    period: 'Any',
    inputRequired: ['Base historical event', 'Alternative outcome', 'Consequences to explore'],
    exampleOutput: 'An interactive timeline showing how Egypt might have developed differently...',
    aiModel: 'Lovable AI + timeline prediction model',
    technicalNotes: 'Combine historical database with LLM reasoning for plausible alternatives.'
  },
  {
    id: 'hieroglyph-story',
    title: 'Story from Hieroglyphs',
    description: 'Upload or select hieroglyphs, and AI generates a story incorporating their meanings.',
    period: 'Any',
    inputRequired: ['Selected hieroglyphs', 'Story tone (dramatic, humorous, educational)'],
    exampleOutput: 'A story about a falcon (𓅃) who guides a lost scribe (𓀀) to the horizon (𓇳)...',
    aiModel: 'Hieroglyph Recognition CNN + Lovable AI',
    technicalNotes: 'Classify hieroglyphs with CNN, pass meanings to LLM for narrative generation.'
  }
];

// Helper functions
export function getStoryById(id: string): Story | undefined {
  return egyptianStories.find(s => s.id === id);
}

export function getStoriesByPeriod(periodId: string): Story[] {
  return egyptianStories.filter(s => s.periodId === periodId);
}

export function getStoriesByType(type: Story['type']): Story[] {
  return egyptianStories.filter(s => s.type === type);
}

export function getAllStoryCharacters(): StoryCharacter[] {
  return egyptianStories.flatMap(s => s.characters);
}
