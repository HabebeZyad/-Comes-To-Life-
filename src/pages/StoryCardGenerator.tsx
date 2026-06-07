import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  Copy, 
  Sparkles, 
  Globe, 
  Languages, 
  BookOpen, 
  Plus, 
  Check, 
  ChevronLeft,
  Palette,
  FileText,
  Scroll,
  Compass,
  Library,
  Heart,
  Flame
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ── Quote data ────────────────────────────────────────────────────────────────
interface Quote {
  id: number;
  ar: string;
  en: string;
  author: string;
  authorEn: string;
  work: string;
  workEn: string;
  year: string;
  category: "ancient" | "identity" | "philosophy" | "love" | "freedom";
}

const QUOTES: Quote[] = [
  {
    id: 1,
    ar: "الإنسان يعيش بأمله لا بواقعه، والأمل وهم جميل.",
    en: "Man lives by his hope, not his reality — and hope is a beautiful illusion.",
    author: "نجيب محفوظ",
    authorEn: "Naguib Mahfouz",
    work: "أولاد حارتنا",
    workEn: "Children of the Alley",
    year: "1959",
    category: "philosophy",
  },
  {
    id: 2,
    ar: "الحب لا يُقاس بما تقوله، بل بما تصمت عنه.",
    en: "Love is not measured by what you say, but by what you leave unspoken.",
    author: "يوسف إدريس",
    authorEn: "Yusuf Idris",
    work: "أرخص ليالي",
    workEn: "The Cheapest Nights",
    year: "1954",
    category: "love",
  },
  {
    id: 3,
    ar: "مصر ليست بلداً نسكنه، بل بلد يسكننا.",
    en: "Egypt is not a country we inhabit — it is a country that inhabits us.",
    author: "طه حسين",
    authorEn: "Taha Hussein",
    work: "الأيام",
    workEn: "The Days",
    year: "1929",
    category: "identity",
  },
  {
    id: 4,
    ar: "الكلمة سلاح من لا سلاح له، وضوء من لا نور عنده.",
    en: "Words are the weapon of the weaponless, and light for those who have no lantern.",
    author: "توفيق الحكيم",
    authorEn: "Tawfiq al-Hakim",
    work: "عودة الروح",
    workEn: "Return of the Spirit",
    year: "1933",
    category: "identity",
  },
  {
    id: 5,
    ar: "في القاهرة، حتى الفقر له جماله الخاص وعزته.",
    en: "In Cairo, even poverty has its own beauty and dignity.",
    author: "نجيب محفوظ",
    authorEn: "Naguib Mahfouz",
    work: "زقاق المدق",
    workEn: "Midaq Alley",
    year: "1947",
    category: "identity",
  },
  {
    id: 6,
    ar: "الحرية ليست أن تفعل ما تشاء، بل أن تشاء ما هو حق.",
    en: "Freedom is not doing whatever you wish — it is wishing what is right.",
    author: "طه حسين",
    authorEn: "Taha Hussein",
    work: "مستقبل الثقافة في مصر",
    workEn: "The Future of Culture in Egypt",
    year: "1938",
    category: "freedom",
  },
  {
    id: 7,
    ar: "الخوف لا يمنع من الموت ولكنه يمنع من الحياة.",
    en: "Fear does not prevent death, but it prevents life.",
    author: "نجيب محفوظ",
    authorEn: "Naguib Mahfouz",
    work: "بداية ونهاية",
    workEn: "Beginning and an End",
    year: "1949",
    category: "philosophy",
  },
  {
    id: 8,
    ar: "القارئ يولد مع كل كتاب يقرأه.",
    en: "A reader is born with every book they read.",
    author: "نجيب محفوظ",
    authorEn: "Naguib Mahfouz",
    work: "أصداء السيرة الذاتية",
    workEn: "Echoes of an Autobiography",
    year: "1995",
    category: "philosophy",
  },
  {
    id: 9,
    ar: "قد يبدو لك أن كل شيء ينهار، ولكنها مجرد البداية لبناء شيء أفضل.",
    en: "It may seem to you that everything is collapsing, but it is just the beginning of building something better.",
    author: "نجيب محفوظ",
    authorEn: "Naguib Mahfouz",
    work: "حضرة المحترم",
    workEn: "Respected Sir",
    year: "1975",
    category: "philosophy",
  },
  {
    id: 10,
    ar: "الثقافة هي ما يبقى بعد أن تنسى كل ما تعلمته في المدرسة.",
    en: "Culture is what remains after you have forgotten everything you learned in school.",
    author: "نجيب محفوظ",
    authorEn: "Naguib Mahfouz",
    work: "حديث الصباح والمساء",
    workEn: "Morning and Evening Talk",
    year: "1987",
    category: "philosophy",
  },
  {
    id: 11,
    ar: "إن أصعب القرارات هي تلك التي نتخذها ونحن نعلم أنه لا عودة منها.",
    en: "The hardest decisions are those we make knowing there is no turning back.",
    author: "يوسف إدريس",
    authorEn: "Yusuf Idris",
    work: "العسكري الأسود",
    workEn: "The Black Policeman",
    year: "1962",
    category: "freedom",
  },
  {
    id: 12,
    ar: "التعليم كالماء والهواء.",
    en: "Education is like water and air.",
    author: "طه حسين",
    authorEn: "Taha Hussein",
    work: "مستقبل الثقافة في مصر",
    workEn: "The Future of Culture in Egypt",
    year: "1938",
    category: "freedom",
  },
  {
    id: 13,
    ar: "الفن ليس ترفاً، بل هو ضرورة لحياة الروح وتكامل الإنسان.",
    en: "Art is not a luxury; it is a necessity for the life of the soul and the integration of man.",
    author: "توفيق الحكيم",
    authorEn: "Tawfiq al-Hakim",
    work: "عصفور من الشرق",
    workEn: "A Bird from the East",
    year: "1938",
    category: "philosophy",
  },
  {
    id: 14,
    ar: "الحرية الحقيقية هي حرية الفكر، فبدونها يكون الإنسان مجرد آلة.",
    en: "True freedom is freedom of thought; without it, man is merely a machine.",
    author: "توفيق الحكيم",
    authorEn: "Tawfiq al-Hakim",
    work: "أريد أن أقتل",
    workEn: "I Want to Kill",
    year: "1953",
    category: "freedom",
  },
  {
    id: 15,
    ar: "الوحشة ليست في انعدام البشر، بل في انعدام من يفهمونك.",
    en: "Loneliness is not in the absence of people, but in the absence of those who understand you.",
    author: "رضوى عاشور",
    authorEn: "Radwa Ashour",
    work: "ثلاثية غرناطة",
    workEn: "Granada Trilogy",
    year: "1994",
    category: "love",
  },
  {
    id: 16,
    ar: "لكل شيء في هذه الدنيا نهاية، إلا الحلم فإنه يمتد حتى بعد الموت.",
    en: "Everything in this world has an end, except the dream, which extends even after death.",
    author: "رضوى عاشور",
    authorEn: "Radwa Ashour",
    work: "ثلاثية غرناطة",
    workEn: "Granada Trilogy",
    year: "1994",
    category: "freedom",
  },
  {
    id: 17,
    ar: "الحزن لا يغير شيئاً، لكن الصبر يغير كل شيء.",
    en: "Sadness changes nothing, but patience changes everything.",
    author: "رضوى عاشور",
    authorEn: "Radwa Ashour",
    work: "الطنطورية",
    workEn: "The Woman from Tantoura",
    year: "2010",
    category: "philosophy",
  },
  {
    id: 18,
    ar: "لا أحد يملك الحقيقة المطلقة، وكل منا يرى جانباً منها فقط.",
    en: "No one owns the absolute truth; each of us sees only a side of it.",
    author: "بهاء طاهر",
    authorEn: "Bahaa Taher",
    work: "واحة الغروب",
    workEn: "Sunset Oasis",
    year: "2006",
    category: "philosophy",
  },
  {
    id: 19,
    ar: "الحب الحقيقي لا يذبل بالغياب، بل يزداد عمقاً وقوة.",
    en: "True love does not wither in absence; it increases in depth and strength.",
    author: "بهاء طاهر",
    authorEn: "Bahaa Taher",
    work: "الحب في المنفى",
    workEn: "Love in Exile",
    year: "1995",
    category: "love",
  },
  {
    id: 20,
    ar: "أنا لا أقرأ لأكتب، بل أقرأ لأعيش حياة أخرى.",
    en: "I do not read to write; I read to live another life.",
    author: "عباس محمود العقاد",
    authorEn: "Abbas Mahmoud al-Akkad",
    work: "أنا",
    workEn: "I",
    year: "1964",
    category: "philosophy",
  },
  {
    id: 21,
    ar: "الخوف من الفشل هو أول خطوة نحو الفشل نفسه.",
    en: "Fear of failure is the first step toward failure itself.",
    author: "عباس محمود العقاد",
    authorEn: "Abbas Mahmoud al-Akkad",
    work: "ساعات بين الكتب",
    workEn: "Hours Among Books",
    year: "1927",
    category: "philosophy",
  },
  {
    id: 22,
    ar: "إن القراءة تضيف إلى عمر الإنسان أعماراً أخرى.",
    en: "Reading adds other lifetimes to a person's lifespan.",
    author: "عباس محمود العقاد",
    authorEn: "Abbas Mahmoud al-Akkad",
    work: "الفلسفة القرآنية",
    workEn: "Quranic Philosophy",
    year: "1947",
    category: "philosophy",
  },
  {
    id: 23,
    ar: "لا بد للمرء أن يختار طريقه في الحياة، حتى لو كان هذا الطريق وعراً.",
    en: "One must choose their path in life, even if that path is rugged.",
    author: "لطيفة الزيات",
    authorEn: "Latifa al-Zayyat",
    work: "الباب المفتوح",
    workEn: "The Open Door",
    year: "1960",
    category: "freedom",
  },
  {
    id: 24,
    ar: "الحرية لا تُوهب، بل تُؤخذ بالعمل والكفاح.",
    en: "Freedom is not granted; it is taken through action and struggle.",
    author: "لطيفة الزيات",
    authorEn: "Latifa al-Zayyat",
    work: "الباب المفتوح",
    workEn: "The Open Door",
    year: "1960",
    category: "freedom",
  },
  {
    id: 25,
    ar: "الرحمة هي جوهر الإنسانية، فبدونها نتحول إلى وحوش ضارية.",
    en: "Mercy is the essence of humanity; without it, we turn into ravenous beasts.",
    author: "مصطفى لطفي المنفلوطي",
    authorEn: "Mustafa Lutfi al-Manfaluti",
    work: "العبرات",
    workEn: "The Tears",
    year: "1915",
    category: "love",
  },
  {
    id: 26,
    ar: "السعادة ليست في جمع المال، بل في راحة البال ونقاء الضمير.",
    en: "Happiness is not in gathering money, but in peace of mind and purity of conscience.",
    author: "مصطفى لطفي المنفلوطي",
    authorEn: "Mustafa Lutfi al-Manfaluti",
    work: "النظرات",
    workEn: "The Views",
    year: "1910",
    category: "love",
  },
  {
    id: 27,
    ar: "الكلمات الطيبة أندر من حجر الزمرد، ومع ذلك يمكن العثور عليها بين خادمات طحن الدقيق.",
    en: "Good speech is more hidden than emeralds, yet it may be found among maidens at the grindstones.",
    author: "بتاح حتب",
    authorEn: "Ptahhotep",
    work: "حكم بتاح حتب",
    workEn: "Maxims of Ptahhotep",
    year: "2400 ق.م",
    category: "ancient",
  },
  {
    id: 28,
    ar: "إذا صرت عظيماً بعد أن كنت صغيراً، فلا تنسى كيف كان الحال قبل ذلك.",
    en: "If you are great after you were small, do not forget how it was before.",
    author: "بتاح حتب",
    authorEn: "Ptahhotep",
    work: "حكم بتاح حتب",
    workEn: "Maxims of Ptahhotep",
    year: "2400 ق.م",
    category: "ancient",
  },
  {
    id: 29,
    ar: "المرء يخطط في قلبه، ولكن الأقدار هي التي تخطو به.",
    en: "Man plans in his heart, but destiny determines his steps.",
    author: "أمنموبي",
    authorEn: "Amenemope",
    work: "تعاليم أمنموبي",
    workEn: "Instruction of Amenemope",
    year: "1100 ق.م",
    category: "ancient",
  },
  {
    id: 30,
    ar: "لا تنم وفي قلبك خوف من الغد، لأن الصباح ينتمي للإله وليس للبشر.",
    en: "Do not sleep with fear of tomorrow, for the morning belongs to God, not to man.",
    author: "أمنموبي",
    authorEn: "Amenemope",
    work: "تعاليم أمنموبي",
    workEn: "Instruction of Amenemope",
    year: "1100 ق.م",
    category: "ancient",
  },
  {
    id: 31,
    ar: "ابحث عن الصمت والهدوء، ففي السكون تكمن قوة العقل الحقيقية.",
    en: "Seek silence and tranquility, for in quietude lies the true power of the mind.",
    author: "أني",
    authorEn: "Ani",
    work: "تعاليم أني",
    workEn: "Instruction of Ani",
    year: "1300 ق.م",
    category: "ancient",
  },
  {
    id: 32,
    ar: "حين يعود المرء إلى وطنه، تهدأ الروح وتستريح النبضات المتعبة.",
    en: "When a man returns to his homeland, the soul finds peace and the weary heartbeat rests.",
    author: "سنهت",
    authorEn: "Sinuhe",
    work: "مغامرات سنهت",
    workEn: "The Tale of Sinuhe",
    year: "1900 ق.م",
    category: "ancient",
  },
  {
    id: 33,
    ar: "القاهرة ليست مجرد مدينة، إنها مسرح للتاريخ وتجسيد للروح الإنسانية.",
    en: "Cairo is not just a city; it is a theater of history and the embodiment of the human spirit.",
    author: "نجيب محفوظ",
    authorEn: "Naguib Mahfouz",
    work: "زقاق المدق",
    workEn: "Midaq Alley",
    year: "1947",
    category: "identity",
  },
  {
    id: 34,
    ar: "مصر وطن لا يغيب عن البال، ونيلها يجري في عروقنا مجرى الحياة.",
    en: "Egypt is a homeland that never leaves the mind, and its Nile flows in our veins like life itself.",
    author: "طه حسين",
    authorEn: "Taha Hussein",
    work: "الأيام",
    workEn: "The Days",
    year: "1929",
    category: "identity",
  },
  {
    id: 35,
    ar: "الجغرافيا هي جسد مصر، والتاريخ هو روحها، والإنسان المصري هو عقلها المفكر.",
    en: "Geography is Egypt's body, history is its soul, and the Egyptian is its thinking mind.",
    author: "جمال حمدان",
    authorEn: "Gamal Hamdan",
    work: "شخصية مصر",
    workEn: "The Character of Egypt",
    year: "1967",
    category: "identity",
  },
  {
    id: 36,
    ar: "الرحمة هي أعلى درجات الحب، والقلب الذي لا يرحم لا يمكنه أن يحب حقاً.",
    en: "Mercy is the highest form of love, and the heart that does not show mercy cannot truly love.",
    author: "يوسف إدريس",
    authorEn: "Yusuf Idris",
    work: "الحرام",
    workEn: "The Sin",
    year: "1959",
    category: "love",
  },
  {
    id: 37,
    ar: "الحب هو أن ترى العالم في عيني من تحب، وتجد السلام في صوته.",
    en: "Love is seeing the world through the eyes of the one you love, and finding peace in their voice.",
    author: "رضوى عاشور",
    authorEn: "Radwa Ashour",
    work: "أطياف",
    workEn: "Specters",
    year: "1999",
    category: "love",
  },
  {
    id: 38,
    ar: "المحبة لا تولد بالوعود، بل تنمو بالصمت والمشاركة الصادقة في الأفراح والأحزان.",
    en: "Love is not born of promises; it grows through silence and sincere sharing in joys and sorrows.",
    author: "بهاء طاهر",
    authorEn: "Bahaa Taher",
    work: "خالتي صفية والدير",
    workEn: "Aunt Safiyya and the Monastery",
    year: "1991",
    category: "love",
  },
  {
    id: 39,
    ar: "لا يمكن أن نكون أحراراً ما لم نحرر عقولنا من الخوف والتبعية.",
    en: "We cannot be free unless we liberate our minds from fear and dependency.",
    author: "لطيفة الزيات",
    authorEn: "Latifa al-Zayyat",
    work: "البحث",
    workEn: "The Search",
    year: "1992",
    category: "freedom",
  },
  {
    id: 40,
    ar: "السجن الحقيقي هو أن تحبس نفسك في زنزانة اليأس، بينما الفضاء الخارجي ينتظر خطوتك.",
    en: "The real prison is locking yourself in the dungeon of despair, while the open space awaits your step.",
    author: "رضوى عاشور",
    authorEn: "Radwa Ashour",
    work: "الفرج",
    workEn: "Blue Lorries",
    year: "2008",
    category: "freedom",
  },
  {
    id: 41,
    ar: "الحرية تبدأ من الداخل؛ من قدرة المرء على قول لا للظلم والجهل.",
    en: "Freedom begins from within; from one's ability to say no to injustice and ignorance.",
    author: "توفيق الحكيم",
    authorEn: "Tawfiq al-Hakim",
    work: "سجن العمر",
    workEn: "The Prison of Life",
    year: "1964",
    category: "freedom",
  },
  {
    id: 42,
    ar: "الحياة لا تمنح أسرارها إلا لمن يبحث عنها بجد وصدق.",
    en: "Life does not grant its secrets except to those who search for them with diligence and sincerity.",
    author: "نجيب محفوظ",
    authorEn: "Naguib Mahfouz",
    work: "اللص والكلاب",
    workEn: "The Thief and the Dogs",
    year: "1961",
    category: "philosophy",
  },
  {
    id: 43,
    ar: "الحياة قطار سريع، وأجمل ما فيه هو الرحلة نفسها لا محطة الوصول.",
    en: "Life is a fast train, and the most beautiful part of it is the journey itself, not the destination.",
    author: "عباس محمود العقاد",
    authorEn: "Abbas Mahmoud al-Akkad",
    work: "حياة قلم",
    workEn: "The Life of a Pen",
    year: "1957",
    category: "philosophy",
  },
  {
    id: 44,
    ar: "الشك هو أول مراتب اليقين، والبحث المستمر هو جوهر الحقيقة الإنسانية.",
    en: "Doubt is the first degree of certainty, and continuous search is the essence of human truth.",
    author: "طه حسين",
    authorEn: "Taha Hussein",
    work: "في الشعر الجاهلي",
    workEn: "On Pre-Islamic Poetry",
    year: "1926",
    category: "philosophy",
  },
  {
    id: 45,
    ar: "لا تفخر بجهلك أو علمك، بل استمع لكلام الجميع، فالكمال في المعرفة لا يمكن بلوغه.",
    en: "Do not be proud of your ignorance or your knowledge, but listen to all, for perfection in wisdom is unreachable.",
    author: "بتاح حتب",
    authorEn: "Ptahhotep",
    work: "حكم بتاح حتب",
    workEn: "Maxims of Ptahhotep",
    year: "2400 ق.م",
    category: "ancient",
  },
  {
    id: 46,
    ar: "اللسان كالميزان، والعدالة هي الوزن الحقيقي له.",
    en: "The tongue is like a scale, and justice is its true weight.",
    author: "أني",
    authorEn: "Ani",
    work: "تعاليم أني",
    workEn: "Instruction of Ani",
    year: "1300 ق.م",
    category: "ancient",
  },
  {
    id: 47,
    ar: "الحق باقٍ لا يزول، وهو الذي ينزل مع صاحبه إلى القبر.",
    en: "Truth is eternal and does not perish; it descends with its bearer into the tomb.",
    author: "بردية الفلاح الفصيح",
    authorEn: "The Eloquent Peasant",
    work: "شكاوى الفلاح الفصيح",
    workEn: "The Tale of the Eloquent Peasant",
    year: "1850 ق.م",
    category: "ancient",
  },
  {
    id: 48,
    ar: "مصر ليست مجرد رقعة جغرافية، بل هي صانعة التاريخ ومهد الحضارات.",
    en: "Egypt is not merely a geographical patch; it is the maker of history and the cradle of civilizations.",
    author: "جمال حمدان",
    authorEn: "Gamal Hamdan",
    work: "شخصية مصر",
    workEn: "The Character of Egypt",
    year: "1967",
    category: "identity",
  },
  {
    id: 49,
    ar: "النيل هو الذي وهب مصر الحياة، والمصريون هم الذين وهبوها الخلود.",
    en: "The Nile granted Egypt its life, and the Egyptians granted it its immortality.",
    author: "نجيب محفوظ",
    authorEn: "Naguib Mahfouz",
    work: "كفاح طيبة",
    workEn: "The Struggle of Thebes",
    year: "1944",
    category: "identity",
  },
  {
    id: 50,
    ar: "إن حارة نجيب محفوظ هي العالم بأسره، ومنها ننطلق إلى فهم الوجود.",
    en: "Naguib Mahfouz's alley is the entire world; from it, we embark on understanding existence.",
    author: "يوسف إدريس",
    authorEn: "Yusuf Idris",
    work: "حديث القرية",
    workEn: "Village Talk",
    year: "1980",
    category: "identity",
  },
  {
    id: 51,
    ar: "إن العقل البشري لا يقبل القيود، والبحث عن المعرفة هو الحياة نفسها.",
    en: "The human mind accepts no constraints, and the search for knowledge is life itself.",
    author: "طه حسين",
    authorEn: "Taha Hussein",
    work: "من حديث الشعر والنثر",
    workEn: "Of Poetry and Prose",
    year: "1936",
    category: "philosophy",
  },
  {
    id: 52,
    ar: "الموت ليس نهاية المطاف، بل هو انتقال من حالة مؤقتة إلى حالة أبدية.",
    en: "Death is not the end of the journey; it is a transition from a temporary state to an eternal one.",
    author: "نجيب محفوظ",
    authorEn: "Naguib Mahfouz",
    work: "ملحمة الحرافيش",
    workEn: "The Harafish",
    year: "1977",
    category: "philosophy",
  },
  {
    id: 53,
    ar: "الزمن هو النهر الذي نسبح فيه جميعاً، والذكريات هي الحصى المتبقي في القاع.",
    en: "Time is the river in which we all swim, and memories are the pebbles left at the bottom.",
    author: "بهاء طاهر",
    authorEn: "Bahaa Taher",
    work: "نقطة نور",
    workEn: "Point of Light",
    year: "2001",
    category: "philosophy",
  },
  {
    id: 54,
    ar: "القلق ليس مرضاً، بل هو دليل على يقظة الضمير وبداية البحث عن الحقيقة.",
    en: "Anxiety is not a disease; it is proof of an awakened conscience and the start of searching for truth.",
    author: "عباس محمود العقاد",
    authorEn: "Abbas Mahmoud al-Akkad",
    work: "التفكير فريضة إسلامية",
    workEn: "Thinking is an Islamic Duty",
    year: "1952",
    category: "philosophy",
  },
  {
    id: 55,
    ar: "الحب هو القوة الوحيدة القادرة على تحويل العداوة إلى صداقة والظلمة إلى نور.",
    en: "Love is the only power capable of turning enmity into friendship and darkness into light.",
    author: "مصطفى لطفي المنفلوطي",
    authorEn: "Mustafa Lutfi al-Manfaluti",
    work: "الشاعر",
    workEn: "The Poet",
    year: "1921",
    category: "love",
  },
  {
    id: 56,
    ar: "لم أكن أعرف أن الحب يمكن أن يجعل الإنسان رقيقاً إلى حد البكاء من أجل ورقة شجر.",
    en: "I did not know love could make a person so gentle as to weep for a single leaf.",
    author: "رضوى عاشور",
    authorEn: "Radwa Ashour",
    work: "قطعة من أوروبا",
    workEn: "A Piece of Europe",
    year: "2003",
    category: "love",
  },
  {
    id: 57,
    ar: "الحب لا يأتي بالبحث، بل يأتي بغتة كالمطر المنعش بعد جفاف طويل.",
    en: "Love does not come by searching; it comes suddenly like refreshing rain after a long drought.",
    author: "يوسف إدريس",
    authorEn: "Yusuf Idris",
    work: "النداهة",
    workEn: "The Siren",
    year: "1969",
    category: "love",
  },
  {
    id: 58,
    ar: "الحرية لا يمكن تجزئتها، فإما أن نكون أحراراً بالكامل أو نظل عبيداً تحت أسماء مختلفة.",
    en: "Freedom cannot be partitioned; we are either entirely free or we remain slaves under different names.",
    author: "لطيفة الزيات",
    authorEn: "Latifa al-Zayyat",
    work: "صاحب البيت",
    workEn: "The Owner of the House",
    year: "1994",
    category: "freedom",
  },
  {
    id: 59,
    ar: "الكفاح من أجل العدالة ليس خياراً، بل هو الواجب الأخلاقي الأول لكل إنسان.",
    en: "The struggle for justice is not an option; it is the primary moral duty of every human being.",
    author: "رضوى عاشور",
    authorEn: "Radwa Ashour",
    work: "الطنطورية",
    workEn: "The Woman from Tantoura",
    year: "2010",
    category: "freedom",
  },
  {
    id: 60,
    ar: "ما دامت هناك فكرة حية، فإن القيود والسجون لن تستطيع كتمان الحقيقة.",
    en: "As long as there is a living idea, chains and prisons will never succeed in silencing the truth.",
    author: "توفيق الحكيم",
    authorEn: "Tawfiq al-Hakim",
    work: "سلطان الظلام",
    workEn: "The Sultan of Darkness",
    year: "1941",
    category: "freedom",
  },
  {
    id: 61,
    ar: "لا تصنع الخوف بين الناس، لأن الإله يعاقب بمثل ما تفعل.",
    en: "Do not cause fear among people, for God punishes with the same measure.",
    author: "بتاح حتب",
    authorEn: "Ptahhotep",
    work: "حكم بتاح حتب",
    workEn: "Maxims of Ptahhotep",
    year: "2400 ق.م",
    category: "ancient",
  },
  {
    id: 62,
    ar: "عامل من هو أكبر منك سناً بالاحترام والتوقير، لكي ينعم أبناؤك بنفس المعاملة.",
    en: "Treat your elders with respect and reverence, so that your children may receive the same treatment.",
    author: "أني",
    authorEn: "Ani",
    work: "تعاليم أني",
    workEn: "Instruction of Ani",
    year: "1300 ق.م",
    category: "ancient",
  },
  {
    id: 63,
    ar: "اجعل بيتك مفتوحاً للغريب، وقاسم المحتاج خبزك، يبارك الإله في رزقك.",
    en: "Keep your house open to the stranger, and share your bread with the needy; God will bless your sustenance.",
    author: "أمنموبي",
    authorEn: "Amenemope",
    work: "تعاليم أمنموبي",
    workEn: "Instruction of Amenemope",
    year: "1100 ق.م",
    category: "ancient",
  },
  {
    id: 64,
    ar: "مصر ليست مجرد جغرافيا، إنها فكرة، حضارة، وروح تسري في عروق الزمن.",
    en: "Egypt is not merely geography; it is an idea, a civilization, and a spirit running through the veins of time.",
    author: "جمال حمدان",
    authorEn: "Gamal Hamdan",
    work: "شخصية مصر",
    workEn: "The Character of Egypt",
    year: "1967",
    category: "identity",
  },
  {
    id: 65,
    ar: "من فقد حارته فقد هويته، ومن فقد هويته تاه في دروب العالم.",
    en: "He who loses his alley loses his identity, and he who loses his identity gets lost in the paths of the world.",
    author: "نجيب محفوظ",
    authorEn: "Naguib Mahfouz",
    work: "الحرافيش",
    workEn: "The Harafish",
    year: "1977",
    category: "identity",
  },
  {
    id: 66,
    ar: "النيل لا يروي الأرض فقط، بل يروي حكايات أجيال تعاقبت على ضفافه.",
    en: "The Nile does not only water the land; it waters the tales of generations that succeeded on its banks.",
    author: "طه حسين",
    authorEn: "Taha Hussein",
    work: "على هامش السيرة",
    workEn: "On the Margin of the Prophet's Life",
    year: "1933",
    category: "identity",
  },
  {
    id: 67,
    ar: "العقل كالمصباح، إن لم تزوده بزيت القراءة والمعرفة انطفأ نوره.",
    en: "The mind is like a lamp; if you do not supply it with the oil of reading and knowledge, its light will go out.",
    author: "عباس محمود العقاد",
    authorEn: "Abbas Mahmoud al-Akkad",
    work: "حياة قلم",
    workEn: "The Life of a Pen",
    year: "1957",
    category: "philosophy",
  },
  {
    id: 68,
    ar: "الحقيقة صخرة تتكسر عليها أوهام الكاذبين، وتتحصن بها نفوس المخلصين.",
    en: "Truth is a rock upon which the illusions of liars break, and within which the souls of the sincere are fortified.",
    author: "نجيب محفوظ",
    authorEn: "Naguib Mahfouz",
    work: "الشحاذ",
    workEn: "The Beggar",
    year: "1965",
    category: "philosophy",
  },
  {
    id: 69,
    ar: "ما دامت الحياة رحلة قصيرة، فإن قيمة الإنسان تقاس بما يتركه من أثر طيب.",
    en: "Since life is a short journey, a person's value is measured by the good impact they leave behind.",
    author: "مصطفى لطفي المنفلوطي",
    authorEn: "Mustafa Lutfi al-Manfaluti",
    work: "النظرات",
    workEn: "The Views",
    year: "1910",
    category: "philosophy",
  },
  {
    id: 70,
    ar: "الحب هو الموسيقى التي تعزفها القلوب المتآلفة، فتملأ الكون بهجة وسلاماً.",
    en: "Love is the music played by harmonious hearts, filling the universe with joy and peace.",
    author: "توفيق الحكيم",
    authorEn: "Tawfiq al-Hakim",
    work: "عصفور من الشرق",
    workEn: "A Bird from the East",
    year: "1938",
    category: "love",
  },
  {
    id: 71,
    ar: "لا توجد قوة في الأرض تستطيع أن تنزع حباً حقيقياً استقر في عمق الوجدان.",
    en: "There is no power on earth that can tear away a true love that has settled in the depths of the soul.",
    author: "رضوى عاشور",
    authorEn: "Radwa Ashour",
    work: "ثلاثية غرناطة",
    workEn: "Granada Trilogy",
    year: "1994",
    category: "love",
  },
  {
    id: 72,
    ar: "الحب الحقيقي يبدأ حين نتخلى عن أنفسنا لنسعد من نحب.",
    en: "True love begins when we give up ourselves to make the one we love happy.",
    author: "بهاء طاهر",
    authorEn: "Bahaa Taher",
    work: "الحب في المنفى",
    workEn: "Love in Exile",
    year: "1995",
    category: "love",
  },
  {
    id: 73,
    ar: "الحرية شجرة تروى بدماء الشهداء وعرق الأحرار، وتثمر كرامة وعزة.",
    en: "Freedom is a tree watered by the blood of martyrs and the sweat of the free, bearing dignity and pride.",
    author: "لطيفة الزيات",
    authorEn: "Latifa al-Zayyat",
    work: "الباب المفتوح",
    workEn: "The Open Door",
    year: "1960",
    category: "freedom",
  },
  {
    id: 74,
    ar: "إن الصوت الحر لا يمكن كتمانه، وسيظل يتردد في الآفاق حتى يتحقق العدل.",
    en: "The free voice cannot be silenced; it will continue to echo in the horizons until justice is achieved.",
    author: "يوسف إدريس",
    authorEn: "Yusuf Idris",
    work: "العسكري الأسود",
    workEn: "The Black Policeman",
    year: "1962",
    category: "freedom",
  },
  {
    id: 75,
    ar: "السجان يمكنه قيد الجسد، ولكنه يعجز تماماً عن سجن الفكرة الحرة السابحة في الفضاء.",
    en: "The jailer can chain the body, but is completely powerless to imprison the free idea swimming in space.",
    author: "رضوى عاشور",
    authorEn: "Radwa Ashour",
    work: "الفرج",
    workEn: "Blue Lorries",
    year: "2008",
    category: "freedom",
  },
  {
    id: 76,
    ar: "إذا جلست مع جماعة لتناول الطعام، فكُن قنوعاً بما يُقدّم لك، فالقناعة شرف عظيم.",
    en: "If you sit with a company to eat, be content with what is offered; for contentment is a great honor.",
    author: "كاجمني",
    authorEn: "Kagemni",
    work: "تعاليم كاجمني",
    workEn: "Instruction of Kagemni",
    year: "2600 ق.م",
    category: "ancient",
  },
  {
    id: 77,
    ar: "تكلّم بشجاعة حين يوجه إليك الحديث، فالقلب الشجاع ينجي صاحبه من المحن.",
    en: "Speak courageously when spoken to; for a brave heart saves its owner from hardships.",
    author: "الملاح الغريق",
    authorEn: "The Shipwrecked Sailor",
    work: "قصة الملاح الغريق",
    workEn: "The Tale of the Shipwrecked Sailor",
    year: "2000 ق.م",
    category: "ancient",
  },
  {
    id: 78,
    ar: "املأ يومك بالفرح، ولا تدع الهموم تظلم قلبك، فما من أحد يأخذ معه متاعه حين يرحل.",
    en: "Fill your day with joy and let not worries darken your heart; for no one takes their possessions when they depart.",
    author: "عازف القيثارة",
    authorEn: "The Harper",
    work: "أغنية عازف القيثارة",
    workEn: "The Song of the Harper",
    year: "2100 ق.م",
    category: "ancient",
  },
  {
    id: 79,
    ar: "احذر من أولئك الذين يقتربون منك بالملق، فالصديق الحقيقي هو من يقف معك في الضيق.",
    en: "Beware of those who approach you with flattery; for a true friend is one who stands by you in adversity.",
    author: "أمنمحات الأول",
    authorEn: "Amenemhat I",
    work: "تعاليم أمنمحات",
    workEn: "Instruction of Amenemhat",
    year: "1900 ق.م",
    category: "ancient",
  },
  {
    id: 80,
    ar: "العدالة عظيمة وقوتها راسخة، ولم تُهزم منذ عهد الإله الخالق.",
    en: "Justice is great and its strength is enduring; it has not been defeated since the era of the Creator.",
    author: "بتاح حتب",
    authorEn: "Ptahhotep",
    work: "حكم بتاح حتب",
    workEn: "Maxims of Ptahhotep",
    year: "2400 ق.م",
    category: "ancient",
  },
  {
    id: 81,
    ar: "لا تثرثر بكثرة الكلام، فالصمت يحفظك من الندم ويعلي من شأنك بين الناس.",
    en: "Do not chatter with too many words; for silence saves you from regret and raises your stature among people.",
    author: "أني",
    authorEn: "Ani",
    work: "تعاليم أني",
    workEn: "Instruction of Ani",
    year: "1300 ق.م",
    category: "ancient",
  },
  {
    id: 82,
    ar: "الأمانة في الميزان هي أساس البركة، ومن يغش في المكيال يسلب نفسه السلام.",
    en: "Honesty in the balance is the basis of blessing; and he who cheats in the measure robs himself of peace.",
    author: "أمنموبي",
    authorEn: "Amenemope",
    work: "تعاليم أمنموبي",
    workEn: "Instruction of Amenemope",
    year: "1100 ق.م",
    category: "ancient",
  },
  {
    id: 83,
    ar: "إن حب الوطن يجري في دماء المغترب، ومهما ابتعد فإن قلبه يظل معلقاً بترابه.",
    en: "The love of one's homeland flows in the blood of the expatriate; no matter how far they wander, their heart remains attached to its dust.",
    author: "سنهت",
    authorEn: "Sinuhe",
    work: "مغامرات سنهت",
    workEn: "The Tale of Sinuhe",
    year: "1900 ق.م",
    category: "ancient",
  },
  {
    id: 84,
    ar: "تكلم بالحق واعمل بالعدل، فالعدالة هي عماد الوجود وبها تستقيم حياة البشر.",
    en: "Speak the truth and act with justice; for justice is the pillar of existence and by it the life of humankind is made straight.",
    author: "بردية الفلاح الفصيح",
    authorEn: "The Eloquent Peasant",
    work: "شكاوى الفلاح الفصيح",
    workEn: "The Tale of the Eloquent Peasant",
    year: "1850 ق.م",
    category: "ancient",
  },
  {
    id: 85,
    ar: "إلى من أتكلم اليوم؟ فالقلوب أصبحت قاسية، ولم يعد هناك من يسمع بوعي وتفهم.",
    en: "To whom do I speak today? Hearts have become hardened, and there is no longer anyone who listens with awareness and understanding.",
    author: "بردية مجادلة رجل مع روحه",
    authorEn: "Dispute of a Man with His Ba",
    work: "مجادلة رجل مع روحه",
    workEn: "Dispute Between a Man and His Ba",
    year: "2000 ق.م",
    category: "ancient",
  },
  {
    id: 86,
    ar: "كن لطيفاً وبشوش الوجه مع الجميع، فالوجه البشوش يفتح القلوب ويزيل الجفاء.",
    en: "Be gentle and cheerful of face with all; for a cheerful face opens hearts and removes estrangement.",
    author: "كاجمني",
    authorEn: "Kagemni",
    work: "تعاليم كاجمني",
    workEn: "Instruction of Kagemni",
    year: "2600 ق.م",
    category: "ancient",
  },
  {
    id: 87,
    ar: "من ينجو من المحنة يتعلم الحكمة، وتصبح تجربته مناراً للآخرين في دروب الحياة.",
    en: "He who survives adversity learns wisdom, and his experience becomes a beacon for others on the paths of life.",
    author: "الملاح الغريق",
    authorEn: "The Shipwrecked Sailor",
    work: "قصة الملاح الغريق",
    workEn: "The Tale of the Shipwrecked Sailor",
    year: "2000 ق.م",
    category: "ancient",
  },
  {
    id: 88,
    ar: "لا تكل أصدقاءك إلى وعود الأيام، بل ابذل الجهد لتحفظ العهد والود معهم.",
    en: "Do not entrust your friends to the promises of days; rather make the effort to preserve covenants and affection with them.",
    author: "أمنمحات الأول",
    authorEn: "Amenemhat I",
    work: "تعاليم أمنمحات",
    workEn: "Instruction of Amenemhat",
    year: "1900 ق.م",
    category: "ancient",
  },
  {
    id: 89,
    ar: "إذا صرت ناصحاً لشخص، فأصغِ إليه حتى يفرغ من كلامه، فالمشورة الطيبة تتطلب صبراً.",
    en: "If you become an adviser to someone, listen to them until they finish speaking; for good counsel requires patience.",
    author: "بتاح حتب",
    authorEn: "Ptahhotep",
    work: "حكم بتاح حتب",
    workEn: "Maxims of Ptahhotep",
    year: "2400 ق.م",
    category: "ancient",
  },
  {
    id: 90,
    ar: "انظر إلى القبور القديمة، هل عاد من هناك مخبر؟ لذا اتبع رغبات قلبك ما دمت حياً.",
    en: "Look at the ancient tombs, has anyone returned from there to tell? Therefore follow your heart's desires while you live.",
    author: "عازف القيثارة",
    authorEn: "The Harper",
    work: "أغنية عازف القيثارة",
    workEn: "The Song of the Harper",
    year: "2100 ق.م",
    category: "ancient",
  }
];

