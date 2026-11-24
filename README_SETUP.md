# Korean Journey — 한국어: Настройка и публикация на Vercel

## 1. Архитектура проекта
- **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Motion + Lucide Icons (сборка через Vite в `dist/`).
- **Backend / API**:
  - Локально и в контейнерах: `server.ts` (Express + `@google/genai` + Vite dev middleware на порту `3000`).
  - На Vercel: Serverless Function `api/tutor.ts` для безопасного проксирования запросов к Gemini API (`gemini-4-hydrogen`).
- **Аутентификация и база данных**: Firebase Authentication (Google Sign-In) и Cloud Firestore (`firebase-applet-config.json` + `firestore.rules`).

## 2. Переменные окружения
Создайте файл `.env` локально (или задайте переменные в настройках проекта на Vercel):
- `GEMINI_API_KEY` — серверный ключ Gemini API для работы виртуального ИИ-преподавателя (`/api/tutor`). Никогда не добавляйте префикс `VITE_` к этому ключу.

## 3. Настройка Firebase для домена Vercel
1. В проекте уже настроены схема (`firebase-blueprint.json`), конфигурация (`firebase-applet-config.json`) и защищённые правила (`firestore.rules`).
2. После деплоя на Vercel откройте **Firebase Console -> Authentication -> Settings -> Authorized domains** и добавьте ваш домен `*.vercel.app` (или собственный домен), чтобы вход через Google работал в продакшене.
3. Перед публичным запуском рекомендуется дополнительно проверить правила в `firestore.rules`.

## 4. Деплой на Vercel
1. Загрузите репозиторий на GitHub / GitLab / Bitbucket.
2. Импортируйте проект в **Vercel Dashboard**.
3. Framework Preset: **Vite** (`vercel.json` уже настроен).
4. В разделе **Environment Variables** добавьте `GEMINI_API_KEY`.
5. Нажмите **Deploy**. Команда сборки `npm run build` создаст `dist/`, а `/api/tutor` автоматически развернётся как Vercel Serverless Function.

## 5. Локальный запуск
```bash
npm install
npm run dev
```
Откройте `http://localhost:3000`.
