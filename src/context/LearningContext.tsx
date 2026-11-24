import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  auth,
  BLUEPRINT_LIMITS,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import {
  DailyQuestProgress,
  DictionaryEntry,
  KoreanLevel,
  UiLanguage,
  UserProfile,
} from '../types/learning';
import { playFeedbackSound } from '../utils/audio';

function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function defaultQuestProgress(): DailyQuestProgress {
  return {
    hangulOrVocab: 0,
    grammarOrListening: 0,
    aiTutor: 0,
    quiz: 0,
  };
}

function sanitizeId(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64);
  return cleaned || `item_${Date.now()}`;
}

interface LearningContextValue {
  user: User | null;
  authReady: boolean;
  authError: string | null;
  profile: UserProfile;
  dictionary: DictionaryEntry[];
  theme: 'light' | 'dark';
  uiLanguage: UiLanguage;
  toastMessage: string | null;
  setTheme: (t: 'light' | 'dark') => void;
  setUiLanguage: (lang: UiLanguage) => void;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  awardProgress: (opts: {
    xpDelta: number;
    lessonId?: string;
    questKey?: keyof DailyQuestProgress;
    achievementHint?: string;
  }) => Promise<void>;
  updateLearnerLevel: (level: KoreanLevel, placementScore?: number) => Promise<void>;
  saveWordToDictionary: (entry: {
    idHint?: string;
    korean: string;
    transcription: string;
    translation: string;
    category: string;
    example?: string;
  }) => Promise<void>;
  toggleWordMastered: (entryId: string) => Promise<void>;
  removeWordFromDictionary: (entryId: string) => Promise<void>;
}

const DEFAULT_GUEST_PROFILE: UserProfile = {
  uid: 'guest',
  displayName: 'Guest Learner',
  email: 'guest@koreanjourney.app',
  photoURL: '',
  level: 'A1',
  xp: 25,
  streak: 1,
  lastActiveDate: getTodayDateString(),
  uiLanguage: 'ru',
  completedLessons: [],
  unlockedAchievements: [],
  dailyQuestDate: getTodayDateString(),
  dailyQuestProgress: defaultQuestProgress(),
  placementScore: 0,
};