// ── Card themes ───────────────────────────────────────────────────────────────
interface Theme {
  id: string;
  label: string;
  labelAr: string;
  bg: string;
  accent: string;
  accentDim: string;
  text: string;
  sub: string;
  border: string;
  pattern: string;
}

const THEMES: Theme[] = [
  {
    id: "tomb",
    label: "Tomb",
    labelAr: "المقبرة",
    bg: "radial-gradient(circle at center, #1c1107 0%, #080401 100%)",
    accent: "#d4af37", // Gold
    accentDim: "rgba(212, 175, 55, 0.25)",
    text: "#f4ebd0",
    sub: "rgba(212, 175, 55, 0.6)",
    border: "rgba(212, 175, 55, 0.3)",
    pattern: "tomb",
  },
  {
    id: "sand",
    label: "Desert",
    labelAr: "الصحراء",
    bg: "linear-gradient(145deg, #2c1a0c 0%, #3e2612 50%, #211308 100%)",
    accent: "#f5b041", // Sandy Gold
    accentDim: "rgba(245, 176, 65, 0.2)",
    text: "#faf0e6",
    sub: "rgba(245, 176, 65, 0.65)",
    border: "rgba(245, 176, 65, 0.25)",
    pattern: "sand",
  },
  {
    id: "nile",
    label: "Nile",
    labelAr: "النيل",
    bg: "linear-gradient(145deg, #051422 0%, #0d273d 50%, #030a12 100%)",
    accent: "#3498db", // Lapis Light
    accentDim: "rgba(52, 152, 219, 0.2)",
    text: "#ecf0f1",
    sub: "rgba(52, 152, 219, 0.65)",
    border: "rgba(52, 152, 219, 0.25)",
    pattern: "nile",
  },
  {
    id: "papyrus",
    label: "Papyrus",
    labelAr: "البردي",
    bg: "linear-gradient(145deg, #e3c18b 0%, #eacf9b 40%, #cfa86d 100%)",
    accent: "#3e2723", // Dark Brown Ink
    accentDim: "rgba(62, 39, 35, 0.2)",
    text: "#211512",
    sub: "rgba(62, 39, 35, 0.7)",
    border: "rgba(62, 39, 35, 0.35)",
    pattern: "papyrus",
  },
];

