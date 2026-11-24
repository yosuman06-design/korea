import { useMemo, useState } from 'react';
import { CheckCircle2, Volume2, XCircle } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { GRAMMAR_LESSONS } from '../data/curriculumPart1';
import { TRANSLATIONS } from '../data/translations';
import { KoreanLevel } from '../types/learning';
import { playFeedbackSound, speakKorean } from '../utils/audio';

export function GrammarModule() {
  const { uiLanguage, profile, awardProgress } = useLearning();
  const t = TRANSLATIONS[uiLanguage];

  const [levelFilter, setLevelFilter] = useState<'ALL' | KoreanLevel>('ALL');
  const [selectedLessonId, setSelectedLessonId] = useState(GRAMMAR_LESSONS[0].id);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const visibleLessons = useMemo(() => {
    if (levelFilter === 'ALL') return GRAMMAR_LESSONS;
    return GRAMMAR_LESSONS.filter((l) => l.level === levelFilter);
  }, [levelFilter]);

  const activeLesson =
    visibleLessons.find((l) => l.id === selectedLessonId) || visibleLessons[0] || GRAMMAR_LESSONS[0];

  const chosenOption = answers[activeLesson.id];
  const isCompleted = profile.completedLessons.includes(activeLesson.id);

  const handleSelectDrill = async (optionIdx: number) => {
    if (chosenOption !== undefined) return;
    setAnswers((prev) => ({ ...prev, [activeLesson.id]: optionIdx }));
    if (optionIdx === activeLesson.drill.correctIndex) {
      playFeedbackSound('success');
      await awardProgress({
        xpDelta: isCompleted ? 5 : 20,
        lessonId: activeLesson.id,
        questKey: 'grammarOrListening',
        achievementHint: 'grammar_builder',
      });
    } else {
      playFeedbackSound('error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
            {t.grammarUi.title}
          </h2>
          <p className="text-sm sm:text-base text-[#575063] dark:text-[#B9B2C6] mt-1 max-w-2xl">
            {t.grammarUi.subtitle}
          </p>
        </div>

        {/* Level Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F2ECF6] dark:bg-[#1E1B29] border border-[#EAE2EE] dark:border-[#2D293B] self-start">
          {(['ALL', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => {
                setLevelFilter(lvl);
                const first = lvl === 'ALL' ? GRAMMAR_LESSONS[0] : GRAMMAR_LESSONS.find((g) => g.level === lvl);
                if (first) setSelectedLessonId(first.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                levelFilter === lvl
                  ? 'bg-white dark:bg-[#2C283B] text-[#1E1B24] dark:text-[#F4F1F8] shadow-xs'
                  : 'text-[#575063] dark:text-[#B9B2C6] hover:text-[#1E1B24] dark:hover:text-white'
              }`}
            >
              {lvl === 'ALL' ? t.common.allLevels : lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-4 space-y-2">
          {visibleLessons.map((lesson) => {
            const active = lesson.id === activeLesson.id;
            const done = profile.completedLessons.includes(lesson.id);
            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => setSelectedLessonId(lesson.id)}
                className={`w-full text-left rounded-xl border p-4 transition-colors cursor-pointer ${
                  active
                    ? 'border-[#0284C7] dark:border-[#38BDF8] bg-sky-50/70 dark:bg-sky-950/25'
                    : 'border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] hover:border-[#D3C2DE] dark:hover:border-[#423B58]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs text-[#6B6378] dark:text-[#A49CB5]">
                  <span>{lesson.level}</span>
                  {done && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ {t.common.completed}
                    </span>
                  )}
                </div>
                <div className="font-kr text-base font-bold text-[#1E1B24] dark:text-[#F4F1F8] mt-1">
                  {lesson.pattern}
                </div>
                <div className="text-xs text-[#575063] dark:text-[#B9B2C6] mt-0.5 line-clamp-1">
                  {lesson.title[uiLanguage]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Detail & Interactive Drill */}
        <div className="lg:col-span-8 rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-6 sm:p-8 space-y-6">
          <div className="space-y-2 border-b border-[#EAE2EE] dark:border-[#2D293B] pb-5">
            <div className="flex items-center gap-2 text-xs text-[#6B6378] dark:text-[#A49CB5]">
              <span>{activeLesson.level}</span>
              <span aria-hidden="true">·</span>
              <span>{t.grammarUi.politeness}: {activeLesson.politeness}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
              <span className="font-kr text-[#BE185D] dark:text-[#F472B6] mr-2">
                {activeLesson.pattern}
              </span>
              {activeLesson.title[uiLanguage]}
            </h3>
            <p className="text-sm sm:text-base text-[#433D4E] dark:text-[#D5CEE0] leading-relaxed pt-1">
              {activeLesson.explanation[uiLanguage]}
            </p>
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#1E1B24] dark:text-[#F4F1F8]">
              {t.grammarUi.examples}
            </h4>
            <div className="space-y-2.5">
              {activeLesson.examples.map((ex, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-[#FCF9F6] dark:bg-[#14121B] border border-[#EAE2EE] dark:border-[#2D293B] p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-kr text-base sm:text-lg font-semibold text-[#1E1B24] dark:text-[#F4F1F8]">
                      {ex.korean}
                    </div>
                    <div className="text-xs font-mono-num text-[#6B6378] dark:text-[#A49CB5] mt-0.5">
                      {ex.transcription}
                    </div>
                    <div className="text-sm text-[#575063] dark:text-[#B9B2C6] mt-1">
                      {ex.translation[uiLanguage]}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakKorean(ex.korean)}
                    aria-label={t.common.listen}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#232030] border border-[#EAE2EE] dark:border-[#363147] text-[#0284C7] dark:text-[#38BDF8] hover:bg-sky-50 dark:hover:bg-sky-950/30 shrink-0 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Practice Drill */}
          <div className="rounded-xl bg-[#FBF7FD] dark:bg-[#232030] border border-[#EAE2EE] dark:border-[#2D293B] p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-bold text-[#7C3AED] dark:text-[#C4B5FD]">
                {t.grammarUi.practiceTitle}
              </h4>
              {chosenOption !== undefined && (
                <button
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => {
                      const next = { ...prev };
                      delete next[activeLesson.id];
                      return next;
                    })
                  }
                  className="text-xs font-medium text-[#6B6378] dark:text-[#A49CB5] hover:underline cursor-pointer"
                >
                  {t.common.reset}
                </button>
              )}
            </div>

            <p className="text-sm text-[#433D4E] dark:text-[#D5CEE0]">
              {activeLesson.drill.prompt[uiLanguage]}
            </p>

            <div className="font-kr text-lg sm:text-xl font-semibold text-[#1E1B24] dark:text-[#F4F1F8] bg-white dark:bg-[#1B1924] rounded-xl px-4 py-3 border border-[#EAE2EE] dark:border-[#2D293B]">
              {activeLesson.drill.sentenceBefore}
              <span className="inline-block min-w-[3.5rem] text-center border-b-2 border-[#BE185D] dark:border-[#F472B6] mx-1 text-[#BE185D] dark:text-[#F472B6]">
                {chosenOption !== undefined ? activeLesson.drill.options[chosenOption] : '____'}
              </span>
              {activeLesson.drill.sentenceAfter}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {activeLesson.drill.options.map((opt, idx) => {
                const isSelected = chosenOption === idx;
                const isCorrect = idx === activeLesson.drill.correctIndex;
                let cls =
                  'bg-white dark:bg-[#1B1924] border-[#EAE2EE] dark:border-[#2D293B] hover:border-[#7C3AED]';
                if (chosenOption !== undefined) {
                  if (isCorrect) {
                    cls =
                      'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-700 dark:text-emerald-300';
                  } else if (isSelected) {
                    cls =
                      'bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-700 dark:text-rose-300';
                  }
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectDrill(idx)}
                    className={`py-2.5 px-3 rounded-xl border font-kr text-sm font-semibold transition-colors cursor-pointer ${cls}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {chosenOption !== undefined && (
              <div className="pt-2 space-y-1.5 text-sm">
                <div className="flex items-center gap-2 font-semibold">
                  {chosenOption === activeLesson.drill.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 dark:text-emerald-300">{t.common.correct}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span className="text-rose-700 dark:text-rose-300">{t.common.incorrect}</span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#575063] dark:text-[#B9B2C6]">
                  {activeLesson.drill.explanation[uiLanguage]}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
