import { FormEvent, useState } from 'react';
import { Award, CheckCircle2, LogIn, LogOut, Plus, Trash2, Volume2 } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { TRANSLATIONS } from '../data/translations';
import { speakKorean } from '../utils/audio';

export function ProfileModule() {
  const {
    user,
    authError,
    profile,
    dictionary,
    uiLanguage,
    signInWithGoogle,
    signOutUser,
    saveWordToDictionary,
    toggleWordMastered,
    removeWordFromDictionary,
  } = useLearning();
  const t = TRANSLATIONS[uiLanguage];

  const [koreanInput, setKoreanInput] = useState('');
  const [transcriptionInput, setTranscriptionInput] = useState('');
  const [translationInput, setTranslationInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('custom');

  const handleAddWord = async (e: FormEvent) => {
    e.preventDefault();
    if (!koreanInput.trim() || !translationInput.trim()) return;
    await saveWordToDictionary({
      korean: koreanInput.trim(),
      transcription: transcriptionInput.trim(),
      translation: translationInput.trim(),
      category: categoryInput.trim() || 'custom',
    });
    setKoreanInput('');
    setTranscriptionInput('');
    setTranslationInput('');
  };

  const quests = [
    {
      id: 'hangulOrVocab',
      label: {
        ru: 'Изучите 3 буквы хангыля или сохраните слова',
        en: 'Practice 3 Hangul letters or save vocabulary words',
        tg: '3 ҳарфи Ҳангул ё калимаро машқ кунед',
        ko: '한글 또는 단어 3회 학습하기',
      }[uiLanguage],
      current: Math.min(3, profile.dailyQuestProgress.hangulOrVocab),
      target: 3,
      reward: '+30 XP',
    },
    {
      id: 'grammarOrListening',
      label: {
        ru: 'Выполните 2 упражнения по грамматике или аудированию',
        en: 'Complete 2 grammar, dialogue, or listening drills',
        tg: '2 машқи грамматика ё шуниданро иҷро кунед',
        ko: '문법 · 회화 · 듣기 연습 2회 완료',
      }[uiLanguage],
      current: Math.min(2, profile.dailyQuestProgress.grammarOrListening),
      target: 2,
      reward: '+40 XP',
    },
    {
      id: 'aiTutor',
      label: {
        ru: 'Пообщайтесь с ИИ-преподавателем Минчжи (2 реплики)',
        en: 'Practice 2 turns with AI Tutor Minji',
        tg: 'Бо муаллими AI Минҷи 2 маротиба суҳбат кунед',
        ko: 'AI 선생님 민지와 2회 대화하기',
      }[uiLanguage],
      current: Math.min(2, profile.dailyQuestProgress.aiTutor),
      target: 2,
      reward: '+35 XP',
    },
    {
      id: 'quiz',
      label: {
        ru: 'Пройдите 1 тест уровня или TOPIK',
        en: 'Complete 1 Placement or TOPIK exam check',
        tg: '1 тести сатҳ ё TOPIK-ро супоред',
        ko: '레벨 테스트 또는 TOPIK 퀴즈 1회 완료',
      }[uiLanguage],
      current: Math.min(1, profile.dailyQuestProgress.quiz),
      target: 1,
      reward: '+50 XP',
    },
  ];

  const achievements = [
    {
      id: 'first_hangul',
      title: { ru: 'Первые шаги в Хангыле', en: 'First Hangul Steps', tg: 'Қадамҳои аввали Ҳангул', ko: '한글 첫걸음' }[uiLanguage],
      desc: { ru: 'Пройдите упражнение по алфавиту', en: 'Complete a Hangul lesson or drill', tg: 'Машқи алифборо анҷом диҳед', ko: '한글 학습 완료' }[uiLanguage],
    },
    {
      id: 'vocab_collector',
      title: { ru: 'Коллекционер слов', en: 'Word Collector', tg: 'Ҷамъовари калимаҳо', ko: '어휘 수집가' }[uiLanguage],
      desc: { ru: 'Сохраните 3+ слова в личный словарь', en: 'Save 3+ words to personal dictionary', tg: '3+ калимаро ба луғат захира кунед', ko: '단어장에 3단어 이상 저장' }[uiLanguage],
    },
    {
      id: 'grammar_builder',
      title: { ru: 'Мастер грамматики', en: 'Grammar Architect', tg: 'Устоди грамматика', ko: '문법 마스터' }[uiLanguage],
      desc: { ru: 'Завершите урок грамматики', en: 'Pass a grammar drill', tg: 'Як дарси грамматикаро гузаред', ko: '문법 연습 문제 정답' }[uiLanguage],
    },
    {
      id: 'ai_speaker',
      title: { ru: 'Живой собеседник', en: 'AI Conversationalist', tg: 'Ҳамсуҳбати зинда', ko: 'AI 회화 파트너' }[uiLanguage],
      desc: { ru: 'Попрактикуйтесь с ИИ-преподавателем', en: 'Chat with AI Tutor Minji', tg: 'Бо муаллими AI машқ кунед', ko: 'AI 선생님과 대화' }[uiLanguage],
    },
    {
      id: 'topik_challenger',
      title: { ru: 'Покоритель TOPIK', en: 'TOPIK Challenger', tg: 'Довталаби TOPIK', ko: 'TOPIK 도전자' }[uiLanguage],
      desc: { ru: 'Пройдите тест TOPIK или тест на уровень', en: 'Finish a TOPIK or Placement test', tg: 'Тести TOPIK ё сатҳро супоред', ko: 'TOPIK 또는 레벨 진단 완료' }[uiLanguage],
    },
    {
      id: 'xp_200',
      title: { ru: 'Мастер Сеула (200 XP)', en: 'Seoul Scholar (200 XP)', tg: 'Донишманди Сеул (200 XP)', ko: '서울 장학생 (200 XP)' }[uiLanguage],
      desc: { ru: 'Наберите 200 очков опыта', en: 'Earn 200 XP across modules', tg: '200 XP ҷамъ кунед', ko: '누적 200 XP 달성' }[uiLanguage],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Account Banner */}
      <div className="rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={profile.displayName}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border border-[#EAE2EE] dark:border-[#2D293B]"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-200 via-violet-200 to-sky-200 dark:from-rose-900/50 dark:via-violet-900/50 dark:to-sky-900/50 flex items-center justify-center font-kr text-2xl font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
              한
            </div>
          )}

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
              {user ? profile.displayName : t.profileUi.title}
            </h2>
            <div className="text-xs sm:text-sm text-[#575063] dark:text-[#B9B2C6] mt-0.5 flex flex-wrap items-center gap-2">
              <span>{user ? profile.email : t.profileUi.subtitle}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-mono-num tabular-nums text-[#7C3AED] dark:text-[#C4B5FD]">
              <span>{t.kpiLevelLabel}: {profile.level}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.xp} XP</span>
              <span aria-hidden="true">·</span>
              <span>{profile.streak} {t.daysUnit}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.completedLessons.length} lessons</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
          {user ? (
            <button
              type="button"
              onClick={signOutUser}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#EAE2EE] dark:border-[#2D293B] bg-[#FCF9F6] dark:bg-[#14121B] text-xs font-semibold hover:border-rose-400 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.common.signOut}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#BE185D] hover:bg-[#9D174D] text-white text-xs sm:text-sm font-semibold cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{t.common.signInWithGoogle}</span>
            </button>
          )}
          {authError && (
            <span className="text-xs text-rose-600 dark:text-rose-400 max-w-xs">{authError}</span>
          )}
        </div>
      </div>

      {!user && (
        <div className="rounded-xl border border-sky-200 dark:border-sky-900/50 bg-sky-50/70 dark:bg-sky-950/20 p-4 text-xs sm:text-sm text-[#0369A1] dark:text-[#7DD3FC]">
          {t.profileUi.guestBanner}
        </div>
      )}

      {/* Daily Quests & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-6 space-y-4">
          <h3 className="text-lg font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
            {t.profileUi.dailyQuestsTitle}
          </h3>
          <div className="space-y-3">
            {quests.map((q) => {
              const pct = Math.min(100, Math.round((q.current / q.target) * 100));
              const done = q.current >= q.target;
              return (
                <div
                  key={q.id}
                  className="rounded-xl bg-[#FCF9F6] dark:bg-[#14121B] border border-[#EAE2EE] dark:border-[#2D293B] p-4 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                    <span className="font-medium text-[#1E1B24] dark:text-[#F4F1F8]">{q.label}</span>
                    <span className="font-mono-num tabular-nums text-xs font-semibold text-[#BE185D] dark:text-[#F472B6] shrink-0">
                      {done ? `✓ ${q.reward}` : `${q.current}/${q.target} · ${q.reward}`}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#EAE2EE] dark:bg-[#232030] overflow-hidden">
                    <div
                      className={`h-full transition-all ${done ? 'bg-emerald-500' : 'bg-[#0284C7]'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-6 space-y-4">
          <h3 className="text-lg font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
            {t.profileUi.achievementsTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((ach) => {
              const unlocked = profile.unlockedAchievements.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`rounded-xl border p-4 space-y-1 transition-colors ${
                    unlocked
                      ? 'border-violet-300 dark:border-violet-800 bg-violet-50/60 dark:bg-violet-950/25'
                      : 'border-[#EAE2EE] dark:border-[#2D293B] bg-[#FCF9F6] dark:bg-[#14121B] opacity-65'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Award
                      className={`w-4 h-4 ${
                        unlocked ? 'text-[#7C3AED] dark:text-[#C4B5FD]' : 'text-[#8E859C]'
                      }`}
                    />
                    {unlocked && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <div className="text-sm font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
                    {ach.title}
                  </div>
                  <div className="text-xs text-[#575063] dark:text-[#B9B2C6]">{ach.desc}</div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Personal Dictionary */}
      <section className="rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
            {t.profileUi.dictionaryTitle} ({dictionary.length})
          </h3>
        </div>

        {/* Add Custom Word Form */}
        <form
          onSubmit={handleAddWord}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 rounded-xl bg-[#FCF9F6] dark:bg-[#14121B] border border-[#EAE2EE] dark:border-[#2D293B]"
        >
          <input
            type="text"
            value={koreanInput}
            onChange={(e) => setKoreanInput(e.target.value)}
            placeholder={t.profileUi.koreanPlaceholder}
            maxLength={100}
            className="rounded-lg border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] px-3 py-2 text-sm font-kr"
          />
          <input
            type="text"
            value={transcriptionInput}
            onChange={(e) => setTranscriptionInput(e.target.value)}
            placeholder={t.profileUi.transcriptionPlaceholder}
            maxLength={120}
            className="rounded-lg border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={translationInput}
            onChange={(e) => setTranslationInput(e.target.value)}
            placeholder={t.profileUi.translationPlaceholder}
            maxLength={160}
            className="rounded-lg border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            placeholder={t.profileUi.categoryPlaceholder}
            maxLength={40}
            className="rounded-lg border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#BE185D] hover:bg-[#9D174D] text-white text-xs font-semibold px-4 py-2 inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.profileUi.addBtn}</span>
          </button>
        </form>

        {dictionary.length === 0 ? (
          <p className="text-sm text-[#575063] dark:text-[#B9B2C6] py-6 text-center">
            {t.profileUi.emptyDictionary}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dictionary.map((entry) => (
              <div
                key={entry.id}
                className="rounded-xl border border-[#EAE2EE] dark:border-[#2D293B] bg-[#FCF9F6] dark:bg-[#14121B] p-4 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#6B6378] dark:text-[#A49CB5]">
                    <span>{entry.category}</span>
                    <button
                      type="button"
                      onClick={() => speakKorean(entry.korean)}
                      aria-label={t.common.listen}
                      className="text-[#0284C7] dark:text-[#38BDF8] cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="font-kr text-xl font-bold text-[#1E1B24] dark:text-[#F4F1F8] mt-1">
                    {entry.korean}
                  </div>
                  {entry.transcription && (
                    <div className="text-xs font-mono-num text-[#7C3AED] dark:text-[#C4B5FD]">
                      [{entry.transcription}]
                    </div>
                  )}
                  <div className="text-sm text-[#433D4E] dark:text-[#D5CEE0] mt-1">
                    {entry.translation}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#EAE2EE] dark:border-[#2D293B]">
                  <button
                    type="button"
                    onClick={() => toggleWordMastered(entry.id)}
                    className={`text-xs font-semibold cursor-pointer ${
                      entry.mastered
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-[#6B6378] dark:text-[#A49CB5] hover:text-[#1E1B24]'
                    }`}
                  >
                    {entry.mastered ? `✓ ${t.profileUi.mastered}` : t.profileUi.reviewing}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeWordFromDictionary(entry.id)}
                    aria-label={t.profileUi.deleteWord}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.profileUi.deleteWord}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
