import { MangaEpisode, Character } from '@/types/game';

export const guardCharacter: Character = {
  id: 'bayek',
  name: 'Bayek',
  title: 'Captain of the Medjay',
  avatar: '',
  description: 'A loyal and respected soldier, Bayek has served the pharaoh for his entire life. But when Akhenaten declares a new god and plunges Egypt into religious turmoil, Bayek is forced to question his loyalty.',
  alignment: 'protagonist',
};

export const priestCharacter: Character = {
  id: 'paser',
  name: 'Paser',
  title: 'High Priest of Amun-Ra',
  avatar: '',
  description: 'A devout and powerful man, Paser is the leader of the old religion. He sees Akhenaten as a heretic who is destroying the very soul of Egypt, and he will do whatever it takes to restore the old gods.',
  alignment: 'antagonist',
};

export const mangaEpisode5: MangaEpisode = {
  id: 5,
  title: 'The Heretic Pharaoh',
  subtitle: 'One god. One vision. One rebellion.',
  description: 'Akhenaten’s revolution has thrown Egypt into chaos. As a loyal guard, you are caught between the old gods and the new. Will you enforce the pharaoh’s will or join the growing resistance that seeks to restore the ancient ways?',
  coverImage: '',
  characters: [guardCharacter, priestCharacter],
  panels: [
    {
      id: 'ep5-panel-1',
      imageUrl: '',
      narration: 'The city of Amarna, the new capital of Egypt. A city built to honor the one true god, the Aten.',
      dialogue: [
        {
          speaker: 'Narrator',
          text: 'But in the shadows, the old gods still whisper. And a rebellion is brewing.',
          position: 'center'
        }
      ],
    },
    {
      id: 'ep5-panel-2',
      imageUrl: '',
      narration: 'Bayek, Captain of the Medjay, stands before the Pharaoh Akhenaten. A man he has sworn to protect.',
      dialogue: [
        {
          speaker: 'Akhenaten',
          text: 'The priests of Amun-Ra plot against me, Bayek. They cling to their false gods and their corrupt ways. You must root them out. Show them the power of the Aten.',
          position: 'right'
        }
      ],
    },
    {
      id: 'ep5-panel-3',
      imageUrl: '',
      narration: 'That night, Bayek receives a secret message. A summons to a hidden temple, where the followers of the old gods still gather.',
      dialogue: [
        {
          speaker: 'Paser',
          text: 'The gods have not abandoned us, Bayek. They have chosen you to be their instrument. Help us restore the balance, and you will be rewarded beyond measure.',
          position: 'left'
        }
      ],
    },
    {
      id: 'ep5-panel-4',
      imageUrl: '',
      narration: 'The choice is made. Bayek must decide where his loyalty lies. With the pharaoh he swore to serve, or the gods he has worshiped since birth.',
      choices: [
        {
          id: 'choice-pharaoh',
          text: 'Obey the Pharaoh and crush the rebellion.',
          consequence: 'Your loyalty will be rewarded, but at what cost to your soul?',
          leadsTo: 'ep5-panel-5a',
          affectsEnding: true,
          morality: 'truth'
        },
        {
          id: 'choice-gods',
          text: 'Join the rebellion and restore the old gods.',
          consequence: 'A dangerous path, but the gods will remember your sacrifice.',
          leadsTo: 'ep5-panel-5b',
          affectsEnding: true,
          morality: 'deception'
        }
      ]
    },
    {
      id: 'ep5-panel-5a',
      imageUrl: '',
      narration: 'The path of order: Bayek chooses his duty to the pharaoh.',
      dialogue: [
        {
          speaker: 'Bayek',
          text: 'I am a soldier of the pharaoh. I will not betray my oath.',
          position: 'left'
        }
      ],
    },
    {
      id: 'ep5-panel-5b',
      imageUrl: '',
      narration: 'The path of faith: Bayek chooses to defy the pharaoh and fight for the gods.',
      dialogue: [
        {
          speaker: 'Bayek',
          text: 'The gods of Egypt will not be silenced. I will be their voice.',
          position: 'left'
        }
      ]
    },
  ],
  unlockRequirements: ['episode-4-complete']
};
