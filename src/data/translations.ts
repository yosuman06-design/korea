import { UiLanguage } from '../types/learning';

export interface UiDictionary {
  brandName: string;
  navLearn: string;
  navPractice: string;
  navExams: string;
  navCulture: string;
  navTutor: string;
  signInBtn: string;
  accountBtn: string;
  heroTitle: string;
  heroSubtitle: string;
  heroStartBtn: string;
  heroPlacementBtn: string;
  kpiLevelLabel: string;
  kpiXpLabel: string;
  kpiStreakLabel: string;
  kpiSavedLabel: string;
  daysUnit: string;
  wordsUnit: string;
  themeLight: string;
  themeDark: string;
  modules: {
    overview: string;
    hangul: string;
    grammar: string;
    vocabulary: string;
    dialogues: string;
    listening: string;
    topik: string;
    culture: string;
    quizzes: string;
    tutor: string;
    profile: string;
  };
  common: {
    listen: string;
    listenSlow: string;
    checkAnswer: string;
    correct: string;
    incorrect: string;
    explanation: string;
    saveWord: string;
    savedWord: string;
    next: string;
    reset: string;
    allLevels: string;
    completed: string;
    markComplete: string;
    xpEarned: string;
    signInPrompt: string;
    signInWithGoogle: string;
    signOut: string;
    loading: string;
  };
  hangulUi: {
    title: string;
    subtitle: string;
    consonants: string;
    doubleConsonants: string;
    vowels: string;
    compoundVowels: string;
    builderTitle: string;
    builderSubtitle: string;
    initialLabel: string;
    medialLabel: string;
    finalLabel: string;
    noneFinal: string;
    drillTitle: string;
    drillSubtitle: string;
  };
  grammarUi: {
    title: string;
    subtitle: string;
    politeness: string;
    examples: string;
    practiceTitle: string;
  };
  vocabUi: {
    title: string;
    subtitle: string;
    flipHint: string;
    categories: {
      all: string;
      greetings: string;
      food: string;
      travel: string;
      daily: string;
      emotions: string;
      topik: string;
    };
    flashcardMode: string;
    gridMode: string;
  };
  dialoguesUi: {
    title: string;
    subtitle: string;
    playAll: string;
    stopPlay: string;
    showTranslations: string;
    hideTranslations: string;
    comprehensionCheck: string;
  };
  listeningUi: {
    title: string;
    subtitle: string;
    playAudio: string;
    playSlowAudio: string;
    showTranscript: string;
    hideTranscript: string;
  };
  topikUi: {
    title: string;
    subtitle: string;
    track1: string;
    track2: string;
    startMock: string;
    scoreResult: string;
    retake: string;
    questionOf: string;
  };
  cultureUi: {
    title: string;
    subtitle: string;
    keyExpressions: string;
    pillars: {
      all: string;
      traditions: string;
      cuisine: string;
      history: string;
      kculture: string;
    };
  };
  quizzesUi: {
    title: string;
    subtitle: string;
    placementTab: string;
    topicQuizTab: string;
    placementIntro: string;
    detectedLevel: string;
    saveLevel: string;
  };
  tutorUi: {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    thinking: string;
    modes: {
      conversation: string;
      grammar: string;
      roleplay_cafe: string;
      topik_coach: string;
    };
    starters: string[];
    grammarNote: string;
    suggestedVocab: string;
  };
  profileUi: {
    title: string;
    subtitle: string;
    dailyQuestsTitle: string;
    achievementsTitle: string;
    dictionaryTitle: string;
    addCustomWord: string;
    koreanPlaceholder: string;
    transcriptionPlaceholder: string;
    translationPlaceholder: string;
    categoryPlaceholder: string;
    addBtn: string;
    emptyDictionary: string;
    mastered: string;
    reviewing: string;
    deleteWord: string;
    guestBanner: string;
  };
}

