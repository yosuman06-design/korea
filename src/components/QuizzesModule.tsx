import { useMemo, useState } from 'react';
import { Award, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { EXAM_QUESTIONS } from '../data/curriculumPart2';
import { TRANSLATIONS } from '../data/translations';
import { KoreanLevel } from '../types/learning';
import { playFeedbackSound } from '../utils/audio';

export function QuizzesModule() {
  const { uiLanguage, profile, updateLearnerLevel, awardProgress } = useLearning();
  const t = TRANSLATIONS[uiLanguage];

  const [mode, setMode] = useState<'placement' | 'topic'>('placement');
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState(false);

  const placementQuestions = useMemo(
    () => EXAM_QUESTIONS.filter((q) => q.track === 'PLACEMENT'),
    []
  );
  const topicQuestions = useMemo(
    () => EXAM_QUESTIONS.filter((q) => q.track === 'TOPIK_I' || q.track === 'TOPIK_II'),
    []
  );

  const activeList = mode === 'placement' ? placementQuestions : topicQuestions;
  const currentQ = activeList[idx];

  const score = useMemo(
    () => activeList.reduce((acc, q) => (answers[q.id] === q.correctIndex ? acc + 1 : acc), 0),
    [activeList, answers]
  );

  const computedLevel: KoreanLevel = useMemo(() => {
    if (score >= 9) return 'C1';
    if (score >= 7) return 'B2';
    if (score >= 5) return 'B1';
    if (score >= 3) return 'A2';
    return 'A1';
  }, [score]);

  const handleChoose = (optIdx: number) => {
    if (!currentQ || answers[currentQ.id] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
    if (optIdx === currentQ.correctIndex) {
      playFeedbackSound('success');
    } else {
      playFeedbackSound('error');
    }
  };

  const handleNext = async () => {
    if (idx < activeList.length - 1) {
      setIdx((i) => i + 1);
      return;
    }
    setCompleted(true);
    if (mode === 'placement') {
      await updateLearnerLevel(computedLevel, score);
    } else {
      await awardProgress({
        xpDelta: 15 + score * 5,
        questKey: 'quiz',
      });
    }
  };

  const resetQuiz = (nextMode?: 'placement' | 'topic') => {
    if (nextMode) setMode(nextMode);
    setIdx(0);
    setAnswers({});
    setCompleted(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
            {t.quizzesUi.title}
          </h2>
          <p className="text-sm sm:text-base text-[#575063] dark:text-[#B9B2C6] mt-1 max-w-2xl">
            {t.quizzesUi.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F2ECF6] dark:bg-[#1E1B29] border border-[#EAE2EE] dark:border-[#2D293B] self-start">
          <button
            type="button"
            onClick={() => resetQuiz('placement')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'placement'
                ? 'bg-white dark:bg-[#2C283B] text-[#1E1B24] dark:text-[#F4F1F8] shadow-xs'
                : 'text-[#575063] dark:text-[#B9B2C6]'
            }`}
          >
            {t.quizzesUi.placementTab}
          </button>
          <button
            type="button"
            onClick={() => resetQuiz('topic')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'topic'
                ? 'bg-white dark:bg-[#2C283B] text-[#1E1B24] dark:text-[#F4F1F8] shadow-xs'
                : 'text-[#575063] dark:text-[#B9B2C6]'
            }`}
          >
            {t.quizzesUi.topicQuizTab}
          </button>
        </div>
      </div>

      {completed ? (
        <div className="rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-7 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-[#BE185D] dark:text-[#F472B6] flex items-center justify-center">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs text-[#6B6378] dark:text-[#A49CB5]">
                  {mode === 'placement' ? t.quizzesUi.detectedLevel : t.topikUi.scoreResult}
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-mono-num tabular-nums text-[#1E1B24] dark:text-[#F4F1F8]">
                  {mode === 'placement'
                    ? `${computedLevel} (${score}/${activeList.length})`
                    : `${score} / ${activeList.length}`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {mode === 'placement' && (
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  ✓ {profile.level}
                </span>
              )}
              <button
                type="button"
                onClick={() => resetQuiz()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#BE185D] hover:bg-[#9D174D] text-white text-xs font-semibold cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.topikUi.retake}</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {activeList.map((q, i) => {
              const userAns = answers[q.id];
              const ok = userAns === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-[#EAE2EE] dark:border-[#2D293B] bg-[#FCF9F6] dark:bg-[#14121B] p-4 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6B6378] dark:text-[#A49CB5]">
                      #{i + 1} · {q.level} · {q.topic}
                    </span>
                    {ok ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {t.common.correct}
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> {q.options[q.correctIndex]}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-[#1E1B24] dark:text-[#F4F1F8]">
                    {q.question[uiLanguage]}
                  </p>
                  <p className="text-xs text-[#575063] dark:text-[#B9B2C6]">
                    {q.explanation[uiLanguage]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : currentQ ? (
        <div className="rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-6 sm:p-8 space-y-6">
          {mode === 'placement' && idx === 0 && answers[currentQ.id] === undefined && (
            <p className="text-xs sm:text-sm text-[#575063] dark:text-[#B9B2C6] pb-2 border-b border-[#EAE2EE] dark:border-[#2D293B]">
              {t.quizzesUi.placementIntro}
            </p>
          )}

          <div className="flex items-center justify-between gap-4">
            <div className="text-xs font-mono-num tabular-nums text-[#6B6378] dark:text-[#A49CB5]">
              {t.topikUi.questionOf} {idx + 1} / {activeList.length} · {currentQ.level} · {currentQ.topic}
            </div>
            <div className="w-32 h-2 rounded-full bg-[#F2ECF6] dark:bg-[#232030] overflow-hidden">
              <div
                className="h-full bg-[#BE185D] dark:bg-[#F472B6] transition-all"
                style={{ width: `${((idx + 1) / activeList.length) * 100}%` }}
              />
            </div>
          </div>

          {currentQ.passage && (
            <div className="rounded-xl bg-[#FCF9F6] dark:bg-[#14121B] border border-[#EAE2EE] dark:border-[#2D293B] p-4 font-kr text-base leading-relaxed">
              {currentQ.passage}
            </div>
          )}

          <p className="text-base sm:text-lg font-semibold text-[#1E1B24] dark:text-[#F4F1F8]">
            {currentQ.question[uiLanguage]}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, optIdx) => {
              const chosen = answers[currentQ.id];
              const isSelected = chosen === optIdx;
              const isCorrect = optIdx === currentQ.correctIndex;
              let cls =
                'bg-[#FCF9F6] dark:bg-[#14121B] border-[#EAE2EE] dark:border-[#2D293B] hover:border-[#BE185D]';
              if (chosen !== undefined) {
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
                  onClick={() => handleChoose(optIdx)}
                  className={`text-left px-4 py-3.5 rounded-xl border font-kr text-sm sm:text-base font-medium cursor-pointer transition-colors ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {answers[currentQ.id] !== undefined && (
            <div className="rounded-xl bg-[#FBF7FD] dark:bg-[#232030] border border-[#EAE2EE] dark:border-[#2D293B] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs sm:text-sm text-[#433D4E] dark:text-[#D5CEE0]">
                <strong className="mr-1">{t.common.explanation}:</strong>
                {currentQ.explanation[uiLanguage]}
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-xl bg-[#BE185D] hover:bg-[#9D174D] text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                {idx < activeList.length - 1 ? `${t.common.next} →` : t.topikUi.scoreResult}
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
