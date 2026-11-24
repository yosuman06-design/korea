import { useState } from 'react';
import { ArrowRight, BookOpen, Compass, Headphones, MessageSquare, Sparkles, Trophy, Volume2 } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { TRANSLATIONS } from '../data/translations';
import { ModuleSection } from '../types/learning';
import { speakKorean } from '../utils/audio';

interface OverviewHeroProps {
  onNavigate: (section: ModuleSection) => void;
}

export function OverviewHero({ onNavigate }: OverviewHeroProps) {
  const { profile, dictionary, uiLanguage } = useLearning();
  const t = TRANSLATIONS[uiLanguage];
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const moduleCards: Array<{
    id: ModuleSection;
    title: string;
    meta: string;
    description: Record<typeof uiLanguage, string>;
    icon: typeof BookOpen;
    tintClass: string;
  }> = [
    {
      id: 'hangul',
      title: t.modules.hangul,
      meta: '40 Jamo · Sandbox',
      description: {
        ru: 'Алфавит с озвучкой, транскрипцией и живым конструктором слогов.',
        en: 'All 40 letters with native speech and an interactive syllable builder.',
        tg: 'Алифбо бо талаффуз, транскрипсия ва созандаи ҳиҷо.',
        ko: '40개 자모 발음과 실시간 음절 조합기.',
      },
      icon: BookOpen,
      tintClass: 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200/70 dark:border-rose-900/40',
    },
    {
      id: 'grammar',
      title: t.modules.grammar,
      meta: 'A1 – C1 · Drills',
      description: {
        ru: 'Частицы, времена, вежливые стили и тренажёр с разбором ошибок.',
        en: 'Particles, tenses, politeness levels, and interactive sentence drills.',
        tg: 'Ҳиссачаҳо, замонҳо, услуби эҳтиром ва машқҳо.',
        ko: '조사, 시제, 높임법과 문법 확인 퀴즈.',
      },
      icon: Compass,
      tintClass: 'bg-sky-50/70 dark:bg-sky-950/20 border-sky-200/70 dark:border-sky-900/40',
    },
    {
      id: 'vocabulary',
      title: t.modules.vocabulary,
      meta: '24+ Cards · Audio',
      description: {
        ru: 'Интерактивные карточки со словами, примерами и сохранением в словарь.',
        en: 'Flip flashcards with context examples, audio, and personal dictionary sync.',
        tg: 'Кортҳои интерактивӣ бо мисолҳо ва захира ба луғати шахсӣ.',
        ko: '주제별 어휘 카드, 예문 듣기 및 내 단어장 저장.',
      },
      icon: Volume2,
      tintClass: 'bg-violet-50/70 dark:bg-violet-950/20 border-violet-200/70 dark:border-violet-900/40',
    },
    {
      id: 'dialogues',
      title: t.modules.dialogues,
      meta: 'Seoul Life · Roleplay',
      description: {
        ru: 'Диалоги в кофейне, метро, ресторане и магазинах Мёндона.',
        en: 'Real Seoul conversations in cafes, subways, restaurants, and shops.',
        tg: 'Муколамаҳои воқеӣ дар қаҳвахона, метро ва мағозаҳои Сеул.',
        ko: '카페, 지하철, 식당, 쇼핑 실전 회화.',
      },
      icon: MessageSquare,
      tintClass: 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200/70 dark:border-rose-900/40',
    },
    {
      id: 'listening',
      title: t.modules.listening,
      meta: '1.0× / 0.7× Speed',
      description: {
        ru: 'Задания на аудирование с замедлением речи и проверкой понимания.',
        en: 'Audio comprehension drills with adjustable playback speed and transcripts.',
        tg: 'Машқҳои шунидан бо суръати муқаррарӣ ва оҳиста.',
        ko: '일반·느린 속도 음성 듣기 훈련 및 이해 문제.',
      },
      icon: Headphones,
      tintClass: 'bg-sky-50/70 dark:bg-sky-950/20 border-sky-200/70 dark:border-sky-900/40',
    },
    {
      id: 'topik',
      title: t.modules.topik,
      meta: 'Mock Exam · Timer',
      description: {
        ru: 'Тренировочные тесты TOPIK I и II с таймером и объяснением ответов.',
        en: 'Timed TOPIK I & II practice exams with detailed answer explanations.',
        tg: 'Тестҳои имтиҳонии TOPIK I ва II бо вақтсанҷ ва таҳлил.',
        ko: 'TOPIK I · II 실전 모의고사 및 해설.',
      },
      icon: Trophy,
      tintClass: 'bg-violet-50/70 dark:bg-violet-950/20 border-violet-200/70 dark:border-violet-900/40',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Split Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-7 sm:p-10">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-xs font-medium text-[#7C3AED] dark:text-[#C4B5FD]">
              <span>Seoul Curriculum</span>
              <span aria-hidden="true">·</span>
              <span>A1 — C1</span>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => speakKorean('안녕하세요, 한국어 여행을 시작해요!')}
                className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-[#BE185D] dark:hover:text-[#F9A8D4] transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span className="font-kr">한국어 여행</span>
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight leading-[1.15] text-[#1E1B24] dark:text-[#F4F1F8] text-balance">
              {t.heroTitle}
            </h1>

            <p className="text-base sm:text-[17px] leading-relaxed text-[#575063] dark:text-[#B9B2C6] max-w-2xl">
              {t.heroSubtitle}
            </p>
          </div>

          <div className="pt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('hangul')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#BE185D] hover:bg-[#9D174D] text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{t.heroStartBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('quizzes')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-[#D8CCE2] dark:border-[#363147] bg-[#FBF7FD] dark:bg-[#232030] text-[#1E1B24] dark:text-[#F4F1F8] hover:bg-[#F3EAF9] dark:hover:bg-[#2C283C] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{t.heroPlacementBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('tutor')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-[#0369A1] dark:text-[#7DD3FC] hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.modules.tutor}</span>
            </button>
          </div>
        </div>

        {/* Hero Photography Frame */}
        <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-[#EAE2EE] dark:border-[#2D293B] min-h-[280px] lg:min-h-full bg-gradient-to-br from-rose-100 via-sky-100 to-violet-100 dark:from-[#261E2F] dark:via-[#1C2433] dark:to-[#221D32]">
          {!heroImgFailed ? (
            <img
              src="/src/assets/images/hero_seoul_cherry_blossom_1795525144070.jpg"
              alt="Gyeongbokgung Palace in Seoul surrounded by pastel cherry blossoms"
              referrerPolicy="no-referrer"
              onError={() => setHeroImgFailed(true)}
              className="w-full h-full object-cover lg:absolute lg:inset-0"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
              <span className="font-kr text-5xl font-bold text-[#BE185D] dark:text-[#F9A8D4] mb-2">서울 · 한국</span>
              <span className="text-sm text-[#575063] dark:text-[#B9B2C6]">Gyeongbokgung Palace</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-6">
            <p className="text-xs text-rose-200 font-medium">경복궁 · 서울 봄</p>
            <p className="text-white text-lg font-semibold mt-0.5">
              {uiLanguage === 'ru'
                ? 'Учите язык через культуру и живую речь Сеула'
                : uiLanguage === 'tg'
                  ? 'Забонро тавассути фарҳанг ва нутқи зиндаи Сеул омӯзед'
                  : uiLanguage === 'ko'
                    ? '서울의 문화와 생생한 대화로 배우는 한국어'
                    : 'Learn through living Seoul culture and natural speech'}
            </p>
          </div>
        </div>
      </section>

      {/* 4-Column Full-Width KPI Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-5">
          <div className="text-xs text-[#6B6378] dark:text-[#A49CB5]">{t.kpiLevelLabel}</div>
          <div className="mt-1.5 text-2xl font-bold tabular-nums text-[#BE185D] dark:text-[#F472B6]">
            {profile.level}
          </div>
        </div>

        <div className="rounded-xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-5">
          <div className="text-xs text-[#6B6378] dark:text-[#A49CB5]">{t.kpiXpLabel}</div>
          <div className="mt-1.5 text-2xl font-bold font-mono-num tabular-nums text-[#0284C7] dark:text-[#38BDF8]">
            {profile.xp} XP
          </div>
        </div>

        <div className="rounded-xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-5">
          <div className="text-xs text-[#6B6378] dark:text-[#A49CB5]">{t.kpiStreakLabel}</div>
          <div className="mt-1.5 text-2xl font-bold font-mono-num tabular-nums text-[#7C3AED] dark:text-[#A78BFA]">
            {profile.streak} {t.daysUnit}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className="text-left rounded-xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] p-5 hover:border-[#D8CCE2] dark:hover:border-[#423B58] transition-colors cursor-pointer"
        >
          <div className="text-xs text-[#6B6378] dark:text-[#A49CB5]">{t.kpiSavedLabel}</div>
          <div className="mt-1.5 text-2xl font-bold font-mono-num tabular-nums text-[#1E1B24] dark:text-[#F4F1F8]">
            {dictionary.length} {t.wordsUnit}
          </div>
        </button>
      </section>

      {/* Curriculum Pathways Grid */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
            {uiLanguage === 'ru'
              ? 'Основные разделы обучения'
              : uiLanguage === 'tg'
                ? 'Бахшҳои асосии омӯзиш'
                : uiLanguage === 'ko'
                  ? '핵심 학습 커리큘럼'
                  : 'Core Learning Modules'}
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('culture')}
            className="text-sm font-medium text-[#7C3AED] dark:text-[#C4B5FD] hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.modules.culture} →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onNavigate(card.id)}
                className={`group text-left rounded-2xl border p-6 transition-transform duration-150 hover:-translate-y-0.5 cursor-pointer ${card.tintClass}`}
              >
                <div className="flex items-center justify-between gap-2 text-xs text-[#6B6378] dark:text-[#A49CB5] mb-3">
                  <span>{card.meta}</span>
                  <Icon className="w-4 h-4 text-[#575063] dark:text-[#C4B5FD] group-hover:text-[#BE185D] transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-[#1E1B24] dark:text-[#F4F1F8] mb-1.5">
                  {card.title}
                </h3>
                <p className="text-sm text-[#575063] dark:text-[#B9B2C6] leading-relaxed">
                  {card.description[uiLanguage]}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
