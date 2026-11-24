import { useMemo, useState } from 'react';
import { Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, RotateCw, Volume2 } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { VOCAB_CARDS } from '../data/curriculumPart1';
import { TRANSLATIONS } from '../data/translations';
import { VocabCard } from '../types/learning';
import { speakKorean } from '../utils/audio';

type VocabCategoryFilter = 'all' | VocabCard['category'];

export function VocabularyModule() {
  const { uiLanguage, dictionary, saveWordToDictionary, awardProgress } = useLearning();
  const t = TRANSLATIONS[uiLanguage];

  const [category, setCategory] = useState<VocabCategoryFilter>('all');
  const [viewMode, setViewMode] = useState<'flashcard' | 'grid'>('flashcard');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const filteredWords = useMemo(() => {
    if (category === 'all') return VOCAB_CARDS;
    return VOCAB_CARDS.filter((w) => w.category === category);
  }, [category]);

  const currentCard = filteredWords[cardIndex] || filteredWords[0];

  const isSaved = (korean: string) => dictionary.some((d) => d.korean === korean);

  const handleSave = async (card: VocabCard) => {
    await saveWordToDictionary({
      idHint: `vocab_${card.id}`,
      korean: card.korean,
      transcription: card.transcription,
      translation: card.translation[uiLanguage],
      category: card.category,
      example: card.example.korean,
    });
  };

  const handleNextCard = () => {
    setFlipped(false);
    setCardIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const handlePrevCard = () => {
    setFlipped(false);
    setCardIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  const categories: Array<[VocabCategoryFilter, string]> = [
    ['all', t.vocabUi.categories.all],
    ['greetings', t.vocabUi.categories.greetings],
    ['food', t.vocabUi.categories.food],
    ['travel', t.vocabUi.categories.travel],
    ['daily', t.vocabUi.categories.daily],
    ['emotions', t.vocabUi.categories.emotions],
    ['topik', t.vocabUi.categories.topik],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
            {t.vocabUi.title}
          </h2>
          <p className="text-sm sm:text-base text-[#575063] dark:text-[#B9B2C6] mt-1 max-w-2xl">
            {t.vocabUi.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F2ECF6] dark:bg-[#1E1B29] border border-[#EAE2EE] dark:border-[#2D293B] self-start">
          <button
            type="button"
            onClick={() => setViewMode('flashcard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'flashcard'
                ? 'bg-white dark:bg-[#2C283B] text-[#1E1B24] dark:text-[#F4F1F8] shadow-xs'
                : 'text-[#575063] dark:text-[#B9B2C6]'
            }`}
          >
            {t.vocabUi.flashcardMode}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-[#2C283B] text-[#1E1B24] dark:text-[#F4F1F8] shadow-xs'
                : 'text-[#575063] dark:text-[#B9B2C6]'
            }`}
          >
            {t.vocabUi.gridMode}
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#F2ECF6] dark:bg-[#1E1B29] border border-[#EAE2EE] dark:border-[#2D293B]">
        {categories.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setCategory(key);
              setCardIndex(0);
              setFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              category === key
                ? 'bg-white dark:bg-[#2C283B] text-[#1E1B24] dark:text-[#F4F1F8] shadow-xs'
                : 'text-[#575063] dark:text-[#B9B2C6] hover:text-[#1E1B24] dark:hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {viewMode === 'flashcard' && currentCard ? (
        <div className="max-w-2xl mx-auto space-y-5">
          <div
            onClick={() => setFlipped((f) => !f)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setFlipped((f) => !f);
              }
            }}
            className="rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-8 sm:p-10 min-h-[290px] flex flex-col justify-between cursor-pointer hover:border-[#D3C2DE] dark:hover:border-[#423B58] transition-colors"
          >
            <div className="flex items-center justify-between text-xs text-[#6B6378] dark:text-[#A49CB5]">
              <span>
                {currentCard.level} · {currentCard.partOfSpeech[uiLanguage]}
              </span>
              <span className="font-mono-num tabular-nums">
                {cardIndex + 1} / {filteredWords.length}
              </span>
            </div>

            {!flipped ? (
              <div className="text-center py-6 space-y-2">
                <div className="font-kr text-4xl sm:text-5xl font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
                  {currentCard.korean}
                </div>
                <div className="text-sm font-mono-num text-[#7C3AED] dark:text-[#C4B5FD]">
                  [{currentCard.transcription}]
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="text-2xl sm:text-3xl font-bold text-[#BE185D] dark:text-[#F472B6]">
                  {currentCard.translation[uiLanguage]}
                </div>
                <div className="rounded-xl bg-[#FCF9F6] dark:bg-[#14121B] border border-[#EAE2EE] dark:border-[#2D293B] p-4 text-left space-y-1">
                  <div className="font-kr text-base font-semibold text-[#1E1B24] dark:text-[#F4F1F8]">
                    {currentCard.example.korean}
                  </div>
                  <div className="text-xs font-mono-num text-[#6B6378] dark:text-[#A49CB5]">
                    {currentCard.example.transcription}
                  </div>
                  <div className="text-sm text-[#575063] dark:text-[#B9B2C6]">
                    {currentCard.example.translation[uiLanguage]}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-xs text-[#6B6378] dark:text-[#A49CB5]">
              <RotateCw className="w-3.5 h-3.5" />
              <span>{t.vocabUi.flipHint}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevCard}
                aria-label="Previous card"
                className="p-2.5 rounded-xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] hover:bg-[#FBF7FD] dark:hover:bg-[#232030] cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextCard}
                aria-label="Next card"
                className="p-2.5 rounded-xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] hover:bg-[#FBF7FD] dark:hover:bg-[#232030] cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  speakKorean(currentCard.korean, 0.95);
                  awardProgress({ xpDelta: 2, questKey: 'hangulOrVocab' });
                }}
                className="px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>{t.common.listen}</span>
              </button>

              <button
                type="button"
                onClick={() => speakKorean(currentCard.example.korean, 0.72)}
                className="px-3.5 py-2.5 rounded-xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] text-xs font-medium hover:bg-sky-50 dark:hover:bg-sky-950/30 cursor-pointer"
              >
                {t.common.listenSlow}
              </button>

              <button
                type="button"
                onClick={() => handleSave(currentCard)}
                disabled={isSaved(currentCard.korean)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                  isSaved(currentCard.korean)
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 cursor-default'
                    : 'bg-[#BE185D] hover:bg-[#9D174D] text-white'
                }`}
              >
                {isSaved(currentCard.korean) ? (
                  <>
                    <BookmarkCheck className="w-4 h-4" />
                    <span>{t.common.savedWord}</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>{t.common.saveWord}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map((card) => {
            const saved = isSaved(card.korean);
            return (
              <div
                key={card.id}
                className="rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#6B6378] dark:text-[#A49CB5]">
                    <span>
                      {card.level} · {card.partOfSpeech[uiLanguage]}
                    </span>
                    <button
                      type="button"
                      onClick={() => speakKorean(card.korean)}
                      aria-label={t.common.listen}
                      className="text-[#0284C7] dark:text-[#38BDF8] hover:opacity-80 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="font-kr text-2xl font-bold text-[#1E1B24] dark:text-[#F4F1F8] mt-2">
                    {card.korean}
                  </div>
                  <div className="text-xs font-mono-num text-[#7C3AED] dark:text-[#C4B5FD]">
                    [{card.transcription}]
                  </div>
                  <div className="text-sm font-medium text-[#BE185D] dark:text-[#F472B6] mt-1">
                    {card.translation[uiLanguage]}
                  </div>
                  <p className="text-xs text-[#575063] dark:text-[#B9B2C6] mt-3 pt-3 border-t border-[#EAE2EE] dark:border-[#2D293B] font-kr">
                    {card.example.korean}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSave(card)}
                  disabled={saved}
                  className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                    saved
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50'
                      : 'bg-[#FCF9F6] dark:bg-[#14121B] border border-[#EAE2EE] dark:border-[#2D293B] hover:border-[#BE185D] text-[#1E1B24] dark:text-[#F4F1F8]'
                  }`}
                >
                  {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  <span>{saved ? t.common.savedWord : t.common.saveWord}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