const LearningContext = createContext<LearningContextValue | null>(null);

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('kj_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light';
  });
  const [uiLanguage, setUiLanguageState] = useState<UiLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('kj_lang') as UiLanguage | null;
      if (saved && ['ru', 'en', 'tg', 'ko'].includes(saved)) return saved;
    }
    return 'ru';
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem('kj_guest_profile');
        if (raw) {
          const parsed = JSON.parse(raw) as UserProfile;
          return { ...DEFAULT_GUEST_PROFILE, ...parsed };
        }
      } catch {
        // ignore storage parse error
      }
    }
    return DEFAULT_GUEST_PROFILE;
  });

  const [dictionary, setDictionary] = useState<DictionaryEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem('kj_guest_dictionary');
        if (raw) return JSON.parse(raw) as DictionaryEntry[];
      } catch {
        // ignore
      }
    }
    return [];
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('kj_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = uiLanguage;
    window.localStorage.setItem('kj_lang', uiLanguage);
  }, [uiLanguage]);

  // Persist guest state locally when not signed in
  useEffect(() => {
    if (!user) {
      window.localStorage.setItem('kj_guest_profile', JSON.stringify(profile));
      window.localStorage.setItem('kj_guest_dictionary', JSON.stringify(dictionary));
    }
  }, [user, profile, dictionary]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);

      if (!firebaseUser) {
        return;
      }

      const today = getTodayDateString();
      const userDocRef = doc(db, 'users', firebaseUser.uid);

      try {
        const snap = await getDoc(userDocRef);
        if (!snap.exists()) {
          const newProfile = {
            uid: firebaseUser.uid,
            displayName: (firebaseUser.displayName || 'Korean Learner').slice(0, BLUEPRINT_LIMITS.maxDisplayName),
            email: (firebaseUser.email || 'learner@koreanjourney.app').slice(0, BLUEPRINT_LIMITS.maxEmail),
            photoURL: (firebaseUser.photoURL || '').slice(0, BLUEPRINT_LIMITS.maxPhotoUrl),
            level: profile.level || 'A1',
            xp: Math.max(0, Math.round(profile.xp || 25)),
            streak: 1,
            lastActiveDate: today,
            uiLanguage,
            completedLessons: (profile.completedLessons || []).slice(0, BLUEPRINT_LIMITS.maxCompletedLessons),
            unlockedAchievements: (profile.unlockedAchievements || []).slice(0, BLUEPRINT_LIMITS.maxAchievements),
            dailyQuestDate: today,
            dailyQuestProgress:
              profile.dailyQuestDate === today ? profile.dailyQuestProgress : defaultQuestProgress(),
            placementScore: Math.min(10, Math.max(0, profile.placementScore || 0)),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(userDocRef, newProfile);
        } else {
          const data = snap.data() as UserProfile;
          if (data.lastActiveDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yStr = yesterday.toISOString().slice(0, 10);
            const nextStreak = data.lastActiveDate === yStr ? (data.streak || 1) + 1 : 1;
            await updateDoc(userDocRef, {
              lastActiveDate: today,
              streak: nextStreak,
              dailyQuestDate: today,
              dailyQuestProgress: defaultQuestProgress(),
              updatedAt: serverTimestamp(),
            });
          }
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscribe to Firestore profile & dictionary once authenticated
  useEffect(() => {
    if (!authReady || !user) return;

    const profilePath = `users/${user.uid}`;
    const unsubProfile = onSnapshot(
      doc(db, 'users', user.uid),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as UserProfile;
          setProfile(data);
          if (data.uiLanguage && ['ru', 'en', 'tg', 'ko'].includes(data.uiLanguage)) {
            setUiLanguageState(data.uiLanguage);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, profilePath);
      }
    );

    const dictPath = `users/${user.uid}/dictionary`;
    const dictQuery = query(collection(db, 'users', user.uid, 'dictionary'), where('userId', '==', user.uid));
    const unsubDict = onSnapshot(
      dictQuery,
      (snapshot) => {
        const items: DictionaryEntry[] = snapshot.docs.map((d) => d.data() as DictionaryEntry);
        setDictionary(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, dictPath);
      }
    );

    return () => {
      unsubProfile();
      unsubDict();
    };
  }, [authReady, user]);

  const setTheme = (t: 'light' | 'dark') => setThemeState(t);

  const setUiLanguage = (lang: UiLanguage) => {
    setUiLanguageState(lang);
    setProfile((prev) => ({ ...prev, uiLanguage: lang }));
    if (user) {
      updateDoc(doc(db, 'users', user.uid), {
        uiLanguage: lang,
        updatedAt: serverTimestamp(),
      }).catch((err) => handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`));
    }
  };

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      playFeedbackSound('success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google Sign-In failed.';
      setAuthError(msg);
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
    setProfile(DEFAULT_GUEST_PROFILE);
    setDictionary([]);
  };

  const computeNextAchievements = (
    nextXp: number,
    nextLessons: string[],
    nextDictLen: number,
    currentAchievements: string[],
    hint?: string
  ): string[] => {
    const set = new Set(currentAchievements);
    if (nextXp >= 200) set.add('xp_200');
    if (nextLessons.some((l) => l.startsWith('hangul'))) set.add('first_hangul');
    if (nextLessons.some((l) => l.startsWith('g_'))) set.add('grammar_builder');
    if (nextDictLen >= 3) set.add('vocab_collector');
    if (hint) set.add(hint);
    return Array.from(set).slice(0, BLUEPRINT_LIMITS.maxAchievements);
  };

  const awardProgress: LearningContextValue['awardProgress'] = async ({
    xpDelta,
    lessonId,
    questKey,
    achievementHint,
  }) => {
    const today = getTodayDateString();
    const nextXp = Math.min(10000000, (profile.xp || 0) + Math.max(0, Math.round(xpDelta)));
    const nextLessons =
      lessonId && !profile.completedLessons.includes(lessonId)
        ? [...profile.completedLessons, lessonId.slice(0, 64)].slice(0, BLUEPRINT_LIMITS.maxCompletedLessons)
        : profile.completedLessons;

    const currentQuests =
      profile.dailyQuestDate === today ? profile.dailyQuestProgress : defaultQuestProgress();
    const nextQuests: DailyQuestProgress = { ...currentQuests };
    if (questKey) {
      nextQuests[questKey] = Math.min(1000, (nextQuests[questKey] || 0) + 1);
    }

    const nextAchievements = computeNextAchievements(
      nextXp,
      nextLessons,
      dictionary.length,
      profile.unlockedAchievements,
      achievementHint
    );

    if (xpDelta > 0) {
      playFeedbackSound('xp');
      showToast(`+${xpDelta} XP`);
    }

    if (!user) {
      setProfile((prev) => ({
        ...prev,
        xp: nextXp,
        completedLessons: nextLessons,
        unlockedAchievements: nextAchievements,
        dailyQuestDate: today,
        dailyQuestProgress: nextQuests,
        lastActiveDate: today,
      }));
      return;
    }

    const path = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        xp: nextXp,
        completedLessons: nextLessons,
        unlockedAchievements: nextAchievements,
        dailyQuestDate: today,
        dailyQuestProgress: nextQuests,
        lastActiveDate: today,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const updateLearnerLevel = async (level: KoreanLevel, placementScore?: number) => {
    const score = typeof placementScore === 'number' ? Math.min(10, Math.max(0, Math.round(placementScore))) : profile.placementScore;
    const nextAchievements = computeNextAchievements(
      profile.xp + 30,
      profile.completedLessons,
      dictionary.length,
      profile.unlockedAchievements,
      'topik_challenger'
    );
    playFeedbackSound('success');
    showToast(`${level} · +30 XP`);

    if (!user) {
      setProfile((prev) => ({
        ...prev,
        level,
        placementScore: score,
        xp: prev.xp + 30,
        unlockedAchievements: nextAchievements,
      }));
      return;
    }

    const path = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        level,
        placementScore: score,
        xp: (profile.xp || 0) + 30,
        unlockedAchievements: nextAchievements,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const saveWordToDictionary: LearningContextValue['saveWordToDictionary'] = async (entry) => {
    const entryId = sanitizeId(entry.idHint || `w_${entry.korean}_${Date.now()}`);
    const normalized: DictionaryEntry = {
      id: entryId,
      userId: user ? user.uid : 'guest',
      korean: entry.korean.trim().slice(0, BLUEPRINT_LIMITS.maxKoreanWord),
      transcription: (entry.transcription || '').trim().slice(0, BLUEPRINT_LIMITS.maxTranscription),
      translation: entry.translation.trim().slice(0, BLUEPRINT_LIMITS.maxTranslation),
      category: (entry.category || 'general').trim().slice(0, BLUEPRINT_LIMITS.maxCategory),
      example: (entry.example || '').trim().slice(0, BLUEPRINT_LIMITS.maxExample),
      mastered: false,
    };

    if (!normalized.korean || !normalized.translation) return;

    playFeedbackSound('success');
    showToast(`${normalized.korean} · +5 XP`);

    if (!user) {
      setDictionary((prev) => {
        const exists = prev.some((w) => w.id === entryId || w.korean === normalized.korean);
        if (exists) return prev;
        return [normalized, ...prev];
      });
      await awardProgress({ xpDelta: 5, questKey: 'hangulOrVocab' });
      return;
    }

    const path = `users/${user.uid}/dictionary/${entryId}`;
    try {
      await setDoc(doc(db, 'users', user.uid, 'dictionary', entryId), {
        ...normalized,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await awardProgress({
        xpDelta: 5,
        questKey: 'hangulOrVocab',
        achievementHint: dictionary.length + 1 >= 3 ? 'vocab_collector' : undefined,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const toggleWordMastered = async (entryId: string) => {
    const target = dictionary.find((d) => d.id === entryId);
    if (!target) return;
    const nextVal = !target.mastered;

    if (!user) {
      setDictionary((prev) => prev.map((d) => (d.id === entryId ? { ...d, mastered: nextVal } : d)));
      return;
    }

    const path = `users/${user.uid}/dictionary/${entryId}`;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'dictionary', entryId), {
        mastered: nextVal,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const removeWordFromDictionary = async (entryId: string) => {
    if (!user) {
      setDictionary((prev) => prev.filter((d) => d.id !== entryId));
      return;
    }

    const path = `users/${user.uid}/dictionary/${entryId}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'dictionary', entryId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const value = useMemo<LearningContextValue>(
    () => ({
      user,
      authReady,
      authError,
      profile,
      dictionary,
      theme,
      uiLanguage,
      toastMessage,
      setTheme,
      setUiLanguage,
      signInWithGoogle,
      signOutUser,
      awardProgress,
      updateLearnerLevel,
      saveWordToDictionary,
      toggleWordMastered,
      removeWordFromDictionary,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, authReady, authError, profile, dictionary, theme, uiLanguage, toastMessage]
  );

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const ctx = useContext(LearningContext);
  if (!ctx) throw new Error('useLearning must be used inside LearningProvider');
  return ctx;
}
