import { useState } from 'react';
import { CheckCircle2, Eye, EyeOff, Headphones, Volume2, XCircle } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { LISTENING_EXERCISES } from '../data/curriculumPart2';
import { TRANSLATIONS } from '../data/translations';
import { playFeedbackSound, speakKorean } from '../utils/audio';

export function ListeningModule() {
  const { uiLanguage, awardProgress } = useLearning();
  const t = TRANSLATIONS[uiLanguage];

  const [activeIdx, setActiveIdx] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const exercise = LISTENING_EXERCISES[activeIdx] || LISTENING_EXERCISES[0];
  const chosenOption = answers[exercise.id];

  const handlePlay = (rate: number) => {
    setIsPlaying(true);
    speakKorean(exercise.audioText, rate, () => setIsPlaying(false));
  };

  const handleAnswer = async (optIdx: number) => {
    if (chosenOption !== undefined) return;
    setAnswers((prev) => ({ ...prev, [exercise.id]: optIdx }));
    if (optIdx === exercise.correctIndex) {
      playFeedbackSound('success');
      await awardProgress({
        xpDelta: 25,
        lessonId: exercise.id,
        questKey: 'grammarOrListening',
      });
    } else {
      playFeedbackSound('error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
          {t.listeningUi.title}
        </h2>
        <p className="text-sm sm:text-base text-[#575063] dark:text-[#B9B2C6] mt-1 max-w-2xl">
          {t.listeningUi.subtitle}
        </p>
      </div>

      {/* Exercise Selector */}
      <div className="flex flex-wrap items-center gap-2">
        {LISTENING_EXERCISES.map((ex, idx) => (
          <button
            key={ex.id}
            type="button"
            onClick={() => {
              setActiveIdx(idx);
              setShowTranscript(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              activeIdx === idx
                ? 'bg-[#0284C7] text-white border-[#0284C7]'
                : 'bg-white dark:bg-[#1B1924] border-[#EAE2EE] dark:border-[#2D293B] text-[#1E1B24] dark:text-[#F4F1F8] hover:border-sky-300'
            }`}
          >
            {ex.level} · {ex.title[uiLanguage]}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-6 sm:p-8 space-y-6">
        {/* Audio Player Stage */}
        <div className="rounded-2xl bg-gradient-to-br from-sky-50/80 via-white to-violet-50/80 dark:from-[#182232] dark:via-[#1B1924] dark:to-[#221C30] border border-[#EAE2EE] dark:border-[#2D293B] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                isPlaying
                  ? 'bg-[#0284C7] text-white'
                  : 'bg-sky-100 dark:bg-sky-950/60 text-[#0284C7] dark:text-[#38BDF8]'
              }`}
            >
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-[#6B6378] dark:text-[#A49CB5]">
                {exercise.level} · {t.modules.listening}
              </div>
              <h3 className="text-lg font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
                {exercise.title[uiLanguage]}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => handlePlay(0.95)}
              className="px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>{t.listeningUi.playAudio}</span>
            </button>

            <button
              type="button"
              onClick={() => handlePlay(0.7)}
              className="px-3.5 py-2.5 rounded-xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] text-xs font-semibold hover:bg-sky-50 dark:hover:bg-sky-950/30 cursor-pointer"
            >
              {t.listeningUi.playSlowAudio}
            </button>

            <button
              type="button"
              onClick={() => setShowTranscript((s) => !s)}
              className="px-3.5 py-2.5 rounded-xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              {showTranscript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showTranscript ? t.listeningUi.hideTranscript : t.listeningUi.showTranscript}</span>
            </button>
          </div>
        </div>

        {/* Optional Transcript */}
        {showTranscript && (
          <div className="rounded-xl bg-[#FCF9F6] dark:bg-[#14121B] border border-[#EAE2EE] dark:border-[#2D293B] p-4 space-y-1">
            <div className="font-kr text-base sm:text-lg font-semibold text-[#1E1B24] dark:text-[#F4F1F8]">
              {exercise.audioText}
            </div>
            <div className="text-xs font-mono-num text-[#7C3AED] dark:text-[#C4B5FD]">
              {exercise.transcription}
            </div>
            <div className="text-sm text-[#575063] dark:text-[#B9B2C6] pt-1">
              {exercise.translation[uiLanguage]}
            </div>
          </div>
        )}

        {/* Question */}
        <div className="space-y-3">
          <p className="text-base font-semibold text-[#1E1B24] dark:text-[#F4F1F8]">
            {exercise.question[uiLanguage]}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {exercise.options.map((opt, idx) => {
              const isSelected = chosenOption === idx;
              const isCorrect = idx === exercise.correctIndex;
              let cls =
                'bg-[#FCF9F6] dark:bg-[#14121B] border-[#EAE2EE] dark:border-[#2D293B] hover:border-[#0284C7]';
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
                  key={idx}
                  type="button"
                  onClick={() => handleAnswer(idx)}
                  className={`text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${cls}`}
                >
                  {opt[uiLanguage]}
                </button>
              );
            })}
          </div>

          {chosenOption !== undefined && (
            <div className="pt-3 border-t border-[#EAE2EE] dark:border-[#2D293B] space-y-1.5 text-sm">
              <div className="flex items-center gap-2 font-semibold">
                {chosenOption === exercise.correctIndex ? (
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
                {exercise.explanation[uiLanguage]}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
