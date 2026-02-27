import { MangaEpisode, Character } from '@/types/game';

export const explorerCharacter: Character = {
  id: 'zahi',
  name: 'Zahi',
  title: 'Renowned Explorer',
  avatar: '',
  description: 'A charismatic and fearless explorer who has dedicated his life to uncovering the lost secrets of the pharaohs. His latest obsession is the legendary Tomb of the Golden Scarab, a place most scholars believe is a myth.',
  alignment: 'protagonist',
};

export const rivalCharacter: Character = {
  id: 'sorbek',
  name: 'Sorbek',
  title: 'Antiquities Collector',
  avatar: '',
  description: 'A wealthy and ruthless collector of rare artifacts. Sorbek believes the Tomb of the Golden Scarab holds a treasure that will grant him immense power, and he will stop at nothing to possess it.',
  alignment: 'antagonist',
};

export const mangaEpisode4: MangaEpisode = {
  id: 4,
  title: 'The Tomb of the Golden Scarab',
  subtitle: 'An ancient curse, a hidden tomb, and a treasure that could change the fate of a dynasty.',
  description: 'Join Zahi, a famed explorer, on his quest to find the mythical Tomb of the Golden Scarab. But be warned, the tomb is protected by a powerful curse, and a ruthless rival is hot on your heels.',
  coverImage: '',
  characters: [explorerCharacter, rivalCharacter],
  panels: [
    {
      id: 'ep4-panel-1',
      imageUrl: '',
      narration: 'The bustling marketplace of Cairo, 1881. Amidst the clamor and chaos, whispers of a legendary tomb have resurfaced.',
      dialogue: [
        {
          speaker: 'Narrator',
          text: 'They say the Tomb of the Golden Scarab holds the key to eternal life. But all who have sought it have met a gruesome end.',
          position: 'center'
        }
      ],
    },
    {
      id: 'ep4-panel-2',
      imageUrl: '',
      narration: 'Zahi, a man whose reputation precedes him, studies a tattered map in a quiet corner of a crowded cafe.',
      dialogue: [
        {
          speaker: 'Zahi',
          text: 'The final piece of the puzzle. After all these years, the path to the Golden Scarab is clear.',
          position: 'left'
        }
      ],
    },
    {
      id: 'ep4-panel-3',
      imageUrl: '',
      narration: 'Suddenly, a shadow falls over the table. A man with cold eyes and a cruel smile stands before Zahi.',
      dialogue: [
        {
          speaker: 'Sorbek',
          text: 'That map does not belong to you, Zahi. Give it to me, and I might let you live to see another sunrise.',
          position: 'right'
        }
      ],
    },
    {
      id: 'ep4-panel-4',
      imageUrl: '',
      narration: 'Zahi must make a choice. The fate of his expedition, and perhaps his life, hangs in the balance.',
      choices: [
        {
          id: 'choice-fight',
          text: 'Create a diversion and escape with the map.',
          consequence: 'A bold move, but Sorbek is not one to be trifled with.',
          leadsTo: 'ep4-panel-5a',
          affectsEnding: true,
          morality: 'truth'
        },
        {
          id: 'choice-negotiate',
          text: 'Attempt to reason with Sorbek, offering him a share of the treasure.',
          consequence: 'A dangerous bargain. Can a man like Sorbek be trusted?',
          leadsTo: 'ep4-panel-5b',
          affectsEnding: true,
          morality: 'deception'
        }
      ]
    },
    {
      id: 'ep4-panel-5a',
      imageUrl: '',
      narration: 'The flight path: Zahi chooses to run, the precious map clutched in his hand.',
      dialogue: [
        {
          speaker: 'Zahi',
          text: 'No time for games. The desert awaits!',
          position: 'left'
        }
      ],
    },
    {
      id: 'ep4-panel-5b',
      imageUrl: '',
      narration: 'The negotiation path: Zahi attempts to strike a deal with the devil.',
      dialogue: [
        {
          speaker: 'Zahi',
          text: 'There is enough treasure for both of us, Sorbek. Why be enemies when we can be partners?',
          position: 'left'
        },
        {
          speaker: 'Sorbek',
          text: 'Partners? An interesting proposition. But I am not a man who likes to share.',
          position: 'right'
        }
      ]
    },
  ],
  unlockRequirements: ['episode-3-complete']
};