export const TRANSLATIONS: Record<UiLanguage, UiDictionary> = {
  ru: {
    brandName: 'Korean Journey — 한국어',
    navLearn: 'Обучение',
    navPractice: 'Практика',
    navExams: 'TOPIK и Тесты',
    navCulture: 'Культура',
    navTutor: 'ИИ-Учитель',
    signInBtn: 'Войти',
    accountBtn: 'Кабинет',
    heroTitle: 'Изучайте корейский язык естественно — от первых букв хангыля до TOPIK II',
    heroSubtitle:
      'Интерактивный алфавит с живой озвучкой, понятная грамматика, реальные диалоги Сеула, аудирование, культура Кореи и персональный ИИ-преподаватель.',
    heroStartBtn: 'Начать с Хангыля',
    heroPlacementBtn: 'Определить уровень',
    kpiLevelLabel: 'Текущий уровень',
    kpiXpLabel: 'Очки опыта (XP)',
    kpiStreakLabel: 'Ударный режим',
    kpiSavedLabel: 'Личный словарь',
    daysUnit: 'дн.',
    wordsUnit: 'слов',
    themeLight: 'Светлая',
    themeDark: 'Тёмная',
    modules: {
      overview: 'Обзор',
      hangul: 'Хангыль (한글)',
      grammar: 'Грамматика',
      vocabulary: 'Словарь',
      dialogues: 'Диалоги',
      listening: 'Аудирование',
      topik: 'TOPIK I и II',
      culture: 'Культура',
      quizzes: 'Тесты и Уровень',
      tutor: 'ИИ-Преподаватель',
      profile: 'Личный кабинет',
    },
    common: {
      listen: 'Слушать',
      listenSlow: 'Медленно 0.7×',
      checkAnswer: 'Проверить',
      correct: 'Верно! Отличная работа',
      incorrect: 'Почти! Посмотрите разбор ниже',
      explanation: 'Объяснение',
      saveWord: 'В словарь',
      savedWord: 'Сохранено',
      next: 'Далее',
      reset: 'Сбросить',
      allLevels: 'Все уровни',
      completed: 'Пройдено',
      markComplete: 'Отметить урок (+25 XP)',
      xpEarned: 'XP начислено',
      signInPrompt: 'Войдите через Google, чтобы синхронизировать прогресс и личный словарь в облаке.',
      signInWithGoogle: 'Войти через Google',
      signOut: 'Выйти',
      loading: 'Загрузка...',
    },
    hangulUi: {
      title: 'Алфавит Хангыль — 한글',
      subtitle: 'Изучите все 40 букв корейского алфавита, послушайте произношение и соберите свой первый слог в конструкторе.',
      consonants: 'Согласные (14)',
      doubleConsonants: 'Сдвоенные (5)',
      vowels: 'Гласные (10)',
      compoundVowels: 'Дифтонги (11)',
      builderTitle: 'Конструктор слогов Хангыль',
      builderSubtitle: 'Соедините начальную согласную, гласную и конечную согласную (патчим), чтобы услышать живой корейский слог.',
      initialLabel: 'Начальная (초성)',
      medialLabel: 'Гласная (중성)',
      finalLabel: 'Патчим (종성)',
      noneFinal: 'Без патчима',
      drillTitle: 'Аудио-тренажёр букв',
      drillSubtitle: 'Прослушайте звук и выберите правильную букву хангыля.',
    },
    grammarUi: {
      title: 'Грамматика корейского языка',
      subtitle: 'Понятные правила от базовых частиц A1 до сложных конструкций TOPIK II с озвучкой и мини-тренажёром.',
      politeness: 'Стиль вежливости',
      examples: 'Примеры в речи',
      practiceTitle: 'Закрепите правило',
    },
    vocabUi: {
      title: 'Интерактивный словарь',
      subtitle: 'Карточки с транскрипцией, примерами, озвучкой и сохранением в ваш личный словарь.',
      flipHint: 'Нажмите на карточку, чтобы перевернуть',
      categories: {
        all: 'Все темы',
        greetings: 'Приветствия',
        food: 'Еда и кафе',
        travel: 'Сеул и поездки',
        daily: 'Повседневное',
        emotions: 'Чувства',
        topik: 'TOPIK II',
      },
      flashcardMode: 'Флеш-карточка',
      gridMode: 'Список слов',
    },
    dialoguesUi: {
      title: 'Разговорный корейский',
      subtitle: 'Реальные сцены из жизни в Сеуле: кофейни, метро, рестораны и знакомства.',
      playAll: 'Проиграть диалог',
      stopPlay: 'Остановить',
      showTranslations: 'Показать перевод',
      hideTranslations: 'Скрыть перевод',
      comprehensionCheck: 'Проверка понимания диалога',
    },
    listeningUi: {
      title: 'Аудирование — 듣기',
      subtitle: 'Тренируйте восприятие корейской речи на слух на обычной и замедленной скорости.',
      playAudio: 'Воспроизвести запись',
      playSlowAudio: 'Замедлить (0.7×)',
      showTranscript: 'Показать текст',
      hideTranscript: 'Скрыть текст',
    },
    topikUi: {
      title: 'Подготовка к TOPIK I и TOPIK II',
      subtitle: 'Тренировочные задания экзаменационного формата с таймером, оценкой баллов и подробным разбором ошибок.',
      track1: 'TOPIK I (Уровни 1–2)',
      track2: 'TOPIK II (Уровни 3–6)',
      startMock: 'Начать пробный тест',
      scoreResult: 'Результат экзамена',
      retake: 'Пройти заново',
      questionOf: 'Вопрос',
    },
    cultureUi: {
      title: 'Культура Южной Кореи',
      subtitle: 'Традиции ханок, королевская кухня, история Сеула и живые выражения из K-pop и дорам.',
      keyExpressions: 'Полезные выражения по теме',
      pillars: {
        all: 'Вся культура',
        traditions: 'Традиции',
        cuisine: 'Кухня',
        history: 'История и Сеул',
        kculture: 'K-pop и Дорамы',
      },
    },
    quizzesUi: {
      title: 'Тест на уровень и проверка знаний',
      subtitle: 'Узнайте ваш текущий уровень от A1 до C1 или пройдите тематический тест с объяснением каждой ошибки.',
      placementTab: 'Определение уровня (A1–C1)',
      topicQuizTab: 'Тематический тест',
      placementIntro: 'Ответьте на 10 вопросов возрастающей сложности, чтобы платформа подобрала идеальный маршрут.',
      detectedLevel: 'Ваш определённый уровень',
      saveLevel: 'Применить уровень к профилю',
    },
    tutorUi: {
      title: 'ИИ-преподаватель Минчжи (민지 선생님)',
      subtitle: 'Практикуйте диалоги, проверяйте грамматику и готовьтесь к TOPIK в реальном времени с озвучкой ответов.',
      placeholder: 'Напишите фразу по-корейски или задайте вопрос преподавателю...',
      send: 'Отправить',
      thinking: 'Минчжи готовит ответ...',
      modes: {
        conversation: 'Свободный диалог',
        grammar: 'Проверка грамматики',
        roleplay_cafe: 'Ролевая игра: Кафе в Сеуле',
        topik_coach: 'Тренер TOPIK II',
      },
      starters: [
        '안녕하세요! 저는 한국어를 처음 배워요.',
        'Проверь фразу: 오늘 친구랑 카페에 갔어요.',
        '아이스 아메리카노 한 잔 주세요.',
        'Чем отличаются частицы 은/는 и 이/가?',
      ],
      grammarNote: 'Заметка преподавателя',
      suggestedVocab: 'Слова для запоминания',
    },
    profileUi: {
      title: 'Личный кабинет ученика',
      subtitle: 'Отслеживайте прогресс, выполняйте ежедневные задания, собирайте награды и управляйте личным словарём.',
      dailyQuestsTitle: 'Ежедневные задания',
      achievementsTitle: 'Достижения и награды',
      dictionaryTitle: 'Мой личный словарь',
      addCustomWord: 'Добавить своё слово',
      koreanPlaceholder: 'Слово (напр. 행복)',
      transcriptionPlaceholder: 'Транскрипция (haengbok)',
      translationPlaceholder: 'Перевод (счастье)',
      categoryPlaceholder: 'Тема',
      addBtn: 'Добавить слово',
      emptyDictionary: 'Ваш личный словарь пока пуст. Нажимайте «В словарь» на карточках или добавляйте слова вручную.',
      mastered: 'Выучено',
      reviewing: 'Повторяю',
      deleteWord: 'Удалить',
      guestBanner: 'Вы занимаетесь в гостевом режиме. Войдите через Google, чтобы сохранить XP, достижения и словарь в облаке.',
    },
  },
  en: {
    brandName: 'Korean Journey — 한국어',
    navLearn: 'Curriculum',
    navPractice: 'Practice',
    navExams: 'TOPIK & Quiz',
    navCulture: 'Culture',
    navTutor: 'AI Tutor',
    signInBtn: 'Sign In',
    accountBtn: 'Profile',
    heroTitle: 'Learn Korean naturally — from your first Hangul stroke to TOPIK II fluency',
    heroSubtitle:
      'Interactive Hangul studio with native speech, clear grammar drills, real Seoul dialogues, listening practice, Korean culture, and an AI Korean tutor.',
    heroStartBtn: 'Start with Hangul',
    heroPlacementBtn: 'Check Your Level',
    kpiLevelLabel: 'Current Level',
    kpiXpLabel: 'Total XP',
    kpiStreakLabel: 'Daily Streak',
    kpiSavedLabel: 'Personal Dictionary',
    daysUnit: 'days',
    wordsUnit: 'words',
    themeLight: 'Light',
    themeDark: 'Dark',
    modules: {
      overview: 'Overview',
      hangul: 'Hangul (한글)',
      grammar: 'Grammar',
      vocabulary: 'Vocabulary',
      dialogues: 'Dialogues',
      listening: 'Listening',
      topik: 'TOPIK I & II',
      culture: 'Culture',
      quizzes: 'Level & Quizzes',
      tutor: 'AI Tutor',
      profile: 'My Profile',
    },
    common: {
      listen: 'Listen',
      listenSlow: 'Slow 0.7×',
      checkAnswer: 'Check Answer',
      correct: 'Correct! Well done',
      incorrect: 'Close! Review the explanation below',
      explanation: 'Explanation',
      saveWord: 'Save Word',
      savedWord: 'Saved',
      next: 'Next',
      reset: 'Reset',
      allLevels: 'All Levels',
      completed: 'Completed',
      markComplete: 'Complete Lesson (+25 XP)',
      xpEarned: 'XP earned',
      signInPrompt: 'Sign in with Google to sync your progress, achievements, and personal dictionary across devices.',
      signInWithGoogle: 'Sign in with Google',
      signOut: 'Sign Out',
      loading: 'Loading...',
    },
    hangulUi: {
      title: 'Hangul Alphabet — 한글',
      subtitle: 'Master all 40 Korean letters with pronunciation, phonetic guides, and an interactive syllable builder.',
      consonants: 'Consonants (14)',
      doubleConsonants: 'Double (5)',
      vowels: 'Vowels (10)',
      compoundVowels: 'Compound (11)',
      builderTitle: 'Hangul Syllable Builder',
      builderSubtitle: 'Combine an initial consonant, vowel, and optional final batchim to hear live Korean syllables.',
      initialLabel: 'Initial (초성)',
      medialLabel: 'Vowel (중성)',
      finalLabel: 'Batchim (종성)',
      noneFinal: 'No Batchim',
      drillTitle: 'Audio Letter Drill',
      drillSubtitle: 'Listen to the sound and pick the matching Hangul character.',
    },
    grammarUi: {
      title: 'Korean Grammar Studio',
      subtitle: 'Clear explanations from A1 particles to TOPIK II connectors with audio examples and drills.',
      politeness: 'Politeness Level',
      examples: 'In Real Speech',
      practiceTitle: 'Quick Drill',
    },
    vocabUi: {
      title: 'Interactive Vocabulary',
      subtitle: 'Flashcards with transcription, context sentences, audio pronunciation, and one-click saving.',
      flipHint: 'Click card to flip',
      categories: {
        all: 'All Topics',
        greetings: 'Greetings',
        food: 'Food & Cafe',
        travel: 'Seoul & Travel',
        daily: 'Daily Life',
        emotions: 'Emotions',
        topik: 'TOPIK II',
      },
      flashcardMode: 'Flashcard',
      gridMode: 'Word List',
    },
    dialoguesUi: {
      title: 'Conversational Korean',
      subtitle: 'Authentic everyday scenes in Seoul cafes, subways, restaurants, and shopping streets.',
      playAll: 'Play Dialogue',
      stopPlay: 'Stop',
      showTranslations: 'Show Translations',
      hideTranslations: 'Hide Translations',
      comprehensionCheck: 'Dialogue Check',
    },
    listeningUi: {
      title: 'Listening Comprehension — 듣기',
      subtitle: 'Train your ear with normal and slow-speed Korean speech and instant feedback.',
      playAudio: 'Play Audio',
      playSlowAudio: 'Slow Speed (0.7×)',
      showTranscript: 'Show Transcript',
      hideTranscript: 'Hide Transcript',
    },
    topikUi: {
      title: 'TOPIK I & TOPIK II Prep',
      subtitle: 'Exam-format mock tests with timer, band estimation, and detailed error breakdowns.',
      track1: 'TOPIK I (Levels 1–2)',
      track2: 'TOPIK II (Levels 3–6)',
      startMock: 'Start Mock Exam',
      scoreResult: 'Exam Result',
      retake: 'Retake Test',
      questionOf: 'Question',
    },
    cultureUi: {
      title: 'Korean Culture & Lifestyle',
      subtitle: 'Explore Bukchon Hanok heritage, royal cuisine, Seoul history, and expressions from K-pop & K-dramas.',
      keyExpressions: 'Key Cultural Expressions',
      pillars: {
        all: 'All Culture',
        traditions: 'Traditions',
        cuisine: 'Cuisine',
        history: 'History & Seoul',
        kculture: 'K-pop & Dramas',
      },
    },
    quizzesUi: {
      title: 'Level Placement & Quizzes',
      subtitle: 'Assess your current Korean proficiency (A1–C1) or practice topic quizzes with detailed error explanations.',
      placementTab: 'Placement Test (A1–C1)',
      topicQuizTab: 'Topic Quiz',
      placementIntro: 'Answer 10 progressive questions to determine your starting level and recommended path.',
      detectedLevel: 'Detected Level',
      saveLevel: 'Save Level to Profile',
    },
    tutorUi: {
      title: 'AI Korean Tutor Minji (민지 선생님)',
      subtitle: 'Practice natural Korean conversation, check grammar, or roleplay Seoul scenarios with voice playback.',
      placeholder: 'Write in Korean or ask a grammar question...',
      send: 'Send',
      thinking: 'Minji is typing...',
      modes: {
        conversation: 'Free Conversation',
        grammar: 'Grammar Check',
        roleplay_cafe: 'Seoul Cafe Roleplay',
        topik_coach: 'TOPIK II Coach',
      },
      starters: [
        '안녕하세요! 저는 한국어를 처음 배워요.',
        'Check my sentence: 오늘 친구랑 카페에 갔어요.',
        '아이스 아메리카노 한 잔 주세요.',
        'What is the difference between 은/는 and 이/가?',
      ],
      grammarNote: 'Tutor Note',
      suggestedVocab: 'Words to Save',
    },
    profileUi: {
      title: 'Learner Dashboard',
      subtitle: 'Track XP, complete daily quests, unlock badges, and curate your personal Korean dictionary.',
      dailyQuestsTitle: 'Daily Quests',
      achievementsTitle: 'Achievements & Badges',
      dictionaryTitle: 'Personal Dictionary',
      addCustomWord: 'Add Custom Word',
      koreanPlaceholder: 'Korean word (e.g. 행복)',
      transcriptionPlaceholder: 'Romanization (haengbok)',
      translationPlaceholder: 'Meaning (happiness)',
      categoryPlaceholder: 'Category',
      addBtn: 'Add Word',
      emptyDictionary: 'Your dictionary is empty. Click "Save Word" on flashcards or add custom words below.',
      mastered: 'Mastered',
      reviewing: 'Reviewing',
      deleteWord: 'Remove',
      guestBanner: 'You are learning in guest mode. Sign in with Google to save your XP, streaks, and dictionary in the cloud.',
    },
  },
  tg: {
    brandName: 'Korean Journey — 한국어',
    navLearn: 'Омӯзиш',
    navPractice: 'Амалия',
    navExams: 'TOPIK ва Тест',
    navCulture: 'Фарҳанг',
    navTutor: 'Муаллими AI',
    signInBtn: 'Воридшавӣ',
    accountBtn: 'Кабинет',
    heroTitle: 'Забони кореягиро озодона омӯзед — аз алифбои Ҳангул то TOPIK II',
    heroSubtitle:
      'Алифбои интерактивӣ бо талаффузи зинда, грамматикаи фаҳмо, муколамаҳои Сеул, шунидан, фарҳанги Корея ва муаллими зеҳни сунъӣ.',
    heroStartBtn: 'Аз Ҳангул оғоз кунед',
    heroPlacementBtn: 'Муайян кардани сатҳ',
    kpiLevelLabel: 'Сатҳи ҷорӣ',
    kpiXpLabel: 'Холҳои XP',
    kpiStreakLabel: 'Силсилаи рӯзҳо',
    kpiSavedLabel: 'Луғати шахсӣ',
    daysUnit: 'рӯз',
    wordsUnit: 'калима',
    themeLight: 'Равшан',
    themeDark: 'Торик',
    modules: {
      overview: 'Шарҳ',
      hangul: 'Ҳангул (한글)',
      grammar: 'Грамматика',
      vocabulary: 'Луғат',
      dialogues: 'Муколамаҳо',
      listening: 'Шунидан',
      topik: 'TOPIK I ва II',
      culture: 'Фарҳанг',
      quizzes: 'Тест ва Сатҳ',
      tutor: 'Муаллими AI',
      profile: 'Кабинети шахсӣ',
    },
    common: {
      listen: 'Шунидан',
      listenSlow: 'Оҳиста 0.7×',
      checkAnswer: 'Санҷидан',
      correct: 'Дуруст! Офарин',
      incorrect: 'Қариб! Тавзеҳро дар поён хонед',
      explanation: 'Тавзеҳ',
      saveWord: 'Ба луғат',
      savedWord: 'Захира шуд',
      next: 'Навбатӣ',
      reset: 'Аз нав',
      allLevels: 'Ҳамаи сатҳҳо',
      completed: 'Иҷро шуд',
      markComplete: 'Дарсро анҷом додан (+25 XP)',
      xpEarned: 'XP гирифта шуд',
      signInPrompt: 'Барои захираи пешрафт ва луғати шахсӣ тавассути Google ворид шавед.',
      signInWithGoogle: 'Воридшавӣ бо Google',
      signOut: 'Баромадан',
      loading: 'Боргузорӣ...',
    },
    hangulUi: {
      title: 'Алифбои Ҳангул — 한글',
      subtitle: 'Ҳамаи 40 ҳарфи кореягиро бо талаффуз омӯзед ва дар конструктор ҳиҷо созед.',
      consonants: 'Ҳамсадоҳо (14)',
      doubleConsonants: 'Дучанд (5)',
      vowels: 'Садонокҳо (10)',
      compoundVowels: 'Мураккаб (11)',
      builderTitle: 'Созандаи ҳиҷои Ҳангул',
      builderSubtitle: 'Ҳамсадои аввал, садонок ва патчимро пайваст кунед ва садоро шунавед.',
      initialLabel: 'Аввал (초성)',
      medialLabel: 'Садонок (중성)',
      finalLabel: 'Патчим (종성)',
      noneFinal: 'Бе патчим',
      drillTitle: 'Машқи шунидани ҳарфҳо',
      drillSubtitle: 'Садоро шунавед ва ҳарфи дурусти Ҳангулро интихоб кунед.',
    },
    grammarUi: {
      title: 'Грамматикаи забони кореягӣ',
      subtitle: 'Қоидаҳои равшан аз сатҳи A1 то TOPIK II бо мисолҳои овозӣ ва машқҳо.',
      politeness: 'Услуби эҳтиром',
      examples: 'Мисолҳо дар нутқ',
      practiceTitle: 'Машқи санҷишӣ',
    },
    vocabUi: {
      title: 'Луғати интерактивӣ',
      subtitle: 'Кортҳо бо транскрипсия, мисолҳо, талаффуз ва захира ба луғати шахсӣ.',
      flipHint: 'Барои гардонидан корт-ро пахш кунед',
      categories: {
        all: 'Ҳама мавзӯъҳо',
        greetings: 'Салом ва шиносоӣ',
        food: 'Хӯрок ва қаҳвахона',
        travel: 'Сеул ва сафар',
        daily: 'Ҳаёти рӯзмарра',
        emotions: 'Эҳсосот',
        topik: 'TOPIK II',
      },
      flashcardMode: 'Флеш-корт',
      gridMode: 'Рӯйхат',
    },
    dialoguesUi: {
      title: 'Кореягии гуфтугӯӣ',
      subtitle: 'Муколамаҳои воқеӣ дар қаҳвахона, метро, тарабхона ва мағозаҳои Сеул.',
      playAll: 'Шунидани муколама',
      stopPlay: 'Қатъ кардан',
      showTranslations: 'Нишон додани тарҷума',
      hideTranslations: 'Пинҳон кардани тарҷума',
      comprehensionCheck: 'Санҷиши фаҳмиш',
    },
    listeningUi: {
      title: 'Шунидан — 듣기',
      subtitle: 'Фаҳмиши нутқи кореягиро бо суръати муқаррарӣ ва оҳиста машқ кунед.',
      playAudio: 'Шунидани сабт',
      playSlowAudio: 'Оҳиста (0.7×)',
      showTranscript: 'Дидани матн',
      hideTranscript: 'Пинҳон кардани матн',
    },
    topikUi: {
      title: 'Омодагӣ ба TOPIK I ва TOPIK II',
      subtitle: 'Тестҳои имтиҳонӣ бо вақтсанҷ, баҳогузорӣ ва таҳлили хатоҳо.',
      track1: 'TOPIK I (Сатҳи 1–2)',
      track2: 'TOPIK II (Сатҳи 3–6)',
      startMock: 'Оғози тести имтиҳонӣ',
      scoreResult: 'Натиҷаи имтиҳон',
      retake: 'Аз нав супоридан',
      questionOf: 'Савол',
    },
    cultureUi: {
      title: 'Фарҳанги Кореяи Ҷанубӣ',
      subtitle: 'Анъанаҳои ханок, таомҳои миллӣ, таърихи Сеул ва ибораҳои K-pop ва дорамаҳо.',
      keyExpressions: 'Ибораҳои муҳими фарҳангӣ',
      pillars: {
        all: 'Ҳамаи бахшҳо',
        traditions: 'Анъанаҳо',
        cuisine: 'Ошхона',
        history: 'Таърих ва Сеул',
        kculture: 'K-pop ва Дорама',
      },
    },
    quizzesUi: {
      title: 'Санҷиши сатҳ ва тестҳо',
      subtitle: 'Сатҳи кунунии худро (A1–C1) муайян кунед ё тестҳои мавзӯиро супоред.',
      placementTab: 'Муайян кардани сатҳ (A1–C1)',
      topicQuizTab: 'Тести мавзӯӣ',
      placementIntro: 'Ба 10 саволи тадриҷан душворшаванда ҷавоб диҳед, то сатҳи шумо муайян шавад.',
      detectedLevel: 'Сатҳи муайяншудаи шумо',
      saveLevel: 'Сабт кардани сатҳ дар профил',
    },
    tutorUi: {
      title: 'Муаллими AI Минҷи (민지 선생님)',
      subtitle: 'Бо муаллими виртуалӣ ба кореягӣ сӯҳбат кунед, грамматикаро санҷед ва талаффузро гӯш кунед.',
      placeholder: 'Ба кореягӣ нависед ё савол диҳед...',
      send: 'Фиристодан',
      thinking: 'Минҷи ҷавоб омода мекунад...',
      modes: {
        conversation: 'Сӯҳбати озод',
        grammar: 'Санҷиши грамматика',
        roleplay_cafe: 'Нақшбозӣ: Қаҳвахона дар Сеул',
        topik_coach: 'Мураббии TOPIK II',
      },
      starters: [
        '안녕하세요! 저는 한국어를 처음 배워요.',
        'Ҷумларо санҷ: 오늘 친구랑 카페에 갔어요.',
        '아이스 아메리카노 한 잔 주세요.',
        'Фарқи байни 은/는 ва 이/가 чист?',
      ],
      grammarNote: 'Қайди муаллим',
      suggestedVocab: 'Калимаҳо барои ёдгирӣ',
    },
    profileUi: {
      title: 'Кабинети шахсии омӯзанда',
      subtitle: 'Пешрафт, вазифаҳои рӯзона, мукофотҳо ва луғати шахсии худро идора кунед.',
      dailyQuestsTitle: 'Вазифаҳои рӯзона',
      achievementsTitle: 'Дастовардҳо ва нишонҳо',
      dictionaryTitle: 'Луғати шахсии ман',
      addCustomWord: 'Илова кардани калима',
      koreanPlaceholder: 'Калима (мас. 행복)',
      transcriptionPlaceholder: 'Транскрипсия (haengbok)',
      translationPlaceholder: 'Тарҷума (хушбахтӣ)',
      categoryPlaceholder: 'Мавзӯъ',
      addBtn: 'Илова кардан',
      emptyDictionary: 'Луғати шумо ҳоло холист. Калимаҳоро аз кортҳо захира кунед ё дастӣ илова намоед.',
      mastered: 'Омӯхта шуд',
      reviewing: 'Такрор',
      deleteWord: 'Нест кардан',
      guestBanner: 'Шумо дар реҷаи меҳмон ҳастед. Барои захираи доимии XP ва луғат бо Google ворид шавед.',
    },
  },
  ko: {
    brandName: 'Korean Journey — 한국어',
    navLearn: '학습',
    navPractice: '연습',
    navExams: 'TOPIK · 퀴즈',
    navCulture: '한국 문화',
    navTutor: 'AI 튜터',
    signInBtn: '로그인',
    accountBtn: '내 정보',
    heroTitle: '한글의 첫 글자부터 TOPIK II 고급까지 — 체계적인 한국어 학습 여정',
    heroSubtitle:
      '음성 지원 한글 학습, 명쾌한 문법 연습, 서울 실생활 회화, 듣기 훈련, 한국 문화 콘텐츠와 AI 한국어 선생님을 한곳에서 만나보세요.',
    heroStartBtn: '한글부터 시작하기',
    heroPlacementBtn: '레벨 테스트',
    kpiLevelLabel: '현재 등급',
    kpiXpLabel: '누적 XP',
    kpiStreakLabel: '연속 학습',
    kpiSavedLabel: '내 단어장',
    daysUnit: '일',
    wordsUnit: '단어',
    themeLight: '라이트',
    themeDark: '다크',
    modules: {
      overview: '홈',
      hangul: '한글',
      grammar: '문법',
      vocabulary: '어휘',
      dialogues: '회화',
      listening: '듣기',
      topik: 'TOPIK I · II',
      culture: '문화',
      quizzes: '레벨 · 퀴즈',
      tutor: 'AI 선생님',
      profile: '마이페이지',
    },
    common: {
      listen: '듣기',
      listenSlow: '느리게 0.7×',
      checkAnswer: '정답 확인',
      correct: '정답입니다! 참 잘했어요',
      incorrect: '아쉽네요! 아래 해설을 확인해 보세요',
      explanation: '해설',
      saveWord: '단어장 저장',
      savedWord: '저장됨',
      next: '다음',
      reset: '초기화',
      allLevels: '전체 단계',
      completed: '완료',
      markComplete: '학습 완료 (+25 XP)',
      xpEarned: 'XP 획득',
      signInPrompt: 'Google 로그인으로 학습 진도와 개인 단어장을 클라우드에 안전하게 저장하세요.',
      signInWithGoogle: 'Google로 로그인',
      signOut: '로그아웃',
      loading: '불러오는 중...',
    },
    hangulUi: {
      title: '한글 자모 마스터 — 한글',
      subtitle: '40개 한글 자모의 발음과 획수를 익히고 음절 조합기로 직접 소리를 만들어 보세요.',
      consonants: '기본 자음 (14)',
      doubleConsonants: '쌍자음 (5)',
      vowels: '기본 모음 (10)',
      compoundVowels: '이중 모음 (11)',
      builderTitle: '한글 음절 조합기',
      builderSubtitle: '초성, 중성, 종성(받침)을 조합해 실제 한국어 발음을 들어보세요.',
      initialLabel: '초성',
      medialLabel: '중성',
      finalLabel: '받침 (종성)',
      noneFinal: '받침 없음',
      drillTitle: '한글 듣기 퀴즈',
      drillSubtitle: '발음을 듣고 알맞은 한글 자모를 선택하세요.',
    },
    grammarUi: {
      title: '한국어 핵심 문법',
      subtitle: '입문 조사부터 TOPIK II 고급 연결어미까지 예문과 퀴즈로 익힙니다.',
      politeness: '높임법',
      examples: '실전 예문',
      practiceTitle: '문법 연습 문제',
    },
    vocabUi: {
      title: '주제별 어휘 카드',
      subtitle: '발음 기호, 예문, 음성 듣기와 함께 나만의 단어장에 바로 저장하세요.',
      flipHint: '카드를 클릭하여 뒤집기',
      categories: {
        all: '전체',
        greetings: '인사',
        food: '음식 · 카페',
        travel: '서울 · 여행',
        daily: '일상',
        emotions: '감정',
        topik: 'TOPIK II',
      },
      flashcardMode: '플래시카드',
      gridMode: '단어 목록',
    },
    dialoguesUi: {
      title: '실생활 한국어 회화',
      subtitle: '서울 카페, 지하철, 식당, 쇼핑 등 생생한 일상 대화를 연습해 보세요.',
      playAll: '전체 듣기',
      stopPlay: '정지',
      showTranslations: '해석 보기',
      hideTranslations: '해석 숨기기',
      comprehensionCheck: '대화 이해 확인',
    },
    listeningUi: {
      title: '한국어 듣기 훈련 — 듣기',
      subtitle: '보통 속도와 느린 속도로 한국어 음성을 듣고 내용을 파악해 보세요.',
      playAudio: '음성 재생',
      playSlowAudio: '천천히 듣기 (0.7×)',
      showTranscript: '대본 보기',
      hideTranscript: '대본 숨기기',
    },
    topikUi: {
      title: 'TOPIK I · TOPIK II 대비',
      subtitle: '실전 모의고사 문제와 타이머, 상세한 오답 해설로 시험에 대비하세요.',
      track1: 'TOPIK I (1~2급)',
      track2: 'TOPIK II (3~6급)',
      startMock: '모의고사 시작',
      scoreResult: '시험 결과',
      retake: '다시 풀기',
      questionOf: '문제',
    },
    cultureUi: {
      title: '한국의 문화와 라이프스타일',
      subtitle: '북촌 한옥 마을, 한식 예절, 서울의 역사, K-POP과 드라마 속 표현까지 알아봅니다.',
      keyExpressions: '관련 핵심 표현',
      pillars: {
        all: '전체',
        traditions: '전통',
        cuisine: '한식',
        history: '역사 · 서울',
        kculture: 'K-POP · 드라마',
      },
    },
    quizzesUi: {
      title: '레벨 진단 및 종합 퀴즈',
      subtitle: 'A1부터 C1까지 현재 한국어 실력을 진단하고 주제별 퀴즈를 풀어보세요.',
      placementTab: '레벨 진단 (A1–C1)',
      topicQuizTab: '주제별 퀴즈',
      placementIntro: '단계별로 난이도가 높아지는 10문제를 풀고 나의 한국어 등급을 확인하세요.',
      detectedLevel: '진단된 등급',
      saveLevel: '프로필에 등급 저장',
    },
    tutorUi: {
      title: 'AI 한국어 선생님 민지 (민지 선생님)',
      subtitle: '자유 대화, 문법 교정, 상황극, TOPIK 코칭까지 실시간으로 연습하세요.',
      placeholder: '한국어로 문장을 쓰거나 궁금한 점을 질문해 보세요...',
      send: '보내기',
      thinking: '민지 선생님이 답변을 작성 중입니다...',
      modes: {
        conversation: '자유 회화',
        grammar: '문법 교정',
        roleplay_cafe: '서울 카페 역할극',
        topik_coach: 'TOPIK II 코칭',
      },
      starters: [
        '안녕하세요! 저는 한국어를 처음 배워요.',
        '문장을 확인해 주세요: 오늘 친구랑 카페에 갔어요.',
        '아이스 아메리카노 한 잔 주세요.',
        '은/는과 이/가의 차이가 무엇인가요?',
      ],
      grammarNote: '선생님 노트',
      suggestedVocab: '추천 어휘',
    },
    profileUi: {
      title: '학습자 마이페이지',
      subtitle: '학습 진도, 일일 퀘스트, 배지 및 나만의 한국어 단어장을 관리하세요.',
      dailyQuestsTitle: '오늘의 학습 미션',
      achievementsTitle: '도전 과제 및 배지',
      dictionaryTitle: '내 단어장',
      addCustomWord: '새 단어 추가',
      koreanPlaceholder: '한국어 단어 (예: 행복)',
      transcriptionPlaceholder: '발음 표기 (haengbok)',
      translationPlaceholder: '뜻 (행복)',
      categoryPlaceholder: '분류',
      addBtn: '단어 추가',
      emptyDictionary: '저장된 단어가 없습니다. 어휘 카드에서 저장하거나 직접 추가해 보세요.',
      mastered: '암기 완료',
      reviewing: '복습 중',
      deleteWord: '삭제',
      guestBanner: '게스트 모드로 이용 중입니다. Google 로그인을 하면 XP와 단어장이 클라우드에 저장됩니다.',
    },
  },
};
