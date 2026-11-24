import { useState } from 'react';
import { Globe, Menu, Moon, Sun, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CultureModule } from './components/CultureModule';
import { DialoguesModule } from './components/DialoguesModule';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GrammarModule } from './components/GrammarModule';
import { HangulModule } from './components/HangulModule';
import { ListeningModule } from './components/ListeningModule';
import { OverviewHero } from './components/OverviewHero';
import { ProfileModule } from './components/ProfileModule';
import { QuizzesModule } from './components/QuizzesModule';
import { TopikModule } from './components/TopikModule';
import { TutorModule } from './components/TutorModule';
import { VocabularyModule } from './components/VocabularyModule';
import { LearningProvider, useLearning } from './context/LearningContext';
import { TRANSLATIONS } from './data/translations';
import { ModuleSection, UiLanguage } from './types/learning';

function KoreanJourneyShell() {
  const { user, profile, theme, setTheme, uiLanguage, setUiLanguage, toastMessage } = useLearning();
  const t = TRANSLATIONS[uiLanguage];

  const [activeSection, setActiveSection] = useState<ModuleSection>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (section: ModuleSection) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const moduleTabs: Array<{ id: ModuleSection; label: string }> = [
    { id: 'overview', label: t.modules.overview },
    { id: 'hangul', label: t.modules.hangul },
    { id: 'grammar', label: t.modules.grammar },
    { id: 'vocabulary', label: t.modules.vocabulary },
    { id: 'dialogues', label: t.modules.dialogues },
    { id: 'listening', label: t.modules.listening },
    { id: 'topik', label: t.modules.topik },
    { id: 'culture', label: t.modules.culture },
    { id: 'quizzes', label: t.modules.quizzes },
    { id: 'tutor', label: t.modules.tutor },
    { id: 'profile', label: t.modules.profile },
  ];

  const languages: Array<{ code: UiLanguage; label: string }> = [
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
    { code: 'tg', label: 'TG' },
    { code: 'ko', label: 'KO' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F6] dark:bg-[#121118] text-[#1E1B24] dark:text-[#F4F1F8] transition-colors">
      {/* Top Bar Contract: 3 Zones separated by gap-8 */}
      <header className="sticky top-0 z-30 border-b border-[#EAE2EE] dark:border-[#2D293B] bg-[#FCF9F6]/95 dark:bg-[#121118]/95 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => navigate('overview')}
            className="text-base sm:text-lg font-bold tracking-tight text-[#1E1B24] dark:text-[#F4F1F8] whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.brandName}
          </button>

          {/* Zone 2: 5 concise single-line text nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#575063] dark:text-[#B9B2C6]">
            <button
              type="button"
              onClick={() => navigate('hangul')}
              className={`hover:text-[#BE185D] dark:hover:text-[#F472B6] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'hangul' || activeSection === 'grammar'
                  ? 'text-[#BE185D] dark:text-[#F472B6] underline underline-offset-8'
                  : ''
              }`}
            >
              {t.navLearn}
            </button>
            <button
              type="button"
              onClick={() => navigate('vocabulary')}
              className={`hover:text-[#BE185D] dark:hover:text-[#F472B6] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'vocabulary' || activeSection === 'dialogues' || activeSection === 'listening'
                  ? 'text-[#BE185D] dark:text-[#F472B6] underline underline-offset-8'
                  : ''
              }`}
            >
              {t.navPractice}
            </button>
            <button
              type="button"
              onClick={() => navigate('topik')}
              className={`hover:text-[#BE185D] dark:hover:text-[#F472B6] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'topik' || activeSection === 'quizzes'
                  ? 'text-[#BE185D] dark:text-[#F472B6] underline underline-offset-8'
                  : ''
              }`}
            >
              {t.navExams}
            </button>
            <button
              type="button"
              onClick={() => navigate('culture')}
              className={`hover:text-[#BE185D] dark:hover:text-[#F472B6] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'culture'
                  ? 'text-[#BE185D] dark:text-[#F472B6] underline underline-offset-8'
                  : ''
              }`}
            >
              {t.navCulture}
            </button>
            <button
              type="button"
              onClick={() => navigate('tutor')}
              className={`hover:text-[#BE185D] dark:hover:text-[#F472B6] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'tutor'
                  ? 'text-[#BE185D] dark:text-[#F472B6] underline underline-offset-8'
                  : ''
              }`}
            >
              {t.navTutor}
            </button>
          </nav>

          {/* Zone 3: 1 primary action + mobile menu trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('profile')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#BE185D] hover:bg-[#9D174D] text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {user ? `${t.accountBtn} · ${profile.xp} XP` : t.signInBtn}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation"
              className="lg:hidden p-2 rounded-xl border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {moduleTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => navigate(tab.id)}
                className={`text-left px-3 py-2.5 rounded-xl text-xs font-semibold ${
                  activeSection === tab.id
                    ? 'bg-[#BE185D] text-white'
                    : 'bg-[#FCF9F6] dark:bg-[#14121B] text-[#1E1B24] dark:text-[#F4F1F8]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Workspace Sub-toolbar: Full 11-module switcher + 4-language selector + Theme toggle */}
      <div className="border-b border-[#EAE2EE] dark:border-[#2D293B] bg-white/70 dark:bg-[#171520]/80">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {moduleTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => navigate(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  activeSection === tab.id
                    ? 'bg-[#F3EAF9] dark:bg-[#2B2540] text-[#7C3AED] dark:text-[#C4B5FD] font-semibold'
                    : 'text-[#575063] dark:text-[#B9B2C6] hover:text-[#1E1B24] dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F2ECF6] dark:bg-[#1E1B29] border border-[#EAE2EE] dark:border-[#2D293B]">
              <Globe className="w-3.5 h-3.5 text-[#6B6378] dark:text-[#A49CB5] mx-1.5" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setUiLanguage(lang.code)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
                    uiLanguage === lang.code
                      ? 'bg-white dark:bg-[#2C283B] text-[#1E1B24] dark:text-[#F4F1F8] shadow-xs'
                      : 'text-[#575063] dark:text-[#B9B2C6]'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle theme"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EAE2EE] dark:border-[#2D293B] bg-white dark:bg-[#1B1924] text-xs font-medium text-[#1E1B24] dark:text-[#F4F1F8] hover:border-[#D3C2DE] cursor-pointer whitespace-nowrap shrink-0"
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              <span>{theme === 'light' ? t.themeDark : t.themeLight}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Stage */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeSection === 'overview' && <OverviewHero onNavigate={navigate} />}
            {activeSection === 'hangul' && <HangulModule />}
            {activeSection === 'grammar' && <GrammarModule />}
            {activeSection === 'vocabulary' && <VocabularyModule />}
            {activeSection === 'dialogues' && <DialoguesModule />}
            {activeSection === 'listening' && <ListeningModule />}
            {activeSection === 'topik' && <TopikModule />}
            {activeSection === 'culture' && <CultureModule />}
            {activeSection === 'quizzes' && <QuizzesModule />}
            {activeSection === 'tutor' && <TutorModule />}
            {activeSection === 'profile' && <ProfileModule />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* XP Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-5 right-5 z-40 rounded-xl bg-[#1E1B24] dark:bg-[#F4F1F8] text-white dark:text-[#121118] px-4 py-2.5 text-xs font-semibold font-mono-num shadow-lg"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#EAE2EE] dark:border-[#2D293B] bg-white/60 dark:bg-[#171520]/60 py-6">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B6378] dark:text-[#A49CB5]">
          <div>Korean Journey — 한국어 · Seoul to TOPIK II</div>
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => navigate('hangul')} className="hover:underline cursor-pointer">
              {t.modules.hangul}
            </button>
            <button type="button" onClick={() => navigate('topik')} className="hover:underline cursor-pointer">
              {t.modules.topik}
            </button>
            <button type="button" onClick={() => navigate('culture')} className="hover:underline cursor-pointer">
              {t.modules.culture}
            </button>
            <button type="button" onClick={() => navigate('tutor')} className="hover:underline cursor-pointer">
              {t.modules.tutor}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LearningProvider>
        <KoreanJourneyShell />
      </LearningProvider>
    </ErrorBoundary>
  );
}
