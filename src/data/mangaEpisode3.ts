import { MangaEpisode, Character } from '@/types/game';

export const scribeCharacter: Character = {
  id: 'amenhotep-scribe',
  name: 'Amenhotep',
  title: 'Royal Scribe of the House of Life',
  avatar: '',
  description: 'Once the most trusted keeper of records in all of Thebes, Amenhotep holds the power to shape history itself with his reed pen. But what happens when truth becomes inconvenient?',
  alignment: 'antagonist',
};

export const protagonistCharacter: Character = {
  id: 'kiya',
  name: 'Kiya',
  title: 'Apprentice Scribe',
  avatar: '',
  description: 'A young apprentice who discovers that the history she has been taught to preserve may be built on lies.',
  alignment: 'protagonist',
};

export const mangaEpisode3: MangaEpisode = {
  id: 3,
  title: 'The Scribe Who Lied',
  subtitle: 'Some truths are buried deeper than pharaohs',
  description: 'In the sacred House of Life, where all knowledge is preserved, young scribe Kiya discovers that her mentor has been falsifying royal records for decades. Now she must choose: expose the truth and face destruction, or become complicit in the greatest deception in Egyptian history.',
  coverImage: '',
  characters: [scribeCharacter, protagonistCharacter],
  panels: [
    {
      id: 'ep3-panel-1',
      imageUrl: '',
      narration: 'The House of Life, Thebes. Where the gods\' words are written and the pharaohs\' deeds are immortalized for eternity.',
      dialogue: [
        {
          speaker: 'Narrator',
          text: 'For three thousand years, the scribes have been the keepers of Ma\'at—truth and order. But not all ink speaks honestly...',
          position: 'center'
        }
      ],
      effects: [{ type: 'fade', intensity: 1, duration: 2000 }]
    },
    {
      id: 'ep3-panel-2',
      imageUrl: '',
      narration: 'Kiya works by lamplight, copying sacred texts as she has done for three years under Master Amenhotep.',
      dialogue: [
        {
          speaker: 'Amenhotep',
          text: 'Your hieratic is improving, child. Soon you will be ready to inscribe the royal annals.',
          position: 'right'
        },
        {
          speaker: 'Kiya',
          text: 'It is my greatest honor, Master. To preserve truth for eternity.',
          position: 'left'
        }
      ]
    },
    {
      id: 'ep3-panel-3',
      imageUrl: '',
      narration: 'But that night, when the lamps should be dark, Kiya returns for her forgotten stylus...',
      dialogue: [
        {
          speaker: 'Kiya (thinking)',
          text: 'Strange... light from the restricted archive. Who would be there at this hour?',
          position: 'center'
        }
      ],
      effects: [{ type: 'dust', intensity: 0.5, duration: 3000 }]
    },
    {
      id: 'ep3-panel-4',
      imageUrl: '',
      narration: 'Through a crack in the stone, she witnesses the unthinkable.',
      dialogue: [
        {
          speaker: 'Amenhotep',
          text: 'Yes, my lord. The Battle of Kadesh will read exactly as Pharaoh commands. A glorious victory... not the stalemate it truly was.',
          position: 'right'
        },
        {
          speaker: 'Shadowy Figure',
          text: 'Excellent. History must remember Ramesses as invincible. The treaty with the Hittites will never be mentioned.',
          position: 'left'
        }
      ],
      effects: [{ type: 'shake', intensity: 0.3, duration: 500 }]
    },
    {
      id: 'ep3-panel-5',
      imageUrl: '',
      narration: 'Kiya\'s world shatters. Everything she believed about truth, about Ma\'at, about her beloved mentor...',
      dialogue: [
        {
          speaker: 'Kiya (thinking)',
          text: 'Master Amenhotep... all these years... every text I\'ve copied... how much of it was lies?',
          position: 'center'
        }
      ],
      effects: [{ type: 'flash', intensity: 0.8, duration: 200 }]
    },
    {
      id: 'ep3-panel-6',
      imageUrl: '',
      narration: 'Days pass. Kiya cannot eat, cannot sleep. The weight of knowledge presses upon her ka.',
      dialogue: [
        {
          speaker: 'Amenhotep',
          text: 'You seem troubled, Kiya. Your work has suffered. Is something wrong?',
          position: 'right'
        },
        {
          speaker: 'Kiya',
          text: 'I... I have been thinking about Ma\'at, Master. About what truth really means.',
          position: 'left'
        }
      ],
      choices: [
        {
          id: 'choice-confront',
          text: 'Confront Amenhotep directly about what you witnessed',
          consequence: 'Your directness may cost you everything, but truth demands courage.',
          leadsTo: 'ep3-panel-7a',
          affectsEnding: true,
          morality: 'truth'
        },
        {
          id: 'choice-investigate',
          text: 'Pretend nothing is wrong and secretly investigate further',
          consequence: 'Knowledge is power, but deception has its own price.',
          leadsTo: 'ep3-panel-7b',
          affectsEnding: true,
          morality: 'deception'
        },
        {
          id: 'choice-accept',
          text: 'Accept that some lies serve a greater purpose',
          consequence: 'Perhaps order requires certain... adjustments to truth.',
          leadsTo: 'ep3-panel-7c',
          affectsEnding: true,
          morality: 'neutral'
        }
      ]
    },
    {
      id: 'ep3-panel-7a',
      imageUrl: '',
      narration: 'The confrontation path: Kiya chooses truth, regardless of consequence.',
      dialogue: [
        {
          speaker: 'Kiya',
          text: 'I saw you, Master. In the restricted archive. I know what you\'ve done—what you\'re still doing.',
          position: 'left'
        },
        {
          speaker: 'Amenhotep',
          text: 'Then you know nothing, child. You see ink on papyrus and think you understand the weight of kingdoms.',
          position: 'right'
        }
      ],
      effects: [{ type: 'shake', intensity: 0.5, duration: 800 }]
    },
    {
      id: 'ep3-panel-7b',
      imageUrl: '',
      narration: 'The investigation path: Kiya plays the long game.',
      dialogue: [
        {
          speaker: 'Kiya',
          text: 'Forgive me, Master. I have simply been overwhelmed by the honor of our work.',
          position: 'left'
        },
        {
          speaker: 'Kiya (thinking)',
          text: 'Smile. Nod. Learn everything. Then decide what truth really means.',
          position: 'center'
        }
      ]
    },
    {
      id: 'ep3-panel-7c',
      imageUrl: '',
      narration: 'The acceptance path: Kiya makes peace with the shadow of Ma\'at.',
      dialogue: [
        {
          speaker: 'Kiya',
          text: 'Master... if preserving order requires... flexibility with truth... then perhaps that is the higher wisdom?',
          position: 'left'
        },
        {
          speaker: 'Amenhotep',
          text: 'Ah. You begin to understand, child. Some are born to write history. Others... to shape it.',
          position: 'right'
        }
      ]
    },
    {
      id: 'ep3-panel-8',
      imageUrl: '',
      narration: 'Whatever path is chosen, the consequences ripple through time itself...',
      dialogue: [
        {
          speaker: 'Narrator',
          text: 'In the House of Life, where gods and mortals meet through ink and stone, a new chapter begins. But whether it leads to salvation or damnation... only the sands of time will tell.',
          position: 'center'
        }
      ],
      effects: [{ type: 'fade', intensity: 1, duration: 3000 }]
    },
    {
      id: 'ep3-panel-9',
      imageUrl: '',
      narration: 'The consequences of your choice will echo through the tombs you explore and the secrets you uncover.',
      dialogue: [
        {
          speaker: 'Narrator',
          text: 'To be continued in the Tomb of the Scribe... where Amenhotep\'s final secrets await those brave enough to seek them.',
          position: 'center'
        }
      ]
    },
    {
      id: 'ep3-panel-10',
      imageUrl: '',
      narration: 'END OF EPISODE 3',
      dialogue: [
        {
          speaker: 'Narrator',
          text: 'Your choices have been recorded. The weight of Ma\'at measures your heart.',
          position: 'center'
        }
      ],
      effects: [{ type: 'fade', intensity: 1, duration: 2000 }]
    }
  ],
  unlockRequirements: ['episode-1-complete', 'episode-2-complete']
};