const CATEGORIES = [
  { id: "all", label: "All", labelAr: "الكل", icon: Sparkles },
  { id: "ancient", label: "Ancient Wisdom", labelAr: "الحكمة القديمة", icon: Scroll },
  { id: "identity", label: "Egypt & Identity", labelAr: "مصر والهوية", icon: Compass },
  { id: "philosophy", label: "Philosophy & Life", labelAr: "الفلسفة والحياة", icon: Library },
  { id: "love", label: "Love & Humanism", labelAr: "الحب والإنسانية", icon: Heart },
  { id: "freedom", label: "Freedom & Struggle", labelAr: "الحرية والكفاح", icon: Flame },
] as const;

// ── Decorative SVG patterns ───────────────────────────────────────────────────
function PatternOverlay({ theme }: { theme: Theme }) {
  if (theme.pattern === "tomb") return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.08, pointerEvents: "none" }}>
      <defs>
        <pattern id="eye" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <text x="10" y="50" fontSize="28" fill={theme.accent}>𓂀</text>
          <text x="50" y="25" fontSize="16" fill={theme.accent}>𓏏</text>
          <text x="55" y="65" fontSize="18" fill={theme.accent}>𓆑</text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#eye)" />
    </svg>
  );
  if (theme.pattern === "nile") return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.07, pointerEvents: "none" }}>
      <defs>
        <pattern id="wave" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
          <path d="M0 15 Q15 5 30 15 Q45 25 60 15" stroke={theme.accent} strokeWidth="1.5" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wave)" />
    </svg>
  );
  if (theme.pattern === "papyrus") return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12, pointerEvents: "none" }}>
      <defs>
        <pattern id="fiber" x="0" y="0" width="120" height="24" patternUnits="userSpaceOnUse">
          <line x1="0" y1="12" x2="1000" y2="12" stroke={theme.accent} strokeWidth="0.5" />
          <line x1="60" y1="0" x2="60" y2="100" stroke={theme.accent} strokeWidth="0.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#fiber)" />
    </svg>
  );
  return null;
}

