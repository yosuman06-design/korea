import { FormEvent, useState } from 'react';
import { Bookmark, BookmarkCheck, Send, Sparkles, Volume2 } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { TRANSLATIONS } from '../data/translations';
import { speakKorean } from '../utils/audio';

type TutorMode = 'conversation' | 'grammar' | 'roleplay_cafe' | 'topik_coach';

interface SuggestedVocab {
  korean: string;
  transcription: string;
  translation: string;
}

interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  romanization?: string;
  translation?: string;
  grammarTip?: string;
  suggestedVocab?: SuggestedVocab[];
}

export function TutorModule() {
  const { uiLanguage, profile, dictionary, saveWordToDictionary, awardProgress } = useLearning();
  const t = TRANSLATIONS[uiLanguage];

  const [mode, setMode] = useState<TutorMode>('conversation');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: '안녕하세요! 저는 한국어 선생님 민지예요. 오늘 무엇을 연습해 볼까요?',
      romanization: 'annyeonghaseyo! jeoneun hangugeo seonsaengnim minjiyeyo. oneul mueoseul yeonseuphae bolkkayo?',
      translation:
        uiLanguage === 'ru'
          ? 'Здравствуйте! Я ваш преподаватель корейского Минчжи. Что потренируем сегодня?'
          : uiLanguage === 'tg'
            ? 'Салом! Ман муаллими кореягии шумо Минҷи ҳастам. Имрӯз чӣ машқ мекунем?'
            : uiLanguage === 'ko'
              ? '안녕하세요! 저는 한국어 선생님 민지예요. 오늘 무엇을 연습해 볼까요?'
              : 'Hello! I am Minji, your Korean teacher. What would you like to practice today?',
      grammarTip:
        uiLanguage === 'ru'
          ? 'Попробуйте написать любую фразу по-корейски или задать вопрос на вашем языке.'
          : uiLanguage === 'tg'
            ? 'Бо забони кореягӣ ҷумла нависед ё ба забони худ савол диҳед.'
            : uiLanguage === 'ko'
              ? '한국어로 문장을 작성하거나 궁금한 문법을 자유롭게 물어보세요.'
              : 'Try writing a Korean sentence or asking any grammar question in your language.',
      suggestedVocab: [
        {
          korean: '연습하다',
          transcription: 'yeonseuphada',
          translation: uiLanguage === 'ru' ? 'практиковаться' : uiLanguage === 'tg' ? 'машқ кардан' : uiLanguage === 'ko' ? '연습하다' : 'to practice',
        },
      ],
    },
  ]);

  const isSaved = (korean: string) => dictionary.some((d) => d.korean === korean);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    setErrorMsg(null);
    const userMsg: TutorMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextHistory.slice(-8).map((m) => ({ role: m.role, text: m.text })),
          mode,
          learnerLevel: profile.level,
          uiLanguage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Server error (${res.status})`);
      }

      const aiMsg: TutorMessage = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        text: data.koreanReply || '네, 좋아요!',
        romanization: data.romanization,
        translation: data.translation,
        grammarTip: data.grammarTip,
        suggestedVocab: Array.isArray(data.suggestedVocab) ? data.suggestedVocab : [],
      };

      setMessages((prev) => [...prev, aiMsg]);
      await awardProgress({
        xpDelta: 15,
        questKey: 'aiTutor',
        achievementHint: 'ai_speaker',
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to reach AI Tutor.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
            {t.tutorUi.title}
          </h2>
          <p className="text-sm sm:text-base text-[#575063] dark:text-[#B9B2C6] mt-1 max-w-2xl">
            {t.tutorUi.subtitle}
          </p>
        </div>

        <div className="text-xs font-medium text-[#7C3AED] dark:text-[#C4B5FD]">
          {t.kpiLevelLabel}: {profile.level}
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#F2ECF6] dark:bg-[#1E1B29] border border-[#EAE2EE] dark:border-[#2D293B]">
        {(
          [
            ['conversation', t.tutorUi.modes.conversation],
            ['grammar', t.tutorUi.modes.grammar],
            ['roleplay_cafe', t.tutorUi.modes.roleplay_cafe],
            ['topik_coach', t.tutorUi.modes.topik_coach],
          ] as Array<[TutorMode, string]>
        ).map(([mKey, label]) => (
          <button
            key={mKey}
            type="button"
            onClick={() => setMode(mKey)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              mode === mKey
                ? 'bg-white dark:bg-[#2C283B] text-[#1E1B24] dark:text-[#F4F1F8] shadow-xs'
                : 'text-[#575063] dark:text-[#B9B2C6] hover:text-[#1E1B24] dark:hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chat Stage */}
      <div className="rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] flex flex-col overflow-hidden">
        <div className="p-5 sm:p-6 space-y-4 max-h-[520px] overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[82%] rounded-2xl border p-4 space-y-2.5 ${
                  msg.role === 'user'
                    ? 'bg-rose-50/70 dark:bg-rose-950/25 border-rose-200/80 dark:border-rose-900/40'
                    : 'bg-[#FCF9F6] dark:bg-[#14121B] border-[#EAE2EE] dark:border-[#2D293B]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-kr text-base sm:text-lg font-semibold text-[#1E1B24] dark:text-[#F4F1F8]">
                    {msg.text}
                  </div>
                  {msg.role === 'assistant' && (
                    <button
                      type="button"
                      onClick={() => speakKorean(msg.text)}
                      aria-label={t.common.listen}
                      className="p-2 rounded-lg bg-white dark:bg-[#1B1924] border border-[#EAE2EE] dark:border-[#2D293B] text-[#0284C7] dark:text-[#38BDF8] shrink-0 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {msg.romanization && (
                  <div className="text-xs font-mono-num text-[#7C3AED] dark:text-[#C4B5FD]">
                    {msg.romanization}
                  </div>
                )}

                {msg.translation && (
                  <div className="text-sm text-[#433D4E] dark:text-[#D5CEE0]">
                    {msg.translation}
                  </div>
                )}

                {msg.grammarTip && (
                  <div className="pt-2 border-t border-black/5 dark:border-white/5 text-xs text-[#575063] dark:text-[#B9B2C6]">
                    <span className="font-semibold text-[#BE185D] dark:text-[#F472B6] mr-1.5">
                      {t.tutorUi.grammarNote}:
                    </span>
                    {msg.grammarTip}
                  </div>
                )}

                {msg.suggestedVocab && msg.suggestedVocab.length > 0 && (
                  <div className="pt-2 space-y-1.5">
                    <div className="text-[11px] font-semibold text-[#6B6378] dark:text-[#A49CB5]">
                      {t.tutorUi.suggestedVocab}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {msg.suggestedVocab.map((v, i) => {
                        const saved = isSaved(v.korean);
                        return (
                          <button
                            key={`${v.korean}-${i}`}
                            type="button"
                            disabled={saved}
                            onClick={() =>
                              saveWordToDictionary({
                                korean: v.korean,
                                transcription: v.transcription,
                                translation: v.translation,
                                category: 'ai_tutor',
                                example: msg.text,
                              })
                            }
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer ${
                              saved
                                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                                : 'bg-white dark:bg-[#1B1924] border-[#EAE2EE] dark:border-[#2D293B] hover:border-[#BE185D]'
                            }`}
                          >
                            <span className="font-kr font-semibold">{v.korean}</span>
                            <span className="text-[#6B6378] dark:text-[#A49CB5]">({v.translation})</span>
                            {saved ? (
                              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Bookmark className="w-3.5 h-3.5 text-[#BE185D]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#7C3AED] dark:text-[#C4B5FD]">
              <Sparkles className="w-4 h-4" />
              <span>{t.tutorUi.thinking}</span>
            </div>
          )}

          {errorMsg && (
            <div className="rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 p-3.5 text-xs sm:text-sm text-rose-700 dark:text-rose-300">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Starter Prompts */}
        <div className="px-5 py-3 border-t border-[#EAE2EE] dark:border-[#2D293B] bg-[#FCF9F6] dark:bg-[#14121B] flex flex-wrap gap-2">
          {t.tutorUi.starters.map((starter) => (
            <button
              key={starter}
              type="button"
              onClick={() => sendMessage(starter)}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-lg border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] text-[#433D4E] dark:text-[#D5CEE0] hover:border-[#7C3AED] cursor-pointer transition-colors"
            >
              {starter}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-[#EAE2EE] dark:border-[#2D293B] flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.tutorUi.placeholder}
            maxLength={1200}
            className="flex-1 rounded-xl border border-[#EAE2EE] dark:border-[#2D293B] bg-[#FCF9F6] dark:bg-[#14121B] px-4 py-3 text-sm text-[#1E1B24] dark:text-[#F4F1F8] placeholder:text-[#8E859C] focus:outline-none focus:border-[#7C3AED]"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{t.tutorUi.send}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
