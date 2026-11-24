import { useMemo, useState } from 'react';
import { CheckCircle2, RotateCcw, Volume2, XCircle } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import {
  composeHangul,
  FINAL_JAMO,
  HANGUL_CHARS,
  INITIAL_JAMO,
  MEDIAL_JAMO,
} from '../data/curriculumPart1';
import { TRANSLATIONS } from '../data/translations';
import { HangulChar } from '../types/learning';
import { playFeedbackSound, speakKorean } from '../utils/audio';

type HangulTab = 'consonant' | 'double_consonant' | 'vowel' | 'compound_vowel';

const DRILL_POOL = HANGUL_CHARS.slice(0, 14);

export function HangulModule() {
  const { uiLanguage, profile, awardProgress } = useLearning();
  const t = TRANSLATIONS[uiLanguage];

  const [activeTab, setActiveTab] = useState<HangulTab>('consonant');
  const [selectedChar, setSelectedChar] = useState<HangulChar>(HANGUL_CHARS[0]);

  // Syllable builder state
  const [initialIdx, setInitialIdx] = useState(0); // ㄱ
  const [medialIdx, setMedialIdx] = useState(0); // ㅏ
  const [finalIdx, setFinalIdx] = useState(0); // none

  // Audio Drill state
  const [drillTargetIdx, setDrillTargetIdx] = useState(0);
  const [drillAnswer, setDrillAnswer] = useState<number | null>(null);

  const filteredChars = useMemo(
    () => HANGUL_CHARS.filter((c) => c.type === activeTab),
    [activeTab]
  );

  const composed = useMemo(
    () => composeHangul(initialIdx, medialIdx, finalIdx),
    [initialIdx, medialIdx, finalIdx]
  );

  const drillTarget = DRILL_POOL[drillTargetIdx];
  const drillOptions = useMemo(() => {
    const indices = [drillTargetIdx];
    let offset = 1;
    while (indices.length < 4) {
      const candidate = (drillTargetIdx + offset * 3) % DRILL_POOL.length;
      if (!indices.includes(candidate)) indices.push(candidate);
      offset++;
    }
    return indices.sort((a, b) => ((a * 7 + drillTargetIdx) % 13) - ((b * 7 + drillTargetIdx) % 13));
  }, [drillTargetIdx]);

  const handleSelectChar = (charObj: HangulChar) => {
    setSelectedChar(charObj);
    speakKorean(charObj.sampleSyllable);
  };

  const handleCheckDrill = async (chosenIdx: number) => {
    if (drillAnswer !== null) return;
    setDrillAnswer(chosenIdx);
    if (chosenIdx === drillTargetIdx) {
      playFeedbackSound('success');
      await awardProgress({
        xpDelta: 15,
        lessonId: `hangul_${drillTarget.char}`,
        questKey: 'hangulOrVocab',
        achievementHint: 'first_hangul',
      });
    } else {
      playFeedbackSound('error');
    }
  };

  const handleNextDrill = () => {
    setDrillAnswer(null);
    setDrillTargetIdx((prev) => (prev + 1) % DRILL_POOL.length);
  };

  const isCompleted = profile.completedLessons.includes('hangul_mastery');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
            {t.hangulUi.title}
          </h2>
          <p className="text-sm sm:text-base text-[#575063] dark:text-[#B9B2C6] mt-1 max-w-2xl">
            {t.hangulUi.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            awardProgress({
              xpDelta: isCompleted ? 0 : 25,
              lessonId: 'hangul_mastery',
              questKey: 'hangulOrVocab',
              achievementHint: 'first_hangul',
            })
          }
          disabled={isCompleted}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            isCompleted
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 cursor-default'
              : 'bg-[#BE185D] hover:bg-[#9D174D] text-white'
          }`}
        >
          {isCompleted ? t.common.completed : t.common.markComplete}
        </button>
      </div>

      {/* Category Filter Tabs + Grid + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#F2ECF6] dark:bg-[#1E1B29] border border-[#EAE2EE] dark:border-[#2D293B]">
            {(
              [
                ['consonant', t.hangulUi.consonants],
                ['double_consonant', t.hangulUi.doubleConsonants],
                ['vowel', t.hangulUi.vowels],
                ['compound_vowel', t.hangulUi.compoundVowels],
              ] as Array<[HangulTab, string]>
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveTab(key);
                  const first = HANGUL_CHARS.find((c) => c.type === key);
                  if (first) setSelectedChar(first);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  activeTab === key
                    ? 'bg-white dark:bg-[#2C283B] text-[#1E1B24] dark:text-[#F4F1F8] shadow-xs'
                    : 'text-[#575063] dark:text-[#B9B2C6] hover:text-[#1E1B24] dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {filteredChars.map((item) => {
              const active = selectedChar.char === item.char;
              return (
                <button
                  key={item.char}
                  type="button"
                  onClick={() => handleSelectChar(item)}
                  className={`rounded-xl border p-4 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    active
                      ? 'border-[#BE185D] dark:border-[#F472B6] bg-rose-50/80 dark:bg-rose-950/30 ring-1 ring-[#BE185D]/30'
                      : 'border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] hover:border-[#D3C2DE] dark:hover:border-[#423B58]'
                  }`}
                >
                  <span className="font-kr text-3xl font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
                    {item.char}
                  </span>
                  <span className="text-xs font-mono-num text-[#6B6378] dark:text-[#A49CB5]">
                    {item.romanization}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Character Detail Inspector */}
        <div className="lg:col-span-5 rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-100 to-violet-100 dark:from-rose-950/50 dark:to-violet-950/50 border border-rose-200/70 dark:border-rose-900/40 flex items-center justify-center">
                <span className="font-kr text-5xl font-bold text-[#9D174D] dark:text-[#F9A8D4]">
                  {selectedChar.char}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
                  {selectedChar.nameKo}
                </h3>
                <div className="text-xs text-[#6B6378] dark:text-[#A49CB5] mt-1 flex flex-wrap items-center gap-2">
                  <span>[{selectedChar.romanization}]</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {uiLanguage === 'tg' ? selectedChar.tajikHint : selectedChar.cyrillicHint}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedChar.strokes} strokes</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => speakKorean(selectedChar.sampleSyllable)}
              aria-label={t.common.listen}
              className="p-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white transition-colors shrink-0 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-3 border-t border-[#EAE2EE] dark:border-[#2D293B]">
            <p className="text-sm text-[#433D4E] dark:text-[#D5CEE0] leading-relaxed">
              {selectedChar.tip[uiLanguage]}
            </p>
          </div>

          <div className="rounded-xl bg-[#FBF7FD] dark:bg-[#232030] border border-[#EAE2EE] dark:border-[#2D293B] p-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-[#6B6378] dark:text-[#A49CB5]">
                {selectedChar.sampleSyllable} → {selectedChar.sampleWord.meaning[uiLanguage]}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-kr text-xl font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
                  {selectedChar.sampleWord.korean}
                </span>
                <span className="text-xs font-mono-num text-[#6B6378] dark:text-[#A49CB5]">
                  ({selectedChar.sampleWord.transcription})
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => speakKorean(selectedChar.sampleWord.korean)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-[#1B1924] border border-[#D8CCE2] dark:border-[#363147] text-[#1E1B24] dark:text-[#F4F1F8] hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{t.common.listen}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Syllable Builder + Listening Drill */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Syllable Builder */}
        <div className="lg:col-span-7 rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
                {t.hangulUi.builderTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#575063] dark:text-[#B9B2C6] mt-0.5">
                {t.hangulUi.builderSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => speakKorean(composed.syllable)}
              className="px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span className="font-kr text-base">{composed.syllable}</span>
              <span className="font-mono-num">[{composed.roman}]</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#6B6378] dark:text-[#A49CB5] mb-2">
                {t.hangulUi.initialLabel}
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {INITIAL_JAMO.map((j, idx) => (
                  <button
                    key={j + idx}
                    type="button"
                    onClick={() => {
                      setInitialIdx(idx);
                      speakKorean(composeHangul(idx, medialIdx, finalIdx).syllable);
                    }}
                    className={`py-2 rounded-lg font-kr text-sm font-semibold border cursor-pointer transition-colors ${
                      initialIdx === idx
                        ? 'bg-[#BE185D] text-white border-[#BE185D]'
                        : 'bg-[#FCF9F6] dark:bg-[#14121B] border-[#EAE2EE] dark:border-[#2D293B] text-[#1E1B24] dark:text-[#F4F1F8] hover:border-rose-300'
                    }`}
                  >
                    {j}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B6378] dark:text-[#A49CB5] mb-2">
                {t.hangulUi.medialLabel}
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {MEDIAL_JAMO.map((j, idx) => (
                  <button
                    key={j + idx}
                    type="button"
                    onClick={() => {
                      setMedialIdx(idx);
                      speakKorean(composeHangul(initialIdx, idx, finalIdx).syllable);
                    }}
                    className={`py-2 rounded-lg font-kr text-sm font-semibold border cursor-pointer transition-colors ${
                      medialIdx === idx
                        ? 'bg-[#0284C7] text-white border-[#0284C7]'
                        : 'bg-[#FCF9F6] dark:bg-[#14121B] border-[#EAE2EE] dark:border-[#2D293B] text-[#1E1B24] dark:text-[#F4F1F8] hover:border-sky-300'
                    }`}
                  >
                    {j}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6B6378] dark:text-[#A49CB5] mb-2">
                {t.hangulUi.finalLabel}
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {FINAL_JAMO.map((j, idx) => (
                  <button
                    key={`f-${idx}`}
                    type="button"
                    onClick={() => {
                      setFinalIdx(idx);
                      speakKorean(composeHangul(initialIdx, medialIdx, idx).syllable);
                    }}
                    className={`py-2 rounded-lg font-kr text-sm font-semibold border cursor-pointer transition-colors ${
                      finalIdx === idx
                        ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                        : 'bg-[#FCF9F6] dark:bg-[#14121B] border-[#EAE2EE] dark:border-[#2D293B] text-[#1E1B24] dark:text-[#F4F1F8] hover:border-violet-300'
                    }`}
                  >
                    {j || '∅'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Audio Recognition Drill */}
        <div className="lg:col-span-5 rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
              {t.hangulUi.drillTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#575063] dark:text-[#B9B2C6]">
              {t.hangulUi.drillSubtitle}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => speakKorean(drillTarget.sampleSyllable)}
                className="px-4 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/50 text-[#0369A1] dark:text-[#7DD3FC] text-sm font-semibold flex items-center gap-2 hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>{t.common.listen}</span>
              </button>
              <span className="text-xs font-mono-num text-[#6B6378] dark:text-[#A49CB5]">
                [{drillTarget.romanization}]
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {drillOptions.map((optIdx) => {
              const charItem = DRILL_POOL[optIdx];
              const isSelected = drillAnswer === optIdx;
              const isCorrect = optIdx === drillTargetIdx;
              let btnStyle =
                'border-[#EAE2EE] dark:border-[#2D293B] bg-[#FCF9F6] dark:bg-[#14121B] hover:border-[#BE185D]';
              if (drillAnswer !== null) {
                if (isCorrect) {
                  btnStyle =
                    'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300';
                } else if (isSelected) {
                  btnStyle =
                    'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300';
                }
              }

              return (
                <button
                  key={charItem.char}
                  type="button"
                  onClick={() => handleCheckDrill(optIdx)}
                  className={`py-4 rounded-xl border text-center transition-colors cursor-pointer ${btnStyle}`}
                >
                  <span className="font-kr text-3xl font-bold">{charItem.char}</span>
                </button>
              );
            })}
          </div>

          {drillAnswer !== null && (
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#EAE2EE] dark:border-[#2D293B]">
              <div className="flex items-center gap-2 text-xs font-medium">
                {drillAnswer === drillTargetIdx ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-emerald-700 dark:text-emerald-300">{t.common.correct}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="text-rose-700 dark:text-rose-300">
                      {drillTarget.char} ({drillTarget.nameKo})
                    </span>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={handleNextDrill}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#1E1B24] dark:bg-[#F4F1F8] text-white dark:text-[#121118] flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.common.next}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
