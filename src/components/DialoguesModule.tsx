import { useRef, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, Play, Square, Volume2, XCircle } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { DIALOGUE_SCENARIOS } from '../data/curriculumPart2';
import { TRANSLATIONS } from '../data/translations';
import { playFeedbackSound, speakKorean } from '../utils/audio';

export function DialoguesModule() {
  const { uiLanguage, awardProgress } = useLearning();
  const t = TRANSLATIONS[uiLanguage];

  const [selectedId, setSelectedId] = useState(DIALOGUE_SCENARIOS[0].id);
  const [showTranslations, setShowTranslations] = useState(true);
  const [playingLineIdx, setPlayingLineIdx] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const cancelRef = useRef(false);

  const scenario = DIALOGUE_SCENARIOS.find((d) => d.id === selectedId) || DIALOGUE_SCENARIOS[0];
  const chosenOption = answers[scenario.id];

  const stopPlayback = () => {
    cancelRef.current = true;
    setIsPlayingAll(false);
    setPlayingLineIdx(null);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const playSequential = (startIdx = 0) => {
    cancelRef.current = false;
    setIsPlayingAll(true);

    const step = (idx: number) => {
      if (cancelRef.current || idx >= scenario.lines.length) {
        setIsPlayingAll(false);
        setPlayingLineIdx(null);
        return;
      }
      setPlayingLineIdx(idx);
      speakKorean(scenario.lines[idx].korean, 0.92, () => {
        if (!cancelRef.current) {
          setTimeout(() => step(idx + 1), 350);
        }
      });
    };

    step(startIdx);
  };

  const handleCheck = async (optIdx: number) => {
    if (chosenOption !== undefined) return;
    setAnswers((prev) => ({ ...prev, [scenario.id]: optIdx }));
    if (optIdx === scenario.practicePrompt.correctIndex) {
      playFeedbackSound('success');
      await awardProgress({
        xpDelta: 20,
        lessonId: scenario.id,
        questKey: 'grammarOrListening',
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
            {t.dialoguesUi.title}
          </h2>
          <p className="text-sm sm:text-base text-[#575063] dark:text-[#B9B2C6] mt-1 max-w-2xl">
            {t.dialoguesUi.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowTranslations((s) => !s)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] text-xs font-semibold text-[#1E1B24] dark:text-[#F4F1F8] hover:bg-[#FBF7FD] dark:hover:bg-[#232030] self-start cursor-pointer"
        >
          {showTranslations ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showTranslations ? t.dialoguesUi.hideTranslations : t.dialoguesUi.showTranslations}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Scenario Picker */}
        <div className="lg:col-span-4 space-y-2">
          {DIALOGUE_SCENARIOS.map((dlg) => {
            const active = dlg.id === scenario.id;
            return (
              <button
                key={dlg.id}
                type="button"
                onClick={() => {
                  stopPlayback();
                  setSelectedId(dlg.id);
                }}
                className={`w-full text-left rounded-xl border p-4 transition-colors cursor-pointer ${
                  active
                    ? 'border-[#BE185D] dark:border-[#F472B6] bg-rose-50/70 dark:bg-rose-950/25'
                    : 'border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] hover:border-[#D3C2DE] dark:hover:border-[#423B58]'
                }`}
              >
                <div className="text-xs text-[#6B6378] dark:text-[#A49CB5]">
                  {dlg.level} · {dlg.lines.length} lines
                </div>
                <div className="text-base font-bold text-[#1E1B24] dark:text-[#F4F1F8] mt-1">
                  {dlg.title[uiLanguage]}
                </div>
                <div className="text-xs text-[#575063] dark:text-[#B9B2C6] mt-0.5 line-clamp-1">
                  {dlg.setting[uiLanguage]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Conversation Stage */}
        <div className="lg:col-span-8 rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAE2EE] dark:border-[#2D293B] pb-4">
            <div>
              <div className="text-xs text-[#6B6378] dark:text-[#A49CB5]">
                {scenario.level} · {scenario.setting[uiLanguage]}
              </div>
              <h3 className="text-xl font-bold text-[#1E1B24] dark:text-[#F4F1F8] mt-0.5">
                {scenario.title[uiLanguage]}
              </h3>
            </div>

            {!isPlayingAll ? (
              <button
                type="button"
                onClick={() => playSequential(0)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{t.dialoguesUi.playAll}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopPlayback}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#BE185D] hover:bg-[#9D174D] text-white text-xs font-semibold cursor-pointer"
              >
                <Square className="w-3.5 h-3.5" />
                <span>{t.dialoguesUi.stopPlay}</span>
              </button>
            )}
          </div>

          {/* Dialogue Lines */}
          <div className="space-y-3">
            {scenario.lines.map((line, idx) => {
              const isPlaying = playingLineIdx === idx;
              const isRoleB = line.speakerRole === 'b';
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isRoleB ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[80%] rounded-2xl border p-4 transition-colors ${
                      isPlaying
                        ? 'border-[#0284C7] bg-sky-50 dark:bg-sky-950/35'
                        : isRoleB
                          ? 'border-rose-200/80 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20'
                          : 'border-[#EAE2EE] dark:border-[#2D293B] bg-[#FCF9F6] dark:bg-[#14121B]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1.5">
                      <span className="text-xs font-semibold text-[#6B6378] dark:text-[#A49CB5]">
                        {line.speaker}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setPlayingLineIdx(idx);
                          speakKorean(line.korean, 0.92, () => setPlayingLineIdx(null));
                        }}
                        aria-label={t.common.listen}
                        className="text-[#0284C7] dark:text-[#38BDF8] hover:opacity-80 cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="font-kr text-base sm:text-lg font-semibold text-[#1E1B24] dark:text-[#F4F1F8]">
                      {line.korean}
                    </div>
                    <div className="text-xs font-mono-num text-[#7C3AED] dark:text-[#C4B5FD] mt-0.5">
                      {line.transcription}
                    </div>
                    {showTranslations && (
                      <div className="text-sm text-[#575063] dark:text-[#B9B2C6] mt-1.5 pt-1.5 border-t border-black/5 dark:border-white/5">
                        {line.translation[uiLanguage]}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comprehension Check */}
          <div className="rounded-xl bg-[#FBF7FD] dark:bg-[#232030] border border-[#EAE2EE] dark:border-[#2D293B] p-5 space-y-3">
            <h4 className="text-sm font-bold text-[#7C3AED] dark:text-[#C4B5FD]">
              {t.dialoguesUi.comprehensionCheck}
            </h4>
            <p className="text-sm text-[#1E1B24] dark:text-[#F4F1F8] font-medium">
              {scenario.practicePrompt.question[uiLanguage]}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {scenario.practicePrompt.options.map((opt, idx) => {
                const isSelected = chosenOption === idx;
                const isCorrect = idx === scenario.practicePrompt.correctIndex;
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
                    onClick={() => handleCheck(idx)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${cls}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {chosenOption !== undefined && (
              <div className="pt-2 space-y-1 text-sm">
                <div className="flex items-center gap-2 font-semibold">
                  {chosenOption === scenario.practicePrompt.correctIndex ? (
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
                  {scenario.practicePrompt.explanation[uiLanguage]}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
