export interface Riddle {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface RiddleLevel {
  level: number;
  title: string;
  riddles: Riddle[];
  timeLimit: number; // in seconds
}

export const riddleLevels: RiddleLevel[] = [
  {
    level: 1,
    title: 'Novice Scribe',
    timeLimit: 90,
    riddles: [
      { question: "I flow through Egypt, bringing life to the desert. What am I?", options: ["The Mediterranean Sea", "The Nile River", "The Red Sea", "The Sahara"], correctAnswer: 1, explanation: "The Nile River was the lifeline of ancient Egypt, providing water, food, and transportation." },
      { question: "I stand guard with the body of a lion and the head of a pharaoh. What am I?", options: ["The Great Pyramid", "The Sphinx", "A Temple", "A Colossus"], correctAnswer: 1, explanation: "The Great Sphinx of Giza is one of the world's largest and oldest statues." },
      { question: "I am a sacred writing system using pictures and symbols. What am I?", options: ["Cuneiform", "Hieroglyphics", "Latin", "Sanskrit"], correctAnswer: 1, explanation: "Hieroglyphics were the formal writing system of ancient Egypt." },
    ]
  },
  {
    level: 2,
    title: 'Adept Priest',
    timeLimit: 75,
    riddles: [
      { question: "I am the god of the afterlife with the head of a jackal. Who am I?", options: ["Ra", "Anubis", "Horus", "Osiris"], correctAnswer: 1, explanation: "Anubis is the jackal-headed god who guides souls and weighs their hearts in the afterlife." },
      { question: "I am the young pharaoh whose tomb was discovered nearly intact in 1922. Who am I?", options: ["Ramesses II", "Tutankhamun", "Akhenaten", "Thutmose III"], correctAnswer: 1, explanation: "King Tutankhamun's tomb was discovered by Howard Carter, revealing incredible treasures." },
      { question: "I am the process used to preserve bodies for the afterlife. What am I?", options: ["Cremation", "Burial", "Mummification", "Preservation"], correctAnswer: 2, explanation: "Mummification was the ancient Egyptian method of preserving bodies for eternal life." },
    ]
  },
  {
    level: 3,
    title: 'Royal Vizier',
    timeLimit: 60,
    riddles: [
      { question: "I was the female pharaoh who dressed as a man and built great monuments. Who am I?", options: ["Cleopatra", "Nefertiti", "Hatshepsut", "Nefertari"], correctAnswer: 2, explanation: "Hatshepsut was one of the most successful female pharaohs, known for her building projects." },
      { question: "I am the falcon-headed god of the sky and kingship. Who am I?", options: ["Set", "Horus", "Thoth", "Sobek"], correctAnswer: 1, explanation: "Horus, the falcon god, was associated with pharaohs and his eye became a symbol of protection." },
      { question: "I am the last pharaoh of Egypt, known for my relationships with Caesar and Marc Antony. Who am I?", options: ["Cleopatra VII", "Nefertiti", "Hatshepsut", "Ankhesenamun"], correctAnswer: 0, explanation: "Cleopatra VII was the last active pharaoh of Egypt before it became a Roman province." },
    ]
  },
  {
    level: 4,
    title: 'Living God',
    timeLimit: 45,
    riddles: [
      { question: "I am the only surviving Wonder of the Ancient World. What am I?", options: ["The Hanging Gardens", "The Great Pyramid", "The Lighthouse", "The Temple of Artemis"], correctAnswer: 1, explanation: "The Great Pyramid of Giza is the oldest and only remaining Wonder of the Ancient World." },
      { question: "I am the ancient Egyptian concept of truth, justice, and cosmic order. What am I?", options: ["Ka", "Ba", "Ma'at", "Akh"], correctAnswer: 2, explanation: "Ma'at represented truth and order, symbolized by a feather used in the weighing of hearts." },
      { question: "I am the plant that grows along the Nile, used to make paper in ancient times. What am I?", options: ["Reed", "Papyrus", "Lotus", "Palm"], correctAnswer: 1, explanation: "Papyrus was used to make an early form of paper and was crucial for record-keeping." },
    ]
  },
];
