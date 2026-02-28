export interface Pharaoh {
  name: string;
  reign: string;
  dynasty: string;
  facts: string[];
  clue: string;
}

export const pharaohs: Pharaoh[] = [
  {
    name: 'Akhenaten',
    reign: 'c. 1353–1336 BC',
    dynasty: '18th Dynasty',
    facts: [
      'Attempted to introduce a monotheistic religion centered on the sun god Aten.',
      'Built a new capital city, Akhetaten (modern-day Amarna).',
      'His religious reforms were abandoned after his death.',
    ],
    clue: 'I tried to make Egypt worship only one god, Aten.',
  },
  {
    name: 'Tutankhamun',
    reign: 'c. 1332–1323 BC',
    dynasty: '18th Dynasty',
    facts: [
      'His tomb was discovered in 1922 by Howard Carter, almost completely intact.',
      'Reversed the religious reforms of his father, Akhenaten.',
      'Died at a young age, around 19.',
    ],
    clue: 'My tomb, discovered in 1922, was one of the most complete ever found.',
  },
  {
    name: 'Ramesses II',
    reign: 'c. 1279–1213 BC',
    dynasty: '19th Dynasty',
    facts: [
      'One of the most powerful and celebrated pharaohs of the New Kingdom.',
      'Signed the first known peace treaty with the Hittites.',
      'Oversaw a massive building program, including the temples at Abu Simbel.',
    ],
    clue: 'I was a great builder, and my monuments include the temples at Abu Simbel.',
  },
    {
    name: 'Cleopatra VII',
    reign: '51–30 BC',
    dynasty: 'Ptolemaic Dynasty',
    facts: [
      'The last active ruler of the Ptolemaic Kingdom of Egypt.',
      'Formed alliances with Roman leaders Julius Caesar and Mark Antony.',
      'Her death marked the end of the Hellenistic period and the beginning of the Roman era in Egypt.',
    ],
    clue: 'I was the last pharaoh of Egypt, and I had famous relationships with Roman leaders.',
  },
  {
    name: 'Hatshepsut',
    reign: 'c. 1478–1458 BC',
    dynasty: '18th Dynasty',
    facts: [
      'One of the most successful female pharaohs.',
      'Oversaw a period of peace and prosperity, and a major building program.',
      'Often depicted with male attributes, including a false beard.',
    ],
    clue: 'I was a female pharaoh who ruled for over 20 years, bringing great prosperity.',
  },
  {
    name: 'Thutmose III',
    reign: 'c. 1479–1425 BC',
    dynasty: '18th Dynasty',
    facts: [
      'Conducted numerous military campaigns and expanded Egypt\'s empire to its greatest extent.',
      'Considered a military genius.',
      'He was co-regent with his stepmother, Hatshepsut.',
    ],
    clue: 'I was a great military leader who expanded Egypt\'s empire to its largest size.',
  },
  {
    name: 'Khufu',
    reign: 'c. 2589–2566 BC',
    dynasty: '4th Dynasty',
    facts: [
      'Commissioned the Great Pyramid of Giza.',
      'The Great Pyramid is the oldest and largest of the three pyramids in the Giza pyramid complex.',
      'Not much is known about his reign beyond the construction of the pyramid.',
    ],
    clue: 'I built the Great Pyramid of Giza, one of the Seven Wonders of the Ancient World.',
  },
];
