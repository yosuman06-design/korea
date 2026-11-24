import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, RotateCcw, Trophy, XCircle } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { EXAM_QUESTIONS } from '../data/curriculumPart2';
import { TRANSLATIONS } from '../data/translations';
import { playFeedbackSound } from '../utils/audio';

export function TopikModule() {
  const { uiLanguage, awardProgress } = useLearning();
  const t = TRANSLATIONS[uiLanguage];

  const [track, setTrack] = useState<'TOPIK_I' | 'TOPIK_II'>('TOPIK_I');
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [finished, setFinished] = useState(false);

  const questions = useMemo(
    () => EXAM_QUESTIONS.filter((q) => q.track === track),
    [track]
  );

  useEffect(() => {
    if (!started || finished) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setFinished(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [started, finished]);

  const currentQ = questions[currentIdx];

  const scoreCount = useMemo(
    () => questions.reduce((acc, q) => (answers[q.id] === q.correctIndex ? acc + 1 : acc), 0),
    [questions, answers]
  );

  const startTest = () => {
    setAnswers({});
    setCurrentIdx(0);
    setSecondsLeft(300);
    setFinished(false);
    setStarted(true);
  };

  const handleSelectOption = (optIdx: number) => {
    if (!currentQ || answers[currentQ.id] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
    if (optIdx === currentQ.correctIndex) {
      playFeedbackSound('success');
    } else {
      playFeedbackSound('error');
    }
  };

  const handleFinish = async () => {
    setFinished(true);
    await awardProgress({
      xpDelta: 20 + scoreCount * 10,
      lessonId: `topik_${track.toLowerCase()}`,
      questKey: 'quiz',
      achievementHint: 'topik_challenger',
    });
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
            {t.topikUi.title}
          </h2>
          <p className="text-sm sm:text-base text-[#575063] dark:text-[#B9B2C6] mt-1 max-w-2xl">
            {t.topikUi.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F2ECF6] dark:bg-[#1E1B29] border border-[#EAE2EE] dark:border-[#2D293B] self-start">
          <button
            type="button"
            onClick={() => {
              setTrack('TOPIK_I');
              setStarted(false);
              setFinished(false);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
              track === 'TOPIK_I'
                ? 'bg-white dark:bg-[#2C283B] text-[#1E1B24] dark:text-[#F4F1F8] shadow-xs'
                : 'text-[#575063] dark:text-[#B9B2C6]'
            }`}
          >
            {t.topikUi.track1}
          </button>
          <button
            type="button"
            onClick={() => {
              setTrack('TOPIK_II');
              setStarted(false);
              setFinished(false);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
              track === 'TOPIK_II'
                ? 'bg-white dark:bg-[#2C283B] text-[#1E1B24] dark:text-[#F4F1F8] shadow-xs'
                : 'text-[#575063] dark:text-[#B9B2C6]'
            }`}
          >
            {t.topikUi.track2}
          </button>
        </div>
      </div>

      {!started ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-7 space-y-4">
            <div className="text-xs text-[#6B6378] dark:text-[#A49CB5]">
              {track === 'TOPIK_I' ? '1급 – 2급 · 200 Max Score' : '3급 – 6급 · 300 Max Score'}
            </div>
            <h3 className="text-xl font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
              {track === 'TOPIK_I' ? t.topikUi.track1 : t.topikUi.track2}
            </h3>
            <p className="text-sm text-[#575063] dark:text-[#B9B2C6] leading-relaxed">
              {track === 'TOPIK_I'
                ? uiLanguage === 'ru'
                  ? 'Базовый экзамен проверяет владение алфавитом, повседневной лексикой, базовыми частицами и пониманием коротких текстов.'
                  : uiLanguage === 'tg'
                    ? 'Имтиҳони ибтидоӣ дониши алифбо, луғати рӯзмарра ва фаҳмиши матнҳои кӯтоҳро месанҷад.'
                    : uiLanguage === 'ko'
                      ? '기초 어휘, 조사, 생활 문법과 짧은 읽기 지문을 평가하는 초급 모의고사입니다.'
                      : 'Beginner exam covering everyday vocabulary, core particles, polite forms, and short reading passages.'
                : uiLanguage === 'ru'
                  ? 'Продвинутый экзамен для учёбы и карьеры в Корее: сложные союзы, синонимы, логика текстов и академический стиль.'
                  : uiLanguage === 'tg'
                    ? 'Имтиҳони пешрафта барои таҳсил ва кор дар Корея: пайвандакҳои мураккаб, синонимҳо ва матнҳои илмӣ.'
                    : uiLanguage === 'ko'
                      ? '유학 및 취업을 위한 중·고급 시험으로 관용 표현, 동의어, 논리적 독해를 평가합니다.'
                      : 'Intermediate-to-advanced exam for university & career in Korea covering idioms, synonyms, and formal logic.'}
            </p>
            <button
              type="button"
              onClick={startTest}
              className="px-5 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold cursor-pointer"
            >
              {t.topikUi.startMock}
            </button>
          </div>

          <div className="rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-[#FBF7FD] dark:bg-[#232030] p-7 space-y-3">
            <h4 className="text-sm font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
              {uiLanguage === 'ru'
                ? 'Шкала уровней TOPIK'
                : uiLanguage === 'tg'
                  ? 'Ҷадвали сатҳҳои TOPIK'
                  : uiLanguage === 'ko'
                    ? 'TOPIK 등급 기준'
                    : 'TOPIK Scoring Bands'}
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-[#575063] dark:text-[#B9B2C6] tabular-nums">
              <div className="flex justify-between py-1.5 border-b border-[#EAE2EE] dark:border-[#363147]">
                <span>TOPIK I · 1급 (A1)</span>
                <span className="font-mono-num">80 – 139 / 200</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#EAE2EE] dark:border-[#363147]">
                <span>TOPIK I · 2급 (A2)</span>
                <span className="font-mono-num">140 – 200 / 200</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#EAE2EE] dark:border-[#363147]">
                <span>TOPIK II · 3–4급 (B1–B2)</span>
                <span className="font-mono-num">120 – 189 / 300</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>TOPIK II · 5–6급 (C1–C2)</span>
                <span className="font-mono-num">190 – 300 / 300</span>
              </div>
            </div>
          </div>
        </div>
      ) : finished ? (
        <div className="rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-950/50 text-[#7C3AED] dark:text-[#C4B5FD] flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-[#6B6378] dark:text-[#A49CB5]">{t.topikUi.scoreResult}</div>
                <div className="text-2xl font-bold font-mono-num tabular-nums text-[#1E1B24] dark:text-[#F4F1F8]">
                  {scoreCount} / {questions.length}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={startTest}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.topikUi.retake}</span>
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q, i) => {
              const userAns = answers[q.id];
              const ok = userAns === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-[#EAE2EE] dark:border-[#2D293B] bg-[#FCF9F6] dark:bg-[#14121B] p-4 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#6B6378] dark:text-[#A49CB5]">
                      #{i + 1} · {q.topic} ({q.level})
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
          <div className="flex items-center justify-between gap-4 border-b border-[#EAE2EE] dark:border-[#2D293B] pb-4">
            <div className="text-xs font-medium text-[#6B6378] dark:text-[#A49CB5] font-mono-num tabular-nums">
              {t.topikUi.questionOf} {currentIdx + 1} / {questions.length} · {currentQ.topic}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono-num tabular-nums text-[#BE185D] dark:text-[#F472B6] font-semibold">
              <Clock className="w-4 h-4" />
              <span>{formatTime(secondsLeft)}</span>
            </div>
          </div>

          {currentQ.passage && (
            <div className="rounded-xl bg-[#FCF9F6] dark:bg-[#14121B] border border-[#EAE2EE] dark:border-[#2D293B] p-4 font-kr text-base leading-relaxed text-[#1E1B24] dark:text-[#F4F1F8]">
              {currentQ.passage}
            </div>
          )}

          <p className="text-base sm:text-lg font-semibold text-[#1E1B24] dark:text-[#F4F1F8]">
            {currentQ.question[uiLanguage]}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              const chosen = answers[currentQ.id];
              const isSelected = chosen === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let cls =
                'bg-[#FCF9F6] dark:bg-[#14121B] border-[#EAE2EE] dark:border-[#2D293B] hover:border-[#7C3AED]';
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
                  onClick={() => handleSelectOption(idx)}
                  className={`text-left px-4 py-3.5 rounded-xl border font-kr text-sm sm:text-base font-medium cursor-pointer transition-colors ${cls}`}
                >
                  {idx + 1}. {opt}
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
              {currentIdx < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIdx((i) => i + 1)}
                  className="px-4 py-2 rounded-xl bg-[#1E1B24] dark:bg-[#F4F1F8] text-white dark:text-[#121118] text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t.common.next} →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-4 py-2 rounded-xl bg-[#BE185D] hover:bg-[#9D174D] text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t.topikUi.scoreResult}
                </button>
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