// ── The card itself (rendered in DOM, captured via html2canvas) ───────────────
interface QuoteCardProps {
  quote: Omit<Quote, "id">;
  theme: Theme;
  lang: string;
  cardRef: React.RefObject<HTMLDivElement>;
}

function QuoteCard({ quote, theme, lang, cardRef }: QuoteCardProps) {
  const isAr = lang === "ar" || lang === "both";
  const isEn = lang === "en" || lang === "both";
  const isBoth = lang === "both";

  // Calculate dynamic font sizes to maximize size while avoiding overflow
  const arLength = quote.ar.length;
  const enLength = quote.en.length;

  let arSize = "24px";
  let enSize = "22px";

  if (isBoth) {
    // Bilingual mode
    const totalLength = arLength + enLength;
    if (totalLength < 120) {
      arSize = "25px";
      enSize = "23px";
    } else if (totalLength < 180) {
      arSize = "22px";
      enSize = "20px";
    } else {
      arSize = "19px";
      enSize = "18px";
    }
  } else {
    // Monolingual mode
    if (lang === "ar") {
      if (arLength < 55) arSize = "32px";
      else if (arLength < 100) arSize = "28px";
      else arSize = "24px";
    } else {
      // English only
      if (enLength < 70) enSize = "30px";
      else if (enLength < 120) enSize = "26px";
      else enSize = "22px";
    }
  }

  return (
    <div
      ref={cardRef}
      style={{
        width: 480,
        height: 480,
        background: theme.bg,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "44px 48px",
        boxSizing: "border-box",
        fontFamily: "var(--font-body), Georgia, serif",
        flexShrink: 0,
      }}
    >
      <PatternOverlay theme={theme} />

      {/* Corner ornaments */}
      {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map((pos) => {
        const [v, h] = pos.split("-") as ["top" | "bottom", "left" | "right"];
        return (
          <div
            key={pos}
            style={{
              position: "absolute",
              [v]: 18,
              [h]: 18,
              width: 32,
              height: 32,
              borderTop: v === "top" ? `1.5px solid ${theme.border}` : "none",
              borderBottom: v === "bottom" ? `1.5px solid ${theme.border}` : "none",
              borderLeft: h === "left" ? `1.5px solid ${theme.border}` : "none",
              borderRight: h === "right" ? `1.5px solid ${theme.border}` : "none",
            }}
          />
        );
      })}

      {/* Top hieroglyph strip */}
      <div
        style={{
          position: "absolute",
          top: 26,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 15,
          color: theme.accent,
          opacity: 0.85,
          letterSpacing: 6,
          whiteSpace: "nowrap",
          fontFamily: "var(--font-display), Georgia, serif",
        }}
      >
        𓂀 𓏏 𓆑 𓇯 𓈖
      </div>

      {/* Opening quote mark */}
      <div
        style={{
          fontSize: 84,
          color: theme.accent,
          opacity: 0.35,
          lineHeight: 1,
          position: "absolute",
          top: 42,
          left: 44,
          fontFamily: "Georgia, serif",
        }}
      >
        “
      </div>

      {/* Quote body */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", textAlign: "center" }}>
        {isAr && (
          <p
            style={{
              direction: "rtl",
              fontSize: arSize,
              color: theme.text,
              lineHeight: 1.75,
              marginBottom: isBoth ? 12 : 0,
              fontWeight: 400,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {quote.ar}
          </p>
        )}

        {isBoth && (
          <div
            style={{
              width: 50,
              height: 1,
              background: theme.accent,
              opacity: 0.75,
              margin: "0 auto 14px",
            }}
          />
        )}

        {isEn && (
          <p
            style={{
              direction: "ltr",
              fontSize: enSize,
              color: theme.text,
              opacity: 1.0,
              lineHeight: 1.6,
              fontStyle: "italic",
              marginBottom: 0,
              fontFamily: "var(--font-body), Georgia, serif",
            }}
          >
            {quote.en}
          </p>
        )}
      </div>

      {/* Rule */}
      <div
        style={{
          position: "absolute",
          bottom: 104,
          left: "50%",
          transform: "translateX(-50%)",
          width: 72,
          height: 1,
          background: theme.accent,
          opacity: 0.75,
        }}
      />

      {/* Author / work */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          width: "100%",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <div style={{ 
          fontSize: 17, 
          color: theme.accent, 
          fontFamily: "var(--font-display), Georgia, serif", 
          marginBottom: 4,
          fontWeight: 600,
          letterSpacing: "0.05em"
        }}>
          {lang === "en" ? (quote.authorEn || quote.author) : quote.author}
          {lang === "both" && quote.authorEn && (
            <span style={{ 
              fontSize: "15px", 
              color: theme.text, 
              opacity: 0.95, 
              display: "block", 
              marginTop: 2,
              fontWeight: 400,
              fontStyle: "italic",
              fontFamily: "var(--font-body), Georgia, serif"
            }}>
              {quote.authorEn}
            </span>
          )}
        </div>
        <div style={{ 
          fontSize: 14, 
          color: theme.text, 
          opacity: 0.95,
          letterSpacing: "0.06em",
          fontFamily: "var(--font-body), Georgia, serif",
        }}>
          {lang === "en" ? (quote.workEn || quote.work) : quote.work} {quote.year ? `· ${quote.year}` : ""}
          {lang === "both" && quote.workEn && (
            <span style={{ display: "block", fontSize: "13px", opacity: 0.95, fontStyle: "italic", marginTop: 2 }}>
              {quote.workEn}
            </span>
          )}
        </div>
      </div>

      {/* Branding */}
      <div
        style={{
          position: "absolute",
          bottom: 18,
          right: 24,
          fontSize: 8,
          color: theme.accent,
          opacity: 0.85,
          letterSpacing: "0.18em",
          fontFamily: "var(--font-display), Georgia, serif",
        }}
      >
        COMES TO LIFE · يحيا
      </div>

      {/* Bottom hieroglyph strip */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 24,
          fontSize: 12,
          color: theme.accent,
          opacity: 0.7,
          letterSpacing: 5,
        }}
      >
        𓃭 𓅓 𓊪
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function StoryCardGenerator() {
  const navigate = useNavigate();
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [themeIdx, setThemeIdx] = useState(0);
  const [lang, setLang] = useState("ar");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [customQuote, setCustomQuote] = useState("");
  const [customQuoteEn, setCustomQuoteEn] = useState("");
  const [customAuthor, setCustomAuthor] = useState("");
  const [customWork, setCustomWork] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const theme = THEMES[themeIdx];
  
  // Filter quotes based on selected category
  const filteredQuotes = selectedCategory === "all" 
    ? QUOTES 
    : QUOTES.filter(q => q.category === selectedCategory);

  const baseQuote = QUOTES[quoteIdx] || QUOTES[0];
  const displayQuote = useCustom
    ? { ar: customQuote, en: customQuoteEn || customQuote, author: customAuthor || "مجهول", authorEn: "", work: customWork || "", year: "" }
    : baseQuote;

  function handleCategoryChange(catId: string) {
    setSelectedCategory(catId);
    const firstOfCat = catId === "all" ? QUOTES[0] : QUOTES.find(q => q.category === catId);
    if (firstOfCat) {
      const idx = QUOTES.findIndex(q => q.id === firstOfCat.id);
      setQuoteIdx(idx);
    }
  }

  // ── download via html2canvas ─────────────────────────────────────────────
  async function handleDownload() {
    const el = cardRef.current;
    if (!el) return;
    try {
      setIsDownloading(true);
      toast.info("Preparing your card, loading image renderer...", { duration: 1500 });
      // @ts-ignore
      const { default: html2canvas } = await import("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js");
      
      const canvas = await html2canvas(el, { 
        scale: 3, 
        useCORS: true, 
        backgroundColor: null,
        logging: false
      });
      const link = document.createElement("a");
      link.download = `comes-to-life-quote-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Quote card downloaded successfully!");
    } catch (err) {
      toast.error("Failed to generate download. Please try again.");
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  }

  // ── copy to clipboard ────────────────────────────────────────────────────
  async function handleCopy() {
    const text = `${displayQuote.ar}\n\n— ${displayQuote.author}، ${displayQuote.work}\n\n#يحيا #الأدب_المصري #ComesToLife`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Quote text copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy text.");
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-24 pb-16 px-4">
      {/* Decorative background grid */}
      <div className="temple-grid absolute inset-0 pointer-events-none opacity-40" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gold/20">
          <button
            onClick={() => {
              if (window.history.state && window.history.state.idx > 0) {
                navigate(-1);
              } else {
                navigate('/stories');
              }
            }}
            className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors font-display text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Stories
          </button>
          <div className="text-right">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-gold-gradient tracking-wide">
              منشئ بطاقات الاقتباس
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-display">
              Egyptian Literature Quote Exporter
            </p>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Card Preview Area (Col-5) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            <div className="relative group luxury-panel p-2 rounded-2xl bg-black/40 border-gold/20 shadow-deep w-full max-w-[340px] aspect-square overflow-hidden mb-6 flex items-center justify-center">
              {/* Scaled-down preview container to present 480px card in a responsive frame */}
              <div className="w-[320px] h-[320px] relative overflow-hidden rounded-xl border border-gold/15 shadow-2xl">
                <div style={{ transform: "scale(0.667)", transformOrigin: "top left", width: 480, height: 480 }}>
                  <QuoteCard quote={displayQuote} theme={theme} lang={lang} cardRef={cardRef} />
                </div>
              </div>

              {/* Decorative corner glows */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold/40 rounded-tl-xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold/40 rounded-tr-xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold/40 rounded-bl-xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold/40 rounded-br-xl pointer-events-none" />
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4 w-full max-w-[340px]">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gold bg-gold/15 text-gold-light hover:bg-gold/25 font-display text-sm font-semibold tracking-wide transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? "Rendering..." : "Download PNG"}
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground font-display text-sm transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                Copy text
              </button>
            </div>

            {/* Helper tips */}
            <div className="mt-6 p-4 rounded-xl border border-gold/10 bg-gold/5 text-xs text-muted-foreground leading-relaxed text-center max-w-[340px]">
              📱 Renders at ultra-high 3× resolution (1440×1440px), ideal for sharing on Instagram, Twitter, and Stories.
            </div>
          </div>

          {/* Controls Panel (Col-7) */}
          <div className="lg:col-span-7 luxury-panel p-6 md:p-8 rounded-2xl bg-black/40 border-gold/20 flex flex-col gap-8">
            
            {/* Theme Picker */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-gold">
                <Palette className="w-4 h-4" />
                <span className="font-display text-sm font-bold uppercase tracking-wider">الخلفية · Theme</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {THEMES.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => setThemeIdx(i)}
                    className={`px-4 py-3 rounded-xl border font-display text-xs text-center transition-all flex flex-col gap-1 items-center justify-center ${
                      themeIdx === i
                        ? "border-gold bg-gold/15 text-gold-light shadow-gold-glow"
                        : "border-border bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <span className="text-sm font-medium">{t.labelAr}</span>
                    <span className="text-[10px] opacity-60 uppercase tracking-widest">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selector */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-gold">
                <Languages className="w-4 h-4" />
                <span className="font-display text-sm font-bold uppercase tracking-wider">اللغة · Language</span>
              </div>
              <div className="flex gap-2">
                {[
                  { id: "ar", label: "عربي Only" },
                  { id: "en", label: "English Only" },
                  { id: "both", label: "Bilingual (عربي + English)" }
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLang(l.id)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border font-display text-xs transition-all ${
                      lang === l.id
                        ? "border-gold bg-gold/15 text-gold-light"
                        : "border-border bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selector */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-gold">
                <FileText className="w-4 h-4" />
                <span className="font-display text-sm font-bold uppercase tracking-wider">التصنيف · Category</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  const isActive = selectedCategory === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleCategoryChange(c.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-display text-xs transition-all active:scale-95 ${
                        isActive
                          ? "border-gold bg-gold/15 text-gold-light shadow-gold-glow"
                          : "border-border bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="font-medium">{c.labelAr}</span>
                      <span className="opacity-60 text-[10px] uppercase tracking-widest">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quote Selector / Creator */}
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-gold/10 pb-2">
                <div className="flex items-center gap-2 text-gold">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-display text-sm font-bold uppercase tracking-wider">الاقتباس · Quote</span>
                </div>
                <button
                  onClick={() => setUseCustom(!useCustom)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-gold/30 hover:border-gold bg-gold/5 text-gold-light font-display text-xs transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {useCustom ? "Browse Library" : "Write Custom"}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {useCustom ? (
                  <motion.div
                    key="custom-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground font-display">Arabic Quote Text</label>
                      <textarea
                        placeholder="اكتب اقتباسك هنا باللغة العربية..."
                        value={customQuote}
                        onChange={(e) => setCustomQuote(e.target.value)}
                        rows={3}
                        dir="rtl"
                        className="w-full p-3 rounded-xl border border-border bg-muted/20 text-foreground font-body text-base outline-none focus:border-gold transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground font-display">English Quote Text (Optional)</label>
                      <textarea
                        placeholder="Type the English translation..."
                        value={customQuoteEn}
                        onChange={(e) => setCustomQuoteEn(e.target.value)}
                        rows={2}
                        className="w-full p-3 rounded-xl border border-border bg-muted/20 text-foreground font-body text-sm outline-none focus:border-gold transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-muted-foreground font-display">Author Name (Arabic/English)</label>
                        <input
                          placeholder="e.g. نجيب محفوظ"
                          value={customAuthor}
                          onChange={(e) => setCustomAuthor(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-border bg-muted/20 text-foreground text-sm outline-none focus:border-gold transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-muted-foreground font-display">Book Title & Year</label>
                        <input
                          placeholder="e.g. أولاد حارتنا · 1959"
                          value={customWork}
                          onChange={(e) => setCustomWork(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-border bg-muted/20 text-foreground text-sm outline-none focus:border-gold transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="library-list"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-h-[360px] overflow-y-auto pr-2 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-gold/50"
                  >
                    {filteredQuotes.map((q) => {
                      const globalIdx = QUOTES.findIndex(item => item.id === q.id);
                      const isSelected = quoteIdx === globalIdx;
                      return (
                        <button
                          key={q.id}
                          onClick={() => setQuoteIdx(globalIdx)}
                          className={`text-right direction-rtl p-4 rounded-xl border text-sm transition-all flex flex-col gap-2 ${
                            isSelected
                              ? "border-gold bg-gold/10 text-gold-light"
                              : "border-border bg-muted/10 text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full border-b border-border/40 pb-1.5">
                            <span className={`text-[10px] font-display uppercase tracking-widest ${isSelected ? "text-gold-light/85" : "text-muted-foreground/60"}`}>
                              {q.work} {q.year ? `· ${q.year}` : ""}
                            </span>
                            <span className="font-semibold text-xs">{q.author}</span>
                          </div>
                          <p className="font-body text-base leading-relaxed text-foreground mt-1 line-clamp-2" dir="rtl">
                            {q.ar}
                          </p>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
