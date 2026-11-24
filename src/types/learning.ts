export type UiLanguage = 'ru' | 'en' | 'tg' | 'ko';

export type KoreanLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type ModuleSection =
  | 'overview'
  | 'hangul'
  | 'grammar'
  | 'vocabulary'
  | 'dialogues'
  | 'listening'
  | 'topik'
  | 'culture'
  | 'quizzes'
  | 'tutor'
  | 'profile';

export type LocalizedText = Record<UiLanguage, string>;

export interface DailyQuestProgress {
  hangulOrVocab: number;
  grammarOrListening: number;
  aiTutor: number;
  quiz: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  level: KoreanLevel;
  xp: number;
  streak: number;
  lastActiveDate: string;
  uiLanguage: UiLanguage;
  completedLessons: string[];
  unlockedAchievements: string[];
  dailyQuestDate: string;
  dailyQuestProgress: DailyQuestProgress;
  placementScore: number;
}

export interface DictionaryEntry {
  id: string;
  userId: string;
  korean: string;
  transcription: string;
  translation: string;
  category: string;
  example: string;
  mastered: boolean;
}

export interface HangulChar {
  char: string;
  type: 'consonant' | 'double_consonant' | 'vowel' | 'compound_vowel';
  romanization: string;
  cyrillicHint: string;
  tajikHint: string;
  nameKo: string;
  strokes: number;
  tip: LocalizedText;
  sampleSyllable: string;
  sampleWord: {
    korean: string;
    transcription: string;
    meaning: LocalizedText;
  };
}

export interface GrammarExample {
  korean: string;
  transcription: string;
  translation: LocalizedText;
}

export interface GrammarLesson {
  id: string;
  level: KoreanLevel;
  pattern: string;
  title: LocalizedText;
  explanation: LocalizedText;
  politeness: string;
  examples: GrammarExample[];
  drill: {
    prompt: LocalizedText;
    sentenceBefore: string;
    sentenceAfter: string;
    options: string[];
    correctIndex: number;
    explanation: LocalizedText;
  };
}

export interface VocabCard {
  id: string;
  korean: string;
  transcription: string;
  category: 'greetings' | 'food' | 'travel' | 'daily' | 'emotions' | 'topik';
  level: KoreanLevel;
  translation: LocalizedText;
  partOfSpeech: LocalizedText;
  example: {
    korean: string;
    transcription: string;
    translation: LocalizedText;
  };
}

export interface DialogueLine {
  speaker: string;
  speakerRole: 'a' | 'b';
  korean: string;
  transcription: string;
  translation: LocalizedText;
}

export interface DialogueScenario {
  id: string;
  level: KoreanLevel;
  title: LocalizedText;
  setting: LocalizedText;
  lines: DialogueLine[];
  practicePrompt: {
    question: LocalizedText;
    options: string[];
    correctIndex: number;
    explanation: LocalizedText;
  };
}

export interface ListeningExercise {
  id: string;
  level: KoreanLevel;
  title: LocalizedText;
  audioText: string;
  transcription: string;
  translation: LocalizedText;
  question: LocalizedText;
  options: LocalizedText[];
  correctIndex: number;
  explanation: LocalizedText;
}

export interface ExamQuestion {
  id: string;
  track: 'TOPIK_I' | 'TOPIK_II' | 'PLACEMENT' | 'QUIZ';
  level: KoreanLevel;
  topic: string;
  passage?: string;
  question: LocalizedText;
  options: string[];
  correctIndex: number;
  explanation: LocalizedText;
}

export interface CultureArticle {
  id: string;
  pillar: 'traditions' | 'cuisine' | 'history' | 'kculture';
  image: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  readTime: string;
  summary: LocalizedText;
  highlights: LocalizedText[];
  expressions: Array<{
    korean: string;
    transcription: string;
    meaning: LocalizedText;
  }>;
}
