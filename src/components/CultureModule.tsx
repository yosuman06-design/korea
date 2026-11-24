import { useMemo, useState } from 'react';
import { Bookmark, BookmarkCheck, Volume2 } from 'lucide-react';
import { useLearning } from '../context/LearningContext';
import { CULTURE_ARTICLES } from '../data/curriculumPart2';
import { TRANSLATIONS } from '../data/translations';
import { CultureArticle } from '../types/learning';
import { speakKorean } from '../utils/audio';

type PillarFilter = 'all' | CultureArticle['pillar'];

export function CultureModule() {
  const { uiLanguage, dictionary, saveWordToDictionary } = useLearning();
  const t = TRANSLATIONS[uiLanguage];

  const [pillar, setPillar] = useState<PillarFilter>('all');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const visibleArticles = useMemo(() => {
    if (pillar === 'all') return CULTURE_ARTICLES;
    return CULTURE_ARTICLES.filter((a) => a.pillar === pillar);
  }, [pillar]);

  const isSaved = (korean: string) => dictionary.some((d) => d.korean === korean);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
            {t.cultureUi.title}
          </h2>
          <p className="text-sm sm:text-base text-[#575063] dark:text-[#B9B2C6] mt-1 max-w-2xl">
            {t.cultureUi.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#F2ECF6] dark:bg-[#1E1B29] border border-[#EAE2EE] dark:border-[#2D293B] self-start">
          {(
            [
              ['all', t.cultureUi.pillars.all],
              ['traditions', t.cultureUi.pillars.traditions],
              ['cuisine', t.cultureUi.pillars.cuisine],
              ['history', t.cultureUi.pillars.history],
              ['kculture', t.cultureUi.pillars.kculture],
            ] as Array<[PillarFilter, string]>
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setPillar(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                pillar === key
                  ? 'bg-white dark:bg-[#2C283B] text-[#1E1B24] dark:text-[#F4F1F8] shadow-xs'
                  : 'text-[#575063] dark:text-[#B9B2C6] hover:text-[#1E1B24] dark:hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visibleArticles.map((article) => (
          <article
            key={article.id}
            className="rounded-2xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] overflow-hidden flex flex-col"
          >
            <div className="relative aspect-[4/3] bg-gradient-to-br from-rose-100 via-sky-100 to-violet-100 dark:from-[#261E2F] dark:via-[#1C2433] dark:to-[#221D32]">
              {!failedImages[article.id] ? (
                <img
                  src={article.image}
                  alt={article.title[uiLanguage]}
                  referrerPolicy="no-referrer"
                  onError={() => setFailedImages((p) => ({ ...p, [article.id]: true }))}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-6 text-center font-kr text-2xl font-bold text-[#BE185D] dark:text-[#F472B6]">
                  한국 문화
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex items-end p-5">
                <span className="text-xs text-rose-100 font-medium">
                  {t.cultureUi.pillars[article.pillar]} · {article.readTime}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
                  {article.title[uiLanguage]}
                </h3>
                <p className="text-xs font-medium text-[#7C3AED] dark:text-[#C4B5FD]">
                  {article.subtitle[uiLanguage]}
                </p>
                <p className="text-sm text-[#433D4E] dark:text-[#D5CEE0] leading-relaxed">
                  {article.summary[uiLanguage]}
                </p>
                <ul className="space-y-1.5 pt-1">
                  {article.highlights.map((hl, i) => (
                    <li
                      key={i}
                      className="text-xs sm:text-sm text-[#575063] dark:text-[#B9B2C6] flex items-start gap-2"
                    >
                      <span className="text-[#BE185D] dark:text-[#F472B6] font-bold">·</span>
                      <span>{hl[uiLanguage]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#EAE2EE] dark:border-[#2D293B] space-y-2.5">
                <div className="text-xs font-semibold text-[#6B6378] dark:text-[#A49CB5]">
                  {t.cultureUi.keyExpressions}
                </div>
                <div className="space-y-2">
                  {article.expressions.map((exp, idx) => {
                    const saved = isSaved(exp.korean);
                    return (
                      <div
                        key={idx}
                        className="rounded-xl bg-[#FCF9F6] dark:bg-[#14121B] border border-[#EAE2EE] dark:border-[#2D293B] px-3.5 py-2.5 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-kr text-sm font-bold text-[#1E1B24] dark:text-[#F4F1F8]">
                              {exp.korean}
                            </span>
                            <span className="text-xs font-mono-num text-[#6B6378] dark:text-[#A49CB5]">
                              [{exp.transcription}]
                            </span>
                          </div>
                          <div className="text-xs text-[#575063] dark:text-[#B9B2C6]">
                            {exp.meaning[uiLanguage]}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => speakKorean(exp.korean.replace(/\(.*?\)/g, ''))}
                            aria-label={t.common.listen}
                            className="p-2 rounded-lg bg-white dark:bg-[#1B1924] border border-[#EAE2EE] dark:border-[#2D293B] text-[#0284C7] dark:text-[#38BDF8] cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              saveWordToDictionary({
                                idHint: `cul_${article.id}_${idx}`,
                                korean: exp.korean,
                                transcription: exp.transcription,
                                translation: exp.meaning[uiLanguage],
                                category: article.pillar,
                              })
                            }
                            disabled={saved}
                            aria-label={saved ? t.common.savedWord : t.common.saveWord}
                            className={`p-2 rounded-lg border cursor-pointer ${
                              saved
                                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-600'
                                : 'bg-white dark:bg-[#1B1924] border-[#EAE2EE] dark:border-[#2D293B] text-[#BE185D] dark:text-[#F472B6]'
                            }`}
                          >
                            {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
